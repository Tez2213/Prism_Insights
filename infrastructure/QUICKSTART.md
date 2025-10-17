# 🚀 Quick Start Guide - Seed Your DynamoDB Tables

## What You Need

✅ DynamoDB tables deployed (you said they're done!)  
✅ AWS credentials configured  
✅ Frontend mock data files  

## 3 Simple Commands

### 1️⃣ Install Dependencies

```bash
cd infrastructure/scripts
npm install
```

This installs the AWS SDK packages needed to write to DynamoDB.

### 2️⃣ Seed the Data

```bash
npm run seed
```

**What happens:**
- Reads all 7 mock data files from `frontend/src/lib/mock-data/`
- Parses the TypeScript files
- Uploads data to DynamoDB in batches
- Shows progress for each table

**Expected output:**
```
============================================================
🌱 DynamoDB Seeding Script
============================================================
Region: us-east-2
Environment: dev
Table Prefix: prism-
============================================================

📊 Seeding clients...
  Found 8 items
  Writing 8 items in 1 batch(es)...
  ✓ Batch 1/1 written
  ✅ Successfully seeded clients table

📊 Seeding licenses...
  Found 10 items
  ...

✅ All tables seeded successfully!
```

### 3️⃣ Verify It Worked

```bash
npm run verify
```

**What happens:**
- Checks each DynamoDB table
- Counts the items
- Shows a sample from each table

**Expected output:**
```
🔍 DynamoDB Seed Verification
============================================================

📊 clients         (prism-clients)
  ✅ 8 items found
  📝 Sample: TechFlow Solutions

📊 licenses        (prism-licenses)
  ✅ 10 items found
  📝 Sample: Microsoft 365 Business Premium

...

🎉 All tables are properly seeded!
```

## That's It! 🎉

Your DynamoDB tables now have all the mock data from your frontend.

## Next Steps

Now you can:
1. ✅ Create Lambda functions to read from DynamoDB
2. ✅ Update frontend to call Lambda instead of using local files
3. ✅ Add real-time updates

See `SIMPLE_PLAN.md` for the complete roadmap.

## Troubleshooting

### "File not found"
Make sure you're in the `infrastructure/scripts` directory when running the commands.

### "Access Denied"
Check your AWS credentials:
```bash
aws sts get-caller-identity
```

### "Table not found"
Deploy the DynamoDB stack first:
```bash
cd infrastructure
cdk deploy
```

### Need to re-seed?
Just run `npm run seed` again. It will overwrite the existing data.

## Manual Check (Optional)

You can also check in AWS Console:
1. Go to DynamoDB service
2. Click on a table (e.g., `prism-clients`)
3. Click "Explore table items"
4. You should see all your data!

Or use AWS CLI:
```bash
aws dynamodb scan --table-name prism-clients --region us-east-2 --max-items 5
```

---

**Questions?** Just ask! 🤗
