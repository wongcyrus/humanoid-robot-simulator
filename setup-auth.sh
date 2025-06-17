#!/bin/bash

# Authentication setup script for Google Cloud
# Run this before deploying to Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 Setting up Google Cloud Authentication${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed${NC}"
    echo -e "${YELLOW}💡 Install it from: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

# Check current authentication status
echo -e "${BLUE}📋 Checking current authentication status...${NC}"
CURRENT_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)

if [ -z "$CURRENT_ACCOUNT" ]; then
    echo -e "${YELLOW}⚠️ No active authentication found${NC}"
    echo -e "${BLUE}🔑 Starting authentication process...${NC}"
    gcloud auth login
else
    echo -e "${GREEN}✅ Already authenticated as: $CURRENT_ACCOUNT${NC}"
    read -p "Do you want to use this account? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🔑 Starting new authentication...${NC}"
        gcloud auth login
    fi
fi

# Set default project
echo -e "${BLUE}📋 Setting default project...${NC}"
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)

if [ -n "$CURRENT_PROJECT" ]; then
    echo -e "${GREEN}Current project: $CURRENT_PROJECT${NC}"
    read -p "Do you want to use this project? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your Google Cloud Project ID: " PROJECT_ID
        gcloud config set project $PROJECT_ID
    fi
else
    read -p "Enter your Google Cloud Project ID: " PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

# Verify project access
echo -e "${BLUE}🔍 Verifying project access...${NC}"
PROJECT_ID=$(gcloud config get-value project)
if gcloud projects describe $PROJECT_ID >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Successfully connected to project: $PROJECT_ID${NC}"
else
    echo -e "${RED}❌ Cannot access project: $PROJECT_ID${NC}"
    echo -e "${YELLOW}💡 Please check your project ID and permissions${NC}"
    exit 1
fi

# Configure Docker authentication for Artifact Registry
echo -e "${BLUE}🐳 Configuring Docker authentication for Artifact Registry...${NC}"
gcloud auth configure-docker us-central1-docker.pkg.dev --quiet

echo -e "${GREEN}🎉 Authentication setup completed!${NC}"
echo -e "${YELLOW}💡 You can now run: ./deploy.sh${NC}"
