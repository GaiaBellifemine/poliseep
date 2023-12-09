import {db, storage} from '../firebaseConfig.js';
import {ref, child, get, query, equalTo, orderByChild, set, update, push} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import {uploadBytes, ref as sRef, getDownloadURL, deleteObject, listAll, getMetadata} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';

if (localStorage.getItem("email") === null) {
    window.location.href = "/poliseep";
}

const dbRef = ref(db);
let email = localStorage.getItem("email"); 
let username=email.split("@")[0].replace(".","");

window.onload = function(){
    let type = getLoggedType(username);
    if(type==="STU") window.location.href = "/poliseep/student/student.html"; //Pagina student ancora da fare

    setFullname("username", email);
    updatePic();
    showCourses(username);
    getCountCourses(username);
    getEnrolledStudents(username);
    getLoadedQuiz(username);
    printGraph();
};

async function setFullname(id, username){
    const snapshot=await get(query(ref(db, "UsersList"), orderByChild("email"), equalTo(email)));
    let name="";
    snapshot.forEach(element => {
        name=element.val().fullname;
    });
    name=capitalize(name);
    if(id==="username")
        document.getElementById(id).innerHTML = name;
    else if(id==="professor") {
        document.getElementById(id).disabled = true;
        document.getElementById(id).value = name;
    }
}

async function getLoggedType(username) {
    const snapshot=await get(query(ref(db, "UsersList"), orderByChild("email"), equalTo(email)));
    let type="";
    snapshot.forEach(element => {
        type=element.val().tipo;
    });
    return type;
}

async function getCountCourses(username) {
    get(child(dbRef, "UsersList/"+username+"/Courses")).then((snapshot) => {
        let count=0;
        snapshot.forEach(function() {
            count++;
        });
        //La classe di your_courses deve essere unica. Lo 0 sta perchè è univoca. Va fatto perché il css è stilizzato in base all'id
        document.getElementsByClassName('your_courses')[0].innerHTML = count;
    });
}

async function getEnrolledStudents(username) {
    let count=0;
    let name = get(child(dbRef, "UsersList/"+username)).then((snapshot) => {
        name=snapshot.val().fullname+" "; //Viene inserito uno spazio a fine chiave
    }).then(()=> {
        get(child(dbRef, "Courses")).then((snapshot) => {
            for(let course in snapshot.val()) {
                get(child(dbRef, "Courses/"+course+"/Professor/"+username)).then((s) => {
                    if(s.exists()) {
                        get(child(dbRef, "Courses/"+course+"/Student")).then((snap) => {
                            snap.forEach(function() {
                                count++;
                                //La classe di your_courses deve essere unica. Lo 0 sta perchè è univoca. Va fatto perché il css è stilizzato in base all'id
                                document.getElementsByClassName('enrolled_students')[0].innerHTML = count;
                            });
                        });
                    }
                });
            }
        });
    });
}

function getLoadedQuiz(username) {
    let count=0;
    
    get(child(dbRef, "UsersList/"+username+"/Courses/")).then((snapshot) =>{
        for(let course in snapshot.val()){
            get(child(dbRef, "UsersList/"+username+"/Courses/"+course+"/Quiz")).then((snap) =>{
                if(snap.exists()){
                    snap.forEach(function() {
                        count++;
                        document.getElementsByClassName('loaded_quiz')[0].innerHTML = count;
                        console.log(count);
                    });
                }
                else {
                    document.getElementsByClassName('loaded_quiz')[0].innerHTML = count;
                }
            });
        }
    });
}

