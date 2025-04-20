from flask import Flask
import pymysql.cursors
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        passwd=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB'],
        cursorclass=pymysql.cursors.DictCursor
    )

    from app.controllers.main_controllers import main
    app.register_blueprint(main)

    app.connection = connection

    return app