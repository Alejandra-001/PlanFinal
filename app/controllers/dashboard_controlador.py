from flask import Blueprint, jsonify, render_template
from app.models.dashboard_modelo import (
    obtener_ventas_totales,
    obtener_paquetes_mas_vendidos,
    obtener_ocupacion_vuelos,
    obtener_ocupacion_hoteles,
    obtener_promociones_activas
)
import decimal

# Función auxiliar para convertir Decimals a float
def convertir_decimales(data):
    if isinstance(data, dict):
        return {k: convertir_decimales(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convertir_decimales(i) for i in data]
    elif isinstance(data, decimal.Decimal):
        return float(data)
    return data

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/dashboard')
def mostrar_dashboard():
    return render_template('dashboard.html')

@dashboard_bp.route('', methods=['GET'])  # La ruta ahora es solo /api/dashboard
def obtener_dashboard():
    try:
        # Obtener los datos del modelo
        ventas_totales = obtener_ventas_totales()
        paquetes_mas_vendidos = obtener_paquetes_mas_vendidos()
        ocupacion_vuelos = obtener_ocupacion_vuelos()
        ocupacion_hoteles = obtener_ocupacion_hoteles()
        promociones_activas = obtener_promociones_activas()

        # Asegurarse de que los datos no sean None o vacíos
        if ventas_totales is None:
            ventas_totales = 0
        if not paquetes_mas_vendidos:
            paquetes_mas_vendidos = []
        if ocupacion_vuelos is None:
            ocupacion_vuelos = 0
        if ocupacion_hoteles is None:
            ocupacion_hoteles = 0
        if not promociones_activas:
            promociones_activas = []

        # Convertir los valores de tipo Decimal a float para evitar errores de serialización
        datos = {
            "ventas_totales": ventas_totales,
            "paquetes_mas_vendidos": paquetes_mas_vendidos,
            "ocupacion_vuelos": ocupacion_vuelos,
            "ocupacion_hoteles": ocupacion_hoteles,
            "promociones_activas": promociones_activas
        }
        
        datos_convertidos = convertir_decimales(datos)

        # Retornar los datos como respuesta JSON
        return jsonify(datos_convertidos), 200

    except Exception as e:
        # En caso de error, devolver un mensaje de error
        print(f"Error al obtener los datos del dashboard: {str(e)}")
        return jsonify({"error": str(e)}), 500
