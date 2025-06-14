#!/usr/bin/env python3
"""
Test script for Robot Management API
Demonstrates adding, removing, and listing robots
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_robot_management():
    print("🤖 Testing Robot Management API")
    print("=" * 50)
    
    # Test 1: List current robots
    print("\n1. 📋 Listing current robots...")
    response = requests.get(f"{BASE_URL}/api/robots")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Found {data['robot_count']} robots")
        for robot_id in data['robots'].keys():
            print(f"   🤖 {robot_id}")
    else:
        print(f"   ❌ Failed to list robots: {response.status_code}")
    
    # Test 2: Add a new robot
    print("\n2. ➕ Adding a new robot (robot_test)...")
    new_robot_data = {
        "position": [75, 0, 75],
        "color": "#FF6B35"
    }
    response = requests.post(
        f"{BASE_URL}/api/add_robot/robot_test",
        headers={"Content-Type": "application/json"},
        data=json.dumps(new_robot_data)
    )
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ {data['message']}")
        print(f"   📍 Position: {data['position']}")
        print(f"   🎨 Color: {data['color']}")
    else:
        print(f"   ❌ Failed to add robot: {response.status_code}")
        print(f"   📄 Response: {response.text}")
    
    # Test 3: List robots again
    print("\n3. 📋 Listing robots after addition...")
    response = requests.get(f"{BASE_URL}/api/robots")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Now have {data['robot_count']} robots")
        for robot_id in data['robots'].keys():
            print(f"   🤖 {robot_id}")
    
    # Test 4: Try to add duplicate robot (should fail)
    print("\n4. ❌ Trying to add duplicate robot (should fail)...")
    response = requests.post(
        f"{BASE_URL}/api/add_robot/robot_test",
        headers={"Content-Type": "application/json"},
        data=json.dumps(new_robot_data)
    )
    if response.status_code == 400:
        data = response.json()
        print(f"   ✅ Correctly rejected: {data['error']}")
    else:
        print(f"   ❌ Unexpected response: {response.status_code}")
    
    # Test 5: Remove specific robot
    print("\n5. 🗑️ Removing robot_test...")
    response = requests.delete(f"{BASE_URL}/api/remove_robot/robot_test")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ {data['message']}")
        print(f"   📊 Remaining robots: {len(data['remaining_robots'])}")
    else:
        print(f"   ❌ Failed to remove robot: {response.status_code}")
    
    # Test 6: Try to remove non-existent robot
    print("\n6. ❌ Trying to remove non-existent robot (should fail)...")
    response = requests.delete(f"{BASE_URL}/api/remove_robot/robot_nonexistent")
    if response.status_code == 404:
        data = response.json()
        print(f"   ✅ Correctly rejected: {data['error']}")
    else:
        print(f"   ❌ Unexpected response: {response.status_code}")
    
    # Test 7: Add multiple robots
    print("\n7. ➕ Adding multiple test robots...")
    test_robots = [
        {"id": "robot_alpha", "position": [-100, 0, 0], "color": "#FF0000"},
        {"id": "robot_beta", "position": [100, 0, 0], "color": "#00FF00"},
        {"id": "robot_gamma", "position": [0, 0, -100], "color": "#0000FF"}
    ]
    
    for robot in test_robots:
        response = requests.post(
            f"{BASE_URL}/api/add_robot/{robot['id']}",
            headers={"Content-Type": "application/json"},
            data=json.dumps({"position": robot["position"], "color": robot["color"]})
        )
        if response.status_code == 200:
            print(f"   ✅ Added {robot['id']}")
        else:
            print(f"   ❌ Failed to add {robot['id']}")
    
    # Test 8: List all robots
    print("\n8. 📋 Final robot count...")
    response = requests.get(f"{BASE_URL}/api/robots")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Total robots: {data['robot_count']}")
        for robot_id in sorted(data['robots'].keys()):
            robot_data = data['robots'][robot_id]
            print(f"   🤖 {robot_id}: {robot_data['color']} at {robot_data['position']}")
    
    # Test 9: Remove all robots
    print("\n9. 🗑️ Removing ALL robots...")
    response = requests.delete(f"{BASE_URL}/api/remove_robot/all")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ {data['message']}")
        print(f"   📊 Removed {len(data['removed_robots'])} robots")
    else:
        print(f"   ❌ Failed to remove all robots: {response.status_code}")
    
    # Test 10: Verify empty
    print("\n10. 📋 Verifying no robots remain...")
    response = requests.get(f"{BASE_URL}/api/robots")
    if response.status_code == 200:
        data = response.json()
        if data['robot_count'] == 0:
            print(f"   ✅ Confirmed: {data['robot_count']} robots remaining")
        else:
            print(f"   ❌ Still have {data['robot_count']} robots!")
    
    print("\n" + "=" * 50)
    print("🎉 Robot Management API Test Complete!")

if __name__ == "__main__":
    try:
        test_robot_management()
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure the simulator is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
