#!/bin/bash

# Movement Actions Test Commands
# These test robot movement actions like forward, backward, turns, etc.

echo "=== Movement Actions Test Commands ==="
echo "Session Key: cywong@vtc.edu.hk"
echo "Server: http://localhost:5000"
echo ""

# Go forward on all robots (your original successful command)
echo "1. Go forward on all robots"
curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '{"action": "go_forward"}'
echo ""

# Go backward on all robots
echo "2. Go backward on all robots"
curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '{"action": "go_backward"}'
echo ""

# Turn left on all robots
echo "3. Turn left on all robots"
curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '{"action": "turn_left"}'
echo ""

# Turn right on all robots
echo "4. Turn right on all robots"
curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '{"action": "turn_right"}'
echo ""

# Fast right move on robot_1
echo "5. Fast right move on robot_1"
curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '{"action": "right_move_fast"}'
echo ""

# Fast left move on robot_2
echo "6. Fast left move on robot_2"
curl -X POST "http://localhost:5000/run_action/robot_2?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '{"action": "left_move_fast"}'
echo ""

# Fast backward move on robot_3
echo "7. Fast backward move on robot_3"
curl -X POST "http://localhost:5000/run_action/robot_3?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '{"action": "back_fast"}'
echo ""

# Stepping action on robot_4
echo "8. Stepping action on robot_4"
curl -X POST "http://localhost:5000/run_action/robot_4?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '{"action": "stepping"}'
echo ""

# Twist action on robot_5
echo "9. Twist action on robot_5"
curl -X POST "http://localhost:5000/run_action/robot_5?session_key=cywong@vtc.edu.hk" \
  -H "Content-Type: application/json" \
  -d '{"action": "twist"}'
echo ""

echo "=== End of Movement Actions Test Commands ==="
