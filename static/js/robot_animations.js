/**
 * Robot Animation System - CORRECTED MOVEMENT
 * Fixed turn right and forward movement directions
 */

class RobotAnimator {
    constructor(robot3d) {
        this.robot = robot3d;
        this.isAnimating = false;
        this.animationStartTime = 0;
        this.animationDuration = 2000; // Default 2 seconds
        this.currentAnimation = null;

        // Action duration mapping (exact timing as specified)
        this.actionDurations = {
            // Dance actions (long durations)
            'dance': 2 * 1000, // Original dance action
            'dance_two': 52 * 1000,
            'dance_three': 70 * 1000,
            'dance_four': 83 * 1000,
            'dance_five': 59 * 1000,
            'dance_six': 69 * 1000,
            'dance_seven': 67 * 1000,
            'dance_eight': 85 * 1000,
            'dance_nine': 84 * 1000,
            'dance_ten': 85 * 1000,

            // Movement actions
            'stepping': 3 * 1000,
            'twist': 4 * 1000,
            'right_move_fast': 3 * 1000,
            'left_move_fast': 3 * 1000,
            'back_fast': 4.5 * 1000,
            'go_forward': 3.5 * 1000,
            'go_backward': 3.5 * 1000,
            'turn_right': 4 * 1000,
            'turn_left': 4 * 1000,

            // Standing actions
            'stand_up_back': 5 * 1000,
            'stand_up_front': 5 * 1000,

            // Combat actions
            'right_kick': 2 * 1000,
            'left_kick': 2 * 1000,
            'right_uppercut': 2 * 1000,
            'left_uppercut': 2 * 1000,
            'wing_chun': 2 * 1000,
            'right_shot_fast': 4 * 1000,
            'left_shot_fast': 4 * 1000,
            'kung_fu': 2 * 1000,
            'kick': 2 * 1000,
            'punch': 2 * 1000,

            // Exercise actions
            'chest': 9 * 1000,
            'squat_up': 6 * 1000,
            'squat': 1 * 1000,
            'push_ups': 9 * 1000,
            'sit_ups': 12 * 1000,
            'weightlifting': 9 * 1000,
            'jumping_jacks': 3 * 1000,

            // Basic actions
            'bow': 4 * 1000,
            'wave': 3.5 * 1000,
            'jump': 2 * 1000,
            'celebrate': 3 * 1000,
            'think': 2 * 1000,
            'idle': 1 * 1000,

            // Default duration for unlisted actions
            'default': 2 * 1000
        };

        // Store original positions for reset
        this.originalPositions = {};
        this.storeOriginalPositions();
    }

    storeOriginalPositions() {
        // Store original positions of all body parts
        Object.keys(this.robot.parts).forEach(partName => {
            const part = this.robot.parts[partName];
            if (part) {
                this.originalPositions[partName] = {
                    position: part.position.clone(),
                    rotation: part.rotation.clone()
                };
            }
        });
    }

    startAnimation(action) {
        console.log(`🎭 Starting animation: ${action} for ${this.robot.robotId}`);

        this.currentAnimation = action;
        this.isAnimating = true;
        this.animationStartTime = Date.now();

        // Set the correct duration for this action
        const actionKey = action.toLowerCase();
        this.animationDuration = this.actionDurations[actionKey] || this.actionDurations['default'];

        console.log(`⏱️ Animation duration: ${this.animationDuration / 1000} seconds for ${action}`);

        // Store the robot's current facing direction at animation start
        this.animationStartRotation = this.robot.rotation.y || this.robot.group.rotation.y || 0;

        // Start the animation loop
        this.animateAction(action);
    }

    resetToOriginalPositions() {
        Object.keys(this.originalPositions).forEach(partName => {
            const part = this.robot.parts[partName];
            const original = this.originalPositions[partName];
            if (part && original) {
                part.position.copy(original.position);
                part.rotation.copy(original.rotation);
            }
        });
    }

