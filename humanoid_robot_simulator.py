#!/usr/bin/env python3
"""
Humanoid Robot Simulator with Web API
6 humanoid robots (robot_1 to robot_6) with 'all' support
"""

import pygame
import sys
import time
import random
import threading
from typing import Dict, List
from enum import Enum
from flask import Flask, request, jsonify
from flask_cors import CORS

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

class HumanoidRobot:
    """Humanoid robot for 6-robot simulator"""
    
    def __init__(self, x: float, y: float, color: tuple):
        self.x = x
        self.y = y
        self.angle = random.randint(0, 360)
        self.color = color
        
        # Current action
        self.current_action = HumanoidAction.IDLE
        self.action_start_time = 0
        self.action_progress = 0.0
        
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
        }
    
    def start_action(self, action: HumanoidAction):
        """Start a specific action"""
        self.current_action = action
        self.action_start_time = time.time()
        self.action_progress = 0.0
    
    def update(self, dt: float):
        """Update robot state with realistic movement"""
        if self.current_action != HumanoidAction.IDLE:
            elapsed = time.time() - self.action_start_time
            duration = self.action_durations.get(self.current_action, 1.0)
            self.action_progress = min(elapsed / duration, 1.0)
            
            if self.action_progress >= 1.0:
                self.current_action = HumanoidAction.IDLE
                self.action_progress = 0.0
        
        # Realistic movement for movement actions
        import math
        
        if self.current_action == HumanoidAction.GO_FORWARD:
            # Move forward in the direction the robot is facing
            angle_rad = math.radians(self.angle)
            speed = 80 * dt  # pixels per second
            self.x += speed * math.cos(angle_rad - math.pi/2)
            self.y += speed * math.sin(angle_rad - math.pi/2)
            
        elif self.current_action == HumanoidAction.BACK_FAST:
            # Move backward
            angle_rad = math.radians(self.angle)
            speed = 60 * dt
            self.x -= speed * math.cos(angle_rad - math.pi/2)
            self.y -= speed * math.sin(angle_rad - math.pi/2)
            
        elif self.current_action == HumanoidAction.TURN_RIGHT:
            self.angle += 120 * dt  # degrees per second
            if self.angle >= 360:
                self.angle -= 360
                
        elif self.current_action == HumanoidAction.TURN_LEFT:
            self.angle -= 120 * dt
            if self.angle < 0:
                self.angle += 360
                
        elif self.current_action == HumanoidAction.LEFT_MOVE_FAST:
            # Strafe left
            angle_rad = math.radians(self.angle)
            speed = 60 * dt
            self.x += speed * math.cos(angle_rad)
            self.y += speed * math.sin(angle_rad)
            
        elif self.current_action == HumanoidAction.RIGHT_MOVE_FAST:
            # Strafe right
            angle_rad = math.radians(self.angle)
            speed = 60 * dt
            self.x -= speed * math.cos(angle_rad)
            self.y -= speed * math.sin(angle_rad)
            
        elif self.current_action == HumanoidAction.STEPPING:
            # Small stepping motion
            angle_rad = math.radians(self.angle)
            speed = 30 * dt * math.sin(self.action_progress * 8)  # Oscillating movement
            self.x += speed * math.cos(angle_rad - math.pi/2)
            self.y += speed * math.sin(angle_rad - math.pi/2)
    
    def draw(self, screen: pygame.Surface, robot_id: str):
        """Draw the humanoid robot with body parts"""
        import math
        
        # Calculate positions based on robot center
        center_x, center_y = int(self.x), int(self.y)
        
        # Calculate angle for direction
        angle_rad = math.radians(self.angle)
        
        # Body dimensions
        head_radius = 8
        body_width = 12
        body_height = 20
        arm_length = 15
        leg_length = 18
        
        # Head position
        head_x = center_x
        head_y = center_y - 25
        
        # Body position
        body_rect = pygame.Rect(center_x - body_width//2, center_y - 15, body_width, body_height)
        
        # Arm positions
        left_shoulder_x = center_x - body_width//2
        right_shoulder_x = center_x + body_width//2
        shoulder_y = center_y - 10
        
        # Leg positions
        left_hip_x = center_x - 4
        right_hip_x = center_x + 4
        hip_y = center_y + 5
        
        # Action-based pose modifications
        arm_angle_left = 0
        arm_angle_right = 0
        leg_angle_left = 0
        leg_angle_right = 0
        
        if self.current_action == HumanoidAction.WAVE:
            arm_angle_right = -60 + 30 * math.sin(self.action_progress * 8)  # Waving motion
        elif self.current_action == HumanoidAction.BOW:
            # Bowing forward
            head_y += 5
            body_rect.y += 3
        elif self.current_action == HumanoidAction.RIGHT_KICK:
            leg_angle_right = 45
        elif self.current_action == HumanoidAction.LEFT_KICK:
            leg_angle_left = 45
        elif self.current_action == HumanoidAction.KUNG_FU:
            # Dynamic kung fu pose
            arm_angle_left = -30 + 20 * math.sin(self.action_progress * 10)
            arm_angle_right = 30 - 20 * math.sin(self.action_progress * 10)
        elif self.current_action == HumanoidAction.PUSH_UPS:
            # Push-up position
            body_rect.y += 10
            head_y += 10
            arm_angle_left = arm_angle_right = 90
        
        # Draw shadow
        shadow_color = (30, 30, 30)
        pygame.draw.ellipse(screen, shadow_color, (center_x - 15, center_y + 25, 30, 10))
        
        # Draw legs
        left_leg_end_x = left_hip_x + leg_length * math.sin(math.radians(leg_angle_left))
        left_leg_end_y = hip_y + leg_length * math.cos(math.radians(leg_angle_left))
        right_leg_end_x = right_hip_x + leg_length * math.sin(math.radians(leg_angle_right))
        right_leg_end_y = hip_y + leg_length * math.cos(math.radians(leg_angle_right))
        
        pygame.draw.line(screen, self.color, (left_hip_x, hip_y), (left_leg_end_x, left_leg_end_y), 4)
        pygame.draw.line(screen, self.color, (right_hip_x, hip_y), (right_leg_end_x, right_leg_end_y), 4)
        
        # Draw feet
        pygame.draw.circle(screen, tuple(max(0, c-20) for c in self.color), (int(left_leg_end_x), int(left_leg_end_y)), 3)
        pygame.draw.circle(screen, tuple(max(0, c-20) for c in self.color), (int(right_leg_end_x), int(right_leg_end_y)), 3)
        
        # Draw body
        pygame.draw.rect(screen, self.color, body_rect)
        pygame.draw.rect(screen, tuple(min(255, c+20) for c in self.color), body_rect, 2)
        
        # Draw arms
        left_arm_end_x = left_shoulder_x + arm_length * math.sin(math.radians(arm_angle_left))
        left_arm_end_y = shoulder_y + arm_length * math.cos(math.radians(arm_angle_left))
        right_arm_end_x = right_shoulder_x + arm_length * math.sin(math.radians(arm_angle_right))
        right_arm_end_y = shoulder_y + arm_length * math.cos(math.radians(arm_angle_right))
        
        pygame.draw.line(screen, self.color, (left_shoulder_x, shoulder_y), (left_arm_end_x, left_arm_end_y), 4)
        pygame.draw.line(screen, self.color, (right_shoulder_x, shoulder_y), (right_arm_end_x, right_arm_end_y), 4)
        
        # Draw hands
        pygame.draw.circle(screen, tuple(max(0, c-20) for c in self.color), (int(left_arm_end_x), int(left_arm_end_y)), 3)
        pygame.draw.circle(screen, tuple(max(0, c-20) for c in self.color), (int(right_arm_end_x), int(right_arm_end_y)), 3)
        
        # Draw head
        pygame.draw.circle(screen, tuple(min(255, c+30) for c in self.color), (head_x, head_y), head_radius)
        pygame.draw.circle(screen, (255, 255, 255), (head_x, head_y), head_radius, 2)
        
        # Draw face
        # Eyes
        pygame.draw.circle(screen, (0, 0, 0), (head_x - 3, head_y - 2), 1)
        pygame.draw.circle(screen, (0, 0, 0), (head_x + 3, head_y - 2), 1)
        
        # Direction indicator (small arrow on head)
        arrow_length = 12
        arrow_end_x = head_x + arrow_length * math.cos(angle_rad - math.pi/2)
        arrow_end_y = head_y + arrow_length * math.sin(angle_rad - math.pi/2)
        pygame.draw.line(screen, (255, 255, 255), (head_x, head_y), (arrow_end_x, arrow_end_y), 2)
        
        # Draw robot ID
        font = pygame.font.Font(None, 20)
        text = font.render(robot_id, True, (255, 255, 255))
        text_rect = text.get_rect(center=(center_x, center_y - 50))
        
        # Add background to text for better visibility
        bg_rect = text_rect.inflate(4, 2)
        pygame.draw.rect(screen, (0, 0, 0, 128), bg_rect)
        screen.blit(text, text_rect)
        
        # Draw current action
        if self.current_action != HumanoidAction.IDLE:
            action_text = self.current_action.value.replace('_', ' ').title()
            action_surface = pygame.font.Font(None, 16).render(action_text, True, (255, 200, 0))
            action_rect = action_surface.get_rect(center=(center_x, center_y + 40))
            
            # Add background to action text
            action_bg_rect = action_rect.inflate(4, 2)
            pygame.draw.rect(screen, (0, 0, 0, 128), action_bg_rect)
            screen.blit(action_surface, action_rect)
            
            # Progress bar
            bar_width = 40
            bar_height = 4
            bar_x = center_x - bar_width // 2
            bar_y = center_y + 50
            
            pygame.draw.rect(screen, (100, 100, 100), (bar_x, bar_y, bar_width, bar_height))
            progress_width = int(bar_width * self.action_progress)
            pygame.draw.rect(screen, (0, 255, 0), (bar_x, bar_y, progress_width, bar_height))

class RobotAPI:
    """Web API for 6 robots"""
    
    def __init__(self, robots: Dict[str, HumanoidRobot], port: int = 5000):
        self.robots = robots
        self.port = port
        
        # Flask setup
        self.app = Flask(__name__)
        CORS(self.app)
        
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
            "stop": HumanoidAction.IDLE,
            "idle": HumanoidAction.IDLE,
        }
        
        self._setup_routes()
        self.is_running = False
        self.api_thread = None
    
    def _setup_routes(self):
        """Setup API routes"""
        
        @self.app.route('/', methods=['GET'])
        def home():
            return {
                "message": "Humanoid Robot API",
                "version": "1.0",
                "robots": list(self.robots.keys()),
                "robot_count": 6,
                "special_robot_ids": {"all": "Controls all 6 robots simultaneously"},
                "available_actions": list(self.action_mapping.keys())
            }
        
        @self.app.route("/run_action/<robot_id>", methods=["POST"])
        def run_action(robot_id):
            """Run action for specific robot or all robots"""
            try:
                data = request.json or {}
                method = data.get("method", "RunAction")
                action = data.get("action")
                
                if not method or not action:
                    return {"error": "Missing method or action"}, 400
                
                # Handle 'all' robot ID
                if robot_id.lower() == "all":
                    results = []
                    for rid, robot in self.robots.items():
                        result = self._execute_action(rid, robot, method, action)
                        results.append(result)
                    return {"results": results}
                
                # Handle individual robot
                if robot_id not in self.robots:
                    return {"error": f"Robot {robot_id} not found. Available: {list(self.robots.keys())} or 'all'"}, 404
                
                robot = self.robots[robot_id]
                result = self._execute_action(robot_id, robot, method, action)
                return {"results": [result]}
            
            except Exception as e:
                return {"error": f"Internal server error: {str(e)}"}, 500
        
        @self.app.route("/status/all", methods=["GET"])
        def get_all_status():
            """Get status of all robots"""
            try:
                robots_status = {}
                for robot_id, robot in self.robots.items():
                    robots_status[robot_id] = {
                        "position": {"x": robot.x, "y": robot.y},
                        "angle": robot.angle,
                        "current_action": robot.current_action.value,
                        "action_progress": robot.action_progress,
                        "is_idle": robot.current_action == HumanoidAction.IDLE
                    }
                
                return {
                    "success": True,
                    "robot_count": 6,
                    "data": robots_status,
                    "timestamp": time.time()
                }
            except Exception as e:
                return {"success": False, "error": str(e)}, 500
        
        @self.app.route("/actions", methods=["GET"])
        def get_actions():
            """Get available actions"""
            return {
                "success": True,
                "actions": list(self.action_mapping.keys()),
                "total_count": len(self.action_mapping)
            }
    
    def _execute_action(self, robot_id: str, robot: HumanoidRobot, method: str, action: str):
        """Execute action on a robot"""
        result = {
            "robot_id": robot_id,
            "action": action,
            "timestamp": time.time(),
            "success": False,
            "message": ""
        }
        
        try:
            if method == "StopAction" or action.lower() == "stop":
                robot.current_action = HumanoidAction.IDLE
                robot.action_progress = 0.0
                result["success"] = True
                result["message"] = f"Robot {robot_id} stopped successfully"
            
            elif method == "RunAction" and action.lower() in self.action_mapping:
                target_action = self.action_mapping[action.lower()]
                robot.start_action(target_action)
                result["success"] = True
                result["message"] = f"Action '{action}' started for robot {robot_id}"
            
            else:
                result["message"] = f"Unknown action: {action}"
        
        except Exception as e:
            result["message"] = f"Error executing action: {str(e)}"
        
        return result
    
    def start(self):
        """Start API server"""
        if self.is_running:
            return
        
        self.is_running = True
        self.api_thread = threading.Thread(target=self._run_server, daemon=True)
        self.api_thread.start()
        print(f"🌐 Humanoid Robot API started on http://localhost:{self.port}")
    
    def stop(self):
        """Stop API server"""
        self.is_running = False
    
    def _run_server(self):
        """Run Flask server"""
        try:
            self.app.run(host='0.0.0.0', port=self.port, debug=False, use_reloader=False, threaded=True)
        except Exception as e:
            print(f"API server error: {e}")
            self.is_running = False

