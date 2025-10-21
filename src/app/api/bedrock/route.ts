import { NextRequest, NextResponse } from 'next/server';
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';

// Server-side configuration (secure)
const AWS_REGION = process.env.AWS_REGION || 'us-east-2';

// Agent configurations
const AGENTS = {
  'client-profitability': {
    agentId: process.env.BEDROCK_AGENT_ID || '3GN3ZUOIEE',
    aliasId: process.env.BEDROCK_AGENT_ALIAS_ID || 'TITLXBZO72',
  },
  'software-license': {
    agentId: process.env.SOFTWARE_LICENSE_AGENT_ID || 'EHJ2IHTNQB',
    aliasId: process.env.SOFTWARE_LICENSE_AGENT_ALIAS_ID || 'PXIFCAVXPF',
  },
  'sales-pipeline': {
    agentId: process.env.SALES_PIPELINE_AGENT_ID || 'S7RTFSWJCU',
    aliasId: process.env.SALES_PIPELINE_AGENT_ALIAS_ID || 'VMIGQIIM3O',
  },
};

export async function POST(request: NextRequest) {
  try {
    const { prompt, sessionId, agentType = 'client-profitability' } = await request.json();

    if (!prompt || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and sessionId' },
        { status: 400 }
      );
    }

    // Get agent configuration
    const agentConfig = AGENTS[agentType as keyof typeof AGENTS];
    if (!agentConfig) {
      return NextResponse.json(
        { error: `Invalid agent type: ${agentType}` },
        { status: 400 }
      );
    }

    // Initialize Bedrock client with server-side credentials
    const client = new BedrockAgentRuntimeClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN, // Required for temporary/SSO credentials
      },
    });

    const command = new InvokeAgentCommand({
      agentId: agentConfig.agentId,
      agentAliasId: agentConfig.aliasId,
      sessionId,
      inputText: prompt,
    });

    const response = await client.send(command);

    // Process streaming response
    let fullResponse = '';
    if (response.completion) {
      for await (const event of response.completion) {
        if (event.chunk && event.chunk.bytes) {
          const text = new TextDecoder().decode(event.chunk.bytes);
          fullResponse += text;
        }
      }
    }

    return NextResponse.json({
      response: fullResponse || 'No response from agent',
      sessionId,
    });
  } catch (error) {
    console.error('Error invoking Bedrock Agent:', error);
    return NextResponse.json(
      {
        error: 'Failed to invoke agent',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
