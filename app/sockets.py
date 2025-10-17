from flask_socketio import emit, join_room, leave_room
from . import socketio

# Namespace '/ws' used for frontend
@socketio.on('connect', namespace='/ws')
def handle_connect():
    print("Client connected")

@socketio.on('disconnect', namespace='/ws')
def handle_disconnect():
    print("Client disconnected")

@socketio.on('subscribe_device', namespace='/ws')
def handle_subscribe(data):
    # data: {"device_id": "dev1"}
    device_id = data.get('device_id')
    if device_id:
        join_room(device_id)
        print("Joined room", device_id)
