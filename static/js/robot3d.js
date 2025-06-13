/**
 * 3D Robot Visualization using Three.js
 * Creates and manages 3D humanoid robot models
 */

class Robot3D {
    constructor(robotData) {
        this.robotId = robotData.robot_id;
        this.color = robotData.color;
        this.position = robotData.position;
        this.rotation = robotData.rotation;
        this.currentAction = robotData.current_action;
        this.actionProgress = robotData.action_progress;
        this.bodyParts = robotData.body_parts;
        
        // Three.js objects
        this.group = new THREE.Group();
        this.parts = {};
        
        this.createRobot();
        this.updatePosition();
    }
    
    createRobot() {
        // Materials
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: this.color,
            shininess: 30
        });
        const jointMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 50
        });
        
        // Head
        const headGeometry = new THREE.SphereGeometry(8, 16, 16);
        this.parts.head = new THREE.Mesh(headGeometry, bodyMaterial);
        this.parts.head.position.set(0, 25, 0);
        this.parts.head.castShadow = true;
        this.parts.head.receiveShadow = true;
        this.group.add(this.parts.head);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(1, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-3, 2, 6);
        this.parts.head.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(3, 2, 6);
        this.parts.head.add(rightEye);
        
        // Torso
        const torsoGeometry = new THREE.BoxGeometry(12, 20, 8);
        this.parts.torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
        this.parts.torso.position.set(0, 5, 0);
        this.parts.torso.castShadow = true;
        this.parts.torso.receiveShadow = true;
        this.group.add(this.parts.torso);
        
        // Arms with proper pivot points
        const armGeometry = new THREE.BoxGeometry(4, 15, 4);
        
        // Left Arm - Fixed pivot point
        this.parts.leftArm = new THREE.Group();
        const leftUpperArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftUpperArm.position.set(0, -7.5, 0); // Center the arm in the group
        leftUpperArm.castShadow = true;
        leftUpperArm.receiveShadow = true;
        this.parts.leftArm.add(leftUpperArm);
        
        const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), jointMaterial);
        leftShoulder.position.set(0, 0, 0); // At the pivot point
        leftShoulder.castShadow = true;
        this.parts.leftArm.add(leftShoulder);
        
        // Position the entire arm group at shoulder
        this.parts.leftArm.position.set(-8, 12, 0);
        this.group.add(this.parts.leftArm);
        
        // Right Arm - Fixed pivot point
        this.parts.rightArm = new THREE.Group();
        const rightUpperArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightUpperArm.position.set(0, -7.5, 0); // Center the arm in the group
        rightUpperArm.castShadow = true;
        rightUpperArm.receiveShadow = true;
        this.parts.rightArm.add(rightUpperArm);
        
        const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), jointMaterial);
        rightShoulder.position.set(0, 0, 0); // At the pivot point
        rightShoulder.castShadow = true;
        this.parts.rightArm.add(rightShoulder);
        
        // Position the entire arm group at shoulder
        this.parts.rightArm.position.set(8, 12, 0);
        this.group.add(this.parts.rightArm);
        
        // Legs with proper pivot points
        const legGeometry = new THREE.BoxGeometry(6, 18, 6);
        
        // Left Leg - Fixed pivot point
        this.parts.leftLeg = new THREE.Group();
        const leftThigh = new THREE.Mesh(legGeometry, bodyMaterial);
        leftThigh.position.set(0, -9, 0); // Center the leg in the group
        leftThigh.castShadow = true;
        leftThigh.receiveShadow = true;
        this.parts.leftLeg.add(leftThigh);
        
        const leftHip = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), jointMaterial);
        leftHip.position.set(0, 0, 0); // At the pivot point
        leftHip.castShadow = true;
        this.parts.leftLeg.add(leftHip);
        
        // Position the entire leg group at hip
        this.parts.leftLeg.position.set(-4, -5, 0);
        this.group.add(this.parts.leftLeg);
        
        // Right Leg - Fixed pivot point
        this.parts.rightLeg = new THREE.Group();
        const rightThigh = new THREE.Mesh(legGeometry, bodyMaterial);
        rightThigh.position.set(0, -9, 0); // Center the leg in the group
        rightThigh.castShadow = true;
        rightThigh.receiveShadow = true;
        this.parts.rightLeg.add(rightThigh);
        
        const rightHip = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), jointMaterial);
        rightHip.position.set(0, 0, 0); // At the pivot point
        rightHip.castShadow = true;
        this.parts.rightLeg.add(rightHip);
        
        // Position the entire leg group at hip
        this.parts.rightLeg.position.set(4, -5, 0);
        this.group.add(this.parts.rightLeg);
        
        // Feet
        const footGeometry = new THREE.BoxGeometry(6, 2, 10);
        const footMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(this.color).multiplyScalar(0.7)
        });
        
        const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
        leftFoot.position.set(0, -20, 2);
        leftFoot.castShadow = true;
        leftFoot.receiveShadow = true;
        this.parts.leftLeg.add(leftFoot);
        
        const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
        rightFoot.position.set(0, -20, 2);
        rightFoot.castShadow = true;
        rightFoot.receiveShadow = true;
        this.parts.rightLeg.add(rightFoot);
        
        // Robot ID Label
        this.createLabel();
        
        // Shadow
        this.createShadow();
        
        // Make sure the entire group is visible
        this.group.visible = true;
        
        console.log(`✅ Robot ${this.robotId} created with color ${this.color}`);
    }
    
    createLabel() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 32;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'white';
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillText(this.robotId, canvas.width / 2, 20);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        this.label = new THREE.Sprite(material);
        this.label.position.set(0, 40, 0);
        this.label.scale.set(20, 5, 1);
        this.group.add(this.label);
    }
    
    createShadow() {
        const shadowGeometry = new THREE.PlaneGeometry(30, 15);
        const shadowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        });
        this.shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        this.shadow.rotation.x = -Math.PI / 2;
        this.shadow.position.set(0, -23, 0);
        this.group.add(this.shadow);
    }
    
    update(robotData) {
        console.log(`🔄 ${robotData.robot_id}: Update called`);
        console.log(`   Action: ${robotData.current_action}`);
        console.log(`   Progress: ${(robotData.action_progress * 100).toFixed(1)}%`);
        console.log(`   Body parts:`, robotData.body_parts);
        
        this.position = robotData.position;
        this.rotation = robotData.rotation;
        this.currentAction = robotData.current_action;
        this.actionProgress = robotData.action_progress;
        this.bodyParts = robotData.body_parts;
        
        this.updatePosition();
        this.updateAnimations();
        
        console.log(`✅ ${robotData.robot_id}: Update completed`);
    }
    
    updatePosition() {
        this.group.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );
        
        this.group.rotation.y = THREE.MathUtils.degToRad(this.rotation.y);
    }
    
    updateAnimations() {
        // Debug: Log animation data
        if (this.currentAction !== 'idle') {
            console.log(`🎭 ${this.robotId}: Updating animations for ${this.currentAction}`);
            console.log('Body parts data:', this.bodyParts);
        }
        
        // FORCE RESET all rotations to ensure clean state
        this.parts.head.rotation.set(0, 0, 0);
        this.parts.torso.rotation.set(0, 0, 0);
        this.parts.leftArm.rotation.set(0, 0, 0);
        this.parts.rightArm.rotation.set(0, 0, 0);
        this.parts.leftLeg.rotation.set(0, 0, 0);
        this.parts.rightLeg.rotation.set(0, 0, 0);
        
        // Apply body part rotations from server
        if (this.bodyParts) {
            let animatedParts = 0;
            
            // Head
            if (this.bodyParts.head) {
                const head = this.bodyParts.head;
                if (Math.abs(head.x) > 0.1 || Math.abs(head.y) > 0.1 || Math.abs(head.z) > 0.1) {
                    this.parts.head.rotation.order = 'XYZ';
                    this.parts.head.rotation.set(
                        THREE.MathUtils.degToRad(head.x),
                        THREE.MathUtils.degToRad(head.y),
                        THREE.MathUtils.degToRad(head.z)
                    );
                    animatedParts++;
                    console.log(`  ✅ Head animated: ${head.x}°, ${head.y}°, ${head.z}°`);
                }
            }
            
            // Torso
            if (this.bodyParts.torso) {
                const torso = this.bodyParts.torso;
                if (Math.abs(torso.x) > 0.1 || Math.abs(torso.y) > 0.1 || Math.abs(torso.z) > 0.1) {
                    this.parts.torso.rotation.order = 'XYZ';
                    this.parts.torso.rotation.set(
                        THREE.MathUtils.degToRad(torso.x),
                        THREE.MathUtils.degToRad(torso.y),
                        THREE.MathUtils.degToRad(torso.z)
                    );
                    animatedParts++;
                    console.log(`  ✅ Torso animated: ${torso.x}°, ${torso.y}°, ${torso.z}°`);
                }
            }
            
            // Left Arm - FORCE VISIBLE ROTATION
            if (this.bodyParts.left_arm) {
                const leftArm = this.bodyParts.left_arm;
                if (Math.abs(leftArm.x) > 0.1 || Math.abs(leftArm.y) > 0.1 || Math.abs(leftArm.z) > 0.1) {
                    this.parts.leftArm.rotation.order = 'XYZ';
                    this.parts.leftArm.rotation.set(
                        THREE.MathUtils.degToRad(leftArm.x),
                        THREE.MathUtils.degToRad(leftArm.y),
                        THREE.MathUtils.degToRad(leftArm.z)
                    );
                    
                    // FORCE UPDATE - ensure Three.js applies the rotation
                    this.parts.leftArm.updateMatrix();
                    this.parts.leftArm.updateMatrixWorld(true);
                    
                    animatedParts++;
                    console.log(`  ✅ Left arm FORCED rotation: ${leftArm.x}°, ${leftArm.y}°, ${leftArm.z}°`);
                }
            }
            
            // Right Arm - FORCE VISIBLE ROTATION
            if (this.bodyParts.right_arm) {
                const rightArm = this.bodyParts.right_arm;
                if (Math.abs(rightArm.x) > 0.1 || Math.abs(rightArm.y) > 0.1 || Math.abs(rightArm.z) > 0.1) {
                    this.parts.rightArm.rotation.order = 'XYZ';
                    this.parts.rightArm.rotation.set(
                        THREE.MathUtils.degToRad(rightArm.x),
                        THREE.MathUtils.degToRad(rightArm.y),
                        THREE.MathUtils.degToRad(rightArm.z)
                    );
                    
                    // FORCE UPDATE - ensure Three.js applies the rotation
                    this.parts.rightArm.updateMatrix();
                    this.parts.rightArm.updateMatrixWorld(true);
                    
                    animatedParts++;
                    console.log(`  ✅ Right arm FORCED rotation: ${rightArm.x}°, ${rightArm.y}°, ${rightArm.z}°`);
                }
            }
            
            // Left Leg
            if (this.bodyParts.left_leg) {
                const leftLeg = this.bodyParts.left_leg;
                if (Math.abs(leftLeg.x) > 0.1 || Math.abs(leftLeg.y) > 0.1 || Math.abs(leftLeg.z) > 0.1) {
                    this.parts.leftLeg.rotation.order = 'XYZ';
                    this.parts.leftLeg.rotation.set(
                        THREE.MathUtils.degToRad(leftLeg.x),
                        THREE.MathUtils.degToRad(leftLeg.y),
                        THREE.MathUtils.degToRad(leftLeg.z)
                    );
                    
                    // FORCE UPDATE
                    this.parts.leftLeg.updateMatrix();
                    this.parts.leftLeg.updateMatrixWorld(true);
                    
                    animatedParts++;
                    console.log(`  ✅ Left leg FORCED rotation: ${leftLeg.x}°, ${leftLeg.y}°, ${leftLeg.z}°`);
                }
            }
            
            // Right Leg
            if (this.bodyParts.right_leg) {
                const rightLeg = this.bodyParts.right_leg;
                if (Math.abs(rightLeg.x) > 0.1 || Math.abs(rightLeg.y) > 0.1 || Math.abs(rightLeg.z) > 0.1) {
                    this.parts.rightLeg.rotation.order = 'XYZ';
                    this.parts.rightLeg.rotation.set(
                        THREE.MathUtils.degToRad(rightLeg.x),
                        THREE.MathUtils.degToRad(rightLeg.y),
                        THREE.MathUtils.degToRad(rightLeg.z)
                    );
                    
                    // FORCE UPDATE
                    this.parts.rightLeg.updateMatrix();
                    this.parts.rightLeg.updateMatrixWorld(true);
                    
                    animatedParts++;
                    console.log(`  ✅ Right leg FORCED rotation: ${rightLeg.x}°, ${rightLeg.y}°, ${rightLeg.z}°`);
                }
            }
            
            if (animatedParts > 0) {
                console.log(`🎭 ${this.robotId}: FORCED ${animatedParts} animations with matrix updates`);
                
                // EXTREME Visual feedback: Change robot color when animating
                this.parts.head.material.color.setHex(0xff0000); // Red when animating
                this.parts.torso.material.color.setHex(0xff4444); // Light red torso
                
                // Force the entire robot group to update
                this.group.updateMatrix();
                this.group.updateMatrixWorld(true);
                
                // Reset color after a short delay
                setTimeout(() => {
                    this.parts.head.material.color.setHex(this.color);
                    this.parts.torso.material.color.setHex(this.color);
                }, 200);
            } else {
                // Ensure normal color when not animating
                this.parts.head.material.color.setHex(this.color);
                this.parts.torso.material.color.setHex(this.color);
            }
        } else {
            console.log(`❌ ${this.robotId}: No body parts data available`);
        }
        
        // Update label to show current action
        if (this.currentAction !== 'idle') {
            this.updateActionLabel();
        }
    }
    
    updateActionLabel() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 48;
        
        // Background
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Robot ID
        context.fillStyle = 'white';
        context.font = '14px Arial';
        context.textAlign = 'center';
        context.fillText(this.robotId, canvas.width / 2, 16);
        
        // Action
        context.fillStyle = '#4A90E2';
        context.font = '12px Arial';
        const actionText = this.currentAction.replace('_', ' ').toUpperCase();
        context.fillText(actionText, canvas.width / 2, 32);
        
        // Progress bar
        const progressWidth = (canvas.width - 20) * this.actionProgress;
        context.fillStyle = 'rgba(76, 175, 80, 0.3)';
        context.fillRect(10, 36, canvas.width - 20, 4);
        context.fillStyle = '#4CAF50';
        context.fillRect(10, 36, progressWidth, 4);
        
        const texture = new THREE.CanvasTexture(canvas);
        this.label.material.map = texture;
        this.label.material.needsUpdate = true;
    }
    
    dispose() {
        // Clean up Three.js objects
        this.group.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
}