    animateAction(action) {
        if (!this.isAnimating) return;

        const elapsed = Date.now() - this.animationStartTime;
        const progress = Math.min(elapsed / this.animationDuration, 1);

        // Apply animation based on action
        switch (action.toLowerCase()) {
            // Original actions
            case 'wave':
                this.animateWave(progress);
                break;
            case 'bow':
                this.animateBow(progress);
                break;
            case 'dance':
                this.animateDance(progress);
                break;
            case 'jump':
                this.animateJump(progress);
                break;
            case 'kung_fu':
                this.animateKungFu(progress);
                break;
            case 'kick':
                this.animateKick(progress);
                break;
            case 'punch':
                this.animatePunch(progress);
                break;
            case 'push_ups':
                this.animatePushUps(progress);
                break;
            case 'celebrate':
                this.animateCelebrate(progress);
                break;

            // Movement actions
            case 'go_forward':
                this.animateGoForward(progress);
                break;
            case 'go_backward':
                this.animateGoBackward(progress);
                break;
            case 'turn_left':
                this.animateTurnLeft(progress);
                break;
            case 'turn_right':
                this.animateTurnRight(progress);
                break;
            case 'sit_ups':
                this.animateSitUps(progress);
                break;
            case 'jumping_jacks':
                this.animateJumpingJacks(progress);
                break;
            case 'think':
                this.animateThink(progress);
                break;

            // NEW DANCE ACTIONS
            case 'dance_two':
                this.animateDanceTwo(progress);
                break;
            case 'dance_three':
                this.animateDanceThree(progress);
                break;
            case 'dance_four':
                this.animateDanceFour(progress);
                break;
            case 'dance_five':
                this.animateDanceFive(progress);
                break;
            case 'dance_six':
                this.animateDanceSix(progress);
                break;
            case 'dance_seven':
                this.animateDanceSeven(progress);
                break;
            case 'dance_eight':
                this.animateDanceEight(progress);
                break;
            case 'dance_nine':
                this.animateDanceNine(progress);
                break;
            case 'dance_ten':
                this.animateDanceTen(progress);
                break;

            // NEW MOVEMENT ACTIONS
            case 'stepping':
                this.animateStepping(progress);
                break;
            case 'twist':
                this.animateTwist(progress);
                break;
            case 'right_move_fast':
                this.animateRightMoveFast(progress);
                break;
            case 'left_move_fast':
                this.animateLeftMoveFast(progress);
                break;
            case 'back_fast':
                this.animateBackFast(progress);
                break;

            // NEW STANDING ACTIONS
            case 'stand_up_back':
                this.animateStandUpBack(progress);
                break;
            case 'stand_up_front':
                this.animateStandUpFront(progress);
                break;

            // NEW COMBAT ACTIONS
            case 'right_kick':
                this.animateRightKick(progress);
                break;
            case 'left_kick':
                this.animateLeftKick(progress);
                break;
            case 'right_uppercut':
                this.animateRightUppercut(progress);
                break;
            case 'left_uppercut':
                this.animateLeftUppercut(progress);
                break;
            case 'wing_chun':
                this.animateWingChun(progress);
                break;
            case 'right_shot_fast':
                this.animateRightShotFast(progress);
                break;
            case 'left_shot_fast':
                this.animateLeftShotFast(progress);
                break;

            // NEW EXERCISE ACTIONS
            case 'chest':
                this.animateChest(progress);
                break;
            case 'squat_up':
                this.animateSquatUp(progress);
                break;
            case 'squat':
                this.animateSquat(progress);
                break;
            case 'weightlifting':
                this.animateWeightlifting(progress);
                break;

            default:
                this.animateIdle(progress);
        }

        // Continue animation or finish
        if (progress < 1) {
            requestAnimationFrame(() => this.animateAction(action));
        } else {
            this.finishAnimation();
        }
    }

    // EXISTING ANIMATIONS (unchanged)
    animateWave(progress) {
        const rightArm = this.robot.parts.rightArm;
        if (rightArm) {
            const waveAngle = Math.sin(progress * Math.PI * 4) * 0.5;
            rightArm.rotation.z = -Math.PI / 4 + waveAngle;
            rightArm.rotation.x = Math.sin(progress * Math.PI * 8) * 0.2;
        }
    }

    animateBow(progress) {
        const torso = this.robot.parts.torso;
        const head = this.robot.parts.head;

        if (torso && head) {
            const bowAngle = Math.sin(progress * Math.PI) * 0.5;
            torso.rotation.x = bowAngle;
            head.rotation.x = bowAngle * 0.5;
        }
    }

    animateDance(progress) {
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (leftArm && rightArm && torso) {
            const danceTime = progress * Math.PI * 4;

            leftArm.rotation.z = Math.sin(danceTime) * 0.5;
            rightArm.rotation.z = -Math.sin(danceTime) * 0.5;
            torso.rotation.y = Math.sin(danceTime * 0.5) * 0.2;

            this.robot.group.position.y = this.robot.position.y + Math.abs(Math.sin(danceTime * 2)) * 5;
        }
    }

    animateJump(progress) {
        const jumpHeight = Math.sin(progress * Math.PI) * 30;
        this.robot.group.position.y = this.robot.position.y + jumpHeight;

        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;

        if (leftLeg && rightLeg) {
            const legBend = Math.sin(progress * Math.PI) * 0.3;
            leftLeg.rotation.x = legBend;
            rightLeg.rotation.x = legBend;
        }
    }

    // FIXED: Kung Fu should punch forward
    animateKungFu(progress) {
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const leftLeg = this.robot.parts.leftLeg;

        if (leftArm && rightArm && leftLeg) {
            const kungFuTime = progress * Math.PI * 3;

            // Punches forward (negative X rotation for forward punches)
            leftArm.rotation.x = -Math.abs(Math.sin(kungFuTime)) * 0.8;
            rightArm.rotation.x = -Math.abs(Math.sin(kungFuTime + Math.PI / 2)) * 0.8;
            leftLeg.rotation.x = Math.sin(kungFuTime * 0.5) * 0.3;
        }
    }

    // FIXED: Kick should go forward, not backward
    animateKick(progress) {
        const rightLeg = this.robot.parts.rightLeg;

        if (rightLeg) {
            // Kick forward (negative X rotation for forward kick)
            const kickAngle = Math.sin(progress * Math.PI) * -0.8;
            rightLeg.rotation.x = kickAngle;
        }
    }

    // FIXED: Punch should go forward
    animatePunch(progress) {
        const rightArm = this.robot.parts.rightArm;

        if (rightArm) {
            // Punch forward (negative X rotation for forward punch)
            const punchAngle = Math.sin(progress * Math.PI) * -0.5;
            rightArm.rotation.x = punchAngle;

            // Extend arm forward
            const punchExtension = Math.abs(Math.sin(progress * Math.PI)) * 10;
            rightArm.position.z = this.originalPositions.rightArm.position.z + punchExtension;
        }
    }

