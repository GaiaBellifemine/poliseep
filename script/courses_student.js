import {db, storage} from '../firebaseConfig.js';
import {ref, child, get, query, equalTo, orderByChild, set, update, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import {uploadBytes, ref as sRef, getDownloadURL} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';

if (localStorage.getItem("email") === null) {
    window.location.href = "/poliseep";
}

const dbRef = ref(db);
let email = localStorage.getItem("email"); 
let username=email.split("@")[0].replace(".","");

window.onload = function(){
    let type = getLoggedType(username);
    if(type==="DOC") window.location.href = "/poliseep/teacher/teacher.html";
    let get_str = window.location.search.substring(1);
    document.getElementById("href_file").href+="?"+get_str; // mod. pc
    document.getElementById("href_chat").href+="?"+get_str;
    document.getElementById("href_quiz").href+="?"+get_str;
    document.getElementById("url_file").href+="?"+get_str; // mod. mobile
    document.getElementById("url_chat").href+="?"+get_str;
    document.getElementById("url_quiz").href+="?"+get_str;
    showDocPic(getCourseName(get_str));
    printData(username, getCourseName(get_str));
};

function getCourseName(str) {
    //Se il nome del corso contiene spazi, nell'url gli spazi saranno convertiti in %20 e gli ' con %27
    str=str.split("=")[1].replace(new RegExp("%20", "g"), ' ');
    str=str.replace(new RegExp("%27", "g"), "'");
    return str;
}

async function printData(username, course_name) {
    let teacher = "";
    get(child(dbRef, "UsersList/"+username+"/Courses/"+course_name)).then((snapshot) => {
        teacher = snapshot.val().teacher;
        localStorage.setItem("teacher", teacher);
    }).then(()=>{
        get(child(dbRef, "UsersList/"+teacher+"/Courses/"+course_name)).then((snapshot) => {
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
        })
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

async function showDocPic(course_name) {
    let teacher = "";
    get(child(dbRef, "UsersList/"+username+"/Courses/"+course_name)).then((snapshot) => {
        teacher = snapshot.val().teacher;
    }).then(()=>{
        get(child(dbRef, "UsersList/"+teacher)).then((snapshot) => {
            var path = snapshot.val().profile_pic;
            let img = sRef(storage, path);
            getDownloadURL(img).then((url) => {
                document.getElementById("photo").src=url;
                $( "#photo" ).load(window.location.href + " #photo" );
            });
        });
    });
    const snapshot=await get(query(ref(db, "UsersList"), orderByChild("email"), equalTo(email)));
    let path="";
    snapshot.forEach(element => {
        path=element.val().profile_pic;
    });

    
}