# JJK Domain Expansion & Technique User Guide

Welcome to the Humanoid Robot Simulator's JJK-themed gesture control system. This guide explains how to trigger each Domain Expansion and Technique using hand signs.

## System Configuration
- **Camera Mode**: Control the 3D scene (Rotate, Zoom, Pan).
- **Domain Mode**: Strike a hand sign to trigger robot actions and visual effects.

---

## 1. Hand Techniques (Single & Double Hand)

Techniques are simpler gestures often used as building blocks.

| Technique | Japanese | Gesture (1H = Single Hand, 2H = Both Hands) |
| :--- | :--- | :--- |
| **Lapse Blue** | 術式順轉「苍」 | **(1H)** Point with your index finger; keep others curled. |
| **Reversal Red** | 術式反轉「赫」 | **(1H)** Open your palm wide with all fingers extended. |
| **Hollow Purple** | 虚式「茈」 | **(2H)** Show **Blue** on one hand and **Red** on the other. |

---

## 2. Domain Expansions

Domain Expansions are powerful gestures that trigger atmospheric changes and specific robot animations.

| User | Domain Name | Japanese | Gesture |
| :--- | :--- | :--- | :--- |
| **Gojo Satoru** | **Unlimited Void** | 無量空處 | **(1H)** Cross your index and middle fingers. |
| **Sukuna** | **Malevolent Shrine** | 伏魔御廚子 | **(2H)** Hands together side-by-side, fingers slightly curled like claws. |
| **Mahito** | **Self-Embodiment of Perfection** | 自閉圓頓裹 | **(2H)** Touch thumb-tips and pinky-tips together; palms facing you. |
| **Yuta Okkotsu** | **Authentic Mutual Love** | 真贋相愛 | **(2H)** Hands wide apart. One loose fist, one open palm. |
| **Hakari Kinji** | **Idle Death Gamble** | 坐殺博徒 | **(2H)** Stack hands vertically. Top hand 'OK' sign, bottom open. |
| **Megumi Fushiguro** | **Chimera Shadow Garden** | 嵌合暗翳庭園 | **(2H)** Two closed fists side-by-side. |
| **Naoya Zenin** | **Time Cell Moon Palace** | 時胞月宮殿 | **(2H)** Thumb and index extended (L-shape) on both hands. |
| **Yuji Itadori** | **Unnamed Domain** | 名称不明 | **(2H)** Both index fingers pointing toward each other. |

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
