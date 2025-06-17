#!/bin/bash

# Video Management Test Commands
# Usage: ./test_video_commands.sh

BASE_URL="http://localhost:5000"
SESSION_KEY="cywong@vtc.edu.hk"

echo "🎬 Video Management Test Commands"
echo "Session Key: $SESSION_KEY"
echo "Base URL: $BASE_URL"
echo "================================"

# Function to make API calls
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo ""
    echo "📡 $method $endpoint"
    if [ -n "$data" ]; then
        echo "📋 Data: $data"
        curl -X $method \
             -H "Content-Type: application/json" \
             -d "$data" \
             "$BASE_URL$endpoint?session_key=$SESSION_KEY" \
             | jq '.' 2>/dev/null || echo "Response received"
    else
        curl -X $method \
             "$BASE_URL$endpoint?session_key=$SESSION_KEY" \
             | jq '.' 2>/dev/null || echo "Response received"
    fi
    echo ""
    echo "---"
}

echo ""
echo "1. Get video status"
api_call "GET" "/api/video/status"

echo ""
echo "2. Change video source to new video"
api_call "POST" "/api/video/change_source" '{"video_src": "/static/video/new-video.mp4"}'

echo ""
echo "3. Play video"
api_call "POST" "/api/video/control" '{"action": "play"}'

echo ""
echo "4. Pause video"
api_call "POST" "/api/video/control" '{"action": "pause"}'

echo ""
echo "5. Toggle video"
api_call "POST" "/api/video/control" '{"action": "toggle"}'

echo ""
echo "6. Change back to original video"
api_call "POST" "/api/video/change_source" '{"video_src": "/static/video/prog-video-01.mp4"}'

echo ""
echo "7. Test invalid action (should fail)"
api_call "POST" "/api/video/control" '{"action": "invalid_action"}'

echo ""
echo "✅ All video management tests completed!"
echo ""
echo "💡 You can also test using the Python script:"
echo "   python3 test_video_management.py"
echo ""
echo "💡 Or test manually with curl commands like:"
echo "   curl -X POST -H 'Content-Type: application/json' \\"
echo "        -d '{\"video_src\": \"static/video/ReawakeR.mp4\"}' \\"
echo "        '$BASE_URL/api/video/change_source?session_key=$SESSION_KEY'"
