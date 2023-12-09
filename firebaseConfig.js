//Integrazione firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAmfwKpkn2DoxpAKQv1rnLRTVjNMbcVQ0",
  authDomain: "poliseep.firebaseapp.com",
  projectId: "poliseep",
  storageBucket: "poliseep.appspot.com",
  messagingSenderId: "69244516042",
  appId: "1:69244516042:web:8a690f987963db90aea633",
  measurementId: "G-2HTGF8DYFZ",
  databaseURL: "https://poliseep-default-rtdb.europe-west1.firebasedatabase.app"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  import {getDatabase, ref, set, child, get} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
  import {getStorage} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';

  const db=getDatabase();
  const storage=getStorage();
  export {db, storage};