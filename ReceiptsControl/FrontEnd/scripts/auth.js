import "./firebase.js";



// METODOS DE LOS SERVICIOS DE FIRESBASE QUE VAMOS A USAR 

import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"



// IMPORTAMOS LAS VARIABLES QUE TENEMOS INICIALIZADAS EN FIREBASE.JS
import { auth } from "./firebase.js";


/* ACCESO A LA PLATAFORMA - AUTENTICACIÓN */

const btnAcceso = document.getElementById('btnAcceso');

if (btnAcceso) {
    btnAcceso.addEventListener('click', async(e) => {


        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)
            console.log("Usuario logeado");

            /* Observador de si acceso a la app  */
            onAuthStateChanged(auth, async(user) => {
                // Si existe el usuario 
                if (user) {

                    // Peticion a la base de datos los pedidos anteriores 


                    window.location.href = "app.html";


                } else {
                    displayOldOrders([]);

                }
            });

            /* Comprobador de Registro */

            const loginCheck = user => {
                // Si esta registrado el usuario 
                if (user) {



                    // Aqui debe ir si es cocinero solo se veria los pedidos 

                } else {

                    // 
                }
            }




        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                alert('Email no registrado ');
            } else if (error.code === 'auth/wrong-password') {
                alert('Contraseña erronea');

            } else if (error.code === 'auth/invalid-email') {
                alert('Formato de email erróneo');

            } else if (error.code) {
                alert('Algo ha ocurrido mal')
            }
        }
    });
}


// Funcion de comprobar el Acceso a la app