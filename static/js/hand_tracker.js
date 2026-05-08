/**
 * Hand Tracker for 3D Camera Control
 * Uses MediaPipe Hands to detect gestures and send them via WebSocket
 */

class HandTracker {
    constructor() {
        this.video = document.getElementById('webcam');
        this.canvas = document.getElementById('output-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.vfxCanvas = document.getElementById('vfx-canvas');
        this.domainGame = new DomainExpansionGame();
        
        this.sessionKey = window.sessionKey;
        this.socket = null;
        
        this.hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        
        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        this.hands.onResults(this.onResults.bind(this));
        
        this.camera = new Camera(this.video, {
            onFrame: async () => {
                // Ensure canvas matches video display size
                if (this.canvas.width !== this.video.videoWidth || this.canvas.height !== this.video.videoHeight) {
                    this.canvas.width = this.video.videoWidth;
                    this.canvas.height = this.video.videoHeight;
                    this.vfxCanvas.width = this.video.videoWidth;
                    this.vfxCanvas.height = this.video.videoHeight;
                    this.domainGame.initVFX(this.vfxCanvas);
                }
                await this.hands.send({image: this.video});
            },
            width: 1280,
            height: 720
        });
        
        this.prevHands = [];
        this.lastEmitTime = 0;
        
        // --- 1. Mode Control ---
        this.modeSelect = document.getElementById('operation-mode');
        this.robotSelect = document.getElementById('robot-select');
        this.modeDisplay = document.getElementById('mode-display');
        this.domainDisplay = document.getElementById('domain-display');
        this.cameraSettings = document.getElementById('camera-settings');
        this.cooldownSettings = document.getElementById('cooldown-settings');
        this.instructionsPanel = document.getElementById('instructions-panel');
        
        this.operationMode = this.modeSelect.value;
        this.modeSelect.addEventListener('change', () => {
            this.operationMode = this.modeSelect.value;
            this.updateUIMode();
        });

        // --- 2. Cooldown Sliders ---
        this.simSlider = document.getElementById('sim-cooldown-slider');
        this.simLabel = document.getElementById('sim-cooldown-val');
        this.realSlider = document.getElementById('real-cooldown-slider');
        this.realLabel = document.getElementById('real-cooldown-val');

        this.lastSimActionTime = 0;
        this.lastSimDomain = null;
        this.lastRealActionTime = 0;
        this.lastRealDomain = null;

        this.simSlider.addEventListener('input', () => {
            this.simCooldownMs = parseInt(this.simSlider.value) * 1000;
            this.simLabel.textContent = this.simSlider.value;
        });

        this.realSlider.addEventListener('input', () => {
            this.realCooldownMs = parseInt(this.realSlider.value) * 1000;
            this.realLabel.textContent = this.realSlider.value;
        });

        // --- 3. Sensitivity Sliders ---
        this.rotateSens = document.getElementById('rotate-sensitivity');
        this.rotateLabel = document.getElementById('rotate-val');
        this.zoomSens = document.getElementById('zoom-sensitivity');
        this.zoomLabel = document.getElementById('zoom-val');
        this.panSens = document.getElementById('pan-sensitivity');
        this.panLabel = document.getElementById('pan-val');

        this.rotateSens.addEventListener('input', () => { this.rotateLabel.textContent = this.rotateSens.value; });
        this.zoomSens.addEventListener('input', () => { this.zoomLabel.textContent = this.zoomSens.value; });
        this.panSens.addEventListener('input', () => { this.panLabel.textContent = this.panSens.value; });

        // --- 4. System Controls ---
        this.resetCameraBtn = document.getElementById('reset-camera-btn');
        this.intervalSlider = document.getElementById('emit-interval');
        this.intervalLabel = document.getElementById('interval-value');

        this.intervalSlider.addEventListener('input', () => {
            this.emitInterval = parseInt(this.intervalSlider.value);
            const fps = Math.round(1000 / this.emitInterval);
            this.intervalLabel.textContent = `${this.emitInterval}ms (${fps} updates/s)`;
        });

        if (this.resetCameraBtn) {
            this.resetCameraBtn.addEventListener('click', () => {
                console.log(`📷 Requesting Camera Reset for session: ${this.sessionKey}`);
                this.emitControl('reset', { force: true });
            });
        }

        // --- 5. Initial Sync ---
        this.emitInterval = parseInt(this.intervalSlider.value);
        this.simCooldownMs = parseInt(this.simSlider.value) * 1000;
        this.realCooldownMs = parseInt(this.realSlider.value) * 1000;
        this.videoBaseUrl = window.videoBucketUrl || '';
        this.resetTimer = null;

        this.init();
    }
    
    updateUIMode() {
        if (this.operationMode === 'camera') {
            this.modeDisplay.textContent = 'Control the 3D scene with gestures';
            this.cameraSettings.style.display = 'block';
            this.cooldownSettings.style.display = 'none';
            this.instructionsPanel.innerHTML = `
                <strong>1 Hand:</strong> Move to rotate. <br>
                <strong>2 Hands:</strong> Apart/Together to zoom. <br>
                Move same direction to pan.
            `;
            this.domainDisplay.textContent = '';
        } else {
            this.modeDisplay.textContent = 'Strike a hand sign to expand your domain!';
            this.cameraSettings.style.display = 'none';
            this.cooldownSettings.style.display = 'block';
            this.instructionsPanel.innerHTML = `
                <strong>五條悟:</strong> 無量空處 (1 hand) <br>
                <strong>兩面宿儺:</strong> 伏魔御廚子 (2 hands) <br>
                <strong>真人:</strong> 自閉圓頓裹 (2 hands) <br>
                <strong>乙骨憂太:</strong> 真贋相愛 <br>
                <strong>秤金次:</strong> 坐殺博徒 <br>
                <strong>虎杖悠仁:</strong> 名稱不明
            `;
        }
    }

    init() {
        console.log('🚀 Initializing HandTracker...');
        this.connectSocket();
        this.camera.start();
        this.updateUIMode();
        
        const trackingStatus = document.getElementById('tracking-status');
        const trackingDot = document.getElementById('tracking-dot');
        trackingStatus.textContent = 'Active';
        trackingDot.classList.add('active');
    }
    
    connectSocket() {
        this.socket = io();
        
        const wsStatus = document.getElementById('ws-status');
        const wsDot = document.getElementById('ws-dot');
        
        this.socket.on('connect', () => {
            console.log('✅ Connected to WebSocket');
            wsStatus.textContent = 'Connected';
            wsDot.classList.add('active');
            this.socket.emit('join_session', { session_key: this.sessionKey });
        });
        
        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from WebSocket');
            wsStatus.textContent = 'Disconnected';
            wsDot.classList.remove('active');
        });
    }
    
    onResults(results) {
        // Draw visual feedback
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
                drawLandmarks(this.ctx, landmarks, {color: '#FF0000', lineWidth: 2});
            }
            
            if (this.operationMode === 'camera') {
                this.processGestures(results.multiHandLandmarks);
                this.domainGame.drawVFX(this.vfxCanvas, null);
            } else {
                const stableDomain = this.domainGame.update(results.multiHandLandmarks);
                this.processDomainExpansion(stableDomain);
                this.domainGame.drawVFX(this.vfxCanvas, stableDomain);
            }
        } else {
            if (this.operationMode === 'domain') {
                this.domainGame.update([]);
                this.domainGame.drawVFX(this.vfxCanvas, null);
            }
        }
        this.ctx.restore();
    }

    processDomainExpansion(stableDomain) {
        if (stableDomain) {
            if (this.resetTimer) {
                clearTimeout(this.resetTimer);
                this.resetTimer = null;
            }

            const now = Date.now();
            const displayName = this.domainGame.displayNames[stableDomain] || stableDomain;
            const actionMap = {
                "Unlimited Void": "domain_unlimited_void",
                "Malevolent Shrine": "domain_malevolent_shrine",
                "Self-Embodiment of Perfection": "domain_self_embodiment",
                "Authentic Mutual Love": "domain_authentic_love",
                "Idle Death Gamble": "domain_idle_death_gamble",
                "Yuji Itadori": "domain_yuji_itadori"
            };
            const action = actionMap[stableDomain];

            // 1. UI & VFX Update (ALWAYS INSTANT)
            this.domainDisplay.textContent = displayName;
            this.domainDisplay.style.color = this.domainGame.domainColors[stableDomain];
            this.domainDisplay.style.opacity = "1.0";

            // 2. SIMULATION TRIGGER (STRICT COOLDOWN)
            if (now - this.lastSimActionTime >= this.simCooldownMs) {
                if (action && this.socket && this.socket.connected) {
                    this.lastSimActionTime = now;
                    this.lastSimDomain = stableDomain;
                    const targetRobot = this.robotSelect.value;
                    console.log(`🎮 Sim Trigger (${this.simCooldownMs/1000}s) for ${targetRobot}: ${displayName}`);
                    
                    this.socket.emit('robot_action', { 
                        session_key: this.sessionKey, 
                        robot_id: targetRobot, 
                        action: action 
                    });

                    // Update Video
                    const videoMap = {
                        "Unlimited Void": "domain_unlimited_void.mp4",
                        "Malevolent Shrine": "domain_malevolent_shrine.mp4",
                        "Self-Embodiment of Perfection": "domain_self_embodiment.mp4",
                        "Authentic Mutual Love": "domain_authentic_love.mp4",
                        "Idle Death Gamble": "domain_idle_death_gamble.mp4",
                        "Yuji Itadori": "domain_yuji_itadori.mp4"
                    };
                    const videoFile = videoMap[stableDomain];
                    if (videoFile) {
                        this.socket.emit('change_video_source', {
                            session_key: this.sessionKey,
                            video_src: `${this.videoBaseUrl}${videoFile}`
                        });
                    }
                }
            }

            // 3. REAL ROBOT TRIGGER (STRICT COOLDOWN)
            if (now - this.lastRealActionTime >= this.realCooldownMs) {
                if (action) {
                    this.lastRealActionTime = now;
                    this.lastRealDomain = stableDomain;
                    const targetRobot = this.robotSelect.value;
                    console.log(`🤖 REAL ROBOT Trigger (${this.realCooldownMs/1000}s) for ${targetRobot}: ${displayName}`);
                    
                    fetch(`/run_action/${targetRobot}?session_key=${this.sessionKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: action })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) console.log(`✅ Real robot confirmed: ${action}`);
                    })
                    .catch(err => console.error('❌ Real robot trigger failed:', err));
                }
            } else {
                // visual feedback
                const wait = Math.ceil((this.realCooldownMs - (now - this.lastRealActionTime)) / 1000);
                this.domainDisplay.textContent = `${displayName} (Hardware Busy ${wait}s)`;
                this.domainDisplay.style.opacity = "0.7";
            }
        } else {
            this.domainDisplay.textContent = '';
            if (!this.resetTimer) {
                this.resetTimer = setTimeout(() => {
                    this.lastSimDomain = null;
                    this.lastRealDomain = null;
                    this.resetTimer = null;
                }, 2000); 
            }
        }
    }
    
    processGestures(multiHandLandmarks) {
        const now = Date.now();
        if (now - this.lastEmitTime < this.emitInterval) return;
        
        const currentHands = multiHandLandmarks.map(landmarks => {
            // Get center point of hand (average of landmarks)
            let x = 0, y = 0;
            landmarks.forEach(l => { x += l.x; y += l.y; });
            return { x: x / landmarks.length, y: y / landmarks.length, raw: landmarks };
        });
        
        if (this.prevHands.length > 0 && currentHands.length > 0) {
            if (currentHands.length === 1 && this.prevHands.length === 1) {
                // ROTATE: 1 hand
                const dx = currentHands[0].x - this.prevHands[0].x;
                const dy = currentHands[0].y - this.prevHands[0].y;
                
                const sensitivity = parseFloat(this.rotateSens.value);
                this.emitControl('rotate', { dx: -dx * sensitivity, dy: dy * sensitivity });
                
            } else if (currentHands.length === 2 && this.prevHands.length === 2) {
                // ZOOM or PAN: 2 hands
                
                // Current distance between hands
                const currentDist = Math.sqrt(
                    Math.pow(currentHands[0].x - currentHands[1].x, 2) + 
                    Math.pow(currentHands[0].y - currentHands[1].y, 2)
                );
                
                // Previous distance
                const prevDist = Math.sqrt(
                    Math.pow(this.prevHands[0].x - this.prevHands[1].x, 2) + 
                    Math.pow(this.prevHands[0].y - this.prevHands[1].y, 2)
                );
                
                // Calculate movement of centers for Panning
                const currentCenter = { 
                    x: (currentHands[0].x + currentHands[1].x) / 2,
                    y: (currentHands[0].y + currentHands[1].y) / 2
                };
                const prevCenter = {
                    x: (this.prevHands[0].x + this.prevHands[1].x) / 2,
                    y: (this.prevHands[0].y + this.prevHands[1].y) / 2
                };
                
                const dx = currentCenter.x - prevCenter.x;
                const dy = currentCenter.y - prevCenter.y;
                
                const dDist = currentDist - prevDist;
                
                // Check if it's primarily a zoom or a pan
                if (Math.abs(dDist) > Math.abs(dx) * 0.4) {
                    // ZOOM
                    const sensitivity = parseFloat(this.zoomSens.value);
                    this.emitControl('zoom', { delta: -dDist * sensitivity });
                } else {
                    // PAN
                    const sensitivity = parseFloat(this.panSens.value);
                    this.emitControl('pan', { dx: -dx * sensitivity, dy: dy * sensitivity });
                }
            }
        }
        
        this.prevHands = currentHands;
        this.lastEmitTime = now;
    }
    
    emitControl(type, params) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('camera_control', {
                session_key: this.sessionKey,
                type: type,
                params: params
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.handTracker = new HandTracker();
});
