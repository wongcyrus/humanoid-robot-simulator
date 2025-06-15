#!/usr/bin/env python3
"""Session management for the Robot Simulator"""

import time
from collections import defaultdict
from constants import DEFAULT_ROBOTS
from models.robot import Robot3D


class SessionManager:
    def __init__(self):
        self.sessions = defaultdict(dict)

    def get_or_create_session(self, session_key):
        if session_key not in self.sessions:
            robots = {}
            for config in DEFAULT_ROBOTS:
                robot = Robot3D(
                    config['id'], config['position'].copy(), config['color'])
                robots[config['id']] = robot

            self.sessions[session_key] = {
                'robots': robots,
                'clients': set(),
                'created_at': time.time()
            }
        return self.sessions[session_key]

    def get_session_robots(self, session_key):
        return self.get_or_create_session(session_key)['robots']

    def reset_session(self, session_key):
        """Reset all robots in a session to their initial positions and states"""
        if session_key in self.sessions:
            robots = self.sessions[session_key]['robots']
            for robot_id, robot in robots.items():
                # Find the default configuration for this robot
                default_config = next((config for config in DEFAULT_ROBOTS
                                       if config['id'] == robot_id), None)
                if default_config:
                    robot.reset_to_initial_state(
                        default_config['position'].copy())
        return self.get_session_robots(session_key)
