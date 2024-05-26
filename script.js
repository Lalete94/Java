const obtenerCarritoLS = () => JSON.parse(localStorage.getItem("carrito")) || []



async function principal(){ 
    
    const response = await fetch("./data.json")
    const productos = await response.json()
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

    e.target.innerText = e.target.innerText ==="VER CARRITO"  ? "VER PRODUCTOS" : "VER CARRITO"
}
function obtenerCarritoLS() {

    let carritoLS = JSON.parse(localStorage.getItem("carrito"))

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
        <div class=unidaes>
            <button id=dec${producto.id}>-<button>
            <p>${producto.unidades}</p>
            <button id=inc${producto.id}>+<button>
        </div>
        <p>${producto.unidades}</p>
        <p>${producto.subtotal}</p>
        <button id=eliminar${producto.id}>ELIMINAR</button>
        `
        contenedorCarrito.appendChild(tarjetaProductoCarrito)
        
        let botonDecUnidad = document.getElementById("dec" + producto.id)
        botonDecUnidad.addEventListener("click", decrementarUnidad)
        if(producto.unidades === 0){
            Swal.fire({
                title: '¿Eliminar Producto?',
                text: 'Deseas continuar?',
                icon: 'error',
                confirmButtonText: 'Si'
            })
        }
        
        let botonIncUnidad = document.getElementById("inc" + producto.id)
        botonIncUnidad.addEventListener("click", incrementarUnidad) 

        let botonEliminar = document.getElementById("eliminar" + producto.id)
        botonEliminar.addEventListener("click", eliminarProductoDelCarrito)
    })
}

function decrementarUnidad(e){
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(3))
    let posProdEnCarrito = carrito.findIndex(producto => producto.id === id)
    carrito[posProdEnCarrito].unidades--
    carrito[posProdEnCarrito].subtotal = carrito[posProdEnCarrito].unidades * carrito[posProdEnCarrito].precioUnitario
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

function incrementarUnidad(e){
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(3))
    let posProdEnCarrito = carrito.findIndex(producto => producto.id === id)
    carrito[posProdEnCarrito].unidades++
    carrito[posProdEnCarrito].subtotal = carrito[posProdEnCarrito].unidades * carrito[posProdEnCarrito].precioUnitario
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

function eliminarProductoDelCarrito(e){
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(8))
    carrito = carrito.filter(producto => producto.id !== id)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    e.target.parentElement.remove()
}
async function info(){
    return new Promise()
        fetch("./data.json")
        .then(response => response.json())
        .then(productos => {
            return productos
        })
    } 