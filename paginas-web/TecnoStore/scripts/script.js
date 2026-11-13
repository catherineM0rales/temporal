
/* =========================================
   TECNOSTORE
   Carrito, formularios y animaciones
========================================= */

/* PRODUCTOS DISPONIBLES */
const productos = {
    notebook: {
        nombre: "Notebook Pro 15",
        precio: 999000,
        imagen: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80"
    },
    smartphone: {
        nombre: "Smartphone X12",
        precio: 650000,
        imagen: "https://images.unsplash.com/photo-1766503206606-27de0861e8a4?fm=jpg&auto=format&fit=crop&w=700&q=80"
    },
    auriculares: {
        nombre: "Auriculares Wave",
        precio: 85000,
        imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
    },
    teclado: {
        nombre: "Teclado Mech K1",
        precio: 72000,
        imagen: "https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?auto=format&fit=crop&w=700&q=80"
    }
};

/* ELEMENTOS DEL CARRITO */
const cantidadCarrito = document.getElementById("cantidad-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const listadoCarrito = document.getElementById("listado-carrito");
const resumenCarrito = document.getElementById("resumen-carrito");
const subtotalCarrito = document.getElementById("subtotal-carrito");
const totalCarrito = document.getElementById("total-carrito");
const botonVaciarCarrito = document.getElementById("vaciar-carrito");

/* ELEMENTOS DEL FORMULARIO */
const formularioPedido = document.getElementById("formulario-pedido");
const telefono = document.getElementById("telefono");
const aceptarTerminos = document.getElementById("aceptar-terminos");
const contenedorTerminos = document.querySelector(".terminos-contenedor");
const mensajeTerminos = document.getElementById("mensaje-terminos");

/* ELEMENTOS DE CONFIRMACIÓN */
const avisoEmergente = document.getElementById("aviso-emergente");
const ventanaConfirmacion = document.getElementById("ventana-confirmacion");
const textoConfirmacion = document.getElementById("texto-confirmacion");
const botonCerrarModal = document.getElementById("cerrar-modal");
const botonAceptarModal = document.getElementById("aceptar-modal");

/* CARRITO EN MEMORIA */
const carrito = {};

/* CONTROL DE AVISOS */
let temporizadorAviso;
let compraCompletada = false;

/* FORMATO DE PRECIOS EN PESOS ARGENTINOS */
const formatoPesos = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});

function formatearPrecio(precio) {
    return formatoPesos.format(precio);
}

/* MOSTRAR AVISOS EMERGENTES */
function mostrarAviso(mensaje) {
    avisoEmergente.textContent = mensaje;
    avisoEmergente.classList.add("visible");

    clearTimeout(temporizadorAviso);

    temporizadorAviso = setTimeout(() => {
        avisoEmergente.classList.remove("visible");
    }, 3000);
}

/* ACTUALIZAR CONTADOR DEL CARRITO */
function actualizarContador() {
    const cantidadTotal = Object.values(carrito).reduce(
        (total, cantidad) => total + cantidad,
        0
    );

    cantidadCarrito.textContent = cantidadTotal;

    cantidadCarrito.classList.remove("animar");

    // Reinicia la animación para que se repita cada vez.
    void cantidadCarrito.offsetWidth;

    cantidadCarrito.classList.add("animar");
}

/* AGREGAR PRODUCTOS */
function agregarProducto(id) {
    if (!productos[id]) {
        return;
    }

    carrito[id] = (carrito[id] || 0) + 1;

    actualizarContador();
    renderizarCarrito();

    mostrarAviso(`${productos[id].nombre} se agregó al carrito.`);
}

/* CAMBIAR LA CANTIDAD */
function cambiarCantidad(id, cambio) {
    if (!carrito[id]) {
        return;
    }

    carrito[id] += cambio;

    if (carrito[id] <= 0) {
        delete carrito[id];
    }

    actualizarContador();
    renderizarCarrito();
}

/* ELIMINAR UN PRODUCTO */
function eliminarProducto(id) {
    if (!carrito[id]) {
        return;
    }

    const nombre = productos[id].nombre;

    delete carrito[id];

    actualizarContador();
    renderizarCarrito();

    mostrarAviso(`${nombre} se quitó del carrito.`);
}

