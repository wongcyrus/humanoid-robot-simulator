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
