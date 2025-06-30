#!/usr/bin/env python3
"""Action handling routes for the Robot Simulator"""

import logging
from flask import jsonify, request
from routes.session_utils import decrypt, send_request

# Set up logger
logger = logging.getLogger(__name__)


class ActionRoutes:
    """Robot action execution API routes"""

    def __init__(self, app, socketio, sessions_manager, validation_mixin):
        self.app = app
        self.socketio = socketio
        self.sessions_manager = sessions_manager
        self.validation_mixin = validation_mixin
        self.setup_action_routes()

    def setup_action_routes(self):
        """Set up all action-related routes"""

        @self.app.route("/run_action/<robot_id>", methods=["POST"])
        def run_action(robot_id: str):
            """Run action on a specific robot or all robots"""
            try:
                session_key = self.validation_mixin.get_session_key_from_request()
                is_valid, error_msg = self.validation_mixin.validate_session_key(
                    session_key
                )
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
                    return self._handle_all_robots_action(session_key, robots, action)
                else:
                    return self._handle_single_robot_action(
                        session_key, robots, robot_id, action
                    )

            except Exception as e:
                logger.error(f"Error in run_action: {e}")
                return jsonify({"success": False, "error": str(e)}), 500

    def _handle_all_robots_action(self, session_key, robots, action):
        """Handle action execution on all robots"""
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

        # Handle real robot integration
        self._send_real_robot_commands(session_key, robots, action, "all")

        # Emit WebSocket events
        self._emit_action_events(session_key, action, "all", robots)

        return jsonify(
            {
                "success": True,
                "robot_id": "all",
                "action": action,
                "robots_affected": list(robots.keys()),
                "message": f'Action "{action}" executed on all robots',
            }
        )

    def _handle_single_robot_action(self, session_key, robots, robot_id, action):
        """Handle action execution on a single robot"""
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

        # Handle real robot integration
        self._send_real_robot_commands(session_key, robots, action, robot_id)

        # Emit WebSocket events
        self._emit_action_events(session_key, action, robot_id, robots)

        return jsonify(
            {
                "success": True,
                "robot_id": robot_id,
                "action": action,
                "robot_data": robots[robot_id].to_dict(),
                "message": f'Action "{action}" executed on robot {robot_id}',
            }
        )

    def _send_real_robot_commands(self, session_key, robots, action, target_robot_id):
        """Send commands to real robots if session is valid"""
        real_robot_session = decrypt(session_key)
        if not real_robot_session or not real_robot_session.get("is_valid"):
            return

        if target_robot_id == "all" and real_robot_session.get("robot") == "all":
            # Send action to all robots via the external API
            for robot in robots.values():
                robot_data = robot.to_dict()
                logger.info(
                    f"Sending action {action} to robot {robot_data['robot_id']}"
                )
                send_request(
                    method="RunAction", robot_id=robot_data["robot_id"], action=action
                )
        elif real_robot_session.get("robot") == target_robot_id:
            logger.info(f"Sending action {action} to robot {target_robot_id}")
            send_request(method="RunAction", robot_id=target_robot_id, action=action)

    def _emit_action_events(self, session_key, action, robot_id, robots):
        """Emit WebSocket events for action execution"""
        # Emit action event
        self.socketio.emit(
            "actions",
            {
                "session_key": session_key,
                "action_name": action,
                "robot_id": robot_id,
            },
            room=f"session_{session_key}",
        )

        # Emit robot states update
        robot_states = {rid: robot.to_dict() for rid, robot in robots.items()}
        self.socketio.emit("robot_states", robot_states, room=f"session_{session_key}")
