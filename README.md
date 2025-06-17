# Humanoid Robot Simulator

A production-ready 6-robot humanoid simulator with **3D web interface**, **44 realistic actions**, and **comprehensive management APIs**.

[![Python](https://img.shields.io/badge/Python-3.8+-green?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.0+-red?logo=flask)](https://flask.palletsprojects.com)
[![Three.js](https://img.shields.io/badge/Three.js-r128-orange?logo=javascript)](https://threejs.org)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-purple?logo=websocket)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com)

## 🎯 Overview

This comprehensive robot simulator provides:

### 🌐 **Core Features**
- **3D Web Interface**: Browser-based 3D visualization with Three.js and WebSocket
- **6 Humanoid Robots**: `robot_1` through `robot_6` with facial features and direction indicators
- **44 Realistic Actions**: Complete action library with dance, combat, exercise, and movement
- **Accurate Timing**: Each action uses realistic duration (1-85 seconds)
- **Group Control**: Use `robot_id = "all"` to control all robots simultaneously
- **Real-time Communication**: WebSocket for instant updates and control

### 🔧 **Advanced Features**
- **Robot Management API**: Add, remove, and manage robots dynamically
- **Video Management**: Dynamic video source changing and playback control
- **Session Management**: Multi-user session support
- **Docker Support**: Containerized deployment
- **Comprehensive Testing**: Extensive test suite with multiple scenarios

## ✨ Key Features

### 🎮 **Complete Action Library (44 Actions)**
- **💃 Dance Collection**: 10 unique dance styles (52-85 seconds each)
- **🥋 Combat Arsenal**: Kung Fu, Wing Chun, kicks, punches, uppercuts
- **💪 Exercise Suite**: Push-ups, sit-ups, squats, weightlifting, chest exercises
- **🚶 Enhanced Movement**: Forward, backward, turns, fast movements
- **🎭 Basic Actions**: Wave, bow, jump, celebrate, think, standing poses

### 👁️ **Visual Enhancements**
- **Robot Faces**: Clear eyes, nose, and direction arrows
- **Proper Directions**: All combat actions face forward correctly
- **Realistic Exercises**: Push-ups end standing, sit-ups end sitting
- **Position Memory**: Robots remember location after non-movement actions

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mock_robot_simulator

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Simulator

```bash
# Start the 3D web simulator
./run_web_simulator.sh

# Or run directly
python3 app.py
```

Then open your browser to: **http://localhost:5000**

### Docker Deployment

```bash
# Using Docker Compose (Recommended)
docker-compose up -d

# Or build and run manually
docker build -t robot-simulator .
docker run -p 5000:5000 robot-simulator
```

## 📁 Project Structure

```
mock_robot_simulator/
├── app.py                        # Main Flask application
├── requirements.txt              # Python dependencies
├── docker-compose.yml           # Docker Compose configuration
├── Dockerfile                    # Docker container setup
├── run_web_simulator.sh          # Web simulator launcher
├── constants.py                  # Application constants
├── docs/                         # Comprehensive documentation
│   ├── README.md                 # Documentation index
│   ├── API_REFERENCE.md          # Complete API documentation
│   └── DEPLOYMENT.md             # Deployment guide
├── models/
│   └── robot.py                  # Robot data models
├── routes/
│   └── api_routes.py             # API route definitions
├── handlers/
│   └── websocket_handlers.py     # WebSocket event handlers
├── server/
│   ├── websocket_server.py       # WebSocket server
│   └── session_manager.py        # Session management
├── templates/
│   └── index.html                # Main web interface
├── static/
│   ├── css/style.css             # Web interface styling
│   ├── js/
│   │   ├── simulator.js          # Main simulator logic
│   │   ├── robot3d.js            # 3D robot visualization
│   │   └── robot_animations.js   # 44 action animations
│   ├── img/                      # Images and logos
│   └── video/                    # Video files
└── test_commands/                # Comprehensive test suite
    ├── README.md                 # Test documentation
    ├── basic_actions.sh          # Basic action tests
    ├── movement_actions.sh       # Movement tests
    ├── dance_actions.sh          # Dance animation tests
    ├── combat_exercise.sh        # Combat and exercise tests
    ├── robot_management.sh       # Robot management tests
    ├── complex_scenarios.sh      # Complex scenario tests
    └── error_testing.sh          # Error handling tests
```

## 📡 API Documentation

### Basic Robot Control

#### Individual Robot Control
```bash
curl -X POST http://localhost:5000/run_action/robot_1?session_key=YOUR_SESSION_ID \
  -H 'Content-Type: application/json' \
  -d '{"method":"RunAction","action":"dance_two"}'
```

#### All Robots Control
```bash
curl -X POST http://localhost:5000/run_action/all?session_key=YOUR_SESSION_ID \
  -H 'Content-Type: application/json' \
  -d '{"method":"RunAction","action":"kung_fu"}'
```

#### Status Monitoring
```bash
curl -X GET http://localhost:5000/api/status
```

### Robot Management API

#### List All Robots
```bash
GET /api/robots
```

#### Remove Robot
```bash
DELETE /api/remove_robot/robot_1    # Remove specific robot
DELETE /api/remove_robot/all        # Remove all robots
```

#### Add Robot
```bash
POST /api/add_robot
Content-Type: application/json

{
    "robot_id": "robot_7",
    "position": [10, 0, 10],
    "color": "#FF5733"
}
```

### Video Management API

#### Change Video Source
```bash
POST /api/video/change_source?session_key=YOUR_SESSION_KEY
Content-Type: application/json

{
    "video_src": "/static/video/new-video.mp4"
}
```

#### Control Video Playback
```bash
POST /api/video/control?session_key=YOUR_SESSION_KEY
Content-Type: application/json

{
    "action": "play"  # "play", "pause", or "toggle"
}
```

## 🤖 Robot IDs

- `robot_1` through `robot_6` - Individual robots
- `all` - Special ID to control all robots simultaneously

## 🎭 Available Actions (44 Total)

### 💃 Dance Collection (10 actions)
`dance`, `dance_two`, `dance_three`, `dance_four`, `dance_five`, `dance_six`, `dance_seven`, `dance_eight`, `dance_nine`, `dance_ten`

### 🥋 Combat Moves (10 actions)
`kung_fu`, `wing_chun`, `kick`, `punch`, `right_kick`, `left_kick`, `right_uppercut`, `left_uppercut`, `right_shot_fast`, `left_shot_fast`

### 💪 Exercise & Fitness (7 actions)
`push_ups`, `sit_ups`, `squat`, `squat_up`, `weightlifting`, `chest`, `jumping_jacks`

### 🚶 Movement (9 actions)
`go_forward`, `go_backward`, `turn_left`, `turn_right`, `right_move_fast`, `left_move_fast`, `back_fast`, `stepping`, `twist`

### 🎯 Basic & Special (8 actions)
`wave`, `bow`, `jump`, `celebrate`, `think`, `stand_up_back`, `stand_up_front`, `idle`

## 🎮 Web Interface Controls

- **👁️ Robot Faces**: Each robot has clear directional indicators
- **🖱️ Mouse Drag**: Rotate camera around robots
- **🖱️ Mouse Wheel**: Zoom in/out
- **🟢 Green Buttons**: Movement actions (actually move robots)
- **🔵 Blue Buttons**: Animation actions (visual effects only)
- **🎯 Robot Selection**: Choose individual robots or "all"
- **⏱️ Realistic Timing**: Each action uses proper duration
- **🎬 Video Controls**: Change video sources and control playback
- **🤖 Robot Management**: Add/remove robots dynamically

## ⏱️ Action Timing System

The simulator processes actions sequentially with realistic timing:

### Dance Actions (Long Duration)
- `dance_two` - `dance_ten`: 52-85 seconds each

### Movement Actions
- `go_forward`, `go_backward`: 3-4 seconds
- `turn_left`, `turn_right`: 4 seconds
- `stepping`: 3 seconds
- `twist`: 4 seconds

### Combat Actions
- `kung_fu`, `wing_chun`: 2 seconds
- `kick`, `punch`, `uppercut`: 2 seconds
- `shot_fast`: 4 seconds

### Exercise Actions
- `push_ups`: 9 seconds
- `sit_ups`: 12 seconds
- `squat`: 1-6 seconds
- `weightlifting`: 9 seconds

### Basic Actions
- `wave`, `bow`, `jump`: 2-4 seconds
- `celebrate`, `think`: 3-4 seconds

## 🧪 Testing

The project includes comprehensive testing tools in the `test_commands/` directory:

```bash
# Make scripts executable
chmod +x test_commands/*.sh

# Run different test categories
./test_commands/basic_actions.sh      # Basic robot actions
./test_commands/movement_actions.sh   # Movement commands
./test_commands/dance_actions.sh      # Dance animations
./test_commands/combat_exercise.sh    # Combat moves and exercises
./test_commands/robot_management.sh   # Add/remove robots
./test_commands/complex_scenarios.sh  # Sequential scenarios
./test_commands/error_testing.sh      # Error handling
```

## 🐳 Docker Support

### Quick Start with Docker Compose
```bash
docker-compose up -d
```

### Manual Docker Commands
```bash
# Build image
docker build -t robot-simulator .

# Run container
docker run -p 5000:5000 robot-simulator

# View logs
docker logs <container_id>

# Stop container
docker stop <container_id>
```

### Environment Variables
- `FLASK_ENV`: Set to `production` for production deployment
- `PYTHONPATH`: Set to `/app` (default in Dockerfile)

## ✅ Features

- ✅ **Clean, optimized codebase** - Well-structured and maintainable
- ✅ **Production-ready web API** - Comprehensive REST API with error handling
- ✅ **Real-time 3D robot visualization** - WebSocket-powered live updates
- ✅ **44 realistic actions with proper timing** - Complete action library
- ✅ **Individual and group robot control** - Flexible robot management
- ✅ **Robot faces with direction indicators** - Enhanced visual feedback
- ✅ **Dynamic robot management** - Add/remove robots on-the-fly
- ✅ **Video management system** - Dynamic video source control
- ✅ **Session-based architecture** - Multi-user support
- ✅ **Docker containerization** - Easy deployment and scaling
- ✅ **Comprehensive test suite** - Extensive testing tools
- ✅ **Cross-platform compatibility** - Works on Linux, Windows, macOS
- ✅ **Detailed documentation** - Complete API and usage documentation

Perfect for robotics education, entertainment, testing, research, and demonstration purposes!

## 🌐 Live Demo

1. Start the simulator:
   ```bash
   ./run_web_simulator.sh
   ```

2. Visit: **http://localhost:5000**

3. Experience 6 humanoid robots with faces, 44 realistic actions, video management, and complete 3D control!

## 🔧 Development

### Documentation
Complete documentation is available in the `docs/` directory:
- **[API Reference](docs/API_REFERENCE.md)** - Detailed API documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Comprehensive deployment instructions

### Project Architecture
- **Flask Backend**: REST API and WebSocket server
- **Three.js Frontend**: 3D visualization and animations
- **WebSocket Communication**: Real-time bidirectional updates
- **Session Management**: Multi-user session handling
- **Modular Design**: Separated concerns for maintainability

### Key Components
- `app.py`: Main Flask application entry point
- `models/robot.py`: Robot data models and state management
- `routes/api_routes.py`: REST API endpoint definitions
- `handlers/websocket_handlers.py`: WebSocket event processing
- `server/websocket_server.py`: WebSocket server implementation
- `static/js/robot3d.js`: 3D scene and robot visualization
- `static/js/simulator.js`: Main frontend application logic

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
