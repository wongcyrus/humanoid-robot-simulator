# Robot Simulator Timing System

## Overview
The robot simulator has been updated to handle actions one by one according to exact timing specifications. Each action has a precise duration, and the system processes them sequentially in a queue.

## Action Timing Specifications

### Dance Actions (Long Duration)
- `dance_two`: 52 seconds
- `dance_three`: 70 seconds  
- `dance_four`: 83 seconds
- `dance_five`: 59 seconds
- `dance_six`: 69 seconds
- `dance_seven`: 67 seconds
- `dance_eight`: 85 seconds
- `dance_nine`: 84 seconds
- `dance_ten`: 85 seconds

### Movement Actions
- `stepping`: 3 seconds
- `twist`: 4 seconds
- `stand_up_back`: 5 seconds
- `stand_up_front`: 5 seconds
- `turn_right`: 4 seconds
- `turn_left`: 4 seconds
- `go_forward`: 3.5 seconds
- `right_move_fast`: 3 seconds
- `left_move_fast`: 3 seconds
- `back_fast`: 4.5 seconds

### Combat Actions
- `right_kick`: 2 seconds
- `left_kick`: 2 seconds
- `right_uppercut`: 2 seconds
- `left_uppercut`: 2 seconds
- `wing_chun`: 2 seconds
- `right_shot_fast`: 4 seconds
- `left_shot_fast`: 4 seconds
- `kung_fu`: 2 seconds

### Exercise Actions
- `chest`: 9 seconds
- `squat_up`: 6 seconds
- `squat`: 1 second
- `push_ups`: 9 seconds
- `sit_ups`: 12 seconds
- `weightlifting`: 9 seconds

### Basic Actions
- `bow`: 4 seconds
- `wave`: 3.5 seconds

## How It Works

### 1. Action Queue System
- Actions are added to a queue when triggered
- Only one action executes at a time
- Each action runs for its exact specified duration
- Next action starts only after the previous one completes

### 2. Sequential Processing
```javascript
// Example: Adding multiple actions
simulator.queueAction('robot_1', 'dance_two');    // Will run for 52 seconds
simulator.queueAction('robot_1', 'right_kick');   // Will start after dance completes, run for 2 seconds
simulator.queueAction('robot_1', 'wave');         // Will start after kick completes, run for 3.5 seconds
```

### 3. Predefined Sequences
The system includes helper functions for common sequences:

```javascript
// Dance sequence (all 9 dance actions)
simulator.queueDanceSequence('robot_1');

// Combat sequence (all combat moves)
simulator.queueCombatSequence('robot_1');

// Exercise sequence (all workout moves)
simulator.queueExerciseSequence('robot_1');

// Movement sequence (various movements)
simulator.queueMovementSequence('robot_1');

// Complete demonstration (all actions)
simulator.demonstrateTimingSequence('robot_1');
```

## Using the Web Interface

### Individual Actions
1. Select a robot from the dropdown
2. Click any action button
3. The action will execute for its exact duration
4. Timing is shown in the UI (e.g., "DANCE_TWO (52s)")

### Action Sequences
1. Use the "Action Sequences" buttons to run predefined sequences
2. **Dance Sequence**: All 9 dance actions (~9 minutes total)
3. **Combat Sequence**: All combat moves (~20 seconds total)
4. **Exercise Sequence**: All exercise moves (~46 seconds total)
5. **Movement Sequence**: Various movements (~33 seconds total)
6. **Complete Demo**: All actions in sequence

### Queue Management
- **Clear Queue**: Stop all pending actions
- **Queue Status**: View current queue length and next action
- **Action Timings**: View all action durations

## Testing the System

### Web Interface Testing
1. Open the simulator in your browser
2. Select a robot
3. Try individual actions to see timing
4. Use sequence buttons for multiple actions
5. Monitor queue status in real-time

### Command Line Testing
```bash
# Run the timing test script
cd /home/cyrus/mock_robot_simulator/test_commands
./timing_test.py

# Or run the bash version
./timing_test.sh
```

### API Testing
```bash
# Send individual action
curl -X POST http://localhost:5000/api/robots/robot_1/action \
  -H "Content-Type: application/json" \
  -d '{"action": "dance_two", "session_key": "test"}'

# The action will run for exactly 52 seconds
```

## Key Features

1. **Exact Timing**: Each action runs for its precise specified duration
2. **Sequential Processing**: Actions execute one after another, never overlapping
3. **Queue Management**: Full control over action sequences
4. **Real-time Feedback**: UI shows current action, timing, and queue status
5. **Predefined Sequences**: Easy access to common action combinations
6. **API Integration**: Programmatic control via REST API

## Example Usage Scenarios

### Scenario 1: Quick Test
```javascript
// Test some short actions
simulator.queueAction('robot_1', 'stepping');    // 3s
simulator.queueAction('robot_1', 'right_kick');  // 2s  
simulator.queueAction('robot_1', 'wave');        // 3.5s
// Total: 8.5 seconds
```

### Scenario 2: Long Dance Performance
```javascript
// Queue all dance actions
simulator.queueDanceSequence('robot_1');
// Total: ~540 seconds (9 minutes)
```

### Scenario 3: Combat Training
```javascript
// Queue all combat moves
simulator.queueCombatSequence('robot_1');
// Total: ~20 seconds
```

The simulator now perfectly handles actions one by one with exact timing as specified!
