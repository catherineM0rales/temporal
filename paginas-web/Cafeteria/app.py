
from pathlib import Path
import csv
import json
from datetime import datetime

from flask import Flask, jsonify, render_template, request, send_from_directory


# ==========================================================
# CONFIGURACIÓN
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent
ARCHIVO_PEDIDOS = BASE_DIR / "pedidos.csv"

app = Flask(__name__)


# ==========================================================
# PRODUCTOS Y PRECIOS
# ==========================================================

PRODUCTOS = {
    "cafe": {"nombre": "Café", "precio": 2000},
    "capuccino": {"nombre": "Capuccino", "precio": 2500},
    "medialunas": {"nombre": "Medialunas", "precio": 1200},
    "cheesecake": {"nombre": "Cheesecake", "precio": 3000},
    "cookies": {"nombre": "Cookies", "precio": 1500},
    "tostado": {"nombre": "Tostado", "precio": 2800},
}


# ==========================================================
# FORMATO DE PRECIOS
# ==========================================================

def formato_precio(valor):
    return "$" + f"{valor:,.0f}".replace(",", ".")


# ==========================================================
# ESTRUCTURA DEL ARCHIVO CSV
# ==========================================================

CAMPOS = [
    "numero_pedido",
    "fecha",
    "cliente",
    "correo",
    "detalle",
    "total",
    "estado"
]


# ==========================================================
# ADAPTAR LOS PEDIDOS DEL FORMATO ANTERIOR
# ==========================================================

def adaptar_archivo_anterior():

    if not ARCHIVO_PEDIDOS.exists():
        return

    with ARCHIVO_PEDIDOS.open(
        "r",
        newline="",
        encoding="utf-8-sig"
    ) as archivo:

        lector = csv.DictReader(archivo)
        campos_actuales = lector.fieldnames or []

        if campos_actuales == CAMPOS:
            return

        pedidos_antiguos = list(lector)

    pedidos_nuevos = []

    for numero, pedido in enumerate(pedidos_antiguos, start=1):

        productos = pedido.get("productos", "")

        pedidos_nuevos.append({
            "numero_pedido": f"PED-{numero:04d}",
            "fecha": pedido.get("fecha", ""),
            "cliente": pedido.get("cliente", ""),
            "correo": pedido.get("correo", ""),
            "detalle": productos,
            "total": pedido.get("total", "0"),
            "estado": "Registrado"
        })

    with ARCHIVO_PEDIDOS.open(
        "w",
        newline="",
        encoding="utf-8-sig"
    ) as archivo:

        escritor = csv.DictWriter(
            archivo,
            fieldnames=CAMPOS,
            delimiter=";"
        )

        escritor.writeheader()
        escritor.writerows(pedidos_nuevos)


# ==========================================================
# OBTENER EL PRÓXIMO NÚMERO DE PEDIDO
# ==========================================================

def obtener_numero_pedido():

    if not ARCHIVO_PEDIDOS.exists():
        return 1

    with ARCHIVO_PEDIDOS.open(
        "r",
        newline="",
        encoding="utf-8-sig"
    ) as archivo:

        lector = csv.DictReader(archivo, delimiter=";")

        numeros = []

        for pedido in lector:
            numero = pedido.get("numero_pedido", "")

            if numero.startswith("PED-"):
                try:
                    numeros.append(int(numero[4:]))
                except ValueError:
                    pass

    return max(numeros, default=0) + 1


# ==========================================================
# PÁGINA PRINCIPAL
# ==========================================================

@app.route("/")
def inicio():
    return render_template("index.html")


# ==========================================================
# ARCHIVOS ESTÁTICOS
# ==========================================================

@app.route("/styles/<path:archivo>")
def estilos(archivo):
    return send_from_directory(BASE_DIR / "styles", archivo)


@app.route("/script.js")
def javascript():
    return send_from_directory(BASE_DIR, "script.js")


@app.route("/imagenes/<path:archivo>")
def imagenes(archivo):
    return send_from_directory(BASE_DIR / "imagenes", archivo)


# ==========================================================
# GUARDAR PEDIDOS
# ==========================================================

@app.route("/agregar", methods=["POST"])
def agregar_pedido():

    cliente = request.form.get("cliente", "").strip()
    correo = request.form.get("correo", "").strip()
    productos_json = request.form.get("productos", "")

    # Validar cliente

    if not cliente:
        return jsonify(
            ok=False,
            mensaje="Ingresá tu nombre para continuar."
        ), 400

    if len(cliente) > 100 or len(correo) > 150:
        return jsonify(
            ok=False,
            mensaje="Los datos ingresados son demasiado largos."
        ), 400

    # Leer productos

    try:
        productos_solicitados = json.loads(productos_json)

    except (json.JSONDecodeError, TypeError):
        return jsonify(
            ok=False,
            mensaje="No pudimos leer los productos del pedido."
        ), 400

    if not isinstance(productos_solicitados, list) or not productos_solicitados:
        return jsonify(
            ok=False,
            mensaje="El carrito está vacío."
        ), 400

    # Calcular pedido

    detalle = []
    total = 0

    for item in productos_solicitados:

        if not isinstance(item, dict):
            return jsonify(
                ok=False,
                mensaje="Hay un producto inválido."
            ), 400

        producto_id = item.get("id")
        cantidad = item.get("cantidad")

        if (
            producto_id not in PRODUCTOS
            or type(cantidad) is not int
            or not 1 <= cantidad <= 100
        ):
            return jsonify(
                ok=False,
                mensaje="Hay un producto o cantidad inválida."
            ), 400

        producto = PRODUCTOS[producto_id]

        precio = producto["precio"]
        subtotal = precio * cantidad

        total += subtotal

        detalle.append(
            f"{producto['nombre']} x{cantidad} "
            f"({formato_precio(precio)} c/u) "
            f"= {formato_precio(subtotal)}"
        )

    # Preparar registro

    try:

        adaptar_archivo_anterior()

        numero = obtener_numero_pedido()

        fecha = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        nuevo_pedido = {
            "numero_pedido": f"PED-{numero:04d}",
            "fecha": fecha,
            "cliente": cliente,
            "correo": correo,
            "detalle": " | ".join(detalle),
            "total": formato_precio(total),
            "estado": "Pendiente"
        }

        # Guardar sin borrar pedidos anteriores

        archivo_nuevo = (
            not ARCHIVO_PEDIDOS.exists()
            or ARCHIVO_PEDIDOS.stat().st_size == 0
        )

        with ARCHIVO_PEDIDOS.open(
            "a",
            newline="",
            encoding="utf-8"
        ) as archivo:

            escritor = csv.DictWriter(
                archivo,
                fieldnames=CAMPOS,
                delimiter=";"
            )

            if archivo_nuevo:
                escritor.writeheader()

            escritor.writerow(nuevo_pedido)

    except (OSError, csv.Error, ValueError):
        return jsonify(
            ok=False,
            mensaje="No se pudo guardar el pedido. Intentá nuevamente."
        ), 500

    # Confirmación

    return jsonify(
        ok=True,
        mensaje=f"¡El pedido {nuevo_pedido['numero_pedido']} se guardó correctamente!",
        total=total,
        numero_pedido=nuevo_pedido["numero_pedido"]
    )


# ==========================================================
# INICIAR SERVIDOR
# ==========================================================

if __name__ == "__main__":
    app.run(debug=True)
