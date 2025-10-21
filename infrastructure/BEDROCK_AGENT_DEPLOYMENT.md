# Client Profitability Intelligence Agent - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Client Profitability Intelligence Agent using AWS Bedrock, Lambda, S3, and other AWS services.

## Architecture Summary

```
Frontend (Next.js)
    ↓
AWS Bedrock Agent (Claude 3.5 Sonnet)
    ↓
├── Action Groups (Lambda Functions)
│   ├── Query Client Data
│   ├── Analyze Margins
│   ├── Predict Churn
│   ├── Optimize Contract
│   ├── Optimize Service Tier
│   ├── Analyze Sentiment (Comprehend)
│   ├── Extract Contract Data (Textract)
│   └── Forecast Revenue
│
├── Knowledge Base (S3 + Vector DB)
│   ├── MSP Pricing Guidelines
│   ├── Contract Templates
│   └── Retention Strategies
│
└── Data Layer (DynamoDB)
    └── Client Data
```

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Node.js** 18+ and npm installed
4. **AWS CDK** installed globally: `npm install -g aws-cdk`
5. **PowerShell** (for Windows) or Bash (for Linux/Mac)

## Deployment Steps

### Step 1: Configure Environment

1. Navigate to the infrastructure directory:
   ```bash
   cd infrastructure
   ```

2. Verify environment variables in `.env`:
   ```bash
   AWS_ACCOUNT_ID=437639821856
   AWS_REGION=us-east-2
   ENVIRONMENT=dev
   PROJECT_NAME=prism-insights 
   ```

3. Configure AWS credentials (if not already done):
   ```powershell
   # Windows PowerShell
   .\configure-aws-session.ps1
   ```

### Step 2: Install Dependencies

1. Install CDK dependencies:
   ```bash
   npm install
   ```

2. Install Lambda function dependencies:
   ```bash
   cd lambda/bedrock-actions
   npm install
   cd ../..
   ```

### Step 3: Deploy Infrastructure with CDK

1. Bootstrap CDK (first time only):
   ```bash
   cdk bootstrap aws://437639821856/us-east-2
   ```

2. Synthesize CloudFormation template:
   ```bash
   cdk synth prism-insights-bedrock-dev
   ```

3. Deploy the Bedrock Agent stack:
   ```bash
   cdk deploy prism-insights-bedrock-dev
   ```

4. Note the outputs from the deployment:
   - `BedrockAgentRoleArn`: IAM role for the Bedrock Agent
   - `KnowledgeBaseBucketName`: S3 bucket for knowledge base
   - `ReportsBucketName`: S3 bucket for reports
   - Lambda function ARNs for each action group

### Step 4: Upload Knowledge Base Documents

1. Run the upload script:
   ```powershell
   # Windows PowerShell
   cd scripts
   .\upload-knowledge-base.ps1 -BucketName <KnowledgeBaseBucketName>
   ```

2. Verify files uploaded:
   ```bash
   aws s3 ls s3://<KnowledgeBaseBucketName>/client-profitability/ --recursive
   ```

### Step 5: Create Bedrock Agent (AWS Console)

Since Bedrock Agents don't have full CDK support yet, create the agent manually:

1. **Navigate to AWS Bedrock Console**
   - Go to https://console.aws.amazon.com/bedrock/
   - Select region: us-east-2
   - Click "Agents" in the left sidebar

2. **Create Agent**
   - Click "Create Agent"
   - Agent name: `client-profitability-agent`
   - Description: `AI agent for analyzing client profitability, predicting churn, and optimizing contracts`
   - Agent resource role: Select the role from CDK outputs (`BedrockAgentRoleArn`)
   - Foundation model: Select **"Anthropic"** → **"Claude 3.5 Sonnet v2"** (or use inference profile if available)
   - **IMPORTANT:** If you see "Inference profile" option, select that instead of direct model access

