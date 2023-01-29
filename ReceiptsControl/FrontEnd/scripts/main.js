import "./auth.js";
import "./addUsers.js";

import { auth, db, onGetOldOrders, onGetActiveOrders, deleteOldORder, addOrder, closeOrder, deleteActiveOrder } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDocs, collection, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"

document.addEventListener("DOMContentLoaded", async() => {

    showProductos();

    requestOldOrders();
    requestActiveOrders();

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
                let tableDiv = document.createElement('div');
                tableDiv.id = "tableDiv";
                let label = document.createElement('label');
                label.textContent = "Mesa nº: ";
                cartItems.id = "itemsCart"
                let table = document.createElement('input');
                table.setAttribute("type", "number");
                table.id = "inputTable";
                let purchaseTotal = document.createElement('li');
                purchaseTotal.id = "precio";
                purchaseTotal.innerText = "Total :" + total + "€";

                tableDiv.append(label, table)

                let addOrder = document.createElement('button');
                addOrder.id = "addOrder";
                addOrder.textContent = "Generar pedido";
                addOrder.addEventListener('click', activateOrder);

                cartDiv.append(tableDiv, cartItems, purchaseTotal, addOrder);

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
                        itemSelected.className = "itemSelected"
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
                        <li>Precio: ${post.precio}</li>
                        <li>Mesa: nº${post.mesa }</li>
                    </ul>
                    <p>${post.contenido}</p>
                    <div id="btn_DeleteDIV">
                    <button class='btn_delete' data-id="${doc.id}" > Eliminar permanentemente </button></div>
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
    /* Funcion de mostrar los pedidos activos  */

const requestActiveOrders = async() => {
    // Peticion a la base de datos de Pedidos Acti

    const orderList1 = document.getElementById('activeOrdersPad');

    onGetActiveOrders((querySnapshot1) => {
        let list1 = "";
        querySnapshot1.forEach(doc => {
            const post = doc.data();
            // console.log(post);
            const li = `  
            <div class="active">
                <ul>
                    <li id="activePrecio">Precio: ${post.precio}</li>
                    <li id="activeMesa">Mesa: nº${post.mesa}</li>
                </ul>
                <p id="activeContenido">${post.contenido}</p>
                <div id="btn_DeleteDIV">
                <button id='chargeBtn' class='chargeOrder' data-id="${doc.id}" > Cobrar Pedido </button></div>
            </div>                      
            `
            list1 += li;


        })
        orderList1.innerHTML = list1;
        const btnsCharger = orderList1.querySelectorAll('.chargeOrder');

        btnsCharger.forEach(btn => {
            //  Al activar el boton obtenemos el contenido del boton mediante el target del doc  : propiedades del objeto 
            btn.addEventListener('click', async({ target: { dataset } }) => {
                console.log("clicking", dataset)

                const precio = document.getElementById('activePrecio');
                const mesa = document.getElementById('activeMesa');

                const content = document.getElementById('activeContenido');


                console.log(mesa.textContent, precio.textContent, content.textContent)

                try {
                    await closeOrder(mesa.textContent, precio.textContent, content.textContent);

                    await deleteActiveOrder(dataset.id);
                    // Podria poner un mensaje de alerta de archivo eliminado

                } catch (error) {
                    console.log(error);

                }

            })

        })



    });

}

/* Funcion de generar pedidos activos  */
function activateOrder() {

    const table = document.getElementById('inputTable').value;

    const precio = document.getElementById('precio').textContent;
    const item = document.getElementsByClassName('itemSelected');
    let contenido = "";
    for (let i = 0; i < item.length; i++) {

        var text = item[i].textContent;
        contenido += text;
    }

    console.log(contenido);
    addOrder(table, precio, contenido);


}

/* Control de los menus: Apariciones  */
function displays() {

    const pad02 = document.getElementById('pad02').addEventListener('click', () => {
        const oldOrdersPad = document.getElementById('OldOrdersPad');
        requestOldOrders();

        if (oldOrdersPad.style.display === 'none') {

            oldOrdersPad.style.display = 'block';
        } else {
            oldOrdersPad.style.display = 'none';
        }
    });
    const pedidosPad = document.getElementById('pedidosPad');
    const pad03 = document.getElementById('pad03').addEventListener('click', () => {


        pedidosPad.style.display = 'block';
        document.getElementById('closeBtn').addEventListener('click', (event) => {
            e.preventDefault();
            console.log("EOOO")
            document.getElementById('pedidosPad').style.display = "block";


        });


    });



    const altaUsuarioPad = document.getElementById('altaUsuario').addEventListener('click', () => {
        const formAddUser = document.getElementById('form');

        formAddUser.style.display = 'block';
        document.getElementById('Pad').style.display = "none";

        document.getElementById('closeForm').addEventListener('click', () => {

            formAddUser.style.display = 'none';
            document.getElementById('Pad').style.display = "block";
        })



    })

}

/* Cerrar sesion : Servicio Firebase sign Out */
const logOut = document.getElementById('btnSignOff');

logOut.addEventListener('click', async() => {
    await signOut(auth);
    console.log("user sign out");
    // window.location.href = "login.html";
});