from flask import Blueprint, request, jsonify
from app.models.paquete_modelo import filtrar_paquetes

paquete_bp = Blueprint('paquete', __name__)

@paquete_bp.route('/api/paquetes/filtrar', methods=['POST'])
def filtrar_paquetes_controlador():
    try:
        datos = request.get_json()
        print(f"Datos recibidos: {datos}")

        if not datos:
            raise ValueError("No se recibieron datos o los datos son inválidos")

        # Llamar a la función filtrar_paquetes pasando los datos correctamente
        paquetes = filtrar_paquetes(
            datos['origen'],  # origen
            datos['destino'],  # destino
            int(datos['personas']),  # personas (convertido a entero)
            datos['fecha'],  # fecha
            float(datos['precio'])  # precio (convertido a flotante)
        )

        # Si paquetes es una lista de diccionarios, debería ser directamente serializable en JSON
        return jsonify(paquetes)
        
    except Exception as e:
        print(f"Error en filtrar_paquetes_controlador: {str(e)}")
        return jsonify({"error": "Hubo un error al filtrar los paquetes", "detalle": str(e)}), 500