    animatePushUps(progress) {
        console.log(`💪 ${this.robot.robotId} doing REALISTIC push-ups - progress: ${progress}`);

        const torso = this.robot.parts.torso;
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;
        const head = this.robot.parts.head;

        if (torso && leftArm && rightArm && leftLeg && rightLeg && head) {
            // COMPLETE PUSH-UP SEQUENCE: Get down -> Do push-ups -> Stand up
            // WITH FORWARD MOVEMENT IN FACING DIRECTION

            // Get robot's current facing direction (use current rotation, not initial)
            const currentRotation = this.robot.group.rotation.y;
            const moveDistance = 20; // Total distance to move during push-ups

            if (progress < 0.2) {
                // Phase 1: Getting down to push-up position (0-20%)
                // Move forward while getting down - this is the "getting down direction"
                const getDownProgress = progress / 0.2;
                const currentMove = getDownProgress * moveDistance;

                // Calculate forward direction based on current rotation
                const forwardX = Math.sin(currentRotation) * currentMove;
                const forwardZ = Math.cos(currentRotation) * currentMove;

                // Apply movement in the facing direction during getting down
                this.robot.group.position.x = this.robot.position.x + forwardX;
                this.robot.group.position.z = this.robot.position.z + forwardZ;

                this.robot.group.position.y = this.robot.position.y - (25 * getDownProgress);

                // CORRECTED: Proper laying down in facing direction
                // The key insight: we need to apply rotations in the correct order
                // and use the robot's local coordinate system

                // First maintain the facing direction (Y rotation)
                this.robot.group.rotation.y = currentRotation;

                // Then apply the forward pitch in the robot's local coordinate system
                // When facing different directions, the "forward tilt" needs to be
                // applied after the Y rotation is set
                this.robot.group.rotation.order = 'YXZ'; // Apply Y first, then X, then Z
                this.robot.group.rotation.x = (Math.PI / 2) * getDownProgress;
                this.robot.group.rotation.z = 0;

                // Arms moving to support position
                leftArm.rotation.x = (-Math.PI / 3) * getDownProgress;
                rightArm.rotation.x = (-Math.PI / 3) * getDownProgress;
                leftArm.rotation.z = (Math.PI / 6) * getDownProgress;
                rightArm.rotation.z = (-Math.PI / 6) * getDownProgress;

            } else if (progress < 0.8) {
                // Phase 2: Doing push-ups (20-80%)
                const pushUpProgress = (progress - 0.2) / 0.6;

                // Maintain the position reached at the end of Phase 1
                const forwardX = Math.sin(currentRotation) * moveDistance;
                const forwardZ = Math.cos(currentRotation) * moveDistance;
                this.robot.group.position.x = this.robot.position.x + forwardX;
                this.robot.group.position.z = this.robot.position.z + forwardZ;

                // Robot in full push-up position
                this.robot.group.position.y = this.robot.position.y - 25;

                // Apply same rotation order as Phase 1
                this.robot.group.rotation.order = 'YXZ';
                this.robot.group.rotation.y = currentRotation; // Maintain facing direction  
                this.robot.group.rotation.x = Math.PI / 2;
                this.robot.group.rotation.z = 0;

                // Push-up motion - up and down
                const pushUpCycle = pushUpProgress * Math.PI * 4; // 4 push-ups
                const pushUpHeight = Math.abs(Math.sin(pushUpCycle)) * 8;
                this.robot.group.position.y = this.robot.position.y - 25 + pushUpHeight;

                // Full push-up arm positioning
                leftArm.rotation.x = -Math.PI / 3;
                rightArm.rotation.x = -Math.PI / 3;
                leftArm.rotation.z = Math.PI / 6;
                rightArm.rotation.z = -Math.PI / 6;

                // Legs straight and together
                leftLeg.rotation.x = 0;
                rightLeg.rotation.x = 0;
                leftLeg.rotation.z = 0.1;
                rightLeg.rotation.z = -0.1;

                // Head looking forward
                head.rotation.x = -Math.PI / 6;

            } else {
                // Phase 3: Standing back up (80-100%)
                const standUpProgress = (progress - 0.8) / 0.2;
                const reverseProgress = 1 - standUpProgress;

                // Maintain the forward position reached during Phase 1
                const forwardX = Math.sin(currentRotation) * moveDistance;
                const forwardZ = Math.cos(currentRotation) * moveDistance;
                this.robot.group.position.x = this.robot.position.x + forwardX;
                this.robot.group.position.z = this.robot.position.z + forwardZ;

                // Gradually return to standing position
                this.robot.group.position.y = this.robot.position.y - (25 * reverseProgress);

                // Apply same rotation order as other phases
                this.robot.group.rotation.order = 'YXZ';
                this.robot.group.rotation.y = currentRotation; // Maintain facing direction
                this.robot.group.rotation.x = (Math.PI / 2) * reverseProgress;
                this.robot.group.rotation.z = 0;

                // Arms returning to normal position
                leftArm.rotation.x = (-Math.PI / 3) * reverseProgress;
                rightArm.rotation.x = (-Math.PI / 3) * reverseProgress;
                leftArm.rotation.z = (Math.PI / 6) * reverseProgress;
                rightArm.rotation.z = (-Math.PI / 6) * reverseProgress;

                // Legs returning to normal
                leftLeg.rotation.z = 0.1 * reverseProgress;
                rightLeg.rotation.z = -0.1 * reverseProgress;

                // Head returning to normal
                head.rotation.x = (-Math.PI / 6) * reverseProgress;
            }

            console.log(`💪 ${this.robot.robotId} push-up phase: ${progress < 0.2 ? 'Getting Down' : progress < 0.8 ? 'Push-ups' : 'Standing Up'} - moving forward: x=${this.robot.group.position.x}, z=${this.robot.group.position.z}, rotation=${currentRotation}`);
        }
    }

    animateCelebrate(progress) {
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const head = this.robot.parts.head;

        if (leftArm && rightArm && head) {
            const celebrateTime = progress * Math.PI * 2;

            leftArm.rotation.z = Math.PI / 2 + Math.sin(celebrateTime) * 0.2;
            rightArm.rotation.z = -Math.PI / 2 - Math.sin(celebrateTime) * 0.2;
            head.rotation.y = Math.sin(celebrateTime * 2) * 0.3;

            this.robot.group.position.y = this.robot.position.y + Math.abs(Math.sin(celebrateTime * 3)) * 8;
        }
    }

