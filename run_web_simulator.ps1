# 3D Web Humanoid Robot Simulator - Windows PowerShell Launcher

param(
    [int]$Port = 5000,
    [switch]$Help
)

# Display help information
if ($Help) {
    Write-Host "🌐 3D Web Humanoid Robot Simulator - Windows Launcher" -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\run_web_simulator.ps1 [Port]" -ForegroundColor White
    Write-Host "  .\run_web_simulator.ps1 -Port 8080" -ForegroundColor White
    Write-Host "  .\run_web_simulator.ps1 -Help" -ForegroundColor White
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Yellow
    Write-Host "  -Port    Web server port number (default: 5000)" -ForegroundColor White
    Write-Host "  -Help    Show this help message" -ForegroundColor White
    Write-Host ""
    exit 0
}

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to install Python packages
function Install-WebPackages {
    Write-Host "📦 Installing web dependencies..." -ForegroundColor Yellow
    
    $packages = @("flask", "flask-cors", "flask-socketio", "python-socketio", "eventlet", "requests")
    
    foreach ($package in $packages) {
        Write-Host "   Installing $package..." -ForegroundColor Gray
        & python -m pip install $package --quiet
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install $package" -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host "✅ All web packages installed successfully!" -ForegroundColor Green
}

# Function to test Python packages
function Test-WebPackages {
    Write-Host "🔍 Checking web dependencies..." -ForegroundColor Yellow
    
    $testScript = @"
try:
    import flask
    import flask_socketio
    import eventlet
    import requests
    print("✅ All web packages available")
except ImportError as e:
    print(f"❌ Missing package: {e}")
    exit(1)
"@
    
    $result = & python -c $testScript 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host $result -ForegroundColor Red
        return $false
    }
    
    Write-Host $result -ForegroundColor Green
    return $true
}

# Main script
Write-Host "🌐 3D Web Humanoid Robot Simulator - Windows" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Check if Python is installed
if (-not (Test-Command "python")) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    exit 1
}

# Check Python version
$pythonVersion = & python --version 2>&1
Write-Host "🐍 Found: $pythonVersion" -ForegroundColor Green

# Check if virtual environment exists
$venvPath = Join-Path $ScriptDir "venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "📁 Creating virtual environment..." -ForegroundColor Yellow
    & python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
}

# Activate virtual environment
$activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
if (Test-Path $activateScript) {
    Write-Host "🔄 Activating virtual environment..." -ForegroundColor Yellow
    & $activateScript
} else {
    Write-Host "⚠️  Virtual environment activation script not found, using global Python" -ForegroundColor Yellow
}

# Check and install packages
if (-not (Test-WebPackages)) {
    Install-WebPackages
    
    # Test again after installation
    if (-not (Test-WebPackages)) {
        Write-Host "❌ Package installation failed" -ForegroundColor Red
        exit 1
    }
}

# Check if simulator file exists
$simulatorFile = Join-Path $ScriptDir "web_humanoid_simulator.py"
if (-not (Test-Path $simulatorFile)) {
    Write-Host "❌ web_humanoid_simulator.py not found" -ForegroundColor Red
    Write-Host "Make sure you're running this script from the correct directory" -ForegroundColor Yellow
    exit 1
}

# Display startup information
Write-Host ""
Write-Host "🚀 Starting 3D Web Humanoid Robot Simulator..." -ForegroundColor Green
Write-Host "🌐 Open your browser to: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "📡 Robot IDs: robot_1, robot_2, robot_3, robot_4, robot_5, robot_6" -ForegroundColor Cyan
Write-Host "📡 Special ID: 'all' (controls all robots)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎮 Browser Controls:" -ForegroundColor Yellow
Write-Host "  Mouse: Rotate 3D camera" -ForegroundColor Gray
Write-Host "  Scroll: Zoom in/out" -ForegroundColor Gray
Write-Host "  Keyboard: 1-4 (actions), WASD (movement), Space (jump), Esc (stop all)" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Features:" -ForegroundColor Yellow
Write-Host "  ✅ 3D humanoid robots with realistic animations" -ForegroundColor Green
Write-Host "  ✅ Real-time WebSocket communication" -ForegroundColor Green
Write-Host "  ✅ 28 different actions including dance and jump" -ForegroundColor Green
Write-Host "  ✅ Individual and synchronized robot control" -ForegroundColor Green
Write-Host "  ✅ Interactive 3D camera controls" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the simulator" -ForegroundColor Yellow
Write-Host ""

# Run the web simulator
try {
    & python web_humanoid_simulator.py $Port
}
catch {
    Write-Host "❌ Error running web simulator: $_" -ForegroundColor Red
    exit 1
}
finally {
    Write-Host ""
    Write-Host "👋 3D Web Humanoid Robot Simulator stopped" -ForegroundColor Yellow
}
