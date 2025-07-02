#!/usr/bin/env python3
"""
Simple test server that responds with "ok" to all requests on port 9030
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import time
import logging
import requests


class RobotProxyHandler(BaseHTTPRequestHandler):
    last_post_time = 0

    def __init__(self, *args, **kwargs):
        # Set up logger for this instance
        self.logger = logging.getLogger(__name__)
        super().__init__(*args, **kwargs)

    def do_GET(self):
        """Handle GET requests"""
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        response = json.dumps({"status": "ok"})
        self.wfile.write(response.encode("utf-8"))

    def do_POST(self):
        """Handle POST requests"""
        current_time = time.time()
        if RobotProxyHandler.last_post_time != 0:
            diff = current_time - RobotProxyHandler.last_post_time
            print(f"Time since last POST: {diff:.3f} seconds")
        else:
            print("First POST request received")
        RobotProxyHandler.last_post_time = current_time
        """Handle POST requests"""
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8")
        print(f"Received POST body: {body}")
        # Forward the POST request to http://localhost:9030/ (the actual target)
        try:
            forward_headers = {
                "Content-Type": self.headers.get("Content-Type", "application/json"),
            }
            # Forward the body as-is to the intended target (different from current server port)
            forward_response = requests.post(
                "http://localhost:9030/",
                data=body,
                headers=forward_headers,
                timeout=5,
            )
            response = forward_response.text
        except Exception as e:
            print(f"Error forwarding POST request: {e}")
        response = json.dumps({"status": "ok"})
        self.wfile.write(response.encode("utf-8"))

    def do_PUT(self):
        """Handle PUT requests"""
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        response = json.dumps({"status": "ok"})
        self.wfile.write(response.encode("utf-8"))

    def do_DELETE(self):
        """Handle DELETE requests"""
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        response = json.dumps({"status": "ok"})
        self.wfile.write(response.encode("utf-8"))

    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS preflight"""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header(
            "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"
        )
        self.send_header("Access-Control-Allow-Headers", "Content-Type, deviceid")
        self.end_headers()

    def log_message(self, format, *args):
        """Log all requests"""
        print(f"[{self.address_string()}] {format % args}")


def run_server():
    """Start the test server"""
    # Set up logging
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
    )

    server_address = ("localhost", 9031)
    httpd = HTTPServer(server_address, RobotProxyHandler)
    print(f"Test server running on http://localhost:9031/")
    print("Responding with 'ok' to all requests")
    print("Press Ctrl+C to stop the server")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()


if __name__ == "__main__":
    run_server()
