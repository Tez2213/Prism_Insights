# Test Report Generation

## The Fix

Changed from:
- ❌ Frontend → EC2 directly (blocked by CORS/mixed content)
- ✅ Frontend → Vercel API Route → EC2 (works!)

## Steps to Deploy

### 1. Make Sure EC2 Server is Running

```bash
ssh -i "prism-key.pem" ubuntu@18.218.83.240

# Check if running
ps aux | grep python3

# If not running, start it
cd ~/data-simulator
source venv/bin/activate
nohup python3 main.py > server.log 2>&1 &

# Verify it's working
curl http://localhost:8000/health

# Exit SSH
exit
```

### 2. Test from Your Computer

```bash
# Test EC2 server directly
curl http://18.218.83.240:8000/health

# Should return JSON with status: "healthy"
```

### 3. Commit and Push Changes

```bash
git add .
git commit -m "Fix report generation via API proxy"
git push
```

Vercel will auto-deploy.

### 4. Test on Vercel (After Deployment)

1. Go to https://prism-insights-ten.vercel.app
2. Navigate to Client Profitability page
3. Click "Download Report"
4. Should download a PDF file!

---

## Troubleshooting

### Issue: "Report server not configured"

**Check Vercel Environment Variables:**
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Make sure `NEXT_PUBLIC_SIMULATOR_URL` is set to: `http://18.218.83.240:8000`
4. Redeploy

### Issue: "Failed to generate report from server"

**EC2 server is not running or not accessible:**

```bash
# SSH to EC2
ssh -i "prism-key.pem" ubuntu@18.218.83.240

# Check if server is running
ps aux | grep python3

# Check logs
tail -50 ~/data-simulator/server.log

# Restart server
pkill python3
cd ~/data-simulator
source venv/bin/activate
python3 main.py
```

### Issue: Still getting HTML file

**Clear browser cache and try again:**
1. Open DevTools (F12)
2. Network tab
3. Check "Disable cache"
4. Refresh page
5. Try download again

**Or check Vercel deployment:**
1. Go to Vercel Dashboard
2. Deployments tab
3. Make sure latest deployment is live
4. Check deployment logs for errors

---

## How It Works Now

```
User clicks "Download Report"
    ↓
Frontend calls /api/generate-report (Vercel API Route)
    ↓
Vercel API Route calls EC2 server (http://18.218.83.240:8000)
    ↓
EC2 generates PDF with Python/ReportLab
    ↓
EC2 returns PDF to Vercel
    ↓
Vercel returns PDF to user
    ↓
Browser downloads PDF file
```

**Benefits:**
- ✅ No CORS issues
- ✅ No mixed content (HTTPS/HTTP) issues
- ✅ Works on Vercel production
- ✅ Works in development
- ✅ Proper error handling

---

## Quick Test Commands

### Test EC2 Server
```bash
curl http://18.218.83.240:8000/health
```

### Test Report Generation (from EC2)
```bash
curl -X POST http://localhost:8000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{"pageType":"client-profitability","pageTitle":"Test"}' \
  --output test.pdf

ls -lh test.pdf
```

### Test from Local Dev
```bash
npm run dev
# Open http://localhost:3000
# Try downloading a report
```

---

## Success Indicators

✅ EC2 server responds to health check
✅ No errors in EC2 server logs
✅ Vercel deployment successful
✅ Report downloads as PDF (not HTML)
✅ PDF opens and shows professional formatting
✅ Charts are rendered in PDF
✅ AI insights are included

---

## If Everything Fails

**Fallback option - Use HTML reports temporarily:**

Uncomment the fallback in `report-generator.ts`:

```typescript
} catch (error) {
  console.error('Error generating PDF report:', error);
  // Temporary fallback
  const insights = await this.generateAIInsights(reportData);
  const html = this.generateHTMLReport(reportData, insights);
  return new Blob([html], { type: 'text/html' });
}
```

But this is not ideal - fix the EC2 server instead!
