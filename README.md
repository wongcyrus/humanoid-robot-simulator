# Humanoid Robot Simulator | 人形機器人模擬器

A production-ready 6-robot humanoid simulator with **3D web interface**, **44 realistic actions**, and **comprehensive management APIs**.
一款具備 **3D 網頁介面**、**44 種擬真動作** 以及 **全面管理 API** 的生產級 6 機器人模擬器。

[![Python](https://img.shields.io/badge/Python-3.8+-green?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0+-red?logo=flask)](https://flask.palletsprojects.com)
[![Three.js](https://img.shields.io/badge/Three.js-r128-orange?logo=javascript)](https://threejs.org)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-purple?logo=websocket)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com)

---

## 🖐️ Hand Gesture Control (JJK Domain Expansion) | 手勢控制 (咒術迴戰 領域展開)

[![Domain Expansion Demo](https://img.youtube.com/vi/Tck6WSV_YXQ/0.jpg)](https://www.youtube.com/watch?v=Tck6WSV_YXQ)

### 🎮 [Play the Game Now | 立即開始遊戲](https://wongcyrus.github.io/domain-expansion-ar-game/)

The simulator features an advanced hand-tracking system that allows you to trigger robot actions and immersive visual effects using signature hand signs from *Jujutsu Kaisen*.
本模擬器具備先進的手部追蹤系統，讓您可以使用《咒術迴戰》中的標誌性手印來觸發機器人動作與沉浸式視覺效果。

### Domain Expansions | 領域展開

| User | Domain Name | Gesture | Robot Behavior | 角色 | 領域名稱 | 手印 | 機器人行為 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Gojo Satoru** | **Unlimited Void** | **(1H)** Crossed fingers | **Ascension**: Floats and rotates. | **五條悟** | **無量空處** | **(單手)** 交叉食指與中指 | **升天**: 向上漂浮並旋轉。 |
| **Sukuna** | **Malevolent Shrine** | **(2H)** Claw hands | **Desolation**: Sharp martial arts strikes. | **兩面宿儺** | **伏魔御廚子** | **(雙手)** 合十且手指如爪 | **荒蕪**: 尖銳的武術打擊。 |
| **Mahito** | **Self-Embodiment** | **(2H)** Egg shape | **Mutation**: Wavy pulsations. | **真人** | **自閉圓頓裹** | **(雙手)** 拇指小指相觸 | **突變**: 波浪狀有機脈動。 |
| **Yuta Okkotsu** | **Authentic Love** | **(2H)** Wide apart | **Embrace**: Respectful bow with Rika phantom background. | **乙骨憂太** | **真贋相愛** | **(雙手)** 雙手拉開 | **擁抱**: 莊重的鞠躬，背景出現里香虛影。 |
| **Hakari Kinji** | **Idle Death Gamble** | **(2H)** Vertical stack | **Jackpot**: Upbeat rhythmic waving. | **秤金次** | **坐殺博徒** | **(雙手)** 垂直疊放 | **大獎**: 歡快的節奏揮手。 |
| **Megumi Fushiguro** | **Chimera Garden** | **(2H)** Two fists | **Submerge**: Shadow strength simulation (Weightlifting). | **伏黑惠** | **嵌合暗翳庭園** | **(雙手)** 雙拳併攏 | **下沉**: 影之力量 (舉重)。 |
| **Naoya Zenin** | **Time Cell Palace** | **(2H)** L-shape hands | **Projection**: Frame-by-frame strike (Left Shot). | **禪院直哉** | **時胞月宮殿** | **(雙手)** 雙手呈 L 型 | **投射**: 影格打擊 (左衝)。 |
| **Yuji Itadori** | **Unnamed Domain** | **(2H)** Pointing fingers | **Physical Mastery**: High-intensity sit-ups. | **虎杖悠仁** | **名稱不明** | **(雙手)** 食指相對 | **肉體巔峰**: 高強度仰臥起坐。 |

### Techniques | 術式

| Technique | Japanese | Gesture | Robot Behavior | 術式名稱 | 日文 | 手印 | 機器人行為 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Lapse Blue** | 術式順轉「苍」 | **(1H)** Index Point | **Attraction**: Left hand upward strike. | **「蒼」** | 術式順轉「苍」 | **(單手)** 食指指點 | **吸引**: 左手向上打擊。 |
| **Reversal Red** | 術式反轉「赫」 | **(1H)** Open Palm | **Repulsion**: Right hand upward strike. | **「赫」** | 術式反轉「赫」 | **(單手)** 手掌張開 | **排斥**: 右手向上打擊。 |
| **Hollow Purple** | 虚式「茈」 | **(2H)** Blue + Red | **Total Purge**: 2-hand expansion blast. | **「茈」** | 虚式「茈」 | **(雙手)** 藍 + 紅 組合 | **肅清**: 雙手胸部擴張衝擊。 |

---

## 🎯 Overview | 概覽

This comprehensive robot simulator provides:
本全面機器人模擬器提供：

### 🌐 **Core Features | 核心功能**
- **3D Web Interface**: Browser-based 3D visualization with Three.js and WebSocket
  **3D 網頁介面**：基於 Three.js 和 WebSocket 的網頁 3D 視覺化
- **6 Humanoid Robots**: `robot_1` through `robot_6` with facial features and direction indicators
  **6 個人形機器人**：`robot_1` 到 `robot_6`，具備面部特徵與方向指示
- **44 Realistic Actions**: Complete action library with dance, combat, exercise, and movement
  **44 種擬真動作**：完整的動作庫，包含舞蹈、戰鬥、運動與移動
- **Accurate Timing**: Each action uses realistic duration (1-85 seconds)
  **精確計時**：每個動作均使用擬真時長（1-85 秒）
- **Group Control**: Use `robot_id = "all"` to control all robots simultaneously
  **群組控制**：使用 `robot_id = "all"` 同時控制所有機器人
- **Real-time Communication**: WebSocket for instant updates and control
  **即時通訊**：使用 WebSocket 進行即時更新與控制

### 🔧 **Advanced Features | 進階功能**
- **Robot Management API**: Add, remove, and manage robots dynamically
  **機器人管理 API**：動態新增、刪除與管理機器人
- **Video Management**: Dynamic video source changing and playback control
  **影片管理**：動態影片來源切換與播放控制
- **Session Management**: Multi-user session support
  **會話管理**：支援多使用者會話
- **Docker Support**: Containerized deployment
  **Docker 支援**：容器化部署
- **Comprehensive Testing**: Extensive test suite with multiple scenarios
  **全面測試**：包含多種情境的廣泛測試套件

## ✨ Key Features | 主要特徵

### 🎮 **Complete Action Library (44 Actions) | 完整動作庫**
- **💃 Dance Collection**: 10 unique dance styles (52-85 seconds each)
- **🥋 Combat Arsenal**: Kung Fu, Wing Chun, kicks, punches, uppercuts
- **💪 Exercise Suite**: Push-ups, sit-ups, squats, weightlifting, chest exercises
- **🚶 Enhanced Movement**: Forward, backward, turns, fast movements
- **🎭 Basic Actions**: Wave, bow, jump, celebrate, think, standing poses

### 👁️ **Visual Enhancements | 視覺強化**
- **Robot Faces**: Clear eyes, nose, and direction arrows
- **Proper Directions**: All combat actions face forward correctly
- **Realistic Exercises**: Push-ups end standing, sit-ups end sitting
- **Position Memory**: Robots remember location after non-movement actions

## 🚀 Quick Start | 快速開始

### Prerequisites | 先決條件
- Python 3.8+
- Git

### Installation | 安裝

```bash
# Clone the repository
git clone <repository-url>
cd humanoid-robot-simulator

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Simulator | 運行模擬器

```bash
# Start the 3D web simulator
./run_web_simulator.sh

# Or run directly
python3 app.py
```

Then open your browser to: **http://localhost:5000**

### Docker Deployment | Docker 部署

```bash
# Using Docker Compose (Recommended)
docker-compose up -d

# Or build and run manually
docker build -t robot-simulator .
docker run -p 5000:5000 robot-simulator
```

## 📁 Project Structure | 專案結構

```
humanoid-robot-simulator/
├── app.py                        # Main Flask application
├── requirements.txt              # Python dependencies
├── docker-compose.yml           # Docker Compose configuration
├── Dockerfile                    # Docker container setup
├── run_web_simulator.sh          # Web simulator launcher
├── constants.py                  # Application constants
├── docs/                         # Comprehensive documentation
│   ├── README.md                 # Documentation index
│   ├── API_REFERENCE.md          # Complete API documentation
│   └── DEPLOYMENT.md             # Deployment guide
├── models/
│   └── robot.py                  # Robot data models
├── routes/
│   └── api_routes.py             # API route definitions
├── handlers/
│   └── websocket_handlers.py     # WebSocket event handlers
├── server/
│   ├── websocket_server.py       # WebSocket server
│   └── session_manager.py        # Session management
├── templates/
│   └── index.html                # Main web interface
├── static/
│   ├── css/style.css             # Web interface styling
│   ├── js/
│   │   ├── simulator.js          # Main simulator logic
│   │   ├── robot3d.js            # 3D robot visualization
│   │   └── robot_animations.js   # 44 action animations
│   ├── img/                      # Images and logos
│   └── video/                    # Video files
└── test_commands/                # Comprehensive test suite
    ├── README.md                 # Test documentation
    ├── basic_actions.sh          # Basic action tests
    ├── movement_actions.sh       # Movement tests
    ├── dance_actions.sh          # Dance animation tests
    ├── combat_exercise.sh        # Combat and exercise tests
    ├── robot_management.sh       # Robot management tests
    ├── complex_scenarios.sh      # Complex scenario tests
    └── error_testing.sh          # Error handling tests
```

## 📡 API Documentation | API 文件

### Basic Robot Control | 基礎機器人控制

#### Individual Robot Control
```bash
curl -X POST http://localhost:5000/run_action/robot_1?session_key=YOUR_SESSION_ID \
  -H 'Content-Type: application/json' \
  -d '{"method":"RunAction","action":"dance_two"}'
```

#### All Robots Control
```bash
curl -X POST http://localhost:5000/run_action/all?session_key=YOUR_SESSION_ID \
  -H 'Content-Type: application/json' \
  -d '{"method":"RunAction","action":"kung_fu"}'
```

#### Status Monitoring
```bash
curl -X GET http://localhost:5000/api/status
```

### Robot Management API | 機器人管理 API

#### List All Robots
```bash
GET /api/robots
```

#### Remove Robot
```bash
DELETE /api/remove_robot/robot_1    # Remove specific robot
DELETE /api/remove_robot/all        # Remove all robots
```

#### Add Robot
```bash
POST /api/add_robot
Content-Type: application/json

{
    "robot_id": "robot_7",
    "position": [10, 0, 10],
    "color": "#FF5733"
}
```

### Video Management API | 影片管理 API

#### Change Video Source
```bash
POST /api/video/change_source?session_key=YOUR_SESSION_KEY
Content-Type: application/json

{
    "video_src": "/static/video/new-video.mp4"
}
```

#### Control Video Playback
```bash
POST /api/video/control?session_key=YOUR_SESSION_KEY
Content-Type: application/json

{
    "action": "play"  # "play", "pause", or "toggle"
}
```

## 🤖 Robot IDs | 機器人 ID

- `robot_1` through `robot_6` - Individual robots
- `all` - Special ID to control all robots simultaneously

## 🎭 Available Actions (44 Total) | 可用動作

### 💃 Dance Collection (10 actions)
`dance`, `dance_two`, `dance_three`, `dance_four`, `dance_five`, `dance_six`, `dance_seven`, `dance_eight`, `dance_nine`, `dance_ten`

### 🥋 Combat Moves (10 actions)
`kung_fu`, `wing_chun`, `kick`, `punch`, `right_kick`, `left_kick`, `right_uppercut`, `left_uppercut`, `right_shot_fast`, `left_shot_fast`

### 💪 Exercise & Fitness (7 actions)
`push_ups`, `sit_ups`, `squat`, `squat_up`, `weightlifting`, `chest`, `jumping_jacks`

### 🚶 Movement (9 actions)
`go_forward`, `go_backward`, `turn_left`, `turn_right`, `right_move_fast`, `left_move_fast`, `back_fast`, `stepping`, `twist`

### 🎯 Basic & Special (8 actions)
`wave`, `bow`, `jump`, `celebrate`, `think`, `stand_up_back`, `stand_up_front`, `idle`

## 🎮 Web Interface Controls | 網頁介面控制

- **👁️ Robot Faces**: Each robot has clear directional indicators
- **🖱️ Mouse Drag**: Rotate camera around robots
- **🖱️ Mouse Wheel**: Zoom in/out
- **🟢 Green Buttons**: Movement actions (actually move robots)
- **🔵 Blue Buttons**: Animation actions (visual effects only)
- **🎯 Robot Selection**: Choose individual robots or "all"
- **⏱️ Realistic Timing**: Each action uses proper duration
- **🎬 Video Controls**: Change video sources and control playback
- **🤖 Robot Management**: Add/remove robots dynamically

## ⏱️ Action Timing System | 動作計時系統

The simulator processes actions sequentially with realistic timing:

### Dance Actions (Long Duration)
- `dance_two` - `dance_ten`: 52-85 seconds each

### Movement Actions
- `go_forward`, `go_backward`: 3-4 seconds
- `turn_left`, `turn_right`: 4 seconds
- `stepping`: 3 seconds
- `twist`: 4 seconds

### Combat Actions
- `kung_fu`, `wing_chun`: 2 seconds
- `kick`, `punch`, `uppercut`: 2 seconds
- `shot_fast`: 4 seconds

### Exercise Actions
- `push_ups`: 9 seconds
- `sit_ups`: 12 seconds
- `squat`: 1-6 seconds
- `weightlifting`: 9 seconds

### Basic Actions
- `wave`, `bow`, `jump`: 2-4 seconds
- `celebrate`, `think`: 3-4 seconds

## 🧪 Testing | 測試

The project includes comprehensive testing tools in the `test_commands/` directory:

```bash
# Make scripts executable
chmod +x test_commands/*.sh

# Run different test categories
./test_commands/basic_actions.sh      # Basic robot actions
./test_commands/movement_actions.sh   # Movement commands
./test_commands/dance_actions.sh      # Dance animations
./test_commands/combat_exercise.sh    # Combat moves and exercises
./test_commands/robot_management.sh   # Add/remove robots
./test_commands/complex_scenarios.sh  # Sequential scenarios
./test_commands/error_testing.sh      # Error handling
```

## 🐳 Docker Support | Docker 支援

### Quick Start with Docker Compose
```bash
docker-compose up -d
```

### Manual Docker Commands
```bash
# Build image
docker build -t robot-simulator .

# Run container
docker run -p 5000:5000 robot-simulator

# View logs
docker logs <container_id>

# Stop container
docker stop <container_id>
```

### Environment Variables | 環境變數
- `FLASK_ENV`: Set to `production` for production deployment
- `PYTHONPATH`: Set to `/app` (default in Dockerfile)

## ✅ Features | 特徵

- ✅ **Clean, optimized codebase** - Well-structured and maintainable
- ✅ **Production-ready web API** - Comprehensive REST API with error handling
- ✅ **Real-time 3D robot visualization** - WebSocket-powered live updates
- ✅ **44 realistic actions with proper timing** - Complete action library
- ✅ **Individual and group robot control** - Flexible robot management
- ✅ **Robot faces with direction indicators** - Enhanced visual feedback
- ✅ **Dynamic robot management** - Add/remove robots on-the-fly
- ✅ **Video management system** - Dynamic video source control
- ✅ **Session-based architecture** - Multi-user support
- ✅ **Docker containerization** - Easy deployment and scaling
- ✅ **Comprehensive test suite** - Extensive testing tools
- ✅ **Cross-platform compatibility** - Works on Linux, Windows, macOS
- ✅ **Detailed documentation** - Complete API and usage documentation

## 🌐 Live Demo | 線上演示

1. Start the simulator:
   ```bash
   ./run_web_simulator.sh
   ```

2. Visit: **http://localhost:5000**

3. Experience 6 humanoid robots with faces, 44 realistic actions, video management, and complete 3D control!

## 🔧 Development | 開發

### Documentation
Complete documentation is available in the `docs/` directory:
- **[API Reference](docs/API_REFERENCE.md)** - Detailed API documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Comprehensive deployment instructions

### Project Architecture
- **Flask Backend**: REST API and WebSocket server
- **Three.js Frontend**: 3D visualization and animations
- **WebSocket Communication**: Real-time bidirectional updates
- **Session Management**: Multi-user session handling
- **Modular Design**: Separated concerns for maintainability

### Key Components
- `app.py`: Main Flask application entry point
- `models/robot.py`: Robot data models and state management
- `routes/api_routes.py`: REST API endpoint definitions
- `handlers/websocket_handlers.py`: WebSocket event processing
- `server/websocket_server.py`: WebSocket server implementation
- `static/js/robot3d.js`: 3D scene and robot visualization
- `static/js/simulator.js`: Main frontend application logic

---

## 🛠️ Technology & Hand Tracking | 技術與手勢追蹤

This project uses **MediaPipe Hands** by Google to achieve real-time, high-fidelity hand and finger tracking.
本專案使用 Google 的 **MediaPipe Hands** 技術，實現高精度的即時手部與手指追蹤。

### How it Works | 運作原理

1.  **Landmark Detection | 關鍵點檢測**: The AI model identifies **21 3D hand landmarks** (knuckles, fingertips, wrist) for each hand.
    AI 模型會識別每隻手的 **21 個 3D 手部關鍵點**（關節、指尖、手腕）。
2.  **Gesture Geometric Logic | 手勢幾何邏輯**:
    *   **Finger State | 手指狀態**: We calculate the distance between knuckles (MCP) and fingertips. If the tip is significantly further from the wrist than the knuckle, the finger is "Extended"; otherwise, it is "Curled".
        我們計算關節 (MCP) 與指尖的距離。若指尖遠離手腕則判定為「伸直」，反之則為「彎曲」。
    *   **Proximity Detection | 近似檢測**: Complex signs (like Mahito's) are detected by checking the distance between specific landmarks across both hands (e.g., pinky tips touching).
        複雜的手印（如真人的自閉圓頓裹）是透過檢測兩手特定關鍵點之間的距離（如小指指尖相觸）來識別的。
3.  **Stability Buffering | 穩定緩衝**: To prevent flickering, a gesture must be detected in at least **6 out of 10 consecutive frames** before it is considered "Stable" and sent to the robots.
    為防止視覺抖動，手勢必須在連續 **10 幀中出現至少 6 幀**，才會被判定為「穩定」並發送指令給機器人。

---

## 📄 License | 許可證

This project is open source and available under the MIT License.
本專案為開源專案，根據 MIT 許可證發佈。

## 📚 Credits & References | 致謝與參考

This project integrates and builds upon the following open-source works:
本專案整合並建基於以下開源作品：

1.  **[Humanoid Robot Simulator](https://github.com/wongcyrus/humanoid-robot-simulator)**: Core simulation engine.
2.  **[JJK Domain Expansion (TheAgencyMGE)](https://github.com/TheAgencyMGE/JJKDomainExpansion)**: Gesture models and VFX logic.
3.  **[Domain Expansion (montasirmoyen)](https://github.com/montasirmoyen/domain-expansion)**: Atmospheric effects inspiration.

---

## ⚖️ Copyright Disclaimer | 版權聲明

This project is a **non-commercial, fan-made application** created for educational and entertainment purposes only. 
本專案為**非商業性質的愛好者作品**，僅供教學與娛樂用途。

*   **Intellectual Property**: All rights to **"Jujutsu Kaisen"**, including but not limited to characters (e.g., Gojo Satoru, Sukuna, Yuta Okkotsu), logos, images (e.g., Rika), and specific terminology (e.g., "Domain Expansion"), belong to the original creator **Gege Akutami**, the publisher **Shueisha**, and the **MAPPA** production committee.
*   **No Infringement Intended**: This project is not affiliated with or endorsed by any of the aforementioned entities. No copyright infringement is intended.
*   **知識產權**：《術式迴戰》的所有權利（包括但不限於角色、標誌、圖片及相關術語）均歸原作者**芥見下下**、**集英社**及 **MAPPA** 製作委員會所有。
*   **無意侵權**：本專案與上述實體無關，亦未獲得其授權。本專案無意侵犯任何版權。

---

## 🤝 Contributing | 貢獻

Contributions are welcome! Please feel free to submit a Pull Request.
歡迎貢獻！請隨時提交 Pull Request。
