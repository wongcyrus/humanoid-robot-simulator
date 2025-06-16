#!/bin/bash

# Basic Actions Test Commands
# These test fundamental robot actions like wave, bow, jump, etc.

echo "=== Basic Actions Test Commands ==="
echo "Session Key: cywong@vtc.edu.hk"
echo "Server: http://localhost:5000"
echo ""

# Function to run command with feedback
run_command() {
    local description="$1"
    local command="$2"
    local wait_time="${3:-3}"
    
    echo "🤖 $description"
    echo "Command: $command"
    echo "Running..."
    eval "$command"
    echo ""
    echo "⏱️  Waiting $wait_time seconds..."
    sleep "$wait_time"
    echo ""
}

# Wave action on robot_1
run_command "1. Wave action on robot_1" \
'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "wave"}'"'"'' 4

# Bow action on robot_2
run_command "2. Bow action on robot_2" \
'curl -X POST "http://localhost:5000/run_action/robot_2?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "bow"}'"'"'' 4

# Jump action on robot_3
run_command "3. Jump action on robot_3" \
'curl -X POST "http://localhost:5000/run_action/robot_3?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "jump"}'"'"'' 3

# Celebrate on all robots
run_command "4. Celebrate on all robots" \
'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "celebrate"}'"'"'' 3

# Think action on robot_4
run_command "5. Think action on robot_4" \
'curl -X POST "http://localhost:5000/run_action/robot_4?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "think"}'"'"'' 3

# Punch action on robot_5
run_command "6. Punch action on robot_5" \
'curl -X POST "http://localhost:5000/run_action/robot_5?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "punch"}'"'"'' 3

# Kick action on robot_6
run_command "7. Kick action on robot_6" \
'curl -X POST "http://localhost:5000/run_action/robot_6?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "kick"}'"'"'' 3

# Idle state for all robots
run_command "8. Set all robots to idle" \
'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '"'"'{"action": "idle"}'"'"'' 2

echo "=== End of Basic Actions Test Commands ==="
