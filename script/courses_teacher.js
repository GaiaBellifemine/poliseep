import {db, storage} from '../firebaseConfig.js';
import {ref, child, get, query, equalTo, orderByChild, set, update, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import {uploadBytes, ref as sRef, getDownloadURL} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';

window.managePending=managePending;

if (localStorage.getItem("email") === null) {
    window.location.href = "/poliseep";
}

const dbRef = ref(db);
let email = localStorage.getItem("email"); 
let username=email.split("@")[0].replace(".","");

window.onload = function(){
    let type = getLoggedType(username);
    if(type==="STU") window.location.href = "/poliseep/student/student.html"; //Pagina student ancora da fare

    let get_str = window.location.search.substring(1);
    console.log(getCourseName(get_str));
    document.getElementById("href_file").href+="?"+get_str;
    document.getElementById("href_chat").href+="?"+get_str;
    document.getElementById("href_quiz").href+="?"+get_str;
    document.getElementById("url_file").href+="?"+get_str;
    document.getElementById("url_chat").href+="?"+get_str;
    document.getElementById("url_quiz").href+="?"+get_str;
    printData(username, getCourseName(get_str));
    updatePic();
    getEnrolledStudents(username, getCourseName(get_str));
};

async function printData(username, course_name) {
    get(child(dbRef, "UsersList/"+username+"/Courses/"+course_name)).then((snapshot) => {
        document.getElementById("course_name").innerHTML = capitalize(snapshot.val().course_name);
        document.getElementById("cfu").innerHTML = snapshot.val().cfu;
        document.getElementById("professor").innerHTML = capitalize(snapshot.val().professor);
        if(snapshot.val().course_goals==="")
            document.getElementById("course_goals").innerHTML = "Course goals for this course are still not available.";
        else
            document.getElementById("course_goals").innerHTML = snapshot.val().course_goals;
        
        if(snapshot.val().brief_description==="")
            document.getElementById("course_desc").innerHTML = "Description for this course is still not available.";
        else
            document.getElementById("course_desc").innerHTML = snapshot.val().brief_description;

        if(snapshot.val().learning_verification==="")
            document.getElementById("learning_verification").innerHTML = "Learning verification for this course is still not available.";
        else
            document.getElementById("learning_verification").innerHTML = snapshot.val().learning_verification;

        getDownloadURL(sRef(storage, snapshot.val().img_url)).then((url) => {
            document.getElementById("img_url").src = url;
        });    
    });
}

async function getEnrolledStudents(username, course_name){
    let count = 0;
    get(child(dbRef, "UsersList")).then((snapshot) => {
        for(let user in snapshot.val()) {
            get(child(dbRef, "UsersList/"+user)).then((snap) => {
                if(snap.val().tipo==="STU") {
                    get(child(dbRef, "UsersList/"+user+"/Courses/"+course_name)).then((course) => {
                        if(course.exists() && course.val().teacher===username) {
                            count++;
                            document.getElementById("stuNum").innerHTML=count;
                        }
                        else{
                            document.getElementById("stuNum").innerHTML=count;
                        }
                    });
                }
            });
        }
    });
}

/*------------------CAMBIO IMMAGINE PROFILO-----------*/
document.getElementById('file').addEventListener("change", function(e) {
    let img = e.target.files[0];
    const storo = sRef(storage, 'Profile/'+username+"/"+img.name); 

    uploadBytes(storo, img).then(() => {
        let r=ref(db, 'UsersList/'+username);
        update(r, {
            profile_pic: 'Profile/'+username+"/"+img.name
        });
    });
});

async function updatePic() {
    const snapshot=await get(query(ref(db, "UsersList"), orderByChild("email"), equalTo(email)));
    let path="";
    snapshot.forEach(element => {
        path=element.val().profile_pic;
    });

    let img = sRef(storage, path);
    getDownloadURL(img).then((url) => {
        document.getElementById("photo").src=url;
        $( "#photo" ).load(window.location.href + " #photo" );
    });
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

/*-------------EDIT COURSE INFO------------------*/
let file=null;

function setFile(f) {
    file=f;
}

function getFile(){
    return file;
}

//Quando clicco su "Choose course image", cambia il riferimento del file
document.getElementById('upload_img_btn').addEventListener("change", function(e) {
    file=e.target.files[0];
    setFile(file);
});

document.getElementById("form_course").addEventListener("click", function() {
    let get_str = window.location.search.substring(1);
    let f=getFile();  
    let r=ref(db, 'UsersList/'+username+"/Courses/"+getCourseName(get_str));

    if(document.getElementById("cfu_form").value!=='') {
        update(r, {
            cfu: document.getElementById("cfu_form").value
        });
    }
    if(document.getElementById("obiettivoCorso").value!=='') {
        update(r, {
            course_goals: document.getElementById("obiettivoCorso").value
        });
    }
    if(document.getElementById("descrizioneCorso").value!=='') {
        update(r, {
            brief_description: document.getElementById("descrizioneCorso").value
        });
    }
    if(document.getElementById("verificaCorso").value!=='') {
        update(r, {
            learning_verification: document.getElementById("verificaCorso").value
        });
    }
    if(f!==null) {
        const storo = sRef(storage, 'CoursesImages/'+f.name);
        uploadBytes(storo, f).then(() => {
            update(r, {
                img_url: "CoursesImages/"+f.name
            }).then(() => {
                location.reload();
            });
        });
    } else location.reload();
});

document.getElementById("btn1").addEventListener("click", async function(){
    let get_str = window.location.search.substring(1);

    await get(child(dbRef, 'UsersList/'+username+"/Courses/"+getCourseName(get_str))).then((snapshot) => {
        $('input:text[id="course_name"]').attr('placeholder',snapshot.val().course_name);
        $('input[id="cfu_form"]').attr('placeholder',snapshot.val().cfu);

        var course_goals = snapshot.val().course_goals;
        if(course_goals!=="") {
            $('textarea[id="obiettivoCorso"]').text(course_goals);
        }
        else {
            $('textarea[id="obiettivoCorso"]').attr("placeholder", "Insert course goals");
        }

        var brief_description = snapshot.val().brief_description;
        if(brief_description !== "") {
            $('textarea[id="descrizioneCorso"]').text(brief_description);
        }
        else {
            $('textarea[id="descrizioneCorso"]').attr("placeholder", "Insert a brief description of the course");
        }
        

        var learning_verification = snapshot.val().learning_verification;
        if(learning_verification !== "") {
            $('textarea[id="verificaCorso"]').text(learning_verification);
        }
        else {
            $('textarea[id="verificaCorso"]').attr("placeholder","Insert learning verification");
        }
    });
});

/*MOSTRA ISCRIZIONE AL CORSO IN STATO PENDING DEGLI STUDENTI*/

async function managePending() {
    toggleModal();
    document.getElementById("liststu").innerHTML = '';
    let get_str = window.location.search.substring(1);
    let course_name = getCourseName(get_str);
    let i=1; //Importante per la selezione della checkbox
    //Riconverto il nome del corso sostituendo i - con '
    const snapshot=await get(query(ref(db, "UsersList/"+username+"/Courses/"+course_name+"/Pending")));

    snapshot.forEach(element => {
      //  console.log(element.val().student);
       
        get(child(dbRef, "UsersList/"+element.val().student)).then((snap) => {
            //snaphot=risultato ricerca. Se l'email esiste gia' nel db, l'utente esiste
            if(snap.exists()) {
                document.getElementById("liststu").innerHTML += `
                    <input class = 'cb' username='${element.val().student}' email='${element.val().email}' chkPending='checkbox' type='checkbox' id='stud${i}' name='stud${i}'>
                    <label for='stud${i}'>${snap.val().fullname}</label>`;
                i++;
            }
        });
    }); 
}



/*ACCETTA STUDENTI AL CORSO*/
document.getElementById("acceptBTN").addEventListener("click", ()=>{
    let get_str = window.location.search.substring(1);
    let course_name = getCourseName(get_str);
    let checkedBoxes = document.querySelectorAll('input[chkPending=checkbox]:checked');
    //console.log(checkedBoxes);
    checkedBoxes.forEach(function(elem){
        let student = elem.getAttribute("username");
        let student_mail = elem.getAttribute("email");
        let r=ref(db, "Courses/"+course_name+"/Student/"+student);   
        set(r, {
            username: student,
            email: student_mail
        }).then(()=>{
            r=ref(db, "UsersList/"+username+"/Courses/"+course_name+"/Pending/"+student);
            remove(r).then(()=>{
                let imgPath = "";
                get(child(dbRef, "Courses/"+course_name)).then((snap) => {
                    //snaphot=risultato ricerca. Se l'email esiste gia' nel db, l'utente esiste
                    if(snap.exists()) {
                        imgPath = snap.val().img_url;
                        console.log(imgPath);
                    }
                }).then(()=>{
                    r=ref(db, 'UsersList/'+student+"/Courses/"+course_name);
                    set(r, {
                        course_name: course_name,
                        img_url: imgPath,
                        teacher: username
                    }).then(()=>{
                        alert("Student(s) request accepted. ");
                        toggleModal();
                        window.location.reload();
                    });
                });
            });
        });
    })
})

/*RIFIUTA STUDENTI AL CORSO*/
document.getElementById("declineBTN").addEventListener("click", ()=>{
    let get_str = window.location.search.substring(1);
    let course_name = getCourseName(get_str);
    let checkedBoxes = document.querySelectorAll('input[chkPending=checkbox]:checked');
    //console.log(checkedBoxes);
    checkedBoxes.forEach(function(elem){
        let student = elem.getAttribute("username");
        let student_mail = elem.getAttribute("email");
        let r=ref(db, "UsersList/"+username+"/Courses/"+course_name+"/Pending/"+student);
        remove(r).then(()=>{
            alert("Student(s) request declined. ");
            toggleModal();
        });
    });
})
