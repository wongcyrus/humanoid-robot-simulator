#!/bin/bash

# Test the Humanoid Robot Simulator locally with Cloud Run settings

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing Humanoid Robot Simulator locally with Cloud Run settings${NC}"

# Set environment variables similar to Cloud Run
export PORT=5000
export FLASK_ENV=production

echo -e "${YELLOW}📋 Environment Variables:${NC}"
echo -e "PORT: $PORT"
echo -e "FLASK_ENV: $FLASK_ENV"

# Build the Docker image
echo -e "${BLUE}🏗️ Building Docker image...${NC}"
docker build -t humanoid-robot-simulator-local .

# Run the container
echo -e "${BLUE}🚀 Starting container...${NC}"
echo -e "${YELLOW}💡 The application will be available at: http://localhost:5000/?session_key=YOUR_SESSION${NC}"
echo -e "${YELLOW}💡 Press Ctrl+C to stop the container${NC}"

docker run -p 5000:5000 \
    -e PORT=5000 \
    -e FLASK_ENV=production \
    --rm \
    --name humanoid-robot-simulator-test \
    humanoid-robot-simulator-local
