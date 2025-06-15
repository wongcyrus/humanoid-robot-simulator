#!/usr/bin/env python3
"""Main WebSocket server for the Robot Simulator"""

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from server.session_manager import SessionManager
from routes.api_routes import APIRoutes
from handlers.websocket_handlers import WebSocketHandlers


class RobotWebSocketServer:
    def __init__(self, port=5000):
        self.port = port
        self.app = Flask(__name__, template_folder='../templates',
                         static_folder='../static')
        CORS(self.app)
        self.socketio = SocketIO(
            self.app, cors_allowed_origins="*", logger=False, engineio_logger=False)

        # Initialize components
        self.sessions_manager = SessionManager()
        self.api_routes = APIRoutes(
            self.app, self.socketio, self.sessions_manager)
        self.websocket_handlers = WebSocketHandlers(
            self.socketio, self.sessions_manager)

    def run(self):
        print(f"🚀 Robot WebSocket Server on port {self.port}")
        print(f"🌐 URL: http://localhost:{self.port}/?session_key=YOUR_SESSION")
        try:
            self.socketio.run(self.app, host='0.0.0.0', port=self.port,
                              debug=False, allow_unsafe_werkzeug=True)
        except Exception as e:
            print(f"❌ Server error: {e}")
