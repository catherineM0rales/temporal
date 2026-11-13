/* ========================================
   CAFÉ LUNA
   Carrito, animaciones, registro y términos
======================================== */

/* VARIABLES PRINCIPALES */

let carrito = [];
let cafeLunaTerminosAceptados = false;

const listaCarrito = document.getElementById("lista-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const totalCarrito = document.getElementById("total-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const botonVaciar = document.getElementById("vaciar-carrito");
const botonPreparar = document.getElementById("preparar-pedido");
const mensajePedido = document.getElementById("mensaje-pedido");

const casillaTerminos = document.getElementById("aceptar-terminos");
const botonAceptarTerminos = document.getElementById("boton-aceptar");
const mensajeTerminos = document.getElementById("mensaje-terminos");

const avisoAceptacion = document.getElementById("aviso-aceptacion");
const textoAvisoAceptacion = document.getElementById(
    "texto-aviso-aceptacion"
);

const formularioRegistro = document.getElementById("formulario-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");

const mensajeCarritoOriginal = carritoVacio.textContent.trim();

const mensajeInicialAceptacion =
    "Para utilizar Café Luna, primero tenés que leer y aceptar los términos y condiciones.";

/* ----------------------------------------
   FORMATO DE PRECIOS
---------------------------------------- */

function formatoPrecio(precio) {
    return precio.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });
}

/* ----------------------------------------
   AVISO DE TÉRMINOS
---------------------------------------- */

function mostrarAvisoBloqueo() {
    if (textoAvisoAceptacion) {
        textoAvisoAceptacion.textContent =
            "Para utilizar esta función, primero tenés que aceptar los términos y condiciones.";
    }

    if (avisoAceptacion) {
        avisoAceptacion.classList.add("aviso-actualizado");
        avisoAceptacion.classList.remove("aviso-oculto");
    }

    if (mensajeTerminos) {
        mensajeTerminos.textContent =
            "¡Todavía falta un paso! Marcá la casilla y pulsá «Aceptar términos» para utilizar Café Luna. 🤎";
    }
}

function aceptarTerminos() {
    cafeLunaTerminosAceptados = true;

    if (mensajeTerminos) {
        mensajeTerminos.textContent =
            "¡Perfecto! Aceptaste los términos y condiciones. Ya podés disfrutar de Café Luna. ☕🤎";
    }

    if (avisoAceptacion) {
        avisoAceptacion.classList.add("aviso-oculto");
    }
}

/* ----------------------------------------
   BLOQUEO DE INTERACCIONES
---------------------------------------- */

// Antes de aceptar los términos, solamente se permite:
// - Navegar hasta los términos.
// - Marcar la casilla de aceptación.
// - Pulsar el botón para aceptar.

document.addEventListener("click", function (evento) {
    if (cafeLunaTerminosAceptados) {
        return;
    }

    const elemento = evento.target;

    if (!(elemento instanceof Element)) {
        return;
    }

    // Permite interactuar con la casilla principal.
    const controlAceptacion = elemento.closest(
        "#aceptar-terminos, #boton-aceptar"
    );

    if (controlAceptacion) {
        return;
    }

    // Permite llegar a los términos desde los enlaces.
    const enlaceTerminos = elemento.closest(
        'a[href="#terminos"]'
    );

    if (enlaceTerminos) {
        return;
    }

    const control = elemento.closest(
        "a, button, input, select, textarea, [role='button']"
    );

    if (!control) {
        return;
    }

    evento.preventDefault();
    evento.stopImmediatePropagation();

    mostrarAvisoBloqueo();
}, true);

/* Protección adicional para formularios. */

document.addEventListener("submit", function (evento) {
    if (cafeLunaTerminosAceptados) {
        return;
    }

    evento.preventDefault();
    evento.stopImmediatePropagation();

    mostrarAvisoBloqueo();
}, true);

/* ----------------------------------------
   NOTIFICACIONES
---------------------------------------- */

