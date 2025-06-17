# Robot Management API Reference

## Overview

The Robot Management API allows you to dynamically add, remove, and manage robots in the Humanoid Robot Simulator. This extends the basic simulator functionality with full CRUD operations for robot management.

## Base URL

```
http://localhost:5000
```

## Authentication

All API endpoints require a session key parameter:
```
?session_key=YOUR_SESSION_KEY
```

## Robot Control API

### 1. Run Action on Robot

**POST** `/run_action/<robot_id>?session_key=SESSION_KEY`

Execute an action on a specific robot or all robots.

**Parameters:**
- `robot_id`: Robot identifier (`robot_1` through `robot_6`) or `all`
- `session_key`: Your session identifier

**Request Body:**
```json
{
    "method": "RunAction",
    "action": "dance_two"
}
```

**Response:**
```json
{
    "success": true,
    "robot_id": "robot_1",
    "action": "dance_two",
    "duration": 52,
    "message": "Action started successfully"
}
```

### 2. Get System Status

**GET** `/api/status`

Returns the current status of the simulator.

**Response:**
```json
{
    "success": true,
    "robot_count": 6,
    "active_sessions": 2,
    "server_status": "running",
    "uptime": "2h 15m 30s"
}
```

## Robot Management API

### 1. List All Robots

**GET** `/api/robots`

Returns a list of all robots currently in the simulator.

**Response:**
```json
{
    "success": true,
    "robot_count": 6,
    "robots": {
        "robot_1": {
            "position": [-50, 0, -50],
            "rotation": [0, 0, 0],
            "color": "#4A90E2",
            "is_animating": false,
            "current_action": "idle"
        }
    }
}
```

### 2. Add Robot

**POST** `/api/add_robot`

Add a new robot to the simulator.

**Request Body:**
```json
{
    "robot_id": "robot_7",
    "position": [10, 0, 10],
    "rotation": [0, 0, 0],
    "color": "#FF5733"
}
```

**Response:**
```json
{
    "success": true,
    "robot_id": "robot_7",
    "message": "Robot robot_7 added successfully",
    "robot_data": {
        "position": [10, 0, 10],
        "rotation": [0, 0, 0],
        "color": "#FF5733"
    }
}
```

### 3. Remove Robot

**DELETE** `/api/remove_robot/<robot_id>`

Remove a specific robot or all robots from the simulator.

**Parameters:**
- `robot_id`: Robot identifier or `all` to remove all robots

**Examples:**

Remove specific robot:
```bash
curl -X DELETE http://localhost:5000/api/remove_robot/robot_1
```

Remove all robots:
```bash
curl -X DELETE http://localhost:5000/api/remove_robot/all
```

**Response:**
```json
{
    "success": true,
    "message": "Robot robot_1 removed successfully",
    "remaining_robots": 5
}
```

## Video Management API

### 1. Change Video Source

**POST** `/api/video/change_source?session_key=SESSION_KEY`

Change the video source displayed in the 3D scene.

**Request Body:**
```json
{
    "video_src": "/static/video/new-video.mp4"
}
```

**Response:**
```json
{
    "success": true,
    "video_src": "/static/video/new-video.mp4",
    "session_key": "YOUR_SESSION_KEY",
    "message": "Video source changed successfully"
}
```

### 2. Control Video Playback

**POST** `/api/video/control?session_key=SESSION_KEY`

Control video playback (play, pause, toggle).

**Request Body:**
```json
{
    "action": "play"
}
```

**Valid actions:** `play`, `pause`, `toggle`

**Response:**
```json
{
    "success": true,
    "action": "play",
    "session_key": "YOUR_SESSION_KEY",
    "message": "Video playback control executed successfully"
}
```

### 3. Get Video Status

**GET** `/api/video/status?session_key=SESSION_KEY`

Get current video status and available video options.

**Response:**
```json
{
    "success": true,
    "current_video": "/static/video/prog-video-01.mp4",
    "is_playing": true,
    "available_videos": [
        "/static/video/prog-video-01.mp4",
        "/static/video/ReawakeR.mp4"
    ],
    "session_key": "YOUR_SESSION_KEY"
}
```

## WebSocket Events

The simulator supports real-time communication via WebSocket connections.

### Connection
```javascript
const ws = new WebSocket('ws://localhost:5000');
```

