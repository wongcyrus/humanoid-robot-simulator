# JJK Domain Expansion & Technique User Guide

Welcome to the Humanoid Robot Simulator's JJK-themed gesture control system. This guide explains how to trigger each Domain Expansion and Technique using hand signs.

## System Configuration
- **Camera Mode**: Control the 3D scene (Rotate, Zoom, Pan).
- **Domain Mode**: Strike a hand sign to trigger robot actions and visual effects.

---

## 1. Hand Techniques (Single & Double Hand)

Techniques are simpler gestures often used as building blocks.

| Technique | Japanese | Gesture | Robot Behavior |
| :--- | :--- | :--- | :--- |
| **Lapse Blue** | 術式順轉「苍」 | **(1H)** Point index; others curled. | **Attraction**: Left hand strike. |
| **Reversal Red** | 術式反轉「赫」 | **(1H)** Open palm wide. | **Repulsion**: Right hand upward strike. |
| **Hollow Purple** | 虚式「茈」 | **(2H)** Blue + Red signs. | **Total Purge**: 2-hand chest expansion blast. |

---

## 2. Domain Expansions

Domain Expansions are powerful gestures that trigger atmospheric changes and unique robot animations.

| User | Domain Name | Gesture | Robot Behavior |
| :--- | :--- | :--- | :--- |
| **Gojo Satoru** | **Unlimited Void** | **(1H)** Crossed fingers. | **Ascension**: Floats and rotates at high speed. |
| **Sukuna** | **Malevolent Shrine** | **(2H)** Claw hands. | **Desolation**: Deep squat and intense ground shaking. |
| **Mahito** | **Self-Embodiment** | **(2H)** Egg shape. | **Mutation**: Wavy, organic body pulsations. |
| **Yuta Okkotsu** | **Authentic Love** | **(2H)** Wide apart. | **Embrace**: Pulsing scale followed by hugging motion. |
| **Hakari Kinji** | **Idle Death Gamble** | **(2H)** Vertical stack. | **Jackpot**: Rapid spinning and celebratory jumps. |
| **Megumi Fushiguro** | **Chimera Garden** | **(2H)** Two fists. | **Submerge**: Dives into shadows and re-emerges. |
| **Naoya Zenin** | **Time Cell Palace** | **(2H)** L-shape hands. | **Projection**: Jittery, frame-by-frame high-speed motion. |
| **Yuji Itadori** | **Unnamed Domain** | **(2H)** Pointing fingers. | **Physical Mastery**: High-intensity sit-ups. |

---

## Tips for Best Performance

1.  **Stability is Key**: Hold your gesture for at least **0.5 to 1 second**. The system requires consistent detection across multiple frames to prevent accidental triggers.
2.  **Distance from Camera**: Keep your hands roughly 2-4 feet (0.5-1 meter) from the webcam. Your entire hand(s) must be visible.
3.  **Lighting**: Avoid strong backlighting (e.g., sitting with a window behind you). Ensure your hands are well-lit.
4.  **Hardware Cooldown**: Note that real robots have a hardware cooldown (default 10s) to prevent mechanical strain. The simulation cooldown is much shorter (default 2s).
5.  **Skeleton Feedback**: Watch the on-screen skeleton. If it changes color to match the domain (e.g., Red for Sukuna), the system has successfully recognized your sign.

---

## Credits

This gesture control system is powered by the logic and models from the following projects:
- **[JJK Domain Expansion (TheAgencyMGE)](https://github.com/TheAgencyMGE/JJKDomainExpansion)**
- **[Domain Expansion (montasirmoyen)](https://github.com/montasirmoyen/domain-expansion)**

Integrated into the **[Humanoid Robot Simulator](https://github.com/wongcyrus/humanoid-robot-simulator)**.
