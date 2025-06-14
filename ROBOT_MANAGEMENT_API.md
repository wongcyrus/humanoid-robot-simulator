# Robot Management API Documentation

## Overview

The Robot Management API allows you to dynamically add, remove, and manage robots in the Humanoid Robot Simulator. This extends the basic simulator functionality with full CRUD operations for robot management.

## Base URL

```
http://localhost:5000
```

## API Endpoints

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
    },
    ...
  }
}
```

### 2. Remove Robot

**DELETE** `/api/remove_robot/<robot_id>`

Removes a specific robot or all robots from the simulator.

**Parameters:**
- `robot_id`: Robot identifier (e.g., "robot_1") or "all" to remove all robots

**Examples:**

Remove specific robot:
```bash
curl -X DELETE http://localhost:5000/api/remove_robot/robot_1
```

Remove all robots:
```bash
curl -X DELETE http://localhost:5000/api/remove_robot/all
```

**Response (Single Robot):**
```json
{
  "success": true,
  "message": "Robot robot_1 removed successfully",
  "removed_robot": "robot_1",
  "remaining_robots": ["robot_2", "robot_3", "robot_4", "robot_5", "robot_6"]
}
```

**Response (All Robots):**
```json
{
  "success": true,
  "message": "All robots removed successfully",
  "removed_robots": ["robot_1", "robot_2", "robot_3", "robot_4", "robot_5", "robot_6"],
  "remaining_robots": []
}
```

### 3. Add Robot

**POST** `/api/add_robot/<robot_id>`

Adds a new robot to the simulator.

**Parameters:**
- `robot_id`: Unique identifier for the new robot

**Request Body:**
```json
{
  "position": [x, y, z],
  "color": "#RRGGBB"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/add_robot/robot_7 \
  -H 'Content-Type: application/json' \
  -d '{"position": [100, 0, 100], "color": "#FF5733"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Robot robot_7 added successfully",
  "robot_id": "robot_7",
  "position": [100, 0, 100],
  "color": "#FF5733",
  "all_robots": ["robot_1", "robot_2", "robot_3", "robot_4", "robot_5", "robot_6", "robot_7"]
}
```

## Error Responses

### Robot Not Found (404)
```json
{
  "success": false,
  "error": "Robot robot_nonexistent not found",
  "available_robots": ["robot_1", "robot_2", "robot_3"]
}
```

### Robot Already Exists (400)
```json
{
  "success": false,
  "error": "Robot robot_1 already exists",
  "existing_robots": ["robot_1", "robot_2", "robot_3"]
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to add robot: Internal server error"
}
```

## WebSocket Events

The API also broadcasts real-time events via WebSocket for live updates:

### Robot Removed
```javascript
socket.on('robot_removed', (data) => {
  console.log('Robot removed:', data.removed_robot);
  console.log('Remaining robots:', data.remaining_robots);
});
```

### All Robots Removed
```javascript
socket.on('robots_removed', (data) => {
  console.log('All robots removed:', data.removed_robots);
});
```

### Robot Added
```javascript
socket.on('robot_added', (data) => {
  console.log('Robot added:', data.robot_id);
  console.log('All robots:', data.all_robots);
});
```

## Web Interface Controls

The web interface includes robot management controls:

- **🗑️ Remove Robot**: Remove the currently selected robot
- **🗑️ Remove All**: Remove all robots (with confirmation)
- **➕ Add Robot**: Show form to add a new robot
- **🔄 Reset to 6**: Reset to the original 6 robots

## Python Example

```python
import requests
import json

BASE_URL = "http://localhost:5000"

# List robots
response = requests.get(f"{BASE_URL}/api/robots")
robots = response.json()
print(f"Found {robots['robot_count']} robots")

# Add a robot
new_robot = {
    "position": [75, 0, 75],
    "color": "#FF6B35"
}
response = requests.post(
    f"{BASE_URL}/api/add_robot/robot_test",
    headers={"Content-Type": "application/json"},
    data=json.dumps(new_robot)
)
print(f"Added robot: {response.json()['message']}")

# Remove a robot
response = requests.delete(f"{BASE_URL}/api/remove_robot/robot_test")
print(f"Removed robot: {response.json()['message']}")

# Remove all robots
response = requests.delete(f"{BASE_URL}/api/remove_robot/all")
print(f"Removed all: {response.json()['message']}")
```

## JavaScript Example

```javascript
// Add robot
async function addRobot(robotId, position, color) {
    const response = await fetch(`/api/add_robot/${robotId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            position: position,
            color: color
        })
    });
    
    const result = await response.json();
    console.log('Robot added:', result);
}

// Remove robot
async function removeRobot(robotId) {
    const response = await fetch(`/api/remove_robot/${robotId}`, {
        method: 'DELETE'
    });
    
    const result = await response.json();
    console.log('Robot removed:', result);
}

// List robots
async function listRobots() {
    const response = await fetch('/api/robots');
    const result = await response.json();
    console.log(`Found ${result.robot_count} robots:`, result.robots);
}
```

## Testing

Run the included test script to verify all functionality:

```bash
python test_robot_management.py
```

This will test:
- ✅ Listing robots
- ✅ Adding robots
- ✅ Removing robots
- ✅ Error handling
- ✅ Duplicate prevention
- ✅ Bulk operations

## Features

- **Dynamic Robot Management**: Add/remove robots without restarting
- **Real-time Updates**: WebSocket broadcasts keep all clients synchronized
- **Error Handling**: Comprehensive error responses and validation
- **Web Interface**: User-friendly controls for robot management
- **Position Control**: Specify exact 3D positions for new robots
- **Color Customization**: Set custom colors for each robot
- **Bulk Operations**: Remove all robots at once
- **Reset Functionality**: Restore original 6-robot configuration

## Use Cases

1. **Dynamic Testing**: Add robots for specific test scenarios
2. **Performance Testing**: Scale robot count up/down
3. **Custom Configurations**: Create specific robot arrangements
4. **Interactive Demos**: Add/remove robots during presentations
5. **Development**: Test with different robot counts
6. **Cleanup**: Remove all robots to start fresh

The Robot Management API provides complete control over the robot population in your simulator, enabling dynamic and flexible robot management for any use case.
