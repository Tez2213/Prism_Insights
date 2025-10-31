# Real Data Migration - Complete Guide

## ✅ What Was Done

### 1. Fixed Data Simulator (data-simulator/data_generator.py)
**Problem:** Unrealistic data with too many negative values and wild fluctuations

**Solution:** Updated `update_data_realtime()` method to generate realistic data:
- Revenue changes: ±2-5% (was ±15%)
- Update frequency: 5-15% of data (was 30-60%)
- Status changes: 5% chance (was 30%)
- Costs stay proportional: 60-80% of revenue
- Small, gradual changes instead of wild swings

### 2. Created Unified Data Client (src/lib/api/data-client.ts)
**New file** that fetches data from DynamoDB via API Gateway:
- Base URL: `https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod`
- Endpoints: `/clients`, `/licenses`, `/leads`, `/technicians`, `/departments`, `/vendors`, `/contracts`
- Includes retry logic and error handling

### 3. Updated Frontend Pages to Use Real Data
All pages now use `dataClient` instead of `simulatorClient`:
- ✅ Client Profitability (`src/app/dashboard/client-profitability/page.tsx`)
- ✅ Software License (`src/app/dashboard/software-license/page.tsx`)
- ✅ Sales Pipeline (`src/app/dashboard/sales-pipeline/page.tsx`)
- ✅ Resource Allocation (already using `apiClient`)
- ✅ Departmental Spend (already using `apiClient`)
- ✅ Vendor Management (already using `apiClient`)

## 🚀 Deployment Steps

### Step 1: Update EC2 Simulator
```bash
# 1. Connect to EC2
ssh -i prism-key.pem ubuntu@18.218.83.240

# 2. Navigate to simulator
cd data-simulator

# 3. Backup current file
cp data_generator.py data_generator.py.backup

# 4. Edit the file
nano data_generator.py
# Replace the update_data_realtime method with the new version
# (See UPDATE_EC2_SIMULATOR.md for full code)

# 5. Restart the service
pkill -f "python main.py"
nohup python main.py > simulator.log 2>&1 &

# 6. Regenerate data
curl -X POST http://localhost:8000/api/regenerate

# 7. Sync to DynamoDB
curl -X POST http://localhost:8000/api/sync
```

### Step 2: Deploy Frontend
```bash
# Commit changes
git add .
git commit -m "Switch to real DynamoDB data and fix simulator"
git push

# Vercel will auto-deploy
```

## 📊 Data Flow

```
┌─────────────────┐
│  Data Simulator │  ← Generates realistic data
│   (EC2:8000)    │
└────────┬────────┘
         │
         │ Syncs every 5s
         ▼
┌─────────────────┐
│    DynamoDB     │  ← Stores data
│   (AWS Tables)  │
└────────┬────────┘
         │
         │ API Gateway
         ▼
┌─────────────────┐
│  Next.js App    │  ← Fetches via dataClient
│    (Vercel)     │
└─────────────────┘
```

## 🔍 Verify Everything Works

### 1. Check Simulator is Running
```bash
curl http://18.218.83.240:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-31T..."
}
```

### 2. Check API Gateway
```bash
curl https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/clients
```

Should return array of clients with realistic data.

### 3. Check Frontend
Visit: https://prism-insights-ten.vercel.app/dashboard

All 6 dashboards should show:
- ✅ Realistic profit margins (20-40%)
- ✅ No excessive negative values
- ✅ Gradual changes over time
- ✅ Stable, believable metrics

## 📝 Key Changes Summary

| Aspect | Before | After |
|--------|--------|-------|
| Revenue Changes | ±15% | ±2-5% |
| Update Frequency | 30-60% of data | 5-15% of data |
| Status Changes | 30% chance | 5% chance |
| Cost Ratio | Random | 60-80% of revenue |
| Data Source | Mock/Simulator | DynamoDB via API Gateway |
| Negative Values | Many | Rare |

## 🎯 Expected Results

### Client Profitability
- Margins: 20-40% (realistic for MSPs)
- Most clients: "Active" status
- Churn risk: Mostly "Low"
- Revenue: Gradual growth

### Software Licenses
- Utilization: 60-95%
- Small usage changes
- Realistic cost per license
- Proper compliance status

### Sales Pipeline
- Gradual stage progression
- Realistic deal values ($10k-$200k)
- Probability increases with stage
- Believable conversion rates

### All Dashboards
- No wild swings in data
- Smooth, realistic trends
- Proper data relationships
- Consistent metrics

## 🐛 Troubleshooting

### Issue: Still seeing unrealistic data
**Solution:**
1. Regenerate data: `curl -X POST http://18.218.83.240:8000/api/regenerate`
2. Sync to DynamoDB: `curl -X POST http://18.218.83.240:8000/api/sync`
3. Clear browser cache and refresh

### Issue: API Gateway returns errors
**Solution:**
1. Check AWS credentials are valid
2. Verify DynamoDB tables exist
3. Check IAM permissions

### Issue: Frontend shows old data
**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Check Network tab for API calls
3. Verify dataClient is being used (not simulatorClient)

## 📚 Files Modified

### Backend (EC2)
- `data-simulator/data_generator.py` - Fixed update_data_realtime method

### Frontend
- `src/lib/api/data-client.ts` - NEW: Unified data client
- `src/app/dashboard/software-license/page.tsx` - Uses dataClient
- `src/app/dashboard/sales-pipeline/page.tsx` - Uses dataClient
- `src/app/dashboard/client-profitability/page.tsx` - Already using dataClient

### Documentation
- `UPDATE_EC2_SIMULATOR.md` - EC2 update guide
- `REAL_DATA_MIGRATION.md` - This file

## ✨ Next Steps

1. Deploy the EC2 simulator updates
2. Push frontend changes to trigger Vercel deployment
3. Monitor dashboards for realistic data
4. Adjust simulator parameters if needed
5. Consider adding more data validation rules
