import time
import os
from pymongo import MongoClient

# Ambil URI MongoDB dari environment variable (.env) atau default lokal
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')

# Inisialisasi koneksi MongoDB
client = MongoClient(MONGO_URI)
db = client['iot_database']  # ini yang penting: objek db


class DeviceModel:
    def __init__(self, db):
        self.collection = db.devices

    def register(self, device_id, name=None, location=None):
        if not device_id:
            raise ValueError("device_id required")
        existing = self.collection.find_one({"device_id": device_id})
        if existing:
            return existing

        doc = {
            "device_id": device_id,
            "name": name or f"Device {device_id}",
            "location": location or "Unknown",
            "status": "offline",
            "last_seen": None,
            "created_at": time.time()
        }
        self.collection.insert_one(doc)
        return doc

    def update_status(self, device_id, status):
        self.collection.update_one(
            {"device_id": device_id},
            {"$set": {"status": status, "last_seen": time.time()}},
            upsert=True
        )

    def list(self):
        return list(self.collection.find({}, {"_id": 0}))

class SensorHistoryModel:
    def __init__(self, db):
        self.collection = db.sensor_history

    def add(self, device_id, sensor_type, data):
        doc = {
            "device_id": device_id,
            "sensor_type": sensor_type,
            "data": data,
            "received_at": time.time()
        }
        self.collection.insert_one(doc)

    def latest(self, device_id, limit=50):
        cursor = self.collection.find({"device_id": device_id}).sort("received_at", -1).limit(limit)
        return list(cursor)
