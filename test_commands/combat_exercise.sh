#!/bin/bash

# Combat & Exercise Actions Test Commands
# These test combat moves and exercise routines

echo "=== Combat & Exercise Actions Test Commands ==="
echo "Session Key: cywong@vtc.edu.hk"
echo "Server: http://localhost:5000"
echo ""

# === COMBAT ACTIONS ===
echo "--- Combat Actions ---"

# Kung fu on all robots
echo "1. Kung fu on all robots"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "kung_fu"}'"'"''
echo ""

# Right kick on robot_1
echo "2. Right kick on robot_1"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "right_kick"}'"'"''
echo ""

# Left kick on robot_2
echo "3. Left kick on robot_2"
echo 'curl -X POST "http://localhost:5000/run_action/robot_2?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "left_kick"}'"'"''
echo ""

# Right uppercut on robot_3
echo "4. Right uppercut on robot_3"
echo 'curl -X POST "http://localhost:5000/run_action/robot_3?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "right_uppercut"}'"'"''
echo ""

# Left uppercut on robot_4
echo "5. Left uppercut on robot_4"
echo 'curl -X POST "http://localhost:5000/run_action/robot_4?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "left_uppercut"}'"'"''
echo ""

# Wing chun on robot_5
echo "6. Wing chun on robot_5"
echo 'curl -X POST "http://localhost:5000/run_action/robot_5?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wing_chun"}'"'"''
echo ""

# Right shot fast on robot_6
echo "7. Right shot fast on robot_6"
echo 'curl -X POST "http://localhost:5000/run_action/robot_6?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "right_shot_fast"}'"'"''
echo ""

# Left shot fast on robot_1
echo "8. Left shot fast on robot_1"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "left_shot_fast"}'"'"''
echo ""

echo ""
echo "--- Exercise Actions ---"

# Push ups on all robots
echo "9. Push ups on all robots"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "push_ups"}'"'"''
echo ""

# Sit ups on robot_2
echo "10. Sit ups on robot_2"
echo 'curl -X POST "http://localhost:5000/run_action/robot_2?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "sit_ups"}'"'"''
echo ""

# Jumping jacks on all robots
echo "11. Jumping jacks on all robots"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "jumping_jacks"}'"'"''
echo ""

# Weightlifting on robot_3
echo "12. Weightlifting on robot_3"
echo 'curl -X POST "http://localhost:5000/run_action/robot_3?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "weightlifting"}'"'"''
echo ""

# Chest exercise on robot_4
echo "13. Chest exercise on robot_4"
echo 'curl -X POST "http://localhost:5000/run_action/robot_4?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "chest"}'"'"''
echo ""

# Squat on robot_5
echo "14. Squat on robot_5"
echo 'curl -X POST "http://localhost:5000/run_action/robot_5?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "squat"}'"'"''
echo ""

# Squat up on robot_6
echo "15. Squat up on robot_6"
echo 'curl -X POST "http://localhost:5000/run_action/robot_6?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "squat_up"}'"'"''
echo ""

echo ""
echo "--- Standing Actions ---"

# Stand up from back on robot_1
echo "16. Stand up from back on robot_1"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "stand_up_back"}'"'"''
echo ""

# Stand up from front on robot_2
echo "17. Stand up from front on robot_2"
echo 'curl -X POST "http://localhost:5000/run_action/robot_2?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "stand_up_front"}'"'"''
echo ""

echo "=== End of Combat & Exercise Actions Test Commands ==="