3. **Add Agent Instructions**
   
   Paste the following instructions:

   ```
   You are the Client Profitability Intelligence Agent for an MSP platform. Your role is to:

   1. Analyze client profitability metrics including revenue, costs, margins, and trends
   2. Detect margin erosion and identify root causes
   3. Recommend contract optimizations and pricing adjustments
   4. Predict churn risk using ML models and provide retention strategies
   5. Suggest service tier optimizations based on usage patterns
   6. Extract insights from client communications and contracts

   When analyzing profitability:
   - Always provide specific numbers and percentages
   - Identify trends over time (improving, declining, stable)
   - Compare against industry benchmarks (MSP industry average margin is 25%)
   - Prioritize actionable recommendations

   When predicting churn:
   - Use the ML model for quantitative risk scores
   - Consider qualitative factors from communications
   - Provide confidence intervals
   - Suggest specific retention actions with expected impact

   When recommending optimizations:
   - Focus on increasing margins while reducing churn risk
   - Provide cost-benefit analysis
   - Consider implementation feasibility
   - Prioritize high-impact, low-risk changes

   Be concise, data-driven, and actionable in your responses. Always cite specific metrics and provide clear reasoning for recommendations.
   ```

4. **Click "Create"**

### Step 6: Add Action Groups

**IMPORTANT:** Bedrock Agents have a limit of 10 APIs per agent. To stay within this limit, create only 2 action groups that contain all 8 functions.

#### Action Group 1: Core Analytics

1. In the agent details, go to "Action groups" tab
2. Click "Add action group"
3. Configure:
   - Action group name: `core-analytics`
   - Description: `Query data, analyze margins, predict churn, and optimize contracts`
   - Action group type: `Define with API schemas`
   - Action group invocation: Select Lambda function
   - Lambda function: Select `QueryClientDataFunction` from the dropdown
   - API Schema: Upload `lambda/bedrock-actions/core-analytics-schema.json`
4. Click "Add"

**This schema contains 4 APIs:**
- `/query-client-data` - Retrieve client financial data
- `/analyze-margins` - Perform margin analysis
- `/predict-churn` - Calculate churn risk
- `/optimize-contract` - Recommend contract optimizations

#### Action Group 2: Advanced Features

1. Click "Add action group"
2. Configure:
   - Action group name: `advanced-features`
   - Description: `Sentiment analysis, document extraction, revenue forecasting, and service tier optimization`
   - Action group type: `Define with API schemas`
   - Action group invocation: Select Lambda function
   - Lambda function: Select `QueryClientDataFunction` (same as above - all functions share the same code)
   - API Schema: Upload `lambda/bedrock-actions/advanced-features-schema.json`
3. Click "Add"

**This schema contains 4 APIs:**
- `/optimize-service-tier` - Suggest optimal service tier
- `/analyze-sentiment` - Analyze communication sentiment
- `/extract-contract-data` - Extract data from documents
- `/forecast-revenue` - Generate revenue forecasts

**Total: 8 APIs across 2 action groups (4 + 4 = 8, well under the 10 API limit)**

### Step 7: Create Knowledge Base

1. In the agent details, go to "Knowledge bases" tab
2. Click "Add knowledge base"
3. Configure:
   - Knowledge base name: `client-profitability-kb`
   - Description: `MSP pricing guidelines, industry benchmarks, and best practices`
   - Data source: S3
   - S3 URI: `s3://<KnowledgeBaseBucketName>/client-profitability/`
   - Embedding model: `Amazon Titan Embeddings G1 - Text`
   - Chunking strategy: Default (300 tokens)
4. Click "Create"
5. Wait for knowledge base to be created
6. Click "Sync" to index the documents
7. Wait for sync to complete (may take 5-10 minutes)

### Step 8: Update Lambda Permissions

After creating the agent, you need to update Lambda permissions to allow the specific agent to invoke them.

1. **Note your Agent ID** from the agent details page (e.g., `BYACCQ4C0S`)

2. **Run the permission update script:**
   ```powershell
   # Windows PowerShell
   cd scripts
   .\update-lambda-permissions.ps1 -AgentId YOUR_AGENT_ID
   ```
   
   Replace `YOUR_AGENT_ID` with your actual agent ID.

3. **Wait for the script to complete** - it will update all 8 Lambda functions

### Step 9: Prepare Agent

1. In the agent details, click "Prepare" button
2. Wait for preparation to complete (may take 2-3 minutes)
3. This compiles the agent with all action groups and knowledge base

