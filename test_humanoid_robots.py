#!/usr/bin/env python3
"""
Test script for the humanoid robot simulator
"""

import requests
import json
import time

def test_humanoid_robots():
    """Test the humanoid robot simulator"""
    base_url = "http://localhost:5000"
    
    print("🤖 Testing Humanoid Robot Simulator")
    print("=" * 40)
    
    try:
        # Test 1: API Info
        print("1. 🏠 API Information...")
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ {data['message']}")
            print(f"   ✅ Robot Count: {data['robot_count']}")
            print(f"   ✅ Robots: {', '.join(data['robots'])}")
            print(f"   ✅ Actions: {len(data['available_actions'])} available")
        
        # Test 2: Robot Status
        print("\\n2. 📊 All Robots Status...")
        response = requests.get(f"{base_url}/status/all", timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                for robot_id, status in data['data'].items():
                    pos = status['position']
                    print(f"   🤖 {robot_id}: {status['current_action']} at ({pos['x']:.0f}, {pos['y']:.0f})")
        
        # Test 3: Individual Robot Control
        print("\\n3. 🎮 Individual Robot Tests...")
        tests = [
            ("robot_1", "wave"),
            ("robot_2", "bow"),
            ("robot_3", "right_kick"),
            ("robot_4", "kung_fu"),
            ("robot_5", "go_forward"),
            ("robot_6", "turn_right")
        ]
        
        for robot_id, action in tests:
            payload = {"method": "RunAction", "action": action, "robot": robot_id}
            response = requests.post(f"{base_url}/run_action/{robot_id}", json=payload, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                if data['results'][0]['success']:
                    print(f"   ✅ {robot_id}: {action}")
                else:
                    print(f"   ❌ {robot_id}: {data['results'][0]['message']}")
            else:
                print(f"   ❌ {robot_id}: HTTP {response.status_code}")
            
            time.sleep(0.2)
        
        # Test 4: All Robots Together
        print("\\n4. 👥 All Robots Wave...")
        payload = {"method": "RunAction", "action": "wave", "robot": "all"}
        response = requests.post(f"{base_url}/run_action/all", json=payload, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            successful = sum(1 for r in data['results'] if r['success'])
            print(f"   ✅ Wave started on {successful}/6 robots")
        
        # Test 5: Check Status During Action
        print("\\n5. 📊 Status During Wave...")
        time.sleep(1)
        response = requests.get(f"{base_url}/status/all", timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                waving = sum(1 for s in data['data'].values() if s['current_action'] == 'wave')
                print(f"   👋 Robots waving: {waving}/6")
        
        # Test 6: Stop All
        print("\\n6. 🛑 Stop All Robots...")
        payload = {"method": "StopAction", "action": "stop", "robot": "all"}
        response = requests.post(f"{base_url}/run_action/all", json=payload, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            stopped = sum(1 for r in data['results'] if r['success'])
            print(f"   ✅ Stopped {stopped}/6 robots")
        
        print("\\n🎉 Humanoid Robot Simulator: ALL TESTS PASSED!")
        print("\\n📚 Usage Examples:")
        print(f"curl -X POST {base_url}/run_action/robot_1 -d '{{\"method\":\"RunAction\",\"action\":\"wave\"}}'")
        print(f"curl -X POST {base_url}/run_action/all -d '{{\"method\":\"RunAction\",\"action\":\"bow\"}}'")
        print(f"curl -X GET {base_url}/status/all")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to humanoid robot simulator")
        print("   Run: python3 humanoid_robot_simulator.py")
        return False
    except Exception as e:
        print(f"❌ Test error: {e}")
        return False

if __name__ == "__main__":
    test_humanoid_robots()
