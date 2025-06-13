#!/usr/bin/env python3
"""
3D Web Humanoid Robot Simulator with WebSocket
Serves a Three.js-based 3D web interface with real-time WebSocket communication
"""

import asyncio
import json
import time
import random
import math
from typing import Dict, List, Set
from enum import Enum
from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit, disconnect
import threading

# Humanoid Actions
class HumanoidAction(Enum):
    IDLE = "idle"
    STEPPING = "stepping"
    TWIST = "twist"
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
    BOW = "bow"
    WAVE = "wave"
    TURN_RIGHT = "turn_right"
    TURN_LEFT = "turn_left"
    SIT_UPS = "sit_ups"
    RIGHT_MOVE_FAST = "right_move_fast"
    LEFT_MOVE_FAST = "left_move_fast"
    BACK_FAST = "back_fast"
    GO_FORWARD = "go_forward"
    PUSH_UPS = "push_ups"
    WEIGHTLIFTING = "weightlifting"
    KUNG_FU = "kung_fu"
    DANCE = "dance"
    JUMP = "jump"

class Robot3D:
    """3D Humanoid Robot for web visualization"""
    
    def __init__(self, robot_id: str, x: float, y: float, z: float, color: str):
        self.robot_id = robot_id
        self.position = {"x": x, "y": y, "z": z}
        self.rotation = {"x": 0, "y": random.uniform(0, 360), "z": 0}
        self.color = color
        
        # Current action
        self.current_action = HumanoidAction.IDLE
        self.action_start_time = 0
        self.action_progress = 0.0
        
        # Body part rotations for animations
        self.body_parts = {
            "head": {"x": 0, "y": 0, "z": 0},
            "torso": {"x": 0, "y": 0, "z": 0},
            "left_arm": {"x": 0, "y": 0, "z": 0},
            "right_arm": {"x": 0, "y": 0, "z": 0},
            "left_leg": {"x": 0, "y": 0, "z": 0},
            "right_leg": {"x": 0, "y": 0, "z": 0}
        }
        
        # Action durations
        self.action_durations = {
            HumanoidAction.STEPPING: 0.8,
            HumanoidAction.TWIST: 1.2,
            HumanoidAction.STAND_UP_BACK: 2.0,
            HumanoidAction.STAND_UP_FRONT: 2.0,
            HumanoidAction.RIGHT_KICK: 1.5,
            HumanoidAction.LEFT_KICK: 1.5,
            HumanoidAction.RIGHT_UPPERCUT: 0.8,
            HumanoidAction.LEFT_UPPERCUT: 0.8,
            HumanoidAction.WING_CHUN: 2.0,
            HumanoidAction.RIGHT_SHOT_FAST: 0.5,
            HumanoidAction.LEFT_SHOT_FAST: 0.5,
            HumanoidAction.CHEST: 1.0,
            HumanoidAction.SQUAT_UP: 1.5,
            HumanoidAction.SQUAT: 1.5,
            HumanoidAction.BOW: 2.0,
            HumanoidAction.WAVE: 1.5,
            HumanoidAction.TURN_RIGHT: 1.0,
            HumanoidAction.TURN_LEFT: 1.0,
            HumanoidAction.SIT_UPS: 2.0,
            HumanoidAction.RIGHT_MOVE_FAST: 0.5,
            HumanoidAction.LEFT_MOVE_FAST: 0.5,
            HumanoidAction.BACK_FAST: 0.5,
            HumanoidAction.GO_FORWARD: 0.5,
            HumanoidAction.PUSH_UPS: 2.5,
            HumanoidAction.WEIGHTLIFTING: 3.0,
            HumanoidAction.KUNG_FU: 4.0,
            HumanoidAction.DANCE: 5.0,
            HumanoidAction.JUMP: 1.0,
        }
    
    def start_action(self, action: HumanoidAction):
        """Start a specific action"""
        print(f"🎬 {self.robot_id}: Starting action {action.value}")
        self.current_action = action
        self.action_start_time = time.time()
        self.action_progress = 0.0
        print(f"   Action start time: {self.action_start_time}")
        print(f"   Expected duration: {self.action_durations.get(action, 1.0)}s")
    
    def update(self, dt: float):
        """Update robot state and animations"""
        if self.current_action != HumanoidAction.IDLE:
            elapsed = time.time() - self.action_start_time
            duration = self.action_durations.get(self.current_action, 1.0)
            self.action_progress = min(elapsed / duration, 1.0)
            
            # Debug output
            if elapsed < 0.1:  # Only log for first 0.1 seconds to avoid spam
                print(f"🎭 {self.robot_id}: {self.current_action.value} - {elapsed:.2f}s/{duration}s ({self.action_progress*100:.1f}%)")
            
            if self.action_progress >= 1.0:
                print(f"✅ {self.robot_id}: Action {self.current_action.value} completed")
                self.current_action = HumanoidAction.IDLE
                self.action_progress = 0.0
                self._reset_body_parts()
        
        # Update animations based on current action
        self._update_animations()
        
        # Update position for movement actions
        self._update_movement(dt)
    
    def _update_animations(self):
        """Update body part rotations based on current action"""
        progress = self.action_progress
        t = time.time()
        
        if self.current_action == HumanoidAction.WAVE:
            # Right arm waving - INCREASED amplitude
            self.body_parts["right_arm"]["z"] = -60 + 60 * math.sin(progress * 8)  # Increased from 30 to 60
            self.body_parts["right_arm"]["x"] = 20 * math.sin(progress * 6)  # Increased from 10 to 20
            
        elif self.current_action == HumanoidAction.BOW:
            # Bowing forward - INCREASED amplitude
            self.body_parts["torso"]["x"] = -60 * progress  # Increased from -30 to -60
            self.body_parts["head"]["x"] = -40 * progress   # Increased from -20 to -40
            
        elif self.current_action == HumanoidAction.RIGHT_KICK:
            # Right leg kick - INCREASED amplitude
            self.body_parts["right_leg"]["x"] = 90 * progress  # Increased from 45 to 90
            
        elif self.current_action == HumanoidAction.LEFT_KICK:
            # Left leg kick - INCREASED amplitude
            self.body_parts["left_leg"]["x"] = 90 * progress  # Increased from 45 to 90
            
        elif self.current_action == HumanoidAction.KUNG_FU:
            # Dynamic kung fu movements - INCREASED amplitude
            self.body_parts["left_arm"]["z"] = 60 * math.sin(progress * 10)   # Increased from 30 to 60
            self.body_parts["right_arm"]["z"] = -60 * math.sin(progress * 10) # Increased from -30 to -60
            self.body_parts["left_leg"]["x"] = 30 * math.sin(progress * 8)    # Increased from 15 to 30
            self.body_parts["torso"]["y"] = 20 * math.sin(progress * 12)      # Increased from 10 to 20
            
        elif self.current_action == HumanoidAction.DANCE:
            # Dance movements - INCREASED amplitude
            self.body_parts["left_arm"]["z"] = 90 * math.sin(progress * 6)           # Increased from 45 to 90
            self.body_parts["right_arm"]["z"] = -90 * math.sin(progress * 6 + math.pi) # Increased from -45 to -90
            self.body_parts["torso"]["y"] = 40 * math.sin(progress * 4)              # Increased from 20 to 40
            self.body_parts["head"]["y"] = 30 * math.sin(progress * 8)               # Increased from 15 to 30
            
        elif self.current_action == HumanoidAction.JUMP:
            # Jumping motion - INCREASED amplitude
            jump_height = 40 * math.sin(progress * math.pi)  # Increased from 20 to 40
            self.position["y"] = jump_height
            self.body_parts["left_arm"]["z"] = 60 * progress   # Increased from 30 to 60
            self.body_parts["right_arm"]["z"] = -60 * progress # Increased from -30 to -60
            
        elif self.current_action == HumanoidAction.PUSH_UPS:
            # Push-up position - INCREASED amplitude
            self.body_parts["torso"]["x"] = -90
            push_motion = 20 * math.sin(progress * 8)  # Increased from 10 to 20
            self.body_parts["left_arm"]["x"] = -90 + push_motion
            self.body_parts["right_arm"]["x"] = -90 + push_motion
            
        # Add a test action with EXTREME movement for debugging
        elif self.current_action.value == "test_extreme":
            # Extreme movements that should be impossible to miss
            self.body_parts["left_arm"]["z"] = 180 * math.sin(progress * 4)   # Full rotation
            self.body_parts["right_arm"]["z"] = -180 * math.sin(progress * 4) # Full rotation opposite
            self.body_parts["head"]["y"] = 90 * math.sin(progress * 6)        # Head spinning
            self.body_parts["torso"]["x"] = 45 * math.sin(progress * 3)       # Torso bending
            print(f"🔥 EXTREME TEST: Left arm: {self.body_parts['left_arm']['z']:.1f}°")
    
    def _update_movement(self, dt: float):
        """Update position for movement actions"""
        if self.current_action == HumanoidAction.GO_FORWARD:
            angle_rad = math.radians(self.rotation["y"])
            speed = 50 * dt
            self.position["x"] += speed * math.sin(angle_rad)
            self.position["z"] += speed * math.cos(angle_rad)
            
        elif self.current_action == HumanoidAction.BACK_FAST:
            angle_rad = math.radians(self.rotation["y"])
            speed = 30 * dt
            self.position["x"] -= speed * math.sin(angle_rad)
            self.position["z"] -= speed * math.cos(angle_rad)
            
        elif self.current_action == HumanoidAction.TURN_RIGHT:
            self.rotation["y"] += 120 * dt
            if self.rotation["y"] >= 360:
                self.rotation["y"] -= 360
                
        elif self.current_action == HumanoidAction.TURN_LEFT:
            self.rotation["y"] -= 120 * dt
            if self.rotation["y"] < 0:
                self.rotation["y"] += 360
    
    def _reset_body_parts(self):
        """Reset all body parts to default positions"""
        for part in self.body_parts:
            self.body_parts[part] = {"x": 0, "y": 0, "z": 0}
        self.position["y"] = 0  # Reset jump height
    
    def to_dict(self):
        """Convert robot state to dictionary for JSON serialization"""
        return {
            "robot_id": self.robot_id,
            "position": self.position,
            "rotation": self.rotation,
            "color": self.color,
            "current_action": self.current_action.value,
            "action_progress": self.action_progress,
            "is_idle": self.current_action == HumanoidAction.IDLE,
            "body_parts": self.body_parts
        }

