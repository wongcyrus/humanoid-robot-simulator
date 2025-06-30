#!/usr/bin/env python3
"""Robot management routes for the Robot Simulator"""

import logging
from flask import jsonify, request
from constants import DEFAULT_ROBOTS
from models.robot import Robot3D

# Set up logger
logger = logging.getLogger(__name__)


class RobotRoutes:
    """Robot management API routes"""

    def __init__(self, app, socketio, sessions_manager, validation_mixin):
        self.app = app
        self.socketio = socketio
        self.sessions_manager = sessions_manager
        self.validation_mixin = validation_mixin
        self.setup_robot_routes()

    def setup_robot_routes(self):
        """Set up all robot-related routes"""

        @self.app.route("/api/robots")
        def get_robots():
            session_key = self.validation_mixin.get_session_key_from_request()
            is_valid, error_msg = self.validation_mixin.validate_session_key(
                session_key
            )

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

        @self.app.route("/api/add_robot/<robot_id>", methods=["POST"])
        def add_robot(robot_id):
            try:
                session_key = self.validation_mixin.get_session_key_from_request()
                is_valid, error_msg = self.validation_mixin.validate_session_key(
                    session_key
                )
                if not is_valid:
                    return jsonify({"success": False, "error": error_msg}), 400

                robots = self.sessions_manager.get_session_robots(session_key)
                data = request.json or {}

                # Validate robot data
                is_valid_data, data_error = self.validation_mixin.validate_robot_data(
                    data
                )
                if not is_valid_data:
                    return jsonify({"success": False, "error": data_error}), 400

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

                logger.info(f"Robot {robot_id} added to session {session_key}")
                return jsonify(
                    {
                        "success": True,
                        "robot_id": robot_id,
                        "robot_data": robot.to_dict(),
                    }
                )
            except Exception as e:
                logger.error(f"Error in add_robot: {e}")
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/api/remove_robot/<robot_id>", methods=["DELETE"])
        def remove_robot(robot_id):
            try:
                session_key = self.validation_mixin.get_session_key_from_request()
                is_valid, error_msg = self.validation_mixin.validate_session_key(
                    session_key
                )
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
                    logger.info(f"All robots removed from session {session_key}")
                    return jsonify({"success": True, "removed_robots": removed_robots})
                elif robot_id in robots:
                    del robots[robot_id]
                    self.socketio.emit(
                        "robot_removed",
                        {"removed_robot": robot_id},
                        room=f"session_{session_key}",
                    )
                    logger.info(f"Robot {robot_id} removed from session {session_key}")
                    return jsonify({"success": True, "robot_id": robot_id})
                else:
                    return (
                        jsonify(
                            {"success": False, "error": f"Robot {robot_id} not found"}
                        ),
                        404,
                    )
            except Exception as e:
                logger.error(f"Error in remove_robot: {e}")
                return jsonify({"success": False, "error": str(e)}), 500

        @self.app.route("/api/reset_robots", methods=["POST"])
        def reset_robots():
            try:
                session_key = self.validation_mixin.get_session_key_from_request()
                is_valid, error_msg = self.validation_mixin.validate_session_key(
                    session_key
                )
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
                logger.info(
                    f"Robots reset to default configuration for session {session_key}"
                )
                return jsonify({"success": True, "robots": robot_states})
            except Exception as e:
                logger.error(f"Error in reset_robots: {e}")
                return jsonify({"success": False, "error": str(e)}), 500
