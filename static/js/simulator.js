/**
 * 3D Humanoid Robot Simulator - Main Application
 * Handles WebSocket communication and UI interactions
 */

class HumanoidSimulator {
    constructor() {
        this.socket = null;
        this.scene3d = null;
        this.robots = new Map();
        this.isConnected = false;
        this.fpsCounter = 0;
        this.lastFpsTime = Date.now();
        
        this.init();
    }
    
    init() {
        // Initialize WebSocket connection
        this.initWebSocket();
        
        // Initialize 3D scene
        this.init3DScene();
        
        // Setup UI event listeners
        this.setupUIEvents();
        
        // Start FPS counter
        this.startFpsCounter();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 2000);
    }
    
    initWebSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('🔌 Connected to server');
            this.isConnected = true;
            this.updateConnectionStatus(true);
            
            // Request initial robot states immediately after connection
            console.log('📡 Requesting initial robot states...');
            this.socket.emit('get_robot_states');
        });
        
        this.socket.on('disconnect', () => {
            console.log('🔌 Disconnected from server');
            this.isConnected = false;
            this.updateConnectionStatus(false);
        });
        
        this.socket.on('robot_states', (robotStates) => {
            this.updateRobotStates(robotStates);
        });
        
        this.socket.on('action_result', (result) => {
            console.log('📨 Received action result:', result);
            this.handleActionResult(result);
        });
        
        // Request initial robot states
        this.socket.emit('get_robot_states');
    }
    
    init3DScene() {
        const canvas = document.getElementById('three-canvas');
        this.scene3d = new Scene3D(canvas);
    }
    
    setupUIEvents() {
        // Action buttons
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const robotId = document.getElementById('robot-select').value;
                this.sendAction(robotId, action);
            });
        });
        
        // Quick action buttons
        document.getElementById('all-wave').addEventListener('click', () => {
            this.sendAction('all', 'wave');
        });
        
        document.getElementById('all-dance').addEventListener('click', () => {
            this.sendAction('all', 'dance');
        });
        
        document.getElementById('all-kungfu').addEventListener('click', () => {
            this.sendAction('all', 'kung_fu');
        });
        
        document.getElementById('all-stop').addEventListener('click', () => {
            this.sendAction('all', 'stop');
        });
        
        // Viewport controls
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.scene3d.resetCamera();
        });
        
        document.getElementById('toggle-wireframe').addEventListener('click', () => {
            this.scene3d.toggleWireframe();
        });
        
        document.getElementById('toggle-shadows').addEventListener('click', () => {
            this.scene3d.toggleShadows();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    handleKeyboard(e) {
        const robotId = document.getElementById('robot-select').value;
        
        switch(e.key.toLowerCase()) {
            case '1': this.sendAction(robotId, 'wave'); break;
            case '2': this.sendAction(robotId, 'bow'); break;
            case '3': this.sendAction(robotId, 'dance'); break;
            case '4': this.sendAction(robotId, 'kung_fu'); break;
            case 'w': this.sendAction(robotId, 'go_forward'); break;
            case 's': this.sendAction(robotId, 'back_fast'); break;
            case 'a': this.sendAction(robotId, 'turn_left'); break;
            case 'd': this.sendAction(robotId, 'turn_right'); break;
            case ' ': 
                e.preventDefault();
                this.sendAction(robotId, 'jump'); 
                break;
            case 'escape': this.sendAction('all', 'stop'); break;
            case 'r': this.scene3d.resetCamera(); break;
        }
    }
    
    sendAction(robotId, action) {
        if (!this.isConnected) {
            this.showNotification('❌ Not connected to server', 'error');
            console.error('❌ WebSocket not connected');
            return;
        }
        
        console.log(`🎮 Sending action: ${robotId} -> ${action}`);
        
        // Debug: Log the exact data being sent
        const actionData = {
            robot_id: robotId,
            action: action
        };
        console.log('📡 WebSocket data:', actionData);
        
        this.socket.emit('run_action', actionData);
        
        // Visual feedback
        this.highlightActionButton(action);
        this.showNotification(`🤖 ${robotId}: ${action}`, 'info');
        
        // Debug: Confirm emission
        console.log('✅ Action emitted via WebSocket');
    }
    
    updateRobotStates(robotStates) {
        console.log('📡 Received robot states:', robotStates);
        console.log('🤖 Number of robots received:', Object.keys(robotStates).length);
        
        Object.entries(robotStates).forEach(([robotId, robotData]) => {
            console.log(`🤖 Processing robot: ${robotId}`, robotData);
            
            // Add robot to scene if not exists
            if (!this.robots.has(robotId)) {
                console.log(`➕ Adding new robot: ${robotId}`);
                this.scene3d.addRobot(robotData);
                this.robots.set(robotId, robotData);
            } else {
                // Update existing robot
                console.log(`🔄 Updating existing robot: ${robotId}`);
                this.scene3d.updateRobot(robotData);
                this.robots.set(robotId, robotData);
            }
        });
        
        // Update UI
        this.updateRobotStatusUI();
        this.updateRobotCount();
        
        console.log(`📊 Total robots in simulator: ${this.robots.size}`);
    }
    
    updateRobotStatusUI() {
        const statusContainer = document.getElementById('robot-status');
        statusContainer.innerHTML = '';
        
        this.robots.forEach((robotData, robotId) => {
            const statusItem = document.createElement('div');
            statusItem.className = `robot-status-item ${robotData.is_idle ? '' : 'active'}`;
            
            const progress = Math.round(robotData.action_progress * 100);
            const actionText = robotData.current_action.replace('_', ' ').toUpperCase();
            
            statusItem.innerHTML = `
                <div>
                    <div class="robot-name">${robotId}</div>
                    <div class="robot-action">${actionText}</div>
                </div>
                <div class="robot-progress">
                    <div class="robot-progress-bar" style="width: ${progress}%"></div>
                </div>
            `;
            
            statusContainer.appendChild(statusItem);
        });
    }
    
    updateRobotCount() {
        const activeRobots = Array.from(this.robots.values()).filter(robot => !robot.is_idle).length;
        document.getElementById('robot-count').textContent = `Robots: ${this.robots.size}/6`;
        document.getElementById('robot-actions').textContent = `Active: ${activeRobots}`;
    }
    
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connection-status');
        if (connected) {
            statusElement.textContent = '🟢 Connected';
            statusElement.className = 'connected';
        } else {
            statusElement.textContent = '🔴 Disconnected';
            statusElement.className = 'disconnected';
        }
    }
    
    handleActionResult(result) {
        if (result.success) {
            console.log('✅ Action successful:', result.results);
            
            // Show success notification
            const robotCount = result.results ? result.results.length : 1;
            this.showNotification(`✅ Action sent to ${robotCount} robot(s)`, 'success');
        } else {
            console.error('❌ Action failed:', result.error);
            this.showNotification(`❌ ${result.error}`, 'error');
        }
    }
    
    highlightActionButton(action) {
        // Remove previous highlights
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('pulse');
        });
        
        // Highlight the pressed button
        const button = document.querySelector(`[data-action="${action}"]`);
        if (button) {
            button.classList.add('pulse');
            setTimeout(() => {
                button.classList.remove('pulse');
            }, 1000);
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                break;
            case 'info':
            default:
                notification.style.background = 'linear-gradient(135deg, #4A90E2, #357ABD)';
                break;
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    startFpsCounter() {
        const updateFps = () => {
            this.fpsCounter++;
            const now = Date.now();
            
            if (now - this.lastFpsTime >= 1000) {
                document.getElementById('fps-counter').textContent = `FPS: ${this.fpsCounter}`;
                this.fpsCounter = 0;
                this.lastFpsTime = now;
            }
            
            requestAnimationFrame(updateFps);
        };
        
        updateFps();
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing 3D Humanoid Robot Simulator...');
    window.simulator = new HumanoidSimulator();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('📱 Page hidden, reducing updates');
    } else {
        console.log('📱 Page visible, resuming normal updates');
        if (window.simulator && window.simulator.socket) {
            window.simulator.socket.emit('get_robot_states');
        }
    }
});

// Handle window beforeunload
window.addEventListener('beforeunload', () => {
    if (window.simulator && window.simulator.socket) {
        window.simulator.socket.disconnect();
    }
});
