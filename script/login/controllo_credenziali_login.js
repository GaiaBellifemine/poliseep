/*-----------------------------REGISTRAZIONE-----------------------*/
import {db} from '../../firebaseConfig.js';
import {ref, child, get, set, query, orderByChild, equalTo} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

document.getElementById('btn_submit_signup').addEventListener("click", function() {
    let nome=document.getElementById('nome');
    let email=document.getElementById('email');
    let pass1=document.getElementById('password1');
    let pass2=document.getElementById('password2');

    signup(nome, email,pass1, pass2);
});

function validation(nome, email, pass1, pass2) {
    let regexNome = /^[a-zA-Z\s]+$/; //Il nome non può contenere numeri ma solo lettere maiuscole-minuscole
    let regexMail = /^[a-zA-Z0-9-.]+@(studenti.poliba|poliba)\.it$/; //La mail deve essere nel formato studenti.poliba.it o poliba.it. Può contenere lettere e numeri e deve essere presente la @
    let regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;  //Minimo otto caratteri, almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale.

    if(nome.value==null 
        || isEmptyOrSpaces(email.value) 
        || isEmptyOrSpaces(pass1.value) 
        || isEmptyOrSpaces(pass2.value)) {
            alert("All fields are required");
            return false;
        }

    if(nome.value && !regexNome.test(nome.value)) {
        alert("Name can only contain alphabets");
        return false;
    }
    if(email.value && !regexMail.test(email.value)) {
        alert("Enter a valid mail.\nMail should be in poliba domain.");
        return false;
    }
    
    if(password1.value && !regexPass.test(password1.value)) {
        alert("The Password must meet these criteria:\n1. Minimum 8 characters; \n2. At least one uppercase and lowercase letter;\n3. At least one numeric and special character;");
        return false;
    }

    if(checkPass(pass1, pass2))
        return true;
    else {
        alert("Password doesn't match.")
        return false;
    }
}

function isEmptyOrSpaces(str) {
    return str===null || str.match(/^ *$/)!==null;
}

function checkPass(pass1, pass2) {
    if(pass1.value===pass2.value) return true;
    else return false;
}

function signup(nome,email, pass1, pass2) {
    if(!validation(nome, email, pass1, pass2)) return;
    var tipo=checkDomain(email);
    var username=getUsername(email);
    const dbRef=ref(db);

    //All'interno del db, cerca l'utente con data email
    get(child(dbRef, "UsersList/"+username)).then((snaphot) => {
        //snaphot=risultato ricerca. Se l'email esiste gia' nel db, l'utente esiste
        if(snaphot.exists()) {
            alert("Account already exists.");
        }
        else {
            set(ref(db, "UsersList/"+username),
            {
                fullname: nome.value,
                email: email.value,
                tipo: tipo,
                password: encPass(pass1),
                profile_pic: "/Profile/iconabase.jpg"
            }).then(() =>{
                location.reload();
                //alert("User added successfully");
            }).catch((error)=> {
                alert("Something went wrong. Try again.")
            });
        }
    });
}

/*-----------------------------LOGIN----------------------------*/
document.getElementById('btn_submit').addEventListener("click", function() {
    let email=document.getElementById('email_login');
    let pass=document.getElementById('password');
    
    authenticate(email, pass);
});

async function authenticate(email, password) {
    const dbRef=ref(db);
    var username=getUsername(email);
    
    const snapshot=await get(query(ref(db, "UsersList"), orderByChild("email"), equalTo(email.value)));
    if(snapshot.exists()){
        snapshot.forEach(element => {
            //significa che ha trovato la mail
     
             let dbPass=decPass(element.val().password, password);
             if(dbPass==password.value) {
                 localStorage.setItem("email", email.value); 
                 let domain=checkDomain(email);
                 if(domain==="STU") location.href = '../student/student.html';
                 else location.href = '../teacher/teacher.html';
             }
             else {
                 alert("Password incorrect");
             }
     
         });
    }else{
        alert("No user found with that mail.");
    }
}

/*---------------------COMUNI---------------------*/
function encPass(password) {
    var enc_pass=CryptoJS.AES.encrypt(password.value, password.value);
    return enc_pass.toString();
}

function decPass(enc_password, password) {
    var dec_pass=CryptoJS.AES.decrypt(enc_password, password.value);
    return dec_pass.toString(CryptoJS.enc.Utf8);
}

function getUsername(email) {
    return email.value.split("@")[0].replace(".","");
}

function checkDomain(email) {
    var domain=email.value.split("@")[1];
    if(domain.includes("studenti")) return "STU";
    else return "DOC";
}
