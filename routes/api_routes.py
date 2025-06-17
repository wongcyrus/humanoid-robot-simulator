#!/usr/bin/env python3
"""API routes for the Robot Simulator"""

from constants import DEFAULT_ROBOTS, HumanoidAction
from flask import jsonify, render_template, request, send_from_directory
from models.robot import Robot3D


class APIRoutes:
    def __init__(self, app, socketio, sessions_manager):
        self.app = app
        self.socketio = socketio
        self.sessions_manager = sessions_manager
        self.setup_routes()

    def get_session_key_from_request(self):
        return request.args.get("session_key")

    def validate_session_key(self, session_key):
        if not session_key:
            return False, "Session key required. Add ?session_key=YOUR_SESSION_ID"
        return True, None

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

        @self.app.route("/health")
        def health_check():
            return jsonify({"status": "healthy", "service": "robot-simulator"}), 200

        @self.app.route("/api/robots")
        def get_robots():
            session_key = self.get_session_key_from_request()
            is_valid, error_msg = self.validate_session_key(session_key)

            if not is_valid:
                return jsonify({"success": False, "error": error_msg}), 400

            robots = self.sessions_manager.get_session_robots(session_key)
            return jsonify(
                {
                    "success": True,
                    "session_key": session_key,
                    "robot_count": len(robots),
                    "robots": {
                        robot_id: robot.to_dict() for robot_id, robot in robots.items()
                    },
                }
            )

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

        @self.app.route("/api/add_robot/<robot_id>", methods=["POST"])
        def add_robot(robot_id):
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                if not is_valid:
                    return jsonify({"success": False, "error": error_msg}), 400

                robots = self.sessions_manager.get_session_robots(session_key)
                data = request.json or {}

                if robot_id in robots:
                    return (
                        jsonify(
                            {
                                "success": False,
                                "error": f"Robot {robot_id} already exists",
                            }
                        ),
                        400,
                    )

                robot = Robot3D(
                    robot_id,
                    data.get("position", [0, 0, 0]),
                    data.get("color", "#4A90E2"),
                )
                robots[robot_id] = robot

                self.socketio.emit(
                    "robot_added",
                    {"robot_id": robot_id, "robot_data": robot.to_dict()},
                    room=f"session_{session_key}",
                )

                return jsonify(
                    {
                        "success": True,
                        "robot_id": robot_id,
                        "robot_data": robot.to_dict(),
                    }
                )
            except Exception as e:
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/api/remove_robot/<robot_id>", methods=["DELETE"])
        def remove_robot(robot_id):
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                if not is_valid:
                    return jsonify({"success": False, "error": error_msg}), 400

                robots = self.sessions_manager.get_session_robots(session_key)

                if robot_id == "all":
                    removed_robots = list(robots.keys())
                    robots.clear()
                    self.socketio.emit(
                        "robots_removed_all",
                        {"removed_robots": removed_robots},
                        room=f"session_{session_key}",
                    )
                    return jsonify({"success": True, "removed_robots": removed_robots})
                elif robot_id in robots:
                    del robots[robot_id]
                    self.socketio.emit(
                        "robot_removed",
                        {"removed_robot": robot_id},
                        room=f"session_{session_key}",
                    )
                    return jsonify({"success": True, "robot_id": robot_id})
                else:
                    return (
                        jsonify(
                            {"success": False, "error": f"Robot {robot_id} not found"}
                        ),
                        404,
                    )
            except Exception as e:
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/api/reset_robots", methods=["POST"])
        def reset_robots():
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                if not is_valid:
                    return jsonify({"success": False, "error": error_msg}), 400

                robots = self.sessions_manager.get_session_robots(session_key)
                robots.clear()

                for config in DEFAULT_ROBOTS:
                    robot = Robot3D(
                        config["id"], config["position"].copy(), config["color"]
                    )
                    robots[config["id"]] = robot

                robot_states = {
                    robot_id: robot.to_dict() for robot_id, robot in robots.items()
                }
                self.socketio.emit(
                    "robots_reset",
                    {"robots": robot_states},
                    room=f"session_{session_key}",
                )
                return jsonify({"success": True, "robots": robot_states})
            except Exception as e:
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/run_action/<robot_id>", methods=["POST"])
        def run_action(robot_id):
            """Run action on a specific robot or all robots"""
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                if not is_valid:
                    return jsonify({"success": False, "error": error_msg}), 400

                data = request.json or {}
                action = data.get("action")

                if not action:
                    return (
                        jsonify({"success": False, "error": "Action is required"}),
                        400,
                    )

                robots = self.sessions_manager.get_session_robots(session_key)

                if robot_id == "all":
                    # Control all robots
                    if not robots:
                        return (
                            jsonify(
                                {
                                    "success": False,
                                    "error": "No robots found in session",
                                }
                            ),
                            404,
                        )

                    # Execute action on all robots
                    for robot in robots.values():
                        robot.start_action(action)

                    self.socketio.emit(
                        "actions",
                        {
                            "session_key": session_key,
                            "action_name": action,
                            "robot_id": "all",
                        },
                        room=f"session_{session_key}",
                    )

                    # Emit to all connected clients in the session
                    robot_states = {
                        rid: robot.to_dict() for rid, robot in robots.items()
                    }
                    self.socketio.emit(
                        "robot_states", robot_states, room=f"session_{session_key}"
                    )

                    return jsonify(
                        {
                            "success": True,
                            "robot_id": "all",
                            "action": action,
                            "robots_affected": list(robots.keys()),
                            "message": f'Action "{action}" executed on all robots',
                        }
                    )

                else:
                    # Control individual robot
                    if robot_id not in robots:
                        return (
                            jsonify(
                                {
                                    "success": False,
                                    "error": f"Robot {robot_id} not found",
                                }
                            ),
                            404,
                        )

                    # Execute action on specific robot
                    robots[robot_id].start_action(action)

                    self.socketio.emit(
                        "actions",
                        {
                            "session_key": session_key,
                            "action_name": action,
                            "robot_id": robot_id,
                        },
                        room=f"session_{session_key}",
                    )

                    # Emit to all connected clients in the session
                    robot_states = {
                        rid: robot.to_dict() for rid, robot in robots.items()
                    }
                    self.socketio.emit(
                        "robot_states", robot_states, room=f"session_{session_key}"
                    )

                    return jsonify(
                        {
                            "success": True,
                            "robot_id": robot_id,
                            "action": action,
                            "robot_data": robots[robot_id].to_dict(),
                            "message": f'Action "{action}" executed on robot {robot_id}',
                        }
                    )

            except Exception as e:
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/api/video/change_source", methods=["POST"])
        def change_video_source():
            """Change the video source for the 3D scene"""
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
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

                return jsonify(
                    {
                        "success": True,
                        "video_src": video_src,
                        "session_key": session_key,
                        "message": f"Video source changed to: {video_src}",
                    }
                )

            except Exception as e:
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/api/video/control", methods=["POST"])
        def control_video():
            """Control video playback (play, pause, toggle)"""
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
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

                return jsonify(
                    {
                        "success": True,
                        "action": action,
                        "session_key": session_key,
                        "message": f"Video {action} command sent",
                    }
                )

            except Exception as e:
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/api/video/status")
        def get_video_status():
            """Get current video status information"""
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                if not is_valid:
                    return jsonify({"success": False, "error": error_msg}), 400

                # For now, return basic status. In a more advanced implementation,
                # you could track the current video source in the session
                return jsonify(
                    {
                        "success": True,
                        "session_key": session_key,
                        "available_videos": [
                            "/static/video/prog-video-01.mp4",
                            # Add more video paths here as needed
                        ],
                        "supported_actions": ["play", "pause", "toggle"],
                    }
                )

            except Exception as e:
                return jsonify({"success": False, "error": str(e)}), 500

        # CORS preflight handler
        @self.app.before_request
        def handle_preflight():
            if request.method == "OPTIONS":
                response = jsonify({"status": "OK"})
                response.headers.add("Access-Control-Allow-Origin", "*")
                response.headers.add(
                    "Access-Control-Allow-Headers",
                    "Content-Type,Authorization,X-Requested-With",
                )
                response.headers.add(
                    "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
                )
                return response

        @self.app.after_request
        def after_request(response):
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add(
                "Access-Control-Allow-Headers",
                "Content-Type,Authorization,X-Requested-With",
            )
            response.headers.add(
                "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
            )
            return response
