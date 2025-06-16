#!/bin/bash

# Error Testing Commands
# These test error handling with invalid inputs and edge cases

echo "=== Error Testing Commands ==="
echo "Session Key: cywong@vtc.edu.hk"
echo "Server: http://localhost:5000"
echo ""

# === INVALID ACTIONS ===
echo "--- Testing Invalid Actions ---"

echo "1. Try invalid action on robot_1"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "invalid_action"}'"'"''
echo "Expected: Error response about invalid action"
echo ""

echo "2. Try empty action"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": ""}'"'"''
echo "Expected: Error response about empty action"
echo ""

echo "3. Try action with wrong field name"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"command": "wave"}'"'"''
echo "Expected: Error response about missing action field"
echo ""

# === INVALID ROBOT IDs ===
echo "--- Testing Invalid Robot IDs ---"

echo "4. Try non-existent robot"
echo 'curl -X POST "http://localhost:5000/run_action/robot_999?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo "Expected: Error response about robot not found"
echo ""

echo "5. Try empty robot ID"
echo 'curl -X POST "http://localhost:5000/run_action/?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo "Expected: 404 Not Found or similar error"
echo ""

echo "6. Try robot ID with special characters"
echo 'curl -X POST "http://localhost:5000/run_action/robot@#$?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo "Expected: Error response or 404"
echo ""

# === INVALID SESSION KEYS ===
echo "--- Testing Invalid Session Keys ---"

echo "7. Try missing session key"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo "Expected: Error response about missing session key"
echo ""

echo "8. Try empty session key"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo "Expected: Error response about invalid session key"
echo ""

echo "9. Try invalid session key"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=invalid_key" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo "Expected: May work or may give session error depending on implementation"
echo ""

# === ROBOT MANAGEMENT ERRORS ===
echo "--- Testing Robot Management Errors ---"

echo "10. Try to add robot that already exists"
echo 'curl -X POST "http://localhost:5000/api/add_robot/robot_1" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [0, 0, 0], "color": "#000000"}'"'"''
echo "Expected: Error response about robot already existing"
echo ""

echo "11. Try to remove non-existent robot"
echo 'curl -X DELETE "http://localhost:5000/api/remove_robot/non_existent_robot"'
echo "Expected: Error response about robot not found"
echo ""

echo "12. Try to add robot with invalid position"
echo 'curl -X POST "http://localhost:5000/api/add_robot/invalid_pos_robot" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": "invalid", "color": "#FF0000"}'"'"''
echo "Expected: Error response about invalid position format"
echo ""

echo "13. Try to add robot with invalid color"
echo 'curl -X POST "http://localhost:5000/api/add_robot/invalid_color_robot" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [0, 0, 0], "color": "not_a_color"}'"'"''
echo "Expected: Error response about invalid color format"
echo ""

echo "14. Try to add robot with missing data"
echo 'curl -X POST "http://localhost:5000/api/add_robot/missing_data_robot" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{}'"'"''
echo "Expected: Error response about missing required fields"
echo ""

# === MALFORMED REQUESTS ===
echo "--- Testing Malformed Requests ---"

echo "15. Try request with invalid JSON"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{invalid json}'"'"''
echo "Expected: Error response about malformed JSON"
echo ""

echo "16. Try request without Content-Type header"
echo 'curl -X POST "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo "Expected: May work or may give content-type error"
echo ""

echo "17. Try GET request on POST endpoint"
echo 'curl -X GET "http://localhost:5000/run_action/robot_1?session_key=cywong@vtc.edu.hk"'
echo "Expected: Method Not Allowed error"
echo ""

echo "18. Try POST request on GET endpoint"
echo 'curl -X POST "http://localhost:5000/api/robots" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"action": "wave"}'"'"''
echo "Expected: Method Not Allowed error"
echo ""

# === SERVER CONNECTIVITY ===
echo "--- Testing Server Connectivity ---"

echo "19. Try request to wrong port"
echo 'curl -X GET "http://localhost:5001/api/robots" --connect-timeout 5'
echo "Expected: Connection refused or timeout"
echo ""

echo "20. Try request to non-existent endpoint"
echo 'curl -X GET "http://localhost:5000/api/non_existent_endpoint"'
echo "Expected: 404 Not Found"
echo ""

echo "=== End of Error Testing Commands ==="
echo ""
echo "NOTE: These commands are designed to test error handling."
echo "Many of them should return error responses - that's the expected behavior!"
echo "Use these to verify that your API handles errors gracefully."
