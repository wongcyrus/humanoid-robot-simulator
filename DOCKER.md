# Docker Setup for Robot Simulator

This document explains how to run the Robot Simulator application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Building and Running with Docker

### Option 1: Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t robot-simulator .
   ```

2. **Run the container:**
   ```bash
   docker run -p 5000:5000 robot-simulator
   ```

3. **Access the application:**
   Open your browser and go to `http://localhost:5000?session_key=YOUR_SESSION_ID`

### Option 2: Using Docker Compose (Recommended)

1. **Start the application:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f robot-simulator
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

## Configuration

### Environment Variables

- `FLASK_ENV`: Set to `production` for production deployment
- `PYTHONPATH`: Set to `/app` (default in Dockerfile)

### Port Configuration

The application runs on port 5000 inside the container. You can map it to a different host port:

```bash
docker run -p 8080:5000 robot-simulator
```

### Persistent Logs

If you want to persist logs outside the container, mount a volume:

```bash
docker run -p 5000:5000 -v $(pwd)/logs:/app/logs robot-simulator
```

## Health Monitoring

The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "healthy",
  "service": "robot-simulator"
}
```

## Production Deployment

For production deployment, consider:

1. **Using a reverse proxy** (nginx) - uncomment the nginx service in `docker-compose.yml`
2. **Setting up SSL/TLS** certificates
3. **Configuring log rotation** and monitoring
4. **Using Docker secrets** for sensitive configuration

## Troubleshooting

1. **Container won't start:**
   - Check logs: `docker logs <container_name>`
   - Verify port availability: `netstat -tulpn | grep 5000`

2. **Permission issues:**
   - The container runs as a non-root user for security
   - Ensure mounted volumes have correct permissions

3. **Network issues:**
   - Verify firewall settings
   - Check Docker network configuration: `docker network ls`

## Development

For development with live code reloading, mount the source code:

```bash
docker run -p 5000:5000 -v $(pwd):/app robot-simulator
```

Note: You may need to install development dependencies and restart the container when dependencies change.
