# Git Setup Guide

## Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files (respecting .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: Humanoid Robot Simulator

- 6 humanoid robots (robot_1 to robot_6)
- Web API with 'all' robot support
- 26 humanoid actions with realistic animations
- Real-time pygame visualization
- Production-ready Flask API"

# Optional: Add remote repository
# git remote add origin https://github.com/yourusername/humanoid-robot-simulator.git
# git branch -M main
# git push -u origin main
```

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

# Push to remote (if configured)
git push
```

## Branch Strategy

```bash
# Create feature branch
git checkout -b feature/new-robot-action

# Work on feature...

# Commit changes
git add .
git commit -m "Add new robot action: dance"

# Switch back to main
git checkout main

# Merge feature
git merge feature/new-robot-action

# Delete feature branch
git branch -d feature/new-robot-action
```

## Useful Git Commands

```bash
# View commit history
git log --oneline

# View changes
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View remote repositories
git remote -v

# Pull latest changes
git pull
```