    // CORRECTED MOVEMENT ANIMATIONS
    animateGoForward(progress) {
        console.log(`🚶 ${this.robot.robotId} moving forward - progress: ${progress}`);

        // Walking animation - legs alternate
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;

        if (leftLeg && rightLeg && leftArm && rightArm) {
            const walkCycle = progress * Math.PI * 4; // 4 steps during animation

            // Leg movement - alternating
            leftLeg.rotation.x = Math.sin(walkCycle) * 0.5;
            rightLeg.rotation.x = -Math.sin(walkCycle) * 0.5;

            // Arm swing - opposite to legs
            leftArm.rotation.x = -Math.sin(walkCycle) * 0.3;
            rightArm.rotation.x = Math.sin(walkCycle) * 0.3;
        }

        // CORRECTED: Move forward based on robot's current rotation
        const moveDistance = 30;
        const currentMove = progress * moveDistance;

        // Get robot's current Y rotation to determine forward direction
        const currentRotation = this.robot.group.rotation.y;

        // Calculate forward direction based on rotation
        const forwardX = Math.sin(currentRotation) * currentMove;
        const forwardZ = Math.cos(currentRotation) * currentMove;

        // Apply movement in the correct direction
        this.robot.group.position.x = this.robot.position.x + forwardX;
        this.robot.group.position.z = this.robot.position.z + forwardZ;

        console.log(`🚶 ${this.robot.robotId} forward: x=${this.robot.group.position.x}, z=${this.robot.group.position.z}, rotation=${currentRotation}`);
    }

    animateGoBackward(progress) {
        console.log(`🚶 ${this.robot.robotId} moving backward - progress: ${progress}`);

        // Walking animation - legs alternate (slower for backward)
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;

        if (leftLeg && rightLeg && leftArm && rightArm) {
            const walkCycle = progress * Math.PI * 3; // Slower backward walk

            leftLeg.rotation.x = Math.sin(walkCycle) * 0.3;
            rightLeg.rotation.x = -Math.sin(walkCycle) * 0.3;
            leftArm.rotation.x = Math.sin(walkCycle) * 0.2;
            rightArm.rotation.x = -Math.sin(walkCycle) * 0.2;
        }

        // CORRECTED: Move backward based on robot's current rotation
        const moveDistance = 20;
        const currentMove = progress * moveDistance;

        // Get robot's current Y rotation to determine backward direction
        const currentRotation = this.robot.group.rotation.y;

        // Calculate backward direction (opposite of forward)
        const backwardX = -Math.sin(currentRotation) * currentMove;
        const backwardZ = -Math.cos(currentRotation) * currentMove;

        // Apply movement in the correct direction
        this.robot.group.position.x = this.robot.position.x + backwardX;
        this.robot.group.position.z = this.robot.position.z + backwardZ;
    }

    animateTurnLeft(progress) {
        console.log(`🔄 ${this.robot.robotId} turning left - progress: ${progress}`);

        // Turning animation - lean into turn
        const torso = this.robot.parts.torso;
        if (torso) {
            torso.rotation.z = Math.sin(progress * Math.PI) * 0.2; // Lean left
        }

        // CORRECTED: Turn left (counterclockwise = positive Y rotation)
        const turnAngle = Math.PI / 2; // 90 degrees counterclockwise
        const currentTurn = progress * turnAngle;

        // Add to existing rotation instead of replacing
        const startRotation = this.robot.rotation.y || 0;
        this.robot.group.rotation.y = startRotation + currentTurn;

        console.log(`🔄 ${this.robot.robotId} turn left: rotation=${this.robot.group.rotation.y}`);
    }

    animateTurnRight(progress) {
        console.log(`🔄 ${this.robot.robotId} turning right - progress: ${progress}`);

        // Turning animation - lean into turn
        const torso = this.robot.parts.torso;
        if (torso) {
            torso.rotation.z = -Math.sin(progress * Math.PI) * 0.2; // Lean right
        }

        // CORRECTED: Turn right (clockwise = negative Y rotation)
        const turnAngle = -Math.PI / 2; // 90 degrees clockwise
        const currentTurn = progress * turnAngle;

        // Add to existing rotation instead of replacing
        const startRotation = this.robot.rotation.y || 0;
        this.robot.group.rotation.y = startRotation + currentTurn;

        console.log(`🔄 ${this.robot.robotId} turn right: rotation=${this.robot.group.rotation.y}`);
    }