const contenedorNotificaciones = document.createElement("div");

contenedorNotificaciones.className = "contenedor-notificaciones";
contenedorNotificaciones.setAttribute("aria-live", "polite");

document.body.appendChild(contenedorNotificaciones);

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement("div");

    notificacion.className = "notificacion-carrito";
    notificacion.textContent = mensaje;

    contenedorNotificaciones.appendChild(notificacion);

    requestAnimationFrame(() => {
        notificacion.classList.add("notificacion-visible");
    });

    setTimeout(() => {
        notificacion.classList.remove("notificacion-visible");
        notificacion.classList.add("notificacion-saliendo");

        setTimeout(() => {
            notificacion.remove();
        }, 350);
    }, 2600);
}

/* ----------------------------------------
   ANIMACIÓN DEL CONTADOR
---------------------------------------- */

function animarContador() {
    cantidadCarrito.classList.remove("rebote-contador");

    void cantidadCarrito.offsetWidth;

    cantidadCarrito.classList.add("rebote-contador");

    cantidadCarrito.addEventListener("animationend", () => {
        cantidadCarrito.classList.remove("rebote-contador");
    }, { once: true });
}

/* ----------------------------------------
   LIMPIAR CONFIRMACIÓN DEL PEDIDO
---------------------------------------- */

function limpiarMensajePedido() {
    mensajePedido.classList.remove("confirmacion-visible");
    mensajePedido.textContent = "";
}

/* ----------------------------------------
   AGREGAR PRODUCTOS
---------------------------------------- */

document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", () => {
        const id = boton.dataset.id;
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        const productoExistente = carrito.find(
            (producto) => producto.id === id
        );

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({
                id,
                nombre,
                precio,
                cantidad: 1
            });
        }

        limpiarMensajePedido();

        carritoVacio.textContent = mensajeCarritoOriginal;

        actualizarCarrito();
        animarContador();

        mostrarNotificacion(
            `${nombre} se agregó al carrito ☕`
        );

        // Animación temporal del botón.
        const textoOriginal =
            boton.dataset.textoOriginal ||
            boton.textContent.trim();

        boton.dataset.textoOriginal = textoOriginal;
        boton.textContent = "¡Agregado! ✓";
        boton.classList.add("producto-agregado");
        boton.disabled = true;

        clearTimeout(boton.temporizadorAgregado);

        boton.temporizadorAgregado = setTimeout(() => {
            boton.textContent = textoOriginal;
            boton.classList.remove("producto-agregado");
            boton.disabled = false;
        }, 1200);
    });
});

/* ----------------------------------------
   CAMBIAR CANTIDADES
---------------------------------------- */

function cambiarCantidad(id, cambio) {
    const producto = carrito.find(
        (item) => item.id === id
    );

    if (!producto) {
        return;
    }

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        eliminarProducto(id);
        return;
    }

    limpiarMensajePedido();
    actualizarCarrito();
}

/* ----------------------------------------
   ELIMINAR PRODUCTOS
---------------------------------------- */

function eliminarProducto(id) {
    const elemento = document.querySelector(
        `.item-carrito[data-id="${id}"]`
    );

    if (elemento) {
        elemento.classList.add("item-carrito-saliendo");
    }

    setTimeout(() => {
        carrito = carrito.filter(
            (producto) => producto.id !== id
        );

        limpiarMensajePedido();
        actualizarCarrito();
    }, elemento ? 250 : 0);
}

/* ----------------------------------------
   ACTUALIZAR CARRITO
---------------------------------------- */

