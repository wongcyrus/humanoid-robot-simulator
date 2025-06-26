#!/usr/bin/env python3
"""Main application entry point for the Robot Simulator"""

import os
import sys
import logging

from server.websocket_server import RobotWebSocketServer


def main():
    # Use PORT environment variable for Cloud Run, fallback to command line arg or default
    port = int(os.environ.get("PORT", sys.argv[1] if len(sys.argv) > 1 else 5000))

    # Log startup information
    logger = logging.getLogger(__name__)
    logger.info(f"🚀 Starting Robot Simulator on port {port}")

    server = RobotWebSocketServer(port)
    server.run()


if __name__ == "__main__":
    main()
