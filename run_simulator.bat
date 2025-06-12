@echo off
REM Humanoid Robot Simulator - Windows Batch Launcher
REM Compatible with Windows 7+ Command Prompt

setlocal enabledelayedexpansion

REM Parse command line arguments
set PORT=5000
if not "%1"=="" set PORT=%1

REM Display header
echo.
echo 🤖 Humanoid Robot Simulator - Windows
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    echo Make sure to check 'Add Python to PATH' during installation
    pause
    exit /b 1
)

REM Display Python version
for /f "tokens=*" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo 🐍 Found: !PYTHON_VERSION!

REM Check if virtual environment exists
if not exist "venv" (
    echo 📁 Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
    echo ✅ Virtual environment created!
)

REM Activate virtual environment
if exist "venv\Scripts\activate.bat" (
    echo 🔄 Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo ⚠️  Virtual environment activation script not found, using global Python
)

REM Check if packages are installed
echo 🔍 Checking Python packages...
python -c "import pygame, flask, flask_cors, requests; print('✅ All packages available')" 2>nul
if errorlevel 1 (
    echo 📦 Installing Python packages...
    echo    Installing pygame...
    python -m pip install pygame --quiet
    if errorlevel 1 (
        echo ❌ Failed to install pygame
        pause
        exit /b 1
    )
    
    echo    Installing flask...
    python -m pip install flask --quiet
    if errorlevel 1 (
        echo ❌ Failed to install flask
        pause
        exit /b 1
    )
    
    echo    Installing flask-cors...
    python -m pip install flask-cors --quiet
    if errorlevel 1 (
        echo ❌ Failed to install flask-cors
        pause
        exit /b 1
    )
    
    echo    Installing requests...
    python -m pip install requests --quiet
    if errorlevel 1 (
        echo ❌ Failed to install requests
        pause
        exit /b 1
    )
    
    echo ✅ All packages installed successfully!
) else (
    echo ✅ All packages available
)

REM Check if simulator file exists
if not exist "humanoid_robot_simulator.py" (
    echo ❌ humanoid_robot_simulator.py not found
    echo Make sure you're running this script from the correct directory
    pause
    exit /b 1
)

REM Display startup information
echo.
echo 🚀 Starting Humanoid Robot Simulator...
echo 🌐 Web API: http://localhost:%PORT%
echo 📡 Robot IDs: robot_1, robot_2, robot_3, robot_4, robot_5, robot_6
echo 📡 Special ID: 'all' (controls all robots)
echo.
echo 🚀 API Examples:
echo # Individual robot control (using curl):
echo curl -X POST http://localhost:%PORT%/run_action/robot_1 ^
echo   -H "Content-Type: application/json" ^
echo   -d "{\"method\":\"RunAction\",\"action\":\"wave\"}"
echo.
echo # All robots control:
echo curl -X POST http://localhost:%PORT%/run_action/all ^
echo   -H "Content-Type: application/json" ^
echo   -d "{\"method\":\"RunAction\",\"action\":\"bow\"}"
echo.
echo # Get status:
echo curl -X GET http://localhost:%PORT%/status/all
echo.
echo 🎮 Local Controls: SPACE=Pause, R=Reset, ESC=Exit
echo Press Ctrl+C to stop the simulator
echo.

REM Run the simulator
python humanoid_robot_simulator.py %PORT%
if errorlevel 1 (
    echo ❌ Error running simulator
    pause
    exit /b 1
)

echo.
echo 👋 Humanoid Robot Simulator stopped
pause
