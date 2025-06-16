#!/bin/bash

# Complex Scenarios Test Commands
# These test sequential operations and complex scenarios

echo "=== Complex Scenarios Test Commands ==="
echo "Session Key: cywong@vtc.edu.hk"
echo "Server: http://localhost:5000"
echo ""

# === SCENARIO 1: ROBOT DANCE PARTY ===
echo "--- Scenario 1: Robot Dance Party ---"

echo "1. List current robots"
echo 'curl -X GET "http://localhost:5000/api/robots"'
echo ""

echo "2. Make all robots wave hello"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo ""

echo "3. Make all robots dance"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance"}'"'"''
echo ""

echo "4. Add a new dancer robot"
echo 'curl -X POST "http://localhost:5000/api/add_robot/party_dancer" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [0, 0, 120], "color": "#FFD700"}'"'"''
echo ""

echo "5. Make the new robot dance too"
echo 'curl -X POST "http://localhost:5000/run_action/party_dancer?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "dance_ten"}'"'"''
echo ""

echo "6. All robots celebrate together"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "celebrate"}'"'"''
echo ""

echo ""

# === SCENARIO 2: ROBOT EXERCISE ROUTINE ===
echo "--- Scenario 2: Robot Exercise Routine ---"

echo "7. Warm up - all robots wave"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo ""

echo "8. Exercise 1 - jumping jacks (wait 15 seconds after this)"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "jumping_jacks"}'"'"''
echo ""

echo "9. Exercise 2 - push ups (wait 12 seconds after this)"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "push_ups"}'"'"''
echo ""

echo "10. Exercise 3 - sit ups (wait 15 seconds after this)"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "sit_ups"}'"'"''
echo ""

echo "11. Cool down - bow"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "bow"}'"'"''
echo ""

echo ""

# === SCENARIO 3: ROBOT MARTIAL ARTS DEMO ===
echo "--- Scenario 3: Robot Martial Arts Demo ---"

echo "12. Add martial arts robots"
echo 'curl -X POST "http://localhost:5000/api/add_robot/kung_fu_master" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [-120, 0, 0], "color": "#FF0000"}'"'"''
echo ""

echo 'curl -X POST "http://localhost:5000/api/add_robot/wing_chun_student" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [120, 0, 0], "color": "#0000FF"}'"'"''
echo ""

echo "13. Martial arts bow"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "bow"}'"'"''
echo ""

echo "14. Kung fu master performs kung fu"
echo 'curl -X POST "http://localhost:5000/run_action/kung_fu_master?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "kung_fu"}'"'"''
echo ""

echo "15. Wing chun student performs wing chun"
echo 'curl -X POST "http://localhost:5000/run_action/wing_chun_student?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wing_chun"}'"'"''
echo ""

echo "16. All robots perform various kicks and punches"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "right_kick"}'"'"''
echo ""

echo 'curl -X POST "http://localhost:5000/run_action/robot_2?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "left_kick"}'"'"''
echo ""

echo 'curl -X POST "http://localhost:5000/run_action/robot_3?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "right_uppercut"}'"'"''
echo ""

echo "17. Final bow from all robots"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "bow"}'"'"''
echo ""

echo ""

# === SCENARIO 4: ROBOT FORMATION MOVEMENT ===
echo "--- Scenario 4: Robot Formation Movement ---"

echo "18. All robots move forward in formation"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "go_forward"}'"'"''
echo ""

echo "19. Turn left together"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "turn_left"}'"'"''
echo ""

echo "20. Move forward again"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "go_forward"}'"'"''
echo ""

echo "21. Turn right to face original direction"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "turn_right"}'"'"''
echo ""

echo "22. Return to original positions"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "go_backward"}'"'"''
echo ""

echo "23. Final celebration"
echo 'curl -X POST "http://localhost:5000/run_action/all?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "celebrate"}'"'"''
echo ""

echo "24. Clean up - remove added robots"
echo 'curl -X DELETE "http://localhost:5000/api/remove_robot/party_dancer"'
echo 'curl -X DELETE "http://localhost:5000/api/remove_robot/kung_fu_master"'
echo 'curl -X DELETE "http://localhost:5000/api/remove_robot/wing_chun_student"'
echo ""

echo "25. Final robot count"
echo 'curl -X GET "http://localhost:5000/api/robots"'
echo ""

echo "=== End of Complex Scenarios Test Commands ==="
echo ""
echo "NOTE: For best results, wait for each action to complete before running the next command."
echo "Action durations vary - dance actions can take 50-85 seconds, basic actions 2-5 seconds."
