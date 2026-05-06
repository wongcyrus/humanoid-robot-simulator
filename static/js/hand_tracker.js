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
        
        // Mode control
        this.modeSelect = document.getElementById('operation-mode');
        this.modeDisplay = document.getElementById('mode-display');
        this.domainDisplay = document.getElementById('domain-display');
        this.cameraSettings = document.getElementById('camera-settings');
        this.instructionsPanel = document.getElementById('instructions-panel');
        
        this.operationMode = this.modeSelect.value;
        this.lastTriggeredDomain = null;
        this.videoBaseUrl = window.videoBucketUrl || 'https://cdkstack-robotsimulatorconstructrobotsimulatorwebs-fxuvfxmglhc4.s3.us-east-1.amazonaws.com/';
        this.resetTimer = null;

        this.modeSelect.addEventListener('change', () => {
            this.operationMode = this.modeSelect.value;
            this.updateUIMode();
        });

        // Settings elements
        this.rotateSens = document.getElementById('rotate-sensitivity');
        this.zoomSens = document.getElementById('zoom-sensitivity');
        this.panSens = document.getElementById('pan-sensitivity');
        this.intervalSlider = document.getElementById('emit-interval');
        this.intervalLabel = document.getElementById('interval-value');
        
        this.emitInterval = parseInt(this.intervalSlider.value);
        
        this.intervalSlider.addEventListener('input', () => {
            this.emitInterval = parseInt(this.intervalSlider.value);
            const fps = Math.round(1000 / this.emitInterval);
            this.intervalLabel.textContent = `${this.emitInterval}ms (${fps} updates/s)`;
        });

        this.init();
    }
    
    updateUIMode() {
        if (this.operationMode === 'camera') {
            this.modeDisplay.textContent = 'Control the 3D scene with gestures';
            this.cameraSettings.style.display = 'block';
            this.instructionsPanel.innerHTML = `
                <strong>1 Hand:</strong> Move to rotate. <br>
                <strong>2 Hands:</strong> Apart/Together to zoom. <br>
                Move same direction to pan.
            `;
            this.domainDisplay.textContent = '';
        } else {
            this.modeDisplay.textContent = 'Strike a hand sign to expand your domain!';
            this.cameraSettings.style.display = 'none';
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
            // Clear reset timer if it exists
            if (this.resetTimer) {
                clearTimeout(this.resetTimer);
                this.resetTimer = null;
            }

            const displayName = this.domainGame.displayNames[stableDomain] || stableDomain;
            this.domainDisplay.textContent = displayName;
            this.domainDisplay.style.color = this.domainGame.domainColors[stableDomain];
            
            if (stableDomain !== this.lastTriggeredDomain) {
                console.log(`✨ DOMAIN EXPANSION: ${displayName}`);
                this.lastTriggeredDomain = stableDomain;
                
                // Trigger robot action
                const actionMap = {
                    "Unlimited Void": "domain_unlimited_void",
                    "Malevolent Shrine": "domain_malevolent_shrine",
                    "Self-Embodiment of Perfection": "domain_self_embodiment",
                    "Authentic Mutual Love": "domain_authentic_love",
                    "Idle Death Gamble": "domain_idle_death_gamble",
                    "Yuji Itadori": "domain_yuji_itadori"
                };
                
                const action = actionMap[stableDomain];
                if (action && this.socket && this.socket.connected) {
                    // Send robot action
                    this.socket.emit('robot_action', {
                        session_key: this.sessionKey,
                        robot_id: 'all',
                        action: action
                    });

                    // Trigger video change
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
                        const videoUrl = `${this.videoBaseUrl}${videoFile}`;
                        console.log(`📺 Requesting video change: ${videoUrl}`);
                        this.socket.emit('change_video_source', {
                            session_key: this.sessionKey,
                            video_src: videoUrl
                        });
                    }
                }
            }
        } else {
            this.domainDisplay.textContent = '';
            // Only reset lastTriggeredDomain if we haven't seen a domain for a while
            // This adds extra stability against flickering
            if (!this.resetTimer) {
                this.resetTimer = setTimeout(() => {
                    this.lastTriggeredDomain = null;
                    this.resetTimer = null;
                }, 2000); // 2 second cooldown before allowing same domain to re-trigger
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
