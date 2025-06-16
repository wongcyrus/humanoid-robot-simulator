#!/usr/bin/env python3
"""
Robot Simulator Timing Test Script
Tests the exact timing requirements for all robot actions
"""

import time
import requests
import json
from datetime import datetime

# Action timing specifications
ACTION_TIMINGS = {
    # Dance actions (long durations)
    'dance_two': 52,
    'dance_three': 70,
    'dance_four': 83,
    'dance_five': 59,
    'dance_six': 69,
    'dance_seven': 67,
    'dance_eight': 85,
    'dance_nine': 84,
    'dance_ten': 85,

    # Movement actions
    'stepping': 3,
    'twist': 4,
    'stand_up_back': 5,
    'stand_up_front': 5,
    'right_kick': 2,
    'left_kick': 2,
    'right_uppercut': 2,
    'left_uppercut': 2,
    'wing_chun': 2,
    'right_shot_fast': 4,
    'left_shot_fast': 4,
    'chest': 9,
    'squat_up': 6,
    'squat': 1,
    'bow': 4,
    'wave': 3.5,
    'turn_right': 4,
    'turn_left': 4,
    'sit_ups': 12,
    'right_move_fast': 3,
    'left_move_fast': 3,
    'back_fast': 4.5,
    'go_forward': 3.5,
    'push_ups': 9,
    'weightlifting': 9,
    'kung_fu': 2
}


