/**
 * SpeechPlayer - Per-robot concurrent audio player for the simulator.
 *
 * Manages one Audio instance per robot so multiple robots can speak
 * simultaneously.  If a new speech arrives for the SAME robot while
 * it is still speaking, the old one is interrupted and the new one
 * starts.  Speech for DIFFERENT robots plays concurrently.
 *
 * Usage:
 *   window.speechPlayer.play(robotId, url, text);
 *   window.speechPlayer.stop(robotId);   // stop one robot
 *   window.speechPlayer.stopAll();       // stop every robot
 */
class SpeechPlayer {
    constructor() {
        if (SpeechPlayer._instance) {
            return SpeechPlayer._instance;
        }
        SpeechPlayer._instance = this;

        /** @type {Map<string, HTMLAudioElement>} robotId → Audio */
        this._channels = new Map();

        /** @type {boolean} */
        this._deviceAvailable = this._checkAudioDevice();

        // Unlock audio context on first user interaction (mobile / autoplay policy)
        const unlock = () => {
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('click', unlock, { once: false });
        document.addEventListener('touchstart', unlock, { once: false });
        document.addEventListener('keydown', unlock, { once: false });

        console.log(`🔊 SpeechPlayer initialized (per-robot) — audio device: ${this._deviceAvailable}`);
    }

    /* ------------------------------------------------------------------ */
    /*  Public API                                                         */
    /* ------------------------------------------------------------------ */

    /**
     * Play speech audio for a specific robot.
     * If the same robot is already speaking, the old audio is stopped first.
     * Different robots play concurrently.
     *
     * @param {string} robotId  Robot identifier (e.g. "robot_1").
     * @param {string} url      Presigned S3 URL for the audio file.
     * @param {string} [text]   Optional display text (for logging / UI).
     */
    play(robotId, url, text) {
        if (!url) {
            console.warn('🔊 SpeechPlayer.play() called with empty URL');
            return;
        }

        if (!this._deviceAvailable) {
            console.warn('🔊 No audio output device detected — speech will not play');
            this._showNotification('No audio device found', 'warning');
            return;
        }

        // Stop any current speech for THIS robot only
        this.stop(robotId);

        console.log(`🔊 [${robotId}] Playing: "${text || '(no text)'}" — ${url.substring(0, 80)}…`);

        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.preload = 'auto';
        audio.volume = 1.0;

        // Clean up when finished
        audio.addEventListener('ended', () => {
            console.log(`🔊 [${robotId}] Speech finished`);
            this._removeChannel(robotId);
        });

        audio.addEventListener('error', (e) => {
            console.error(`🔊 [${robotId}] Speech error:`, e);
            this._showNotification(`Speech failed for ${robotId}`, 'error');
            this._removeChannel(robotId);
        });

        this._channels.set(robotId, audio);
        audio.src = url;

        audio.play().then(() => {
            console.log(`🔊 [${robotId}] Playback started`);
            if (text) {
                this._showNotification(`🗣️ ${robotId}: "${text}"`, 'info');
            }
        }).catch((err) => {
            console.warn(`🔊 [${robotId}] Autoplay blocked:`, err.message);
            const retryPlay = () => {
                if (this._channels.get(robotId) === audio) {
                    audio.play().catch(() => { });
                }
                document.removeEventListener('click', retryPlay);
            };
            document.addEventListener('click', retryPlay, { once: true });
            this._showNotification('Click anywhere to enable speech audio', 'warning');
        });
    }

    /**
     * Stop speech for a specific robot.
     * @param {string} robotId
     */
    stop(robotId) {
        const audio = this._channels.get(robotId);
        if (audio) {
            try {
                audio.pause();
                audio.currentTime = 0;
                audio.src = '';
            } catch (_) { /* ignore */ }
            this._channels.delete(robotId);
        }
    }

    /**
     * Stop all robots' speech.
     */
    stopAll() {
        for (const robotId of [...this._channels.keys()]) {
            this.stop(robotId);
        }
    }

    /**
     * Check if a specific robot is currently speaking.
     * @param {string} robotId
     * @returns {boolean}
     */
    isPlaying(robotId) {
        const audio = this._channels.get(robotId);
        return audio !== undefined && !audio.paused && !audio.ended;
    }

    /**
     * @returns {string[]} List of robot IDs currently speaking.
     */
    get activeSpeakers() {
        return [...this._channels.keys()].filter(id => this.isPlaying(id));
    }

    /* ------------------------------------------------------------------ */
    /*  Internal helpers                                                    */
    /* ------------------------------------------------------------------ */

    /** @param {string} robotId */
    _removeChannel(robotId) {
        const audio = this._channels.get(robotId);
        if (audio) {
            audio.src = '';
            this._channels.delete(robotId);
        }
    }

    _checkAudioDevice() {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                const hasOutput = devices.some((d) => d.kind === 'audiooutput');
                if (!hasOutput) {
                    console.warn('🔊 No audio output device detected');
                    this._deviceAvailable = false;
                }
            }).catch(() => { });
        }
        return typeof Audio !== 'undefined';
    }

    _showNotification(message, type) {
        if (window.simulator && typeof window.simulator.showNotification === 'function') {
            window.simulator.showNotification(message, type);
        }
    }
}

// Export singleton instance
window.speechPlayer = new SpeechPlayer();
