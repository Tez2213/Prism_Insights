import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { DynamoDBStack } from './dynamodb-stack';
import * as path from 'path';

export class BedrockAgentStack extends cdk.Stack {
  public readonly knowledgeBaseBucket: s3.Bucket;
  public readonly actionGroupLambdas: { [key: string]: lambda.Function };

  constructor(scope: Construct, id: string, dynamoStack: DynamoDBStack, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket for knowledge base documents
    this.knowledgeBaseBucket = new s3.Bucket(this, 'KnowledgeBaseBucket', {
      bucketName: `prism-knowledge-base-${this.account}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
    });

    // Create S3 bucket for generated reports
    const reportsBucket = new s3.Bucket(this, 'ReportsBucket', {
      bucketName: `prism-reports-${this.account}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create IAM role for Lambda functions (action groups)
    const actionGroupLambdaRole = new iam.Role(this, 'ActionGroupLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Grant DynamoDB read permissions
    Object.values(dynamoStack.tables).forEach((table) => {
      table.grantReadData(actionGroupLambdaRole);
    });

    // Grant S3 permissions for reports
    reportsBucket.grantReadWrite(actionGroupLambdaRole);

    // Grant permissions for AI services
    actionGroupLambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'comprehend:DetectSentiment',
        'comprehend:DetectEntities',
        'comprehend:DetectKeyPhrases',
      ],
      resources: ['*'],
    }));

    actionGroupLambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'textract:AnalyzeDocument',
        'textract:DetectDocumentText',
      ],
      resources: ['*'],
    }));

    // Create Lambda functions for action groups
    this.actionGroupLambdas = {};

    const actionGroups = [
      { name: 'QueryClientData', handler: 'query-client-data.handler', description: 'Query client financial data' },
      { name: 'AnalyzeMargins', handler: 'analyze-margins.handler', description: 'Analyze client margins' },
      { name: 'PredictChurn', handler: 'predict-churn.handler', description: 'Predict client churn risk' },
      { name: 'OptimizeContract', handler: 'optimize-contract.handler', description: 'Recommend contract optimizations' },
      { name: 'OptimizeServiceTier', handler: 'optimize-service-tier.handler', description: 'Recommend optimal service tier' },
      { name: 'AnalyzeSentiment', handler: 'analyze-sentiment.handler', description: 'Analyze sentiment from client communications' },
      { name: 'ExtractContractData', handler: 'extract-contract-data.handler', description: 'Extract data from contract documents' },
      { name: 'ForecastRevenue', handler: 'forecast-revenue.handler', description: 'Forecast client revenue' },
    ];

    actionGroups.forEach(({ name, handler, description }) => {
      const fn = new lambda.Function(this, `${name}Function`, {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: handler,
        code: lambda.Code.fromAsset('lambda/bedrock-actions'),
        role: actionGroupLambdaRole,
        timeout: cdk.Duration.seconds(30),
        memorySize: 512,
        description: description,
        environment: {
          REPORTS_BUCKET: reportsBucket.bucketName,
        },
      });

      this.actionGroupLambdas[name] = fn;

      // Grant Bedrock permission to invoke Lambda
      fn.addPermission(`BedrockInvoke${name}`, {
        principal: new iam.ServicePrincipal('bedrock.amazonaws.com'),
        action: 'lambda:InvokeFunction',
        sourceAccount: this.account,
      });

      // Output Lambda ARN
      new cdk.CfnOutput(this, `${name}FunctionArn`, {
        value: fn.functionArn,
        description: `ARN for ${name} Lambda function`,
        exportName: `prism-${name.toLowerCase()}-arn`,
      });
    });

    // Create IAM role for Bedrock Agent
    const bedrockAgentRole = new iam.Role(this, 'BedrockAgentRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      description: 'Role for Prism Insights Bedrock Agents',
    });

    // Grant permissions to invoke Lambda functions
    Object.values(this.actionGroupLambdas).forEach((fn) => {
      fn.grantInvoke(bedrockAgentRole);
    });

    // Grant permissions to access knowledge base
    this.knowledgeBaseBucket.grantRead(bedrockAgentRole);

    // Grant permissions to invoke Bedrock models
    bedrockAgentRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream',
      ],
      resources: [
        `arn:aws:bedrock:${this.region}::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0`,
      ],
    }));

    // Output role ARN
    new cdk.CfnOutput(this, 'BedrockAgentRoleArn', {
      value: bedrockAgentRole.roleArn,
      description: 'IAM Role ARN for Bedrock Agents',
      exportName: 'prism-bedrock-agent-role-arn',
    });

    // Output bucket names
    new cdk.CfnOutput(this, 'KnowledgeBaseBucketName', {
      value: this.knowledgeBaseBucket.bucketName,
      description: 'S3 bucket for knowledge base documents',
      exportName: 'prism-knowledge-base-bucket',
    });

    new cdk.CfnOutput(this, 'ReportsBucketName', {
      value: reportsBucket.bucketName,
      description: 'S3 bucket for generated reports',
      exportName: 'prism-reports-bucket',
    });

    // Create instructions for manual Bedrock Agent setup
    new cdk.CfnOutput(this, 'BedrockAgentSetupInstructions', {
      value: 'Use AWS Console to create Bedrock Agent with the exported role and Lambda ARNs',
      description: 'Next steps for Bedrock Agent creation',
    });
  }
}
