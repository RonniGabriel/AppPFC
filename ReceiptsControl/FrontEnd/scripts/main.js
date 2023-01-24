import "./auth.js";
import "./addUsers.js";

import { auth, db, onGetOldOrders, deleteOldORder, addUser } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"

document.addEventListener("DOMContentLoaded", async() => {

    showProductos();

    requestOldOrders();

    displays();


});


/* Cargar los productos del Archivo Json */
function showProductos() {

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = loadJson;
    ajax.open("GET", "../items.json");
    ajax.send();


    function loadJson() {

        if (ajax.readyState == 4) {
            if (ajax.status == 200) {


                var obj = this.responseText;
                var obj01 = JSON.parse(obj);


                let total = 0;
                let cartDiv = document.getElementById('cart');
                let cartItems = document.createElement('div');
                cartItems.id = "itemsCart"
                let cart = document.createElement('li');
                cart.innerText = "Pedido nº";
                let purchaseTotal = document.createElement('li');
                purchaseTotal.innerText = "Total :" + total + "€";

                let addOrder = document.createElement('button');
                addOrder.id = "addOrder";
                addOrder.textContent = "Generar pedido"

                cartDiv.append(cart, cartItems, purchaseTotal, addOrder);

                obj01.items.forEach(element => {

                    let divProduct = document.createElement('div');
                    divProduct.className = "Articulo";
                    divProduct.id = "articulo";
                    let imgProduct = document.createElement('img');
                    imgProduct.className = "Img";
                    imgProduct.src = element.img;
                    let nameProduct = document.createElement('div');
                    nameProduct.className = "Producto";
                    nameProduct.textContent = element.nombre;
                    let priceProduct = document.createElement('div');
                    priceProduct.className = "Precio"
                    priceProduct.textContent = element.precio;

                    let btnActions = document.createElement('div');
                    btnActions.className = "BtnActions";

                    let countProducts = document.createElement('input');
                    countProducts.id = "counterItems";
                    countProducts.setAttribute("type", "number");
                    countProducts.min = 1;
                    countProducts.defaultValue = 1;
                    let buyButton = document.createElement('button');
                    buyButton.innerText = "Añadir";
                    buyButton.className = "BuyButton";

                    btnActions.append(countProducts, buyButton);
                    divProduct.append(imgProduct, nameProduct, priceProduct, btnActions)

                    document.getElementById('productos').append(divProduct);

                    buyButton.addEventListener("click", function() {


                        let divBuy = document.createElement('div');
                        divBuy.className = "divBuy";
                        let itemSelected = document.createElement('li');
                        let deleteButton = document.createElement('button');
                        let totalIndividual = (element.precio * checkAmount(countProducts.value)).toFixed(2);

                        deleteButton.innerText = "x";
                        deleteButton.className = "DeleteButton";
                        itemSelected.innerText = element.nombre + " - ";
                        itemSelected.innerText += "Precio " + element.precio + "€  x" + checkAmount(countProducts.value);
                        divBuy.append(itemSelected, deleteButton);

                        document.getElementById('itemsCart').append(divBuy);

                        deleteButton.addEventListener('click', function() {

                            divBuy.remove();
                            total -= totalIndividual;
                            total = Math.round(total * 100) / 100;

                            if (total < 0 || total == 0) {
                                purchaseTotal.innerText = " Total: " + "0 €";
                            } else {
                                purchaseTotal.innerText = "Total: " + total + "€";
                            };
                        });
                        total += checkAmount(countProducts.value) * element.precio;
                        total = Math.round((total + Number.EPSILON) * 100) / 100;
                        purchaseTotal.innerText = "Total: " + total + "€";
                    });


                });


            } else if (ajax.status == 404) {
                console.log("Archivo no encontrado")
            }
        } else if (ajax.readyState == 0 || ajax.readyState == 1 || ajax.readyState == 2) {

        }
    }

    function checkAmount(amount) {
        let returnAmount = ((amount > 20) ? 20 : amount);
        return returnAmount;
    }


}
/* Peticion de los pedidos cerrados a la base de datos */
const requestOldOrders = async() => {

    const orderList = document.getElementById('oldOrders');

    onGetOldOrders((querySnapshot) => {

        let list = ""
        querySnapshot.forEach(doc => {
            const post = doc.data();
            console.log(post);
            const li = `  
                <div class="close">
                    <ul>
                        <li>Camarero/a: ${post.empleado}</li>
                        <li>Mesa: nº${post.mesa }</li>
                    </ul>
                    <p>${post.pedido}</p>
                    <div id="btn_DeleteDIV">
                    <button class='btn_delete'   data-id="${doc.id}" > Eliminar permanentemente </button></div>
                </div>                      
                `
            list += li;

        })

        orderList.innerHTML = list;

        const btnsDelete = orderList.querySelectorAll('.btn_delete');

        btnsDelete.forEach(btn => {
            //  Al activar el boton obtenemos el contenido del boton mediante el target del doc  : propiedades del objeto 
            btn.addEventListener('click', async({ target: { dataset } }) => {
                console.log("clicking", dataset)

                try {
                    await deleteOldORder(dataset.id);
                    // Podria poner un mensaje de alerta de archivo eliminado

                } catch (error) {
                    console.log(error);

                }

            })
        })
        console.log(querySnapshot.docs);

    })


}

/* Funcion de añadir un nuevo usuario a la base de datos. */
const btnNewUser = document.getElementById('nuevoUsuario');

btnNewUser.addEventListener('click', (e) => {

    e.preventDefault();

    const name = document.getElementById('nombre').value;
    const surname = document.getElementById('apellidos').value;
    const email = document.getElementById('correo').value;
    const phone = document.getElementById('telefono').value;
    const categorie = document.getElementById('categoria').value;

    addUser(name, surname, email, phone, categorie);
    console.log("usuario registrado correctamente");

})



/* Control de los menus: Apariciones  */
function displays() {

    const pad02 = document.getElementById('pad02').addEventListener('click', () => {
        const oldOrdersPad = document.getElementById('OldOrdersPad');

        if (oldOrdersPad.style.display === 'none') {

            oldOrdersPad.style.display = 'block';
        } else {
            oldOrdersPad.style.display = 'none';
        }
    });

    const pad03 = document.getElementById('pad03').addEventListener('click', () => {
        const pedidosPad = document.getElementById('pedidosPad');
        requestOldOrders();
        if (pedidosPad.style.display === 'none') {
            pedidosPad.style.display = 'block';
        } else {
            pedidosPad.style.display = 'none';
        }
    });

    const altaUsuarioPad = document.getElementById('altaUsuario').addEventListener('click', () => {
        const formAddUser = document.getElementById('form');

        if (formAddUser.style.display === 'none') {
            document.getElementById('Pad').style.display = "none";
            formAddUser.style.display = 'block';

        } else {
            formAddUser.style.display = 'none';
            const closeForm = document.getElementById('closePad').addEventListener('click', () => {
                formAddUser.style.display = 'none';
                document.getElementById('Pad').style.display = "block";
            })
        }


    })

}

/* Cerrar sesion : Servicio Firebase sign Out */
const logOut = document.getElementById('btnSignOff');

logOut.addEventListener('click', async() => {
    await signOut(auth);
    console.log("user sign out");
    // window.location.href = "login.html";
});