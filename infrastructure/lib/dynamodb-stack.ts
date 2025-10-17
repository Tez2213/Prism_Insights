import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DynamoDBStack extends cdk.Stack {
  public readonly tables: { [key: string]: dynamodb.Table } = {};

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create tables for each entity type
    const tableNames = [
      'clients',
      'licenses',
      'leads',
      'technicians',
      'departments',
      'vendors',
      'contracts',
    ];

    tableNames.forEach((tableName) => {
      const table = new dynamodb.Table(this, `${tableName}Table`, {
        tableName: `prism-${tableName}`,
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // No capacity planning needed
        removalPolicy: cdk.RemovalPolicy.DESTROY, // For prototype - delete when stack is deleted
        pointInTimeRecovery: false, // Save costs for prototype
      });

      this.tables[tableName] = table;

      // Output table names
      new cdk.CfnOutput(this, `${tableName}TableName`, {
        value: table.tableName,
        description: `DynamoDB table name for ${tableName}`,
      });
    });

    // Create a metrics table for real-time dashboard updates
    const metricsTable = new dynamodb.Table(this, 'MetricsTable', {
      tableName: 'prism-metrics',
      partitionKey: { name: 'metricType', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: 'ttl', // Auto-delete old metrics
    });

    this.tables['metrics'] = metricsTable;

    new cdk.CfnOutput(this, 'MetricsTableName', {
      value: metricsTable.tableName,
      description: 'DynamoDB table for real-time metrics',
    });
  }
}
