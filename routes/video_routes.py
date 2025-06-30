#!/usr/bin/env python3
"""Video management routes for the Robot Simulator"""

import logging
from flask import jsonify, request

# Set up logger
logger = logging.getLogger(__name__)


class VideoRoutes:
    """Video control API routes"""

    def __init__(self, app, socketio, sessions_manager, validation_mixin):
        self.app = app
        self.socketio = socketio
        self.sessions_manager = sessions_manager
        self.validation_mixin = validation_mixin
        self.setup_video_routes()

    def setup_video_routes(self):
        """Set up all video-related routes"""

        @self.app.route("/api/video/change_source", methods=["POST"])
        def change_video_source():
            """Change the video source for the 3D scene"""
            try:
                session_key = self.validation_mixin.get_session_key_from_request()
                is_valid, error_msg = self.validation_mixin.validate_session_key(
                    session_key
                )
                if not is_valid:
                    return jsonify({"success": False, "error": error_msg}), 400

                data = request.json or {}
                video_src = data.get("video_src")

                if not video_src:
                    return (
                        jsonify({"success": False, "error": "video_src is required"}),
                        400,
                    )

                # Emit video source change to all clients in the session
                self.socketio.emit(
                    "video_source_changed",
                    {"video_src": video_src, "session_key": session_key},
                    room=f"session_{session_key}",
                )

                logger.info(
                    f"Video source changed to {video_src} for session {session_key}"
                )
                return jsonify(
                    {
                        "success": True,
                        "video_src": video_src,
                        "session_key": session_key,
                        "message": f"Video source changed to: {video_src}",
                    }
                )

            except Exception as e:
                logger.error(f"Error in change_video_source: {e}")
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/api/video/control", methods=["POST"])
        def control_video():
            """Control video playback (play, pause, toggle)"""
            try:
                session_key = self.validation_mixin.get_session_key_from_request()
                is_valid, error_msg = self.validation_mixin.validate_session_key(
                    session_key
                )
                if not is_valid:
                    return jsonify({"success": False, "error": error_msg}), 400

                data = request.json or {}
                action = data.get("action")

                if action not in ["play", "pause", "toggle"]:
                    return (
                        jsonify(
                            {
                                "success": False,
                                "error": "action must be one of: play, pause, toggle",
                            }
                        ),
                        400,
                    )

                # Emit video control to all clients in the session
                self.socketio.emit(
                    "video_control",
                    {"action": action, "session_key": session_key},
                    room=f"session_{session_key}",
                )

                logger.info(f"Video {action} command sent for session {session_key}")
                return jsonify(
                    {
                        "success": True,
                        "action": action,
                        "session_key": session_key,
                        "message": f"Video {action} command sent",
                    }
                )

            except Exception as e:
                logger.error(f"Error in control_video: {e}")
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/api/video/status")
        def get_video_status():
            """Get current video status information"""
            try:
                session_key = self.validation_mixin.get_session_key_from_request()
                is_valid, error_msg = self.validation_mixin.validate_session_key(
                    session_key
                )
                if not is_valid:
                    return jsonify({"success": False, "error": error_msg}), 400

                return jsonify(
                    {
                        "success": True,
                        "session_key": session_key,
                        "available_videos": [
                            "/static/video/prog-video-01.mp4",
                            # Additional video sources can be added here
                        ],
                        "supported_actions": ["play", "pause", "toggle"],
                        "supported_endpoints": {
                            "change_source": "/api/video/change_source",
                            "control": "/api/video/control",
                        },
                    }
                )

            except Exception as e:
                logger.error(f"Error in get_video_status: {e}")
                return jsonify({"success": False, "error": str(e)}), 500
