from flask import current_app

def guardar_reserva(cliente_id, paquete_id, fecha_reserva, total, estado, num_personas):
    try:
        conexion = current_app.obtener_conexion()
        cursor = conexion.cursor()

        query = """
            INSERT INTO reservas (cliente_id, paquete_id, fecha_reserva, total, estado, num_personas)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (cliente_id, paquete_id, fecha_reserva, total, estado, num_personas))
        conexion.commit()

        conexion.close()
    except Exception as e:
        print("Error al guardar la reserva:", str(e))
        raise


def descontar_asientos(paquete_id, num_personas):
    try:
        conexion = current_app.obtener_conexion()
        cursor = conexion.cursor(dictionary=True)  # Usamos 'dictionary=True' para obtener resultados como diccionario

        # Obtener el número de asientos disponibles
        query = """
            SELECT asientos_disponibles 
            FROM vuelos 
            WHERE paquete_id = %s
        """
        cursor.execute(query, (paquete_id,))
        datos_vuelo = cursor.fetchone()  # Obtenemos solo el primer resultado

        # Si los datos del vuelo se reciben como una tupla, acceder a ellos por índice
        if datos_vuelo:
            asientos_disponibles = datos_vuelo['asientos_disponibles']  # Si es un diccionario
            # Si es una tupla, usamos índices: asientos_disponibles = datos_vuelo[0]

            # Verificar si hay suficientes asientos
            if asientos_disponibles >= num_personas:
                nuevos_asientos = asientos_disponibles - num_personas

                # Actualizar la base de datos con los nuevos asientos disponibles
                update_query = """
                    UPDATE vuelos 
                    SET asientos_disponibles = %s 
                    WHERE paquete_id = %s
                """
                cursor.execute(update_query, (nuevos_asientos, paquete_id))
                conexion.commit()

            else:
                raise ValueError("No hay suficientes asientos disponibles para la reserva")

        conexion.close()
    except Exception as e:
        print("Error al descontar asientos:", str(e))
        raise