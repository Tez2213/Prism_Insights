# 🚀 Complete Deployment Guide

## Current Status:
- ✅ **Frontend**: Deployed on Vercel
- ⏳ **Python Simulator**: Needs AWS deployment
- ⏳ **Connection**: Need to link them

## Architecture:

```
Vercel (Frontend)
    ↓ (HTTPS)
AWS EC2 (Python Simulator)
    ↓ (reads/writes)
AWS DynamoDB (Data Storage)
    ↓ (queries)
AWS Bedrock Agents (AI)
```

---

## Part 1: Deploy Python Simulator to AWS EC2

### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance

2. **Configure Instance**:
   - **Name**: `prism-data-simulator`
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: `t3.micro` (free tier eligible)
   - **Key Pair**: Create new or use existing
   - **Security Group**: Create new with these rules:
     - SSH (22) - Your IP only
     - HTTP (80) - Anywhere
     - HTTPS (443) - Anywhere
     - Custom TCP (8000) - Anywhere (for API)

3. **Storage**: 8 GB (default is fine)

4. **Launch Instance**

### Step 2: Connect to EC2

```bash
# Download your key pair (e.g., prism-key.pem)
# Set permissions
chmod 400 prism-key.pem

# Connect via SSH
ssh -i prism-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### Step 3: Install Dependencies on EC2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install nginx (for reverse proxy)
sudo apt install nginx -y

# Install supervisor (for process management)
sudo apt install supervisor -y
```

### Step 4: Upload Python Simulator

**Option A: Using Git (Recommended)**
```bash
# On EC2
cd /home/ubuntu
git clone <your-repo-url>
cd data-simulator
```

**Option B: Using SCP**
```bash
# On your local machine
scp -i prism-key.pem -r data-simulator ubuntu@<EC2-PUBLIC-IP>:/home/ubuntu/
```

### Step 5: Setup Python Environment on EC2

```bash
# On EC2
cd /home/ubuntu/data-simulator

# Create virtual environment
python3.11 -m venv venv

# Activate
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 6: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add:
```env
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_SESSION_TOKEN=<your-session-token>  # If using temporary credentials
DYNAMODB_TABLE_PREFIX=prism-
UPDATE_INTERVAL_SECONDS=10
PORT=8000
```

Save and exit (Ctrl+X, Y, Enter)

### Step 7: Test the Simulator

```bash
# Run manually first to test
python main.py

# Should see:
# INFO: Uvicorn running on http://0.0.0.0:8000
# INFO: Initial data generated
```

Test from another terminal:
```bash
curl http://localhost:8000/health
```

### Step 8: Setup Supervisor (Auto-restart)

```bash
# Create supervisor config
sudo nano /etc/supervisor/conf.d/data-simulator.conf
```

Add:
```ini
[program:data-simulator]
directory=/home/ubuntu/data-simulator
command=/home/ubuntu/data-simulator/venv/bin/python main.py
user=ubuntu
autostart=true
autorestart=true
stderr_logfile=/var/log/data-simulator.err.log
stdout_logfile=/var/log/data-simulator.out.log
environment=PATH="/home/ubuntu/data-simulator/venv/bin"
```

Save and start:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start data-simulator
sudo supervisorctl status
```

