#!/usr/bin/env python3
"""Robot 3D model and related functionality"""

import time
import threading
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

        # Movement calculations removed - let client handle all positioning/rotation
        if action in MOVEMENT_ACTIONS:
            self.movement_count += 1

        threading.Thread(target=self._complete_action,
                         args=(duration,), daemon=True).start()

    def _complete_action(self, duration):
        time.sleep(duration)
        self.is_animating = False
        if self.current_action != HumanoidAction.IDLE:
            self.current_action = HumanoidAction.IDLE

    def reset_to_initial_state(self, initial_position):
        """Reset robot to initial position and state"""
        self.position = initial_position
        # Reset rotation to face forward (default orientation)
        self.rotation = [0, 0, 0]
        self.current_action = HumanoidAction.IDLE
        self.action_progress = 0.0
        self.is_visible = True
        self.is_animating = False
        self.movement_count = 0
