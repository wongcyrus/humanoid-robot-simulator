#!/usr/bin/env python3
"""WebSocket handlers for the Robot Simulator"""

from flask_socketio import emit, disconnect, join_room, leave_room
from flask import request
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class WebSocketHandlers:
    def __init__(self, socketio, sessions_manager):
        self.socketio = socketio
        self.sessions_manager = sessions_manager
        self.setup_handlers()

    def setup_handlers(self):
        @self.socketio.on('connect')
        def handle_connect():
            logger.debug(f"🔌 Client connected: {request.sid}")

        @self.socketio.on('disconnect')
        def handle_disconnect():
            logger.debug(f"🔌 Client disconnected: {request.sid}")

        @self.socketio.on('join_session')
        def handle_join_session(data):
            logger.debug(f"🔌 Handling join_session event with data: {data}")
            session_key = data.get('session_key')
            if not session_key:
                logger.debug("❌ Emitting 'error' event: Session key required")
                emit(
                    'error', {'message': 'Session key required for join_session event'})
                disconnect()
                return

            join_room(f"session_{session_key}")
            client_id = request.sid
            session = self.sessions_manager.get_or_create_session(session_key)
            session['clients'].add(client_id)

            robots = self.sessions_manager.get_session_robots(session_key)
            robot_states = {robot_id: robot.to_dict()
                            for robot_id, robot in robots.items()}
            logger.debug(
                f"✅ Emitting 'robot_states' event with {len(robot_states)} robots")
            emit('robot_states', robot_states)

        @self.socketio.on('get_robot_states')
        def handle_get_robot_states(data=None):
            logger.debug(
                f"📡 Handling get_robot_states event with data: {data}")
            session_key = data.get('session_key') if data else None
            if not session_key:
                logger.debug("❌ Emitting 'error' event: Session key required")
                emit(
                    'error', {'message': 'Session key required for get_robot_states event'})
                return

            robots = self.sessions_manager.get_session_robots(session_key)
            robot_states = {robot_id: robot.to_dict()
                            for robot_id, robot in robots.items()}
            logger.debug(
                f"✅ Emitting 'robot_states' event with {len(robot_states)} robots")
            emit('robot_states', robot_states)

        @self.socketio.on('robot_action')
        def handle_robot_action(data):
            logger.debug(f"🤖 Handling robot_action event with data: {data}")
            session_key = data.get('session_key')
            if not session_key:
                logger.debug("❌ Emitting 'error' event: Session key required")
                emit(
                    'error', {'message': 'Session key required for robot_action event'})
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

                logger.debug(f"✅ Emitting 'action_result' event: {result}")
                emit('action_result', result)
                robot_states = {robot_id: robot.to_dict()
                                for robot_id, robot in robots.items()}
                logger.debug(
                    f"📡 Broadcasting 'robot_states' event to session_{session_key} with {len(robot_states)} robots")
                self.socketio.emit('robot_states', robot_states,
                                   room=f"session_{session_key}")

            except Exception as e:
                error_result = {'status': 'error', 'message': str(e)}
                logger.debug(
                    f"❌ Emitting 'action_result' error event: {error_result}")
                emit('action_result', error_result)

        @self.socketio.on('actions')
        def handle_actions(data):
            logger.debug(f"🎬 Handling actions event with data: {data}")
            session_key = data.get('session_key')
            if not session_key:
                logger.debug("❌ Emitting 'error' event: Session key required")
                emit(
                    'error', {'message': 'Session key required for actions event'})
                return

            action_name = data.get('action_name', 'idle')
            robot_id = data.get('robot_id', 'all')  # Default to all robots

            try:
                robots = self.sessions_manager.get_session_robots(session_key)

                if not robots:
                    result = {'status': 'error',
                              'message': 'No robots found in session'}
                    logger.debug(
                        f"❌ Emitting 'action_result' error event: {result}")
                    emit('action_result', result)
                    return

                if robot_id == 'all':
                    # Run action on all robots
                    for robot in robots.values():
                        robot.start_action(action_name)
                    result = {
                        'status': 'success',
                        'action_name': action_name,
                        'robot_id': 'all',
                        'message': f'Action "{action_name}" started on all robots'
                    }
                elif robot_id in robots:
                    # Run action on specific robot
                    robots[robot_id].start_action(action_name)
                    result = {
                        'status': 'success',
                        'action_name': action_name,
                        'robot_id': robot_id,
                        'message': f'Action "{action_name}" started on robot {robot_id}'
                    }
                else:
                    result = {
                        'status': 'error',
                        'robot_id': robot_id,
                        'action_name': action_name,
                        'message': f'Robot {robot_id} not found'
                    }

                logger.debug(f"✅ Emitting 'action_result' event: {result}")
                emit('action_result', result)

                # Broadcast updated robot states to all clients in the session
                robot_states = {robot_id: robot.to_dict()
                                for robot_id, robot in robots.items()}
                logger.debug(
                    f"📡 Broadcasting 'robot_states' event to session_{session_key} with {len(robot_states)} robots")
                self.socketio.emit('robot_states', robot_states,
                                   room=f"session_{session_key}")

            except Exception as e:
                error_result = {
                    'status': 'error',
                    'action_name': action_name,
                    'robot_id': robot_id,
                    'message': f'Error executing action: {str(e)}'
                }
                logger.debug(
                    f"❌ Emitting 'action_result' error event: {error_result}")
                emit('action_result', error_result)

        @self.socketio.on('reset_session')
        def handle_reset_session(data):
            logger.debug(f"🔄 Handling reset_session event with data: {data}")
            session_key = data.get('session_key')
            if not session_key:
                logger.debug("❌ Emitting 'error' event: Session key required")
                emit(
                    'error', {'message': 'Session key required for reset_session event'})
                return

            try:
                robots = self.sessions_manager.reset_session(session_key)
                robot_states = {robot_id: robot.to_dict()
                                for robot_id, robot in robots.items()}

                result = {'status': 'success',
                          'message': 'Session reset successfully'}
                logger.debug(f"✅ Emitting 'reset_result' event: {result}")
                emit('reset_result', result)
                logger.debug(
                    f"📡 Broadcasting 'robot_states' event to session_{session_key} with {len(robot_states)} robots")
                self.socketio.emit('robot_states', robot_states,
                                   room=f"session_{session_key}")

            except Exception as e:
                error_result = {'status': 'error', 'message': str(e)}
                logger.debug(
                    f"❌ Emitting 'reset_result' error event: {error_result}")
                emit('reset_result', error_result)
