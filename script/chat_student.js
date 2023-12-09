import {db, storage} from '../firebaseConfig.js';
import {ref, child, get, onValue, push, query, orderByChild, equalTo, limitToLast, update, set} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import {ref as sRef, getDownloadURL, uploadBytes} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';

window.sendAttachments = sendAttachments;

if (localStorage.getItem("email") === null) {
    window.location.href = "/poliseep";
}

const dbRef = ref(db);
let email = localStorage.getItem("email"); 
let username=email.split("@")[0].replace(".","");
let get_str = window.location.search.substring(1);
let course_name=getCourseName(get_str);
let initialState=true; //Per sincronizzare la ricezione messaggi

window.onload = async function(){
    let type = getLoggedType(username);
    if(type==="DOC") window.location.href = "/poliseep/teacher/teacher.html";
    
    await getTeacher().then(async (teacher)=> {
        let teacher_name = await getTeacherName(teacher);
        let img_path = await getTeacherPic(teacher);
        document.getElementById("teacher_name").innerHTML=teacher_name;

        document.getElementById("href_file").href+="?"+get_str;
        document.getElementById("href_quiz").href+="?"+get_str;
        document.getElementById("href_info").href+="?"+get_str;

        document.getElementById("url_file").href+="?"+get_str;
        document.getElementById("url_quiz").href+="?"+get_str;
        document.getElementById("url_info").href+="?"+get_str;

        const snapshot=await get(query(ref(db, "Courses/"+course_name+"/Professor/"+teacher+"/Chat/"+username+"/Messages"), orderByChild("timestamp")));

        await getDownloadURL(sRef(storage, img_path)).then(async (url) => {
            document.getElementById("teacher_pic").src=url;
            
            //snapshot.forEach(element => {
            for(let messaggio in snapshot.val()) {
                await get(child(dbRef, "Courses/"+course_name+"/Professor/"+teacher+"/Chat/"+username+"/Messages/"+messaggio)).then(async (element) => {
                    if(element.val().sender===username) {
                        if(element.val().type == "allegato") {
                            var path = element.val().message;
                            var messaggio = path.split("/").pop();
                            await getDownloadURL(sRef(storage, path)).then((url) => {
                                document.getElementById("chat-box").innerHTML+=`
                                    <div class="chat outgoing">
                                        <div class="details">
                                            <a href="${url}" target="_blank"><p>${messaggio}</p></a>
                                        </div>
                                    </div>
                                `;
                            });
                        } else {
                            document.getElementById("chat-box").innerHTML+=`
                                <div class="chat outgoing">
                                    <div class="details">
                                        <p>${element.val().message}</p>
                                    </div>
                                </div>
                            `;
                        }
                    } else { 
                        if(element.val().type == "allegato") {
                            var path = element.val().message;
                            var messaggio = path.split("/").pop();
                            await getDownloadURL(sRef(storage, path)).then((url_file) => {
                                document.getElementById("chat-box").innerHTML+=`
                                    <div class="chat incoming">
                                        <img src="${url}" alt="">
                                        <div class="details">
                                            <a href="${url_file}" target="_blank"><p>${messaggio}</p></a>
                                        </div>
                                    </div>
                                `;
                            });
                        } else {
                            document.getElementById("chat-box").innerHTML+=`
                                <div class="chat incoming">
                                    <img src="${url}" alt="">
                                    <div class="details">
                                        <p>${element.val().message}</p>
                                    </div>
                                </div>
                            `;
                        }
                    }
                });
            }//);
        });
    });
};

