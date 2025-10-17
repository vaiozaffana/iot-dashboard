import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "secret")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/iot_dashboard")
    MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
    MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
    MQTT_USERNAME = os.getenv("MQTT_USERNAME", None)
    MQTT_PASSWORD = os.getenv("MQTT_PASSWORD", None)
