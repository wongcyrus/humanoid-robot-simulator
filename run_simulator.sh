#!/bin/bash
# Humanoid Robot Simulator Launcher

echo "🤖 Humanoid Robot Simulator"
echo "============================"

cd "$(dirname "$0")"

# Setup virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install pygame flask flask-cors requests
else
    source venv/bin/activate
fi

# Check dependencies
python -c "import pygame, flask, flask_cors, requests" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing dependencies..."
    pip install pygame flask flask-cors requests
fi

# Parse port
PORT=5000
if [ ! -z "$1" ]; then
    PORT=$1
fi

echo "🤖 Starting Humanoid Robot Simulator..."
echo "🌐 Web API: http://localhost:$PORT"
echo "📡 Robot IDs: robot_1, robot_2, robot_3, robot_4, robot_5, robot_6"
echo "📡 Special ID: 'all' (controls all robots)"
echo ""
echo "🚀 API Examples:"
echo "# Individual robot control:"
echo "curl -X POST http://localhost:$PORT/run_action/robot_1 \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"method\":\"RunAction\",\"action\":\"wave\"}'"
echo ""
echo "# All robots control:"
echo "curl -X POST http://localhost:$PORT/run_action/all \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"method\":\"RunAction\",\"action\":\"bow\"}'"
echo ""
echo "# Get status:"
echo "curl -X GET http://localhost:$PORT/status/all"
echo ""
echo "🎮 Local Controls: SPACE=Pause, R=Reset, ESC=Exit"
echo ""

# Run the humanoid robot simulator
python3 humanoid_robot_simulator.py $PORT
