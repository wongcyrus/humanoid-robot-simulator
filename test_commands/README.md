# Robot Simulator Test Commands

This folder contains various test commands for the Robot Simulator API. Each file contains different categories of tests.

## Files Overview

- `basic_actions.sh` - Basic robot actions (wave, bow, jump, etc.)
- `movement_actions.sh` - Movement commands (forward, backward, turns, etc.)
- `dance_actions.sh` - Various dance animations
- `combat_exercise.sh` - Combat moves and exercise routines
- `robot_management.sh` - Add/remove robots
- `complex_scenarios.sh` - Sequential and complex test scenarios
- `error_testing.sh` - Test error handling with invalid inputs
- `quick_tests.sh` - One-liner commands for quick testing
- `all_actions.txt` - Complete list of available actions

## Usage

Make the shell scripts executable:
```bash
chmod +x test_commands/*.sh
```

Run individual test files:
```bash
./test_commands/basic_actions.sh
./test_commands/movement_actions.sh
# etc.
```

Or run specific commands by copying them from the files.

## Session Key

All commands use the session key: `cywong@vtc.edu.hk`
Update this in the files if you need to use a different session key.

## Server

Make sure the robot simulator server is running on `http://localhost:5000` before executing these commands.
