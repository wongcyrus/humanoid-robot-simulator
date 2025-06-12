# GitHub Authentication Setup Guide

## 🔐 Authentication Required

GitHub requires authentication to push repositories. Here are the recommended methods:

## Method 1: Personal Access Token (Recommended)

### Step 1: Create Personal Access Token

1. Go to **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in the details:
   - **Note**: `Humanoid Robot Simulator`
   - **Expiration**: `90 days` (or your preference)
   - **Scopes**: Check ✅ `repo` (Full control of private repositories)
4. Click **"Generate token"**
5. **Copy the token** (you won't see it again!)

### Step 2: Push with Token

```bash
cd /home/cyrus/mock_robot_simulator

# Push using token (replace YOUR_TOKEN with actual token)
git push https://YOUR_TOKEN@github.com/wongcyrus/humanoid-robot-simulator.git master

# Or set up credential helper
git config credential.helper store
git push origin master
# Enter username: wongcyrus
# Enter password: YOUR_TOKEN
```

## Method 2: SSH Key (Alternative)

### Step 1: Generate SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "wongcyrus@users.noreply.github.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

### Step 2: Add SSH Key to GitHub

1. Go to **https://github.com/settings/keys**
2. Click **"New SSH key"**
3. Title: `Humanoid Robot Simulator`
4. Paste the public key content
5. Click **"Add SSH key"**

### Step 3: Change Remote to SSH

```bash
cd /home/cyrus/mock_robot_simulator

# Change remote URL to SSH
git remote set-url origin git@github.com:wongcyrus/humanoid-robot-simulator.git

# Push with SSH
git push -u origin master
```

## Method 3: GitHub CLI (Easiest)

### Install GitHub CLI

```bash
# Install GitHub CLI (if not installed)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### Authenticate and Push

```bash
cd /home/cyrus/mock_robot_simulator

# Authenticate with GitHub
gh auth login

# Create repository and push
gh repo create humanoid-robot-simulator --public --source=. --remote=origin --push
```

## 🎯 Current Repository Status

Your local repository is ready with:
- ✅ 3 commits
- ✅ 8 files (41KB)
- ✅ Remote configured: `https://github.com/wongcyrus/humanoid-robot-simulator.git`
- ✅ All files staged and committed

## 🚀 After Authentication

Once you set up authentication, run:

```bash
cd /home/cyrus/mock_robot_simulator
git push -u origin master
```

Your repository will be live at:
**https://github.com/wongcyrus/humanoid-robot-simulator**

## 📋 Quick Steps Summary

1. **Create Personal Access Token** at https://github.com/settings/tokens
2. **Copy the token**
3. **Run**: `git push https://YOUR_TOKEN@github.com/wongcyrus/humanoid-robot-simulator.git master`
4. **Done!** Repository will be live on GitHub

## 🔒 Security Note

- Never share your Personal Access Token
- Store it securely (password manager recommended)
- Set appropriate expiration date
- Use minimal required permissions
