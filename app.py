#!/usr/bin/env python3
"""Main application entry point for the Robot Simulator"""

import sys
from server.websocket_server import RobotWebSocketServer


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
    server = RobotWebSocketServer(port)
    server.run()


if __name__ == '__main__':
    main()
