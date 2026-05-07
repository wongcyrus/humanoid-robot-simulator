#!/bin/bash
# 3D Web Humanoid Robot Simulator Launcher

echo "🌐 3D Web Humanoid Robot Simulator"
echo "=================================="

cd "$(dirname "$0")"

# Setup virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

pip install -r requirements.txt

# Parse port
PORT=5000
if [ ! -z "$1" ]; then
    PORT=$1
fi

echo "🚀 Starting 3D Web Humanoid Robot Simulator..."
echo "🌐 Open your browser to: http://localhost:$PORT"
echo "📡 Robot IDs: robot_1, robot_2, robot_3, robot_4, robot_5, robot_6"
echo "📡 Special ID: 'all' (controls all robots)"
echo ""
echo "🎮 Controls:"
echo "  Mouse: Rotate camera"
echo "  Scroll: Zoom in/out"
echo "  Keyboard: 1-4 (actions), WASD (movement), Space (jump), Esc (stop all)"
echo ""
echo "🎯 Features:"
echo "  ✅ 3D humanoid robots with realistic animations"
echo "  ✅ Real-time WebSocket communication"
echo "  ✅ 28 different actions including dance and jump"
echo "  ✅ Individual and synchronized robot control"
echo "  ✅ Interactive 3D camera controls"
echo ""

# Set environment variables


# Run the web simulator
ROBOT_API_URL=https://6mz6soy3j3.execute-api.us-east-1.amazonaws.com/prod/api/run_action/ python3 app.py $PORT