    animateSitUps(progress) {
        console.log(`🏃 ${this.robot.robotId} doing PROPER sit-ups - progress: ${progress}`);

        const torso = this.robot.parts.torso;
        const head = this.robot.parts.head;
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;

        if (torso && head && leftArm && rightArm && leftLeg && rightLeg) {
            // PROPER SIT-UP SEQUENCE: Lie down -> Do sit-ups -> End sitting

            if (progress < 0.15) {
                // Phase 1: Getting down to lying position (0-15%)
                const lieDownProgress = progress / 0.15;

                this.robot.group.position.y = this.robot.position.y - (30 * lieDownProgress);

                // Arms moving to behind head position
                leftArm.rotation.x = (-Math.PI / 2) * lieDownProgress;
                rightArm.rotation.x = (-Math.PI / 2) * lieDownProgress;
                leftArm.rotation.z = (Math.PI / 4) * lieDownProgress;
                rightArm.rotation.z = (-Math.PI / 4) * lieDownProgress;

                // Legs bending
                leftLeg.rotation.x = (Math.PI / 3) * lieDownProgress;
                rightLeg.rotation.x = (Math.PI / 3) * lieDownProgress;

            } else if (progress < 0.85) {
                // Phase 2: Doing sit-ups (15-85%)
                const sitUpProgress = (progress - 0.15) / 0.7;

                // Robot lying on floor
                this.robot.group.position.y = this.robot.position.y - 30;
                this.robot.group.rotation.x = 0;

                // Sit-up motion - torso rising up and down
                const sitUpCycle = sitUpProgress * Math.PI * 4; // 4 sit-ups
                const sitUpAngle = Math.abs(Math.sin(sitUpCycle)) * (Math.PI / 3);

                torso.rotation.x = sitUpAngle;
                head.rotation.x = sitUpAngle * 0.7;

                // Full sit-up positioning
                leftArm.rotation.x = -Math.PI / 2;
                rightArm.rotation.x = -Math.PI / 2;
                leftArm.rotation.z = Math.PI / 4;
                rightArm.rotation.z = -Math.PI / 4;

                leftLeg.rotation.x = Math.PI / 3;
                rightLeg.rotation.x = Math.PI / 3;
                leftLeg.rotation.z = 0.1;
                rightLeg.rotation.z = -0.1;

            } else {
                // Phase 3: Final sitting position (85-100%)
                const sitProgress = (progress - 0.85) / 0.15;

                // FIXED: End in sitting position, NOT standing
                this.robot.group.position.y = this.robot.position.y - 15; // Sitting height
                this.robot.group.rotation.x = 0;

                // Final sitting posture
                torso.rotation.x = Math.PI / 6; // Slight forward lean while sitting
                head.rotation.x = 0;

                // Arms relaxed at sides
                leftArm.rotation.x = 0;
                rightArm.rotation.x = 0;
                leftArm.rotation.z = 0;
                rightArm.rotation.z = 0;

                // Legs in sitting position
                leftLeg.rotation.x = Math.PI / 2; // 90 degrees for sitting
                rightLeg.rotation.x = Math.PI / 2;
                leftLeg.rotation.z = 0.1;
                rightLeg.rotation.z = -0.1;
            }

            console.log(`🏃 ${this.robot.robotId} sit-up phase: ${progress < 0.15 ? 'Lying Down' : progress < 0.85 ? 'Sit-ups' : 'Final Sitting'}`);
        }
    }

    animateJumpingJacks(progress) {
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;

        if (leftArm && rightArm && leftLeg && rightLeg) {
            const jackTime = progress * Math.PI * 4;

            const armAngle = Math.abs(Math.sin(jackTime)) * Math.PI / 3;
            leftArm.rotation.z = armAngle;
            rightArm.rotation.z = -armAngle;

            const legAngle = Math.abs(Math.sin(jackTime)) * 0.3;
            leftLeg.rotation.z = legAngle;
            rightLeg.rotation.z = -legAngle;

            this.robot.group.position.y = this.robot.position.y + Math.abs(Math.sin(jackTime * 2)) * 5;
        }
    }

    animateThink(progress) {
        const head = this.robot.parts.head;
        const rightArm = this.robot.parts.rightArm;

        if (head && rightArm) {
            head.rotation.x = Math.sin(progress * Math.PI) * 0.2;
            head.rotation.y = Math.sin(progress * Math.PI * 0.5) * 0.1;

            rightArm.rotation.x = -Math.PI / 3;
            rightArm.rotation.z = -Math.PI / 6;
        }
    }

    animateIdle(progress) {
        const breathe = Math.sin(progress * Math.PI * 2) * 0.02;
        const torso = this.robot.parts.torso;

        if (torso) {
            torso.scale.y = 1 + breathe;
        }
    }

    finishAnimation() {
        console.log(`✅ Animation finished: ${this.currentAnimation} for ${this.robot.robotId}`);

        this.isAnimating = false;

        // For movement actions, update the robot's base position and rotation
        if (['go_forward', 'go_backward', 'turn_left', 'turn_right', 'right_move_fast', 'left_move_fast', 'back_fast', 'stepping'].includes(this.currentAnimation)) {
            console.log(`🔄 Updating base position/rotation for ${this.robot.robotId} after ${this.currentAnimation}`);

            // Update the robot's stored position to match current position
            this.robot.position.x = this.robot.group.position.x;
            this.robot.position.y = this.robot.group.position.y;
            this.robot.position.z = this.robot.group.position.z;

            // Update stored rotation
            this.robot.rotation.y = this.robot.group.rotation.y;

            console.log(`📍 New position for ${this.robot.robotId}:`, this.robot.position);
            console.log(`🔄 New rotation for ${this.robot.robotId}:`, this.robot.rotation.y);
        } else {
            // For non-movement actions, handle different ending positions
            setTimeout(() => {
                if (!this.isAnimating) {
                    console.log(`🎭 Finishing ${this.currentAnimation} for ${this.robot.robotId}`);

                    // SPECIAL HANDLING: Sit-ups should end in sitting position
                    if (this.currentAnimation === 'sit_ups') {
                        console.log(`🪑 ${this.robot.robotId} staying in sitting position after sit-ups`);

                        // Keep robot in sitting position - don't reset to standing
                        // The animation already ends in proper sitting position
                        // Just maintain the world position
                        this.robot.group.position.x = this.robot.position.x;
                        this.robot.group.position.z = this.robot.position.z;
                        // Keep the sitting Y position and leg positions from animation

                    } else {
                        // For other actions, reset body parts and return to standing
                        this.resetToOriginalPositions();

                        // Maintain current world position
                        this.robot.group.position.set(
                            this.robot.position.x,
                            this.robot.position.y,
                            this.robot.position.z
                        );
                        this.robot.group.rotation.set(
                            this.robot.rotation.x || 0,
                            this.robot.rotation.y || 0,
                            this.robot.rotation.z || 0
                        );
                    }

                    console.log(`📍 Maintained position for ${this.robot.robotId}:`, this.robot.position);
                }
            }, 500);
        }

        this.currentAnimation = null;
    }

