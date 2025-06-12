# Git Setup Guide

## Repository Information

- **GitHub Username**: `wongcyrus`
- **Repository URL**: `https://github.com/wongcyrus/humanoid-robot-simulator.git`
- **Local Path**: `/home/cyrus/mock_robot_simulator`

## Push to GitHub

```bash
# First time push (after creating repository on GitHub)
git push -u origin master

# Or if you prefer main branch
git branch -M main
git push -u origin main
```

## Clone Repository

```bash
# Clone your repository
git clone https://github.com/wongcyrus/humanoid-robot-simulator.git
cd humanoid-robot-simulator

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run the simulator
./run_simulator.sh
```

## Repository Already Configured

✅ **Git Configuration:**
- Remote origin: `https://github.com/wongcyrus/humanoid-robot-simulator.git`
- Author: `wongcyrus <wongcyrus@users.noreply.github.com>`
- Initial commit created with proper attribution

## Files Tracked by Git

✅ **Included in Git:**
- `humanoid_robot_simulator.py` - Main simulator
- `test_humanoid_robots.py` - Test script
- `run_simulator.sh` - Launch script
- `requirements.txt` - Dependencies
- `README.md` - Documentation
- `.gitignore` - Git ignore rules

❌ **Ignored by Git:**
- `venv/` - Virtual environment
- `*.log` - Log files
- `__pycache__/` - Python cache
- `*.pyc` - Compiled Python files
- `.env` - Environment variables
- OS specific files (`.DS_Store`, `Thumbs.db`)

## Recommended Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

## Creating the GitHub Repository

1. Go to https://github.com/wongcyrus
2. Click "New repository"
3. Repository name: `humanoid-robot-simulator`
4. Description: "6 Humanoid Robot Simulator with Web API - realistic visualization and synchronized control"
5. Make it Public (recommended for portfolio)
6. Don't initialize with README (we already have one)
7. Click "Create repository"
8. Run: `git push -u origin master`

## Branch Strategy

```bash
# Create feature branch
git checkout -b feature/new-robot-action

# Work on feature...

# Commit changes
git add .
git commit -m "Add new robot action: dance"

# Push feature branch
git push -u origin feature/new-robot-action

# Create pull request on GitHub
# After merge, switch back to main
git checkout master
git pull
git branch -d feature/new-robot-action
```

## Useful Git Commands

```bash
# View commit history
git log --oneline

# View changes
git diff

# View remote repositories
git remote -v

# Pull latest changes
git pull

# Check repository status
git status
```
