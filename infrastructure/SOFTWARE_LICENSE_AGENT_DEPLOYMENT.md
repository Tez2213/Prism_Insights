# Software License Intelligence Agent - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Software License Intelligence Agent using AWS Bedrock, Lambda, S3, and other AWS services.

## Architecture Summary

```
Frontend (Next.js)
    ↓
AWS Bedrock Agent (Claude 3.5 Sonnet)
    ↓
├── Action Groups (Lambda Functions)
│   ├── Query License Data
│   ├── Assess Compliance Risk
│   ├── Optimize License Costs
│   ├── Get Vendor Intelligence
│   ├── Monitor Usage
│   ├── Analyze Vendor Communications (Comprehend)
│   └── Extract License Agreement Data (Textract)
│
├── Knowledge Base (S3 + Vector DB)
│   ├── Vendor Pricing Data
│   ├── Compliance Regulations
│   └── Negotiation Strategies
│
└── Data Layer (DynamoDB)
    └── License Data
```

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Node.js** 18+ and npm installed
4. **AWS CDK** installed globally: `npm install -g aws-cdk`
5. **PowerShell** (for Windows) or Bash (for Linux/Mac)
6. **Client Profitability Agent** already deployed (for shared infrastructure)

## Agent Instructions

The Software License Intelligence Agent uses the following comprehensive instructions:

```
You are the Software License Intelligence Agent for an MSP platform. Your role is to provide advanced intelligence for software license management, cost optimization, compliance, and vendor negotiations.

## Core Responsibilities

1. **License Usage Monitoring**
   - Track real-time license utilization across all software products
   - Identify underutilized licenses and waste
   - Monitor usage trends and predict future needs
   - Detect usage anomalies and potential compliance issues

2. **Compliance Risk Management**
   - Assess compliance status against license agreements
   - Identify compliance gaps and violations
   - Provide specific remediation steps with timelines
   - Calculate potential financial exposure from non-compliance
   - Monitor license expiration dates and renewal requirements

3. **Cost Optimization**
   - Identify opportunities to reduce license costs
   - Recommend license consolidation strategies
   - Suggest alternative vendors with better pricing
   - Calculate ROI for license changes
   - Optimize license allocation across departments

4. **Vendor Negotiation Support**
   - Provide current market pricing benchmarks
   - Suggest negotiation tactics based on vendor and situation
   - Identify leverage points (e.g., multi-year commitments, volume discounts)
   - Recommend alternative vendors for competitive pressure
   - Analyze vendor lock-in risks and mitigation strategies

5. **License Consolidation**
   - Identify redundant or overlapping licenses
   - Recommend consolidation opportunities
   - Calculate savings from consolidation
   - Assess migration risks and effort

6. **Document Analysis**
   - Extract key terms from license agreements using OCR
   - Analyze vendor communications for sentiment and key points
   - Identify unfavorable terms or hidden costs
   - Compare terms across vendors

## Response Guidelines

### When Analyzing License Usage:
- Always calculate and report utilization rates as percentages
- Identify specific licenses with low utilization (< 70%)
- Quantify waste in dollar amounts
- Provide trend analysis (improving, declining, stable)
- Compare against industry benchmarks (typical MSP utilization: 80-85%)
- Recommend specific actions with expected savings

### When Assessing Compliance:
- Clearly state compliance status (compliant, at-risk, non-compliant)
- List specific compliance gaps with severity levels
- Provide step-by-step remediation plans
- Calculate potential financial exposure
- Set realistic timelines for remediation
- Prioritize by risk level and financial impact

### When Optimizing Costs:
- Provide specific dollar amounts for potential savings
- Calculate ROI and payback periods
- Consider implementation effort and risks
- Prioritize high-impact, low-risk opportunities
- Provide alternative vendor options with pricing
- Include total cost of ownership (TCO) analysis

### When Supporting Negotiations:
- Provide current market rates with sources
- Suggest specific negotiation tactics
- Identify your leverage points
- Recommend timing for negotiations
- Provide fallback positions
- Include competitive alternatives

### When Identifying Consolidation:
- List specific licenses that can be consolidated
- Calculate total savings (licensing + management overhead)
- Assess migration complexity and risks
- Provide implementation roadmap
- Identify potential issues and mitigation strategies

## Data-Driven Approach

- Always cite specific numbers, percentages, and dollar amounts
- Use historical data to identify trends
- Compare against industry benchmarks
- Provide confidence levels for predictions
- Show calculations and assumptions
- Reference knowledge base documents when applicable

## Tone and Style

- Be precise and compliance-focused
- Use clear, professional language
- Prioritize actionable recommendations
- Be cost-conscious and ROI-focused
- Acknowledge risks and trade-offs
- Provide specific next steps

## Example Responses

**Good Response:**
"License utilization analysis shows Microsoft 365 E5 licenses at 62% utilization (248 of 400 licenses actively used). This represents $45,600 in annual waste. Recommendation: Downgrade 150 licenses to E3 tier, saving $34,200 annually. Implementation risk: Low. Timeline: 30 days. ROI: Immediate."

**Avoid:**
"You have some unused licenses that could be optimized."

Always be specific, quantitative, and actionable in your responses.
```

