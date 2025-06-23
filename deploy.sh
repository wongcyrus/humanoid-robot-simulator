#!/bin/bash

# Deploy Humanoid Robot Simulator to Google Cloud Run
# This script builds and deploys the application to Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
PROJECT_ID="robot-adk-agent"
REGION="us-central1"
SERVICE_NAME="humanoid-robot-simulator"
REPO_NAME="humanoid-robot-repo"
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}"

print_usage() {
    echo "Usage: $0 [-p PROJECT_ID] [-r REGION] [-s SERVICE_NAME] [-n REPO_NAME]"
    echo "  -p PROJECT_ID    Google Cloud Project ID (default: robot-adk-agent)"
    echo "  -r REGION        Cloud Run region (default: us-central1)"
    echo "  -s SERVICE_NAME  Cloud Run service name (default: humanoid-robot-simulator)"
    echo "  -n REPO_NAME     Artifact Registry repository name (default: humanoid-robot-repo)"
    echo "  -h              Show this help message"
}

# Parse command line arguments
while getopts "p:r:s:n:h" opt; do
    case ${opt} in
        p )
            PROJECT_ID=$OPTARG
            ;;
        r )
            REGION=$OPTARG
            ;;
        s )
            SERVICE_NAME=$OPTARG
            ;;
        n )
            REPO_NAME=$OPTARG
            ;;
        h )
            print_usage
            exit 0
            ;;
        \? )
            print_usage
            exit 1
            ;;
    esac
done

# Check if PROJECT_ID is provided
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: PROJECT_ID is required${NC}"
    print_usage
    exit 1
fi

# Update IMAGE_NAME with the provided values
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}"

echo -e "${BLUE}🚀 Starting deployment of Humanoid Robot Simulator to Cloud Run${NC}"
echo -e "${YELLOW}Project ID: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"
echo -e "${YELLOW}Service Name: ${SERVICE_NAME}${NC}"
echo -e "${YELLOW}Repository Name: ${REPO_NAME}${NC}"
echo -e "${YELLOW}Image: ${IMAGE_NAME}${NC}"

# Authenticate with gcloud (if not already authenticated)
echo -e "${BLUE}🔐 Checking authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}⚠️ Not authenticated. Please run: gcloud auth login${NC}"
    exit 1
fi

# Set the project
echo -e "${BLUE}📋 Setting Google Cloud project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${BLUE}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Create Artifact Registry repository if it doesn't exist
echo -e "${BLUE}📦 Setting up Artifact Registry repository...${NC}"
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION --format="value(name)" 2>/dev/null; then
    echo -e "${YELLOW}Creating new Artifact Registry repository: $REPO_NAME${NC}"
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Repository for humanoid robot simulator"
else
    echo -e "${GREEN}✅ Repository $REPO_NAME already exists${NC}"
fi

# Configure Docker authentication for Artifact Registry
echo -e "${BLUE}🔑 Configuring Docker authentication...${NC}"
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# Build and push the Docker image
echo -e "${BLUE}🏗️ Building Docker image...${NC}"
docker build -t $IMAGE_NAME .

echo -e "${BLUE}📤 Pushing image to Container Registry...${NC}"
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo -e "${BLUE}🚀 Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 5000 \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 0 \
    --timeout 3600 \
    --concurrency 80 \
    --set-env-vars="FLASK_ENV=production,ROBOT_API_URL=https://6mz6soy3j3.execute-api.us-east-1.amazonaws.com/prod/run_action/" \
    --session-affinity \
    --quiet

# Get the service URL
echo -e "${BLUE}📋 Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Service URL: ${SERVICE_URL}${NC}"
echo -e "${YELLOW}💡 You can access your robot simulator at: ${SERVICE_URL}/?session_key=YOUR_SESSION${NC}"

# Test the deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $SERVICE_URL)
if [ $HTTP_STATUS -eq 200 ]; then
    echo -e "${GREEN}✅ Service is responding correctly (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${RED}⚠️ Service returned HTTP $HTTP_STATUS - please check the logs${NC}"
    echo -e "${YELLOW}💡 Check logs with: gcloud run logs read --service=$SERVICE_NAME --region=$REGION${NC}"
fi

echo -e "${GREEN}🎉 Deployment process completed!${NC}"
