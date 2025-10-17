import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { DynamoDBStack } from './dynamodb-stack';

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, dynamoStack: DynamoDBStack, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create API Gateway
    this.api = new apigateway.RestApi(this, 'PrismApi', {
      restApiName: 'Prism Insights API',
      description: 'API for Prism Insights MSP AI Agent Platform',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Create Lambda execution role with DynamoDB permissions
    const lambdaRole = new iam.Role(this, 'ApiLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Grant DynamoDB read permissions to all tables
    Object.values(dynamoStack.tables).forEach((table) => {
      table.grantReadData(lambdaRole);
    });

    // Define Lambda functions for each entity
    const entities = [
      { name: 'clients', path: 'clients' },
      { name: 'licenses', path: 'licenses' },
      { name: 'leads', path: 'leads' },
      { name: 'technicians', path: 'technicians' },
      { name: 'departments', path: 'departments' },
      { name: 'vendors', path: 'vendors' },
      { name: 'contracts', path: 'contracts' },
    ];

    entities.forEach(({ name, path }) => {
      // Create Lambda function
      const fn = new lambda.Function(this, `Get${this.capitalize(name)}Function`, {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: `get-${name}.handler`,
        code: lambda.Code.fromAsset('lambda/api'),
        role: lambdaRole,
        timeout: cdk.Duration.seconds(30),
        memorySize: 256,
      });

      // Create API Gateway resource and method
      const resource = this.api.root.addResource(path);
      resource.addMethod('GET', new apigateway.LambdaIntegration(fn));

      // Output the endpoint
      new cdk.CfnOutput(this, `${this.capitalize(name)}Endpoint`, {
        value: `${this.api.url}${path}`,
        description: `API endpoint for ${name}`,
      });
    });

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'Base URL for Prism Insights API',
    });
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