    stopAnimation() {
        this.isAnimating = false;
        this.resetToOriginalPositions();
    }

    // NEW DANCE ANIMATIONS
    animateDanceTwo(progress) {
        // Energetic dance with arm swings and body movement
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;
        const head = this.robot.parts.head;

        if (leftArm && rightArm && torso && head) {
            const danceTime = progress * Math.PI * 8;

            leftArm.rotation.z = Math.sin(danceTime) * 0.8;
            rightArm.rotation.z = -Math.sin(danceTime + Math.PI / 4) * 0.8;
            torso.rotation.y = Math.sin(danceTime * 0.5) * 0.3;
            head.rotation.y = Math.sin(danceTime * 0.3) * 0.2;

            this.robot.group.position.y = this.robot.position.y + Math.abs(Math.sin(danceTime * 3)) * 8;
        }
    }

    animateDanceThree(progress) {
        // Smooth flowing dance
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (leftArm && rightArm && torso) {
            const flowTime = progress * Math.PI * 6;

            leftArm.rotation.x = Math.sin(flowTime) * 0.6;
            rightArm.rotation.x = Math.sin(flowTime + Math.PI) * 0.6;
            leftArm.rotation.z = Math.cos(flowTime) * 0.4;
            rightArm.rotation.z = -Math.cos(flowTime) * 0.4;
            torso.rotation.z = Math.sin(flowTime * 0.5) * 0.2;
        }
    }

    animateDanceFour(progress) {
        // Hip-hop style dance
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;

        if (leftArm && rightArm && leftLeg && rightLeg) {
            const hipHopTime = progress * Math.PI * 10;

            leftArm.rotation.x = Math.sin(hipHopTime) * 0.7;
            rightArm.rotation.x = Math.sin(hipHopTime + Math.PI / 2) * 0.7;
            leftLeg.rotation.x = Math.sin(hipHopTime * 0.5) * 0.3;
            rightLeg.rotation.x = -Math.sin(hipHopTime * 0.5) * 0.3;

            this.robot.group.position.y = this.robot.position.y + Math.abs(Math.sin(hipHopTime * 2)) * 6;
        }
    }

    animateDanceFive(progress) {
        // Ballet-inspired graceful dance
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (leftArm && rightArm && torso) {
            const balletTime = progress * Math.PI * 4;

            leftArm.rotation.z = Math.PI / 3 + Math.sin(balletTime) * 0.3;
            rightArm.rotation.z = -Math.PI / 3 - Math.sin(balletTime) * 0.3;
            leftArm.rotation.y = Math.sin(balletTime * 0.7) * 0.4;
            rightArm.rotation.y = -Math.sin(balletTime * 0.7) * 0.4;
            torso.rotation.y = Math.sin(balletTime * 0.3) * 0.2;
        }
    }

    animateDanceSix(progress) {
        // Robotic dance with sharp movements
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const head = this.robot.parts.head;

        if (leftArm && rightArm && head) {
            const robotTime = progress * Math.PI * 8;
            const sharpMove = Math.floor(robotTime) % 2 === 0 ? 1 : -1;

            leftArm.rotation.x = sharpMove * 0.5;
            rightArm.rotation.x = -sharpMove * 0.5;
            leftArm.rotation.z = sharpMove * 0.3;
            rightArm.rotation.z = -sharpMove * 0.3;
            head.rotation.y = sharpMove * 0.3;
        }
    }

    animateDanceSeven(progress) {
        // Salsa-style dance
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;

        if (leftArm && rightArm && torso && leftLeg && rightLeg) {
            const salsaTime = progress * Math.PI * 6;

            leftArm.rotation.z = Math.sin(salsaTime) * 0.6;
            rightArm.rotation.z = -Math.sin(salsaTime + Math.PI / 3) * 0.6;
            torso.rotation.y = Math.sin(salsaTime * 0.8) * 0.4;
            leftLeg.rotation.x = Math.sin(salsaTime * 2) * 0.2;
            rightLeg.rotation.x = -Math.sin(salsaTime * 2) * 0.2;
        }
    }

    animateDanceEight(progress) {
        // Breakdance-inspired moves
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (leftArm && rightArm && torso) {
            const breakTime = progress * Math.PI * 12;

            leftArm.rotation.x = Math.sin(breakTime) * 0.8;
            rightArm.rotation.x = Math.sin(breakTime + Math.PI) * 0.8;
            torso.rotation.z = Math.sin(breakTime * 0.5) * 0.5;

            this.robot.group.position.y = this.robot.position.y + Math.abs(Math.sin(breakTime * 4)) * 12;
        }
    }

    animateDanceNine(progress) {
        // Contemporary dance
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;
        const head = this.robot.parts.head;

        if (leftArm && rightArm && torso && head) {
            const contempoTime = progress * Math.PI * 5;

            leftArm.rotation.x = Math.sin(contempoTime) * 0.7;
            rightArm.rotation.x = Math.cos(contempoTime) * 0.7;
            leftArm.rotation.z = Math.sin(contempoTime * 0.7) * 0.5;
            rightArm.rotation.z = -Math.sin(contempoTime * 0.7) * 0.5;
            torso.rotation.x = Math.sin(contempoTime * 0.3) * 0.2;
            head.rotation.x = Math.sin(contempoTime * 0.4) * 0.1;
        }
    }