## Deployment Steps

### Step 1: Verify Prerequisites

Ensure the shared infrastructure from the Client Profitability Agent is deployed:
- DynamoDB tables
- S3 buckets (knowledge base and reports)
- IAM roles
- VPC configuration (if applicable)

### Step 2: Create Bedrock Agent (AWS Console)

1. **Navigate to AWS Bedrock Console**
   - Go to https://console.aws.amazon.com/bedrock/
   - Select region: us-east-2
   - Click "Agents" in the left sidebar

2. **Create Agent**
   - Click "Create Agent"
   - Agent name: `software-license-agent`
   - Description: `AI agent for software license management, cost optimization, compliance, and vendor negotiations`
   - Agent resource role: Use existing role or create new with permissions for:
     - Lambda invocation
     - S3 access (knowledge base bucket)
     - Bedrock model invocation
   - Foundation model: `Anthropic Claude 3.5 Sonnet`
   - Temperature: `0.6` (more deterministic for compliance)
   - Top P: `0.9`
   - Max tokens: `4096`

3. **Add Agent Instructions**
   
   Copy and paste the agent instructions from above into the instructions field.

4. **Click "Create"**

### Step 3: Create Lambda Functions for Action Groups

Navigate to `infrastructure/lambda/bedrock-actions/` and create the following Lambda functions:

#### Function 1: Query License Data
File: `query-license-data.js`

#### Function 2: Assess Compliance Risk
File: `assess-compliance.js`

#### Function 3: Optimize License Costs
File: `optimize-license-costs.js`

#### Function 4: Get Vendor Intelligence
File: `get-vendor-intelligence.js`

#### Function 5: Monitor Usage
File: `monitor-usage.js`

#### Function 6: Analyze Vendor Communications
File: `analyze-vendor-communications.js`

#### Function 7: Extract License Agreement Data
File: `extract-license-data.js`

### Step 4: Create OpenAPI Schema

Create the OpenAPI schema file that defines all action groups:
File: `software-license-schema.json`

### Step 5: Deploy Lambda Functions

Deploy the Lambda functions using AWS CDK or manually:

```bash
cd infrastructure
cdk deploy prism-insights-bedrock-dev
```

### Step 6: Add Action Groups to Bedrock Agent

For each action group, follow these steps in the AWS Console:

#### Action Group 1: Query License Data

1. In the agent details, go to "Action groups" tab
2. Click "Add action group"
3. Configure:
   - Action group name: `query-license-data`
   - Description: `Retrieve license inventory and usage data`
   - Action group type: `Define with API schemas`
   - Action group invocation: Select Lambda function
   - Lambda function: Select `QueryLicenseDataFunction` from the dropdown
   - API Schema: Upload `software-license-schema.json`
