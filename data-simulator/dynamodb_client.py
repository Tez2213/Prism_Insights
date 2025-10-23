import boto3
from typing import List, Dict, Any
from decimal import Decimal
from config import settings

class DynamoDBClient:
    def __init__(self):
        credentials = {
            'region_name': settings.aws_region,
            'aws_access_key_id': settings.aws_access_key_id,
            'aws_secret_access_key': settings.aws_secret_access_key
        }
        if settings.aws_session_token:
            credentials['aws_session_token'] = settings.aws_session_token
            
        self.client = boto3.client('dynamodb', **credentials)
        self.dynamodb = boto3.resource('dynamodb', **credentials)
        self.table_prefix = settings.dynamodb_table_prefix
    
    def get_table(self, table_name: str):
        """Get DynamoDB table resource"""
        full_table_name = f"{self.table_prefix}{table_name}"
        return self.dynamodb.Table(full_table_name)
    
    def convert_floats_to_decimal(self, obj):
        """Recursively convert floats to Decimal for DynamoDB"""
        if isinstance(obj, float):
            return Decimal(str(obj))
        elif isinstance(obj, dict):
            return {k: self.convert_floats_to_decimal(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self.convert_floats_to_decimal(item) for item in obj]
        return obj
    
    def batch_write_items(self, table_name: str, items: List[Dict[str, Any]]):
        """Write items to DynamoDB in batches"""
        table = self.get_table(table_name)
        
        # DynamoDB batch write limit is 25 items
        batch_size = 25
        for i in range(0, len(items), batch_size):
            batch = items[i:i + batch_size]
            
            with table.batch_writer() as writer:
                for item in batch:
                    # Convert floats to Decimal
                    converted_item = self.convert_floats_to_decimal(item)
                    writer.put_item(Item=converted_item)
    
    def update_item(self, table_name: str, key: Dict[str, Any], updates: Dict[str, Any]):
        """Update a single item in DynamoDB"""
        table = self.get_table(table_name)
        
        # Build update expression
        update_expr = "SET " + ", ".join([f"#{k} = :{k}" for k in updates.keys()])
        expr_attr_names = {f"#{k}": k for k in updates.keys()}
        expr_attr_values = {f":{k}": v for k, v in updates.items()}
        
        table.update_item(
            Key=key,
            UpdateExpression=update_expr,
            ExpressionAttributeNames=expr_attr_names,
            ExpressionAttributeValues=expr_attr_values
        )
    
    def scan_table(self, table_name: str) -> List[Dict[str, Any]]:
        """Scan entire table and return all items"""
        table = self.get_table(table_name)
        response = table.scan()
        items = response.get('Items', [])
        
        # Handle pagination
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response.get('Items', []))
        
        return items
    
    def clear_table(self, table_name: str):
        """Delete all items from a table"""
        table = self.get_table(table_name)
        items = self.scan_table(table_name)
        
        with table.batch_writer() as writer:
            for item in items:
                writer.delete_item(Key={'id': item['id']})

db_client = DynamoDBClient()