    animateDanceTen(progress) {
        // Disco dance with spins
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (leftArm && rightArm && torso) {
            const discoTime = progress * Math.PI * 10;

            leftArm.rotation.z = Math.PI / 4 + Math.sin(discoTime) * 0.5;
            rightArm.rotation.z = -Math.PI / 4 - Math.sin(discoTime) * 0.5;
            leftArm.rotation.y = Math.sin(discoTime * 0.8) * 0.3;
            rightArm.rotation.y = -Math.sin(discoTime * 0.8) * 0.3;

            // Disco spin
            this.robot.group.rotation.y += 0.1;
        }
    }

    // NEW MOVEMENT ANIMATIONS
    animateStepping(progress) {
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;

        if (leftLeg && rightLeg) {
            const stepTime = progress * Math.PI * 4;
            leftLeg.rotation.x = Math.sin(stepTime) * 0.4;
            rightLeg.rotation.x = -Math.sin(stepTime) * 0.4;

            this.robot.group.position.y = this.robot.position.y + Math.abs(Math.sin(stepTime * 2)) * 3;
        }
    }

    animateTwist(progress) {
        const torso = this.robot.parts.torso;
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;

        if (torso && leftArm && rightArm) {
            const twistAngle = Math.sin(progress * Math.PI * 3) * 0.5;
            torso.rotation.y = twistAngle;
            leftArm.rotation.z = twistAngle * 0.5;
            rightArm.rotation.z = -twistAngle * 0.5;
        }
    }

    animateRightMoveFast(progress) {
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;
        const torso = this.robot.parts.torso;

        if (leftLeg && rightLeg && torso) {
            const moveTime = progress * Math.PI * 6;
            leftLeg.rotation.x = Math.sin(moveTime) * 0.3;
            rightLeg.rotation.x = -Math.sin(moveTime) * 0.3;
            torso.rotation.z = -0.1; // Lean right

            // Actually move right
            const currentMove = progress * 25;
            const currentRotation = this.robot.group.rotation.y;
            const rightX = Math.cos(currentRotation) * currentMove;
            const rightZ = -Math.sin(currentRotation) * currentMove;
            this.robot.group.position.x = this.robot.position.x + rightX;
            this.robot.group.position.z = this.robot.position.z + rightZ;
        }
    }

    animateLeftMoveFast(progress) {
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;
        const torso = this.robot.parts.torso;

        if (leftLeg && rightLeg && torso) {
            const moveTime = progress * Math.PI * 6;
            leftLeg.rotation.x = Math.sin(moveTime) * 0.3;
            rightLeg.rotation.x = -Math.sin(moveTime) * 0.3;
            torso.rotation.z = 0.1; // Lean left

            // Actually move left
            const currentMove = progress * 25;
            const currentRotation = this.robot.group.rotation.y;
            const leftX = -Math.cos(currentRotation) * currentMove;
            const leftZ = Math.sin(currentRotation) * currentMove;
            this.robot.group.position.x = this.robot.position.x + leftX;
            this.robot.group.position.z = this.robot.position.z + leftZ;
        }
    }

    animateBackFast(progress) {
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;

        if (leftLeg && rightLeg && leftArm && rightArm) {
            const backTime = progress * Math.PI * 5;

            leftLeg.rotation.x = Math.sin(backTime) * 0.4;
            rightLeg.rotation.x = -Math.sin(backTime) * 0.4;
            leftArm.rotation.x = Math.sin(backTime) * 0.2;
            rightArm.rotation.x = -Math.sin(backTime) * 0.2;

            // Actually move backward fast
            const currentMove = progress * 35;
            const currentRotation = this.robot.group.rotation.y;
            const backwardX = -Math.sin(currentRotation) * currentMove;
            const backwardZ = -Math.cos(currentRotation) * currentMove;
            this.robot.group.position.x = this.robot.position.x + backwardX;
            this.robot.group.position.z = this.robot.position.z + backwardZ;
        }
    }

    // NEW STANDING ANIMATIONS
    animateStandUpBack(progress) {
        // Standing up from lying on back
        const torso = this.robot.parts.torso;
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;

        if (torso && leftArm && rightArm) {
            if (progress < 0.5) {
                // First half: lying down
                this.robot.group.position.y = this.robot.position.y - 30;
                torso.rotation.x = 0;
            } else {
                // Second half: standing up
                const standProgress = (progress - 0.5) / 0.5;
                this.robot.group.position.y = this.robot.position.y - 30 + (30 * standProgress);
                torso.rotation.x = Math.sin(standProgress * Math.PI) * 0.3;
                leftArm.rotation.x = -Math.sin(standProgress * Math.PI) * 0.5;
                rightArm.rotation.x = -Math.sin(standProgress * Math.PI) * 0.5;
            }
        }
    }

    animateStandUpFront(progress) {
        // Standing up from lying on front
        const torso = this.robot.parts.torso;
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;

        if (torso && leftArm && rightArm) {
            if (progress < 0.5) {
                // First half: lying down on front
                this.robot.group.position.y = this.robot.position.y - 25;
                this.robot.group.rotation.x = Math.PI / 2;
            } else {
                // Second half: standing up
                const standProgress = (progress - 0.5) / 0.5;
                this.robot.group.position.y = this.robot.position.y - 25 + (25 * standProgress);
                this.robot.group.rotation.x = (Math.PI / 2) * (1 - standProgress);
                leftArm.rotation.x = -Math.sin(standProgress * Math.PI) * 0.4;
                rightArm.rotation.x = -Math.sin(standProgress * Math.PI) * 0.4;
            }
        }
    }

    // NEW COMBAT ANIMATIONS
    // FIXED: Combat animations should face forward
    animateRightKick(progress) {
        const rightLeg = this.robot.parts.rightLeg;
        const torso = this.robot.parts.torso;

        if (rightLeg && torso) {
            // Kick forward (negative X rotation)
            const kickAngle = Math.sin(progress * Math.PI) * -1.0;
            rightLeg.rotation.x = kickAngle;
            torso.rotation.z = kickAngle * 0.2; // Lean for balance
        }
    }