### Step 10: Create Agent Alias

1. In the agent details, go to "Aliases" tab
2. Click "Create alias"
3. Configure:
   - Alias name: `production`
   - Description: `Production version of Client Profitability Agent`
4. Click "Create"
5. Note the **Agent ID** and **Alias ID** - you'll need these for frontend integration

### Step 11: Test the Agent

1. In the agent details, click "Test" in the top right
2. Try these test queries:

   **Test 1: Basic Query**
   ```
   Show me the profitability metrics for all clients.
   ```

   **Test 2: Specific Analysis**
   ```
   Analyze the margin trend for client ABC123.
   ```

   **Test 3: Churn Prediction**
   ```
   What is the churn risk for client XYZ789?
   ```

   **Test 4: Optimization**
   ```
   Recommend contract optimizations for client ABC123 to increase margin.
   ```

   **Test 5: Service Tier**
   ```
   What service tier should client XYZ789 be on?
   ```

3. Verify that:
   - Agent responds appropriately
   - Action groups are invoked correctly
   - Responses include data and insights
   - Knowledge base is referenced when relevant

### Step 12: Configure Frontend Integration

1. Update `frontend/.env.local`:
   ```
   NEXT_PUBLIC_BEDROCK_AGENT_ID=<agent-id>
   NEXT_PUBLIC_BEDROCK_AGENT_ALIAS_ID=<alias-id>
   NEXT_PUBLIC_AWS_REGION=us-east-2
   ```

2. The frontend will use AWS SDK to invoke the agent

## Verification Checklist

- [ ] CDK stack deployed successfully
- [ ] All Lambda functions created
- [ ] Knowledge base documents uploaded
- [ ] Bedrock Agent created
- [ ] 2 action groups added (with all 8 APIs)
- [ ] Knowledge base created and synced
- [ ] Agent prepared successfully
- [ ] Agent alias created
- [ ] Test queries work correctly
- [ ] Frontend environment variables configured

## Troubleshooting

### Issue: CDK Deployment Fails

**Solution:**
1. Check AWS credentials are configured
2. Verify account ID and region in `.env`
3. Check CloudFormation console for error details
4. Ensure IAM permissions are sufficient

### Issue: "Access denied when calling Bedrock" Error

**Solution:**
This error occurs when Lambda functions don't have the correct permissions for the specific agent. The fix:

1. **Get your Agent ID** from the agent details page in AWS Console

2. **Run the permission update script:**
   ```powershell
   cd infrastructure/scripts
   .\update-lambda-permissions.ps1 -AgentId YOUR_AGENT_ID
   ```

3. **Go back to your agent in AWS Console**

4. **Click "Prepare"** to refresh the agent

5. **Try testing again**

The script adds a source ARN condition to each Lambda function's resource policy, ensuring only your specific agent can invoke them. This is a security best practice required by AWS Bedrock.

### Issue: Lambda Functions Not Invoked

**Solution:**
1. Check Lambda resource policies allow Bedrock invocation
2. Verify IAM role has permissions to invoke Lambda
3. Check CloudWatch Logs for Lambda errors
4. Test Lambda functions directly first

### Issue: "Number of enabled APIs exceeded limit" Error

**Solution:**
This error occurs when you have more than 10 APIs across all action groups. The fix:

1. Delete all existing action groups from your agent
2. Create only 2 action groups (as described in Step 6)
3. Use the updated schema file that contains all 8 API endpoints
4. Both action groups can use the same Lambda function
5. This keeps you under the 10 API limit (4 APIs in group 1, 4 APIs in group 2)

### Issue: Knowledge Base Creation Fails with "403 Forbidden" or "security_exception"

**Solution:**
This error occurs when the Bedrock Agent role lacks permissions for OpenSearch Serverless. The role needs additional permissions:

1. Update the Bedrock Agent stack with OpenSearch Serverless permissions (already added in latest version)
2. Redeploy the stack:
   ```bash
   cd infrastructure
   cdk deploy prism-insights-bedrock-dev
   ```
