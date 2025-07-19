#!/usr/bin/env python3
"""API routes for the Robot Simulator"""

import logging

from constants import HumanoidAction
from flask import jsonify, render_template, request, send_from_directory
from routes.validation import ValidationMixin

# Set up logger
logger = logging.getLogger(__name__)


class APIRoutes(ValidationMixin):
    def __init__(self, app, socketio, sessions_manager):
        self.app = app
        self.socketio = socketio
        self.sessions_manager = sessions_manager
        self.setup_routes()

    def setup_routes(self):
        @self.app.route("/")
        def index():
            session_key = request.args.get("session_key")
            if not session_key:
                return (
                    """
                <html><body>
                    <h1>🔐 Session Key Required</h1>
                    <form onsubmit="window.location.href='/?session_key=' + document.getElementById('session_input').value; return false;">
                        <input type="text" id="session_input" placeholder="Enter session ID" required>
                        <button type="submit">Connect</button>
                    </form>
                </body></html>
                """,
                    400,
                )

            self.sessions_manager.get_or_create_session(session_key)
            return render_template("index.html", session_key=session_key)

        @self.app.route("/static/<path:filename>")
        def static_files(filename):
            return send_from_directory("static", filename)

        @self.app.route("/favicon.ico")
        def favicon():
            return send_from_directory(
                "static", "favicon.ico", mimetype="image/vnd.microsoft.icon"
            )

        @self.app.route("/health")
        def health_check():
            return jsonify({"status": "healthy", "service": "robot-simulator"}), 200

        @self.app.route("/api/status")
        def get_status():
            session_key = self.get_session_key_from_request()

            if session_key:
                robots = self.sessions_manager.get_session_robots(session_key)
                return jsonify(
                    {
                        "server": "running",
                        "session_key": session_key,
                        "robots_count": len(robots),
                        "actions": [action.value for action in HumanoidAction],
                        "animating_robots": [
                            robot_id
                            for robot_id, robot in robots.items()
                            if robot.is_animating
                        ],
                    }
                )
            else:
                return jsonify(
                    {
                        "server": "running",
                        "total_sessions": len(self.sessions_manager.sessions),
                        "session_required": True,
                        "actions": [action.value for action in HumanoidAction],
                    }
                )

        @self.app.route("/proxy")
        def action_events_proxy():
            """Action Events Proxy Page - Subscribes to all WebSocket action events"""
            session_key = request.args.get("session_key")
            if not session_key:
                return (
                    "Session key required. Add ?session_key=YOUR_SESSION_ID to the URL.",
                    400,
                )

            return render_template("proxy.html", session_key=session_key)
