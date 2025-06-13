#!/usr/bin/env python3
"""
Clean WebSocket Server Implementation
Completely rewritten to fix WebSocket handler issues
"""

from flask import Flask, render_template, send_from_directory, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import time
import threading
from enum import Enum

# Humanoid Actions
class HumanoidAction(Enum):
    IDLE = "idle"
    DANCE = "dance"
    WAVE = "wave"
    KUNG_FU = "kung_fu"
    JUMP = "jump"
    GO_FORWARD = "go_forward"

class Robot3D:
    def __init__(self, robot_id, position, color):
        self.robot_id = robot_id
        self.position = position
        self.color = color
        self.current_action = HumanoidAction.IDLE
        self.action_progress = 0.0
        
    def to_dict(self):
        return {
            'robot_id': self.robot_id,
            'position': self.position,
            'rotation': [0, 0, 0],
            'color': self.color,
            'current_action': self.current_action.value,
            'action_progress': self.action_progress,
            'body_parts': {
                'head': {'x': 0, 'y': 0, 'z': 0},
                'torso': {'x': 0, 'y': 0, 'z': 0},
                'left_arm': {'x': 0, 'y': 0, 'z': 0},
                'right_arm': {'x': 0, 'y': 0, 'z': 0},
                'left_leg': {'x': 0, 'y': 0, 'z': 0},
                'right_leg': {'x': 0, 'y': 0, 'z': 0}
            }
        }
    
    def start_action(self, action):
        self.current_action = action
        self.action_progress = 0.0
        print(f"🤖 {self.robot_id}: Started action {action.value}")

class CleanWebSocketServer:
    def __init__(self, port=5000):
        self.port = port
        
        # Create Flask app
        self.app = Flask(__name__, template_folder='templates', static_folder='static')
        CORS(self.app)
        
        # Create SocketIO instance
        self.socketio = SocketIO(self.app, cors_allowed_origins="*", logger=True, engineio_logger=True)
        
        # Initialize robots
        self.robots = {
            'robot_1': Robot3D('robot_1', [-50, 0, -50], '#4A90E2'),
            'robot_2': Robot3D('robot_2', [0, 0, -50], '#E24A90'),
            'robot_3': Robot3D('robot_3', [50, 0, -50], '#90E24A'),
            'robot_4': Robot3D('robot_4', [-50, 0, 50], '#E2904A'),
            'robot_5': Robot3D('robot_5', [0, 0, 50], '#904AE2'),
            'robot_6': Robot3D('robot_6', [50, 0, 50], '#4AE290'),
        }
        
        # Action mapping
        self.action_mapping = {
            'dance': HumanoidAction.DANCE,
            'wave': HumanoidAction.WAVE,
            'kung_fu': HumanoidAction.KUNG_FU,
            'jump': HumanoidAction.JUMP,
            'go_forward': HumanoidAction.GO_FORWARD,
        }
        
        self.setup_routes()
        self.setup_websocket_handlers()
        
        print("🎉 Clean WebSocket Server initialized!")
        
    def setup_routes(self):
        @self.app.route('/')
        def index():
            return render_template('index.html')
            
        @self.app.route('/static/<path:filename>')
        def static_files(filename):
            return send_from_directory('static', filename)
            
        @self.app.route('/api/robots')
        def get_robots():
            return jsonify({
                'robots': {rid: robot.to_dict() for rid, robot in self.robots.items()}
            })
    
    def setup_websocket_handlers(self):
        """Setup WebSocket handlers - CLEAN IMPLEMENTATION"""
        print("🔧 Setting up clean WebSocket handlers...")
        
        @self.socketio.on('connect')
        def handle_connect():
            print("🔌 CLIENT CONNECTED!")
            # Send initial robot states
            emit('robot_states', {
                robot_id: robot.to_dict() for robot_id, robot in self.robots.items()
            })
            print("📡 Initial robot states sent")
        
        @self.socketio.on('disconnect')
        def handle_disconnect():
            print("🔌 Client disconnected")
        
        @self.socketio.on('run_action')
        def handle_run_action(data):
            """CLEAN WebSocket action handler"""
            print(f"🎮 CLEAN HANDLER CALLED! Data: {data}")
            print(f"🎯 Action: {data.get('action')}, Robot: {data.get('robot_id')}")
            
            try:
                robot_id = data.get('robot_id')
                action = data.get('action')
                
                if not robot_id or not action:
                    print("❌ Missing data")
                    emit('action_result', {'success': False, 'error': 'Missing data'})
                    return
                
                # Handle 'all' robots
                if robot_id.lower() == 'all':
                    print(f"🎯 Executing {action} on ALL robots")
                    for rid, robot in self.robots.items():
                        if action in self.action_mapping:
                            robot.start_action(self.action_mapping[action])
                            print(f"   ✅ {rid}: {action} started")
                else:
                    # Handle single robot
                    if robot_id in self.robots and action in self.action_mapping:
                        self.robots[robot_id].start_action(self.action_mapping[action])
                        print(f"✅ {robot_id}: {action} started")
                
                # Send success response
                emit('action_result', {'success': True, 'message': f'Action {action} executed'})
                
                # Broadcast updated robot states
                print("📡 Broadcasting robot states...")
                self.socketio.emit('robot_states', {
                    robot_id: robot.to_dict() for robot_id, robot in self.robots.items()
                })
                print("✅ Robot states broadcasted!")
                
            except Exception as e:
                print(f"❌ Handler error: {e}")
                emit('action_result', {'success': False, 'error': str(e)})
        
        @self.socketio.on('get_robot_states')
        def handle_get_robot_states():
            """Send current robot states to client"""
            print("📡 Client requested robot states")
            robot_states = {
                robot_id: robot.to_dict() for robot_id, robot in self.robots.items()
            }
            print(f"📤 Sending {len(robot_states)} robot states to client")
            emit('robot_states', robot_states)
            print("✅ Robot states sent successfully")
        
        @self.socketio.on('test_connection')
        def handle_test_connection(data):
            print(f"🧪 TEST CONNECTION: {data}")
            emit('test_response', {'message': 'Clean server test successful!'})
        
        print("✅ Clean WebSocket handlers registered!")
        print("   • connect")
        print("   • disconnect") 
        print("   • run_action ← CLEAN HANDLER")
        print("   • test_connection")
    
    def run(self):
        """Start the clean server"""
        print(f"🚀 Starting clean WebSocket server on port {self.port}...")
        print(f"🌐 Open browser to: http://localhost:{self.port}")
        self.socketio.run(self.app, host='0.0.0.0', port=self.port, debug=False)

if __name__ == "__main__":
    server = CleanWebSocketServer(port=5000)
    server.run()
