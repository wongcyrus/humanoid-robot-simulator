#!/usr/bin/env python3
"""CORS handling utilities for the Robot Simulator API"""

from flask import jsonify


class CORSMixin:
    """Mixin class providing CORS handling methods for API routes"""

    def setup_cors_handlers(self):
        """Configure CORS handlers for cross-origin requests"""

        @self.app.before_request
        def handle_preflight():
            from flask import request

            if request.method == "OPTIONS":
                response = jsonify({"status": "OK"})
                self._add_cors_headers(response)
                return response

        @self.app.after_request
        def after_request(response):
            self._add_cors_headers(response)
            return response

    def _add_cors_headers(self, response):
        """Add CORS headers to response"""
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add(
            "Access-Control-Allow-Headers",
            "Content-Type,Authorization,X-Requested-With",
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
