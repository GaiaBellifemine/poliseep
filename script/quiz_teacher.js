import {db, storage} from '../firebaseConfig.js';
import {ref, child, get, query, equalTo, orderByChild, set, update, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import {uploadBytes, ref as sRef, getDownloadURL, deleteObject, listAll, getMetadata} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';

window.submitQuiz=submitQuiz;
window.viewSingleQuiz=viewSingleQuiz;
window.deleteQuiz = deleteQuiz;

let get_str = window.location.search.substring(1);
let course_name = getCourseName(get_str);

if (localStorage.getItem("email") === null) {
    window.location.href = "/poliseep";
}

const dbRef = ref(db);
let email = localStorage.getItem("email");
let username=email.split("@")[0].replace(".","");

window.onload = function(){
    localStorage.removeItem("createQuiz");
    let type = getLoggedType(username);
    if(type==="STU") window.location.href = "/poliseep/student/student.html"; //Pagina student ancora da fare

    document.getElementById("href_file").href+="?"+get_str;
    document.getElementById("href_chat").href+="?"+get_str;
    document.getElementById("href_info").href+="?"+get_str;
    document.getElementById("url_file").href+="?"+get_str;
    document.getElementById("url_chat").href+="?"+get_str;
    document.getElementById("url_info").href+="?"+get_str;

    getQuizList();
};

window.onbeforeunload = function() {
    if(localStorage.getItem("createQuiz")=="true")
        return "Are you sure you want to leave?"; //Il messaggio non viene mostrato, serve solo restituire una stringa
}

async function getLoggedType(username) {
    const snapshot=await get(query(ref(db, "UsersList"), orderByChild("email"), equalTo(email)));
    let type="";
    snapshot.forEach(element => {
        type=element.val().tipo;
    });
    return type;
}

function getCourseName(str) {
    //Se il nome del corso contiene spazi, nell'url gli spazi saranno convertiti in %20 e gli ' con %27
    str=str.split("=")[1].replace(new RegExp("%20", "g"), ' ');
    str=str.replace(new RegExp("%27", "g"), "'");
    return str;
}

document.getElementById("addButton").addEventListener("click", function(){
    localStorage.setItem("createQuiz", true);
});

function getQuizList(){
    get(child(dbRef, "UsersList/"+username+"/Courses/"+course_name+"/Quiz")).then((snapshot) => {
        for(let quiz in snapshot.val()) {
            var quizEscaped = quiz.replace("'", "&prime;");
            var onclick = `viewSingleQuiz('${quizEscaped}');`;
           // onclick=quiz.replace("'", "&apos;");
            document.getElementById("ul_left").innerHTML+=`<li
            onclick="${onclick}">
            ${quiz}</li>`;
        }
    });
}

function viewSingleQuiz(quiz){
    if(localStorage.getItem("createQuiz")=="true")
        if(!confirm("Are you sure you want to exit this page?"))
            return false;
        else localStorage.removeItem("createQuiz");

    document.querySelector("#quiz3 .container").innerHTML = "";
    document.querySelector("#quiz3 .container").innerHTML += `<button class="decline-button" value="${quiz}" onclick="deleteQuiz('${quiz}')" id="deleteButton">Delete Quiz</button><br><br><br>`;
    document.getElementById('quiz3').style.display='block'; document.getElementById('noquiz').style.display='none'; document.getElementById('newquiz').style.display='none';
    get(child(dbRef, "UsersList/"+username+"/Courses/"+course_name+"/Quiz/"+quiz)).then((snapshot) => {
        document.getElementById("quiz_name").innerHTML=snapshot.val().quiz_name;
        document.getElementById("quiz_desc").innerHTML=snapshot.val().quiz_desc;

        for(let question in snapshot.val()) {
            if(question.includes("Question")) { //Filtro solo le domande
                let number = question.split(" ")[1];
                get(child(dbRef, "UsersList/"+username+"/Courses/"+course_name+"/Quiz/"+quiz+"/"+question)).then((snap) => {
                    document.querySelector("#quiz3 .container").innerHTML+=`
                        <section class="wrong_section" id="p${number}">
                            <h3>${number} - ${snap.val().question}</h3>
                        </section>
                    `;

                    for(let answer in snap.val()) {
                        if(answer.includes("Answer")) {
                            get(child(dbRef, "UsersList/"+username+"/Courses/"+course_name+"/Quiz/"+quiz+"/"+question+"/"+answer)).then((snap1) => {
                                if(snap1.val().checked===false) {
                                    document.querySelector("#quiz3 .container #p"+number).innerHTML+=`
                                        <label class="wrong_label">
                                            ${snap1.val().answer}
                                            <br><br>Explanation: ${snap1.val().explain}
                                        </label>
                                    `;
                                } else {
                                    document.querySelector("#quiz3 .container #p"+number).innerHTML+=`
                                        <label class="right_label">
                                            ${snap1.val().answer}
                                        </label>
                                    `;
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

async function submitQuiz(){
    var quizName = document.getElementById("namequiz").value;
    var quizDesc = document.getElementById("descriptionquiz").value;
    var quizChap = document.getElementById("chapterquiz").value;
    let capitolo = "Chapter "+quizChap+" - "+quizName;

    var container_div = document.getElementById('questions');
    var count = container_div.getElementsByTagName('section').length;

    var ret=false;

    if(count===0) {
        alert("You must insert at least one question");
        return false;
    }

    await get(child(dbRef, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo)).then(async (snaphot) => {
        let r=await ref(db, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo);
        await set(r, {
            quiz_name: quizName,
            quiz_desc: quizDesc,
            quiz_chapter: quizChap.slice(7, quizChap.length)
        });
    }).then(async() => {
        ret=false;
        for(let i=1; i<=count; i++){ // n° quesiti
            var questionType = document.querySelector("#d"+i+" .first2 #wrapper2 #questiontype").value;

            switch(questionType)
            {
                case "radioquestion":
                    var nanswerssaq = document.querySelector("#d"+i+" #saq #nanswerssaq").value;

                    for(let j=1; j<=nanswerssaq; j++){ // n° affermazioni del quesito
                        // chiamata al DB
                        await get(child(dbRef, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo+"/Question "+i)).then(async (snap) => {
                            let r1=await ref(db, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo+"/Question "+i);
                            await update(r1, {
                                question: document.querySelector("#d"+i+" .first2 #wrapper1 #question").value,
                                questionType: questionType
                            }).then(async ()=>{
                                let r2=await ref(db, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo+"/Question "+i+"/Answer "+j);
                                await set(r2, {
                                    answer: document.querySelector("#d"+i+" #saq .vanswers #answer"+j).value,
                                    checked: document.querySelector("#d"+i+" #saq .vanswers #check"+j).checked,
                                    explain: document.querySelector("#d"+i+" #saq .vanswers #explain"+j).value
                                });
                            });
                        });
                    }
                break;

                case "checkboxquestion":
                    var nanswersmaq = document.querySelector("#d"+i+" #maq #nanswersmaq").value;

                    for(let j=1; j<=nanswersmaq; j++){ // n° affermazioni del quesito
                        // chiamata al DB
                        await get(child(dbRef, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo+"/Question "+i)).then(async (snap) => {
                            let r1=ref(db, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo+"/Question "+i);
                            await update(r1, {
                                question: document.querySelector("#d"+i+" .first2 #wrapper1 #question").value,
                                questionType: questionType
                            }).then(async ()=> {
                                let r2=ref(db, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo+"/Question "+i+"/Answer "+j);
                                await set(r2, {
                                    answer: document.querySelector("#d"+i+" #maq .vanswers #answer"+j).value,
                                    checked: document.querySelector("#d"+i+" #maq .vanswers #check"+j).checked,
                                    explain: document.querySelector("#d"+i+" #maq .vanswers #explain"+j).value
                                });
                            });
                        });
                    }
                break;

                case "rispaperta":
                    await get(child(dbRef, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo+"/Question "+i)).then(async (snap) => {
                        let r1=ref(db, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo+"/Question "+i);
                        await set(r1, {
                            question: document.querySelector("#d"+i+" .first2 #wrapper1 #question").value,
                            questionType: questionType
                        }).then(async()=> {
                            let r2=ref(db, 'UsersList/'+username+"/Courses/"+course_name+"/Quiz/"+capitolo+"/Question "+i+"/Answer 1");
                            await set(r2, {
                                answer: document.querySelector("#d"+i+" #oq .explainopen #explain1").value
                            });
                        });
                    });
                break;

                default:
                    alert("Select the question type!");
                    ret=true;
                break;
            }
        }
    });
    if(ret)
        return false;
    else return true;
}

document.getElementById("confirm").addEventListener("click", async function(e) {
    await submitQuiz().then((ret)=> {
        if(ret!==false) {
            alert('Quiz created');
            window.location.reload();
        }
    })
});

function deleteQuiz(quiz){
    quiz = quiz.replace("′", "'");
    let r = ref(db, "UsersList/"+username+"/Courses/"+course_name+"/Quiz/"+quiz);
    remove(r).then(()=>{
        alert('Quiz "' + quiz +'" deleted');
        window.location.reload();
    });
}



