from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId
import datetime

api_bp = Blueprint("api", __name__)

# Konversi ObjectId → string agar bisa di-JSON-kan
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

# ✅ [GET] Ambil semua data sensor
@api_bp.route("/sensor", methods=["GET"])
def get_all_sensor_data():
    try:
        collection = current_app.db["sensor_data"]
        data = list(collection.find().sort("_id", -1).limit(50))  # ambil 50 data terbaru
        return jsonify([serialize_doc(d) for d in data]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ [GET] Ambil 1 data terbaru
@api_bp.route("/sensor/latest", methods=["GET"])
def get_latest_sensor_data():
    try:
        collection = current_app.db["sensor_data"]
        data = collection.find_one(sort=[("_id", -1)])
        if data:
            return jsonify(serialize_doc(data)), 200
        else:
            return jsonify({"message": "Belum ada data"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ [POST] Tambah data sensor manual (jika mau test)
@api_bp.route("/sensor", methods=["POST"])
def add_sensor_data():
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "Payload kosong"}), 400

        collection = current_app.db["sensor_data"]
        payload["timestamp"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        result = collection.insert_one(payload)

        # Kirimkan ke semua client WebSocket
        from app import socketio
        socketio.emit("sensor_update", payload)

        return jsonify({"message": "Data berhasil disimpan", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ [DELETE] Hapus semua data (opsional, untuk debug)
@api_bp.route("/sensor", methods=["DELETE"])
def delete_all_sensor_data():
    try:
        collection = current_app.db["sensor_data"]
        result = collection.delete_many({})
        return jsonify({"message": f"{result.deleted_count} data dihapus"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
