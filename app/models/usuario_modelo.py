import hashlib
from flask import current_app

def verificar_usuario(usuario, contrasena):
    contrasena_encriptada = hashlib.sha256(contrasena.encode()).hexdigest()
    
    conexion = current_app.obtener_conexion()
    cursor = conexion.cursor()

    query = """
        SELECT u.id, u.nombre AS nombre_usuario, r.nombre AS nombre_rol
        FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = %s AND u.password = %s
    """
    cursor.execute(query, (usuario, contrasena_encriptada))
    usuario_encontrado = cursor.fetchone()

    if usuario_encontrado:
        # Convertir la tupla a un diccionario
        columns = [column[0] for column in cursor.description]  # Nombre de las columnas
        usuario_encontrado = dict(zip(columns, usuario_encontrado))  # Crear un diccionario

    return usuario_encontrado
