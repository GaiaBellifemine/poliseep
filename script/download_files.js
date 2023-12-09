import {db, storage} from '../firebaseConfig.js';
import {ref, child, get, query, equalTo, orderByChild, set, update, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import {uploadBytes, ref as sRef, getDownloadURL, deleteObject, listAll, getBlob} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';

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
    if(type==="DOC") window.location.href = "/poliseep/teacher/teacher.html";

    document.getElementById("href_info").href+="?"+get_str;
    document.getElementById("href_chat").href+="?"+get_str;
    document.getElementById("href_quiz").href+="?"+get_str;
    document.getElementById("url_info").href+="?"+get_str;
    document.getElementById("url_chat").href+="?"+get_str;
    document.getElementById("url_quiz").href+="?"+get_str;

    showFiles(username);
};

async function showFiles(username) {
    let course_name = getCourseName(get_str);
    let teacher = localStorage.getItem("teacher");
    const snapshot=await get(query(ref(db, "UsersList/"+teacher+"/Courses/"+course_name+"/Documents")));
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

/*- DOWNLOAD FILES -*/
document.getElementById("btnDownload").addEventListener("click", function(){
    let checkedBoxes = document.querySelectorAll('input[name=checkbox]:checked'); // Recupera le checkbox selezionate
    let course_name = getCourseName(get_str); // Recupera il nome del corso
    let teacher = localStorage.getItem("teacher"); // Recupera il nome del docente
    // Itera per ciascuna delle checkbox selezionate
    checkedBoxes.forEach(function(elem){
        // Get finalizzata a recuperare, per ogni file, i relativi dati
        get(child(dbRef, "UsersList/"+teacher+"/Courses/"+course_name+"/Documents/"+elem.getAttribute("option_id"))).then((snapshot) => {
            // Il metodo getBlob restituisce i dati associati ad ogni file reperiti dallo storage che viene richiamato mediante la reference “sRef”.
            getBlob(sRef(storage, snapshot.val().path))
            .then((blob) => {
                const href = URL.createObjectURL(blob) // Creazione dell'URL
                // Creazione del link relativo a partire dal quale è possibile eseguire il download
                const a = Object.assign(document.createElement('a'), {
                    href,
                    style: 'display:none',
                    download: snapshot.val().doc_name // Qui si imposta il nome del file che si sta per scaricare
                })
                a.click()

                URL.revokeObjectURL(href) // Revoca dell'URL precedente che comunica al browser di non conservare più il riferimento al file
                a.remove() // Rimozione del link

            }).catch((error)=>{
                console.error(error)
            })
        });
    });
});

function download(dataurl, filename) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
  }



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