#!/usr/bin/env python3
"""
CORRECTED WebSocket Server Implementation
Fixed turn right and forward movement directions
"""

from flask import Flask, render_template, send_from_directory, jsonify, request
from flask_socketio import SocketIO, emit, disconnect, join_room, leave_room
from flask_cors import CORS
import time
import threading
from enum import Enum
import json
import math
import uuid
from collections import defaultdict

# Humanoid Actions


class HumanoidAction(Enum):
    IDLE = "idle"
    # Original actions
    DANCE = "dance"
    WAVE = "wave"
    BOW = "bow"
    KUNG_FU = "kung_fu"
    KICK = "kick"
    PUNCH = "punch"
    JUMP = "jump"
    GO_FORWARD = "go_forward"
    GO_BACKWARD = "go_backward"
    TURN_LEFT = "turn_left"
    TURN_RIGHT = "turn_right"
    PUSH_UPS = "push_ups"
    SIT_UPS = "sit_ups"
    JUMPING_JACKS = "jumping_jacks"
    CELEBRATE = "celebrate"
    THINK = "think"

    # New dance actions
    DANCE_TWO = "dance_two"
    DANCE_THREE = "dance_three"
    DANCE_FOUR = "dance_four"
    DANCE_FIVE = "dance_five"
    DANCE_SIX = "dance_six"
    DANCE_SEVEN = "dance_seven"
    DANCE_EIGHT = "dance_eight"
    DANCE_NINE = "dance_nine"
    DANCE_TEN = "dance_ten"

    # New movement actions
    STEPPING = "stepping"
    TWIST = "twist"
    RIGHT_MOVE_FAST = "right_move_fast"
    LEFT_MOVE_FAST = "left_move_fast"
    BACK_FAST = "back_fast"

    # New standing actions
    STAND_UP_BACK = "stand_up_back"
    STAND_UP_FRONT = "stand_up_front"

    # New combat actions
    RIGHT_KICK = "right_kick"
    LEFT_KICK = "left_kick"
    RIGHT_UPPERCUT = "right_uppercut"
    LEFT_UPPERCUT = "left_uppercut"
    WING_CHUN = "wing_chun"
    RIGHT_SHOT_FAST = "right_shot_fast"
    LEFT_SHOT_FAST = "left_shot_fast"

    # New exercise actions
    CHEST = "chest"
    SQUAT_UP = "squat_up"
    SQUAT = "squat"
    WEIGHTLIFTING = "weightlifting"