async function showCourses(username) {
    const snapshot=await get(query(ref(db, "UsersList/"+username+"/Courses")));
    snapshot.forEach(element => {
        getDownloadURL(sRef(storage, element.val().img_url)).then((url) => {
            document.getElementById("ccardbox").innerHTML += `
            <div class="dcard">
                <a href="courses_teacher.html?course_name=`+element.val().course_name+`">
                    <div class="fpart"><img src="`+url+`"></div>
                    <div class="spart">`+element.val().course_name+`</div>
                </a>
            </div>
            `;
        });
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

//Funzione da conservare per query rimozione
/*function updateProfilePic() {
    const dirToUpdate = sRef(storage, 'Profile/'+username);
    listAll(dirToUpdate).then((res) => {
        res.items.forEach((itemRef) => {
            getMetadata(itemRef).then((metadata) => {
                let img = sRef(storage, 'Profile/'+username+"/"+metadata.name);
                getDownloadURL(img).then((url) => {
                    document.getElementById("photo").src=url;
                    $( "#photo" ).load(window.location.href + " #photo" );
                })
            })
        })
    })
}*/

/*-------------------NUOVO CORSO----------------------*/
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

document.getElementById('insert_course').addEventListener("click", function(e) {
    setFullname("professor", username);
});

document.getElementById('form_course').addEventListener("click", function() {
    let course_name=document.getElementById('course_name');                     
    let cfu=document.getElementById('cfu');                               
    let course_goals=document.getElementById('course_goals');                   //Optional
    let num_ch=document.getElementById('num_ch');                               //Optional
    let brief_description=document.getElementById('brief_description');         //Optional
    let learning_verification=document.getElementById('learning_verification'); //Optional
    let f=getFile();                                                            
    let email = localStorage.getItem("email"); 
    let username=email.split("@")[0].replace(".","");

    if(!validateCourse(course_name, cfu, f)) {
        document.getElementById("error_div").innerHTML = "Check required fields."
        
        if(course_name.value=="")
            document.getElementById('course_name').style.background="#FFCCCB";
        if(cfu.value=="")
            document.getElementById('cfu').style.background="#FFCCCB";
        if(isEmpty(f))
            alert("Image file is mandatory.")
        return;
    }
    
    const storo = sRef(storage, 'CoursesImages/'+f.name);
    uploadBytes(storo, f).then(() => {

        get(child(dbRef, 'UsersList/'+username+"/Courses/"+course_name.value)).then((snaphot) => {
            //Se il corso esiste già, non lo aggiungo nell'elenco corsi
            if(!snaphot.exists()) {
                let r=ref(db, 'UsersList/'+username+"/Courses/"+course_name.value);
                let newPostRef=set(r, {
                    course_name: course_name.value,
                    cfu: cfu.value,
                    professor: professor.value,
                    course_goals: course_goals.value,
                    num_ch: num_ch.value,
                    brief_description: brief_description.value,
                    learning_verification: learning_verification.value,
                    img_url: "CoursesImages/"+f.name
                }).then(() => {
                    
                    get(child(dbRef, "Courses/"+course_name.value)).then((snaphot) => {
                        //Se il corso esiste già, non lo aggiungo nell'elenco corsi
                        if(!snaphot.exists()) {
                            r=ref(db, 'Courses/'+course_name.value);
                            set(r, {
                                course_name: course_name.value,
                                img_url: "CoursesImages/"+f.name
                            });
                            r=ref(db, 'Courses/'+course_name.value+'/Professor/'+username);
                            set(r, {
                                professor: professor.value,
                                email: email
                            });
                        }
                        else {
                            r=ref(db, 'Courses/'+course_name.value+'/Professor/'+username);
                            set(r, {
                                professor: professor.value,
                                email: email
                            });
                        }
                        location.reload();
                    });
                });
            }
            else {
                alert("This course is already existing.");
            }
        });
    });
});

function isEmpty(str) {
    return str===null;
}

function validateCourse(course_name, cfu, f) {
    if(isEmpty(course_name)
        ||isEmpty(cfu)
        ||isEmpty(f)) {
            return false;
    } else {
        return true;
    }
}

async function getCourses()
{
    var xValues = [];

    await get(child(dbRef, 'UsersList/'+username+"/Courses/")).then((snaphot) => {
        for(let course in snaphot.val())
        {
            xValues.push(course);
        }
    });

    return xValues;
}



// gestione grafico
async function printGraph()
{
    //var xValues = ["Databases", "OS", "IoT","ML"];

    var xValues = await getCourses(); // recupero i corsi del DOC
    var dataNew = [];
    var dataNewNo = [];
    var contaStu = 0;
    var contaStuNo = 0;

    for(let course of xValues)
    {
        contaStu = await getCompletedCourses(course);
        dataNew.push(contaStu[0]);
        dataNewNo.push(contaStu[1]);
        console.log(course, contaStu);
    }

			new Chart("myChart", {
				type: "bar",
				data: {
					labels: xValues,
					datasets: [{
									label: "STUDENTS THAT HAVE COMPLETED THE COURSE",
									backgroundColor: "#4BB377",
									data: dataNew
								}, {
									label: "STUDENTS THAT HAVEN'T COMPLETED THE COURSE",
									backgroundColor: "#004A86",
									data: dataNewNo
								}]
						},
				options: {
					legend: {display: false},
					title: {
					display: true,
					text: "TOTAL COMPLETED QUIZZES"
					}
				}
				});
}

async function getCompletedCourses(course) {

    // user = studente
    // username = docente

    var countAnsweredQuiz = 0;
    var countTotQuiz = 0;
    var countTotCoursesCompleted = 0;
    var countTotCourses = 0;
    var contaStudente = 0;
    var contaStudenteNo = 0;
    var quizCompleted = [];
    var quizzes = [];

    await get(child(dbRef, "UsersList/")).then(async (snapshot) => {
        for(let user in snapshot.val())
        {
            await get(child(dbRef, "UsersList/"+user)).then(async (snapshot) => {
                if(snapshot.val().tipo=="STU")
                {
                    await get(child(dbRef, "UsersList/"+user+"/Courses/"+course)).then(async (snapshot) => {
                        if(snapshot.exists())
                        {
                            await get(child(dbRef, "UsersList/"+username+"/Courses/"+course+"/Quiz")).then(async (snapshot) => {
                        
                                for(let quiz in snapshot.val())
                                {
                                    if(quiz!==undefined && (!quizCompleted.includes(quiz))) {
                                        if(!quizzes.includes(quiz)) {
                                            countTotQuiz++;
                                            quizzes.push(quiz);
                                        }
                                        await get(child(dbRef, "UsersList/"+username+"/Courses/"+course+"/Quiz/"+quiz+"/Question 1/"+user)).then((snapshot) => {
                                            if(snapshot.exists())
                                            {
                                                quizCompleted.push(quiz);
                                                countAnsweredQuiz++;
                                            }
                                        });
                                    }
                                }
                                if(countAnsweredQuiz>=countTotQuiz)
                                {
                                    contaStudente++;
                                }
                                else
                                {
                                    contaStudenteNo++;
                                }
                            });
                        }
                    });
                }
            });
            quizCompleted=[];
            countTotQuiz=0;
        }
    });

    return [contaStudente, contaStudenteNo];
}
