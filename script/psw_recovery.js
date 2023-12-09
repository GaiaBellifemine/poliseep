import {db} from '../firebaseConfig.js';
import {ref, child, get, update, set, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
const dbRef = ref(db);

window.sendEmailWithCode = sendEmailWithCode;
window.confirmPIN = confirmPIN;
window.changePassword = changePassword;

//Evito di permettere accessi non sicuri alla pagina di cambio password
var path = window.location.pathname;
var page = path.split("/").pop();
console.log( page );
if(localStorage.getItem("unamepswrecovery")===null && page!=="forgotPSW_insertEmail.html") {
    window.location = "login.html";
}


function sendEmailWithCode()
{
    let email = document.getElementById("email").value.trim(); // recupero email utente dal form
    let username=email.split("@")[0].replace(".",""); // dalla mail ricavo l'username

    localStorage.setItem("unamepswrecovery", username);

    let codice = Math.floor((Math.random() * 9999) + 1000); // genero il codice (numero casuale compreso tra 1000 e 9999)

    get(child(dbRef, "UsersList/"+username)).then((snapshot) => {
        let r=ref(db, 'UsersList/'+username);
        update(r, { 
            codice: codice // aggiungo/modifico il campo codice a DB
        }).then(()=>{
            $.ajax({
                url: "../send_email.php",
                type: "post",
                data: {"codice": codice, "email": email},
                success: function(data){
                    if(data==="OK")
                    {
                        alert("We sent an e-mail with a PIN. ");
                        window.location.href= "forgotPSW_insertPin.html";
                    }
                    else
                    {
                        alert("Ops... something went wrong. Please, try again.");
                    }
                }
            });
        });
    });
}

function confirmPIN(){
    var codice=document.getElementById("form_pin").value;
    var username=localStorage.getItem("unamepswrecovery");
    console.log(codice);
    get(child(dbRef, "UsersList/"+username)).then((snapshot) => {
        console.log(snapshot.val().codice)
        if(snapshot.val().codice == codice) { //lo snapshot e il codice sono due tipi di dato diversi, con il triplo === darebbe errore
            window.location = "forgotPSW_updatePassword.html";
        }
        else {
            alert("Incorrect PIN. Try again or request a new PIN going back.");
        }
    });
}

function changePassword(){
    var username=localStorage.getItem("unamepswrecovery");

    var pass = document.getElementById("password").value;

    let regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(pass && !regexPass.test(pass)) {
        alert("The Password must meet these criteria:\n1. Minimum 8 characters; \n2. At least one uppercase and lowercase letter;\n3. At least one numeric and special character;");
        return false;
    }

    var enc_Pass = encPass(pass);

    get(child(dbRef, "UsersList/"+username)).then((snapshot) => {
        let r=ref(db, 'UsersList/'+username);
        update(r, {
            password: enc_Pass
        }).then(()=>{
            localStorage.removeItem("unamepswrecovery");
            alert("Successful password recovery. Redirect to login...");
            window.location = "login.html";
        });
    });
}

function encPass(password) {
    var enc_pass=CryptoJS.AES.encrypt(password, password);
    return enc_pass.toString();
}