### Step 9: Setup Nginx (Reverse Proxy)

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/data-simulator
```

Add:
```nginx
server {
    listen 80;
    server_name <EC2-PUBLIC-IP>;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/data-simulator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 10: Test External Access

```bash
# From your local machine
curl http://<EC2-PUBLIC-IP>/health
curl http://<EC2-PUBLIC-IP>/api/clients
```

---

## Part 2: Connect Vercel Frontend to EC2

### Step 1: Update Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add/Update:
```env
NEXT_PUBLIC_SIMULATOR_URL=http://<EC2-PUBLIC-IP>
```

### Step 2: Redeploy Frontend

```bash
# Trigger redeployment
git commit --allow-empty -m "Update simulator URL"
git push
```

Or manually in Vercel Dashboard → Deployments → Redeploy

### Step 3: Test Connection

Visit your Vercel URL:
- https://your-app.vercel.app/realtime-demo
- https://your-app.vercel.app/dashboard/client-profitability

Check browser console for API calls to EC2.

---

## Part 3: Enable DynamoDB Sync

### Step 1: Update EC2 .env

```bash
# On EC2
nano /home/ubuntu/data-simulator/.env
```

Remove the `return` statement from `sync_to_dynamodb()` in `main.py`:

```bash
nano /home/ubuntu/data-simulator/main.py
```

Find:
```python
async def sync_to_dynamodb():
    """Sync in-memory data to DynamoDB"""
    # Disabled for local testing - enable when deploying to AWS
    return  # <-- REMOVE THIS LINE
```

### Step 2: Restart Simulator

```bash
sudo supervisorctl restart data-simulator
```

### Step 3: Verify DynamoDB Sync

```bash
# Check logs
sudo tail -f /var/log/data-simulator.out.log

# Should see:
# INFO:main:Data synced to DynamoDB
```

---

## Part 4: Connect Bedrock Agents to DynamoDB

Your Bedrock agents are already configured to read from DynamoDB!

The Lambda functions in `infrastructure/lambda/bedrock-actions/` will automatically:
1. Read from DynamoDB tables
2. Process data
3. Return insights to agents

### Verify Agent Access:

1. **Go to AWS Bedrock Console**
2. **Test your agents**:
   - Client Profitability Agent
   - Software License Agent
   - Sales Pipeline Agent

3. **Ask questions**:
   - "Show me clients at risk"
   - "Which licenses are underutilized?"
   - "What's my pipeline value?"

The agents will now use LIVE DATA from your simulator!

---

## Part 5: Optional - Setup HTTPS with SSL

### Using Let's Encrypt (Free SSL):

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

Update Vercel env:
```env
NEXT_PUBLIC_SIMULATOR_URL=https://your-domain.com
```

---

## Testing Checklist:

### ✅ EC2 Simulator:
- [ ] Server running on port 8000
- [ ] Health endpoint responds: `curl http://<EC2-IP>/health`
- [ ] API endpoints work: `curl http://<EC2-IP>/api/clients`
- [ ] Data updates every 10 seconds
- [ ] Supervisor auto-restarts on crash
- [ ] Nginx reverse proxy working
- [ ] CORS headers present

### ✅ Vercel Frontend:
- [ ] Environment variable set
- [ ] Redeployed after env change
- [ ] Dashboards load data
- [ ] Real-time updates working
- [ ] Alert system functioning
- [ ] No CORS errors in console

### ✅ DynamoDB:
- [ ] Tables exist in AWS
- [ ] Data syncing from simulator
- [ ] Lambda functions can read data
- [ ] No permission errors

### ✅ Bedrock Agents:
- [ ] Agents can query DynamoDB
- [ ] Lambda functions working
- [ ] Agents return live data
- [ ] Chat interface functional

---

## Monitoring & Maintenance:

### Check Simulator Status:
```bash
sudo supervisorctl status data-simulator
```

### View Logs:
```bash
# Real-time logs
sudo tail -f /var/log/data-simulator.out.log

# Error logs
sudo tail -f /var/log/data-simulator.err.log
```

### Restart Simulator:
```bash
sudo supervisorctl restart data-simulator
```

### Update Code:
```bash
cd /home/ubuntu/data-simulator
git pull
sudo supervisorctl restart data-simulator
```

---

## Cost Estimate:

### AWS Costs (Monthly):
- **EC2 t3.micro**: $0-10 (free tier eligible)
- **DynamoDB**: $5-15 (on-demand pricing)
- **Bedrock API**: $20-50 (depends on usage)
- **Data Transfer**: $1-5
- **Total**: ~$25-80/month

### Vercel:
- **Hobby Plan**: Free
- **Pro Plan**: $20/month (if needed)

---

## Troubleshooting:

### Issue: Frontend can't connect to EC2
**Solution**: Check EC2 security group allows port 8000 from anywhere

### Issue: CORS errors
**Solution**: Verify nginx CORS headers are set

### Issue: Simulator crashes
**Solution**: Check logs, verify AWS credentials, ensure DynamoDB tables exist

### Issue: Agents return stale data
**Solution**: Verify DynamoDB sync is enabled and working

---

## Quick Commands Reference:

```bash
# SSH to EC2
ssh -i prism-key.pem ubuntu@<EC2-IP>

# Check status
sudo supervisorctl status

# View logs
sudo tail -f /var/log/data-simulator.out.log

# Restart
sudo supervisorctl restart data-simulator

# Test API
curl http://localhost:8000/health
curl http://localhost:8000/api/clients

# Update code
cd /home/ubuntu/data-simulator && git pull
sudo supervisorctl restart data-simulator
```

---

## Next Steps:

1. ✅ Deploy Python simulator to EC2
2. ✅ Update Vercel environment variable
3. ✅ Enable DynamoDB sync
4. ✅ Test Bedrock agents
5. 🎉 System is LIVE!

Your complete architecture will be:
```
Users → Vercel (Frontend) → EC2 (Simulator) → DynamoDB → Bedrock Agents
```

All components working together with LIVE, real-time data! 🚀
