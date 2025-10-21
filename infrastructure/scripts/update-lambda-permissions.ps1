# PowerShell script to update Lambda permissions with Bedrock Agent source ARN
param(
    [Parameter(Mandatory=$true)]
    [string]$AgentId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-2",
    
    [Parameter(Mandatory=$false)]
    [string]$AccountId = "437639821856"
)

Write-Host "Updating Lambda permissions for Bedrock Agent: $AgentId" -ForegroundColor Green

# List of Lambda function names
$functions = @(
    "QueryClientDataFunction",
    "AnalyzeMarginsFunction",
    "PredictChurnFunction",
    "OptimizeContractFunction",
    "OptimizeServiceTierFunction",
    "AnalyzeSentimentFunction",
    "ExtractContractDataFunction",
    "ForecastRevenueFunction"
)

foreach ($functionName in $functions) {
    Write-Host "`nProcessing $functionName..." -ForegroundColor Yellow
    
    # Get the full function name from AWS
    $query = "Functions[?contains(FunctionName, '$functionName')].FunctionName"
    $fullFunctionName = (aws lambda list-functions --region $Region --query $query --output text)
    
    if ([string]::IsNullOrEmpty($fullFunctionName)) {
        Write-Host "  Function not found: $functionName" -ForegroundColor Red
        continue
    }
    
    Write-Host "  Found: $fullFunctionName" -ForegroundColor Cyan
    
    # Remove old permission if exists
    Write-Host "  Removing old permission..." -ForegroundColor Gray
    $removeCmd = "aws lambda remove-permission --function-name $fullFunctionName --statement-id BedrockAgentInvoke --region $Region 2>$null"
    Invoke-Expression $removeCmd
    
    # Add new permission with source ARN condition
    Write-Host "  Adding new permission with agent source ARN..." -ForegroundColor Gray
    $sourceArn = "arn:aws:bedrock:${Region}:${AccountId}:agent/${AgentId}"
    $addCmd = "aws lambda add-permission --function-name $fullFunctionName --statement-id BedrockAgentInvoke --action lambda:InvokeFunction --principal bedrock.amazonaws.com --source-arn $sourceArn --region $Region"
    Invoke-Expression $addCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Success: Permission updated" -ForegroundColor Green
    } else {
        Write-Host "  Failed: Could not update permission" -ForegroundColor Red
    }
}

Write-Host "`nAll Lambda permissions updated!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Go to your Bedrock Agent in AWS Console"
Write-Host "2. Click 'Prepare' to refresh the agent"
Write-Host "3. Test the agent with a query"