class WebHumanoidSimulator:
    """3D Web-based Humanoid Robot Simulator"""
    
    def __init__(self, port: int = 5000):
        self.port = port
        self.app = Flask(__name__, template_folder='templates', static_folder='static')
        CORS(self.app)
        self.socketio = SocketIO(self.app, cors_allowed_origins="*")
        
        # Robot colors
        self.robot_colors = [
            "#4A90E2",  # Blue
            "#E24A90",  # Pink
            "#90E24A",  # Green
            "#E2904A",  # Orange
            "#904AE2",  # Purple
            "#4AE290",  # Cyan
        ]
        
        # Create 6 robots in 3D space
        self.robots = {}
        self._create_robots()
        
        # Action mapping
        self.action_mapping = {
            "stepping": HumanoidAction.STEPPING,
            "twist": HumanoidAction.TWIST,
            "stand_up_back": HumanoidAction.STAND_UP_BACK,
            "stand_up_front": HumanoidAction.STAND_UP_FRONT,
            "right_kick": HumanoidAction.RIGHT_KICK,
            "left_kick": HumanoidAction.LEFT_KICK,
            "right_uppercut": HumanoidAction.RIGHT_UPPERCUT,
            "left_uppercut": HumanoidAction.LEFT_UPPERCUT,
            "wing_chun": HumanoidAction.WING_CHUN,
            "right_shot_fast": HumanoidAction.RIGHT_SHOT_FAST,
            "left_shot_fast": HumanoidAction.LEFT_SHOT_FAST,
            "chest": HumanoidAction.CHEST,
            "squat_up": HumanoidAction.SQUAT_UP,
            "squat": HumanoidAction.SQUAT,
            "bow": HumanoidAction.BOW,
            "wave": HumanoidAction.WAVE,
            "turn_right": HumanoidAction.TURN_RIGHT,
            "turn_left": HumanoidAction.TURN_LEFT,
            "sit_ups": HumanoidAction.SIT_UPS,
            "right_move_fast": HumanoidAction.RIGHT_MOVE_FAST,
            "left_move_fast": HumanoidAction.LEFT_MOVE_FAST,
            "back_fast": HumanoidAction.BACK_FAST,
            "go_forward": HumanoidAction.GO_FORWARD,
            "push_ups": HumanoidAction.PUSH_UPS,
            "weightlifting": HumanoidAction.WEIGHTLIFTING,
            "kung_fu": HumanoidAction.KUNG_FU,
            "dance": HumanoidAction.DANCE,
            "jump": HumanoidAction.JUMP,
            "stop": HumanoidAction.IDLE,
            "idle": HumanoidAction.IDLE,
        }
        
        self._setup_routes()
        self._setup_websocket_events()
        
        # Start update loop
        self.running = True
        self.update_thread = threading.Thread(target=self._update_loop, daemon=True)
        self.update_thread.start()
        
        print("🌐 3D Web Humanoid Robot Simulator initialized!")
        print(f"🚀 Open your browser to: http://localhost:{port}")
        print("📡 Robot IDs: robot_1, robot_2, robot_3, robot_4, robot_5, robot_6")
        print("📡 Special ID: 'all' (controls all robots)")
    
    def _create_robots(self):
        """Create 6 robots in 3D grid formation"""
        positions = [
            (-100, 0, -50), (0, 0, -50), (100, 0, -50),    # Front row
            (-100, 0, 50),  (0, 0, 50),  (100, 0, 50)      # Back row
        ]
        
        for i in range(6):
            robot_id = f"robot_{i+1}"
            x, y, z = positions[i]
            color = self.robot_colors[i]
            
            # Add some randomness
            x += random.uniform(-20, 20)
            z += random.uniform(-20, 20)
            
            self.robots[robot_id] = Robot3D(robot_id, x, y, z, color)
            print(f"  {robot_id}: Position ({x:.0f}, {y:.0f}, {z:.0f}), Color {color}")
    
    def _setup_routes(self):
        """Setup Flask routes"""
        
        @self.app.route('/')
        def index():
            return render_template('index.html')
        
        @self.app.route('/test')
        def test_page():
            return render_template('test.html')
        
        @self.app.route('/static/<path:filename>')
        def static_files(filename):
            return send_from_directory('static', filename)
        
        @self.app.route('/api/robots')
        def get_robots():
            return {
                "success": True,
                "robots": {robot_id: robot.to_dict() for robot_id, robot in self.robots.items()},
                "robot_count": len(self.robots),
                "timestamp": time.time()
            }
        
        @self.app.route('/api/actions')
        def get_actions():
            return {
                "success": True,
                "actions": list(self.action_mapping.keys()),
                "total_count": len(self.action_mapping)
            }
    
    def _setup_websocket_events(self):
        """Setup WebSocket event handlers"""
        
        @self.socketio.on('connect')
        def handle_connect():
            print(f"🔌 Client connected: {id}")
            # Send initial robot states
            emit('robot_states', {
                robot_id: robot.to_dict() for robot_id, robot in self.robots.items()
            })
        
        @self.socketio.on('disconnect')
        def handle_disconnect():
            print(f"🔌 Client disconnected")
        
        @self.socketio.on('run_action')
        def handle_run_action(data):
            """Handle robot action requests via WebSocket"""
            print(f"🎮 Received WebSocket action: {data}")
            try:
                robot_id = data.get('robot_id')
                action = data.get('action')
                
                print(f"🤖 Processing: robot_id={robot_id}, action={action}")
                
                if not robot_id or not action:
                    print("❌ Missing robot_id or action")
                    emit('action_result', {
                        'success': False,
                        'error': 'Missing robot_id or action'
                    })
                    return
                
                results = []
                
                # Handle 'all' robot ID
                if robot_id.lower() == 'all':
                    print(f"🎯 Executing action '{action}' on ALL robots")
                    for rid, robot in self.robots.items():
                        result = self._execute_action(rid, robot, action)
                        results.append(result)
                        print(f"   ✅ {rid}: {result['success']}")
                else:
                    # Handle individual robot
                    if robot_id not in self.robots:
                        print(f"❌ Robot {robot_id} not found")
                        emit('action_result', {
                            'success': False,
                            'error': f'Robot {robot_id} not found'
                        })
                        return
                    
                    print(f"🎯 Executing action '{action}' on {robot_id}")
                    robot = self.robots[robot_id]
                    result = self._execute_action(robot_id, robot, action)
                    results.append(result)
                    print(f"   ✅ {robot_id}: {result['success']} - {result['message']}")
                
                emit('action_result', {
                    'success': True,
                    'results': results
                })
                print(f"📤 Action result sent: {len(results)} robot(s) processed")
                
                # IMMEDIATELY broadcast robot states after action
                print("📡 Broadcasting robot states immediately after action...")
                robot_states = {
                    robot_id: robot.to_dict() for robot_id, robot in self.robots.items()
                }
                
                # Check if any robots are active
                active_robots = [rid for rid, data in robot_states.items() if data['current_action'] != 'idle']
                if active_robots:
                    print(f"🎭 Active robots after action: {active_robots}")
                else:
                    print("😴 All robots idle after action")
                
                emit('robot_states', robot_states)
                print("✅ Robot states broadcasted immediately to trigger frontend updates")
                
            except Exception as e:
                print(f"❌ WebSocket action error: {e}")
                emit('action_result', {
                    'success': False,
                    'error': str(e)
                })
        
        @self.socketio.on('get_robot_states')
        def handle_get_robot_states():
            """Send current robot states"""
            emit('robot_states', {
                robot_id: robot.to_dict() for robot_id, robot in self.robots.items()
            })
    
    def _execute_action(self, robot_id: str, robot: Robot3D, action: str):
        """Execute action on a robot"""
        result = {
            "robot_id": robot_id,
            "action": action,
            "timestamp": time.time(),
            "success": False,
            "message": ""
        }
        
        try:
            if action.lower() == "stop":
                robot.current_action = HumanoidAction.IDLE
                robot.action_progress = 0.0
                robot._reset_body_parts()
                result["success"] = True
                result["message"] = f"Robot {robot_id} stopped successfully"
            
            elif action.lower() in self.action_mapping:
                target_action = self.action_mapping[action.lower()]
                robot.start_action(target_action)
                result["success"] = True
                result["message"] = f"Action '{action}' started for robot {robot_id}"
            
            else:
                result["message"] = f"Unknown action: {action}"
        
        except Exception as e:
            result["message"] = f"Error executing action: {str(e)}"
        
        return result
    
    def _update_loop(self):
        """Main update loop for robot animations"""
        print("🔄 Starting robot animation update loop...")
        last_time = time.time()
        frame_count = 0
        last_broadcast_debug = 0
        
        while self.running:
            current_time = time.time()
            dt = current_time - last_time
            last_time = current_time
            frame_count += 1
            
            # Debug every 60 frames (1 second) but only if there are active robots
            active_robots = sum(1 for robot in self.robots.values() if robot.current_action != HumanoidAction.IDLE)
            
            if frame_count % 60 == 0:
                if active_robots > 0:
                    print(f"🎭 Update loop: Frame {frame_count}, {active_robots} robots animating")
                elif frame_count % 300 == 0:  # Every 5 seconds when idle
                    print(f"💤 Update loop: Frame {frame_count}, all robots idle")
            
            # Update all robots
            for robot in self.robots.values():
                robot.update(dt)
            
            # Broadcast robot states to all connected clients
            robot_states = {
                robot_id: robot.to_dict() for robot_id, robot in self.robots.items()
            }
            
            # Debug broadcast every 30 frames (0.5 seconds) when active
            if active_robots > 0 and frame_count % 30 == 0:
                print(f"📡 Broadcasting: {active_robots} active robots to {len(self.socketio.server.manager.rooms.get('/', {}))} clients")
            
            self.socketio.emit('robot_states', robot_states)
            
            # 60 FPS update rate
            time.sleep(1/60)
    
    def run(self):
        """Start the web server"""
        try:
            self.socketio.run(self.app, host='0.0.0.0', port=self.port, debug=False)
        except KeyboardInterrupt:
            print("\n🛑 Shutting down 3D Web Humanoid Robot Simulator...")
            self.running = False
        except Exception as e:
            print(f"❌ Server error: {e}")
            self.running = False

def main():
    """Main function"""
    import sys
    
    try:
        port = 5000
        if len(sys.argv) > 1:
            try:
                port = int(sys.argv[1])
            except ValueError:
                print(f"Invalid port: {sys.argv[1]}, using 5000")
        
        simulator = WebHumanoidSimulator(port=port)
        simulator.run()
    except KeyboardInterrupt:
        print("\nSimulator interrupted")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
