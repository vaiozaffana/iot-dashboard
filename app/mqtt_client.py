import paho.mqtt.client as mqtt
import json
import time
from threading import Thread
from pymongo import MongoClient
from app import socketio

# Koneksi MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["iot_db"]
collection = db["sensor_data"]

# Konfigurasi MQTT
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = "iot/sensor"

def on_connect(client, userdata, flags, rc):
    print("✅ MQTT connected with result code", rc)
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print("📩 Data diterima:", payload)

        # Simpan data ke MongoDB
        collection.insert_one({
            "topic": msg.topic,
            "payload": payload,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })

        # Kirim data ke frontend via WebSocket
        socketio.emit("sensor_update", payload)

        print("✅ Data tersimpan di database")

    except Exception as e:
        print("❌ Error parsing message:", e)

def start_mqtt(app, socketio):
    def mqtt_thread():
        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message

        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_forever()

    # Jalankan di thread terpisah supaya Flask tidak ter-block
    thread = Thread(target=mqtt_thread)
    thread.daemon = True
    thread.start()
