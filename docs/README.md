# Documentation Index

Welcome to the Humanoid Robot Simulator documentation.

## Documentation Files

- **[API Reference](API_REFERENCE.md)** - Complete API documentation for robot control, management, and video functionality
- **[Deployment Guide](DEPLOYMENT.md)** - Comprehensive deployment instructions for local, Docker, and cloud environments

## Quick Links

### Getting Started
- See the main [README.md](../README.md) for quick start instructions
- Run `./run_web_simulator.sh` to start the simulator
- Visit `http://localhost:5000` to access the web interface

### API Usage
- [Robot Control API](API_REFERENCE.md#robot-control-api) - Execute actions on robots
- [Robot Management API](API_REFERENCE.md#robot-management-api) - Add/remove robots dynamically
- [Video Management API](API_REFERENCE.md#video-management-api) - Control video sources and playback

### Deployment Options
- [Local Development](DEPLOYMENT.md#local-development) - Run locally with Python
- [Docker Deployment](DEPLOYMENT.md#docker-deployment) - Containerized deployment
- [Production Deployment](DEPLOYMENT.md#production-deployment) - Production-ready setup with nginx
- [Cloud Deployment](DEPLOYMENT.md#cloud-deployment) - AWS, GCP, Digital Ocean

### Testing
- See `test_commands/README.md` for comprehensive testing tools
- Use the provided shell scripts for automated testing

## Key Features

- 🤖 **6 Humanoid Robots** with facial features and direction indicators
- 🎭 **44 Realistic Actions** including dance, combat, exercise, and movement
- 🌐 **3D Web Interface** powered by Three.js and WebSocket
- 📡 **REST API** for programmatic control
- 🎬 **Video Management** with dynamic source changing
- 🐳 **Docker Support** for easy deployment
- ⚡ **Real-time Updates** via WebSocket communication

## Support

For issues or questions:
1. Check the documentation files above
2. Review the test commands in `test_commands/`
3. Check the application logs for error messages
4. Ensure all dependencies are properly installed

## Contributing

Please see the main README.md for contribution guidelines.