class Robot3D:
    def __init__(self, robot_id, position, color):
        self.robot_id = robot_id
        self.position = position  # [x, y, z] format
        self.rotation = [0, 0, 0]  # [x, y, z] format
        self.color = color
        self.current_action = HumanoidAction.IDLE
        self.action_progress = 0.0
        self.is_visible = True
        self.is_animating = False
        self.movement_count = 0  # Track how many times robot has moved

        print(
            f"🤖 Created {robot_id} at position {position} with color {color}")

    def to_dict(self):
        return {
            'robot_id': self.robot_id,
            'position': self.position,  # Keep as array for frontend
            'rotation': self.rotation,  # Keep as array for frontend
            'color': self.color,
            'current_action': self.current_action.value,
            'action_progress': self.action_progress,
            'is_visible': self.is_visible,
            'is_animating': self.is_animating,
            'movement_count': self.movement_count,
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
        if isinstance(action, str):
            # Convert string to enum
            try:
                action = HumanoidAction(action.lower())
            except ValueError:
                print(f"⚠️ Unknown action: {action}, defaulting to IDLE")
                action = HumanoidAction.IDLE

        self.current_action = action
        self.action_progress = 0.0
        self.is_animating = True

        # Get action duration from server's action_durations
        action_name = action.value
        duration = getattr(self, '_server_durations', {}).get(
            action_name, 2)  # Default 2 seconds

        # For movement actions, update position on server side with CORRECTED logic
        if action in [HumanoidAction.GO_FORWARD, HumanoidAction.GO_BACKWARD,
                      HumanoidAction.TURN_LEFT, HumanoidAction.TURN_RIGHT,
                      HumanoidAction.RIGHT_MOVE_FAST, HumanoidAction.LEFT_MOVE_FAST,
                      HumanoidAction.BACK_FAST]:
            self.movement_count += 1
            print(
                f"🚶 {self.robot_id}: Started MOVEMENT action {action.value} (count: {self.movement_count}, duration: {duration}s)")

            # Movement logic based on action type
            if action == HumanoidAction.GO_FORWARD:
                current_rotation_y = self.rotation[1]
                forward_x = math.sin(current_rotation_y) * 30
                forward_z = math.cos(current_rotation_y) * 30
                self.position[0] += forward_x
                self.position[2] += forward_z

            elif action == HumanoidAction.GO_BACKWARD:
                current_rotation_y = self.rotation[1]
                backward_x = -math.sin(current_rotation_y) * 20
                backward_z = -math.cos(current_rotation_y) * 20
                self.position[0] += backward_x
                self.position[2] += backward_z

            elif action == HumanoidAction.BACK_FAST:
                current_rotation_y = self.rotation[1]
                backward_x = -math.sin(current_rotation_y) * \
                    35  # Faster/further
                backward_z = -math.cos(current_rotation_y) * 35
                self.position[0] += backward_x
                self.position[2] += backward_z

            elif action == HumanoidAction.TURN_LEFT:
                self.rotation[1] += math.pi / 2  # +90 degrees

            elif action == HumanoidAction.TURN_RIGHT:
                self.rotation[1] -= math.pi / 2  # -90 degrees

            elif action == HumanoidAction.RIGHT_MOVE_FAST:
                # Move right relative to current facing direction
                current_rotation_y = self.rotation[1]
                right_x = math.cos(current_rotation_y) * 25
                right_z = -math.sin(current_rotation_y) * 25
                self.position[0] += right_x
                self.position[2] += right_z

            elif action == HumanoidAction.LEFT_MOVE_FAST:
                # Move left relative to current facing direction
                current_rotation_y = self.rotation[1]
                left_x = -math.cos(current_rotation_y) * 25
                left_z = math.sin(current_rotation_y) * 25
                self.position[0] += left_x
                self.position[2] += left_z

            print(
                f"📍 {self.robot_id}: New position {self.position}, rotation {self.rotation}")
        else:
            print(
                f"🎭 {self.robot_id}: Started action {action.value} (duration: {duration}s)")

        # Simulate action completion after specified duration
        def complete_action():
            time.sleep(duration)
            self.is_animating = False
            if self.current_action != HumanoidAction.IDLE:
                self.current_action = HumanoidAction.IDLE
            print(f"✅ {self.robot_id}: Completed action after {duration}s")

        threading.Thread(target=complete_action, daemon=True).start()


class RobotWebSocketServer:
    def __init__(self, port=5000):
        self.port = port

        # Create Flask app
        self.app = Flask(__name__, template_folder='templates',
                         static_folder='static')
        CORS(self.app)

        # Create SocketIO instance
        self.socketio = SocketIO(
            self.app, cors_allowed_origins="*", logger=False, engineio_logger=False)

        # Session management - each session has its own robots
        self.sessions = defaultdict(dict)  # session_key -> {robots: {}, clients: set()}
        
        # Action durations in seconds - DEFINE FIRST
        self.action_durations = {
            # Dance actions
            'dance_two': 52,
            'dance_three': 70,
            'dance_four': 83,
            'dance_five': 59,
            'dance_six': 69,
            'dance_seven': 67,
            'dance_eight': 85,
            'dance_nine': 84,
            'dance_ten': 85,

            # Movement actions
            'stepping': 3,
            'twist': 4,
            'right_move_fast': 3,
            'left_move_fast': 3,
            'back_fast': 4.5,
            'go_forward': 3.5,

            # Standing actions
            'stand_up_back': 5,
            'stand_up_front': 5,

            # Combat actions
            'right_kick': 2,
            'left_kick': 2,
            'right_uppercut': 2,
            'left_uppercut': 2,
            'wing_chun': 2,
            'right_shot_fast': 4,
            'left_shot_fast': 4,
            'kung_fu': 2,

            # Exercise actions
            'chest': 9,
            'squat_up': 6,
            'squat': 1,
            'push_ups': 9,
            'sit_ups': 12,
            'weightlifting': 9,

            # Other actions
            'bow': 4,
            'wave': 3.5,
            'turn_right': 4,
            'turn_left': 4,

            # Default duration for unlisted actions
            'default': 2
        }

        # Initialize default robots for new sessions
        self.default_robots_config = [
            {'id': 'robot_1', 'position': [-50, 0, -50], 'color': '#4A90E2'},
            {'id': 'robot_2', 'position': [0, 0, -50], 'color': '#E24A90'},
            {'id': 'robot_3', 'position': [50, 0, -50], 'color': '#90E24A'},
            {'id': 'robot_4', 'position': [-50, 0, 50], 'color': '#E2904A'},
            {'id': 'robot_5', 'position': [0, 0, 50], 'color': '#904AE2'},
            {'id': 'robot_6', 'position': [50, 0, 50], 'color': '#4AE290'},
        ]

        # Remove global robots - now managed per session
        # self.robots = {...}  # REMOVED

        # Action mapping with durations (in seconds)
        self.action_mapping = {
            # Original actions
            'dance': HumanoidAction.DANCE,
            'wave': HumanoidAction.WAVE,
            'bow': HumanoidAction.BOW,
            'kung_fu': HumanoidAction.KUNG_FU,
            'kick': HumanoidAction.KICK,
            'punch': HumanoidAction.PUNCH,
            'jump': HumanoidAction.JUMP,
            'go_forward': HumanoidAction.GO_FORWARD,
            'go_backward': HumanoidAction.GO_BACKWARD,
            'turn_left': HumanoidAction.TURN_LEFT,
            'turn_right': HumanoidAction.TURN_RIGHT,
            'push_ups': HumanoidAction.PUSH_UPS,
            'sit_ups': HumanoidAction.SIT_UPS,
            'jumping_jacks': HumanoidAction.JUMPING_JACKS,
            'celebrate': HumanoidAction.CELEBRATE,
            'think': HumanoidAction.THINK,
            'idle': HumanoidAction.IDLE,

            # New dance actions
            'dance_two': HumanoidAction.DANCE_TWO,
            'dance_three': HumanoidAction.DANCE_THREE,
            'dance_four': HumanoidAction.DANCE_FOUR,
            'dance_five': HumanoidAction.DANCE_FIVE,
            'dance_six': HumanoidAction.DANCE_SIX,
            'dance_seven': HumanoidAction.DANCE_SEVEN,
            'dance_eight': HumanoidAction.DANCE_EIGHT,
            'dance_nine': HumanoidAction.DANCE_NINE,
            'dance_ten': HumanoidAction.DANCE_TEN,

            # New movement actions
            'stepping': HumanoidAction.STEPPING,
            'twist': HumanoidAction.TWIST,
            'right_move_fast': HumanoidAction.RIGHT_MOVE_FAST,
            'left_move_fast': HumanoidAction.LEFT_MOVE_FAST,
            'back_fast': HumanoidAction.BACK_FAST,

            # New standing actions
            'stand_up_back': HumanoidAction.STAND_UP_BACK,
            'stand_up_front': HumanoidAction.STAND_UP_FRONT,

            # New combat actions
            'right_kick': HumanoidAction.RIGHT_KICK,
            'left_kick': HumanoidAction.LEFT_KICK,
            'right_uppercut': HumanoidAction.RIGHT_UPPERCUT,
            'left_uppercut': HumanoidAction.LEFT_UPPERCUT,
            'wing_chun': HumanoidAction.WING_CHUN,
            'right_shot_fast': HumanoidAction.RIGHT_SHOT_FAST,
            'left_shot_fast': HumanoidAction.LEFT_SHOT_FAST,

            # New exercise actions
            'chest': HumanoidAction.CHEST,
            'squat_up': HumanoidAction.SQUAT_UP,
            'squat': HumanoidAction.SQUAT,
            'weightlifting': HumanoidAction.WEIGHTLIFTING,
        }

        self.setup_routes()
        self.setup_websocket_handlers()

        print("🎉 3D Robot WebSocket Server initialized with SESSION SUPPORT!")
        print(f"📊 Server ready to handle multiple user sessions")
        print("� Each session will have isolated robot states")

    def get_session_key_from_request(self):
        """Extract session key from request parameters"""
        session_key = request.args.get('session_key')
        if not session_key:
            return None
        return session_key

    def validate_session_key(self, session_key):
        """Validate that session key is provided"""
        if not session_key:
            return False, "Session key is required. Please provide ?session_key=YOUR_SESSION_ID"
        return True, None

    def get_or_create_session(self, session_key):
        """Get existing session or create new one with default robots"""
        if session_key not in self.sessions:
            print(f"🆕 Creating new session: {session_key}")
            
            # Create robots for this session
            robots = {}
            for robot_config in self.default_robots_config:
                robot = Robot3D(
                    robot_config['id'], 
                    robot_config['position'].copy(), 
                    robot_config['color']
                )
                robot._server_durations = self.action_durations
                robots[robot_config['id']] = robot
            
            self.sessions[session_key] = {
                'robots': robots,
                'clients': set(),
                'created_at': time.time()
            }
            
            print(f"📊 Session {session_key}: Created with {len(robots)} robots")
            
        return self.sessions[session_key]

    def get_session_robots(self, session_key):
        """Get robots for a specific session"""
        session = self.get_or_create_session(session_key)
        return session['robots']

    def add_client_to_session(self, session_key, client_id):
        """Add client to session"""
        session = self.get_or_create_session(session_key)
        session['clients'].add(client_id)
        print(f"👤 Client {client_id} joined session {session_key}")

    def remove_client_from_session(self, session_key, client_id):
        """Remove client from session"""
        if session_key in self.sessions:
            self.sessions[session_key]['clients'].discard(client_id)
            print(f"👤 Client {client_id} left session {session_key}")
            
            # Optional: Clean up empty sessions after some time
            if len(self.sessions[session_key]['clients']) == 0:
                print(f"📭 Session {session_key} is now empty")

    def setup_routes(self):
        @self.app.route('/')
        def index():
            # Check for session key
            session_key = request.args.get('session_key')
            if not session_key:
                return """
                <html>
                <head><title>Session Required</title></head>
                <body>
                    <h1>🔐 Session Key Required</h1>
                    <p>Please provide a session key to access the robot simulator.</p>
                    <p>Add <code>?session_key=YOUR_SESSION_ID</code> to the URL.</p>
                    <p>Example: <code>http://localhost:5000/?session_key=my_session</code></p>
                    <form onsubmit="window.location.href='/?session_key=' + document.getElementById('session_input').value; return false;">
                        <label>Session Key: </label>
                        <input type="text" id="session_input" placeholder="Enter your session ID" required>
                        <button type="submit">Connect</button>
                    </form>
                </body>
                </html>
                """, 400
            
            # Create session if it doesn't exist
            self.get_or_create_session(session_key)
            return render_template('index.html', session_key=session_key)

        @self.app.route('/static/<path:filename>')
        def static_files(filename):
            return send_from_directory('static', filename)

        @self.app.route('/api/robots')
        def get_robots():
            session_key = self.get_session_key_from_request()
            is_valid, error_msg = self.validate_session_key(session_key)
            
            if not is_valid:
                return jsonify({'success': False, 'error': error_msg}), 400
            
            robots = self.get_session_robots(session_key)
            robot_data = {robot_id: robot.to_dict() for robot_id, robot in robots.items()}
            
            return jsonify({
                'success': True,
                'session_key': session_key,
                'robot_count': len(robots),
                'robots': robot_data
            })

        @self.app.route('/api/robot/<robot_id>')
        def get_robot(robot_id):
            session_key = self.get_session_key_from_request()
            is_valid, error_msg = self.validate_session_key(session_key)
            
            if not is_valid:
                return jsonify({'success': False, 'error': error_msg}), 400
            
            robots = self.get_session_robots(session_key)
            if robot_id in robots:
                return jsonify(robots[robot_id].to_dict())
            return jsonify({'error': 'Robot not found in this session'}), 404

        @self.app.route('/api/status')
        def get_status():
            session_key = self.get_session_key_from_request()
            
            if session_key:
                # Session-specific status
                robots = self.get_session_robots(session_key)
                return jsonify({
                    'server': 'running',
                    'version': 'multi-session',
                    'session_key': session_key,
                    'robots_count': len(robots),
                    'robots': list(robots.keys()),
                    'actions': [action.value for action in HumanoidAction],
                    'movement_actions': ['go_forward', 'go_backward', 'turn_left', 'turn_right'],
                    'corrections': ['turn_right_fixed', 'forward_direction_fixed'],
                    'animating_robots': [robot_id for robot_id, robot in robots.items() if robot.is_animating],
                    'robot_positions': {robot_id: robot.position for robot_id, robot in robots.items()},
                    'robot_rotations': {robot_id: robot.rotation for robot_id, robot in robots.items()}
                })
            else:
                # Global server status
                return jsonify({
                    'server': 'running',
                    'version': 'multi-session',
                    'total_sessions': len(self.sessions),
                    'session_required': True,
                    'actions': [action.value for action in HumanoidAction],
                    'message': 'Provide ?session_key=YOUR_SESSION_ID for session-specific status'
                })

        @self.app.route('/api/add_robot/<robot_id>', methods=['POST'])
        def add_robot(robot_id):
            """Add a new robot to the simulation"""
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                
                if not is_valid:
                    return jsonify({'success': False, 'error': error_msg}), 400
                
                robots = self.get_session_robots(session_key)
                data = request.json or {}
                position = data.get('position', [0, 0, 0])
                color = data.get('color', '#4A90E2')

                if robot_id in robots:
                    return jsonify({
                        'success': False,
                        'error': f'Robot {robot_id} already exists in session {session_key}'
                    }), 400

                # Create new robot
                robot = Robot3D(robot_id, position, color)
                robot._server_durations = self.action_durations
                robots[robot_id] = robot

                # Emit to clients in this session only
                self.socketio.emit('robot_added', {
                    'robot_id': robot_id,
                    'robot_data': robot.to_dict()
                }, room=f"session_{session_key}")

                return jsonify({
                    'success': True,
                    'session_key': session_key,
                    'robot_id': robot_id,
                    'message': f'Robot {robot_id} added successfully to session {session_key}',
                    'robot_data': robot.to_dict()
                })

            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': f'Failed to add robot: {str(e)}'
                }), 500

        @self.app.route('/api/remove_robot/<robot_id>', methods=['DELETE'])
        def remove_robot(robot_id):
            """Remove a robot from the simulation"""
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                
                if not is_valid:
                    return jsonify({'success': False, 'error': error_msg}), 400
                
                robots = self.get_session_robots(session_key)

                if robot_id == 'all':
                    # Remove all robots in this session
                    removed_robots = list(robots.keys())
                    robots.clear()

                    # Emit to clients in this session only
                    self.socketio.emit('robots_removed_all', {
                        'removed_robots': removed_robots
                    }, room=f"session_{session_key}")

                    return jsonify({
                        'success': True,
                        'session_key': session_key,
                        'message': f'All robots removed successfully from session {session_key}',
                        'removed_robots': removed_robots
                    })

                elif robot_id in robots:
                    # Remove specific robot
                    del robots[robot_id]

                    # Emit to clients in this session only
                    self.socketio.emit('robot_removed', {
                        'removed_robot': robot_id
                    }, room=f"session_{session_key}")

                    return jsonify({
                        'success': True,
                        'session_key': session_key,
                        'robot_id': robot_id,
                        'message': f'Robot {robot_id} removed successfully from session {session_key}'
                    })

                else:
                    return jsonify({
                        'success': False,
                        'error': f'Robot {robot_id} not found in session {session_key}'
                    }), 404

            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': f'Failed to remove robot: {str(e)}'
                }), 500

        @self.app.route('/api/reset_robots', methods=['POST'])
        def reset_robots():
            """Reset to the original 6 robots for this session"""
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                
                if not is_valid:
                    return jsonify({'success': False, 'error': error_msg}), 400
                
                robots = self.get_session_robots(session_key)

                # Clear existing robots
                robots.clear()

                # Add original 6 robots to this session
                for robot_data in self.default_robots_config:
                    robot = Robot3D(
                        robot_data['id'], robot_data['position'].copy(), robot_data['color'])
                    robot._server_durations = self.action_durations
                    robots[robot_data['id']] = robot

                # Emit to clients in this session only
                robot_states = {robot_id: robot.to_dict() for robot_id, robot in robots.items()}
                self.socketio.emit('robots_reset', {
                    'robots': robot_states
                }, room=f"session_{session_key}")

                return jsonify({
                    'success': True,
                    'session_key': session_key,
                    'message': f'Robots reset to original 6 successfully in session {session_key}',
                    'robots': robot_states
                })

            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': f'Failed to reset robots: {str(e)}'
                }), 500

    def setup_websocket_handlers(self):
        @self.socketio.on('connect')
        def handle_connect():
            print(f"🔌 Client connected")
            # Wait for session join - don't send data immediately

        @self.socketio.on('disconnect')
        def handle_disconnect():
            print(f"🔌 Client disconnected")

        @self.socketio.on('join_session')
        def handle_join_session(data):
            session_key = data.get('session_key')
            if not session_key:
                emit('error', {'message': 'Session key is required'})
                disconnect()
                return
            
            print(f"👤 Client joining session: {session_key}")
            
            # Join the session room
            join_room(f"session_{session_key}")
            
            # Add client to session tracking
            client_id = request.sid
            self.add_client_to_session(session_key, client_id)
            
            # Send robot states for this session
            robots = self.get_session_robots(session_key)
            robot_states = {robot_id: robot.to_dict() for robot_id, robot in robots.items()}
            emit('robot_states', robot_states)
            print(f"📡 Sent {len(robot_states)} robot states to client in session {session_key}")

        @self.socketio.on('get_robot_states')
        def handle_get_robot_states(data):
            session_key = data.get('session_key') if data else None
            if not session_key:
                emit('error', {'message': 'Session key is required'})
                return
            
            print(f"📡 Client requested robot states for session: {session_key}")
            robots = self.get_session_robots(session_key)
            robot_states = {robot_id: robot.to_dict() for robot_id, robot in robots.items()}
            emit('robot_states', robot_states)
            print(f"📤 Sent {len(robot_states)} robot states")

        @self.socketio.on('robot_action')
        def handle_robot_action(data):
            print(f"🎬 Received action request: {data}")

            session_key = data.get('session_key')
            if not session_key:
                emit('error', {'message': 'Session key is required'})
                return

            robot_id = data.get('robot_id', 'all')
            action = data.get('action', 'idle')

            try:
                robots = self.get_session_robots(session_key)
                
                if robot_id == 'all':
                    # Apply action to all robots in this session
                    for robot in robots.values():
                        robot.start_action(action)

                    result = {
                        'status': 'success',
                        'session_key': session_key,
                        'robot_id': 'all',
                        'action': action,
                        'message': f'Action {action} applied to all robots in session {session_key}'
                    }

                elif robot_id in robots:
                    # Apply action to specific robot in this session
                    robots[robot_id].start_action(action)

                    result = {
                        'status': 'success',
                        'session_key': session_key,
                        'robot_id': robot_id,
                        'action': action,
                        'message': f'Action {action} applied to {robot_id} in session {session_key}'
                    }

                else:
                    result = {
                        'status': 'error',
                        'session_key': session_key,
                        'robot_id': robot_id,
                        'action': action,
                        'message': f'Robot {robot_id} not found in session {session_key}'
                    }

                # Send action result
                emit('action_result', result)

                # Send updated robot states to all clients in this session
                robot_states = {robot_id: robot.to_dict() for robot_id, robot in robots.items()}
                self.socketio.emit('robot_states', robot_states, room=f"session_{session_key}")

                print(f"✅ Action completed: {result}")

            except Exception as e:
                error_result = {
                    'status': 'error',
                    'session_key': session_key,
                    'robot_id': robot_id,
                    'action': action,
                    'message': f'Error processing action: {str(e)}'
                }
                emit('action_result', error_result)
                print(f"❌ Action error: {error_result}")

    def run(self):
        print(f"🚀 Starting MULTI-SESSION WebSocket Server on port {self.port}")
        print(f"🌐 MULTI-SESSION VERSION: http://localhost:{self.port}/?session_key=YOUR_SESSION")
        print(f"📊 API status: http://localhost:{self.port}/api/status")
        print("")
        print("🔐 SESSION FEATURES:")
        print("  📝 Each session requires a unique session_key")
        print("  🤖 Each session has isolated robot states")
        print("  👥 Multiple users can have separate sessions")
        print("  🚫 Sessions do not share data")
        print("")
        print("✅ MOVEMENT CORRECTIONS:")
        print("  🔄 Turn Right: Now turns clockwise (correct direction)")
        print("  🚶 Forward: Now moves in robot's facing direction")
        print("  🔄 Turn Left: Counterclockwise (unchanged)")
        print("  🚶 Backward: Moves opposite to facing direction")
        print("")
        print("✨ FEATURES:")
        print("  🔐 Session-based multi-user support")
        print("  🚶 CORRECTED robot movement directions")
        print("  🎭 Working robot animations")
        print("  🤖 Guaranteed robot visibility")
        print("  🎮 Immediate visual feedback")
        print("  📡 Real-time WebSocket communication")
        print("  🔄 Multiple fallback mechanisms")

        try:
            self.socketio.run(
                self.app,
                host='0.0.0.0',
                port=self.port,
                debug=False,
                allow_unsafe_werkzeug=True
            )
        except Exception as e:
            print(f"❌ Server error: {e}")


def main():
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000

    server = RobotWebSocketServer(port)
    server.run()


if __name__ == '__main__':
    main()
