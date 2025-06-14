# Humanoid Robot Simulator

A production-ready 6-robot humanoid simulator with **3D web interface** and **44 realistic actions**.

[![GitHub](https://img.shields.io/badge/GitHub-wongcyrus-blue?logo=github)](https://github.com/wongcyrus/humanoid-robot-simulator)
[![Python](https://img.shields.io/badge/Python-3.8+-green?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.0+-red?logo=flask)](https://flask.palletsprojects.com)
[![Three.js](https://img.shields.io/badge/Three.js-r128-orange?logo=javascript)](https://threejs.org)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-purple?logo=websocket)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## 🎯 Overview

This implementation provides:
- **🌐 3D Web Interface**: Browser-based 3D visualization with Three.js and WebSocket
- **Exactly 6 humanoid robots**: `robot_1, robot_2, robot_3, robot_4, robot_5, robot_6`
- **👁️ Robot faces**: Clear eyes, nose, and direction indicators
- **🎭 44 realistic actions**: Complete library including 10 dance styles, combat moves, exercises
- **⏱️ Accurate timing**: Each action uses realistic duration (1-85 seconds)
- **'all' robot control**: Use `robot_id = "all"` to control all robots simultaneously
- **Real-time communication**: WebSocket for instant updates and control

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

### Installation

```bash
# Clone the repository
git clone https://github.com/wongcyrus/humanoid-robot-simulator.git
cd humanoid-robot-simulator

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Simulator

```bash
# Start the 3D web simulator
./run_web_simulator.sh

# Or run directly
python3 web_humanoid_simulator.py
```

Then open your browser to: **http://localhost:5000**

## 📁 Clean Project Structure

```
mock_robot_simulator/
├── web_humanoid_simulator.py     # Main 3D web application
├── requirements.txt              # Python dependencies
├── run_simulator.sh              # Linux launcher script
├── run_web_simulator.sh          # Web simulator launcher
├── README.md                     # This documentation
├── .gitignore                    # Git ignore rules
├── templates/
│   └── index.html                # Main web interface
├── static/
│   ├── css/
│   │   └── style.css             # Web interface styling
│   └── js/
│       ├── simulator.js          # Main simulator logic
│       ├── robot3d.js            # 3D robot visualization
│       └── robot_animations.js   # 44 action animations
└── venv/                         # Virtual environment
```

## 📡 API Usage

### Individual Robot Control
```bash
curl -X POST http://localhost:5000/run_action/robot_1 \
  -H 'Content-Type: application/json' \
  -d '{"method":"RunAction","action":"dance_two"}'
```

### All Robots Control
```bash
curl -X POST http://localhost:5000/run_action/all \
  -H 'Content-Type: application/json' \
  -d '{"method":"RunAction","action":"kung_fu"}'
```

### Status Monitoring
```bash
curl -X GET http://localhost:5000/api/status
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

## ✅ Features

- ✅ Clean, optimized codebase
- ✅ Production-ready web API
- ✅ Real-time 3D robot visualization
- ✅ 44 realistic actions with proper timing
- ✅ Individual and group robot control
- ✅ Robot faces with direction indicators
- ✅ Proper action directions (combat moves face forward)
- ✅ Realistic exercise sequences
- ✅ Position memory system
- ✅ Cross-platform compatibility
- ✅ Easy deployment and testing

Perfect for robotics education, entertainment, testing, and research!

## 🌐 Live Demo

Start the simulator and visit: **http://localhost:5000**

Experience 6 humanoid robots with faces, 44 realistic actions, and complete 3D control!
