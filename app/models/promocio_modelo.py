# modelos/promocion_modelo.py

from flask import current_app


def obtener_promociones_limitadas(limit=3):
    # Conectar a la base de datos y obtener las promociones
    conexion = current_app.obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre, descuento FROM promociones ORDER BY id ASC LIMIT %s", (limit,))
    promociones = cursor.fetchall()
    conexion.close()
    return promociones