4. Click "Add"

#### Action Group 2: Assess Compliance Risk

1. Click "Add action group"
2. Configure:
   - Action group name: `assess-compliance`
   - Description: `Check license compliance and identify risks`
   - Lambda function: Select `AssessComplianceFunction`
   - API Schema: Use the same schema file
3. Click "Add"

#### Action Group 3: Optimize License Costs

1. Click "Add action group"
2. Configure:
   - Action group name: `optimize-license-costs`
   - Description: `Identify cost optimization opportunities`
   - Lambda function: Select `OptimizeLicenseCostsFunction`
   - API Schema: Use the same schema file
3. Click "Add"

#### Action Group 4: Get Vendor Intelligence

1. Click "Add action group"
2. Configure:
   - Action group name: `get-vendor-intelligence`
   - Description: `Retrieve market intelligence for vendor negotiations`
   - Lambda function: Select `GetVendorIntelligenceFunction`
   - API Schema: Use the same schema file
3. Click "Add"

#### Action Group 5: Monitor Usage

1. Click "Add action group"
2. Configure:
   - Action group name: `monitor-usage`
   - Description: `Real-time license usage monitoring and anomaly detection`
   - Lambda function: Select `MonitorUsageFunction`
   - API Schema: Use the same schema file
3. Click "Add"

#### Action Group 6: Analyze Vendor Communications

1. Click "Add action group"
2. Configure:
   - Action group name: `analyze-vendor-communications`
   - Description: `Analyze vendor communications using Amazon Comprehend`
   - Lambda function: Select `AnalyzeVendorCommunicationsFunction`
   - API Schema: Use the same schema file
3. Click "Add"

#### Action Group 7: Extract License Agreement Data

1. Click "Add action group"
2. Configure:
   - Action group name: `extract-license-data`
   - Description: `Extract data from license agreements using Amazon Textract`
   - Lambda function: Select `ExtractLicenseDataFunction`
   - API Schema: Use the same schema file
3. Click "Add"

### Step 7: Create Knowledge Base

1. **Prepare Knowledge Base Documents**
   - Create directory: `infrastructure/knowledge-base/software-license/`
   - Add documents (see Step 8)

2. **Upload to S3**
   ```bash
   aws s3 sync infrastructure/knowledge-base/software-license/ s3://<knowledge-base-bucket>/software-license/
   ```

3. **Create Knowledge Base in AWS Console**
   - In the agent details, go to "Knowledge bases" tab
   - Click "Add knowledge base"
   - Configure:
     - Knowledge base name: `software-license-kb`
     - Description: `Vendor pricing data, compliance regulations, and negotiation strategies`
     - Data source: S3
     - S3 URI: `s3://<knowledge-base-bucket>/software-license/`
     - Embedding model: `Amazon Titan Embeddings G1 - Text`
     - Chunking strategy: Default (300 tokens)
   - Click "Create"
   - Click "Sync" to index the documents
   - Wait for sync to complete (5-10 minutes)

### Step 8: Prepare Agent

1. In the agent details, click "Prepare" button
2. Wait for preparation to complete (2-3 minutes)
3. This compiles the agent with all action groups and knowledge base

### Step 9: Create Agent Alias

1. In the agent details, go to "Aliases" tab
2. Click "Create alias"
3. Configure:
   - Alias name: `production`
   - Description: `Production version of Software License Agent`
4. Click "Create"
5. Note the **Agent ID** and **Alias ID** for frontend integration

### Step 10: Test the Agent

Test the agent with these queries:

**Test 1: License Usage Query**
```
Show me the utilization rates for all software licenses.
```

**Test 2: Compliance Assessment**
```
Are we compliant with all our software licenses? Identify any risks.
```

