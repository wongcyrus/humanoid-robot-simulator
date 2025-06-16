#!/bin/bash

# Robot Management Test Commands
# These test adding and removing robots from the simulator

echo "=== Robot Management Test Commands ==="
echo "Server: http://localhost:5000"
echo ""

# Function to run command with feedback
run_command() {
    local description="$1"
    local command="$2"
    local wait_time="${3:-2}"
    
    echo "🤖 $description"
    echo "Command: $command"
    echo "Running..."
    eval "$command"
    echo ""
    echo "⏱️  Waiting $wait_time seconds..."
    sleep "$wait_time"
    echo ""
}

# === LIST ROBOTS ===
run_command "1. List all current robots" \
'curl -X GET "http://localhost:5000/api/robots"' 2

# === ADD ROBOTS ===
echo "--- Adding New Robots ---"

# Add robot with custom position and color
run_command "2. Add robot_7 with custom position and color" \
'curl -X POST "http://localhost:5000/api/add_robot/robot_7" \
  -H "Content-Type: application/json" \
  -d '"'"'{"position": [100, 0, 100], "color": "#FF5733"}'"'"'' 2

# Add test robot
run_command "3. Add test_robot" \
'curl -X POST "http://localhost:5000/api/add_robot/test_robot" \
  -H "Content-Type: application/json" \
  -d '"'"'{"position": [-100, 0, 0], "color": "#33FF57"}'"'"'' 2

# Add dancer robot
run_command "4. Add dancer robot" \
'curl -X POST "http://localhost:5000/api/add_robot/dancer" \
  -H "Content-Type: application/json" \
  -d '"'"'{"position": [0, 0, 100], "color": "#FFD700"}'"'"'' 2

# Add fighter robot
run_command "5. Add fighter robot" \
'curl -X POST "http://localhost:5000/api/add_robot/fighter" \
  -H "Content-Type: application/json" \
  -d '"'"'{"position": [150, 0, -50], "color": "#FF1493"}'"'"'' 2

# Add purple robot
run_command "6. Add purple robot" \
'curl -X POST "http://localhost:5000/api/add_robot/purple" \
  -H "Content-Type: application/json" \
  -d '"'"'{"position": [75, 0, 75], "color": "#800080"}'"'"'' 2

# List robots again to see new additions
run_command "7. List all robots after additions" \
'curl -X GET "http://localhost:5000/api/robots"' 2

# === REMOVE ROBOTS ===
echo "--- Removing Robots ---"

# Remove specific robot
echo "8. Remove robot_7"
echo 'curl -X DELETE "http://localhost:5000/api/remove_robot/robot_7"'
echo ""

# Remove test robot
echo "9. Remove test_robot"
echo 'curl -X DELETE "http://localhost:5000/api/remove_robot/test_robot"'
echo ""

# Remove dancer robot
echo "10. Remove dancer robot"
echo 'curl -X DELETE "http://localhost:5000/api/remove_robot/dancer"'
echo ""

# List robots after removals
echo "11. List robots after removals"
echo 'curl -X GET "http://localhost:5000/api/robots"'
echo ""

# Remove all robots (CAUTION: This removes everything!)
echo "12. CAUTION: Remove ALL robots"
echo 'curl -X DELETE "http://localhost:5000/api/remove_robot/all"'
echo ""

# List robots after removing all
echo "13. List robots after removing all (should be empty)"
echo 'curl -X GET "http://localhost:5000/api/robots"'
echo ""

# === RESTORE DEFAULT ROBOTS ===
echo "--- Restore Default Robots ---"
echo "Note: You may need to restart the server to restore default robots"
echo "Or add them back manually using the add commands above."
echo ""

# Add back default robots manually
echo "14. Add back default robot_1"
echo 'curl -X POST "http://localhost:5000/api/add_robot/robot_1" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [-50, 0, 50], "color": "#4A90E2"}'"'"''
echo ""

echo "15. Add back default robot_2"
echo 'curl -X POST "http://localhost:5000/api/add_robot/robot_2" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [0, 0, 50], "color": "#E24A90"}'"'"''
echo ""

echo "16. Add back default robot_3"
echo 'curl -X POST "http://localhost:5000/api/add_robot/robot_3" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [50, 0, 50], "color": "#90E24A"}'"'"''
echo ""

echo "17. Add back default robot_4"
echo 'curl -X POST "http://localhost:5000/api/add_robot/robot_4" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [-50, 0, -50], "color": "#E2904A"}'"'"''
echo ""

echo "18. Add back default robot_5"
echo 'curl -X POST "http://localhost:5000/api/add_robot/robot_5" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [0, 0, -50], "color": "#904AE2"}'"'"''
echo ""

echo "19. Add back default robot_6"
echo 'curl -X POST "http://localhost:5000/api/add_robot/robot_6" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"position": [50, 0, -50], "color": "#4AE290"}'"'"''
echo ""

echo "20. Final robot list"
echo 'curl -X GET "http://localhost:5000/api/robots"'
echo ""

echo "=== End of Robot Management Test Commands ==="
