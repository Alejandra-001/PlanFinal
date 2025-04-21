
from flask import current_app

# Función para obtener el estado de la reserva
def obtener_estado_reserva(reserva_id):
    conexion = current_app.obtener_conexion()
    cursor = conexion.cursor()

    # Obtener el estado de la reserva
    cursor.execute("""
        SELECT estado FROM reservas WHERE id = %s
    """, (reserva_id,))
    resultado = cursor.fetchone()

    conexion.close()

    if resultado:
        return resultado[0]  # Retornar el estado de la reserva
    else:
        raise ValueError("Reserva no encontrada")

# Función para anular la reserva
def anular_reserva(reserva_id):
    conexion = current_app.obtener_conexion()
    cursor = conexion.cursor()

    try:
        # Obtener número de personas y paquete asociado a la reserva
        cursor.execute("""
            SELECT r.num_personas, p.vuelo_id
            FROM reservas r
            JOIN paquetes p ON r.paquete_id = p.id
            WHERE r.id = %s
        """, (reserva_id,))
        resultado = cursor.fetchone()

        if not resultado:
            raise ValueError("Reserva no encontrada")

        num_personas, vuelo_id = resultado

        # Actualizar estado a "anulado"
        cursor.execute("""
            UPDATE reservas SET estado = 'anulado' WHERE id = %s
        """, (reserva_id,))

        # Consultar asientos actuales del vuelo
        cursor.execute("""
            SELECT asientos_disponibles FROM vuelos WHERE id = %s
        """, (vuelo_id,))
        vuelo = cursor.fetchone()

        if not vuelo:
            raise ValueError("Vuelo no encontrado")

        asientos_actuales = vuelo[0]
        nuevos_asientos = asientos_actuales + num_personas

        # Actualizar asientos del vuelo
        cursor.execute("""
            UPDATE vuelos SET asientos_disponibles = %s WHERE id = %s
        """, (nuevos_asientos, vuelo_id))

        conexion.commit()
    except Exception as e:
        conexion.rollback()
        raise e
    finally:
        conexion.close()