    animateLeftKick(progress) {
        const leftLeg = this.robot.parts.leftLeg;
        const torso = this.robot.parts.torso;

        if (leftLeg && torso) {
            // Kick forward (negative X rotation)
            const kickAngle = Math.sin(progress * Math.PI) * -1.0;
            leftLeg.rotation.x = kickAngle;
            torso.rotation.z = -kickAngle * 0.2; // Lean for balance
        }
    }

    animateRightUppercut(progress) {
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (rightArm && torso) {
            const punchAngle = Math.sin(progress * Math.PI) * 0.8;
            rightArm.rotation.x = -punchAngle;
            rightArm.rotation.z = -punchAngle * 0.5;
            torso.rotation.y = -punchAngle * 0.3;
        }
    }

    animateLeftUppercut(progress) {
        const leftArm = this.robot.parts.leftArm;
        const torso = this.robot.parts.torso;

        if (leftArm && torso) {
            const punchAngle = Math.sin(progress * Math.PI) * 0.8;
            leftArm.rotation.x = -punchAngle;
            leftArm.rotation.z = punchAngle * 0.5;
            torso.rotation.y = punchAngle * 0.3;
        }
    }

    // FIXED: Wing Chun should have forward-facing strikes
    animateWingChun(progress) {
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (leftArm && rightArm && torso) {
            const wingChunTime = progress * Math.PI * 4;

            // Forward strikes (negative X rotation)
            leftArm.rotation.x = -Math.abs(Math.sin(wingChunTime)) * 0.6;
            rightArm.rotation.x = -Math.abs(Math.sin(wingChunTime + Math.PI / 2)) * 0.6;
            leftArm.rotation.z = Math.sin(wingChunTime * 0.7) * 0.3;
            rightArm.rotation.z = -Math.sin(wingChunTime * 0.7) * 0.3;
            torso.rotation.y = Math.sin(wingChunTime * 0.5) * 0.2;
        }
    }

    // FIXED: Shot animations should punch forward
    animateRightShotFast(progress) {
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (rightArm && torso) {
            const shotTime = progress * Math.PI * 3;
            // Forward punch (negative X rotation)
            const shotAngle = Math.sin(shotTime) * -0.7;
            rightArm.rotation.x = shotAngle;
            rightArm.position.z = this.originalPositions.rightArm.position.z + Math.abs(shotAngle) * 8;
            torso.rotation.y = shotAngle * 0.2;
        }
    }

    animateLeftShotFast(progress) {
        const leftArm = this.robot.parts.leftArm;
        const torso = this.robot.parts.torso;

        if (leftArm && torso) {
            const shotTime = progress * Math.PI * 3;
            // Forward punch (negative X rotation)
            const shotAngle = Math.sin(shotTime) * -0.7;
            leftArm.rotation.x = shotAngle;
            leftArm.position.z = this.originalPositions.leftArm.position.z + Math.abs(shotAngle) * 8;
            torso.rotation.y = -shotAngle * 0.2;
        }
    }

    // NEW EXERCISE ANIMATIONS
    animateChest(progress) {
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (leftArm && rightArm && torso) {
            const chestTime = progress * Math.PI * 4;

            // Chest expansion exercises
            leftArm.rotation.z = Math.PI / 3 + Math.sin(chestTime) * 0.3;
            rightArm.rotation.z = -Math.PI / 3 - Math.sin(chestTime) * 0.3;
            leftArm.rotation.x = Math.sin(chestTime * 0.7) * 0.2;
            rightArm.rotation.x = Math.sin(chestTime * 0.7) * 0.2;
            torso.scale.x = 1 + Math.abs(Math.sin(chestTime)) * 0.1;
        }
    }

    animateSquatUp(progress) {
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;
        const torso = this.robot.parts.torso;

        if (leftLeg && rightLeg && torso) {
            const squatTime = progress * Math.PI * 3;
            const squatDepth = Math.abs(Math.sin(squatTime)) * 20;

            this.robot.group.position.y = this.robot.position.y - squatDepth;
            leftLeg.rotation.x = Math.abs(Math.sin(squatTime)) * 0.5;
            rightLeg.rotation.x = Math.abs(Math.sin(squatTime)) * 0.5;
            torso.rotation.x = Math.abs(Math.sin(squatTime)) * 0.2;
        }
    }

    animateSquat(progress) {
        const leftLeg = this.robot.parts.leftLeg;
        const rightLeg = this.robot.parts.rightLeg;

        if (leftLeg && rightLeg) {
            // Single squat down
            const squatDepth = Math.sin(progress * Math.PI) * 15;
            this.robot.group.position.y = this.robot.position.y - squatDepth;
            leftLeg.rotation.x = Math.sin(progress * Math.PI) * 0.4;
            rightLeg.rotation.x = Math.sin(progress * Math.PI) * 0.4;
        }
    }

    animateWeightlifting(progress) {
        const leftArm = this.robot.parts.leftArm;
        const rightArm = this.robot.parts.rightArm;
        const torso = this.robot.parts.torso;

        if (leftArm && rightArm && torso) {
            const liftTime = progress * Math.PI * 3;
            const liftHeight = Math.abs(Math.sin(liftTime)) * 0.8;

            // Arms lifting weights overhead
            leftArm.rotation.x = -liftHeight;
            rightArm.rotation.x = -liftHeight;
            leftArm.rotation.z = 0.2;
            rightArm.rotation.z = -0.2;

            // Slight torso engagement
            torso.scale.x = 1 + Math.abs(Math.sin(liftTime)) * 0.05;
        }
    }
}

// Export for use
window.RobotAnimator = RobotAnimator;

console.log('🚀 Robot Animation System with 44 Actions loaded successfully!');
