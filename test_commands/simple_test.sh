#!/bin/bash

# Simple Test Runner - Execute actual commands
echo "🤖 Robot Simulator Test Runner"
echo "Running actual curl commands..."
echo ""

# Simple function to run and format output
test_command() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎯 $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Command: $2"
    echo ""
    echo "Response:"
    eval "$2"
    echo ""
    echo ""
}

# Test 1: List robots
test_command "List all robots" \
'curl -s "http://localhost:5000/api/robots"'

# Test 2: Make robots wave
test_command "Make all robots wave" \
'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "wave"}'"'"''

echo "✅ Test commands executed!"
echo "Check the web interface to see the robots in action."
