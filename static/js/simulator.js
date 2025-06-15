/**
 * Enhanced 3D Humanoid Robot Simulator - 44 Actions Available
 * Complete action library with proper timing and realistic animations
 */

class HumanoidSimulator {
    constructor() {
        this.socket = null;
        this.scene3d = null;
        this.robots = new Map();
        this.isConnected = false;
        this.retryCount = 0;
        this.maxRetries = 5;
        this.sessionKey = null;

        console.log('🚀 Starting Enhanced Humanoid Simulator...');
        this.init();
    }

    init() {
        console.log('🔧 Initializing simulator components...');

        // Get session key from URL or prompt user
        this.sessionKey = this.getSessionKey();
        if (!this.sessionKey) {
            console.error('❌ No session key provided');
            return;
        }

        console.log(`🔐 Using session key: ${this.sessionKey}`);

        // Initialize 3D scene first
        this.init3DScene();

        // Load robots from server
        this.loadRobotsFromServer();

        // Initialize WebSocket connection
        this.initWebSocket();

        // Setup UI event listeners
        this.setupUIEvents();

        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 2000);

        console.log('✅ Simulator initialization complete');
    }

    getSessionKey() {
        // Try to get session key from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sessionKey = urlParams.get('session_key');

        if (sessionKey) {
            return sessionKey;
        }

        // If no session key in URL, show error
        console.error('❌ No session key found in URL');
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h1>🔐 Session Key Required</h1>
                <p>Please provide a session key to access the robot simulator.</p>
                <p>Add <code>?session_key=YOUR_SESSION_ID</code> to the URL.</p>
                <p>Example: <code>${window.location.origin}${window.location.pathname}?session_key=my_session</code></p>
                <form onsubmit="window.location.href='/?session_key=' + document.getElementById('session_input').value; return false;">
                    <label>Session Key: </label>
                    <input type="text" id="session_input" placeholder="Enter your session ID" required>
                    <button type="submit">Connect</button>
                </form>
            </div>
        `;
        return null;
    }

    init3DScene() {
        console.log('🎬 Initializing 3D scene...');
        const canvas = document.getElementById('three-canvas');

        if (!canvas) {
            console.error('❌ Canvas element not found!');
            return;
        }

        this.scene3d = new Scene3D(canvas);
        console.log('✅ 3D scene initialized');
    }

    async loadRobotsFromServer() {
        console.log('📡 Loading robots from server...');

        try {
            const response = await fetch(`/api/robots?session_key=${this.sessionKey}`);
            const data = await response.json();

            if (data.success && data.robots) {
                console.log(`📡 Loaded ${data.robot_count} robots from server`);

                // Add robots to 3D scene
                Object.values(data.robots).forEach(robotData => {
                    if (this.scene3d) {
                        this.scene3d.addRobot(robotData);
                        this.robots.set(robotData.robot_id, robotData);
                    }
                });

                this.updateRobotCount();
                console.log('✅ Robots loaded from server successfully');
            } else {
                console.log('⚠️ No robots found on server, adding test robots as fallback');
                this.addTestRobots();
            }
        } catch (error) {
            console.error('❌ Failed to load robots from server:', error);
            console.log('⚠️ Using test robots as fallback');
            this.addTestRobots();
        }
    }

    addTestRobots() {
        console.log('🧪 Adding test robots as fallback...');

        const testRobots = [
            { robot_id: 'robot_1', position: [-50, 0, -50], color: '#4A90E2' },
            { robot_id: 'robot_2', position: [0, 0, -50], color: '#E24A90' },
            { robot_id: 'robot_3', position: [50, 0, -50], color: '#90E24A' },
            { robot_id: 'robot_4', position: [-50, 0, 50], color: '#E2904A' },
            { robot_id: 'robot_5', position: [0, 0, 50], color: '#904AE2' },
            { robot_id: 'robot_6', position: [50, 0, 50], color: '#4AE290' }
        ];

        testRobots.forEach(robotData => {
            if (this.scene3d) {
                const robot = this.scene3d.addRobot({
                    ...robotData,
                    rotation: [0, 0, 0],
                    current_action: 'idle',
                    action_progress: 0.0,
                    body_parts: {
                        head: { x: 0, y: 0, z: 0 },
                        torso: { x: 0, y: 0, z: 0 },
                        left_arm: { x: 0, y: 0, z: 0 },
                        right_arm: { x: 0, y: 0, z: 0 },
                        left_leg: { x: 0, y: 0, z: 0 },
                        right_leg: { x: 0, y: 0, z: 0 }
                    }
                });
                this.robots.set(robotData.robot_id, robotData);
            }
        });

        this.updateRobotCount();
        console.log('✅ Test robots added successfully');
    }

    initWebSocket() {
        console.log('🔌 Initializing WebSocket connection...');

        try {
            this.socket = io();

            this.socket.on('connect', () => {
                console.log('✅ Connected to WebSocket server');
                this.isConnected = true;
                this.retryCount = 0;
                this.updateConnectionStatus(true);

                // Join the session
                console.log(`� Joining session: ${this.sessionKey}`);
                this.socket.emit('join_session', { session_key: this.sessionKey });
            });

            this.socket.on('disconnect', () => {
                console.log('🔌 Disconnected from WebSocket server');
                this.isConnected = false;
                this.updateConnectionStatus(false);
                this.attemptReconnect();
            });

            this.socket.on('robot_states', (robotStates) => {
                console.log('📡 Real robot states received:', Object.keys(robotStates).length, 'robots');
                this.updateRobotStates(robotStates);
            });

            this.socket.on('action_result', (result) => {
                console.log('📨 Action result:', result);
                this.handleActionResult(result);
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ WebSocket connection error:', error);
                this.updateConnectionStatus(false);
                this.attemptReconnect();
            });

            this.socket.on('error', (error) => {
                console.error('❌ WebSocket error:', error);
                if (error.message && error.message.includes('Session key')) {
                    alert(`Session Error: ${error.message}`);
                }
            });

            // Server-side robot management handlers
            this.socket.on('robot_added', (data) => {
                console.log('➕ Robot added by server:', data);
                if (this.scene3d && data.robot_data) {
                    this.scene3d.addRobot(data.robot_data);
                    this.robots.set(data.robot_id, data.robot_data);
                }
                this.updateRobotCount();
            });

            this.socket.on('robot_removed', (data) => {
                console.log('🗑️ Robot removed by server:', data);
                if (this.scene3d && data.removed_robot) {
                    this.scene3d.removeRobot(data.removed_robot);
                    this.robots.delete(data.removed_robot);
                }
                this.updateRobotCount();
            });

            this.socket.on('robots_removed_all', (data) => {
                console.log('🗑️ All robots removed by server:', data);
                if (this.scene3d && data.removed_robots) {
                    data.removed_robots.forEach(robotId => {
                        this.scene3d.removeRobot(robotId);
                        this.robots.delete(robotId);
                    });
                }
                this.updateRobotCount();
            });

            this.socket.on('robots_reset', (data) => {
                console.log('🔄 Robots reset by server:', data);
                // Clear all robots first
                this.robots.clear();
                if (this.scene3d) {
                    this.scene3d.clearAllRobots();
                }

                // Add new robots from server
                if (data.robots) {
                    Object.values(data.robots).forEach(robotData => {
                        if (this.scene3d) {
                            this.scene3d.addRobot(robotData);
                            this.robots.set(robotData.robot_id, robotData);
                        }
                    });
                }
                this.updateRobotCount();
            });

            this.socket.on('reset_result', (result) => {
                console.log('🔄 Reset session result:', result);
                this.handleResetResult(result);
            });

        } catch (error) {
            console.error('❌ WebSocket initialization failed:', error);
            this.updateConnectionStatus(false);
        }
    }

    attemptReconnect() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`🔄 Attempting reconnection ${this.retryCount}/${this.maxRetries}...`);

            setTimeout(() => {
                if (!this.isConnected) {
                    this.initWebSocket();
                }
            }, 2000 * this.retryCount);
        } else {
            console.log('⚠️ Max reconnection attempts reached. Using test robots only.');
        }
    }

    updateRobotStates(robotStates) {
        console.log('🔄 Updating robot states...');

        if (!this.scene3d) {
            console.error('❌ Scene3D not available');
            return;
        }

        try {
            Object.entries(robotStates).forEach(([robotId, robotData]) => {
                console.log(`🤖 Processing ${robotId}:`, robotData);

                // Update or add robot
                if (this.robots.has(robotId)) {
                    this.scene3d.updateRobot(robotData);
                } else {
                    this.scene3d.addRobot(robotData);
                    this.robots.set(robotId, robotData);
                }
            });

            this.updateRobotCount();
            console.log('✅ Robot states updated successfully');

        } catch (error) {
            console.error('❌ Error updating robot states:', error);
        }
    }

    setupUIEvents() {
        console.log('🎮 Setting up UI events...');

        // Reset camera button
        const resetCameraBtn = document.getElementById('reset-camera');
        if (resetCameraBtn) {
            resetCameraBtn.addEventListener('click', () => {
                if (this.scene3d) {
                    this.scene3d.resetCamera();
                }
            });
        }

        // Reset session button
        const resetSessionBtn = document.getElementById('reset-session');
        if (resetSessionBtn) {
            resetSessionBtn.addEventListener('click', () => {
                this.resetSession();
            });
        }

        // Action buttons - ENHANCED with immediate visual feedback
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (!action) return;

                const robotSelect = document.getElementById('robot-select');
                const robotId = robotSelect ? robotSelect.value : 'all';

                console.log(`🎬 Button clicked: ${action} for ${robotId}`);

                // Visual feedback - highlight button
                e.target.style.background = e.target.classList.contains('movement-btn') ? '#1e7e34' : '#2E6DA4';
                setTimeout(() => {
                    e.target.style.background = e.target.classList.contains('movement-btn') ? '#28a745' : '#4A90E2';
                }, 200);

                // Trigger action immediately (local animation)
                this.triggerLocalAction(robotId, action);

                // Also send to server if connected
                this.sendAction(robotId, action);

                // Update last action display
                this.updateLastAction(robotId, action);
            });
        });

        // Robot selection change
        const robotSelect = document.getElementById('robot-select');
        if (robotSelect) {
            robotSelect.addEventListener('change', (e) => {
                console.log('🎯 Selected robot:', e.target.value);
            });
        }

        console.log('✅ UI events setup complete');
    }

    // Trigger action locally for immediate feedback
    triggerLocalAction(robotId, action) {
        console.log(`🎭 Triggering LOCAL action: ${action} for ${robotId}`);

        if (!this.scene3d) {
            console.warn('⚠️ Scene3D not available for local action');
            return;
        }

        if (robotId === 'all') {
            // Trigger action on all robots
            this.scene3d.triggerAllRobotsAction(action);
        } else {
            // Trigger action on specific robot
            this.scene3d.triggerRobotAction(robotId, action);
        }
    }

    sendAction(robotId, action) {
        console.log(`📡 Sending action: ${action} to ${robotId} in session: ${this.sessionKey}`);

        if (this.socket && this.isConnected) {
            this.socket.emit('robot_action', {
                session_key: this.sessionKey,
                robot_id: robotId,
                action: action
            });
        } else {
            console.log('⚠️ WebSocket not connected, using local animation only');
        }
    }

    resetSession() {
        console.log(`🔄 Resetting session: ${this.sessionKey}`);

        // Show confirmation dialog
        if (!confirm('Are you sure you want to reset the session? This will move all robots back to their initial positions.')) {
            return;
        }

        if (this.socket && this.isConnected) {
            this.socket.emit('reset_session', {
                session_key: this.sessionKey
            });
        } else {
            console.log('⚠️ WebSocket not connected, cannot reset session');
            this.showNotification('Cannot reset session - not connected to server', 'error');
        }
    }

    handleActionResult(result) {
        console.log('📨 Handling action result:', result);

        // Update UI to show action feedback
        const statusElement = document.getElementById('action-status');
        if (statusElement) {
            statusElement.textContent = `${result.status}: ${result.action}`;
            statusElement.className = result.status === 'success' ? 'success' : 'error';
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = '';
            }, 3000);
        }
    }

    handleResetResult(result) {
        console.log('🔄 Handling reset result:', result);

        // Show notification
        if (result.status === 'success') {
            this.showNotification('Session reset successfully! All robots moved to initial positions.', 'success');

            // Update last action display
            this.updateLastAction('all', 'reset');
        } else {
            this.showNotification(`Reset failed: ${result.message}`, 'error');
        }

        // Update status
        const statusElement = document.getElementById('action-status');
        if (statusElement) {
            statusElement.textContent = `${result.status}: session reset`;
            statusElement.className = result.status === 'success' ? 'success' : 'error';
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = '';
            }, 3000);
        }
    }

    updateLastAction(robotId, action) {
        const lastActionElement = document.getElementById('last-action');
        if (lastActionElement) {
            const timestamp = new Date().toLocaleTimeString();
            lastActionElement.textContent = `${action} on ${robotId} at ${timestamp}`;
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = connected ? '🟢 Connected' : '🔴 Disconnected';
            statusElement.className = connected ? 'connected' : 'disconnected';
        }
    }

    updateRobotCount() {
        const countElement = document.getElementById('robot-count');
        if (countElement) {
            countElement.textContent = `Robots: ${this.robots.size}/6`;
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
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            maxWidth: '300px'
        });

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #2ed573, #1dd1a1)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ff4757, #ff3838)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #ffa502, #ff6348)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #4A90E2, #357ABD)';
        }

        // Add to page
        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateRobotSelectorFromList(robotList) {
        const robotSelect = document.getElementById('robot-select');
        if (!robotSelect) return;

        // Clear existing options except "all"
        robotSelect.innerHTML = '<option value="all">All Robots</option>';

        // Add robots from list
        robotList.forEach(robotId => {
            const option = document.createElement('option');
            option.value = robotId;
            option.textContent = robotId.replace('_', ' ').toUpperCase();
            robotSelect.appendChild(option);
        });

        // Update robot count
        this.updateRobotCount();

        console.log(`🔄 Robot selector updated with ${robotList.length} robots`);
    }
}

// Initialize simulator when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, starting simulator...');
    window.simulator = new HumanoidSimulator();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.simulator) {
        console.log('👁️ Page visible, refreshing robots...');
        if (window.simulator.socket && window.simulator.isConnected) {
            window.simulator.socket.emit('get_robot_states');
        }
    }
});

console.log('🚀 CORRECTED Simulator with Fixed Movement loaded successfully');
