from flask import Blueprint, jsonify, render_template
from app.models.promocio_modelo import obtener_promociones_limitadas

promo_bp = Blueprint('promo_bp', __name__)

@promo_bp.route('/api/promociones', methods=['GET'])
def promociones_api():
    return obtener_promociones_api()

def home_controlador():
    promociones = obtener_promociones_limitadas(3)
    return render_template('home.html', promociones=promociones)

def obtener_promociones_api():
    promociones = obtener_promociones_limitadas(3)
    return jsonify([{'nombre': promo[0], 'descuento': promo[1]} for promo in promociones])