await getTeacher().then((teacher) => {
    //Aggiorna lista messaggi studente realtime
    onValue(ref(db, 'Courses/'+course_name+"/Professor/"+teacher+"/Chat/"+username+"/Messages"), async ()=> {
        if(!initialState) {
            await getTeacher().then(async (teacher) => {
                const snapshot=await get(query(ref(db, 'Courses/'+course_name+"/Professor/"+teacher+"/Chat/"+username+"/Messages"), limitToLast(1)));
                //snapshot.forEach(async element => {
                for(let messaggio in snapshot.val()) {
                    await get(child(dbRef, "Courses/"+course_name+"/Professor/"+teacher+"/Chat/"+username+"/Messages/"+messaggio)).then(async (element) => {
                        if(element.val().sender===username) {
                            if(element.val().type == "allegato") {
                                var path = element.val().message;
                                var messaggio = path.split("/").pop();
                                await getDownloadURL(sRef(storage, path)).then((url) => {
                                    document.getElementById("chat-box").innerHTML+=`
                                        <div class="chat outgoing">
                                            <div class="details">
                                                <a href="${url}" target="_blank"><p>${messaggio}</p></a>
                                            </div>
                                        </div>
                                    `;
                                });
                            } else {
                                document.getElementById("chat-box").innerHTML+=`
                                    <div class="chat outgoing">
                                        <div class="details">
                                            <p>${element.val().message}</p>
                                        </div>
                                    </div>
                                `;
                            }
                        } else {
                            if(element.val().type == "allegato") {
                                var path = element.val().message;
                                var messaggio = path.split("/").pop();
                                await getDownloadURL(sRef(storage, path)).then((url_file) => {
                                    document.getElementById("chat-box").innerHTML+=`
                                        <div class="chat incoming">
                                            <img src="${url}" alt="">
                                            <div class="details">
                                                <a href="${url_file}" target="_blank"><p>${messaggio}</p></a>
                                            </div>
                                        </div>
                                    `;
                                });
                            } else {
                                let img_path=await getTeacherPic(teacher);
                                getDownloadURL(sRef(storage, img_path)).then((url) => {
                                    document.getElementById("chat-box").innerHTML+=`
                                        <div class="chat incoming">
                                            <img src="${url}" alt="">
                                            <div class="details">
                                                <p>${element.val().message}</p>
                                            </div>
                                        </div>
                                    `;
                                });
                            }
                        }
                    });
                }//);
            });
            
        }
        else initialState=false;
        
    });
});


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

document.getElementById("message_box").addEventListener("keyup", async function(event) {
    if (event.key === 'Enter' && document.getElementById("message_box").value!="") {
        await sendMessage();
    }
});

document.getElementById("send_btn").addEventListener("click", async function(){
    await sendMessage();
});

async function sendMessage() {
    await getTeacher().then((data)=>{
        let inputVal=document.getElementById("message_box").value;
        let r=ref(db, 'Courses/'+course_name+"/Professor/"+data+"/Chat/"+username+"/Messages");

        push(r, {
            message: inputVal,
            sender: username,
            timestamp: Date.now()
        }).then(async () => {
            let r=ref(db, 'Courses/'+course_name+"/Professor/"+data+"/Chat/"+username);
            let name = await getStudentName();
            await update(r, {
                email: email,
                fullname: name
            }).then(async()=>{
                let r1=ref(db, 'Courses/'+course_name+"/Professor/"+data+"/Seen/"+username);
                await update(r1, {
                    seen: false
                }).then(() => {
                    document.getElementById("message_box").value="";
                });
            });
            //document.getElementById("message_box").value="";
        });
    });
}

$(document).ready(function() {
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
});

document.getElementById("uploadFile").addEventListener("change", async function(e) {
    let doc = e.target.files[0];
    var extension = doc.name.split(".").pop();
    doc = renameFile(doc, doc.name.split("."+extension)[0] + Date.now() + "." + extension);
    
    const storo = sRef(storage, 'Chat/'+username+"/"+doc.name);
    await getTeacher().then(async (teacher)=>{
        await uploadBytes(storo, doc).then(async () => {
            let r=ref(db, 'Courses/'+course_name+"/Professor/"+teacher+"/Chat/"+username+"/Messages");
            await push(r, {
                message: "Chat/"+username+"/"+doc.name,
                sender: username,
                timestamp: Date.now(),
                type: "allegato"
            });
        });
    });
});

function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

function sendAttachments(){
    document.getElementById("uploadFile").click();
}

async function getTeacher() {
    const snapshot=await get(query(ref(db, "UsersList/"+username+"/Courses/"+course_name)));
    return snapshot.val().teacher;
}

async function getTeacherName(teacher) {
    const snapshot=await get(query(ref(db, "UsersList/"+teacher)));
    return snapshot.val().fullname;
}

async function getTeacherPic(teacher) {
    const snapshot=await get(query(ref(db, "UsersList/"+teacher)));
    return snapshot.val().profile_pic;
}

async function getStudentName() {
    const snapshot=await get(query(ref(db, "UsersList/"+username)));
    return snapshot.val().fullname;
}