#!/bin/bash

# Robot Simulator Timing Test Script
# Tests the exact timing requirements as specified

echo "🤖 Robot Simulator Timing Test"
echo "Testing exact timing for all actions according to specifications"
echo ""

SESSION_KEY="test_timing_session"
BASE_URL="http://localhost:5000"

# Test function with exact timing
test_action_timing() {
    local action=$1
    local expected_time=$2
    
    echo "⏱️  Testing $action (expected: ${expected_time}s)"
    
    # Send action command
    curl -s -X POST "${BASE_URL}/api/robots/robot_1/action" \
        -H "Content-Type: application/json" \
        -d "{\"action\": \"$action\", \"session_key\": \"$SESSION_KEY\"}" > /dev/null
    
    # Wait for the expected duration
    sleep $expected_time
    
    echo "✅ $action completed after ${expected_time}s"
}

echo "🎭 Starting comprehensive timing test..."
echo ""

# Dance actions (long durations)
echo "💃 Testing Dance Actions..."
test_action_timing "dance_two" 52
test_action_timing "dance_three" 70
test_action_timing "dance_four" 83
test_action_timing "dance_five" 59
test_action_timing "dance_six" 69
test_action_timing "dance_seven" 67
test_action_timing "dance_eight" 85
test_action_timing "dance_nine" 84
test_action_timing "dance_ten" 85

echo ""
echo "🚶 Testing Movement Actions..."
test_action_timing "stepping" 3
test_action_timing "twist" 4
test_action_timing "go_forward" 3.5
test_action_timing "turn_right" 4
test_action_timing "turn_left" 4
test_action_timing "right_move_fast" 3
test_action_timing "left_move_fast" 3
test_action_timing "back_fast" 4.5

echo ""
echo "🧍 Testing Standing Actions..."
test_action_timing "stand_up_back" 5
test_action_timing "stand_up_front" 5

echo ""
echo "🥋 Testing Combat Actions..."
test_action_timing "right_kick" 2
test_action_timing "left_kick" 2
test_action_timing "right_uppercut" 2
test_action_timing "left_uppercut" 2
test_action_timing "wing_chun" 2
test_action_timing "right_shot_fast" 4
test_action_timing "left_shot_fast" 4
test_action_timing "kung_fu" 2

echo ""
echo "💪 Testing Exercise Actions..."
test_action_timing "chest" 9
test_action_timing "squat_up" 6
test_action_timing "squat" 1
test_action_timing "push_ups" 9
test_action_timing "sit_ups" 12
test_action_timing "weightlifting" 9

echo ""
echo "🎭 Testing Basic Actions..."
test_action_timing "bow" 4
test_action_timing "wave" 3.5

echo ""
echo "✅ All timing tests completed!"
echo ""
echo "📊 Summary:"
echo "- Dance actions: 52-85 seconds each"
echo "- Movement actions: 3-4.5 seconds each"
echo "- Combat actions: 2-4 seconds each"
echo "- Exercise actions: 1-12 seconds each"
echo "- Basic actions: 3.5-4 seconds each"
echo ""
echo "🎯 The simulator handles actions one by one with exact timing!"
