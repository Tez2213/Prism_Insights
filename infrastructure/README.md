# Prism Insights - Infrastructure

AWS CDK infrastructure for the Prism Insights AI-powered business intelligence platform. This infrastructure deploys AWS Bedrock Agents, Lambda functions, DynamoDB tables, and supporting services.

## Overview

This infrastructure code provisions a complete serverless architecture for running AI-powered business intelligence agents using AWS Bedrock. The platform includes three main agents:

1. **Client Profitability Intelligence Agent** - Analyzes client profitability, predicts churn risk, and optimizes contracts
2. **Software License Intelligence Agent** - Monitors license usage, ensures compliance, and identifies cost savings
3. **Sales Pipeline Optimization Agent** - Optimizes sales processes, forecasts revenue, and identifies opportunities

## Architecture

### Core Components

- **AWS Bedrock Agents** - AI agents powered by Claude 3.5 Sonnet
- **AWS Lambda Functions** - Serverless compute for agent actions and API endpoints
- **Amazon DynamoDB** - NoSQL database for storing business data
- **Amazon S3** - Storage for knowledge base documents and reports
- **AWS IAM** - Roles and policies for secure access control

### Infrastructure Stacks

1. **DynamoDB Stack** - Database tables for all business entities
2. **Bedrock Agent Stack** - AI agents, Lambda functions, and S3 buckets
3. **API Stack** - API Gateway and Lambda functions for frontend integration

## Project Structure

```
infrastructure/
├── bin/
│   └── app.ts                    # CDK app entry point
├── lib/
│   ├── dynamodb-stack.ts         # DynamoDB tables stack
│   ├── bedrock-agent-stack.ts    # Bedrock agents and Lambda stack
│   └── api-stack.ts              # API Gateway stack
├── lambda/
│   ├── api/                      # API endpoint handlers
│   │   ├── get-clients.js
│   │   ├── get-licenses.js
│   │   ├── get-leads.js
│   │   └── ...
│   └── bedrock-actions/          # Bedrock agent action handlers
│       ├── query-client-data.js
│       ├── predict-churn.js
│       ├── optimize-contract.js
│       ├── query-license-data.js
│       ├── assess-compliance.js
│       ├── optimize-license-costs.js
│       └── ...
├── knowledge-base/               # Knowledge base documents
│   ├── client-profitability/
│   │   ├── msp-pricing-guidelines.md
│   │   ├── retention-strategies.md
│   │   └── contract-templates.md
│   └── software-license/
│       ├── vendor-pricing-guide.md
│       ├── negotiation-strategies.md
│       └── compliance-regulations.md
├── scripts/                      # Utility scripts
│   ├── seed-dynamodb.js         # Seed database with mock data
│   ├── verify-seed.js           # Verify seeded data
│   ├── clear-tables.js          # Clear all tables
│   └── upload-knowledge-base.ps1 # Upload KB documents to S3
├── cdk.json                      # CDK configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── .env.example                  # Environment variables template
```

## Prerequisites

- Node.js 20+ installed
- AWS CLI configured with credentials
- AWS CDK CLI installed: `npm install -g aws-cdk`
- AWS account with appropriate permissions
- Access to AWS Bedrock (Claude 3.5 Sonnet model)

## Getting Started

### 1. Install Dependencies

```bash
cd infrastructure
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
AWS_ACCOUNT_ID=your-account-id
AWS_REGION=us-east-2
ENVIRONMENT=dev
```

### 3. Bootstrap CDK (First Time Only)

```bash
cdk bootstrap aws://ACCOUNT-ID/REGION
```

### 4. Deploy Infrastructure

Deploy all stacks:

```bash
npm run deploy
```

Or deploy individual stacks:

```bash
cdk deploy prism-insights-dynamodb-dev
cdk deploy prism-insights-bedrock-dev
cdk deploy prism-insights-api-dev
```

### 5. Seed Database with Mock Data

```bash
cd scripts
npm install
npm run seed
```

Verify the data:

```bash
npm run verify
```

### 6. Upload Knowledge Base Documents

```powershell
cd scripts
.\upload-knowledge-base.ps1 -BucketName <KnowledgeBaseBucketName>
```

Get the bucket name from CDK outputs after deployment.

