from flask import Blueprint, request, jsonify
from app.models.reservas_modelo import guardar_reserva as guardar_reserva_modelo, descontar_asientos
from datetime import date

reserva_bp = Blueprint('reserva_bp', __name__)

@reserva_bp.route('/guardar_reserva', methods=['POST'])
def guardar_reserva():
    return guardar_reserva_controlador()

def guardar_reserva_controlador():
    try:
        data = request.get_json()
        print("Datos recibidos para la reserva:", data)

        cliente_id = data['cliente_id']
        paquete_id = data['paquete_id']
        total = data['total']
        estado = data['estado']
        num_personas = int(data.get('num_personas', 0))

        # Puedes comentar esta línea si decides usar la fecha que viene del frontend
        fecha_reserva = date.today().isoformat()

        # Guardar la reserva
        guardar_reserva_modelo(cliente_id, paquete_id, fecha_reserva, total, estado, num_personas)

        # Solo descontar asientos si el estado es pagado
        if estado.lower() == 'pagado' and num_personas > 0:
            descontar_asientos(paquete_id, num_personas)

        return jsonify({"message": "Reserva guardada correctamente"}), 200

    except Exception as e:
        print("❌ Error al guardar reserva:", str(e))
        return jsonify({"error": str(e)}), 500