### Incoming Events

#### robot_action_started
```json
{
    "event": "robot_action_started",
    "data": {
        "robot_id": "robot_1",
        "action": "dance_two",
        "duration": 52
    }
}
```

#### robot_action_completed
```json
{
    "event": "robot_action_completed",
    "data": {
        "robot_id": "robot_1",
        "action": "dance_two"
    }
}
```

#### video_source_changed
```json
{
    "event": "video_source_changed",
    "data": {
        "video_src": "/static/video/new-video.mp4",
        "session_key": "YOUR_SESSION_KEY"
    }
}
```

#### robot_added
```json
{
    "event": "robot_added",
    "data": {
        "robot_id": "robot_7",
        "position": [10, 0, 10],
        "color": "#FF5733"
    }
}
```

#### robot_removed
```json
{
    "event": "robot_removed",
    "data": {
        "robot_id": "robot_1"
    }
}
```

### Outgoing Events

#### run_action
```json
{
    "event": "run_action",
    "data": {
        "robot_id": "robot_1",
        "action": "dance_two",
        "session_key": "YOUR_SESSION_KEY"
    }
}
```

#### change_video_source
```json
{
    "event": "change_video_source",
    "data": {
        "video_src": "/static/video/new-video.mp4",
        "session_key": "YOUR_SESSION_KEY"
    }
}
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
    "success": false,
    "error": "Robot not found",
    "error_code": "ROBOT_NOT_FOUND",
    "message": "Robot robot_10 does not exist"
}
```

### Common Error Codes

- `ROBOT_NOT_FOUND`: Specified robot ID doesn't exist
- `INVALID_ACTION`: Action name is not recognized
- `SESSION_NOT_FOUND`: Session key is invalid
- `INVALID_PARAMETERS`: Request parameters are malformed
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Robot actions**: 1 request per second per robot
- **Video controls**: 5 requests per minute per session
- **Robot management**: 10 requests per minute per session

## Available Actions

### Dance Actions (10 actions)
`dance`, `dance_two`, `dance_three`, `dance_four`, `dance_five`, `dance_six`, `dance_seven`, `dance_eight`, `dance_nine`, `dance_ten`

### Combat Moves (10 actions)
`kung_fu`, `wing_chun`, `kick`, `punch`, `right_kick`, `left_kick`, `right_uppercut`, `left_uppercut`, `right_shot_fast`, `left_shot_fast`

### Exercise & Fitness (7 actions)
`push_ups`, `sit_ups`, `squat`, `squat_up`, `weightlifting`, `chest`, `jumping_jacks`

### Movement (9 actions)
`go_forward`, `go_backward`, `turn_left`, `turn_right`, `right_move_fast`, `left_move_fast`, `back_fast`, `stepping`, `twist`

### Basic & Special (8 actions)
`wave`, `bow`, `jump`, `celebrate`, `think`, `stand_up_back`, `stand_up_front`, `idle`

## Example Usage

### Python Example
```python
import requests
import json

base_url = "http://localhost:5000"
session_key = "your_session_key"

# Run action on robot
response = requests.post(
    f"{base_url}/run_action/robot_1?session_key={session_key}",
    json={"method": "RunAction", "action": "dance_two"}
)
print(response.json())

# Add new robot
response = requests.post(
    f"{base_url}/api/add_robot",
    json={
        "robot_id": "robot_7",
        "position": [20, 0, 20],
        "color": "#00FF00"
    }
)
print(response.json())
```

### JavaScript Example
```javascript
// Change video source
fetch('/api/video/change_source?session_key=your_session_key', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        video_src: '/static/video/new-video.mp4'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

### cURL Examples
```bash
# Run action on all robots
curl -X POST "http://localhost:5000/run_action/all?session_key=test_session" \
  -H "Content-Type: application/json" \
  -d '{"method":"RunAction","action":"kung_fu"}'

# List all robots
curl -X GET "http://localhost:5000/api/robots"

# Remove robot
curl -X DELETE "http://localhost:5000/api/remove_robot/robot_1"

# Change video source
curl -X POST "http://localhost:5000/api/video/change_source?session_key=test_session" \
  -H "Content-Type: application/json" \
  -d '{"video_src":"/static/video/ReawakeR.mp4"}'
```
