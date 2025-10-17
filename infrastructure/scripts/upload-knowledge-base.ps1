# PowerShell script to upload knowledge base documents to S3

param(
    [string]$BucketName = "",
    [string]$Region = "us-east-2"
)

Write-Host "=== Prism Insights Knowledge Base Upload ===" -ForegroundColor Cyan
Write-Host ""

# Check if bucket name is provided
if ([string]::IsNullOrEmpty($BucketName)) {
    Write-Host "Error: Bucket name is required" -ForegroundColor Red
    Write-Host "Usage: .\upload-knowledge-base.ps1 -BucketName <bucket-name>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get the bucket name, run:" -ForegroundColor Yellow
    Write-Host "  aws cloudformation describe-stacks --stack-name prism-insights-bedrock-dev --query 'Stacks[0].Outputs[?OutputKey==``KnowledgeBaseBucketName``].OutputValue' --output text" -ForegroundColor Gray
    exit 1
}

Write-Host "Bucket: $BucketName" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host ""

# Check if AWS CLI is available
try {
    $awsVersion = aws --version 2>&1
    Write-Host "✓ AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    exit 1
}

# Check if bucket exists
Write-Host ""
Write-Host "Checking if bucket exists..." -ForegroundColor Cyan
try {
    aws s3 ls "s3://$BucketName" --region $Region 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Bucket exists" -ForegroundColor Green
    } else {
        Write-Host "✗ Bucket not found or access denied" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Error checking bucket: $_" -ForegroundColor Red
    exit 1
}

# Upload Client Profitability knowledge base documents
Write-Host ""
Write-Host "Uploading Client Profitability knowledge base documents..." -ForegroundColor Cyan

$kbPath = "knowledge-base/client-profitability"
$documents = @(
    "msp-pricing-guidelines.md",
    "contract-templates.md",
    "retention-strategies.md"
)

$uploadCount = 0
$errorCount = 0

foreach ($doc in $documents) {
    $filePath = Join-Path $kbPath $doc
    $s3Key = "client-profitability/$doc"
    
    if (Test-Path $filePath) {
        Write-Host "  Uploading $doc..." -ForegroundColor Gray
        try {
            aws s3 cp $filePath "s3://$BucketName/$s3Key" --region $Region --content-type "text/markdown" 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✓ $doc uploaded successfully" -ForegroundColor Green
                $uploadCount++
            } else {
                Write-Host "  ✗ Failed to upload $doc" -ForegroundColor Red
                $errorCount++
            }
        } catch {
            Write-Host "  ✗ Error uploading $doc : $_" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "  ✗ File not found: $filePath" -ForegroundColor Red
        $errorCount++
    }
}

# Summary
Write-Host ""
Write-Host "=== Upload Summary ===" -ForegroundColor Cyan
Write-Host "Successfully uploaded: $uploadCount documents" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "Failed uploads: $errorCount documents" -ForegroundColor Red
}

# List uploaded files
Write-Host ""
Write-Host "Verifying uploaded files..." -ForegroundColor Cyan
aws s3 ls "s3://$BucketName/client-profitability/" --region $Region --recursive

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Go to AWS Bedrock Console" -ForegroundColor Yellow
Write-Host "2. Navigate to Knowledge Bases" -ForegroundColor Yellow
Write-Host "3. Create a new Knowledge Base:" -ForegroundColor Yellow
Write-Host "   - Name: client-profitability-kb" -ForegroundColor Gray
Write-Host "   - Data source: S3" -ForegroundColor Gray
Write-Host "   - S3 URI: s3://$BucketName/client-profitability/" -ForegroundColor Gray
Write-Host "   - Embedding model: Amazon Titan Embeddings G1 - Text" -ForegroundColor Gray
Write-Host "4. Sync the knowledge base to index documents" -ForegroundColor Yellow
Write-Host "5. Link the knowledge base to your Bedrock Agent" -ForegroundColor Yellow
Write-Host ""
Write-Host "✓ Knowledge base upload complete!" -ForegroundColor Green
