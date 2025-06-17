# Cloud Run Deployment Guide

This guide explains how to deploy the Humanoid Robot Simulator to Google Cloud Run.

## Prerequisites

1. **Google Cloud Project**: You need a Google Cloud project with billing enabled
2. **gcloud CLI**: Install and configure the Google Cloud CLI
3. **Docker**: Install Docker for local building (optional, Cloud Build can handle this)
4. **Required APIs**: The deployment script will enable these automatically:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API

## Quick Deployment

### Option 1: Using the Deploy Script (Recommended)

```bash
# Make the script executable (already done)
chmod +x deploy.sh

# Deploy to Cloud Run
./deploy.sh -p YOUR_PROJECT_ID

# Or with custom region and service name
./deploy.sh -p YOUR_PROJECT_ID -r us-west1 -s my-robot-sim
```

### Option 2: Using Cloud Build

```bash
# Set your project ID
export PROJECT_ID=your-project-id

# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

### Option 3: Manual Deployment

```bash
# Set variables
export PROJECT_ID=your-project-id
export SERVICE_NAME=humanoid-robot-simulator
export REGION=us-central1

# Build and push image
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME .
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 5000 \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --timeout 3600
```

## Configuration

### Environment Variables

The application uses these environment variables:

- `PORT`: The port the application listens on (automatically set by Cloud Run)
- `FLASK_ENV`: Set to "production" for Cloud Run deployment

### Resource Limits

Default configuration:

- **CPU**: 1 vCPU
- **Memory**: 1 GiB
- **Max Instances**: 10
- **Min Instances**: 0 (scales to zero when not in use)
- **Timeout**: 3600 seconds (1 hour)
- **Concurrency**: 80 requests per instance

### Security

- The service is deployed with `--allow-unauthenticated` for public access
- The application runs as a non-root user inside the container
- Static content is served directly by the Flask application

## Accessing the Application

After deployment, you'll receive a URL like:

```
https://humanoid-robot-simulator-HASH-uc.a.run.app
```

To use the robot simulator, add a session key parameter:

```
https://your-service-url/?session_key=YOUR_SESSION
```

## WebSocket Support

Cloud Run supports WebSocket connections, which are used by the robot simulator for real-time communication. The WebSocket connections will work seamlessly with the deployed application.

## Monitoring and Logging

### View Logs

```bash
gcloud run logs read --service=humanoid-robot-simulator --region=us-central1
```

### Monitor Performance

```bash
gcloud run services describe humanoid-robot-simulator --region=us-central1
```

## Updating the Deployment

To update the application:

1. Make your code changes
2. Re-run the deployment script:
   ```bash
   ./deploy.sh -p YOUR_PROJECT_ID
   ```

Cloud Run will automatically create a new revision and route traffic to it.

## Cost Optimization

- **Scaling to Zero**: The service scales to zero when not in use, so you only pay for active usage
- **Resource Limits**: Adjust CPU and memory based on your actual usage
- **Request Concurrency**: Increase concurrency to serve more requests per instance

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are in `requirements.txt`
2. **Port Issues**: Ensure the application listens on the `PORT` environment variable
3. **Timeout Issues**: WebSocket connections may timeout; check the timeout settings
4. **Memory Issues**: Monitor memory usage and adjust limits if needed

### Debugging Commands

```bash
# Check service status
gcloud run services describe humanoid-robot-simulator --region=us-central1

# View recent logs
gcloud run logs read --service=humanoid-robot-simulator --region=us-central1 --limit=50

# Test the endpoint
curl https://your-service-url/

# Check revisions
gcloud run revisions list --service=humanoid-robot-simulator --region=us-central1
```

## Cleanup

To delete the service:

```bash
gcloud run services delete humanoid-robot-simulator --region=us-central1
```

To delete the container images:

```bash
gcloud container images delete gcr.io/PROJECT_ID/humanoid-robot-simulator --force-delete-tags
```
