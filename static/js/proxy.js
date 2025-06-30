class ActionEventsProxy {
    constructor() {
        this.socket = null;
        this.sessionKey = window.sessionKey; // Will be set from HTML
        this.events = [];
        this.startTime = new Date();
        this.autoScroll = true;
        this.currentFilter = 'all';
        this.stats = {
            total: 0,
            actions: 0,
            errors: 0
        };

        this.init();
    }

    init() {
        console.log('🚀 Initializing Action Events Proxy...');
        this.setupEventFilters();
        this.startUptimeCounter();
        this.connectToSession();
    }

    connectToSession() {
        console.log(`🔌 Connecting to session: ${this.sessionKey}`);

        // Initialize Socket.IO connection
        this.socket = io();

        this.socket.on('connect', () => {
            console.log('✅ Connected to WebSocket server');
            this.updateConnectionStatus(true);

            // Join the session to receive events
            this.socket.emit('join_session', {
                session_key: this.sessionKey
            });
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from WebSocket server');
            this.updateConnectionStatus(false);
        });

        this.socket.on('error', (data) => {
            console.error('❌ WebSocket error:', data);
            this.addEvent('error', data);
        });

        // Subscribe to all possible events
        this.subscribeToEvents();
    }

    subscribeToEvents() {
        const eventTypes = [
            'robot_action',
            'action_result',
            'robot_states',
            'actions',
            'reset_session',
            'reset_result',
            'change_video_source',
            'video_source_changed',
            'video_source_change_result',
            'control_video',
            'video_control',
            'video_control_result',
            'join_session',
            'get_robot_states'
        ];

        eventTypes.forEach(eventType => {
            this.socket.on(eventType, (data) => {
                console.log(`📡 Received ${eventType}:`, data);
                this.addEvent(eventType, data);
            });
        });

        console.log(`✅ Subscribed to ${eventTypes.length} event types`);
    }

    addEvent(type, data) {
        const timestamp = new Date();
        const event = {
            id: Date.now() + Math.random(),
            type: type,
            data: data,
            timestamp: timestamp,
            timeString: timestamp.toLocaleTimeString()
        };

        this.events.unshift(event); // Add to beginning for newest first
        this.updateStats(type);
        this.renderEvent(event);
        this.updateEventsCount();

        // Limit events to prevent memory issues
        if (this.events.length > 1000) {
            this.events = this.events.slice(0, 1000);
        }
    }

    renderEvent(event) {
        const eventsList = document.getElementById('events-list');
        const eventElement = this.createEventElement(event);

        // Check if event matches current filter
        if (this.shouldShowEvent(event)) {
            eventsList.insertBefore(eventElement, eventsList.firstChild);

            if (this.autoScroll) {
                eventElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    createEventElement(event) {
        const div = document.createElement('div');
        div.className = `event-item ${this.getEventClass(event.type)}`;
        div.setAttribute('data-filter', event.type);

        div.innerHTML = `
            <div class="event-header">
                <span class="event-type">${event.type}</span>
                <span class="event-time">${event.timeString}</span>
            </div>
            <div class="event-data">${JSON.stringify(event.data, null, 2)}</div>
        `;

        return div;
    }

    getEventClass(eventType) {
        if (eventType.includes('error')) return 'error';
        if (eventType.includes('warning')) return 'warning';
        return '';
    }

    shouldShowEvent(event) {
        if (this.currentFilter === 'all') return true;

        switch (this.currentFilter) {
            case 'robot_action':
                return event.type === 'robot_action' || event.type === 'actions';
            case 'action_result':
                return event.type === 'action_result';
            case 'robot_states':
                return event.type === 'robot_states';
            case 'error':
                return event.type.includes('error');
            case 'video':
                return event.type.includes('video');
            default:
                return event.type === this.currentFilter;
        }
    }

    updateStats(eventType) {
        this.stats.total++;

        if (eventType === 'robot_action' || eventType === 'actions') {
            this.stats.actions++;
        }

        if (eventType.includes('error')) {
            this.stats.errors++;
        }

        document.getElementById('total-events').textContent = this.stats.total;
        document.getElementById('action-events').textContent = this.stats.actions;
        document.getElementById('error-events').textContent = this.stats.errors;
    }

    updateEventsCount() {
        const visibleEvents = document.querySelectorAll('.event-item:not([style*="display: none"])').length;
        document.getElementById('events-count').textContent = `${visibleEvents} events`;
    }

    updateConnectionStatus(connected) {
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('connection-status');

        if (connected) {
            statusDot.className = 'status-dot connected';
            statusText.textContent = 'Connected';
        } else {
            statusDot.className = 'status-dot disconnected';
            statusText.textContent = 'Disconnected';
        }
    }

    setupEventFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                this.currentFilter = e.target.getAttribute('data-filter');
                this.filterEvents();
            });
        });
    }

    filterEvents() {
        const eventItems = document.querySelectorAll('.event-item');

        eventItems.forEach(item => {
            const eventType = item.getAttribute('data-filter');
            const shouldShow = this.currentFilter === 'all' || this.shouldShowEventByType(eventType);

            item.style.display = shouldShow ? 'block' : 'none';
        });

        this.updateEventsCount();
    }

    shouldShowEventByType(eventType) {
        switch (this.currentFilter) {
            case 'robot_action':
                return eventType === 'robot_action' || eventType === 'actions';
            case 'action_result':
                return eventType === 'action_result';
            case 'robot_states':
                return eventType === 'robot_states';
            case 'error':
                return eventType.includes('error');
            case 'video':
                return eventType.includes('video');
            default:
                return eventType === this.currentFilter;
        }
    }

    startUptimeCounter() {
        setInterval(() => {
            const uptime = new Date() - this.startTime;
            const hours = Math.floor(uptime / 3600000);
            const minutes = Math.floor((uptime % 3600000) / 60000);
            const seconds = Math.floor((uptime % 60000) / 1000);

            document.getElementById('uptime').textContent =
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            console.log('🔌 Manually disconnected from WebSocket server');
        }
    }

    clearEvents() {
        this.events = [];
        document.getElementById('events-list').innerHTML = '';
        this.stats = { total: 0, actions: 0, errors: 0 };
        this.updateStats('');
        this.updateEventsCount();
        console.log('🗑️ Events cleared');
    }

    exportEvents() {
        const data = JSON.stringify(this.events, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `robot-events-${this.sessionKey}-${new Date().toISOString().slice(0, 19)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📥 Events exported');
    }

    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        document.getElementById('autoscroll-text').textContent =
            `📜 Auto-scroll: ${this.autoScroll ? 'ON' : 'OFF'}`;
        console.log(`📜 Auto-scroll ${this.autoScroll ? 'enabled' : 'disabled'}`);
    }
}

// Global functions for button handlers
let proxy;

function connectToSession() {
    if (proxy) {
        proxy.connectToSession();
    }
}

function disconnect() {
    if (proxy) {
        proxy.disconnect();
    }
}

function clearEvents() {
    if (proxy) {
        proxy.clearEvents();
    }
}

function exportEvents() {
    if (proxy) {
        proxy.exportEvents();
    }
}

function toggleAutoScroll() {
    if (proxy) {
        proxy.toggleAutoScroll();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    proxy = new ActionEventsProxy();
});
