from flask import current_app
from datetime import datetime
import pymysql.cursors

def filtrar_paquetes(origen, destino, personas, fecha, precio):
    # Obtener la conexión
    conexion = current_app.obtener_conexion()
    
    # Usar DictCursor para obtener resultados como diccionarios
    cursor = conexion.cursor(pymysql.cursors.DictCursor)

    query = """
        SELECT 
            p.id,
            p.nombre, 
            p.descripcion, 
            CAST(p.precio_total AS UNSIGNED) AS precio_total,
            v.fecha, 
            a.nombre AS aerolinea, 
            ao.ciudad AS origen_ciudad, 
            ad.ciudad AS destino_ciudad,         
            h.nombre AS hotel
        FROM paquetes p
        JOIN vuelos v ON v.id = p.vuelo_id
        JOIN aeropuertos ao ON ao.id = v.origen_id
        JOIN aeropuertos ad ON ad.id = v.destino_id
        JOIN aerolineas a ON a.id = v.aerolinea_id     
        JOIN hoteles h ON h.id = p.hotel_id 
        WHERE LOWER(ao.ciudad) = LOWER(%s)
          AND LOWER(ad.ciudad) = LOWER(%s)
          AND v.fecha >= %s
          AND v.asientos_disponibles >= %s
          AND p.precio_total <= %s
    """
    
    # Ejecutar la consulta con los parámetros
    cursor.execute(query, (origen, destino, fecha, personas, precio))
    resultados = cursor.fetchall()

    # Formatear las fechas y convertir la hora de los vuelos
    for resultado in resultados:
        fecha_vuelo = resultado['fecha']
        
        if fecha_vuelo:
            # Asegurarse de que fecha_vuelo es un objeto datetime
            if isinstance(fecha_vuelo, datetime):
                # Agregar hora de salida
                resultado['hora_salida'] = fecha_vuelo.strftime('%H:%M:%S')
                # Si quieres una fecha en formato más completo
                resultado['fecha_vuelo'] = fecha_vuelo.strftime('%Y-%m-%d %H:%M:%S')  # Fecha y hora completas

    # Cerrar la conexión después de obtener los resultados
    cursor.close()

    return resultados
