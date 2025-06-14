/**
 * Enhanced 3D Robot Visualization - 44 Actions Available
 * Guaranteed visibility with complete action library
 */

class Robot3D {
    constructor(robotData) {
        this.robotId = robotData.robot_id;
        this.color = robotData.color || '#4A90E2';

        // FORCE position handling - multiple fallbacks
        this.position = this.parsePosition(robotData.position);
        this.rotation = this.parseRotation(robotData.rotation);

        console.log(`🤖 CREATING ${this.robotId} at position:`, this.position);

        // Initialize Three.js objects
        this.group = new THREE.Group();
        this.parts = {};
        this.isVisible = true;
        this.animator = null; // Will be set after creation

        // Create robot immediately
        this.createRobotMesh();
        this.forcePosition();
        this.ensureVisibility();

        // Initialize animator
        this.animator = new RobotAnimator(this);

        console.log(`✅ ${this.robotId} created successfully - Group children:`, this.group.children.length);
    }

    parsePosition(positionData) {
        console.log(`🔍 Parsing position for ${this.robotId}:`, positionData, typeof positionData);

        // Handle array format [x, y, z]
        if (Array.isArray(positionData) && positionData.length >= 3) {
            return {
                x: Number(positionData[0]) || 0,
                y: Number(positionData[1]) || 0,
                z: Number(positionData[2]) || 0
            };
        }

        // Handle object format {x, y, z}
        if (positionData && typeof positionData === 'object') {
            return {
                x: Number(positionData.x) || 0,
                y: Number(positionData.y) || 0,
                z: Number(positionData.z) || 0
            };
        }

        // Fallback to default positions based on robot ID
        const defaultPositions = {
            'robot_1': { x: -50, y: 0, z: -50 },
            'robot_2': { x: 0, y: 0, z: -50 },
            'robot_3': { x: 50, y: 0, z: -50 },
            'robot_4': { x: -50, y: 0, z: 50 },
            'robot_5': { x: 0, y: 0, z: 50 },
            'robot_6': { x: 50, y: 0, z: 50 }
        };

        return defaultPositions[this.robotId] || { x: 0, y: 0, z: 0 };
    }

    parseRotation(rotationData) {
        if (Array.isArray(rotationData) && rotationData.length >= 3) {
            return {
                x: Number(rotationData[0]) || 0,
                y: Number(rotationData[1]) || 0,
                z: Number(rotationData[2]) || 0
            };
        }

        if (rotationData && typeof rotationData === 'object') {
            return {
                x: Number(rotationData.x) || 0,
                y: Number(rotationData.y) || 0,
                z: Number(rotationData.z) || 0
            };
        }

        return { x: 0, y: 0, z: 0 };
    }

    createRobotMesh() {
        console.log(`🔧 Creating mesh for ${this.robotId}`);

        // Clear any existing children
        while (this.group.children.length > 0) {
            this.group.remove(this.group.children[0]);
        }

        // Materials with high visibility
        const bodyMaterial = new THREE.MeshLambertMaterial({
            color: this.color,
            transparent: false,
            opacity: 1.0
        });

        const jointMaterial = new THREE.MeshLambertMaterial({
            color: 0x666666,
            transparent: false,
            opacity: 1.0
        });

        // HEAD - Large and visible
        const headGeometry = new THREE.SphereGeometry(12, 16, 16);
        this.parts.head = new THREE.Mesh(headGeometry, bodyMaterial);
        this.parts.head.position.set(0, 35, 0);
        this.parts.head.castShadow = true;
        this.parts.head.receiveShadow = true;
        this.group.add(this.parts.head);

        // Eyes for character and direction indication
        const eyeGeometry = new THREE.SphereGeometry(2, 8, 8);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-4, 2, 10); // Moved forward more for visibility
        this.parts.head.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(4, 2, 10); // Moved forward more for visibility
        this.parts.head.add(rightEye);