class HumanoidRobotSimulator:
    """Simulator for exactly 6 robots"""
    
    def __init__(self, width: int = 1200, height: int = 800, api_port: int = 5000):
        # Initialize pygame
        pygame.init()
        self.width = width
        self.height = height
        self.screen = pygame.display.set_mode((width, height))
        pygame.display.set_caption("Humanoid Robot Simulator")
        self.clock = pygame.time.Clock()
        
        # Robot colors
        self.robot_colors = [
            (100, 150, 200),  # Blue
            (200, 100, 150),  # Pink  
            (150, 200, 100),  # Green
            (200, 150, 100),  # Orange
            (150, 100, 200),  # Purple
            (100, 200, 200),  # Cyan
        ]
        
        # Create 6 robots
        self.robots = {}
        self._create_robots()
        
        # Create API
        self.api = RobotAPI(self.robots, api_port)
        self.api.start()
        
        # Control variables
        self.running = True
        self.paused = False
        
        print("🤖 Humanoid Robot Simulator initialized!")
        print(f"🌐 Web API: http://localhost:{api_port}")
        print("📡 Robot IDs: robot_1, robot_2, robot_3, robot_4, robot_5, robot_6")
        print("📡 Special ID: 'all' (controls all robots)")
    
    def _create_robots(self):
        """Create 6 robots in grid formation"""
        positions = [
            (200, 200), (400, 200), (600, 200),  # Top row
            (200, 400), (400, 400), (600, 400)   # Bottom row
        ]
        
        for i in range(6):
            robot_id = f"robot_{i+1}"
            x, y = positions[i]
            color = self.robot_colors[i]
            
            # Add some randomness
            x += random.randint(-50, 50)
            y += random.randint(-50, 50)
            
            self.robots[robot_id] = HumanoidRobot(x, y, color)
            print(f"  {robot_id}: Position ({x}, {y}), Color {color}")
    
    def handle_events(self):
        """Handle pygame events"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.running = False
                elif event.key == pygame.K_SPACE:
                    self.paused = not self.paused
                elif event.key == pygame.K_r:
                    self._reset_robots()
    
    def _reset_robots(self):
        """Reset all robots to idle"""
        for robot in self.robots.values():
            robot.current_action = HumanoidAction.IDLE
            robot.action_progress = 0.0
        print("All robots reset to idle")
    
    def update(self, dt: float):
        """Update simulation"""
        if not self.paused:
            for robot in self.robots.values():
                robot.update(dt)
    
    def render(self):
        """Render the simulation"""
        # Clear screen
        self.screen.fill((50, 50, 50))
        
        # Draw robots
        for robot_id, robot in self.robots.items():
            robot.draw(self.screen, robot_id)
        
        # Draw title
        font = pygame.font.Font(None, 36)
        title = font.render("Humanoid Robot Simulator", True, (255, 255, 255))
        self.screen.blit(title, (10, 10))
        
        # Draw API info
        font = pygame.font.Font(None, 24)
        api_text = font.render("🌐 Web API: http://localhost:5000", True, (100, 255, 100))
        self.screen.blit(api_text, (10, 50))
        
        # Draw controls
        font = pygame.font.Font(None, 20)
        controls = [
            "Controls: SPACE=Pause, R=Reset, ESC=Exit",
            "API: POST /run_action/robot_1 or /run_action/all",
            "Actions: wave, bow, kick, kung_fu, go_forward, etc."
        ]
        for i, control in enumerate(controls):
            text = font.render(control, True, (200, 200, 200))
            self.screen.blit(text, (10, 80 + i * 25))
        
        # Draw pause indicator
        if self.paused:
            pause_text = font.render("PAUSED", True, (255, 100, 100))
            self.screen.blit(pause_text, (self.width - 100, 10))
        
        pygame.display.flip()
    
    def run(self):
        """Main simulation loop"""
        try:
            while self.running:
                dt = self.clock.tick(60) / 1000.0
                self.handle_events()
                self.update(dt)
                self.render()
        finally:
            print("Shutting down Humanoid Robot Simulator...")
            self.api.stop()
            pygame.quit()

def main():
    """Main function"""
    try:
        api_port = 5000
        if len(sys.argv) > 1:
            try:
                api_port = int(sys.argv[1])
            except ValueError:
                print(f"Invalid port: {sys.argv[1]}, using 5000")
        
        simulator = HumanoidRobotSimulator(api_port=api_port)
        simulator.run()
    except KeyboardInterrupt:
        print("\nSimulator interrupted")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    main()
