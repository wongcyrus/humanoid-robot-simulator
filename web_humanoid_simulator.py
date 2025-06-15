#!/usr/bin/env python3
"""Refactored WebSocket Robot Simulator with Session Support"""

from flask import Flask, render_template, send_from_directory, jsonify, request
from flask_socketio import SocketIO, emit, disconnect, join_room, leave_room
from flask_cors import CORS
import time
import threading
from enum import Enum
import math
from collections import defaultdict


class HumanoidAction(Enum):
    # Basic actions
    IDLE = "idle"
    DANCE = "dance"
    WAVE = "wave"
    BOW = "bow"
    KUNG_FU = "kung_fu"
    KICK = "kick"
    PUNCH = "punch"
    JUMP = "jump"
    PUSH_UPS = "push_ups"
    SIT_UPS = "sit_ups"
    JUMPING_JACKS = "jumping_jacks"
    CELEBRATE = "celebrate"
    THINK = "think"

    # Movement actions
    GO_FORWARD = "go_forward"
    GO_BACKWARD = "go_backward"
    TURN_LEFT = "turn_left"
    TURN_RIGHT = "turn_right"
    STEPPING = "stepping"
    TWIST = "twist"
    RIGHT_MOVE_FAST = "right_move_fast"
    LEFT_MOVE_FAST = "left_move_fast"
    BACK_FAST = "back_fast"

    # Dance variations
    DANCE_TWO = "dance_two"
    DANCE_THREE = "dance_three"
    DANCE_FOUR = "dance_four"
    DANCE_FIVE = "dance_five"
    DANCE_SIX = "dance_six"
    DANCE_SEVEN = "dance_seven"
    DANCE_EIGHT = "dance_eight"
    DANCE_NINE = "dance_nine"
    DANCE_TEN = "dance_ten"

    # Standing, combat, and exercise actions
    STAND_UP_BACK = "stand_up_back"
    STAND_UP_FRONT = "stand_up_front"
    RIGHT_KICK = "right_kick"
    LEFT_KICK = "left_kick"
    RIGHT_UPPERCUT = "right_uppercut"
    LEFT_UPPERCUT = "left_uppercut"
    WING_CHUN = "wing_chun"
    RIGHT_SHOT_FAST = "right_shot_fast"
    LEFT_SHOT_FAST = "left_shot_fast"
    CHEST = "chest"
    SQUAT_UP = "squat_up"
    SQUAT = "squat"
    WEIGHTLIFTING = "weightlifting"


# Configuration constants
DEFAULT_ROBOTS = [
    {'id': 'robot_1', 'position': [-50, 0, -50], 'color': '#4A90E2'},
    {'id': 'robot_2', 'position': [0, 0, -50], 'color': '#E24A90'},
    {'id': 'robot_3', 'position': [50, 0, -50], 'color': '#90E24A'},
    {'id': 'robot_4', 'position': [-50, 0, 50], 'color': '#E2904A'},
    {'id': 'robot_5', 'position': [0, 0, 50], 'color': '#904AE2'},
    {'id': 'robot_6', 'position': [50, 0, 50], 'color': '#4AE290'},
]

ACTION_DURATIONS = {
    # Dance actions (long durations)
    'dance_two': 52, 'dance_three': 70, 'dance_four': 83, 'dance_five': 59,
    'dance_six': 69, 'dance_seven': 67, 'dance_eight': 85, 'dance_nine': 84, 'dance_ten': 85,

    # Movement actions
    'stepping': 3, 'twist': 4, 'right_move_fast': 3, 'left_move_fast': 3,
    'back_fast': 4.5, 'go_forward': 3.5, 'turn_right': 4, 'turn_left': 4,

    # Standing actions
    'stand_up_back': 5, 'stand_up_front': 5,

    # Combat actions
    'right_kick': 2, 'left_kick': 2, 'right_uppercut': 2, 'left_uppercut': 2,
    'wing_chun': 2, 'right_shot_fast': 4, 'left_shot_fast': 4, 'kung_fu': 2,

    # Exercise actions
    'chest': 9, 'squat_up': 6, 'squat': 1, 'push_ups': 9, 'sit_ups': 12, 'weightlifting': 9,

    # Other actions
    'bow': 4, 'wave': 3.5, 'default': 2
}