function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    carrito.forEach((producto) => {
        const item = document.createElement("article");

        item.className = "item-carrito";
        item.dataset.id = producto.id;

        const informacion = document.createElement("div");
        informacion.className = "info-item-carrito";

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.textContent =
            `${formatoPrecio(producto.precio)} por unidad`;

        informacion.append(nombre, precio);

        const controles = document.createElement("div");
        controles.className = "controles-carrito";

        const botonMenos = document.createElement("button");

        botonMenos.type = "button";
        botonMenos.className = "boton-cantidad";
        botonMenos.textContent = "−";

        botonMenos.setAttribute(
            "aria-label",
            `Quitar una unidad de ${producto.nombre}`
        );

        botonMenos.addEventListener("click", () => {
            cambiarCantidad(producto.id, -1);
        });

        const cantidad = document.createElement("span");

        cantidad.className = "cantidad-item";
        cantidad.textContent = producto.cantidad;

        const botonMas = document.createElement("button");

        botonMas.type = "button";
        botonMas.className = "boton-cantidad";
        botonMas.textContent = "+";

        botonMas.setAttribute(
            "aria-label",
            `Agregar una unidad de ${producto.nombre}`
        );

        botonMas.addEventListener("click", () => {
            cambiarCantidad(producto.id, 1);
        });

        const subtotal = document.createElement("span");

        subtotal.className = "subtotal-item";
        subtotal.textContent = formatoPrecio(
            producto.precio * producto.cantidad
        );

        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.className = "boton-eliminar";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
            eliminarProducto(producto.id);
        });

        controles.append(
            botonMenos,
            cantidad,
            botonMas,
            subtotal,
            botonEliminar
        );

        item.append(informacion, controles);
        listaCarrito.appendChild(item);
    });

    const total = carrito.reduce(
        (acumulado, producto) =>
            acumulado + producto.precio * producto.cantidad,
        0
    );

    const cantidadTotal = carrito.reduce(
        (acumulado, producto) =>
            acumulado + producto.cantidad,
        0
    );

    totalCarrito.textContent = formatoPrecio(total);
    cantidadCarrito.textContent = cantidadTotal;

    const estaVacio = carrito.length === 0;

    carritoVacio.hidden = !estaVacio;

    botonVaciar.disabled = estaVacio;
    botonPreparar.disabled = estaVacio;

    botonVaciar.style.opacity = estaVacio ? "0.55" : "1";
    botonPreparar.style.opacity = estaVacio ? "0.55" : "1";
}

/* ----------------------------------------
   VACIAR CARRITO
---------------------------------------- */

botonVaciar.addEventListener("click", () => {
    if (carrito.length === 0) {
        return;
    }

    const elementos = listaCarrito.querySelectorAll(
        ".item-carrito"
    );

    elementos.forEach((elemento, indice) => {
        elemento.style.transitionDelay = `${indice * 60}ms`;
        elemento.classList.add("item-carrito-saliendo");
    });

    botonVaciar.disabled = true;
    botonPreparar.disabled = true;

    limpiarMensajePedido();

    setTimeout(() => {
        carrito = [];

        actualizarCarrito();

        carritoVacio.textContent =
            "¡Carrito despejado! Cuando quieras, acá te esperan más cositas ricas. ☕🤎";

        mostrarNotificacion(
            "Carrito vacío. ¡Gracias por pasar por Café Luna! 🤎"
        );
    }, 350 + Math.min(elementos.length, 8) * 60);
});

/* ----------------------------------------
   FORMULARIO Y GUARDADO DEL PEDIDO
---------------------------------------- */

const formularioPedido = document.getElementById("formulario-pedido");
const estadoPedido = document.getElementById("estado-pedido");
const botonConfirmarPedido = document.getElementById("confirmar-pedido");

botonPreparar.addEventListener("click", () => {
    if (!cafeLunaTerminosAceptados) {
        mostrarAvisoBloqueo();
        return;
    }

    if (carrito.length === 0) {
        mensajePedido.textContent =
            "Agregá al menos un producto para preparar el pedido.";
        return;
    }

    limpiarMensajePedido();
    formularioPedido.hidden = false;
    formularioPedido.scrollIntoView({ behavior: "smooth", block: "center" });
});