        // Add a simple nose/mouth for clear face direction
        const noseGeometry = new THREE.BoxGeometry(1, 1, 2);
        const noseMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, -2, 11); // Forward-facing nose
        this.parts.head.add(nose);

        // Add face direction indicator (small arrow on forehead)
        const arrowGeometry = new THREE.ConeGeometry(2, 4, 3);
        const arrowMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.set(0, 8, 8);
        arrow.rotation.x = Math.PI / 2; // Point forward
        this.parts.head.add(arrow);

        // TORSO - Main body
        const torsoGeometry = new THREE.BoxGeometry(16, 25, 10);
        this.parts.torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
        this.parts.torso.position.set(0, 10, 0);
        this.parts.torso.castShadow = true;
        this.parts.torso.receiveShadow = true;
        this.group.add(this.parts.torso);

        // ARMS - Create as groups for better animation
        // LEFT ARM
        this.parts.leftArm = new THREE.Group();
        const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(6, 20, 6), bodyMaterial);
        leftArmMesh.position.set(0, -10, 0);
        leftArmMesh.castShadow = true;
        leftArmMesh.receiveShadow = true;
        this.parts.leftArm.add(leftArmMesh);
        this.parts.leftArm.position.set(-12, 20, 0);
        this.group.add(this.parts.leftArm);

        // RIGHT ARM
        this.parts.rightArm = new THREE.Group();
        const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(6, 20, 6), bodyMaterial);
        rightArmMesh.position.set(0, -10, 0);
        rightArmMesh.castShadow = true;
        rightArmMesh.receiveShadow = true;
        this.parts.rightArm.add(rightArmMesh);
        this.parts.rightArm.position.set(12, 20, 0);
        this.group.add(this.parts.rightArm);

        // LEGS - Create as groups for better animation
        // LEFT LEG
        this.parts.leftLeg = new THREE.Group();
        const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(8, 25, 8), bodyMaterial);
        leftLegMesh.position.set(0, -12.5, 0);
        leftLegMesh.castShadow = true;
        leftLegMesh.receiveShadow = true;
        this.parts.leftLeg.add(leftLegMesh);
        this.parts.leftLeg.position.set(-6, -5, 0);
        this.group.add(this.parts.leftLeg);

        // RIGHT LEG
        this.parts.rightLeg = new THREE.Group();
        const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(8, 25, 8), bodyMaterial);
        rightLegMesh.position.set(0, -12.5, 0);
        rightLegMesh.castShadow = true;
        rightLegMesh.receiveShadow = true;
        this.parts.rightLeg.add(rightLegMesh);
        this.parts.rightLeg.position.set(6, -5, 0);
        this.group.add(this.parts.rightLeg);

        // Add robot ID label above head
        this.addRobotLabel();

        console.log(`✅ ${this.robotId} mesh created with ${this.group.children.length} parts`);
    }

    addRobotLabel() {
        // Create a simple text representation using a colored cube
        const labelGeometry = new THREE.BoxGeometry(8, 2, 2);
        const labelMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, 50, 0);
        this.group.add(label);
    }

    forcePosition() {
        // FORCE the position - no matter what
        this.group.position.set(this.position.x, this.position.y, this.position.z);
        this.group.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

        console.log(`🎯 FORCED position for ${this.robotId}:`, this.group.position);
        console.log(`🎯 FORCED rotation for ${this.robotId}:`, this.group.rotation);
    }

    ensureVisibility() {
        // FORCE visibility settings
        this.group.visible = true;
        this.group.scale.set(1, 1, 1);

        // Make sure all parts are visible
        this.group.traverse((child) => {
            if (child.isMesh) {
                child.visible = true;
                child.material.transparent = false;
                child.material.opacity = 1.0;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        console.log(`👁️ FORCED visibility for ${this.robotId} - Visible:`, this.group.visible);
    }

    // Start action with animation
    startAction(action) {
        console.log(`🎬 ${this.robotId} starting action: ${action}`);

        if (this.animator) {
            this.animator.startAnimation(action);
        } else {
            console.warn(`⚠️ No animator available for ${this.robotId}`);
        }
    }

    update(robotData) {
        // FIXED: Only update position if it's significantly different from current position
        // This prevents server updates from resetting robot positions after movement
        if (robotData.position) {
            const newPosition = this.parsePosition(robotData.position);
            const currentPos = this.group.position;

            // Check if the new position is significantly different (more than 5 units)
            const distance = Math.sqrt(
                Math.pow(newPosition.x - currentPos.x, 2) +
                Math.pow(newPosition.z - currentPos.z, 2)
            );

            if (distance > 5) {
                console.log(`📍 Significant position change for ${this.robotId}: ${distance.toFixed(1)} units`);
                this.position = newPosition;
                this.forcePosition();
            } else {
                console.log(`📍 Ignoring minor position update for ${this.robotId} (distance: ${distance.toFixed(1)})`);
                // Update stored position to match current actual position
                this.position.x = currentPos.x;
                this.position.y = currentPos.y;
                this.position.z = currentPos.z;
            }
        }

        // FIXED: Only update rotation if it's significantly different from current rotation
        if (robotData.rotation) {
            const newRotation = this.parseRotation(robotData.rotation);
            const currentRot = this.group.rotation.y;

            // Check if the new rotation is significantly different (more than 0.1 radians)
            const rotDiff = Math.abs(newRotation.y - currentRot);

            if (rotDiff > 0.1) {
                console.log(`🔄 Significant rotation change for ${this.robotId}: ${rotDiff.toFixed(2)} radians`);
                this.rotation = newRotation;
                this.forcePosition();
            } else {
                console.log(`🔄 Ignoring minor rotation update for ${this.robotId} (diff: ${rotDiff.toFixed(2)})`);
                // Update stored rotation to match current actual rotation
                this.rotation.y = currentRot;
            }
        }

        // Start action if provided and different from current
        if (robotData.current_action && robotData.current_action !== 'idle') {
            this.startAction(robotData.current_action);
        }

        // Ensure still visible after update
        this.ensureVisibility();

        console.log(`🔄 Updated ${this.robotId} at position:`, this.group.position);
    }

    dispose() {
        // Stop any ongoing animations
        if (this.animator) {
            this.animator.stopAnimation();
        }

        // Clean up resources
        this.group.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }
}

class Scene3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.robots = new Map();

        console.log('🎬 Initializing Scene3D...');

        this.initThreeJS();
        this.setupLighting();
        this.setupEnvironment();
        this.setupControls();

        this.animate();

        console.log('✅ Scene3D initialized successfully');
    }

    initThreeJS() {
        // Scene with visible background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Camera positioned to see all robots
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            2000
        );

        // Position camera to see all robots clearly
        this.camera.position.set(0, 100, 200);
        this.camera.lookAt(0, 0, 0);

        // Renderer with high quality settings
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x1a1a2e, 1);

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());

        console.log('📷 Camera positioned at:', this.camera.position);
        console.log('🖥️ Renderer initialized');
    }

    setupLighting() {
        // Bright ambient light to ensure visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(100, 200, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -200;
        directionalLight.shadow.camera.right = 200;
        directionalLight.shadow.camera.top = 200;
        directionalLight.shadow.camera.bottom = -200;
        this.scene.add(directionalLight);

        // Additional lights for better visibility
        const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(-100, 100, -100);
        this.scene.add(light2);

        const light3 = new THREE.DirectionalLight(0xffffff, 0.3);
        light3.position.set(0, -100, 100);
        this.scene.add(light3);

        console.log('💡 Lighting setup complete');
    }

    setupEnvironment() {
        // Ground plane for reference
        const groundGeometry = new THREE.PlaneGeometry(400, 400);
        const groundMaterial = new THREE.MeshLambertMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -30;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Grid helper for positioning reference
        const gridHelper = new THREE.GridHelper(400, 20, 0x444444, 0x444444);
        gridHelper.position.y = -29;
        this.scene.add(gridHelper);

        // Axis helper for orientation
        const axesHelper = new THREE.AxesHelper(50);
        this.scene.add(axesHelper);

        console.log('🌍 Environment setup complete');
    }

    setupControls() {
        // Simple mouse controls
        let mouseDown = false;
        let mouseX = 0, mouseY = 0;

        this.canvas.addEventListener('mousedown', (e) => {
            mouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        this.canvas.addEventListener('mouseup', () => {
            mouseDown = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;

            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;

            // Rotate camera around the scene
            const spherical = new THREE.Spherical();
            spherical.setFromVector3(this.camera.position);
            spherical.theta -= deltaX * 0.01;
            spherical.phi += deltaY * 0.01;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

            this.camera.position.setFromSpherical(spherical);
            this.camera.lookAt(0, 0, 0);

            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        this.canvas.addEventListener('wheel', (e) => {
            const distance = this.camera.position.length();
            const newDistance = Math.max(50, Math.min(500, distance + e.deltaY * 0.1));
            this.camera.position.normalize().multiplyScalar(newDistance);
        });

        console.log('🖱️ Controls setup complete');
    }

    addRobot(robotData) {
        console.log(`🤖 ADDING ROBOT: ${robotData.robot_id}`, robotData);

        // Remove existing robot if it exists
        if (this.robots.has(robotData.robot_id)) {
            this.removeRobot(robotData.robot_id);
        }

        // Create new robot
        const robot = new Robot3D(robotData);

        // FORCE add to scene
        this.scene.add(robot.group);
        this.robots.set(robotData.robot_id, robot);

        console.log(`✅ Robot ${robotData.robot_id} ADDED to scene`);
        console.log(`📊 Scene now has ${this.scene.children.length} children`);
        console.log(`🤖 Total robots: ${this.robots.size}`);

        // Force render to show immediately
        this.renderer.render(this.scene, this.camera);

        return robot;
    }

    updateRobot(robotData) {
        const robot = this.robots.get(robotData.robot_id);
        if (robot) {
            robot.update(robotData);
        } else {
            console.log(`⚠️ Robot ${robotData.robot_id} not found, adding it`);
            this.addRobot(robotData);
        }
    }

    // Trigger action on specific robot
    triggerRobotAction(robotId, action) {
        const robot = this.robots.get(robotId);
        if (robot) {
            console.log(`🎬 Triggering action ${action} on ${robotId}`);
            robot.startAction(action);
        } else {
            console.warn(`⚠️ Robot ${robotId} not found for action ${action}`);
        }
    }

    // Trigger action on all robots
    triggerAllRobotsAction(action) {
        console.log(`🎬 Triggering action ${action} on ALL robots`);
        this.robots.forEach((robot, robotId) => {
            robot.startAction(action);
        });
    }

    removeRobot(robotId) {
        const robot = this.robots.get(robotId);
        if (robot) {
            this.scene.remove(robot.group);
            robot.dispose();
            this.robots.delete(robotId);
            console.log(`🗑️ Robot ${robotId} removed`);
        }
    }

    resetCamera() {
        this.camera.position.set(0, 100, 200);
        this.camera.lookAt(0, 0, 0);
        console.log('📷 Camera reset');
    }

    onWindowResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Export for use in simulator
window.Robot3D = Robot3D;
window.Scene3D = Scene3D;

console.log('🚀 Robot3D with Enhanced Actions loaded successfully');