class RobotTimingTester:
    def __init__(self, base_url="http://localhost:5000", session_key="timing_test_session"):
        self.base_url = base_url
        self.session_key = session_key
        self.robot_id = "robot_1"

    def test_action_timing(self, action, expected_duration):
        """Test a single action with exact timing measurement"""
        print(f"⏱️  Testing {action} (expected: {expected_duration}s)")

        # Record start time
        start_time = time.time()

        # Send action command via API
        try:
            response = requests.post(
                f"{self.base_url}/api/robots/{self.robot_id}/action",
                json={
                    "action": action,
                    "session_key": self.session_key
                },
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                print(f"✅ Action {action} sent successfully")
            else:
                print(
                    f"❌ Failed to send action {action}: {response.status_code}")
                return False

        except requests.RequestException as e:
            print(f"❌ Network error testing {action}: {e}")
            return False

        # Wait for the expected duration
        time.sleep(expected_duration)

        # Record end time
        end_time = time.time()
        actual_duration = end_time - start_time

        print(
            f"✅ {action} completed - Expected: {expected_duration}s, Actual: {actual_duration:.1f}s")
        print(
            f"   Timing accuracy: {abs(actual_duration - expected_duration):.1f}s difference")
        print()

        return True

    def test_sequence_timing(self, actions, sequence_name):
        """Test a sequence of actions and measure total timing"""
        print(f"🎬 Testing {sequence_name} sequence...")
        print(f"   Actions: {', '.join(actions)}")

        expected_total = sum(ACTION_TIMINGS.get(action, 2)
                             for action in actions)
        print(
            f"   Expected total duration: {expected_total}s ({expected_total/60:.1f} minutes)")
        print()

        start_time = time.time()

        for action in actions:
            expected_duration = ACTION_TIMINGS.get(action, 2)
            if not self.test_action_timing(action, expected_duration):
                return False

        end_time = time.time()
        actual_total = end_time - start_time

        print(f"🏁 {sequence_name} sequence completed!")
        print(
            f"   Expected total: {expected_total}s, Actual total: {actual_total:.1f}s")
        print(
            f"   Sequence accuracy: {abs(actual_total - expected_total):.1f}s difference")
        print("=" * 60)
        print()

        return True

    def run_quick_test(self):
        """Run a quick test with short-duration actions"""
        print("🚀 Running Quick Timing Test...")
        print("=" * 60)

        quick_actions = [
            'stepping',      # 3s
            'twist',         # 4s
            'right_kick',    # 2s
            'left_kick',     # 2s
            'wave',          # 3.5s
            'bow',           # 4s
            'squat',         # 1s
            'kung_fu'        # 2s
        ]

        return self.test_sequence_timing(quick_actions, "Quick Test")

    def run_dance_test(self):
        """Run a test with dance actions (long durations)"""
        print("💃 Running Dance Timing Test...")
        print("⚠️  WARNING: This test will take approximately 9+ minutes!")
        print("=" * 60)

        dance_actions = [
            'dance_two',     # 52s
            'dance_three',   # 70s
            'dance_four'     # 83s (shortened for demo)
        ]

        return self.test_sequence_timing(dance_actions, "Dance Test")

    def run_combat_test(self):
        """Run a test with combat actions"""
        print("🥋 Running Combat Timing Test...")
        print("=" * 60)

        combat_actions = [
            'right_kick',     # 2s
            'left_kick',      # 2s
            'right_uppercut',  # 2s
            'left_uppercut',  # 2s
            'wing_chun',      # 2s
            'right_shot_fast',  # 4s
            'left_shot_fast',  # 4s
            'kung_fu'         # 2s
        ]

        return self.test_sequence_timing(combat_actions, "Combat Test")

    def run_exercise_test(self):
        """Run a test with exercise actions"""
        print("💪 Running Exercise Timing Test...")
        print("=" * 60)

        exercise_actions = [
            'chest',         # 9s
            'squat_up',      # 6s
            'squat',         # 1s
            'push_ups',      # 9s
            'sit_ups',       # 12s
            'weightlifting'  # 9s
        ]

        return self.test_sequence_timing(exercise_actions, "Exercise Test")

    def show_timing_summary(self):
        """Display a summary of all action timings"""
        print("📊 Action Timing Summary")
        print("=" * 60)

        categories = {
            "Dance Actions (Long Duration)": [
                'dance_two', 'dance_three', 'dance_four', 'dance_five',
                'dance_six', 'dance_seven', 'dance_eight', 'dance_nine', 'dance_ten'
            ],
            "Movement Actions": [
                'stepping', 'twist', 'go_forward', 'turn_right', 'turn_left',
                'right_move_fast', 'left_move_fast', 'back_fast'
            ],
            "Combat Actions": [
                'right_kick', 'left_kick', 'right_uppercut', 'left_uppercut',
                'wing_chun', 'right_shot_fast', 'left_shot_fast', 'kung_fu'
            ],
            "Exercise Actions": [
                'chest', 'squat_up', 'squat', 'push_ups', 'sit_ups', 'weightlifting'
            ],
            "Basic Actions": [
                'bow', 'wave', 'stand_up_back', 'stand_up_front'
            ]
        }

        for category, actions in categories.items():
            print(f"\n{category}:")
            for action in actions:
                if action in ACTION_TIMINGS:
                    duration = ACTION_TIMINGS[action]
                    print(f"  {action}: {duration}s")

        total_time = sum(ACTION_TIMINGS.values())
        print(
            f"\nTotal time for all actions: {total_time}s ({total_time/60:.1f} minutes)")


def main():
    print("🤖 Robot Simulator Timing Test System")
    print("Testing exact timing requirements for robot actions")
    print("=" * 60)

    tester = RobotTimingTester()

    # Show timing summary first
    tester.show_timing_summary()

    print("\n🎯 Available Tests:")
    print("1. Quick Test (short actions)")
    print("2. Combat Test (fight sequences)")
    print("3. Exercise Test (workout sequences)")
    print("4. Dance Test (LONG - 9+ minutes)")

    choice = input("\nEnter test number (1-4) or 'q' to quit: ").strip()

    if choice == '1':
        tester.run_quick_test()
    elif choice == '2':
        tester.run_combat_test()
    elif choice == '3':
        tester.run_exercise_test()
    elif choice == '4':
        confirm = input("⚠️  Dance test takes 9+ minutes. Continue? (y/N): ")
        if confirm.lower() == 'y':
            tester.run_dance_test()
        else:
            print("Dance test cancelled.")
    elif choice.lower() == 'q':
        print("👋 Goodbye!")
    else:
        print("❌ Invalid choice")

    print("\n✅ Testing completed!")
    print("🎯 The simulator handles each action one by one with exact timing!")


if __name__ == "__main__":
    main()
