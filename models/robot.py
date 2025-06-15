#!/usr/bin/env python3
"""Robot 3D model and related functionality"""

import time
import threading
import math
from constants import HumanoidAction, ACTION_DURATIONS, MOVEMENT_ACTIONS


class Robot3D:
    def __init__(self, robot_id, position, color):
        self.robot_id = robot_id
        self.position = position
        self.rotation = [0, 0, 0]
        self.color = color
        self.current_action = HumanoidAction.IDLE
        self.action_progress = 0.0
        self.is_visible = True
        self.is_animating = False
        self.movement_count = 0

    def to_dict(self):
        return {
            'robot_id': self.robot_id,
            'position': self.position,
            'rotation': self.rotation,
            'color': self.color,
            'current_action': self.current_action.value,
            'action_progress': self.action_progress,
            'is_visible': self.is_visible,
            'is_animating': self.is_animating,
            'movement_count': self.movement_count,
            'body_parts': {part: {'x': 0, 'y': 0, 'z': 0}
                           for part in ['head', 'torso', 'left_arm', 'right_arm', 'left_leg', 'right_leg']}
        }

    def start_action(self, action):
        if isinstance(action, str):
            try:
                action = HumanoidAction(action.lower())
            except ValueError:
                action = HumanoidAction.IDLE

        self.current_action = action
        self.action_progress = 0.0
        self.is_animating = True
        duration = ACTION_DURATIONS.get(action.value, 2)

        if action in MOVEMENT_ACTIONS:
            self._handle_movement(action)
            self.movement_count += 1

        threading.Thread(target=self._complete_action,
                         args=(duration,), daemon=True).start()

    def _handle_movement(self, action):
        rotation_y = self.rotation[1]

        movement_map = {
            HumanoidAction.GO_FORWARD: (math.sin(rotation_y) * 30, math.cos(rotation_y) * 30),
            HumanoidAction.GO_BACKWARD: (-math.sin(rotation_y) * 20, -math.cos(rotation_y) * 20),
            HumanoidAction.BACK_FAST: (-math.sin(rotation_y) * 35, -math.cos(rotation_y) * 35),
            HumanoidAction.RIGHT_MOVE_FAST: (math.cos(rotation_y) * 25, -math.sin(rotation_y) * 25),
            HumanoidAction.LEFT_MOVE_FAST: (-math.cos(rotation_y) * 25, math.sin(rotation_y) * 25),
        }

        if action in movement_map:
            dx, dz = movement_map[action]
            self.position[0] += dx
            self.position[2] += dz
        elif action == HumanoidAction.TURN_LEFT:
            self.rotation[1] += math.pi / 2
        elif action == HumanoidAction.TURN_RIGHT:
            self.rotation[1] -= math.pi / 2

    def _complete_action(self, duration):
        time.sleep(duration)
        self.is_animating = False
        if self.current_action != HumanoidAction.IDLE:
            self.current_action = HumanoidAction.IDLE