## DynamoDB Tables

The infrastructure creates the following tables:

- **prism-clients** - Client information and profitability metrics
- **prism-licenses** - Software license inventory and usage
- **prism-leads** - Sales pipeline leads and opportunities
- **prism-technicians** - Resource allocation and utilization
- **prism-departments** - Departmental spending and budgets
- **prism-vendors** - Vendor relationships and contracts
- **prism-contracts** - Contract details and renewals

All tables use:
- Partition key: `id` (String)
- Billing mode: PAY_PER_REQUEST (on-demand)
- Point-in-time recovery: Enabled
- Encryption: AWS managed keys

## Lambda Functions

### API Endpoints

Located in `lambda/api/`:

- `get-clients` - Retrieve client data
- `get-licenses` - Retrieve license data
- `get-leads` - Retrieve sales leads
- `get-technicians` - Retrieve technician data
- `get-departments` - Retrieve department data
- `get-vendors` - Retrieve vendor data
- `get-contracts` - Retrieve contract data

### Bedrock Agent Actions

Located in `lambda/bedrock-actions/`:

**Client Profitability Agent:**
- `query-client-data` - Query client information and metrics
- `predict-churn` - Predict client churn risk
- `analyze-margins` - Analyze profit margins
- `optimize-contract` - Optimize contract terms
- `forecast-revenue` - Forecast revenue trends

**Software License Agent:**
- `query-license-data` - Query license inventory
- `assess-compliance` - Assess license compliance
- `monitor-usage` - Monitor license usage patterns
- `optimize-license-costs` - Identify cost optimization opportunities
- `get-vendor-intelligence` - Get vendor pricing and negotiation data

**Sales Pipeline Agent:**
- `forecast-revenue` - Forecast sales revenue
- Additional actions defined in schema files

## Bedrock Agent Setup

