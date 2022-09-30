const tienda = document.getElementById('tienda');
const totalProductos = document.getElementById('totalProductos');
const carro = document.getElementById('carro');

//importa los productos del json local
fetch('./JSON/productos.json')
.then(response => response.json())
.then(data => {
    const productos = data;
    localStorage.setItem("productos", JSON.stringify(productos));
    //crea las tarjetas de los productos
    productos.forEach(producto => {
    const { id, nombre, precio, imagen } = producto;
    tienda.innerHTML += `
        <div class="producto">
            <div class="container">
                <img class="producto_imagen" src="${imagen}" alt="">
                <div class="container">
                    <h2 class="fs-6">${nombre}</h2>
                    <p class="fs-4 fw-bold">$${precio}</p>
                    <button id="${id}" class="comprar btn btn-outline-success">Comprar</button>
                </div>
            </div>
        </div>
    `;
})})
.catch(error => console.log(error))

//función que escucha los clicks en la sección tienda
tienda.addEventListener('click', e => {
    comprar(e);
});

const comprar = (e) => {
    //si contiene la clase comprar, genera una notificación
    if(e.target.classList.contains('comprar')) {
        Toastify({
            text: "Éste producto fue agregado al carrito",
            duration: 2000,
            position: "center",
            newWindow: true,
            gravity: "top",
            stopOnFocus: true,
            style: {
                background: "#2FBF71",
            }
        }).showToast(); 
        //obtiene los productos del local storage y aumenta la cantidad si el id coincide
        const productos = JSON.parse(localStorage.getItem("productos"));
        const id = e.target.id;
        productos.forEach(producto => {
            id == producto.id ? producto.cantidad++ : null;
            if (producto.cantidad > 0) {
                compra(producto);
            }
            localStorage.setItem("productos", JSON.stringify(productos));
        })
        //aumenta el número de productos en el carrito
        totalProductos.textContent++;
    }
}   

const compra = (producto) => {
    //si la cantidad del producto es 1 y no existe el elemento con la clase eliminar(id), crea la tarjeta del producto en el carrito
    if (producto.cantidad === 1 && document.querySelector(`.eliminar${producto.id}`) === null) {
        const { id, nombre, precio, imagen, cantidad } = producto;
        carro.innerHTML += `
                <div class="carro_producto">
                    <img width="100px" src="${imagen}" alt="">
                    <div class="carro_info">
                        <h3 class="fs-6 m-0">${nombre}</h3>
                        <p class="m-0">$${precio}</p>
                        <p class="m-0">Cantidad: ${cantidad}</p>
                        <button id=${id} class="eliminar${id} btn btn-danger btn-sm">Eliminar</button>
                    </div>
                </div>
            `;
    } else {
        //aumenta la cantidad del producto
        const { id, cantidad } = producto;
        const carroProducto = document.getElementById(`${id}`);
        carroProducto.parentElement.children[2].textContent = `Cantidad: ${cantidad}`;
    }
    eliminarProducto(producto);
}

//función que elimina los productos del carrito
const eliminarProducto = (producto) => {
    carro.addEventListener('click', e => {  
        if (e.target.classList.contains(`eliminar${producto.id}`)) {
            const { id } = producto;
            const eliminar = document.querySelector(`.eliminar${id}`);
            const productos = JSON.parse(localStorage.getItem("productos"));
            productos.forEach(producto => {
                if (producto.id == id) {
                    producto.cantidad = 0;
                    totalProductos.textContent > 0 ? totalProductos.textContent-- : totalProductos.textContent = 0;
                    localStorage.setItem("productos", JSON.stringify(productos));
                    eliminar.parentElement.parentElement.remove();
                    Toastify({
                        text: "El producto fue eliminado del carrito",
                        duration: 2000,
                        position: "center",
                        newWindow: true,
                        gravity: "top",
                        stopOnFocus: true,
                        style: {
                            background: "#000000",
                        }
                    }).showToast();
                }
            })    
        }
    })
}

//función para hacer visible el carrito
const carrito = document.getElementById('carrito');
carrito.onfocus = () => {
    carro.setAttribute("class", "carro_visible");
}

//función que escucha los clicks en el carrito de compras
carro.addEventListener('click', e => {
    realizarCompra(e);
    cerrarCarro(e);
})

//función que simula la compra y emite una alerta
const realizarCompra = (e) => {
    if (e.target.classList.contains('btn_compra')) {
        const productos = JSON.parse(localStorage.getItem("productos"));
        if (productos.map(producto => producto.cantidad > 0).includes(true)) {
            swal({
                title: "Compra realizada",
                text: "¡Su compra ha sido exitosa!",
                icon: "success",
                button: "Bien!",
            });
        }	
    }
}

//función para desaparecer el carrito
const cerrarCarro = (e) => {
    if (e.target.classList.contains('btn_cerrar')) {
        carro.setAttribute("class", "carro_invisible");
    }
}

const total = () => {
    const productos = JSON.parse(localStorage.getItem("productos"));
    const total = productos.map(producto => producto.precio * producto.cantidad).reduce((a, b) => a + b, 0);
    document.getElementById('totalPrecio').innerHTML = `<span>Total: $${total}</span>`;
}
total();



