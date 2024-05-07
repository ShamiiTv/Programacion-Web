function valorDolar() {
    fetch('https://mindicador.cl/api')
        .then(function(response) {
            return response.json();
        })
        .then(function(dailyIndicators) {
            preciodolar = dailyIndicators.dolar.valor;
            mostrarProductosCarrito();
        })
        .catch(function(error) {
            console.log('Error en la solicitud:', error);
        });
}

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let contador = document.querySelector('.carro span');

    if (contador) {
        contador.textContent = carrito.length;
    } else {
        document.querySelector('.carro').innerHTML += `<span class="badge bg-primary">${carrito.length}</span>`;
    }
}

actualizarContadorCarrito();

window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("volverArriba").classList.add("mostrar");
    } else {
        document.getElementById("volverArriba").classList.remove("mostrar");
    }
}

document.getElementById("volverArriba").addEventListener("click", function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

function agregarAlCarrito(nombre, precio, imagen) {
    $('#exampleModal').modal('show');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
        carrito.push({ nombre: nombre, precio: precio, imagen: imagen, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

window.onload = function() {
    valorDolar();
};

function mostrarProductosCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let listaProductos = document.getElementById('lista-productos');
    let totalCarritoCLP = document.getElementById('total-carrito');
    let totalCarritoUSD = document.getElementById('total-carrito2');
    let totalCLP = 0;
    let totalUSD = 0;

    listaProductos.innerHTML = '';

    carrito.forEach(function(producto, index) {
        producto.cantidad = producto.cantidad || 1;

        let divProducto = document.createElement('div');
        divProducto.classList.add('product');
        divProducto.innerHTML = `
            <img src="Imagenes/Productos/${producto.imagen}" alt="${producto.nombre}">
            <div class="product-details">
                <h2>${producto.nombre}</h2>
                <p>Precio: $${producto.precio.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,')} CLP</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <button onclick="eliminarProducto(${index})" class="btn btn-danger">Eliminar</button>
                <button onclick="aumentarCantidad(${index})" class="btn btn-primary">+</button>
                <button onclick="disminuirCantidad(${index})" class="btn btn-primary">-</button>
            </div>
        `;
        listaProductos.appendChild(divProducto);
        let precioTotalUSD = (producto.precio * producto.cantidad) / preciodolar;
        totalCLP += producto.precio * producto.cantidad;
        totalUSD += precioTotalUSD;
    });

    totalCarritoCLP.textContent = `Total: $${totalCLP.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,')} CLP`;
    totalCarritoUSD.textContent = `Total: $${totalUSD.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,')} USD`;
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarProductosCarrito();
    actualizarContadorCarrito();
}

function aumentarCantidad(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let encontrado = false;
    carrito.forEach(function(producto) {
        if (producto.nombre === carrito[index].nombre) {
            producto.cantidad = (producto.cantidad || 1) + 1;
            encontrado = true;
        }
    });
    if (!encontrado) {
        carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarProductosCarrito();
}

function disminuirCantidad(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarProductosCarrito();
    }
}

function limpiarCarrito() {      
    localStorage.removeItem('carrito');
    mostrarProductosCarrito();
    actualizarContadorCarrito();
}

document.querySelector('.limpiar-carrito').addEventListener('click', limpiarCarrito);