**Test 3: Cost Optimization**
```
What opportunities do we have to reduce software license costs?
```

**Test 4: Vendor Negotiation**
```
We're renewing our Microsoft contract. What's the current market rate and what negotiation tactics should we use?
```

**Test 5: License Consolidation**
```
Can we consolidate any of our licenses to save money?
```

**Test 6: Usage Monitoring**
```
Monitor the usage of Adobe Creative Cloud licenses over the past month.
```

### Step 11: Configure Frontend Integration

Update `frontend/.env.local`:
```
NEXT_PUBLIC_SOFTWARE_LICENSE_AGENT_ID=<agent-id>
NEXT_PUBLIC_SOFTWARE_LICENSE_AGENT_ALIAS_ID=<alias-id>
NEXT_PUBLIC_AWS_REGION=us-east-2
```

## Verification Checklist

- [ ] Bedrock Agent created successfully
- [ ] All 7 action groups added
- [ ] Lambda functions deployed and accessible
- [ ] Knowledge base created and synced
- [ ] Agent prepared successfully
- [ ] Agent alias created
- [ ] Test queries work correctly
- [ ] Frontend environment variables configured

## Troubleshooting

### Issue: Compliance Assessment Returns Generic Results

**Solution:**
1. Verify license data in DynamoDB includes compliance fields
2. Check Lambda function has access to license agreement terms
3. Ensure knowledge base includes compliance regulations
4. Review agent instructions emphasize compliance specificity

### Issue: Cost Optimization Recommendations Too Vague

**Solution:**
1. Ensure Lambda function calculates specific dollar amounts
2. Verify market pricing data in knowledge base is current
3. Check agent instructions emphasize quantitative recommendations
4. Add more detailed pricing examples to knowledge base

### Issue: Vendor Intelligence Not Helpful

**Solution:**
1. Update knowledge base with current market data
2. Add more vendor-specific negotiation tactics
3. Include recent pricing benchmarks
4. Add competitive vendor information

## Cost Estimation

### Monthly Costs (Estimated)

**Bedrock Agent:**
- Input tokens: ~$0.003 per 1K tokens
- Output tokens: ~$0.015 per 1K tokens
- Estimated: $15-40/month for moderate usage

**Lambda:**
- Estimated: $5-10/month

**DynamoDB:**
- Estimated: $5-10/month

**S3:**
- Estimated: $1-2/month

**Knowledge Base (OpenSearch Serverless):**
- Estimated: $50-100/month

**Amazon Comprehend:**
- $0.0001 per unit (100 characters)
- Estimated: $5-15/month

**Amazon Textract:**
- $0.0015 per page
- Estimated: $5-10/month

**Total Estimated Cost: $85-185/month**

## Monitoring

### Key Metrics to Monitor

- Agent invocation count and latency
- Action group execution times
- Compliance assessment accuracy
- Cost optimization recommendation acceptance rate
- Knowledge base query performance
- Comprehend API usage
- Textract API usage

### CloudWatch Alarms

Set up alarms for:
- High error rate (> 5%)
- Slow response time (> 5 seconds)
- Lambda throttling
- High Comprehend/Textract costs

## Next Steps

After successful deployment:

1. **Integrate with Frontend**
   - Update chat component to use Software License Agent
   - Add agent-specific UI elements
   - Test streaming responses

2. **Enhance Knowledge Base**
   - Add more vendor pricing data
   - Update compliance regulations regularly
   - Add negotiation case studies

3. **Implement Advanced Features**
   - Real-time usage monitoring dashboard
   - Automated compliance alerts
   - Vendor negotiation playbooks

4. **Deploy Sales Pipeline Agent**
   - Follow similar pattern
   - Implement agent collaboration
   - Add predictive cascading

## Conclusion

You now have a fully functional Software License Intelligence Agent that can monitor license usage, assess compliance risks, optimize costs, and support vendor negotiations using advanced AI capabilities.

