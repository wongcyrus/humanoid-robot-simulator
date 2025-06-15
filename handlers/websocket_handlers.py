#!/usr/bin/env python3
"""WebSocket handlers for the Robot Simulator"""

from flask_socketio import emit, disconnect, join_room, leave_room
from flask import request


class WebSocketHandlers:
    def __init__(self, socketio, sessions_manager):
        self.socketio = socketio
        self.sessions_manager = sessions_manager
        self.setup_handlers()

    def setup_handlers(self):
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
            session = self.sessions_manager.get_or_create_session(session_key)
            session['clients'].add(client_id)

            robots = self.sessions_manager.get_session_robots(session_key)
            robot_states = {robot_id: robot.to_dict()
                            for robot_id, robot in robots.items()}
            emit('robot_states', robot_states)

        @self.socketio.on('get_robot_states')
        def handle_get_robot_states(data=None):
            session_key = data.get('session_key') if data else None
            if not session_key:
                emit('error', {'message': 'Session key required'})
                return

            robots = self.sessions_manager.get_session_robots(session_key)
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
                robots = self.sessions_manager.get_session_robots(session_key)

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

        @self.socketio.on('reset_session')
        def handle_reset_session(data):
            session_key = data.get('session_key')
            if not session_key:
                emit('error', {'message': 'Session key required'})
                return

            try:
                robots = self.sessions_manager.reset_session(session_key)
                robot_states = {robot_id: robot.to_dict()
                                for robot_id, robot in robots.items()}

                result = {'status': 'success',
                          'message': 'Session reset successfully'}
                emit('reset_result', result)
                self.socketio.emit('robot_states', robot_states,
                                   room=f"session_{session_key}")

            except Exception as e:
                emit('reset_result', {'status': 'error', 'message': str(e)})
