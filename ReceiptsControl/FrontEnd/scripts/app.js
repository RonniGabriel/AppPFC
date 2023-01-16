console.log('Se carga la pagina de la App');
import "./auth.js";

document.addEventListener("DOMContentLoaded", () => {

    showProductos();

});


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
                        itemSelected.innerText += "Precio " + element.precio + " x" + checkAmount(countProducts.value);
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
                        purchaseTotal.innerText = "Total Pedido:" + total + "€";

                    });






                });


            } else if (ajax.status == 404) {
                console.log("Archivo no encontrado")
            }
        } else if (ajax.readyState == 0 || ajax.readyState == 1 || ajax.readyState == 2) {
            console.log("Loading")
        }
    }

    function checkAmount(amount) {
        let returnAmount = ((amount > 20) ? 20 : amount);
        return returnAmount;
    }


}