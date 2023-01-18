const orderList = document.getElementById('oldOrders');

export const displayOldOrders = (data) => {
    if (data.length) {
        let list = '';
        data.forEach(doc => {



            const post = doc.data();
            console.log(post);
            const li = `  
            <div class="close">
                <ul>
                    <li>Camarero/a: ${post.empleado}</li>
                    <li>Mesa: nº${post.mesa }</li>
                </ul>
                <p>${post.pedido}</p>
            </div>                      
            `
            list += li;
        });

        orderList.innerHTML = list;




    } else {
        orderList.innerHTML = 'Para ver los pedidos anteriores logueate'
    }

}