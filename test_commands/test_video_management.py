#!/usr/bin/env python3
"""
Test script for video management functionality
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:5000"
SESSION_KEY = "test_video_session"


def test_video_management():
    """Test video management API endpoints"""

    print("🎬 Testing Video Management API")
    print(f"Session Key: {SESSION_KEY}")
    print(f"Base URL: {BASE_URL}")
    print("-" * 50)

    # Test 1: Get video status
    print("\n📊 Test 1: Get video status")
    try:
        response = requests.get(f"{BASE_URL}/api/video/status",
                                params={'session_key': SESSION_KEY})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test 2: Change video source
    print("\n🎬 Test 2: Change video source")
    try:
        new_video_src = "/static/video/new-video.mp4"
        response = requests.post(f"{BASE_URL}/api/video/change_source",
                                 params={'session_key': SESSION_KEY},
                                 json={'video_src': new_video_src})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test 3: Control video - play
    print("\n▶️ Test 3: Play video")
    try:
        response = requests.post(f"{BASE_URL}/api/video/control",
                                 params={'session_key': SESSION_KEY},
                                 json={'action': 'play'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test 4: Control video - pause
    print("\n⏸️ Test 4: Pause video")
    try:
        response = requests.post(f"{BASE_URL}/api/video/control",
                                 params={'session_key': SESSION_KEY},
                                 json={'action': 'pause'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test 5: Control video - toggle
    print("\n⏯️ Test 5: Toggle video")
    try:
        response = requests.post(f"{BASE_URL}/api/video/control",
                                 params={'session_key': SESSION_KEY},
                                 json={'action': 'toggle'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test 6: Invalid action
    print("\n❌ Test 6: Invalid action")
    try:
        response = requests.post(f"{BASE_URL}/api/video/control",
                                 params={'session_key': SESSION_KEY},
                                 json={'action': 'invalid_action'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"❌ Error: {e}")

    print("\n✅ Video management API tests completed!")


if __name__ == "__main__":
    test_video_management()
