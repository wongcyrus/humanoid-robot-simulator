# Humanoid Robot Simulator

A production-ready 6-robot humanoid simulator with **3D web interface** and desktop visualization options.

[![GitHub](https://img.shields.io/badge/GitHub-wongcyrus-blue?logo=github)](https://github.com/wongcyrus/humanoid-robot-simulator)
[![Python](https://img.shields.io/badge/Python-3.8+-green?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.0+-red?logo=flask)](https://flask.palletsprojects.com)
[![Three.js](https://img.shields.io/badge/Three.js-r128-orange?logo=javascript)](https://threejs.org)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-purple?logo=websocket)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## 🎯 Overview

This implementation provides:
- **🌐 3D Web Interface**: Browser-based 3D visualization with Three.js and WebSocket
- **🖥️ Desktop Version**: Pygame-based local simulator
- **Exactly 6 humanoid robots**: `robot_1, robot_2, robot_3, robot_4, robot_5, robot_6`
- **Realistic 3D humanoid models**: Head, body, arms, legs with action-based animations
- **'all' robot control**: Use `robot_id = "all"` to control all robots simultaneously
- **28 humanoid actions**: Complete set of realistic movements with visual animations
- **Real-time communication**: WebSocket for instant updates and control

## 🌐 3D Web Interface (NEW!)

### Features
- **🎮 Interactive 3D Environment**: Full 3D humanoid robots with realistic animations
- **🖱️ Camera Controls**: Mouse to rotate, scroll to zoom, keyboard shortcuts
- **⚡ Real-time Updates**: WebSocket communication for instant robot control
- **🎨 Modern UI**: Responsive web interface with action buttons and status panels
- **🎯 28 Actions**: Including new actions like dance, jump, and enhanced martial arts
- **📱 Cross-platform**: Works in any modern web browser

### Quick Start - 3D Web Version
```bash
# Linux/macOS
./run_web_simulator.sh

# Windows PowerShell
.\run_web_simulator.ps1

# Direct Python
python3 web_humanoid_simulator.py
```

Then open your browser to: **http://localhost:5000**

## 🖥️ Desktop Version

### Features
- **🎮 Pygame Visualization**: Local 2D humanoid representation
- **🔧 Direct Control**: No browser required
- **📊 Real-time Status**: Live robot state monitoring
- **🎯 26 Actions**: Complete humanoid action set

## 💻 Platform Support

### Windows
- **PowerShell Script**: `run_simulator.ps1` (recommended)
- **Batch File**: `run_simulator.bat` (alternative)
- **Test Script**: `test_humanoid_robots.ps1`
- **Requirements**: Python 3.8+, Windows 7+

### Linux/macOS
- **Bash Script**: `run_simulator.sh`
- **Test Script**: `test_humanoid_robots.py`
- **Requirements**: Python 3.8+

### Cross-Platform
- **Direct Python**: `python humanoid_robot_simulator.py`
- **Works on**: Windows, Linux, macOS, any Python-supported platform

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/wongcyrus/humanoid-robot-simulator.git
cd humanoid-robot-simulator

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Simulator

#### Linux/macOS
```bash
# Start the simulator
./run_simulator.sh

# Or run directly
python3 humanoid_robot_simulator.py

# Test the API
python3 test_humanoid_robots.py
```

#### Windows
```powershell
# PowerShell (Recommended)
.\run_simulator.ps1

# Or Command Prompt
run_simulator.bat

# Test the API
.\test_humanoid_robots.ps1
```

#### Direct Python (All Platforms)
```bash
# Install dependencies
pip install -r requirements.txt

# Run simulator
python humanoid_robot_simulator.py [port]
```

## 📁 Project Structure

```
mock_robot_simulator/
├── clean_6_robot_simulator.py    # Main simulator (single file)
├── test_clean_6_robots.py        # Test script
├── run_clean.sh                  # Launch script
├── requirements.txt              # Dependencies
├── CLEAN_6_ROBOT_README.md       # Detailed documentation
├── README.md                     # This file
└── venv/                         # Virtual environment
```

## 📡 API Usage

### Individual Robot Control
```bash
curl -X POST http://localhost:5000/run_action/robot_1 \
  -H 'Content-Type: application/json' \
  -d '{"method":"RunAction","action":"wave"}'
```

### All Robots Control
```bash
curl -X POST http://localhost:5000/run_action/all \
  -H 'Content-Type: application/json' \
  -d '{"method":"RunAction","action":"bow"}'
```

### Status Monitoring
```bash
curl -X GET http://localhost:5000/status/all
```

## 🤖 Robot IDs

- `robot_1` through `robot_6` - Individual robots
- `all` - Special ID to control all robots simultaneously

## 🎭 Available Actions

Movement, combat, exercise, social, and recovery actions including:
`wave`, `bow`, `kick`, `kung_fu`, `go_forward`, `turn_left`, `push_ups`, etc.

## 📚 Documentation

See `CLEAN_6_ROBOT_README.md` for complete documentation with examples and API reference.

## ✅ Features

- ✅ Clean, single-file implementation
- ✅ Production-ready web API
- ✅ Real-time robot visualization
- ✅ Individual and group robot control
- ✅ 26 humanoid actions
- ✅ Minimal dependencies
- ✅ Easy deployment and testing

Perfect for robotics education, entertainment, testing, and research!