/* VACIAR EL CARRITO */
function vaciarCarrito() {
    const hayProductos = Object.keys(carrito).length > 0;

    if (!hayProductos) {
        mostrarAviso("El carrito ya está vacío.");
        return;
    }

    Object.keys(carrito).forEach(id => {
        delete carrito[id];
    });

    actualizarContador();
    renderizarCarrito();

    mostrarAviso("Se vació el carrito.");
}

/* CALCULAR EL TOTAL */
function calcularTotal() {
    return Object.entries(carrito).reduce((total, [id, cantidad]) => {
        return total + productos[id].precio * cantidad;
    }, 0);
}

/* DIBUJAR EL CARRITO */
function renderizarCarrito() {
    listadoCarrito.innerHTML = "";

    const ids = Object.keys(carrito);
    const estaVacio = ids.length === 0;

    carritoVacio.hidden = !estaVacio;
    resumenCarrito.hidden = estaVacio;

    ids.forEach(id => {
        const producto = productos[id];
        const cantidad = carrito[id];

        const elemento = document.createElement("article");
        elemento.className = "elemento-carrito";

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.loading = "lazy";

        const informacion = document.createElement("div");
        informacion.className = "carrito-producto-info";

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const precioUnitario = document.createElement("p");
        precioUnitario.textContent =
            `${formatearPrecio(producto.precio)} por unidad`;

        informacion.append(nombre, precioUnitario);

        const precioTotal = document.createElement("strong");
        precioTotal.className = "carrito-producto-precio";
        precioTotal.textContent =
            formatearPrecio(producto.precio * cantidad);

        const controles = document.createElement("div");
        controles.className = "cantidad-controles";

        const botonMenos = document.createElement("button");
        botonMenos.type = "button";
        botonMenos.className = "boton-cantidad";
        botonMenos.textContent = "−";
        botonMenos.setAttribute("aria-label", `Quitar una unidad de ${producto.nombre}`);
        botonMenos.addEventListener("click", () => {
            cambiarCantidad(id, -1);
        });

        const numeroCantidad = document.createElement("span");
        numeroCantidad.className = "cantidad-numero";
        numeroCantidad.textContent = cantidad;
        numeroCantidad.setAttribute("aria-label", "Cantidad");

        const botonMas = document.createElement("button");
        botonMas.type = "button";
        botonMas.className = "boton-cantidad";
        botonMas.textContent = "+";
        botonMas.setAttribute("aria-label", `Agregar una unidad de ${producto.nombre}`);
        botonMas.addEventListener("click", () => {
            cambiarCantidad(id, 1);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "boton-eliminar";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => {
            eliminarProducto(id);
        });

        controles.append(
            botonMenos,
            numeroCantidad,
            botonMas,
            botonEliminar
        );

        elemento.append(
            imagen,
            informacion,
            precioTotal,
            controles
        );

        listadoCarrito.appendChild(elemento);
    });

    const total = calcularTotal();

    subtotalCarrito.textContent = formatearPrecio(total);
    totalCarrito.textContent = formatearPrecio(total);
}

/* BOTONES PARA AGREGAR PRODUCTOS */
document.querySelectorAll("button[data-id]").forEach(boton => {
    boton.addEventListener("click", () => {
        agregarProducto(boton.dataset.id);

        if (boton.classList.contains("boton-agregar")) {
            boton.classList.remove("agregado");

            void boton.offsetWidth;

            boton.classList.add("agregado");
        }
    });
});

/* BOTÓN PARA VACIAR EL CARRITO */
botonVaciarCarrito.addEventListener("click", vaciarCarrito);

/* =========================================
   CELULAR: SOLO SE ACEPTAN NÚMEROS
========================================= */

telefono.addEventListener("input", () => {
    // Elimina letras, espacios, signos y cualquier otro carácter.
    telefono.value = telefono.value.replace(/[^0-9]/g, "");

    // Actualiza la validación según el contenido actual.
    validarTelefono();
});

function validarTelefono() {
    const valor = telefono.value;

    telefono.setCustomValidity("");

    if (valor.length > 0 && !/^[0-9]+$/.test(valor)) {
        telefono.setCustomValidity(
            "El número de celular solo puede contener números."
        );
        return false;
    }

    if (valor.length > 0 && valor.length < 8) {
        telefono.setCustomValidity(
            "El número de celular debe tener al menos 8 números."
        );
        return false;
    }

    if (valor.length > 15) {
        telefono.setCustomValidity(
            "El número de celular no puede superar los 15 números."
        );
        return false;
    }

    if (valor.length === 0) {
        telefono.setCustomValidity(
            "Ingresá tu número de celular."
        );
        return false;
    }

    return true;
}

/* =========================================
   TÉRMINOS Y CONDICIONES
========================================= */

function validarTerminos() {
    const aceptados = aceptarTerminos.checked;

    aceptarTerminos.setCustomValidity("");

    if (!aceptados) {
        aceptarTerminos.setCustomValidity(
            "Para continuar, tenés que aceptar los términos y condiciones."
        );

        mensajeTerminos.textContent =
            "Para continuar, tenés que aceptar los términos y condiciones.";

        mensajeTerminos.hidden = false;
        contenedorTerminos.classList.add("error");

        return false;
    }

    mensajeTerminos.hidden = true;
    contenedorTerminos.classList.remove("error");

    return true;
}

aceptarTerminos.addEventListener("change", () => {
    validarTerminos();
});

/* Al intentar enviar, mostrar los avisos en español. */
formularioPedido.addEventListener("invalid", evento => {
    if (evento.target === aceptarTerminos) {
        mensajeTerminos.textContent =
            "Para continuar, tenés que aceptar los términos y condiciones.";

        mensajeTerminos.hidden = false;
        contenedorTerminos.classList.add("error");
    }

    if (evento.target === telefono) {
        validarTelefono();
    }
}, true);

/* =========================================
   FINALIZAR COMPRA DE DEMOSTRACIÓN
========================================= */

formularioPedido.addEventListener("submit", evento => {
    evento.preventDefault();

    // Comprobar los términos antes de cualquier otra acción.
    if (!validarTerminos()) {
        aceptarTerminos.focus();
        mensajeTerminos.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        return;
    }

    // No permitir continuar si no hay productos.
    if (Object.keys(carrito).length === 0) {
        mostrarAviso("Primero agregá algún producto al carrito.");
        document.getElementById("productos").scrollIntoView({
            behavior: "smooth"
        });
        return;
    }

    // Validar el número de celular.
    if (!validarTelefono()) {
        telefono.reportValidity();
        telefono.focus();
        return;
    }

    // Validar el resto de los campos obligatorios.
    if (!formularioPedido.checkValidity()) {
        formularioPedido.reportValidity();
        return;
    }

    // Confirmación sin código ni número de pedido.
    compraCompletada = true;

    textoConfirmacion.textContent =
        "Completaste correctamente la demostración del proceso de compra. " +
        "El total de tu selección fue de " +
        formatearPrecio(calcularTotal()) + ".";

    ventanaConfirmacion.hidden = false;
    document.body.style.overflow = "hidden";
});

/* CERRAR LA VENTANA DE CONFIRMACIÓN */
function cerrarVentanaConfirmacion() {
    ventanaConfirmacion.hidden = true;
    document.body.style.overflow = "";

    if (compraCompletada) {
        Object.keys(carrito).forEach(id => {
            delete carrito[id];
        });

        actualizarContador();
        renderizarCarrito();

        formularioPedido.reset();

        mensajeTerminos.hidden = true;
        contenedorTerminos.classList.remove("error");
        aceptarTerminos.setCustomValidity("");
        telefono.setCustomValidity("");

        compraCompletada = false;
    }
}

botonCerrarModal.addEventListener("click", cerrarVentanaConfirmacion);
botonAceptarModal.addEventListener("click", cerrarVentanaConfirmacion);

/* CERRAR AL HACER CLIC FUERA DE LA VENTANA */
ventanaConfirmacion.addEventListener("click", evento => {
    if (evento.target === ventanaConfirmacion) {
        cerrarVentanaConfirmacion();
    }
});

/* CERRAR CON LA TECLA ESCAPE */
document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && !ventanaConfirmacion.hidden) {
        cerrarVentanaConfirmacion();
    }
});

/* =========================================
   ENCUESTA DE SATISFACCIÓN
========================================= */

const formularioEncuesta = document.getElementById("formulario-encuesta");

formularioEncuesta.addEventListener("submit", evento => {
    evento.preventDefault();

    if (!formularioEncuesta.checkValidity()) {
        formularioEncuesta.reportValidity();
        return;
    }

    mostrarAviso("¡Gracias por compartir tu opinión!");

    formularioEncuesta.reset();
});

/* ESTADO INICIAL */
actualizarContador();
renderizarCarrito();
