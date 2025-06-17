# Deployment Guide

This guide covers different deployment options for the Humanoid Robot Simulator.

## Local Development

### Prerequisites
- Python 3.8 or higher
- Git
- Web browser with WebGL support

### Setup
```bash
# Clone repository
git clone <repository-url>
cd mock_robot_simulator

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python3 app.py
```

Access the application at: `http://localhost:5000`

## Docker Deployment

### Using Docker Compose (Recommended)

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

4. **Rebuild after changes:**
   ```bash
   docker-compose up -d --build
   ```

### Manual Docker Commands

1. **Build the Docker image:**
   ```bash
   docker build -t robot-simulator .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 5000:5000 --name robot-simulator robot-simulator
   ```

3. **View logs:**
   ```bash
   docker logs -f robot-simulator
   ```

4. **Stop and remove container:**
   ```bash
   docker stop robot-simulator
   docker rm robot-simulator
   ```

### Docker Configuration

#### Environment Variables
- `FLASK_ENV`: Set to `production` for production deployment
- `PYTHONPATH`: Set to `/app` (default in Dockerfile)
- `PORT`: Server port (default: 5000)

#### Volume Mounts
```bash
# Mount custom videos
docker run -d -p 5000:5000 \
  -v /path/to/videos:/app/static/video \
  robot-simulator
```

#### Network Configuration
```bash
# Custom network
docker network create robot-network
docker run -d --network robot-network -p 5000:5000 robot-simulator
```

## Production Deployment

### Using nginx as Reverse Proxy

1. **Install nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Create nginx configuration:**
   ```nginx
   # /etc/nginx/sites-available/robot-simulator
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /socket.io/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/robot-simulator /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### SSL Configuration with Let's Encrypt

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal setup:**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Systemd Service

1. **Create service file:**
   ```ini
   # /etc/systemd/system/robot-simulator.service
   [Unit]
   Description=Robot Simulator
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/opt/robot-simulator
   Environment=PATH=/opt/robot-simulator/venv/bin
   ExecStart=/opt/robot-simulator/venv/bin/python app.py
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

2. **Enable and start service:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable robot-simulator
   sudo systemctl start robot-simulator
   ```

## Cloud Deployment

### AWS EC2

1. **Launch EC2 instance:**
   - Ubuntu 20.04 LTS
   - t3.medium or higher
   - Security group: HTTP (80), HTTPS (443), SSH (22)

2. **Setup application:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker ubuntu

   # Clone and deploy
   git clone <repository-url>
   cd mock_robot_simulator
   docker-compose up -d
   ```

3. **Configure domain:**
   - Point your domain to the EC2 public IP
   - Set up nginx and SSL as described above

### Google Cloud Platform

1. **Create Compute Engine instance:**
   ```bash
   gcloud compute instances create robot-simulator \
     --image-family=ubuntu-2004-lts \
     --image-project=ubuntu-os-cloud \
     --machine-type=e2-medium \
     --tags=http-server,https-server
   ```

2. **Deploy with Docker:**
   ```bash
   # SSH to instance
   gcloud compute ssh robot-simulator

   # Install Docker and deploy
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   # Log out and back in for group changes
   
   git clone <repository-url>
   cd mock_robot_simulator
   docker-compose up -d
   ```

### Digital Ocean

1. **Create Droplet:**
   - Ubuntu 20.04
   - 2GB RAM minimum
   - Enable IPv6

2. **Deploy application:**
   ```bash
   # Connect via SSH
   ssh root@your-droplet-ip

   # Install Docker
   apt update
   apt install -y docker.io docker-compose
   systemctl enable docker

   # Deploy
   git clone <repository-url>
   cd mock_robot_simulator
   docker-compose up -d
   ```

## Performance Optimization

### Server Configuration

1. **Increase worker processes:**
   ```python
   # In app.py
   if __name__ == '__main__':
       app.run(host='0.0.0.0', port=5000, threaded=True)
   ```

2. **Use production WSGI server:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Enable gzip compression:**
   ```python
   from flask_compress import Compress
   Compress(app)
   ```

### Database Optimization

For production use, consider adding a database:

```python
# requirements.txt
SQLAlchemy==1.4.23
Flask-SQLAlchemy==2.5.1

# config.py
import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///robots.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```

### Caching

Add Redis for session and data caching:

```bash
# Install Redis
sudo apt install redis-server

# Python requirements
pip install redis flask-caching
```

```python
# app.py
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis'})
```

## Monitoring and Logging

### Application Logging

```python
# app.py
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/robot_simulator.log', 
                                       maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
```

### Health Check Endpoint

```python
@app.route('/health')
def health_check():
    return {'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}
```

### Monitoring with Prometheus

```python
# requirements.txt
prometheus-flask-exporter==0.18.2

# app.py
from prometheus_flask_exporter import PrometheusMetrics
PrometheusMetrics(app)
```

## Security Considerations

### Basic Security

1. **Environment variables:**
   ```bash
   # .env file
   SECRET_KEY=your-secret-key-here
   FLASK_ENV=production
   ```

2. **CORS configuration:**
   ```python
   from flask_cors import CORS
   CORS(app, origins=['https://your-domain.com'])
   ```

3. **Rate limiting:**
   ```python
   from flask_limiter import Limiter
   from flask_limiter.util import get_remote_address

   limiter = Limiter(
       app,
       key_func=get_remote_address,
       default_limits=["200 per day", "50 per hour"]
   )
   ```

### Authentication

For production, implement proper authentication:

```python
from functools import wraps
from flask_jwt_extended import JWTManager, jwt_required

jwt = JWTManager(app)

@app.route('/api/robots')
@jwt_required()
def get_robots():
    # Protected endpoint
    pass
```

## Backup and Recovery

### Data Backup

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p backups

# Backup logs
tar -czf backups/logs_$DATE.tar.gz logs/

# Backup static files
tar -czf backups/static_$DATE.tar.gz static/

# Backup configuration
cp docker-compose.yml backups/docker-compose_$DATE.yml
```

### Automated Backups

```bash
# Crontab entry
0 2 * * * /path/to/backup.sh
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **Docker build failures:**
   ```bash
   docker system prune -a
   docker-compose build --no-cache
   ```

3. **WebSocket connection issues:**
   - Check firewall settings
   - Verify proxy configuration
   - Test with different browsers

4. **Performance issues:**
   - Monitor resource usage: `htop`, `docker stats`
   - Check logs for errors
   - Optimize database queries

### Log Analysis

```bash
# View application logs
docker-compose logs -f robot-simulator

# Search for errors
grep -i error logs/robot_simulator.log

# Monitor real-time logs
tail -f logs/robot_simulator.log
```

This deployment guide provides comprehensive instructions for running the Robot Simulator in various environments, from local development to production cloud deployments.
