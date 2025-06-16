#!/bin/bash

# Quick Demo Script - Actually runs commands with output
# This script demonstrates the robot simulator by running real commands

echo "🤖 === Robot Simulator Quick Demo ==="
echo "Session Key: cywong@vtc.edu.hk"
echo "Server: http://localhost:5000"
echo ""

# Function to run command with nice output
run_command() {
    local description="$1"
    local command="$2"
    local wait_time="${3:-3}"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎯 $description"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📡 Command: $command"
    echo ""
    echo "🚀 Executing..."
    eval "$command"
    echo ""
    if [ "$wait_time" -gt 0 ]; then
        echo "⏳ Waiting $wait_time seconds for action to complete..."
        sleep "$wait_time"
    fi
    echo ""
}

# Check if server is running
echo "🔍 Checking if server is running..."
if ! curl -s "http://localhost:5000/api/robots" > /dev/null; then
    echo "❌ Server not responding at http://localhost:5000"
    echo "Please make sure the robot simulator server is running."
    exit 1
fi
echo "✅ Server is running!"
echo ""

# Demo sequence
run_command "1. List current robots" \
'curl -s "http://localhost:5000/api/robots" | python3 -m json.tool' 0

run_command "2. Make all robots wave hello" \
'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "wave"}'"'"' | python3 -m json.tool' 4

run_command "3. Make all robots celebrate" \
'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "celebrate"}'"'"' | python3 -m json.tool' 3



echo "🎉 === Demo Complete! ==="
echo ""
echo "💡 Tips:"
echo "• Run other test scripts: ./basic_actions.sh, ./movement_actions.sh, etc."
echo "• Check the web interface at http://localhost:5000 to see the robots"
echo "• Use ./quick_tests.sh for rapid individual command testing"
echo ""