MOVEMENT_ACTIONS = {
    HumanoidAction.GO_FORWARD, HumanoidAction.GO_BACKWARD,
    HumanoidAction.TURN_LEFT, HumanoidAction.TURN_RIGHT,
    HumanoidAction.RIGHT_MOVE_FAST, HumanoidAction.LEFT_MOVE_FAST,
    HumanoidAction.BACK_FAST
}


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


class RobotWebSocketServer:
    def __init__(self, port=5000):
        self.port = port
        self.app = Flask(__name__, template_folder='templates',
                         static_folder='static')
        CORS(self.app)
        self.socketio = SocketIO(
            self.app, cors_allowed_origins="*", logger=False, engineio_logger=False)
        self.sessions = defaultdict(dict)
        self.setup_routes()
        self.setup_websocket_handlers()

    def get_session_key_from_request(self):
        return request.args.get('session_key')

    def validate_session_key(self, session_key):
        if not session_key:
            return False, "Session key required. Add ?session_key=YOUR_SESSION_ID"
        return True, None

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

    def setup_routes(self):
        @self.app.route('/')
        def index():
            session_key = request.args.get('session_key')
            if not session_key:
                return """
                <html><body>
                    <h1>🔐 Session Key Required</h1>
                    <form onsubmit="window.location.href='/?session_key=' + document.getElementById('session_input').value; return false;">
                        <input type="text" id="session_input" placeholder="Enter session ID" required>
                        <button type="submit">Connect</button>
                    </form>
                </body></html>
                """, 400

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
            return jsonify({
                'success': True,
                'session_key': session_key,
                'robot_count': len(robots),
                'robots': {robot_id: robot.to_dict() for robot_id, robot in robots.items()}
            })

        @self.app.route('/api/status')
        def get_status():
            session_key = self.get_session_key_from_request()

            if session_key:
                robots = self.get_session_robots(session_key)
                return jsonify({
                    'server': 'running',
                    'session_key': session_key,
                    'robots_count': len(robots),
                    'actions': [action.value for action in HumanoidAction],
                    'animating_robots': [robot_id for robot_id, robot in robots.items() if robot.is_animating]
                })
            else:
                return jsonify({
                    'server': 'running',
                    'total_sessions': len(self.sessions),
                    'session_required': True,
                    'actions': [action.value for action in HumanoidAction]
                })

        @self.app.route('/api/add_robot/<robot_id>', methods=['POST'])
        def add_robot(robot_id):
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                if not is_valid:
                    return jsonify({'success': False, 'error': error_msg}), 400

                robots = self.get_session_robots(session_key)
                data = request.json or {}

                if robot_id in robots:
                    return jsonify({'success': False, 'error': f'Robot {robot_id} already exists'}), 400

                robot = Robot3D(robot_id, data.get(
                    'position', [0, 0, 0]), data.get('color', '#4A90E2'))
                robots[robot_id] = robot

                self.socketio.emit('robot_added', {
                    'robot_id': robot_id,
                    'robot_data': robot.to_dict()
                }, room=f"session_{session_key}")

                return jsonify({'success': True, 'robot_id': robot_id, 'robot_data': robot.to_dict()})
            except Exception as e:
                return jsonify({'success': False, 'error': str(e)}), 500

        @self.app.route('/api/remove_robot/<robot_id>', methods=['DELETE'])
        def remove_robot(robot_id):
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                if not is_valid:
                    return jsonify({'success': False, 'error': error_msg}), 400

                robots = self.get_session_robots(session_key)

                if robot_id == 'all':
                    removed_robots = list(robots.keys())
                    robots.clear()
                    self.socketio.emit('robots_removed_all', {
                                       'removed_robots': removed_robots}, room=f"session_{session_key}")
                    return jsonify({'success': True, 'removed_robots': removed_robots})
                elif robot_id in robots:
                    del robots[robot_id]
                    self.socketio.emit('robot_removed', {
                                       'removed_robot': robot_id}, room=f"session_{session_key}")
                    return jsonify({'success': True, 'robot_id': robot_id})
                else:
                    return jsonify({'success': False, 'error': f'Robot {robot_id} not found'}), 404
            except Exception as e:
                return jsonify({'success': False, 'error': str(e)}), 500

        @self.app.route('/api/reset_robots', methods=['POST'])
        def reset_robots():
            try:
                session_key = self.get_session_key_from_request()
                is_valid, error_msg = self.validate_session_key(session_key)
                if not is_valid:
                    return jsonify({'success': False, 'error': error_msg}), 400

                robots = self.get_session_robots(session_key)
                robots.clear()

                for config in DEFAULT_ROBOTS:
                    robot = Robot3D(
                        config['id'], config['position'].copy(), config['color'])
                    robots[config['id']] = robot

                robot_states = {robot_id: robot.to_dict()
                                for robot_id, robot in robots.items()}
                self.socketio.emit(
                    'robots_reset', {'robots': robot_states}, room=f"session_{session_key}")
                return jsonify({'success': True, 'robots': robot_states})
            except Exception as e:
                return jsonify({'success': False, 'error': str(e)}), 500

    def setup_websocket_handlers(self):
        @self.socketio.on('connect')
        def handle_connect():
            pass

        @self.socketio.on('disconnect')
        def handle_disconnect():
            pass

        @self.socketio.on('join_session')
        def handle_join_session(data):
            session_key = data.get('session_key')
            if not session_key:
                emit('error', {'message': 'Session key required'})
                disconnect()
                return

            join_room(f"session_{session_key}")
            client_id = request.sid
            session = self.get_or_create_session(session_key)
            session['clients'].add(client_id)

            robots = self.get_session_robots(session_key)
            robot_states = {robot_id: robot.to_dict()
                            for robot_id, robot in robots.items()}
            emit('robot_states', robot_states)

        @self.socketio.on('get_robot_states')
        def handle_get_robot_states(data):
            session_key = data.get('session_key') if data else None
            if not session_key:
                emit('error', {'message': 'Session key required'})
                return

            robots = self.get_session_robots(session_key)
            robot_states = {robot_id: robot.to_dict()
                            for robot_id, robot in robots.items()}
            emit('robot_states', robot_states)

        @self.socketio.on('robot_action')
        def handle_robot_action(data):
            session_key = data.get('session_key')
            if not session_key:
                emit('error', {'message': 'Session key required'})
                return

            robot_id = data.get('robot_id', 'all')
            action = data.get('action', 'idle')

            try:
                robots = self.get_session_robots(session_key)

                if robot_id == 'all':
                    for robot in robots.values():
                        robot.start_action(action)
                    result = {'status': 'success',
                              'robot_id': 'all', 'action': action}
                elif robot_id in robots:
                    robots[robot_id].start_action(action)
                    result = {'status': 'success',
                              'robot_id': robot_id, 'action': action}
                else:
                    result = {'status': 'error', 'robot_id': robot_id,
                              'message': f'Robot {robot_id} not found'}

                emit('action_result', result)
                robot_states = {robot_id: robot.to_dict()
                                for robot_id, robot in robots.items()}
                self.socketio.emit('robot_states', robot_states,
                                   room=f"session_{session_key}")

            except Exception as e:
                emit('action_result', {'status': 'error', 'message': str(e)})

    def run(self):
        print(f"🚀 Robot WebSocket Server on port {self.port}")
        print(f"🌐 URL: http://localhost:{self.port}/?session_key=YOUR_SESSION")
        try:
            self.socketio.run(self.app, host='0.0.0.0', port=self.port,
                              debug=False, allow_unsafe_werkzeug=True)
        except Exception as e:
            print(f"❌ Server error: {e}")


def main():
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
    server = RobotWebSocketServer(port)
    server.run()


if __name__ == '__main__':
    main()
