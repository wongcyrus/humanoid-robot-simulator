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

    debugPosition() {
        console.log(`🔍 Debug ${this.robotId}:`, {
            position: this.position,
            rotation: this.rotation,
            groupPosition: {
                x: this.group.position.x,
                y: this.group.position.y,
                z: this.group.position.z
            },
            groupRotation: {
                x: this.group.rotation.x,
                y: this.group.rotation.y,
                z: this.group.rotation.z
            }
        });
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
            'robot_1': { x: -50, y: 0, z: 50 },
            'robot_2': { x: 0, y: 0, z: 50 },
            'robot_3': { x: 50, y: 0, z: 50 },
            'robot_4': { x: -50, y: 0, z: -50 },
            'robot_5': { x: 0, y: 0, z: -50 },
            'robot_6': { x: 50, y: 0, z: -50 }
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
        // LEFT ARM (robot's anatomical left)
        this.parts.leftArm = new THREE.Group();
        const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(6, 20, 6), bodyMaterial);
        leftArmMesh.position.set(0, -10, 0);
        leftArmMesh.castShadow = true;
        leftArmMesh.receiveShadow = true;
        this.parts.leftArm.add(leftArmMesh);
        this.parts.leftArm.position.set(-12, 20, 0);
        this.group.add(this.parts.leftArm);

        // RIGHT ARM (robot's anatomical right)
        this.parts.rightArm = new THREE.Group();
        const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(6, 20, 6), bodyMaterial);
        rightArmMesh.position.set(0, -10, 0);
        rightArmMesh.castShadow = true;
        rightArmMesh.receiveShadow = true;
        this.parts.rightArm.add(rightArmMesh);
        this.parts.rightArm.position.set(12, 20, 0);
        this.group.add(this.parts.rightArm);

        // LEGS - Create as groups for better animation
        // LEFT LEG (robot's anatomical left)
        this.parts.leftLeg = new THREE.Group();
        const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(8, 25, 8), bodyMaterial);
        leftLegMesh.position.set(0, -12.5, 0);
        leftLegMesh.castShadow = true;
        leftLegMesh.receiveShadow = true;
        this.parts.leftLeg.add(leftLegMesh);
        this.parts.leftLeg.position.set(-6, -5, 0);
        this.group.add(this.parts.leftLeg);

        // RIGHT LEG (robot's anatomical right)
        this.parts.rightLeg = new THREE.Group();
        const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(8, 25, 8), bodyMaterial);
        rightLegMesh.position.set(0, -12.5, 0);
        rightLegMesh.castShadow = true;
        rightLegMesh.receiveShadow = true;
        this.parts.rightLeg.add(rightLegMesh);
        this.parts.rightLeg.position.set(6, -5, 0);
        this.group.add(this.parts.rightLeg);

        // Add text on the torso
        this.addTorsoText();

        console.log(`✅ ${this.robotId} mesh created with ${this.group.children.length} parts`);
    }

    addTorsoText() {
        // Get a unique word for this robot
        const robotWords = {
            'robot_1': '雲',
            'robot_2': '端',
            'robot_3': '系',
            'robot_4': '統',
            'robot_5': '數',
            'robot_6': '據',

        };

        const robotWord = robotWords[this.robotId] || 'ROBOT';

        // Create a canvas for torso text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;

        // Clear canvas with semi-transparent black background
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Add border
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 2;
        context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

        // Configure text style
        context.font = 'bold 80px Arial';
        context.fillStyle = '#FFFFFF';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Add robot word
        context.fillText(robotWord, canvas.width / 2, canvas.height / 2);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        // Create material for torso text
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1
        });

        // Create text plane and position it on the torso front
        const textGeometry = new THREE.PlaneGeometry(12, 12);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 0, 6); // Position on front of torso

        // Add to torso
        this.parts.torso.add(textMesh);
    }

    forcePosition() {
        // FORCE the position and rotation - no matter what
        this.group.position.set(this.position.x, this.position.y, this.position.z);
        this.group.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

        // Ensure position and rotation are properly normalized
        // Normalize rotation values to prevent accumulation issues
        this.group.rotation.x = this.group.rotation.x % (2 * Math.PI);
        this.group.rotation.y = this.group.rotation.y % (2 * Math.PI);
        this.group.rotation.z = this.group.rotation.z % (2 * Math.PI);

        console.log(`🎯 FORCED position for ${this.robotId}:`, this.group.position);
        console.log(`🎯 FORCED rotation for ${this.robotId}:`, this.group.rotation);

        // Mark for update
        this.group.updateMatrixWorld(true);
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
    startAction(action = 'idle') {
        console.log(`🎬 ${this.robotId} starting action: ${action}`);

        if (this.animator) {
            this.animator.startAnimation(action);
        } else {
            console.warn(`⚠️ No animator available for ${this.robotId}`);
        }
    }

    update(robotData) {
        // CRITICAL FIX: Don't update position/rotation during animations
        // This prevents server updates from interfering with ongoing movement animations
        if (this.animator && this.animator.isAnimating) {
            console.log(`🎭 ${this.robotId} is animating - ignoring server position update`);
            return;
        }

        // Update position only when not animating
        if (robotData.position) {
            const newPosition = this.parsePosition(robotData.position);
            console.log(`📍 Server position update for ${this.robotId}:`, newPosition);

            // Always trust server position when not animating
            this.position = newPosition;
            this.group.position.set(this.position.x, this.position.y, this.position.z);
        }

        // Update rotation only when not animating
        if (robotData.rotation) {
            const newRotation = this.parseRotation(robotData.rotation);
            console.log(`🔄 Server rotation update for ${this.robotId}:`, newRotation);

            // Always trust server rotation when not animating
            this.rotation = newRotation;
            this.group.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
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
        this.camera.position.set(0, 100, 150);
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

        // console.log('📷 Camera positioned at:', this.camera.position);
        // console.log('🖥️ Renderer initialized');
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
        // Ground plane with HKIIT logo texture
        const groundGeometry = new THREE.PlaneGeometry(400, 400);

        // Load the HKIIT logo texture
        const textureLoader = new THREE.TextureLoader();
        const logoTexture = textureLoader.load('/static/img/HKIIT_logo.jpg');

        // Configure texture properties for better appearance
        logoTexture.wrapS = THREE.RepeatWrapping;
        logoTexture.wrapT = THREE.RepeatWrapping;
        logoTexture.repeat.set(2, 2); // Tile the logo 2x2 across the floor

        const groundMaterial = new THREE.MeshLambertMaterial({
            map: logoTexture,
            transparent: true,
            opacity: 0.9
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -30;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Grid helper for positioning reference (hidden)
        // const gridHelper = new THREE.GridHelper(400, 20, 0x444444, 0x444444);
        // gridHelper.position.y = -29;
        // this.scene.add(gridHelper);

        // Axis helper for orientation (hidden)
        // const axesHelper = new THREE.AxesHelper(50);
        // this.scene.add(axesHelper);

        // Video screen far away from the ground
        this.setupVideoScreen();

        console.log('🌍 Environment setup complete');
    }

    setupVideoScreen(videoSrc = '/static/video/prog-video-01.mp4') {
        console.log('📺 Setting up video screen with source:', videoSrc);

        // Create video element
        const video = document.createElement('video');
        this.setVideoSource(video, videoSrc);
        video.loop = true;
        video.muted = false; // Enable sound
        video.autoplay = true;
        video.crossOrigin = 'anonymous';
        video.preload = 'auto';
        video.volume = 1.0; // Set maximum volume
        video.controls = false; // Hide browser controls

        // Force unmute with additional attributes
        video.setAttribute('unmuted', 'true');
        video.setAttribute('playsInline', 'true');

        // Add to DOM for proper loading
        video.style.display = 'none';
        document.body.appendChild(video);

        // Enhanced error handling and loading
        video.addEventListener('loadeddata', () => {
            console.log('📺 Video loaded successfully, dimensions:', video.videoWidth, 'x', video.videoHeight);
        });

        video.addEventListener('error', (e) => {
            console.error('📺 Video loading error:', e);
        });

        // Simplified video event handling
        video.addEventListener('loadstart', () => {
            console.log('📺 Video loading started');
        });

        // Create video texture
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;
        videoTexture.flipY = true; // Fix upside down video

        // Create screen geometry (16:9 aspect ratio) - smaller for better visibility
        const screenWidth = 400;
        const screenHeight = 225; // 400 * (9/16) for 16:9 aspect ratio
        const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);

        // Create screen material
        const screenMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
            side: THREE.DoubleSide
        });

        // Create the screen mesh
        const videoScreen = new THREE.Mesh(screenGeometry, screenMaterial);

        // Position the screen to be easily visible from the default camera
        // Camera is at (0, 100, 150) looking at (0, 0, 0)
        // Position screen high above ground but in clear view
        videoScreen.position.set(0, 80, -400); // Closer to camera view
        videoScreen.rotation.x = 0; // Face camera directly

        // Add screen to scene
        this.scene.add(videoScreen);

        // Create a frame for better visibility
        const frameGeometry = new THREE.PlaneGeometry(screenWidth + 5, screenHeight + 5);
        const frameMaterial = new THREE.MeshBasicMaterial({
            color: 0x222222,
            side: THREE.DoubleSide
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.copy(videoScreen.position);
        frame.position.z -= 0.5; // Behind the screen
        this.scene.add(frame);

        // Add IT115115.png image overlay in the center of the screen
        this.addImageOverlay(videoScreen, screenWidth, screenHeight);

        // Store references
        this.videoScreen = videoScreen;
        this.video = video;
        this.videoFrame = frame;

        // Start video playback with improved autoplay handling
        this.attemptVideoPlay(video);

        console.log('📺 Video screen positioned at:', videoScreen.position);
    }

    addImageOverlay(videoScreen, screenWidth, screenHeight) {
        // Load the IT115115.png image
        const textureLoader = new THREE.TextureLoader();
        const imageTexture = textureLoader.load('/static/img/IT115115.png',
            () => {
                console.log('🖼️ IT115115.png image loaded successfully');
            },
            undefined,
            (error) => {
                console.error('🖼️ Error loading IT115115.png:', error);
            }
        );

        // Create overlay geometry - smaller than the screen for centered placement
        const overlayWidth = screenWidth * 0.3; // 30% of screen width
        const overlayHeight = screenHeight * 0.3; // 30% of screen height
        const overlayGeometry = new THREE.PlaneGeometry(overlayWidth, overlayHeight);

        // Create overlay material with transparency
        const overlayMaterial = new THREE.MeshBasicMaterial({
            map: imageTexture,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });

        // Create the overlay mesh
        const imageOverlay = new THREE.Mesh(overlayGeometry, overlayMaterial);

        // Position the overlay in the center of the video screen, moved up by 25%
        imageOverlay.position.copy(videoScreen.position);
        imageOverlay.position.y += screenHeight * 0.15; // Move up by 25% of screen height
        imageOverlay.position.z += 0.1; // Slightly in front of the video screen
        imageOverlay.rotation.copy(videoScreen.rotation);

        // Add overlay to scene
        this.scene.add(imageOverlay);

        // Add text under the image
        this.addTextUnderImage(videoScreen, overlayWidth, overlayHeight, screenHeight);

        // Store reference
        this.imageOverlay = imageOverlay;

        console.log('🖼️ Image overlay added to center of video screen');
    }

    addTextUnderImage(videoScreen, overlayWidth, overlayHeight, screenHeight) {
        // Create canvas for text rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set larger canvas size to accommodate bigger fonts and avoid cropping
        canvas.width = 2000;
        canvas.height = 384;

        // Clear canvas with transparent background
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Set font properties for Chinese text
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.lineWidth = 4; // Thicker outline for larger font
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Draw the first line of text (larger font)
        context.font = 'bold 100px Arial, "Microsoft YaHei", "SimHei", sans-serif';
        const text1 = '雲端系統及數據中心管理高級文憑';
        const y1Position = canvas.height * 0.35;

        // Draw text with stroke (outline) and fill
        context.strokeText(text1, canvas.width / 2, y1Position);
        context.fillText(text1, canvas.width / 2, y1Position);

        // Draw the second line of text (smaller font)
        context.font = 'bold 80px Arial, "Microsoft YaHei", "SimHei", sans-serif';
        const text2 = '課程編號 IT114115';
        const y2Position = canvas.height * 0.7;

        // Draw text with stroke (outline) and fill
        context.strokeText(text2, canvas.width / 2, y2Position);
        context.fillText(text2, canvas.width / 2, y2Position);

        // Create texture from canvas
        const textTexture = new THREE.CanvasTexture(canvas);
        textTexture.minFilter = THREE.LinearFilter;
        textTexture.magFilter = THREE.LinearFilter;

        // Create text geometry
        const textWidth = overlayWidth * 2.2; // Wider to fit larger text
        const textHeight = overlayHeight * 1.0; // Taller for bigger font
        const textGeometry = new THREE.PlaneGeometry(textWidth, textHeight);

        // Create text material
        const textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        });

        // Create text mesh
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Position text under the image, moved up by 25%
        textMesh.position.copy(videoScreen.position);
        textMesh.position.y += screenHeight * 0.25; // Move up by 25% of screen height
        textMesh.position.y -= overlayHeight * 1.1; // Position below the image
        textMesh.position.z += 0.15; // Slightly in front of video screen
        textMesh.rotation.copy(videoScreen.rotation);

        // Add text to scene
        this.scene.add(textMesh);

        // Store reference
        this.textMesh = textMesh;
        this.textTexture = textTexture;

        console.log('📝 Text added under image overlay');
    }

    /**
     * Set video source for the video element
     * @param {HTMLVideoElement} video - The video element
     * @param {string} videoSrc - The video source URL
     */
    setVideoSource(video, videoSrc) {
        video.src = videoSrc;
        console.log('📺 Video source set to:', videoSrc);
    }

    /**
     * Change the video source dynamically
     * @param {string} newVideoSrc - The new video source URL
     */
    changeVideoSource(newVideoSrc) {
        if (!this.video) {
            console.warn('📺 No video element found to change source');
            return;
        }

        console.log('📺 Changing video source from', this.video.src, 'to', newVideoSrc);

        // Pause current video
        this.video.pause();

        // Set new source
        this.setVideoSource(this.video, newVideoSrc);

        // Reload and play with improved handling
        this.video.load();
        this.attemptVideoPlay(this.video);

        console.log('📺 Video source changed successfully');
    }

    /**
     * Get current video source
     * @returns {string} Current video source URL
     */
    getCurrentVideoSource() {
        return this.video ? this.video.src : null;
    }

    /**
     * Play video
     */
    playVideo() {
        if (this.video) {
            this.video.play().catch(e => {
                console.warn('📺 Video play failed:', e);
            });
        }
    }

    /**
     * Pause video
     */
    pauseVideo() {
        if (this.video) {
            this.video.pause();
        }
    }

    /**
     * Toggle video play/pause
     */
    toggleVideo() {
        if (this.video) {
            if (this.video.paused) {
                this.playVideo();
            } else {
                this.pauseVideo();
            }
        }
    }

    /**
     * Attempt to play video with sound - simplified stable approach
     * @param {HTMLVideoElement} video - The video element to play
     */
    attemptVideoPlay(video) {
        if (!video) return;

        // Set volume to maximum
        video.volume = 1.0;

        // Try unmuted first
        video.muted = false;
        video.play().then(() => {
            console.log('📺 Video playing with sound');
            this.hideAutoplayMessage();
        }).catch(e => {
            console.log('📺 Sound blocked, trying muted autoplay');
            // If unmuted fails, try muted
            video.muted = true;
            video.play().then(() => {
                console.log('📺 Video playing muted');
                // Set up simple sound activation on first user interaction
                this.setupSimpleSoundActivation(video);
            }).catch(err => {
                console.error('📺 Video autoplay completely blocked:', err);
            });
        });
    }

    /**
     * Simple sound activation on user interaction
     * @param {HTMLVideoElement} video - The video element
     */
    setupSimpleSoundActivation(video) {
        const enableSound = () => {
            video.muted = false;
            console.log('📺 Video sound enabled');
        };

        // Add single event listener for first interaction
        document.addEventListener('click', enableSound, { once: true });
    }

    /**
     * Show message when autoplay is blocked
     * @param {boolean} completeFailure - Whether video autoplay failed completely
     */
    showAutoplayMessage(completeFailure = false) {
        // Remove any existing message
        this.hideAutoplayMessage();

        // Create visual indicator
        const message = document.createElement('div');
        message.id = 'autoplay-message';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 1000;
            cursor: pointer;
            animation: fadeIn 0.3s ease-in;
        `;

        if (completeFailure) {
            message.innerHTML = '🎬 Click to start video playback';
        } else {
            message.innerHTML = '🔊 Click to enable video sound';
        }

        // Add fade-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(message);

        // Auto-hide after 8 seconds
        setTimeout(() => {
            this.hideAutoplayMessage();
        }, 8000);
    }

    /**
     * Hide autoplay message
     */
    hideAutoplayMessage() {
        const message = document.getElementById('autoplay-message');
        if (message) {
            message.remove();
        }
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

    clearAllRobots() {
        console.log(`🗑️ Clearing all ${this.robots.size} robots`);
        this.robots.forEach((robot, robotId) => {
            this.scene.remove(robot.group);
            robot.dispose();
        });
        this.robots.clear();
        console.log('✅ All robots cleared');
    }

    focusOnRobot(robotId) {
        const robot = this.robots.get(robotId);
        if (robot) {
            // Focus camera on the robot's position
            const robotPosition = robot.group.position;
            const distance = this.camera.position.length();

            // Position camera to look at the robot from a good angle
            const offset = new THREE.Vector3(50, 50, 50);
            this.camera.position.copy(robotPosition).add(offset);
            this.camera.lookAt(robotPosition);

            console.log(`📷 Camera focused on robot ${robotId} at position:`, robotPosition);
        } else {
            console.warn(`⚠️ Cannot focus on robot ${robotId} - robot not found`);
        }
    }

    resetCamera() {
        this.camera.position.set(0, 100, 200);
        this.camera.lookAt(0, 0, 0);
        console.log('📷 Camera reset');
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        // console.log(`🔧 Robot3D resize: ${width}x${height}`);

        // Update camera aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // Resize renderer - this is crucial for proper scaling
        this.renderer.setSize(width, height, false);

        // Force a render to see the changes immediately
        this.renderer.render(this.scene, this.camera);
    }

    // Cleanup method for proper resource management
    dispose() {
        // Stop and cleanup video
        if (this.video) {
            this.video.pause();
            this.video.src = '';
            this.video.load();
        }

        // Dispose of video texture
        if (this.videoScreen && this.videoScreen.material.map) {
            this.videoScreen.material.map.dispose();
        }

        // Dispose of image overlay texture
        if (this.imageOverlay && this.imageOverlay.material.map) {
            this.imageOverlay.material.map.dispose();
        }

        // Dispose of text texture
        if (this.textTexture) {
            this.textTexture.dispose();
        }

        // Cleanup renderer
        if (this.renderer) {
            this.renderer.dispose();
        }

        console.log('🧹 Scene3D resources disposed');
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Toggle video mute state
     * @returns {boolean} New mute state
     */
    toggleVideoMute() {
        if (!this.video) {
            console.warn('📺 No video element found to toggle mute');
            return false;
        }

        this.video.muted = !this.video.muted;
        const isMuted = this.video.muted;

        console.log(`📺 Video ${isMuted ? 'muted' : 'unmuted'}`);
        return isMuted;
    }

    /**
     * Get current video mute state
     * @returns {boolean} Whether video is muted
     */
    isVideoMuted() {
        return this.video ? this.video.muted : true;
    }

    /**
     * Set video mute state
     * @param {boolean} muted - Whether to mute the video
     */
    setVideoMuted(muted) {
        if (this.video) {
            this.video.muted = muted;
            console.log(`📺 Video ${muted ? 'muted' : 'unmuted'}`);
        }
    }
}

// Export for use in simulator
window.Robot3D = Robot3D;
window.Scene3D = Scene3D;

console.log('🚀 Robot3D with Enhanced Actions loaded successfully');
