# Creating the Client Profitability Bedrock Agent

This guide walks through creating the Client Profitability Intelligence Agent in AWS Bedrock using the AWS Console.

## Prerequisites

1. Deploy the CDK stack to create Lambda functions and IAM roles:
   ```bash
   cd infrastructure
   npm install
   cdk deploy prism-insights-bedrock-dev
   ```

2. Note the output values from the CDK deployment:
   - BedrockAgentRoleArn
   - Lambda function ARNs for each action group
   - KnowledgeBaseBucketName

## Step 1: Create the Bedrock Agent

1. Navigate to AWS Bedrock Console
2. Go to "Agents" in the left sidebar
3. Click "Create Agent"
4. Configure the agent:
   - **Agent name**: `client-profitability-agent`
   - **Description**: `AI agent for analyzing client profitability, predicting churn, and optimizing contracts`
   - **Agent resource role**: Select the role created by CDK (check CloudFormation outputs)
   - **Foundation model**: `Anthropic Claude 3.5 Sonnet`
   - **Instructions**: Paste the following:

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

5. Click "Create"

## Step 2: Add Action Groups

For each action group, follow these steps:

### Action Group 1: Query Client Data

1. In the agent details, go to "Action groups" tab
2. Click "Add action group"
3. Configure:
   - **Action group name**: `query-client-data`
   - **Description**: `Retrieve client financial metrics and historical data`
   - **Action group type**: `Define with API schemas`
   - **Action group invocation**: Select Lambda function
   - **Lambda function**: Select the `QueryClientDataFunction` from CDK outputs
   - **API Schema**: Upload `infrastructure/lambda/bedrock-actions/client-profitability-schema.json` (only the `/query-client-data` path)
4. Click "Add"

### Action Group 2: Analyze Margins

1. Click "Add action group"
2. Configure:
   - **Action group name**: `analyze-margins`
   - **Description**: `Perform detailed margin analysis and identify erosion`
   - **Action group type**: `Define with API schemas`
   - **Action group invocation**: Select Lambda function
   - **Lambda function**: Select the `AnalyzeMarginsFunction`
   - **API Schema**: Upload schema for `/analyze-margins` path
3. Click "Add"

### Action Group 3: Predict Churn

1. Click "Add action group"
2. Configure:
   - **Action group name**: `predict-churn`
   - **Description**: `Invoke ML model to predict client churn risk`
   - **Action group type**: `Define with API schemas`
   - **Action group invocation**: Select Lambda function
   - **Lambda function**: Select the `PredictChurnFunction`
   - **API Schema**: Upload schema for `/predict-churn` path
3. Click "Add"

### Action Group 4: Optimize Contract

1. Click "Add action group"
2. Configure:
   - **Action group name**: `optimize-contract`
   - **Description**: `Recommend contract optimizations and pricing adjustments`
   - **Action group type**: `Define with API schemas`
   - **Action group invocation**: Select Lambda function
   - **Lambda function**: Select the `OptimizeContractFunction`
   - **API Schema**: Upload schema for `/optimize-contract` path
3. Click "Add"

### Action Group 5: Optimize Service Tier

1. Click "Add action group"
2. Configure:
   - **Action group name**: `optimize-service-tier`
   - **Description**: `Recommend optimal service tier based on usage patterns`
   - **Action group type**: `Define with API schemas`
   - **Action group invocation**: Select Lambda function
   - **Lambda function**: Select the `OptimizeServiceTierFunction`
   - **API Schema**: Upload schema for `/optimize-service-tier` path
3. Click "Add"

## Step 3: Create Knowledge Base (Optional for Phase 1)

1. In the agent details, go to "Knowledge bases" tab
2. Click "Add knowledge base"
3. Configure:
   - **Knowledge base name**: `client-profitability-kb`
   - **Description**: `MSP pricing guidelines, industry benchmarks, and best practices`
   - **Data source**: S3
   - **S3 URI**: Use the KnowledgeBaseBucketName from CDK outputs
   - **Embedding model**: `Amazon Titan Embeddings G1 - Text`
4. Upload documents to the S3 bucket:
   - MSP pricing guidelines
   - Industry benchmark reports
   - Contract templates
   - Retention strategy documents
5. Click "Sync" to index the documents

## Step 4: Create Agent Alias

1. In the agent details, go to "Aliases" tab
2. Click "Create alias"
3. Configure:
   - **Alias name**: `production`
   - **Description**: `Production version of Client Profitability Agent`
4. Click "Create"
5. Note the **Agent ID** and **Alias ID** - you'll need these for the frontend integration

## Step 5: Test the Agent

1. In the agent details, click "Test" in the top right
2. Try these test queries:
   - "Show me the profitability metrics for all clients"
   - "Analyze the margin trend for client ABC123"
   - "What is the churn risk for client XYZ789?"
   - "Recommend contract optimizations for client ABC123 to increase margin"
   - "What service tier should client XYZ789 be on?"

3. Verify that:
   - The agent invokes the correct action groups
   - Lambda functions return proper data
   - Responses are formatted correctly
   - The agent provides actionable insights

## Step 6: Configure Frontend Integration

1. Update `frontend/.env.local` with the agent details:
   ```
   NEXT_PUBLIC_BEDROCK_AGENT_ID=<agent-id>
   NEXT_PUBLIC_BEDROCK_AGENT_ALIAS_ID=<alias-id>
   NEXT_PUBLIC_AWS_REGION=us-east-2
   ```

2. The frontend will use AWS SDK to invoke the agent via the Bedrock Agent Runtime API

## Troubleshooting

### Lambda Invocation Errors

If the agent can't invoke Lambda functions:
1. Check IAM permissions on the Bedrock Agent role
2. Verify Lambda resource policies allow Bedrock invocation
3. Check CloudWatch Logs for Lambda errors

### Knowledge Base Issues

If knowledge base queries fail:
1. Verify S3 bucket permissions
2. Check that documents are properly indexed
3. Try re-syncing the knowledge base

### Agent Response Issues

If agent responses are incorrect:
1. Review agent instructions for clarity
2. Check action group schemas match Lambda implementations
3. Test Lambda functions directly to verify data
4. Review CloudWatch Logs for errors

## Cost Considerations

- **Bedrock Agent**: ~$0.002 per 1000 input tokens, ~$0.008 per 1000 output tokens
- **Lambda**: First 1M requests free, then $0.20 per 1M requests
- **S3**: $0.023 per GB storage
- **DynamoDB**: On-demand pricing, ~$1.25 per million read requests

For a demo/prototype, costs should be minimal (< $10/month).

## Next Steps

After creating the Client Profitability Agent:
1. Create the Software License Intelligence Agent (similar process)
2. Create the Sales Pipeline Optimization Agent (similar process)
3. Implement agent collaboration with EventBridge
4. Add advanced features (Comprehend, Textract, Forecast)
