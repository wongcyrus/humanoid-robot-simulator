#!/bin/bash

# Dance Actions Test Commands
# These test various dance animations available for the robots

echo "=== Dance Actions Test Commands ==="
echo "Session Key: cywong@vtc.edu.hk"
echo "Server: http://localhost:5000"
echo ""

# Basic dance on all robots
echo "1. Basic dance on all robots"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance"}'"'"''
echo ""

# Dance variation 2 on all robots
echo "2. Dance variation 2 on all robots"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_two"}'"'"''
echo ""

# Dance variation 3 on robot_1
echo "3. Dance variation 3 on robot_1"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_three"}'"'"''
echo ""

# Dance variation 4 on robot_2
echo "4. Dance variation 4 on robot_2"
echo 'curl -X POST "http://localhost:5000/run_action/robot_2?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_four"}'"'"''
echo ""

# Dance variation 5 on robot_3
echo "5. Dance variation 5 on robot_3"
echo 'curl -X POST "http://localhost:5000/run_action/robot_3?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_five"}'"'"''
echo ""

# Dance variation 6 on robot_4
echo "6. Dance variation 6 on robot_4"
echo 'curl -X POST "http://localhost:5000/run_action/robot_4?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_six"}'"'"''
echo ""

# Dance variation 7 on robot_5
echo "7. Dance variation 7 on robot_5"
echo 'curl -X POST "http://localhost:5000/run_action/robot_5?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_seven"}'"'"''
echo ""

# Dance variation 8 on robot_6
echo "8. Dance variation 8 on robot_6"
echo 'curl -X POST "http://localhost:5000/run_action/robot_6?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_eight"}'"'"''
echo ""

# Dance variation 9 on all robots
echo "9. Dance variation 9 on all robots"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_nine"}'"'"''
echo ""

# Dance variation 10 on all robots (finale)
echo "10. Dance variation 10 on all robots (finale)"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_ten"}'"'"''
echo ""

echo "=== End of Dance Actions Test Commands ==="
