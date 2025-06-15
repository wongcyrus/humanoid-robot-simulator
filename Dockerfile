# Use Python 3.12 slim image as base
FROM python:3.12-slim

# Set working directory in container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application
COPY . .

# Create a non-root user for security
RUN useradd -m -u 1000 robotuser && chown -R robotuser:robotuser /app
USER robotuser

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV PYTHONPATH=/app
ENV FLASK_ENV=production

# Command to run the application
CMD ["python", "app.py", "5000"]