3. After deployment completes, try creating the knowledge base again
4. The role now includes:
   - `aoss:APIAccessAll` - Access OpenSearch Serverless
   - `aoss:CreateSecurityPolicy` - Create security policies
   - `bedrock:CreateKnowledgeBase` - Create knowledge bases
   - `bedrock:AssociateAgentKnowledgeBase` - Link KB to agent

### Issue: Knowledge Base Sync Fails

**Solution:**
1. Verify S3 bucket permissions
2. Check documents are valid markdown
3. Ensure IAM role has S3 read permissions
4. Try re-syncing after fixing issues

### Issue: Agent Doesn't Use Knowledge Base

**Solution:**
1. Verify knowledge base is linked to agent
2. Check sync completed successfully
3. Try queries that specifically need KB information
4. Review agent instructions mention KB usage

### Issue: Slow Response Times

**Solution:**
1. Check Lambda function timeout settings
2. Verify DynamoDB has sufficient capacity
3. Review CloudWatch metrics for bottlenecks
4. Consider increasing Lambda memory

## Cost Estimation

### Monthly Costs (Estimated)

**Bedrock Agent:**
- Input tokens: ~$0.003 per 1K tokens
- Output tokens: ~$0.015 per 1K tokens
- Estimated: $20-50/month for moderate usage

**Lambda:**
- First 1M requests free
- $0.20 per 1M requests after
- Estimated: $5-10/month

**DynamoDB:**
- On-demand pricing
- ~$1.25 per million read requests
- Estimated: $5-10/month

**S3:**
- $0.023 per GB storage
- Estimated: $1-2/month

**Knowledge Base (OpenSearch Serverless):**
- ~$0.24 per OCU-hour
- Estimated: $50-100/month

**Total Estimated Cost: $80-170/month**

For demo/prototype with light usage, costs will be on the lower end.

## Monitoring and Maintenance

### CloudWatch Dashboards

Create dashboards to monitor:
- Agent invocation count and latency
- Lambda function errors and duration
- DynamoDB read/write capacity
- Knowledge base query performance

### CloudWatch Alarms

Set up alarms for:
- High error rate (> 5%)
- Slow response time (> 5 seconds)
- Lambda throttling
- DynamoDB throttling

### Regular Maintenance

**Weekly:**
- Review CloudWatch logs for errors
- Check agent performance metrics
- Monitor costs

**Monthly:**
- Update knowledge base documents
- Review and optimize Lambda functions
- Analyze usage patterns
- Update agent instructions if needed

**Quarterly:**
- Review and update pricing guidelines
- Update contract templates
- Refresh retention strategies
- Evaluate new AWS features

## Security Best Practices

1. **IAM Roles:**
   - Use least privilege principle
   - Regularly review permissions
   - Rotate credentials

2. **Data Protection:**
   - Enable encryption at rest (S3, DynamoDB)
   - Use TLS for data in transit
   - Implement data retention policies

3. **Access Control:**
   - Use VPC endpoints where possible
   - Implement API authentication
   - Monitor access logs

4. **Compliance:**
   - Document data handling procedures
   - Implement audit logging
   - Regular security reviews

## Next Steps

After successful deployment:

1. **Create Additional Agents:**
   - Software License Intelligence Agent
   - Sales Pipeline Optimization Agent

2. **Implement Agent Collaboration:**
   - Set up EventBridge rules
   - Implement predictive cascading
   - Add consensus scoring

3. **Add Advanced Features:**
   - SageMaker ML models
   - Real-time data updates
   - Custom analytics

4. **Production Readiness:**
   - Implement CI/CD pipeline
   - Add comprehensive monitoring
   - Create runbooks for operations
   - Conduct load testing

## Support and Resources

- **AWS Bedrock Documentation:** https://docs.aws.amazon.com/bedrock/
- **AWS CDK Documentation:** https://docs.aws.amazon.com/cdk/
- **Project Repository:** [Your repo URL]
- **Issue Tracker:** [Your issue tracker URL]

## Conclusion

You now have a fully functional Client Profitability Intelligence Agent deployed on AWS Bedrock. The agent can analyze client profitability, predict churn, optimize contracts, and provide strategic recommendations using advanced AI capabilities.

For questions or issues, refer to the troubleshooting section or contact the development team.