class Scene3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.robots = new Map();
        
        this.initThreeJS();
        this.setupLighting();
        this.setupControls();
        this.setupEnvironment();
        
        this.animate();
    }
    
    initThreeJS() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 200, 1000);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 150, 300); // Better initial position
        this.camera.lookAt(0, 0, 0);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        console.log('✅ Three.js initialized');
        console.log('📷 Camera position:', this.camera.position);
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
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
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0x4A90E2, 0.3);
        fillLight.position.set(-50, 50, -50);
        this.scene.add(fillLight);
        
        // Point lights for dramatic effect
        const pointLight1 = new THREE.PointLight(0xFF6B6B, 0.5, 100);
        pointLight1.position.set(100, 50, 0);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x4ECDC4, 0.5, 100);
        pointLight2.position.set(-100, 50, 0);
        this.scene.add(pointLight2);
    }
    
    setupControls() {
        // Simple orbit controls using mouse
        this.isMouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cameraAngle = 0;
        this.cameraHeight = 150; // Higher initial height
        this.cameraDistance = 300; // Further back initially
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isMouseDown) {
                const deltaX = e.clientX - this.mouseX;
                const deltaY = e.clientY - this.mouseY;
                
                this.cameraAngle += deltaX * 0.01;
                this.cameraHeight = Math.max(20, Math.min(300, this.cameraHeight - deltaY * 0.5));
                
                this.updateCameraPosition();
                
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            }
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.cameraDistance = Math.max(100, Math.min(800, this.cameraDistance + e.deltaY * 0.5));
            this.updateCameraPosition();
        });
        
        // Set initial camera position
        this.updateCameraPosition();
        
        console.log('✅ Camera controls initialized');
    }
    
    updateCameraPosition() {
        this.camera.position.x = Math.sin(this.cameraAngle) * this.cameraDistance;
        this.camera.position.y = this.cameraHeight;
        this.camera.position.z = Math.cos(this.cameraAngle) * this.cameraDistance;
        this.camera.lookAt(0, 0, 0);
    }
    
    setupEnvironment() {
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(400, 400);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -25;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Grid
        const gridHelper = new THREE.GridHelper(400, 40, 0x4A90E2, 0x333333);
        gridHelper.position.y = -24;
        this.scene.add(gridHelper);
        
        // Skybox
        const skyGeometry = new THREE.SphereGeometry(800, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x1a1a2e,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
    }
    
    addRobot(robotData) {
        console.log(`🤖 Adding robot: ${robotData.robot_id}`, robotData);
        
        const robot = new Robot3D(robotData);
        robot.group.castShadow = true;
        robot.group.receiveShadow = true;
        
        // Enable shadows for all robot parts
        robot.group.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        this.robots.set(robotData.robot_id, robot);
        this.scene.add(robot.group);
        
        console.log(`✅ Robot ${robotData.robot_id} added to scene at position:`, robot.position);
        console.log(`📊 Total robots in scene: ${this.robots.size}`);
    }
    
    updateRobot(robotData) {
        const robot = this.robots.get(robotData.robot_id);
        if (robot) {
            robot.update(robotData);
        }
    }
    
    removeRobot(robotId) {
        const robot = this.robots.get(robotId);
        if (robot) {
            this.scene.remove(robot.group);
            robot.dispose();
            this.robots.delete(robotId);
        }
    }
    
    resetCamera() {
        this.cameraAngle = 0;
        this.cameraHeight = 150;
        this.cameraDistance = 300;
        this.updateCameraPosition();
        console.log('📷 Camera reset to default position');
    }
    
    toggleWireframe() {
        this.robots.forEach(robot => {
            robot.group.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.wireframe = !child.material.wireframe;
                }
            });
        });
    }
    
    toggleShadows() {
        this.renderer.shadowMap.enabled = !this.renderer.shadowMap.enabled;
    }
    
    onWindowResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
