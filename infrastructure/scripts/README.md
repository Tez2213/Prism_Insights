# Infrastructure Scripts

## Seeding DynamoDB with Mock Data

### Prerequisites

1. DynamoDB tables deployed (run `cdk deploy` from infrastructure directory)
2. AWS credentials configured
3. Frontend mock data files exist in `frontend/src/lib/mock-data/`

### Quick Start

```bash
# 1. Install dependencies (if not already done)
cd infrastructure/scripts
npm install

# 2. Run the seeding script
npm run seed
```

### What It Does

The seeding script will:
1. Read all mock data files from your frontend
2. Parse the TypeScript files and extract the data arrays
3. Upload data to DynamoDB in batches
4. Show progress for each table

### Tables Seeded

- `prism-clients` - Client profitability data
- `prism-licenses` - Software license data
- `prism-leads` - Sales pipeline leads
- `prism-technicians` - Resource allocation data
- `prism-departments` - Departmental spend data
- `prism-vendors` - Vendor management data
- `prism-contracts` - Contract data

### Expected Output

```
============================================================
DynamoDB Seeding Script
============================================================
Region: us-east-2
Environment: dev
Table Prefix: prism-
============================================================

Seeding clients...
  Found 8 items
  Writing 8 items in 1 batch(es)...
  Batch 1/1 written
  Successfully seeded clients table

Seeding licenses...
  Found 10 items
  Writing 10 items in 1 batch(es)...
  Batch 1/1 written
  Successfully seeded licenses table

... (continues for all tables)

============================================================
All tables seeded successfully!
============================================================

Summary:
  Tables seeded: 7
  Region: us-east-2

Your data is ready to use!
```

### Troubleshooting

**Error: "File not found"**
- Make sure you're running the script from the `infrastructure/scripts` directory
- Verify that frontend mock data files exist

**Error: "Access Denied"**
- Check your AWS credentials: `aws sts get-caller-identity`
- Ensure your IAM user/role has DynamoDB write permissions

**Error: "Table not found"**
- Deploy the DynamoDB stack first: `cd infrastructure && cdk deploy`

**Error: "Could not find mock data array"**
- The script expects TypeScript files with `export const mockXxx: Type[] = [...]` format
- Check that your mock data files follow this pattern

### Manual Verification

After seeding, you can verify the data in AWS Console:
1. Go to DynamoDB in AWS Console
2. Select a table (e.g., `prism-clients`)
3. Click "Explore table items"
4. You should see all your mock data

Or use AWS CLI:
```bash
aws dynamodb scan --table-name prism-clients --region us-east-2
```

### Re-seeding

To re-seed the tables (this will overwrite existing data):
```bash
npm run seed
```

The script uses `PutRequest` which will overwrite items with the same ID.

### Next Steps

After seeding:
1. Create Lambda functions to read from DynamoDB
2. Update frontend to call Lambda functions instead of using local mock data
3. Test the integration

See the main infrastructure README.md for complete documentation.
