from flask import Flask, g, jsonify, render_template, session
from flask_cors import CORS
import pymysql
from config import Config

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(Config)
    CORS(app)

    # Función para obtener la conexión a la base de datos
    def obtener_conexion():
        if 'conexion_db' not in g:
            g.conexion_db = pymysql.connect(
                host=app.config['MYSQL_HOST'],
                user=app.config['MYSQL_USER'],
                password=app.config['MYSQL_PASSWORD'],
                db=app.config['MYSQL_DB'],
                
            )
        return g.conexion_db

    # Guardar la función de conexión dentro del contexto de Flask
    app.obtener_conexion = obtener_conexion

    # Cerrar la conexión automáticamente después de cada request
    @app.teardown_appcontext
    def cerrar_conexion_db(error=None):
        conexion = g.pop('conexion_db', None)
        if conexion is not None:
            conexion.close()

    # Registrar Blueprints
    from app.controllers.usuario_controlador import usuario_bp
    from app.controllers.promocion_controlador import promo_bp
    from app.controllers.paquete_controlador import paquete_bp
    from app.controllers.adquirir_paquete_controlador import adquirir_bp
    from app.controllers.reservas_controlador import reserva_bp
    from app.controllers.modificar_reserva_controlador import modificar_reserva_bp
    from app.controllers.dashboard_controlador import dashboard_bp
    from app.controllers.main_controlador import main

    app.register_blueprint(usuario_bp)
    app.register_blueprint(promo_bp)
    app.register_blueprint(paquete_bp)
    app.register_blueprint(adquirir_bp)
    app.register_blueprint(reserva_bp)
    app.register_blueprint(modificar_reserva_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(main)

    # Ruta /para los que no tiene controlador
    
    @app.route('/home')
    def home():
        return render_template('home.html')
    

    @app.route('/pagos')
    def pagos():
        return render_template('pagos.html') 
    
    @app.route('/logout', methods=['POST'])
    def logout():
        session.clear()
        return jsonify({"message": "Sesión cerrada correctamente"}), 200

    

    # Cabeceras anti-cache
    @app.after_request
    def agregar_cabeceras_no_cache(response):
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response

    return app
