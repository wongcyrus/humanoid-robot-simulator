#!/usr/bin/env python3
"""Validation utilities for the Robot Simulator API"""

import logging
from flask import request

# Set up logger
logger = logging.getLogger(__name__)


class ValidationMixin:
    """Mixin class providing validation methods for API routes"""

    def get_session_key_from_request(self):
        """Extract session key from request arguments"""
        return request.args.get("session_key")

    def validate_session_key(self, session_key):
        """Validate session key and return validation result"""
        if not session_key:
            return False, "Session key required. Add ?session_key=YOUR_SESSION_ID"
        if len(session_key.strip()) == 0:
            return False, "Session key cannot be empty"
        return True, None

    def validate_robot_data(self, data):
        """Validate robot data for creation/updates"""
        if not isinstance(data, dict):
            return False, "Robot data must be a JSON object"

        # Validate position if provided
        position = data.get("position", [0, 0, 0])
        if not isinstance(position, list) or len(position) != 3:
            return False, "Position must be an array of 3 numbers [x, y, z]"

        if not all(isinstance(x, (int, float)) for x in position):
            return False, "Position coordinates must be numbers"

        # Validate color if provided
        color = data.get("color", "#4A90E2")
        if not isinstance(color, str) or not color.startswith("#"):
            return False, "Color must be a valid hex color (e.g., #FF0000)"

        return True, None