formularioPedido.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!cafeLunaTerminosAceptados) {
        mostrarAvisoBloqueo();
        return;
    }

    if (carrito.length === 0) {
        estadoPedido.textContent = "Tu carrito está vacío.";
        return;
    }

    if (!formularioPedido.checkValidity()) {
        formularioPedido.reportValidity();
        return;
    }

    const datos = new FormData(formularioPedido);
    datos.append("productos", JSON.stringify(
        carrito.map(({ id, cantidad }) => ({ id, cantidad }))
    ));

    botonConfirmarPedido.disabled = true;
    estadoPedido.textContent = "Guardando tu pedido...";

    try {
        const respuesta = await fetch("/agregar", {
            method: "POST",
            body: datos
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.ok) {
            throw new Error(resultado.mensaje || "No se pudo guardar el pedido.");
        }

        estadoPedido.textContent = resultado.mensaje;
        mensajePedido.textContent =
            `¡Pedido guardado! Total registrado: ${formatoPrecio(resultado.total)}. Esta es una demostración escolar; no se realizó ninguna compra ni pago.`;
        mensajePedido.classList.add("confirmacion-visible");

        carrito = [];
        actualizarCarrito();
        formularioPedido.reset();
        formularioPedido.hidden = true;
        mostrarNotificacion("¡Tu pedido se guardó correctamente! ☕🤎");
    } catch (error) {
        estadoPedido.textContent = error.message ||
            "Ocurrió un problema al guardar el pedido. Intentá nuevamente.";
    } finally {
        botonConfirmarPedido.disabled = false;
    }
});

/* ----------------------------------------
   ANIMACIÓN DE LAS TARJETAS
---------------------------------------- */

const tarjetas = document.querySelectorAll(".producto");

if ("IntersectionObserver" in window) {
    const observadorTarjetas = new IntersectionObserver(
        (entradas, observador) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("producto-visible");
                    observador.unobserve(entrada.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    tarjetas.forEach((tarjeta, indice) => {
        tarjeta.classList.add("producto-animable");

        tarjeta.style.setProperty(
            "--retraso-tarjeta",
            `${(indice % 3) * 100}ms`
        );

        observadorTarjetas.observe(tarjeta);
    });
} else {
    tarjetas.forEach((tarjeta) => {
        tarjeta.classList.add("producto-visible");
    });
}

/* ----------------------------------------
   FORMULARIO DE REGISTRO
---------------------------------------- */

if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (!cafeLunaTerminosAceptados) {
            mostrarAvisoBloqueo();
            return;
        }

        if (!formularioRegistro.checkValidity()) {
            formularioRegistro.reportValidity();
            return;
        }

        if (mensajeRegistro) {
            mensajeRegistro.textContent =
                "¡Formulario completado correctamente! ☕🤎 Esta es una demostración: tus datos no se enviaron ni se guardaron.";
            mensajeRegistro.classList.add("registro-exitoso");
        }

        mostrarNotificacion(
            "¡Formulario completado! Gracias por visitar Café Luna 🤎"
        );

        // No se envían ni se almacenan datos personales.
        // No limpiamos el formulario para que se pueda revisar.
    });
}

/* ----------------------------------------
   ACEPTAR TÉRMINOS Y CONDICIONES
---------------------------------------- */

botonAceptarTerminos.addEventListener("click", () => {
    if (!casillaTerminos.checked) {
        if (mensajeTerminos) {
            mensajeTerminos.textContent =
                "Primero tenés que marcar la casilla para aceptar los términos y condiciones.";
        }

        mostrarAvisoBloqueo();
        return;
    }

    aceptarTerminos();
});

/* ----------------------------------------
   INICIALIZACIÓN
---------------------------------------- */

actualizarCarrito();

if (textoAvisoAceptacion) {
    textoAvisoAceptacion.textContent = mensajeInicialAceptacion;
}

if (avisoAceptacion) {
    avisoAceptacion.classList.remove("aviso-oculto");
}