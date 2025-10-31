# Troubleshooting: Data Not Updating

## Issue: Frontend not showing updated data from DynamoDB

### Quick Checks

1. **Check if .env.local exists and has the correct API URL**
```bash
cat .env.local | grep NEXT_PUBLIC_API_URL
```

Should show:
```
NEXT_PUBLIC_API_URL=https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod
```

If not, copy from backup:
```bash
cp .env.local.backup .env.local
```

2. **Verify API Gateway is returning data**
```bash
curl https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/clients
```

Should return JSON array of clients. If it returns error, your API Gateway or Lambda might be down.

3. **Check EC2 simulator is syncing to DynamoDB**
```bash
ssh -i prism-key.pem ubuntu@18.218.83.240
curl http://localhost:8000/api/stats
```

Should show recent sync times.

### Solution Steps

#### Step 1: Verify Environment Variables

**Local Development:**
```bash
# Make sure .env.local exists
ls -la .env.local

# Check the content
cat .env.local
```

**Vercel (Production):**
1. Go to https://vercel.com/your-project/settings/environment-variables
2. Verify `NEXT_PUBLIC_API_URL` is set to:
   ```
   https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod
   ```
3. If not set or wrong, update it and redeploy

#### Step 2: Clear Cache and Rebuild

**Local:**
```bash
# Delete .next folder
rm -rf .next

# Restart dev server
npm run dev
```

**Vercel:**
```bash
# Force redeploy
git commit --allow-empty -m "Force redeploy"
git push
```

#### Step 3: Check Browser Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the dashboard page
4. Look for API calls to:
   - `https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/clients`
   - `https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/licenses`
   - etc.

**If you see calls to `http://18.218.83.240:8000` or `/api/proxy`:**
- The app is still using the simulator directly
- Environment variable not loaded properly

**If you see calls to API Gateway but getting errors:**
- Check the response in Network tab
- Might be CORS issue or Lambda error

#### Step 4: Test API Gateway Directly

```bash
# Test each endpoint
curl https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/clients
curl https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/licenses
curl https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/leads
curl https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/technicians
curl https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/departments
curl https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/vendors
curl https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod/contracts
```

**If any return errors:**
- Check Lambda function logs in AWS CloudWatch
- Verify DynamoDB tables have data
- Check IAM permissions

#### Step 5: Verify DynamoDB Has Data

```bash
# SSH to EC2
ssh -i prism-key.pem ubuntu@18.218.83.240

# Check simulator is running
curl http://localhost:8000/health

# Force regenerate and sync
curl -X POST http://localhost:8000/api/regenerate
curl -X POST http://localhost:8000/api/sync

# Check stats
curl http://localhost:8000/api/stats
```

Should show:
```json
{
  "clients": 20,
  "licenses": 30,
  "leads": 25,
  ...
  "last_sync": "recent timestamp"
}
```

#### Step 6: Check Which Client is Being Used

Add console.log to see which client is being used:

**In `src/app/dashboard/client-profitability/page.tsx`:**
```typescript
useEffect(() => {
  async function fetchData() {
    try {
      console.log('Fetching from:', dataClient); // Add this
      const data = await dataClient.getClients();
      console.log('Received data:', data); // Add this
      // ...
    }
  }
  fetchData();
}, []);
```

Check browser console to see what's being fetched.

### Common Issues

#### Issue 1: Still using simulator directly
**Symptom:** Network tab shows calls to `http://18.218.83.240:8000`

**Solution:**
1. Make sure all pages import `dataClient` not `simulatorClient`
2. Check `.env.local` has `NEXT_PUBLIC_API_URL`
3. Restart dev server

#### Issue 2: API Gateway returns 403/401
**Symptom:** Network tab shows 403 or 401 errors

**Solution:**
1. Check AWS credentials haven't expired
2. Verify IAM role has DynamoDB permissions
3. Check API Gateway CORS settings

#### Issue 3: API Gateway returns empty array
**Symptom:** API returns `[]` or `{"Items": []}`

**Solution:**
1. DynamoDB tables are empty
2. Run sync from EC2: `curl -X POST http://18.218.83.240:8000/api/sync`
3. Check DynamoDB tables in AWS Console

#### Issue 4: Data updates but still looks unrealistic
**Symptom:** Data is updating but values are still wild

**Solution:**
1. Verify EC2 simulator has the updated code
2. Regenerate data: `curl -X POST http://18.218.83.240:8000/api/regenerate`
3. Check `data_generator.py` has the new `update_data_realtime` method

### Verification Checklist

- [ ] `.env.local` exists and has correct `NEXT_PUBLIC_API_URL`
- [ ] Vercel environment variables are set
- [ ] API Gateway endpoints return data (test with curl)
- [ ] EC2 simulator is running and syncing
- [ ] DynamoDB tables have data
- [ ] Browser Network tab shows calls to API Gateway
- [ ] No CORS errors in browser console
- [ ] Data looks realistic (margins 20-40%, no excessive negatives)

### Still Not Working?

1. **Check the actual file being used:**
```bash
# In your project
grep -r "simulatorClient" src/app/dashboard/
```

Should return NO results. If it does, those files still need updating.

2. **Check environment variable is loaded:**
```bash
# In browser console
console.log(process.env.NEXT_PUBLIC_API_URL)
```

Should show the API Gateway URL.

3. **Force complete rebuild:**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Contact Points

If still having issues, check:
1. AWS CloudWatch Logs for Lambda errors
2. EC2 simulator logs: `ssh ubuntu@18.218.83.240 "tail -f ~/data-simulator/simulator.log"`
3. Browser console for JavaScript errors
4. Network tab for failed requests
