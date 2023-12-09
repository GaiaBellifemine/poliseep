import {db, storage} from '../firebaseConfig.js';
import {ref, child, get, query, equalTo, orderByChild, set, update, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import {uploadBytes, ref as sRef, getDownloadURL, deleteObject, listAll, getMetadata} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';

if (localStorage.getItem("email") === null) {
    window.location.href = "/poliseep";
}

const dbRef = ref(db);
let email = localStorage.getItem("email"); 
let username=email.split("@")[0].replace(".","");
let currentDate = new Date();
let get_str = window.location.search.substring(1);

window.onload = function(){
    let type = getLoggedType(username);
    if(type==="STU") window.location.href = "/poliseep/student/student.html"; //Pagina student ancora da fare

    let get_str = window.location.search.substring(1);
    document.getElementById("href_info").href+="?"+get_str;
    document.getElementById("href_chat").href+="?"+get_str;
    document.getElementById("href_quiz").href+="?"+get_str;
    document.getElementById("url_info").href+="?"+get_str;
    document.getElementById("url_chat").href+="?"+get_str;
    document.getElementById("url_quiz").href+="?"+get_str;

    showFiles(username);
};

function getCourseName(str) {
    //Se il nome del corso contiene spazi, nell'url gli spazi saranno convertiti in %20 e gli ' con %27
    str=str.split("=")[1].replace(new RegExp("%20", "g"), ' ');
    str=str.replace(new RegExp("%27", "g"), "'");
    return str;
}

async function getLoggedType(username) {
    const snapshot=await get(query(ref(db, "UsersList"), orderByChild("email"), equalTo(email)));
    let type="";
    snapshot.forEach(element => {
        type=element.val().tipo;
    });
    return type;
}

async function showFiles(username) {
    let course_name = getCourseName(get_str);
    const snapshot=await get(query(ref(db, "UsersList/"+username+"/Courses/"+course_name+"/Documents")));
    snapshot.forEach(element => {
        getDownloadURL(sRef(storage, element.val().path)).then((url) => {
            document.getElementById("file_table").innerHTML += `
            <tr>
                <td><input type='checkbox' name='checkbox' class='item_id' option_id='`+element.val().id+`'> </td>
                <td>`+element.val().doc_name+`</td>
                <td>`+element.val().upload_date+`</td>
                <td>`+element.val().weight+" kB"+`</td>
            </tr>
            `;
        });
    }); 
}

document.getElementById('uploadFile').addEventListener('change', function(e){
    let doc = e.target.files[0];
    let id=0;
    let course_name = getCourseName(get_str);
    get(child(dbRef, "UsersList/"+username+"/Courses/"+course_name+"/Documents")).then((snapshot) => {
        snapshot.forEach(function(element) {
            if(element.val().id>id) id=element.val().id;
        });
        id++;

        const storo = sRef(storage, 'Courses/'+username+"/"+course_name+"/"+id); 

        uploadBytes(storo, doc).then(() => {
            let r=ref(db, "UsersList/"+username+"/Courses/"+course_name+"/Documents/"+id);
            set(r, {
                id: id,
                doc_name: doc.name,
                upload_date: oggi(),
                weight: doc.size/1024,
                path: 'Courses/'+username+"/"+course_name+"/"+id
            });

            location.reload();
        });
    });
    
});

document.getElementById("del_btn").addEventListener("click", function() {
    var checkedBoxes = document.querySelectorAll('input[name=checkbox]:checked');
    let course_name = getCourseName(get_str);
    checkedBoxes.forEach(function(checkbox) {
        let option_id=checkbox.getAttribute("option_id");
        const dirToDelete = sRef(storage, 'Courses/'+username+"/"+course_name+"/"+option_id);

        deleteObject(dirToDelete).then(() => {
            let r=ref(db, "UsersList/"+username+"/Courses/"+course_name+"/Documents/"+option_id);
            remove(r);

            location.reload();
        })
    });
});

function oggi() {
    let gg=currentDate.getDate();
    if(gg<10) gg="0"+gg;
    
    let mm=currentDate.getMonth()+1;
    if(mm<10) mm="0"+mm;
  
    let yyyy=currentDate.getFullYear();
  
    let hh=currentDate.getHours();
    if(hh<10) hh="0"+hh;
  
    let minutes=currentDate.getMinutes();
    if(minutes<10) minutes="0"+minutes;
  
    return gg+"/"+mm+"/"+yyyy+" "+hh+":"+minutes;
  }