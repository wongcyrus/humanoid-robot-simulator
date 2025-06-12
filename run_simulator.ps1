# Humanoid Robot Simulator - Windows PowerShell Launcher
# Compatible with Windows PowerShell 5.1+ and PowerShell Core 7+

param(
    [int]$Port = 5000,
    [switch]$Help
)

# Display help information
if ($Help) {
    Write-Host "🤖 Humanoid Robot Simulator - Windows Launcher" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\run_simulator.ps1 [Port]" -ForegroundColor White
    Write-Host "  .\run_simulator.ps1 -Port 8080" -ForegroundColor White
    Write-Host "  .\run_simulator.ps1 -Help" -ForegroundColor White
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Yellow
    Write-Host "  -Port    API port number (default: 5000)" -ForegroundColor White
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
function Install-PythonPackages {
    Write-Host "📦 Installing Python packages..." -ForegroundColor Yellow
    
    $packages = @("pygame", "flask", "flask-cors", "requests")
    
    foreach ($package in $packages) {
        Write-Host "   Installing $package..." -ForegroundColor Gray
        & python -m pip install $package --quiet
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install $package" -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host "✅ All packages installed successfully!" -ForegroundColor Green
}

# Function to test Python packages
function Test-PythonPackages {
    Write-Host "🔍 Checking Python packages..." -ForegroundColor Yellow
    
    $testScript = @"
try:
    import pygame
    import flask
    import flask_cors
    import requests
    print("✅ All packages available")
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
Write-Host "🤖 Humanoid Robot Simulator - Windows" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
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
if (-not (Test-PythonPackages)) {
    Install-PythonPackages
    
    # Test again after installation
    if (-not (Test-PythonPackages)) {
        Write-Host "❌ Package installation failed" -ForegroundColor Red
        exit 1
    }
}

# Check if simulator file exists
$simulatorFile = Join-Path $ScriptDir "humanoid_robot_simulator.py"
if (-not (Test-Path $simulatorFile)) {
    Write-Host "❌ humanoid_robot_simulator.py not found" -ForegroundColor Red
    Write-Host "Make sure you're running this script from the correct directory" -ForegroundColor Yellow
    exit 1
}

# Display startup information
Write-Host ""
Write-Host "🚀 Starting Humanoid Robot Simulator..." -ForegroundColor Green
Write-Host "🌐 Web API: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "📡 Robot IDs: robot_1, robot_2, robot_3, robot_4, robot_5, robot_6" -ForegroundColor Cyan
Write-Host "📡 Special ID: 'all' (controls all robots)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 API Examples:" -ForegroundColor Yellow
Write-Host "# Individual robot control:" -ForegroundColor Gray
Write-Host "Invoke-RestMethod -Uri 'http://localhost:$Port/run_action/robot_1' ``" -ForegroundColor White
Write-Host "  -Method Post -ContentType 'application/json' ``" -ForegroundColor White
Write-Host "  -Body '{`"method`":`"RunAction`",`"action`":`"wave`"}'" -ForegroundColor White
Write-Host ""
Write-Host "# All robots control:" -ForegroundColor Gray
Write-Host "Invoke-RestMethod -Uri 'http://localhost:$Port/run_action/all' ``" -ForegroundColor White
Write-Host "  -Method Post -ContentType 'application/json' ``" -ForegroundColor White
Write-Host "  -Body '{`"method`":`"RunAction`",`"action`":`"bow`"}'" -ForegroundColor White
Write-Host ""
Write-Host "# Get status:" -ForegroundColor Gray
Write-Host "Invoke-RestMethod -Uri 'http://localhost:$Port/status/all'" -ForegroundColor White
Write-Host ""
Write-Host "🎮 Local Controls: SPACE=Pause, R=Reset, ESC=Exit" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the simulator" -ForegroundColor Yellow
Write-Host ""

# Run the simulator
try {
    & python humanoid_robot_simulator.py $Port
}
catch {
    Write-Host "❌ Error running simulator: $_" -ForegroundColor Red
    exit 1
}
finally {
    Write-Host ""
    Write-Host "👋 Humanoid Robot Simulator stopped" -ForegroundColor Yellow
}
