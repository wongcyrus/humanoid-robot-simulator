#!/usr/bin/env python3
"""Main WebSocket server for the Robot Simulator"""

import os
import logging
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from handlers.websocket_handlers import WebSocketHandlers
from routes.api_routes import APIRoutes
from routes.robot_routes import RobotRoutes
from routes.action_routes import ActionRoutes
from routes.video_routes import VideoRoutes
from server.session_manager import SessionManager


def setup_logging():
    """Configure logging based on environment variables"""
    log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
    debug_mode = os.environ.get("DEBUG", "False").lower() in ("true", "1", "yes", "on")

    # If DEBUG is set to true, override log level to DEBUG
    if debug_mode:
        log_level = "DEBUG"

    numeric_level = getattr(logging, log_level, logging.INFO)

    # Configure root logger
    logging.basicConfig(
        level=numeric_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(),  # Console output
        ],
    )

    # Set specific loggers if needed
    if debug_mode:
        logging.getLogger("werkzeug").setLevel(logging.DEBUG)
        logging.getLogger("socketio").setLevel(logging.DEBUG)
        logging.getLogger("engineio").setLevel(logging.DEBUG)

    logger = logging.getLogger(__name__)
    logger.info(f"🔧 Logging configured - Level: {log_level}, Debug: {debug_mode}")
    return logger


class RobotWebSocketServer:
    def __init__(self, port=5000):
        # Setup logging first
        self.logger = setup_logging()

        self.port = port
        self.app = Flask(
            __name__, template_folder="../templates", static_folder="../static"
        )

        # Get debug mode from environment
        debug_mode = os.environ.get("DEBUG", "False").lower() in (
            "true",
            "1",
            "yes",
            "on",
        )

        # Configure CORS manually to avoid conflicts with Cloud Run
        # Note: Flask-CORS is disabled to prevent duplicate headers
        # CORS(
        #     self.app,
        #     origins=["*"],
        #     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        #     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        #     supports_credentials=False,
        #     send_wildcard=True,
        #     automatic_options=True
        # )

        # Configure SocketIO with debug settings
        self.socketio = SocketIO(
            self.app,
            cors_allowed_origins="*",
            cors_credentials=False,
            logger=debug_mode,  # Enable SocketIO logging in debug mode
            engineio_logger=debug_mode,  # Enable EngineIO logging in debug mode
        )

        # Initialize components
        self.sessions_manager = SessionManager()
        self.api_routes = APIRoutes(self.app, self.socketio, self.sessions_manager)
        self.robot_routes = RobotRoutes(
            self.app, self.socketio, self.sessions_manager, self.api_routes
        )
        self.action_routes = ActionRoutes(
            self.app, self.socketio, self.sessions_manager, self.api_routes
        )
        self.video_routes = VideoRoutes(
            self.app, self.socketio, self.sessions_manager, self.api_routes
        )
        self.websocket_handlers = WebSocketHandlers(
            self.socketio, self.sessions_manager
        )

        # Add manual CORS handling to prevent duplicate headers
        @self.app.before_request
        def handle_preflight():
            from flask import request

            if request.method == "OPTIONS":
                from flask import make_response

                response = make_response()
                response.headers["Access-Control-Allow-Origin"] = "*"
                response.headers["Access-Control-Allow-Methods"] = (
                    "GET, POST, PUT, DELETE, OPTIONS"
                )
                response.headers["Access-Control-Allow-Headers"] = (
                    "Content-Type, Authorization, X-Requested-With"
                )
                response.headers["Access-Control-Max-Age"] = "3600"
                return response

        @self.app.after_request
        def after_request(response):
            # Remove any existing CORS headers to prevent duplicates
            headers_to_remove = [
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Methods",
                "Access-Control-Allow-Headers",
                "Access-Control-Allow-Credentials",
            ]

            for header in headers_to_remove:
                if header in response.headers:
                    response.headers.pop(header, None)

            # Set our own CORS headers
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = (
                "GET, POST, PUT, DELETE, OPTIONS"
            )
            response.headers["Access-Control-Allow-Headers"] = (
                "Content-Type, Authorization, X-Requested-With"
            )
            response.headers["Access-Control-Max-Age"] = "3600"

            return response

    def run(self):
        debug_mode = os.environ.get("DEBUG", "False").lower() in (
            "true",
            "1",
            "yes",
            "on",
        )

        self.logger.info(f"🚀 Robot WebSocket Server starting on port {self.port}")
        self.logger.info(
            f"🌐 URL: http://localhost:{self.port}/?session_key=YOUR_SESSION"
        )
        self.logger.info(f"🔧 Debug mode: {debug_mode}")

        try:
            self.socketio.run(
                self.app,
                host="0.0.0.0",
                port=self.port,
                debug=debug_mode,  # Use environment-based debug setting
                allow_unsafe_werkzeug=True,
            )
        except Exception as e:
            self.logger.error(f"❌ Server error: {e}")
            print(f"❌ Server error: {e}")
