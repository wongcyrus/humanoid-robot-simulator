#!/bin/bash

# Quick Test Commands
# One-liner commands for rapid testing

echo "=== Quick Test Commands ==="
echo "Copy and paste these for instant testing"
echo ""

# Basic quick tests
echo "# Quick action tests"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "wave"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "dance"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "celebrate"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "bow"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "jump"}'"'"''
echo ""

echo "# Movement tests"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "go_forward"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "go_backward"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "turn_left"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "turn_right"}'"'"''
echo ""

echo "# Exercise tests"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "push_ups"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "jumping_jacks"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "squat"}'"'"''
echo ""

echo "# Combat tests"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "kung_fu"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "wing_chun"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/robot_2?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "right_kick"}'"'"''
echo ""

echo "# Dance tests"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "dance_two"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "dance_five"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/robot_2?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "dance_ten"}'"'"''
echo ""

echo "# Robot management tests"
echo 'curl -X GET "http://localhost:5000/api/robots"'
echo 'curl -X POST "http://localhost:5000/api/add_robot/test_bot" -H "Content-Type: application/json" -d '"'"'{"position": [100, 0, 100], "color": "#FF5733"}'"'"''
echo 'curl -X DELETE "http://localhost:5000/api/remove_robot/test_bot"'
echo ""

echo "# Special action tests"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "think"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "weightlifting"}'"'"''
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '"'"'{"action": "idle"}'"'"''
echo ""

echo "=== Super Quick Copy-Paste Commands ==="
echo "# Just copy these lines directly:"
echo ""
curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '{"action": "wave"}'
curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '{"action": "dance"}'
curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '{"action": "celebrate"}'
curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" -H "Content-Type: application/json" -d '{"action": "kung_fu"}'
curl -X GET "http://localhost:5000/api/robots"
