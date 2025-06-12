# Windows Setup Guide

## 🪟 Running Humanoid Robot Simulator on Windows

This guide covers running the Humanoid Robot Simulator on Windows systems.

## 📋 Prerequisites

### Python Installation
1. Download Python 3.8+ from **https://python.org/downloads/**
2. During installation:
   - ✅ Check **"Add Python to PATH"**
   - ✅ Check **"Install pip"**
   - Choose **"Customize installation"** for advanced options
3. Verify installation:
   ```cmd
   python --version
   pip --version
   ```

### PowerShell Execution Policy (Optional)
If you want to use PowerShell scripts:
```powershell
# Check current policy
Get-ExecutionPolicy

# Allow local scripts (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🚀 Running the Simulator

### Method 1: PowerShell Script (Recommended)
```powershell
# Navigate to project directory
cd path\to\humanoid-robot-simulator

# Run with default port (5000)
.\run_simulator.ps1

# Run with custom port
.\run_simulator.ps1 -Port 8080

# Get help
.\run_simulator.ps1 -Help
```

### Method 2: Batch File
```cmd
# Navigate to project directory
cd path\to\humanoid-robot-simulator

# Run with default port (5000)
run_simulator.bat

# Run with custom port
run_simulator.bat 8080
```

### Method 3: Direct Python
```cmd
# Navigate to project directory
cd path\to\humanoid-robot-simulator

# Install dependencies
pip install -r requirements.txt

# Run simulator
python humanoid_robot_simulator.py
```

## 🧪 Testing the API

### PowerShell Test Script
```powershell
# Run comprehensive tests
.\test_humanoid_robots.ps1

# Test with custom URL
.\test_humanoid_robots.ps1 -BaseUrl "http://localhost:8080"

# Get help
.\test_humanoid_robots.ps1 -Help
```

### Manual API Testing with PowerShell
```powershell
# Get API information
Invoke-RestMethod -Uri "http://localhost:5000/"

# Get all robots status
Invoke-RestMethod -Uri "http://localhost:5000/status/all"

# Make robot_1 wave
$body = @{
    method = "RunAction"
    action = "wave"
    robot = "robot_1"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/run_action/robot_1" `
    -Method Post -ContentType "application/json" -Body $body

# Make all robots bow
$body = @{
    method = "RunAction"
    action = "bow"
    robot = "all"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/run_action/all" `
    -Method Post -ContentType "application/json" -Body $body
```

### Manual API Testing with curl (if installed)
```cmd
REM Get API information
curl -X GET http://localhost:5000/

REM Individual robot control
curl -X POST http://localhost:5000/run_action/robot_1 ^
  -H "Content-Type: application/json" ^
  -d "{\"method\":\"RunAction\",\"action\":\"wave\"}"

REM All robots control
curl -X POST http://localhost:5000/run_action/all ^
  -H "Content-Type: application/json" ^
  -d "{\"method\":\"RunAction\",\"action\":\"bow\"}"
```

## 🔧 Windows-Specific Features

### PowerShell Script Features
- ✅ Automatic Python version detection
- ✅ Virtual environment creation and activation
- ✅ Automatic package installation
- ✅ Colored output and progress indicators
- ✅ Error handling and troubleshooting
- ✅ Command-line parameter support
- ✅ Help system

### Batch File Features
- ✅ Compatible with older Windows versions
- ✅ No PowerShell execution policy requirements
- ✅ Automatic dependency installation
- ✅ Simple command-line interface
- ✅ Error handling

## 🎮 Controls

### Simulator Window
- **SPACE**: Pause/Resume simulation
- **R**: Reset all robots to idle
- **ESC**: Exit simulator
- **Mouse**: Click to focus window

### API Control
- **Individual robots**: `robot_1` through `robot_6`
- **All robots**: Use `robot_id = "all"`
- **26 actions**: wave, bow, kick, kung_fu, etc.

## 🐛 Troubleshooting

### Common Issues

**Python not found:**
```
❌ Python is not installed or not in PATH
```
**Solution**: Install Python and ensure "Add Python to PATH" is checked

**PowerShell execution policy:**
```
❌ Execution of scripts is disabled on this system
```
**Solution**: Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Package installation fails:**
```
❌ Failed to install pygame
```
**Solution**: 
- Update pip: `python -m pip install --upgrade pip`
- Install Visual C++ Build Tools if needed
- Try: `pip install pygame --user`

**Port already in use:**
```
❌ Address already in use
```
**Solution**: Use different port: `.\run_simulator.ps1 -Port 8080`

**Firewall blocking:**
```
❌ Connection refused
```
**Solution**: Allow Python through Windows Firewall

### Performance Tips

1. **Close unnecessary applications** for better pygame performance
2. **Use dedicated graphics** if available (not integrated)
3. **Run as administrator** if permission issues occur
4. **Disable antivirus real-time scanning** for the project folder (temporarily)

## 📁 File Structure

```
humanoid-robot-simulator/
├── humanoid_robot_simulator.py    # Main simulator
├── run_simulator.ps1              # PowerShell launcher
├── run_simulator.bat              # Batch launcher
├── test_humanoid_robots.ps1       # PowerShell test script
├── test_humanoid_robots.py        # Python test script
├── run_simulator.sh               # Linux/macOS launcher
├── requirements.txt               # Dependencies
├── README.md                      # Main documentation
├── WINDOWS_SETUP.md              # This file
└── venv/                         # Virtual environment (created automatically)
```

## 🎯 Next Steps

1. **Run the simulator** using your preferred method
2. **Test the API** with the test script
3. **Explore the 26 actions** available for the robots
4. **Build your own applications** using the REST API
5. **Contribute to the project** on GitHub

## 🌐 Web Interface

The simulator provides a REST API accessible from any programming language:

- **Python**: `requests` library
- **PowerShell**: `Invoke-RestMethod`
- **JavaScript**: `fetch()` or `axios`
- **C#**: `HttpClient`
- **Java**: `HttpURLConnection`
- **Any language** with HTTP support

Happy robot controlling! 🤖
