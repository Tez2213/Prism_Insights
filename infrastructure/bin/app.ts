#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoDBStack } from '../lib/dynamodb-stack';
import { ApiStack } from '../lib/api-stack';
import { BedrockAgentStack } from '../lib/bedrock-agent-stack';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new cdk.App();

const env = {
  account: process.env.AWS_ACCOUNT_ID || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.AWS_REGION || process.env.CDK_DEFAULT_REGION || 'us-east-2',
};

const environment = process.env.ENVIRONMENT || 'dev';
const projectName = process.env.PROJECT_NAME || 'prism-insights';

// Create DynamoDB stack
const dynamoStack = new DynamoDBStack(app, `${projectName}-dynamodb-${environment}`, {
  env,
  description: 'DynamoDB tables for Prism Insights - Real-time data for AI agents',
  tags: {
    Project: projectName,
    Environment: environment,
    ManagedBy: 'CDK',
  },
});

// Create API stack with Lambda functions and API Gateway
new ApiStack(app, `${projectName}-api-${environment}`, dynamoStack, {
  env,
  description: 'API Gateway and Lambda functions for Prism Insights',
  tags: {
    Project: projectName,
    Environment: environment,
    ManagedBy: 'CDK',
  },
});

// Create Bedrock Agent stack with action groups and knowledge base
new BedrockAgentStack(app, `${projectName}-bedrock-${environment}`, dynamoStack, {
  env,
  description: 'AWS Bedrock Agents infrastructure for AI-powered intelligence',
  tags: {
    Project: projectName,
    Environment: environment,
    ManagedBy: 'CDK',
  },
});

app.synth();
