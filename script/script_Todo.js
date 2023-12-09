import {db, storage} from '../firebaseConfig.js';
import {ref, child, get, query, equalTo, orderByChild, set, update, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

//Le funzioni onclick devono essere visibili globalmente
window.deleteTask= deleteTask;
window.handleStatus = handleStatus;

const dbRef = ref(db);
let email = localStorage.getItem("email");
let username=email.split("@")[0].replace(".","");

// Import di tutti gli elementi richiesti
const inputField = document.querySelector(".input-field textarea"),
  todoLists = document.querySelector(".todoLists"),
  pendingNum = document.querySelector(".pending-num"),
  clearButton = document.querySelector(".clear-button");

// Questa funzione viene richiamata durante l'aggiunta, l'eliminazione e la selezione/deselezione dei task
function allTasks() {
  let tasks = document.querySelectorAll(".pending");

  // Se non ci sono task, il contenuto del testo num in sospeso sarà no, in caso contrario il valore num in sospeso sarà pari al numero di task
  pendingNum.textContent = tasks.length === 0 ? "no" : tasks.length;

  let allLists = document.querySelectorAll(".list");
  if (allLists.length > 0) {
    todoLists.style.marginTop = "20px";
    clearButton.style.pointerEvents = "auto";
    return;
  }
  todoLists.style.marginTop = "0px";
  clearButton.style.pointerEvents = "none";
}

/*- AGGIUNTA TASK TO-DO LIST -*/
inputField.addEventListener("keyup", (e) => {
  let inputVal = inputField.value.trim(); // La funzione .trim rimuove lo spazio davanti e dietro al valore immesso

  // Se si fa clic sul pulsante invio e la lunghezza del valore assegnato è maggiore di 0
  if (e.key === "Enter" && inputVal.length > 0) {
    // Get che richiama il DB mediante la costante “dbRef” (dichiarata inizialmente per definire il percorso del db che si intende raggiungere)
    // finalizzata a recuperare il percorso relativo al task immesso dall'utente (se già esistente)
    get(child(dbRef, 'UsersList/'+username+"/Tasks/"+inputVal)).then((snaphot) => {
      //Se il valore immesso dall'utente non esiste (il percorso non è presente), allora lo si aggiunge alla To-Do List
      if(!snaphot.exists()) {
          let r=ref(db, 'UsersList/'+username+"/Tasks/"+inputVal); // Definisce il path del DB che si intende raggiungere
          // Memorizzazione del task (set del valore e rimozione del chek relativo)
          set(r, {
            task_name: inputVal,
            checked: "false"
          }).then(() => {
            // Creazione HTML del list item
            let liTag = ` <li class="list pending" id="li-${inputVal}" val="${inputVal}">
                <input id="${inputVal}" val="${inputVal}" type="checkbox"/>
                <span class="task" onclick="handleStatus(getElementById('${inputVal}'))">${inputVal}</span>
                <i class="uil uil-trash" onclick="deleteTask(this)" val="${inputVal}"></i>
              </li>`;

              todoLists.insertAdjacentHTML("beforeend", liTag); // Inserimento del tag li all'interno del div todolist
              inputField.value = ""; // Rimozione del valore dal campo di input
              allTasks();
          });
      }
      // Altrimenti, se il task che si intendeva aggiungere era già presente nel DB, viene semplicemente ripulito il campo di input senza aggiungere nulla.
      else document.getElementById("task_area").value = "";
    });
  }
});

// Seleziona e deseleziona la checkbox mentre si fa clic sul task
function handleStatus(checkbox) {
  checkbox.checked = checkbox.checked ? false : true;
  let r=ref(db, "UsersList/"+username+"/Tasks/"+checkbox.getAttribute('val'));
  update(r, {checked: checkbox.checked.toString()}).then(() => {
    document.getElementById("li-"+checkbox.getAttribute('val')).classList.toggle("pending");
    allTasks();
    //location.reload();
  });
}

// Elimina il task mentre si fa clic sull'icona di eliminazione
function deleteTask(e) {
  console.log("Hello")
  let r=ref(db, "UsersList/"+username+"/Tasks/"+e.getAttribute('val'));
  remove(r).then(() => {
    e.parentElement.remove(); // Ottiene l'elemento e lo rimuove
    allTasks();
  });
}

// Cancella tutti i task mentre si fa clic sul pulsante clear.
clearButton.addEventListener("click", () => {
  let r=ref(db, "UsersList/"+username+"/Tasks");
  remove(r).then(() => {
    todoLists.innerHTML = "";
    allTasks();
  })
});
