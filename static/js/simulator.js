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

        // Action queue system for sequential processing
        this.actionQueue = [];
        this.isProcessingQueue = false;

        // Resize debouncing
        this.resizeTimeout = null;

        // Action duration mapping (exact timing as specified)
        this.actionDurations = {
            // Dance actions (long durations)
            'dance': 2,
            'dance_two': 52,
            'dance_three': 70,
            'dance_four': 83,
            'dance_five': 59,
            'dance_six': 69,
            'dance_seven': 67,
            'dance_eight': 85,
            'dance_nine': 84,
            'dance_ten': 85,

            // Movement actions
            'stepping': 3,
            'twist': 4,
            'stand_up_back': 5,
            'stand_up_front': 5,
            'right_kick': 2,
            'left_kick': 2,
            'right_uppercut': 2,
            'left_uppercut': 2,
            'wing_chun': 2,
            'right_shot_fast': 4,
            'left_shot_fast': 4,
            'chest': 9,
            'squat_up': 6,
            'squat': 1,
            'bow': 4,
            'wave': 3.5,
            'turn_right': 4,
            'turn_left': 4,
            'sit_ups': 12,
            'right_move_fast': 3,
            'left_move_fast': 3,
            'back_fast': 4.5,
            'go_forward': 3.5,
            'push_ups': 9,
            'weightlifting': 9,
            'kung_fu': 2,

            // Additional actions
            'go_backward': 3.5,
            'jumping_jacks': 3,
            'jump': 2,
            'celebrate': 3,
            'think': 2,
            'idle': 1,
            'kick': 2,
            'punch': 2,

            // Default duration for unlisted actions
            'default': 2
        };

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

        // Start periodic canvas size checking
        this.startCanvasSizeMonitoring();

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

        // Initial canvas resize to ensure proper dimensions
        setTimeout(() => {
            this.resizeCanvas();
        }, 100);

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

            // Action execution handler for server-initiated actions
            this.socket.on('actions', (data) => {
                console.log('🎬 Server requested action execution:', data);
                this.handleServerActionRequest(data);
            });

            // Video control handlers
            this.socket.on('video_source_changed', (data) => {
                console.log('📺 Video source change requested:', data);
                this.handleVideoSourceChange(data);
            });

            this.socket.on('video_control', (data) => {
                console.log('📺 Video control requested:', data);
                this.handleVideoControl(data);
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

        // Reset button (combines reset session + force refresh)
        const resetBtn = document.getElementById('reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSession();
            });
        }

        // Panel toggle button
        const togglePanelBtn = document.getElementById('toggle-panel');
        if (togglePanelBtn) {
            togglePanelBtn.addEventListener('click', () => {
                this.toggleControlPanel();
            });
        }

        // Action buttons - Send all actions through backend API
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

                // Send action to backend - this will trigger proper events for proxy
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

        // Window resize event listener with debouncing
        window.addEventListener('resize', () => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                console.log('🖼️ Window resized, updating canvas dimensions');
                this.resizeCanvas();
            }, 150); // Debounce resize events
        });

        // Handle orientation change on mobile devices
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                console.log('📱 Orientation changed, updating canvas dimensions');
                this.resizeCanvas();
            }, 500); // Delay for orientation change to complete
        });

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

    sendActionByName(actionName, robotId = 'all') {
        console.log(`📡 Sending action by name: ${actionName} to ${robotId} in session: ${this.sessionKey}`);

        // Send action through REST API endpoint to ensure proper event handling
        fetch(`/run_action/${robotId}?session_key=${this.sessionKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: actionName
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`✅ Action ${actionName} sent successfully to ${robotId}`);
                } else {
                    console.error(`❌ Failed to send action: ${data.error}`);
                    this.showNotification(`Failed to send action: ${data.error}`, 'error');
                }
            })
            .catch(error => {
                console.error(`❌ Error sending action: ${error}`);
                this.showNotification(`Error sending action: ${error.message}`, 'error');
            });
    }

    executeAction(actionName, robotId = 'all') {
        console.log(`🎬 Executing action: ${actionName} on ${robotId}`);

        // Send action to server using the new actions event
        this.sendActionByName(actionName, robotId);

        // Also update local UI immediately for responsiveness
        this.updateLastAction(robotId, actionName);
    }

    sendAction(robotId, action) {
        console.log(`📡 Sending action: ${action} to ${robotId} in session: ${this.sessionKey}`);

        // Send action through REST API endpoint to ensure proper event handling
        fetch(`/run_action/${robotId}?session_key=${this.sessionKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: action
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`✅ Action ${action} sent successfully to ${robotId}`);
                } else {
                    console.error(`❌ Failed to send action: ${data.error}`);
                    this.showNotification(`Failed to send action: ${data.error}`, 'error');
                }
            })
            .catch(error => {
                console.error(`❌ Error sending action: ${error}`);
                this.showNotification(`Error sending action: ${error.message}`, 'error');
            });
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

            // If not connected, still perform local force refresh
            this.forceRefresh();
        }
    }

    forceRefresh() {
        console.log('🔄 Force refreshing robots...');

        // Add test robots to ensure they're in the scene
        this.addTestRobots();

        // If connected to WebSocket, request robot states
        if (this.socket && this.isConnected && this.sessionKey) {
            this.socket.emit('get_robot_states', {
                session_key: this.sessionKey
            });
        }

        // Show notification
        this.showNotification('Robots refreshed successfully!', 'success');
    }

    toggleControlPanel() {
        const controlPanel = document.getElementById('control-panel');
        const toggleBtn = document.getElementById('toggle-panel');

        if (!controlPanel || !toggleBtn) {
            console.error('❌ Required elements not found for panel toggle');
            return;
        }

        const isVisible = controlPanel.classList.contains('visible');

        if (isVisible) {
            // Hide the panel
            controlPanel.classList.remove('visible');
            toggleBtn.textContent = '📋 Show Panel';
            console.log('📱 Control panel hidden');
        } else {
            // Show the panel
            controlPanel.classList.add('visible');
            toggleBtn.textContent = '📋 Hide Panel';
            console.log('📱️ Control panel shown');
        }

        // Trigger canvas resize after animation completes
        setTimeout(() => {
            this.forceCanvasResize();
        }, 300); // Match the CSS transition duration
    }

    resizeCanvas() {
        if (this.scene3d) {
            // console.log('🖼️ Resizing 3D canvas to fit new viewport dimensions');

            // Get the canvas element and its container to check dimensions
            const canvas = document.getElementById('three-canvas');
            const viewportContainer = document.getElementById('viewport-container');

            if (canvas && viewportContainer) {
                // Get the actual container dimensions
                const containerWidth = viewportContainer.clientWidth;
                const containerHeight = viewportContainer.clientHeight;

                // console.log(`📏 Viewport container size: ${containerWidth}x${containerHeight}`);
                // console.log(`📏 Canvas current size: ${canvas.clientWidth}x${canvas.clientHeight}`);

                // Force the canvas to match container dimensions
                canvas.style.width = containerWidth + 'px';
                canvas.style.height = containerHeight + 'px';

                // Wait a frame for the DOM to update, then resize the 3D scene
                requestAnimationFrame(() => {
                    this.scene3d.onWindowResize();
                    // console.log(`✅ Canvas resized to: ${canvas.clientWidth}x${canvas.clientHeight}`);
                });
            }
        } else {
            console.warn('⚠️ Scene3D not available for resize');
        }
    }

    forceCanvasResize() {
        // Force a canvas resize with optimized timing to reduce performance impact
        // Only resize if we haven't resized recently
        const now = Date.now();
        if (this.lastResizeTime && now - this.lastResizeTime < 500) {
            return; // Prevent excessive resize calls
        }
        this.lastResizeTime = now;

        // Immediate resize
        this.resizeCanvas();

        // Single delayed resize to handle CSS transitions
        setTimeout(() => {
            this.resizeCanvas();
        }, 100);
    }

    checkAndFixCanvasSize() {
        // Utility method to check if canvas size matches container and fix if needed
        const canvas = document.getElementById('three-canvas');
        const viewportContainer = document.getElementById('viewport-container');

        if (!canvas || !viewportContainer) return;

        const containerWidth = viewportContainer.clientWidth;
        const containerHeight = viewportContainer.clientHeight;
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;

        // Check if sizes don't match (with small tolerance for rounding)
        if (Math.abs(containerWidth - canvasWidth) > 2 || Math.abs(containerHeight - canvasHeight) > 2) {
            // Only log occasionally to avoid spam
            if (!this.lastSizeLogTime || Date.now() - this.lastSizeLogTime > 5000) {
                console.log(`🔧 Canvas size mismatch detected. Container: ${containerWidth}x${containerHeight}, Canvas: ${canvasWidth}x${canvasHeight}`);
                this.lastSizeLogTime = Date.now();
            }
            this.forceCanvasResize();
            return true; // Resize was needed
        }

        return false; // No resize needed
    }

    startCanvasSizeMonitoring() {
        // Periodically check if canvas size matches container and fix if needed
        // Reduced frequency to avoid performance issues
        setInterval(() => {
            if (this.scene3d) {
                this.checkAndFixCanvasSize();
            }
        }, 2000); // Check every 2 seconds instead of 1

        console.log('📏 Canvas size monitoring started');
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

            // After successful reset, perform force refresh
            console.log('🔄 Performing force refresh after reset...');
            this.forceRefresh();
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

    handleServerActionRequest(data) {
        console.log('🎬 Handling server action request:', data);

        const actionName = data.action_name || 'idle';
        const robotId = data.robot_id || 'all';

        // Execute the action LOCALLY only - don't send back to server to avoid loop
        this.triggerLocalAction(robotId, actionName);

        // Show notification about server-initiated action
        this.showNotification(`Server executed "${actionName}" on ${robotId}`, 'info');

        // Update last action display
        this.updateLastAction(robotId, actionName);

        console.log(`✅ Server action "${actionName}" executed locally on ${robotId}`);
    }

    /**
     * Handle video source change from server
     * @param {Object} data - Video source change data
     */
    handleVideoSourceChange(data) {
        console.log('📺 Handling video source change:', data);

        const { video_src, session_key } = data;

        if (!video_src) {
            console.warn('📺 No video source provided');
            return;
        }

        // Change video source in the 3D scene
        if (this.scene3d) {
            this.scene3d.changeVideoSource(video_src);
            this.showNotification(`Video source changed to: ${video_src}`, 'info');
        } else {
            console.warn('📺 No 3D scene available to change video source');
        }
    }

    /**
     * Handle video control commands from server
     * @param {Object} data - Video control data
     */
    handleVideoControl(data) {
        console.log('📺 Handling video control:', data);

        const { action, session_key } = data;

        if (!this.scene3d) {
            console.warn('📺 No 3D scene available for video control');
            return;
        }

        switch (action) {
            case 'play':
                this.scene3d.playVideo();
                this.showNotification('Video playing', 'success');
                break;
            case 'pause':
                this.scene3d.pauseVideo();
                this.showNotification('Video paused', 'info');
                break;
            case 'toggle':
                this.scene3d.toggleVideo();
                this.showNotification('Video toggled', 'info');
                break;
            default:
                console.warn('📺 Unknown video control action:', action);
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

    // Action Queue Management Methods
    queueAction(robotId, action) {
        const queueItem = {
            robotId: robotId,
            action: action,
            timestamp: Date.now()
        };

        this.actionQueue.push(queueItem);
        console.log(`📋 Action queued: ${action} for ${robotId}. Queue length: ${this.actionQueue.length}`);

        // Start processing if not already processing
        if (!this.isProcessingQueue) {
            this.processActionQueue();
        }
    }

    async processActionQueue() {
        if (this.isProcessingQueue || this.actionQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;
        console.log('🏃 Starting action queue processing...');

        while (this.actionQueue.length > 0) {
            const queueItem = this.actionQueue.shift();
            const { robotId, action } = queueItem;

            console.log(`⚡ Processing action: ${action} for ${robotId}`);

            // Send action to backend API instead of local processing
            try {
                const response = await fetch(`/run_action/${robotId}?session_key=${this.sessionKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: action
                    })
                });

                const data = await response.json();
                if (data.success) {
                    console.log(`✅ Action ${action} sent successfully to ${robotId} via backend`);
                } else {
                    console.error(`❌ Failed to send action via backend: ${data.error}`);
                }
            } catch (error) {
                console.error(`❌ Error sending action via backend: ${error}`);
            }

            // Update last action display
            this.updateLastAction(robotId, action);

            // Get action duration
            const duration = this.getActionDuration(action);
            console.log(`⏱️ Waiting ${duration} seconds for action: ${action}`);

            // Wait for the action to complete
            await this.sleep(duration * 1000);

            console.log(`✅ Action completed: ${action} for ${robotId}`);
        }

        this.isProcessingQueue = false;
        console.log('🏁 Action queue processing completed');
    }

    getActionDuration(action) {
        const actionKey = action.toLowerCase();
        return this.actionDurations[actionKey] || this.actionDurations['default'];
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clearActionQueue() {
        this.actionQueue = [];
        console.log('🗑️ Action queue cleared');
    }

    getQueueStatus() {
        return {
            queueLength: this.actionQueue.length,
            isProcessing: this.isProcessingQueue,
            nextAction: this.actionQueue.length > 0 ? this.actionQueue[0] : null
        };
    }

    // Helper function to queue multiple actions in sequence
    queueMultipleActions(robotId, actions) {
        if (!Array.isArray(actions)) {
            console.error('❌ Actions must be an array');
            return;
        }

        console.log(`📋 Queuing ${actions.length} actions for ${robotId}:`, actions);

        actions.forEach(action => {
            this.queueAction(robotId, action);
        });

        // Calculate total duration
        let totalDuration = 0;
        actions.forEach(action => {
            totalDuration += this.getActionDuration(action);
        });

        console.log(`⏱️ Total sequence duration: ${totalDuration} seconds`);
        return totalDuration;
    }

    // Predefined action sequences based on action types
    queueDanceSequence(robotId) {
        const danceActions = [
            'dance_two',    // 52 seconds
            'dance_three',  // 70 seconds 
            'dance_four',   // 83 seconds
            'dance_five',   // 59 seconds
            'dance_six',    // 69 seconds
            'dance_seven',  // 67 seconds
            'dance_eight',  // 85 seconds
            'dance_nine',   // 84 seconds
            'dance_ten'     // 85 seconds
        ];
        return this.queueMultipleActions(robotId, danceActions);
    }

    queueCombatSequence(robotId) {
        const combatActions = [
            'right_kick',     // 2 seconds
            'left_kick',      // 2 seconds
            'right_uppercut', // 2 seconds
            'left_uppercut',  // 2 seconds
            'wing_chun',      // 2 seconds
            'right_shot_fast', // 4 seconds
            'left_shot_fast', // 4 seconds
            'kung_fu'         // 2 seconds
        ];
        return this.queueMultipleActions(robotId, combatActions);
    }

    queueExerciseSequence(robotId) {
        const exerciseActions = [
            'chest',        // 9 seconds
            'squat_up',     // 6 seconds
            'squat',        // 1 second
            'push_ups',     // 9 seconds
            'sit_ups',      // 12 seconds
            'weightlifting' // 9 seconds
        ];
        return this.queueMultipleActions(robotId, exerciseActions);
    }

    queueMovementSequence(robotId) {
        const movementActions = [
            'stepping',        // 3 seconds
            'twist',          // 4 seconds
            'go_forward',     // 3.5 seconds
            'turn_right',     // 4 seconds
            'go_forward',     // 3.5 seconds
            'turn_left',      // 4 seconds
            'back_fast',      // 4.5 seconds
            'right_move_fast', // 3 seconds
            'left_move_fast'   // 3 seconds
        ];
        return this.queueMultipleActions(robotId, movementActions);
    }

    // Function to demonstrate exact timing according to your requirements
    demonstrateTimingSequence(robotId) {
        console.log('🎭 Starting demonstration of exact timing sequence...');

        const allActions = [
            // Long dance sequences
            'dance_two',       // 52 seconds
            'dance_three',     // 70 seconds
            'dance_four',      // 83 seconds
            'dance_five',      // 59 seconds
            'dance_six',       // 69 seconds
            'dance_seven',     // 67 seconds
            'dance_eight',     // 85 seconds
            'dance_nine',      // 84 seconds
            'dance_ten',       // 85 seconds

            // Quick movements
            'stepping',        // 3 seconds
            'twist',          // 4 seconds
            'stand_up_back',  // 5 seconds
            'stand_up_front', // 5 seconds

            // Combat moves
            'right_kick',     // 2 seconds
            'left_kick',      // 2 seconds
            'right_uppercut', // 2 seconds
            'left_uppercut',  // 2 seconds
            'wing_chun',      // 2 seconds
            'right_shot_fast', // 4 seconds
            'left_shot_fast', // 4 seconds

            // Exercises
            'chest',          // 9 seconds
            'squat_up',       // 6 seconds
            'squat',          // 1 second
            'bow',            // 4 seconds
            'wave',           // 3.5 seconds
            'turn_right',     // 4 seconds
            'turn_left',      // 4 seconds
            'sit_ups',        // 12 seconds
            'right_move_fast', // 3 seconds
            'left_move_fast', // 3 seconds
            'back_fast',      // 4.5 seconds
            'go_forward',     // 3.5 seconds
            'push_ups',       // 9 seconds
            'weightlifting',  // 9 seconds
            'kung_fu'         // 2 seconds
        ];

        return this.queueMultipleActions(robotId, allActions);
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
        if (window.simulator.socket && window.simulator.isConnected && window.simulator.sessionKey) {
            window.simulator.socket.emit('get_robot_states', {
                session_key: window.simulator.sessionKey
            });
        }
    }
});

console.log('🚀 CORRECTED Simulator with Fixed Movement loaded successfully');
