/* CONEXIÓN CON LOS SERVICIOS DE FIREBASE  */


// Import the functions you need from the SDKs you need 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import { getFirestore, getDocs, collection, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCr9U_uN_oIYdHoAtJn-oWfdEjEi7GssYQ",
    authDomain: "receiptscontrol-2a48b.firebaseapp.com",
    databaseURL: "https://receiptscontrol-2a48b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "receiptscontrol-2a48b",
    storageBucket: "receiptscontrol-2a48b.appspot.com",
    messagingSenderId: "862544858961",
    appId: "1:862544858961:web:4e5a5f3a7b2e507398cd70"
};

/* INICIACION DE LOS SERVICIOS DE FIREBASE */
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);



/* Peticiones a la base de datos  */

export const getOldOrders = () => getDocs(collection(db, 'pedidosCerrados'));
export const onGetOldOrders = (callBack) => onSnapshot(collection(db, 'pedidosCerrados'), callBack)
export const deleteOldORder = id => deleteDoc(doc(db, 'pedidosCerrados', id));




console.log("Firebaje/.js");