After deploying the infrastructure, you need to manually create the Bedrock Agents in the AWS Console (CDK doesn't fully support Bedrock Agents yet).

### Detailed Setup Guides

- [Client Profitability Agent Setup](BEDROCK_AGENT_DEPLOYMENT.md)
- [Software License Agent Setup](SOFTWARE_LICENSE_AGENT_DEPLOYMENT.md)
- [Sales Pipeline Agent Setup](SALES_PIPELINE_AGENT_DEPLOYMENT.md)

### Quick Setup Steps

1. Navigate to AWS Bedrock Console
2. Create a new agent
3. Select Claude 3.5 Sonnet v2 as the foundation model
4. Add agent instructions from deployment guides
5. Configure action groups using Lambda functions
6. Create and link knowledge base (for Client Profitability and Software License agents)
7. Prepare and create alias
8. Test the agent
9. Update frontend environment variables with Agent ID and Alias ID

## Knowledge Base

The knowledge base provides domain-specific information to the agents:

### Client Profitability Knowledge Base

- **MSP Pricing Guidelines** - Industry pricing standards and benchmarks
- **Retention Strategies** - Client retention best practices
- **Contract Templates** - Standard contract terms and structures

### Software License Knowledge Base

- **Vendor Pricing Guide** - Current market rates for major vendors
- **Negotiation Strategies** - Tactics for license negotiations
- **Compliance Regulations** - License compliance requirements

Knowledge base documents are stored in S3 and indexed by AWS Bedrock for semantic search.

## Available Scripts

```bash
# CDK Commands
npm run build        # Compile TypeScript
npm run watch        # Watch for changes
npm run deploy       # Deploy all stacks
npm run destroy      # Destroy all stacks
npm run diff         # Show differences
npm run synth        # Synthesize CloudFormation

# Database Scripts (in scripts/ directory)
npm run seed         # Seed DynamoDB with mock data
npm run verify       # Verify seeded data
npm run clear        # Clear all tables
```

## Environment Variables

### Infrastructure (.env)

```env
AWS_ACCOUNT_ID=123456789012
AWS_REGION=us-east-2
ENVIRONMENT=dev
```

### Frontend Integration

After deployment, update your frontend `.env.local`:

```env
BEDROCK_AGENT_ID=<from-aws-console>
BEDROCK_AGENT_ALIAS_ID=<from-aws-console>
SOFTWARE_LICENSE_AGENT_ID=<from-aws-console>
SOFTWARE_LICENSE_AGENT_ALIAS_ID=<from-aws-console>
SALES_PIPELINE_AGENT_ID=<from-aws-console>
SALES_PIPELINE_AGENT_ALIAS_ID=<from-aws-console>
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
```

## Cost Estimation

### Monthly Costs (Moderate Usage)

- **AWS Bedrock API**: $20-50/month
  - Input tokens: ~$0.003 per 1K tokens
  - Output tokens: ~$0.015 per 1K tokens
- **Lambda Functions**: $5-10/month
  - First 1M requests free
  - $0.20 per 1M requests after
- **DynamoDB**: $5-15/month
  - On-demand pricing
  - Depends on read/write volume
- **S3 Storage**: $1-5/month
  - Knowledge base documents
  - Generated reports
- **Knowledge Base**: $150-170/month (if using OpenSearch Serverless)
  - Can be optimized or removed for cost savings

**Total Estimated Cost**: $30-100/month (without Knowledge Base)
**With Knowledge Base**: $180-270/month

## Security Best Practices

- IAM roles follow principle of least privilege
- All data encrypted at rest (DynamoDB, S3)
- Data encrypted in transit (HTTPS/TLS)
- AWS credentials never exposed to frontend
- API routes proxy requests to AWS services
- Environment variables for sensitive configuration
- CloudWatch logging enabled for audit trails

## Troubleshooting

### CDK Deployment Fails

**Issue**: Stack deployment fails with permission errors

**Solution**:
- Verify AWS credentials: `aws sts get-caller-identity`
- Ensure IAM user/role has CDK deployment permissions
- Check AWS account has Bedrock access enabled

### Lambda Function Errors

**Issue**: Lambda functions return errors in CloudWatch

**Solution**:
- Check Lambda execution role has DynamoDB permissions
- Verify environment variables are set correctly
- Review CloudWatch Logs for detailed error messages
- Ensure DynamoDB tables exist and are accessible

### Bedrock Agent Not Responding

**Issue**: Agent doesn't respond or returns errors

**Solution**:
- Verify agent is prepared and has an active alias
- Check Lambda function permissions allow Bedrock invocation
- Ensure action group schemas match Lambda function signatures
- Review agent instructions for clarity

### Knowledge Base Sync Fails

**Issue**: Knowledge base documents don't sync

**Solution**:
- Verify S3 bucket permissions
- Check documents are valid markdown format
- Ensure IAM role has S3 read permissions
- Try manual re-sync from Bedrock console

## Development

### Adding a New Lambda Function

1. Create function file in `lambda/api/` or `lambda/bedrock-actions/`
2. Add function to appropriate stack in `lib/`
3. Grant necessary IAM permissions
4. Deploy stack: `cdk deploy`

### Adding a New DynamoDB Table

1. Add table definition to `lib/dynamodb-stack.ts`
2. Deploy stack: `cdk deploy prism-insights-dynamodb-dev`
3. Update seeding scripts if needed

### Modifying Agent Actions

1. Update Lambda function code
2. Update action group schema JSON
3. Deploy stack: `cdk deploy prism-insights-bedrock-dev`
4. Re-prepare agent in Bedrock console

## Monitoring

### CloudWatch Metrics

Monitor the following metrics:

- Lambda invocation count and errors
- Lambda duration and throttles
- DynamoDB read/write capacity
- Bedrock API call count and latency

### CloudWatch Logs

Log groups created for:

- `/aws/lambda/prism-*` - All Lambda functions
- Bedrock agent invocations (in Bedrock console)

### Cost Monitoring

- Use AWS Cost Explorer to track spending
- Set up billing alerts for budget thresholds
- Monitor Bedrock token usage

## Cleanup

To remove all infrastructure:

```bash
# Clear DynamoDB data first (optional)
cd scripts
npm run clear

# Destroy all stacks
cd ..
npm run destroy
```

Note: S3 buckets with content may need manual deletion.

## Additional Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Amazon DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)

## Support

For issues or questions:

1. Check the deployment guides in this directory
2. Review CloudWatch Logs for errors
3. Consult AWS documentation
4. Open an issue in the repository

---

Built with AWS CDK and TypeScript
