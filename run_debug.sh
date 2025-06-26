#!/bin/bash
# Debug mode runner for Robot Simulator

echo "🔧 Starting Robot Simulator in DEBUG mode..."
echo "📋 Environment variables being set:"
echo "   DEBUG=true"
echo "   LOG_LEVEL=DEBUG"
echo ""

# Set debug environment variables and run the server
DEBUG=true LOG_LEVEL=DEBUG python3 app.py
