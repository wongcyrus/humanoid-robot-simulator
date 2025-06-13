#!/usr/bin/env python3
"""
Test script for the 3D web simulator to verify robot creation
"""

import requests
import json
import time

def test_web_robots():
    """Test the 3D web robot simulator"""
    base_url = "http://localhost:5000"
    
    print("🌐 Testing 3D Web Humanoid Robot Simulator")
    print("=" * 45)
    
    try:
        # Test 1: Check if server is running
        print("1. 🔌 Testing server connection...")
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("   ✅ Server is running")
        else:
            print(f"   ❌ Server returned status {response.status_code}")
            return False
        
        # Test 2: Check robot API
        print("\n2. 🤖 Testing robot API...")
        response = requests.get(f"{base_url}/api/robots", timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                robots = data.get('robots', {})
                print(f"   ✅ Found {len(robots)} robots")
                
                # List each robot
                for robot_id, robot_data in robots.items():
                    pos = robot_data.get('position', {})
                    color = robot_data.get('color', 'unknown')
                    action = robot_data.get('current_action', 'unknown')
                    print(f"   🤖 {robot_id}: {color} at ({pos.get('x', 0):.0f}, {pos.get('y', 0):.0f}, {pos.get('z', 0):.0f}) - {action}")
                
                if len(robots) == 6:
                    print("   ✅ All 6 robots found!")
                    return True
                else:
                    print(f"   ⚠️  Expected 6 robots, found {len(robots)}")
                    return False
            else:
                print("   ❌ API returned success=false")
                return False
        else:
            print(f"   ❌ Robot API returned status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to web simulator")
        print("   Make sure to run: python3 web_humanoid_simulator.py")
        return False
    except Exception as e:
        print(f"❌ Test error: {e}")
        return False

if __name__ == "__main__":
    success = test_web_robots()
    if success:
        print("\n🎉 3D Web Simulator: ROBOTS FOUND!")
        print("🌐 Open http://localhost:5000 in your browser")
        print("🎮 The 6 robots should be visible in the 3D scene")
    else:
        print("\n❌ 3D Web Simulator: ROBOTS NOT FOUND")
        print("🔧 Check the server logs for issues")
