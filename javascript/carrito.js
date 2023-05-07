class Producto {
    constructor(id, modelo, img, alt, precio, stock) {
        this.id = id;
        this.modelo = modelo;
        this.img = img;
        this.alt = alt
        this.precio = precio;
        this.cantidad = 1;
        this.stock = stock;
    }
}

class ControladorDeProductos {
    constructor() {
        this.listaDeProductos = []
        this.contenedorProductos = document.getElementById("contenedorProductos")
    }

    uploadDeProductos() {
        this.listaDeProductos = [
            new Producto(1, "brocoli", "./img/productos/brocoli.jpg","", 60,25),
            new Producto(2, "cebolla", "./img/productos/cebolla.jpg","", 70,12),
            new Producto(3, "coliflor", "./img/productos/coliflor.jpg","", 26,8),
            new Producto(4, "lechuga", "./img/productos/lechuga.jpg","", 75,3),
            new Producto(5, "papa", "./img/productos/papa.jpg","", 27,20),
            new Producto(6, "tomate", "./img/productos/tomate.jpg","", 31,17),
            new Producto(7, "zanahoria", "./img/productos/zanahoria.jpg","",25,24),

        ]
    }

    displayProductosDOM() {
        this.listaDeProductos.forEach(producto => {
            this.contenedorProductos.innerHTML +=
                `<div class="d-flex card cardCustom mb-3">
                <h3 class="card-header text-center">${producto.modelo}</h3>
                <div class="d-flex contenerImagen mt-2">
                    <img class="m-auto imagenProducto" src="${producto.img}" alt="${producto.alt}">
                </div>
                
                
                <div class="card-body text-center pt-1">
                    <p class="card-text">Precio: $${producto.precio}</p>
                </div>
                <div class="d-flex m-auto my-3">
                    <button type="button" id="${producto.id}" class="btn btn-primary hover">Añadir al Carrito</button>
                </div>
            </div>`
        })
    }

    clickAnadir(controladorCarrito) {
        this.listaDeProductos.forEach(producto => {
            const btnAP = document.getElementById(`${producto.id}`)
            btnAP.addEventListener("click", () => {

                controladorCarrito.pushear(producto) //verificar si existe antes el producto
                controladorCarrito.setStorage()
                controladorCarrito.displayCarritoDOM(contenedorCarrito) //solo añadir un producto al DOM

                Toastify({
                    text: `${producto.modelo} Añadido!`,
                    duration: 1200
                }).showToast();
            })
        })
    }
}

class ControladorDelCarrito {
    constructor() {
        this.listaDelCarrito = []
        this.contenedorCarrito = document.getElementById("contenedorCarrito")
        this.totalCompra = document.getElementById("totalCompra")
    }

    pushear(producto) {
        const index = this.listaDelCarrito.findIndex(item => item.id === producto.id);
        if (index !== -1) {
            this.listaDelCarrito[index].cantidad++;
        } else {
            this.listaDelCarrito.push(producto);
        }
    }

    setStorage() {
        let listaDelCarritoJSON = JSON.stringify(this.listaDelCarrito)
        localStorage.setItem("listaDelCarrito", listaDelCarritoJSON)
    }

    checkStorage() {
        this.listaDelCarrito = JSON.parse(localStorage.getItem("listaDelCarrito")) || []
        this.listaDelCarrito.length > 0 && this.displayCarritoDOM()
    }

    resetStorage() {
        localStorage.removeItem("listaDelCarrito")
    }

    displayCarritoDOM() {
        this.resetDOM(contenedorCarrito)
        this.listaDelCarrito.forEach(producto => {
            this.contenedorCarrito.innerHTML +=
                `<div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${producto.img}" class="img-fluid rounded-start" alt="${producto.alt}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${producto.modelo}</h5>                           
                            <p class="card-text">Precio: $${producto.precio}</p>
                            <p class="card-text">Cantidad: ${producto.cantidad}</p>
                        </div>
                    </div>
                </div>
            </div>`
        })

        this.displayTotalDOM()
    }

    resetDOM() {
        this.contenedorCarrito.innerHTML = ""
    }

    resetListaDelCarrito() {
        this.listaDelCarrito = []
    }

    finalizarCompra() {
        finalizarCompra.addEventListener("click", () => {
            if (this.listaDelCarrito.length != 0) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Compra exitosa!',
                    showConfirmButton: false,
                    timer: 1700
                })

                controladorCarrito.resetDOM()
                controladorCarrito.resetStorage()
                controladorCarrito.resetListaDelCarrito()
                controladorCarrito.displayTotalDOM()
            }
        })
    }

    calcularTotal() {
        let totalCompra = 0
        this.listaDelCarrito.forEach(producto => {
            totalCompra += producto.precio * producto.cantidad
        })

        return totalCompra;
    }

    displayTotalDOM() {
        this.totalCompra.innerHTML = "$" + this.calcularTotal()
    }
}

const controladorProductos = new ControladorDeProductos();
controladorProductos.uploadDeProductos();

const controladorCarrito = new ControladorDelCarrito();
controladorCarrito.checkStorage();
controladorCarrito.finalizarCompra();

// DOM
controladorProductos.displayProductosDOM();

// Eventos
controladorProductos.clickAnadir(controladorCarrito);