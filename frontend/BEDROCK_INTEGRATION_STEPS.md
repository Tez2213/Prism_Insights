# Bedrock Agent Integration Steps

## Overview
This guide walks you through integrating your deployed AWS Bedrock Agent with the frontend application.

## Agent Details
- **Agent ID**: `3GN3ZUOIEC`
- **Alias ID**: `TITLXBZO72`
- **Region**: `us-east-2`

## Step 1: Install AWS SDK

Install the required AWS SDK package for Bedrock Agent Runtime:

```bash
cd frontend
npm install @aws-sdk/client-bedrock-agent-runtime
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local` and add your AWS credentials:

```env
NEXT_PUBLIC_BEDROCK_AGENT_ID=3GN3ZUOIEC
NEXT_PUBLIC_BEDROCK_AGENT_ALIAS_ID=TITLXBZO72
NEXT_PUBLIC_AWS_REGION=us-east-2

# Add your AWS credentials
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_access_key_here
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

### Security Note
⚠️ **Important**: Exposing AWS credentials in the frontend is NOT recommended for production!

For production, you should:
1. Create a backend API endpoint that proxies requests to Bedrock
2. Use AWS Cognito for user authentication
3. Use temporary credentials with limited permissions

## Step 3: Test the Integration

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the Client Profitability page:
```
http://localhost:3000/dashboard/client-profitability
```

3. Click the floating chat button in the bottom right

4. Try these test queries:
   - "Show me the profitability metrics for all clients"
   - "What is the churn risk for client ABC123?"
   - "Analyze the margin trend for TechCorp Solutions"
   - "Recommend contract optimizations to increase margin"

## Step 4: Verify Agent Responses

The agent should now:
- Query client data from DynamoDB
- Analyze margins and trends
- Predict churn risk
- Provide optimization recommendations
- Reference knowledge base documents

## Step 5: Production Deployment (Recommended)

### Option A: Backend Proxy (Recommended)

Create a Next.js API route to proxy Bedrock requests:

```typescript
// frontend/src/app/api/bedrock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';

export async function POST(request: NextRequest) {
  const { prompt, sessionId } = await request.json();

  const client = new BedrockAgentRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new InvokeAgentCommand({
    agentId: process.env.BEDROCK_AGENT_ID,
    agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID,
    sessionId,
    inputText: prompt,
  });

  const response = await client.send(command);
  
  let fullResponse = '';
  if (response.completion) {
    for await (const event of response.completion) {
      if (event.chunk?.bytes) {
        fullResponse += new TextDecoder().decode(event.chunk.bytes);
      }
    }
  }

  return NextResponse.json({ response: fullResponse });
}
```

Then update the Bedrock client to use this endpoint instead of direct AWS calls.

### Option B: AWS Cognito Authentication

1. Set up AWS Cognito User Pool
2. Configure Cognito Identity Pool with Bedrock permissions
3. Use temporary credentials from Cognito
4. Update the Bedrock client to use Cognito credentials

## Troubleshooting

### Issue: "Access Denied" Error

**Solution**: Verify your AWS credentials have the following permissions:
- `bedrock:InvokeAgent`
- `bedrock:InvokeModel`

### Issue: "Agent Not Found" Error

**Solution**: Double-check your Agent ID and Alias ID in `.env.local`

### Issue: No Response from Agent

**Solution**: 
1. Check CloudWatch Logs for Lambda errors
2. Verify Lambda permissions allow Bedrock invocation
3. Ensure DynamoDB has sample data

### Issue: CORS Errors

**Solution**: If using a backend proxy, ensure CORS headers are properly configured

## Next Steps

1. ✅ Install AWS SDK package
2. ✅ Configure environment variables
3. ✅ Test the chat integration
4. 🔄 Implement backend proxy for production
5. 🔄 Add error handling and retry logic
6. 🔄 Implement conversation history persistence
7. 🔄 Add typing indicators and streaming responses

## Additional Features to Implement

### Streaming Responses
Update the Bedrock client to stream responses in real-time for better UX.

### Conversation History
Store conversation history in local storage or a database for context persistence.

### Multi-Agent Support
Extend the integration to support other agents (Software License, Sales Pipeline, etc.).

### Analytics
Track agent usage, response times, and user satisfaction metrics.

## Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Bedrock Agent Runtime API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Operations_Agents_for_Amazon_Bedrock_Runtime.html)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
