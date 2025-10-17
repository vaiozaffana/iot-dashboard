import os
from flask import Flask
from flask_socketio import SocketIO
from .config import Config
from pymongo import MongoClient

socketio = SocketIO(cors_allowed_origins="*", async_mode="eventlet")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inisialisasi MongoDB
    mongo = MongoClient(app.config['MONGO_URI'])
    app.db = mongo.get_default_database()

    # Register blueprint API
    from .routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    # Inisialisasi SocketIO
    socketio.init_app(app)

    # Jalankan MQTT client di background
    from .mqtt_client import start_mqtt
    start_mqtt(app, socketio)

    return app
