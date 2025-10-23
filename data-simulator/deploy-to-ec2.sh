#!/bin/bash

# Deployment script for EC2
# Run this ON the EC2 instance after uploading files

echo "🚀 Deploying Prism Data Simulator to EC2..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
echo "🐍 Installing Python 3.11..."
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install nginx and supervisor
echo "📡 Installing nginx and supervisor..."
sudo apt install nginx supervisor -y

# Create virtual environment
echo "🔧 Setting up Python environment..."
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
echo "📚 Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

# Create supervisor config
echo "⚙️ Configuring supervisor..."
sudo tee /etc/supervisor/conf.d/data-simulator.conf > /dev/null <<EOF
[program:data-simulator]
directory=/home/ubuntu/data-simulator
command=/home/ubuntu/data-simulator/venv/bin/python main.py
user=ubuntu
autostart=true
autorestart=true
stderr_logfile=/var/log/data-simulator.err.log
stdout_logfile=/var/log/data-simulator.out.log
environment=PATH="/home/ubuntu/data-simulator/venv/bin"
EOF

# Get EC2 public IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Create nginx config
echo "🌐 Configuring nginx..."
sudo tee /etc/nginx/sites-available/data-simulator > /dev/null <<EOF
server {
    listen 80;
    server_name $EC2_IP;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    }
}
EOF

# Enable nginx site
sudo ln -sf /etc/nginx/sites-available/data-simulator /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t

# Start services
echo "🎬 Starting services..."
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start data-simulator
sudo systemctl restart nginx

# Wait a moment
sleep 3

# Check status
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
sudo supervisorctl status data-simulator
echo ""
echo "🌐 Your API is available at:"
echo "   http://$EC2_IP/health"
echo "   http://$EC2_IP/api/clients"
echo ""
echo "📝 View logs with:"
echo "   sudo tail -f /var/log/data-simulator.out.log"
echo ""
echo "🔄 Restart with:"
echo "   sudo supervisorctl restart data-simulator"
echo ""
echo "🎉 Don't forget to update Vercel environment variable:"
echo "   NEXT_PUBLIC_SIMULATOR_URL=http://$EC2_IP"
