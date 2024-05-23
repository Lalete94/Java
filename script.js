let listaProductos = [
    { id: 2, nombre: "Aros1", categoria: "aros", stock: 2, precio: 12000, rutaImagen: "Aros1.jpeg" },
    { id: 5, nombre: "Aros2", categoria: "aros", stock: 7, precio: 10000, rutaImagen: "Aros2.jpeg" },
    { id: 7, nombre: "Collar1", categoria: "collares", stock: 4, precio: 15000, rutaImagen: "Collar1.jpeg" },
    { id: 9, nombre: "Collar2", categoria: "collares", stock: 1, precio: 14000, rutaImagen: "Collar2.jpeg" },
    { id: 12, nombre: "Pulsera1", categoria: "pulseras", stock: 3, precio: 7000, rutaImagen: "Pulsera1.jpeg" },
    { id: 15, nombre: "Pulsera2", categoria: "pulseras", stock: 8, precio: 9000, rutaImagen: "Pulsera2.jpeg" },
    { id: 17, nombre: "Aro de oro", categoria: "joyas de oro", stock: 7, precio: 17000, rutaImagen: "Aros7o.jpeg" },
]

principal(listaProductos)

function principal(productos){ 
    let carrito = obtenerCarritoLS()
    renderizarCarrito()

    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click",() => filtrarYRenderizarEnter(productos, e))
    
    let inputBusqueda = document.getElementById("inputBusqueda")
    inputBusqueda.addEventListener ("keypress",(e) => filtrarYRenderizarEnter(productos, e))

    let botonVerOcultar = document.getElementById("botonVerOcultar")
    botonVerOcultar.addEventListener("click", verOcultar)

    renderizarProductos(productos)

    let botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click", finalizarCompra)
}

function verOcultar(e) {
    let contenedorCarrito =document.getElementById("contenedorCarrito")
    let contenedorProductos =document.getElementById("contenedorProductos")

    contenedorCarrito.classList.toggle("oculto")
    contenedorProductos.classList.toggle("oculto")

/*     if (e.target.innerText === "VER CARRITO"){
        e.target.innerText === "VER PRODUCTOS"
    } else {
        e.target.innerText === "VER CARRITO"
    } */

    e.target.innerText = e.target.innerText ==="VER CARRITO"  ? "VER PRODUCTOS" : "VER CARRITO"
}
function obtenerCarritoLS() {
    /* let carrito = [] */
    let carritoLS = JSON.parse(localStorage.getItem("carrito"))
    /*  if (carritoLS) {
        carrito = carritoLS
    } else {
        carrito = []
    }
 */
    carrito = carritoLS ? carritoLS : []
    return carrito
}

function finalizarCompra() {
    localStorage.removeItem("carrito")
    renderizarCarrito([])
}
function filtrarYRenderizarEnter(productos, e){
    if(e.keyCode === 13){
        let productosFiltrados = filtrarProductos(productos)
        renderizarProductos(productosFiltrados)  
    }
}

function filtrarYRenderizar(productos){
    let productosFiltrados = filtrarProductos(productos)
    renderizarProductos(productosFiltrados)
}


function filtrarProductos (productos) {
    let inputBusqueda = document.getElementById("inputBusqueda")
    return productos.filter(producto => producto.nombre.includes(inputBusqueda.value) || producto.categoria.includes(inputBusqueda.value))
}

function renderizarProductos(productos)   {
    let contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = ""

    productos.forEach(producto => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.className = "tarjetaProducto"
        
        tarjetaProducto.innerHTML = `
        <h3>${producto.nombre}</h3>
        <img src="./img/${producto.rutaImagen}"/>
        <h4>Precio: ${producto.precio}</h4>
        <p>Stock: ${producto.stock}</p>
        <button id=botonCarrito${producto.id}>Agregar al carrito</button>
        `
        contenedorProductos.appendChild(tarjetaProducto)                       //-----------------------------------------------

        let botonAgregarAlCarrito = document.getElementById("botonCarrito" + producto.id)
        botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(e, productos))
    });
}

function agregarProductoAlCarrito(e, productos){
    let carrito = obtenerCarritoLS()
    let idDelProducto = Number(e.target.id.substring(12))

    let posProductoEnCarrito = carrito.findIndex(producto => producto.id === idDelProducto)
    let productoBuscado = productos.find(producto => producto.id === idDelProducto)

    if (posProductoEnCarrito !== -1) {
        carrito[posProductoEnCarrito].unidades++
        carrito[posProductoEnCarrito].subtotal = carrito[posProductoEnCarrito].precioUnitario * carrito[posProductoEnCarrito].unidades
    } else {
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            precioUnitario: productoBuscado.precio,
            unidades: 1,
            subtotal: productoBuscado.precio
        })
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}
function renderizarCarrito(){
    let carrito = obtenerCarritoLS()
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    contenedorCarrito.innerHTML = ""
    carrito.forEach(producto => {
        let tarjetaProductoCarrito = document.createElement("div")
        tarjetaProductoCarrito.className = "tarjetaProductoCarrito"

        tarjetaProductoCarrito.innerHTML = `
        <p>${producto.nombre}</p>
        <p>${producto.precioUnitario}</p>
        <p>${producto.unidades}</p>
        <p>${producto.subtotal}</p>
        <button id=eliminar${producto.id}>ELIMINAR</button>
        `
        contenedorCarrito.appendChild(tarjetaProductoCarrito)
    })
}

