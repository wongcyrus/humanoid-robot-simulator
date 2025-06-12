# Humanoid Robot Simulator

A production-ready 6-robot humanoid simulator with realistic humanoid visualization and web API control.

## 🎯 Overview

This implementation provides:
- **Exactly 6 humanoid robots**: `robot_1, robot_2, robot_3, robot_4, robot_5, robot_6`
- **Realistic humanoid appearance**: Head, body, arms, legs with action-based poses
- **'all' robot control**: Use `robot_id = "all"` to control all robots simultaneously
- **26 humanoid actions**: Complete set of realistic movements with visual animations
- **Web API**: REST API for remote control
- **Real-time visualization**: Pygame-based simulation with proper humanoid figures

## 🤖 Humanoid Features

### Visual Representation
- **Head**: With eyes and directional indicator
- **Body**: Rectangular torso with color coding
- **Arms**: Animated based on actions (waving, kung fu, etc.)
- **Legs**: Dynamic positioning for kicks, movement
- **Shadows**: Ground shadows for depth
- **Action Poses**: Different poses for each action type

### Action Animations
- **Wave**: Right arm waving motion
- **Bow**: Forward bending posture
- **Kicks**: Leg extension animations
- **Kung Fu**: Dynamic arm and body movements
- **Push-ups**: Horizontal body position
- **Movement**: Realistic walking and turning

## 🚀 Quick Start

```bash
# Start the simulator
./run_simulator.sh

# Test the API
python3 test_humanoid_robots.py
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
