from flask import Blueprint, request, jsonify, current_app
import time

devices_bp = Blueprint('devices', __name__)

@devices_bp.route('/devices', methods=['GET'])
def list_devices():
    """Menampilkan semua device terdaftar."""
    db = current_app.db
    devices = list(db.devices.find({}, {"_id": 0}))
    return jsonify(devices)

@devices_bp.route('/devices', methods=['POST'])
def register_device():
    """Menambahkan device baru ke database."""
    data = request.get_json()
    device_id = data.get("device_id")
    name = data.get("name", f"Device {device_id}")
    location = data.get("location", "Unknown")

    if not device_id:
        return jsonify({"error": "device_id is required"}), 400

    db = current_app.db
    existing = db.devices.find_one({"device_id": device_id})
    if existing:
        return jsonify({"message": "Device already exists"}), 200

    db.devices.insert_one({
        "device_id": device_id,
        "name": name,
        "location": location,
        "status": "offline",
        "last_seen": None,
        "created_at": time.time()
    })

    return jsonify({"message": "Device registered successfully"}), 201

@devices_bp.route('/devices/<device_id>', methods=['GET'])
def get_device(device_id):
    """Mengambil data 1 device berdasarkan ID."""
    db = current_app.db
    device = db.devices.find_one({"device_id": device_id}, {"_id": 0})
    if not device:
        return jsonify({"error": "Device not found"}), 404
    return jsonify(device)

@devices_bp.route('/devices/<device_id>', methods=['DELETE'])
def delete_device(device_id):
    """Menghapus device."""
    db = current_app.db
    result = db.devices.delete_one({"device_id": device_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Device not found"}), 404
    return jsonify({"message": "Device deleted"}), 200
