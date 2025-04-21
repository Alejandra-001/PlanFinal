from flask import current_app

def obtener_ventas_totales():
    conexion = current_app.obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT SUM(total) AS total_ventas
            FROM reservas
            WHERE estado = 'pagado';
        """)
        resultado = cursor.fetchone()
    # Si no hay resultado, retornamos 0
    return resultado[0] if resultado else 0

def obtener_paquetes_mas_vendidos():
    conexion = current_app.obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT p.nombre, COUNT(r.id) AS veces_vendido
            FROM reservas r
            JOIN paquetes p ON r.paquete_id = p.id
            WHERE r.estado = 'pagado'
            GROUP BY p.id
            ORDER BY veces_vendido DESC
            LIMIT 5;
        """)
        resultados = cursor.fetchall()
    # Si no hay resultados, retornamos una lista vacía
    return [{'nombre': row[0], 'veces_vendido': row[1]} for row in resultados] if resultados else []

def obtener_ocupacion_vuelos():
    conexion = current_app.obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT 
              ROUND(
                (1 - (SUM(asientos_disponibles) / (COUNT(*) * 120))) * 100, 2
              ) AS ocupacion
            FROM vuelos;
        """)
        resultado = cursor.fetchone()
    # Si no hay resultado, retornamos 0
    return resultado[0] if resultado else 0

def obtener_ocupacion_hoteles():
    conexion = current_app.obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT 
              (COUNT(DISTINCT rh.habitacion_id) / (SELECT COUNT(*) FROM habitaciones)) * 100 AS ocupacion_general
            FROM reserva_habitaciones rh
            JOIN reservas r ON rh.reserva_id = r.id
            WHERE r.estado = 'pagado';
        """)
        resultado = cursor.fetchone()
    # Si no hay resultado, retornamos 0
    return resultado[0] if resultado else 0

def obtener_promociones_activas():
    conexion = current_app.obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT nombre, fecha_inicio, fecha_fin
            FROM promociones
            WHERE fecha_inicio <= NOW() AND fecha_fin >= NOW();
        """)
        resultados = cursor.fetchall()
    # Si no hay resultados, retornamos una lista vacía
    return [{'nombre': row[0], 'fecha_inicio': row[1], 'fecha_fin': row[2]} for row in resultados] if resultados else []
