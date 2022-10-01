const tienda = document.getElementById('tienda');
const totalProductos = document.getElementById('totalProductos');
const carro = document.getElementById('carro');

//importa los productos del json
fetch('./JSON/productos.json')
.then(response => response.json())
.then(data => localStorage.setItem("productos", JSON.stringify(data)))
.catch(error => console.log(error))

//constructor de los productos
class Producto {
    constructor (id, nombre, precio, imagen, cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = cantidad;
    }
}

//array de productos
const productos = [];

//genera nuevos objetos producto y los agrega al array
const guardarProductos = () => {
    JSON.parse(localStorage.getItem("productos")).forEach(producto => {
        productos.push(new Producto(producto.id, producto.nombre, producto.precio, producto.imagen, producto.cantidad));
    })
}
guardarProductos();

//genera las cards de los productos con los datos enviados al array
const generarProductos = () => {
    productos.forEach(producto => {
        const { id, nombre, precio, imagen } = producto;
        tienda.innerHTML += `
            <div class="card m-3">
                <img src="${imagen}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${nombre}</h5>
                    <p class="card-text">$${precio}</p>
                    <button id=${id} class="comprar btn btn-primary">Comprar</button>
                </div>
            </div>
        `;
    })
}
generarProductos();

//agrega productos al carrito, emite una notificación, actualiza el total de productos y guarda la compra en el localStorage
tienda.addEventListener('click', e => {
    e.target.classList.contains('comprar') ? productos.find(producto => { producto.id == e.target.id ? (producto.cantidad += 1, localStorage.setItem(`compra${producto.id}`, JSON.stringify(producto)), totalProductos.textContent++, compra(producto), Toastify({ text: "El producto fue agregado al carrito", duration: 2000, position: "center", style: { background: "#06d6a0"} }).showToast()) : null }) : null;
    if (productos.find(producto => producto.id == e.target.id)) {
        const total = productos.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        document.getElementById('totalPrecio').textContent = `Total: $${total}`;
    }
})

//elimina el producto del carrito, emite una notificación y actualiza el total de productos
carro.addEventListener('click', e => {  
    e.target.classList.contains('eliminar') ? productos.find(producto => { producto.id == e.target.id ? (producto.cantidad > 0 ? producto.cantidad -= 1 : e.target.parentElement.parentElement.remove(), producto.cantidad == 0 ? e.target.parentElement.parentElement.remove() : null, localStorage.setItem(`compra${producto.id}`, JSON.stringify(producto)), totalProductos.textContent--, compra(producto), Toastify({ text: "El producto fue eliminado del carrito", duration: 2000, position: "center", style: { background: "#0d1321"} }).showToast()) : null }) : null;
    if (productos.find(producto => producto.id == e.target.id)) {
        const total = productos.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        document.getElementById('totalPrecio').textContent = `Total: $${total}`;
    }
})

//imprime los productos seleccionados en el carrito (valida que no haya productos repetidos)
const compra = (producto) => {
    if (producto.cantidad === 1 && document.getElementsByClassName(`eliminar${producto.id}`).length === 0) {    
        const { id, nombre, precio, imagen, cantidad } = producto;
        carro.innerHTML += `
                <div class="carro_producto">
                    <img width="100px" src="${imagen}" alt="">
                    <div class="carro_info">
                        <h3 class="fs-6 m-0">${nombre}</h3>
                        <p class="m-0">$${precio}</p>
                        <p class="m-0">${cantidad}</p>
                        <button id=${id} class="eliminar eliminar${id} btn btn-danger btn-sm">Eliminar</button>
                    </div>
                </div>
            `;
    } else {
        //aumenta la cantidad del producto
        document.getElementById(`${producto.id}`).parentElement.children[2].textContent = `Cantidad: ${producto.cantidad}`;
    }
}

//función para hacer visible el carrito
const carrito = document.getElementById('carrito');
carrito.onfocus = () => {
    carro.setAttribute("class", "carro_visible");
}

//escucha los clicks en el carrito de compras
carro.addEventListener('click', e => {
    realizarCompra(e);
    cerrarCarro(e);
})

//función que simula la compra y emite una alerta (se valida que el carrito no esté vacío)
const realizarCompra = (e) => {
    productos.forEach(producto => {
        JSON.parse(localStorage.getItem(`compra${producto.id}`))
        if (producto.cantidad > 0) {
            if (e.target.classList.contains('btn_compra')) {
                swal({
                    title: "Compra realizada",
                    text: "¡Su compra ha sido exitosa!",
                    icon: "success",
                    button: "¡Bien!",
                });
            }	
        }
    })
}

//desaparece el carrito
const cerrarCarro = (e) => {
    if (e.target.classList.contains('btn_cerrar')) {
        carro.setAttribute("class", "carro_invisible");
    }
}




