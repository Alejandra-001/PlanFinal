from flask import Blueprint, request, jsonify
from app.models.modificar_reservas_modelo import anular_reserva, obtener_estado_reserva

modificar_reserva_bp = Blueprint('modificar_reserva_bp', __name__)

@modificar_reserva_bp.route('/modificar_reserva', methods=['PUT'])
def modificar_reserva():
    return modificar_reserva_controlador()

def modificar_reserva_controlador():
    try:
        # Obtener los datos de la petición JSON
        data = request.get_json()
        reserva_id = data['reserva_id']
        estado = data['estado']
        user_id = data.get('user_id')  # Recibir el user_id del cuerpo de la solicitud

        # Validar si el user_id es 3
        if user_id != 3:
            return jsonify({"error": "No tiene permisos para realizar esta acción."}), 403

        # Obtener el estado actual de la reserva
        estado_actual = obtener_estado_reserva(reserva_id)

        # Validar que el estado de la reserva sea "pagado" o "pendiente"
        if estado_actual not in ['pagado', 'pendiente']:
            return jsonify({"error": "Solo se puede anular reservas con estado 'pagado' o 'pendiente'."}), 400

        # Solo permitimos el estado "anulado"
        if estado.lower() == 'anulado':
            anular_reserva(reserva_id)
            return jsonify({"message": "Reserva anulada y asientos devueltos correctamente."}), 200
        else:
            return jsonify({"message": "Solo se permite el estado 'anulado' en esta acción."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
