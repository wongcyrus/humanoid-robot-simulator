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

        console.log('🚀 Starting Enhanced Humanoid Simulator...');
        this.init();
    }

    init() {
        console.log('🔧 Initializing simulator components...');

        // Initialize 3D scene first
        this.init3DScene();

        // Add test robots immediately (fallback)
        this.addTestRobots();

        // Initialize WebSocket connection
        this.initWebSocket();

        // Setup UI event listeners
        this.setupUIEvents();

        // Setup robot management
        this.setupRobotManagement();

        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 2000);

        console.log('✅ Simulator initialization complete');
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

                // Request real robot states
                console.log('📡 Requesting real robot states...');
                this.socket.emit('get_robot_states');
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

            // Robot management WebSocket handlers
            this.socket.on('robot_removed', (data) => {
                console.log('🗑️ Robot removed:', data);

                // Remove robot from 3D scene
                if (this.scene3d && data.removed_robot) {
                    this.scene3d.removeRobot(data.removed_robot);
                }

                // Update robot selector
                this.updateRobotSelectorFromList(data.remaining_robots);

                // Show notification
                this.showNotification(data.message, 'warning');
            });

            this.socket.on('robots_removed', (data) => {
                console.log('🗑️ All robots removed:', data);

                // Clear all robots from 3D scene
                if (this.scene3d) {
                    data.removed_robots.forEach(robotId => {
                        this.scene3d.removeRobot(robotId);
                    });
                }

                // Update robot selector
                this.updateRobotSelectorFromList([]);

                // Show notification
                this.showNotification(data.message, 'warning');
            });

            this.socket.on('robot_added', (data) => {
                console.log('➕ Robot added:', data);

                // Add robot to 3D scene
                if (this.scene3d) {
                    this.scene3d.addRobot(data.robot_id, data.position, data.color);
                }

                // Update robot selector
                this.updateRobotSelectorFromList(data.all_robots);

                // Show notification
                this.showNotification(data.message, 'success');
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
        console.log(`📡 Sending action: ${action} to ${robotId}`);

        if (this.socket && this.isConnected) {
            this.socket.emit('robot_action', {
                robot_id: robotId,
                action: action
            });
        } else {
            console.log('⚠️ WebSocket not connected, using local animation only');
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

        // If action was successful, trigger local animation as backup
        if (result.status === 'success') {
            this.triggerLocalAction(result.robot_id, result.action);
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

    setupRobotManagement() {
        console.log('🔧 Setting up robot management controls...');

        const removeRobotBtn = document.getElementById('remove-robot-btn');
        const removeAllBtn = document.getElementById('remove-all-btn');
        const addRobotBtn = document.getElementById('add-robot-btn');
        const resetRobotsBtn = document.getElementById('reset-robots-btn');
        const addRobotForm = document.getElementById('add-robot-form');
        const confirmAddBtn = document.getElementById('confirm-add-robot');
        const cancelAddBtn = document.getElementById('cancel-add-robot');

        // Remove selected robot
        if (removeRobotBtn) {
            removeRobotBtn.addEventListener('click', () => {
                const selectedRobot = document.getElementById('robot-select').value;
                if (selectedRobot && selectedRobot !== 'all') {
                    this.removeRobot(selectedRobot);
                } else {
                    alert('Please select a specific robot to remove');
                }
            });
        }

        // Remove all robots
        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to remove ALL robots?')) {
                    this.removeRobot('all');
                }
            });
        }

        // Show add robot form
        if (addRobotBtn) {
            addRobotBtn.addEventListener('click', () => {
                if (addRobotForm) {
                    addRobotForm.style.display = addRobotForm.style.display === 'none' ? 'block' : 'none';
                }
            });
        }

        // Reset to 6 robots
        if (resetRobotsBtn) {
            resetRobotsBtn.addEventListener('click', () => {
                if (confirm('Reset to original 6 robots? This will remove all current robots.')) {
                    this.resetToSixRobots();
                }
            });
        }

        // Confirm add robot
        if (confirmAddBtn) {
            confirmAddBtn.addEventListener('click', () => {
                this.addNewRobot();
            });
        }

        // Cancel add robot
        if (cancelAddBtn) {
            cancelAddBtn.addEventListener('click', () => {
                if (addRobotForm) {
                    addRobotForm.style.display = 'none';
                }
            });
        }
    }

    async removeRobot(robotId) {
        try {
            console.log(`🗑️ Removing robot: ${robotId}`);

            const response = await fetch(`/api/remove_robot/${robotId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                console.log(`✅ Robot removal successful:`, result);
                this.showNotification(`Robot ${robotId} removed successfully`, 'success');

                // Update robot count display
                this.updateRobotCountDisplay();

            } else {
                console.error('❌ Robot removal failed:', result.error);
                this.showNotification(`Failed to remove robot: ${result.error}`, 'error');
            }

        } catch (error) {
            console.error('❌ Error removing robot:', error);
            this.showNotification(`Error removing robot: ${error.message}`, 'error');
        }
    }

    async addNewRobot() {
        try {
            const robotId = document.getElementById('new-robot-id').value.trim();
            const color = document.getElementById('new-robot-color').value;
            const x = parseFloat(document.getElementById('new-robot-x').value) || 0;
            const y = parseFloat(document.getElementById('new-robot-y').value) || 0;
            const z = parseFloat(document.getElementById('new-robot-z').value) || 0;

            if (!robotId) {
                alert('Please enter a robot ID');
                return;
            }

            console.log(`➕ Adding robot: ${robotId} at [${x}, ${y}, ${z}] with color ${color}`);

            const response = await fetch(`/api/add_robot/${robotId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    position: [x, y, z],
                    color: color
                })
            });

            const result = await response.json();

            if (result.success) {
                console.log(`✅ Robot addition successful:`, result);
                this.showNotification(`Robot ${robotId} added successfully`, 'success');

                // Hide form
                const addRobotForm = document.getElementById('add-robot-form');
                if (addRobotForm) {
                    addRobotForm.style.display = 'none';
                }

                // Clear form
                document.getElementById('new-robot-id').value = '';
                document.getElementById('new-robot-x').value = '0';
                document.getElementById('new-robot-y').value = '0';
                document.getElementById('new-robot-z').value = '0';

                // Update robot count display
                this.updateRobotCountDisplay();

            } else {
                console.error('❌ Robot addition failed:', result.error);
                this.showNotification(`Failed to add robot: ${result.error}`, 'error');
            }

        } catch (error) {
            console.error('❌ Error adding robot:', error);
            this.showNotification(`Error adding robot: ${error.message}`, 'error');
        }
    }

    async resetToSixRobots() {
        try {
            console.log('🔄 Resetting to 6 robots...');

            // First remove all robots
            await this.removeRobot('all');

            // Wait a moment
            await new Promise(resolve => setTimeout(resolve, 500));

            // Add the original 6 robots
            const originalRobots = [
                { id: 'robot_1', position: [-50, 0, -50], color: '#4A90E2' },
                { id: 'robot_2', position: [0, 0, -50], color: '#E24A90' },
                { id: 'robot_3', position: [50, 0, -50], color: '#90E24A' },
                { id: 'robot_4', position: [-50, 0, 50], color: '#E2904A' },
                { id: 'robot_5', position: [0, 0, 50], color: '#904AE2' },
                { id: 'robot_6', position: [50, 0, 50], color: '#4AE290' }
            ];

            for (const robot of originalRobots) {
                const response = await fetch(`/api/add_robot/${robot.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        position: robot.position,
                        color: robot.color
                    })
                });

                if (!response.ok) {
                    console.error(`Failed to add ${robot.id}`);
                }
            }

            this.showNotification('Reset to 6 robots completed', 'success');
            this.updateRobotCountDisplay();

        } catch (error) {
            console.error('❌ Error resetting robots:', error);
            this.showNotification(`Error resetting robots: ${error.message}`, 'error');
        }
    }

    updateRobotCountDisplay() {
        const robotSelect = document.getElementById('robot-select');
        if (robotSelect) {
            const robotCount = robotSelect.options.length - 1; // Subtract 1 for "all" option

            // Update or create robot count indicator
            let countIndicator = document.querySelector('.robot-count');
            if (!countIndicator) {
                countIndicator = document.createElement('span');
                countIndicator.className = 'robot-count';
                robotSelect.parentNode.appendChild(countIndicator);
            }

            countIndicator.textContent = `${robotCount} robots`;
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
        this.updateRobotCountDisplay();

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
