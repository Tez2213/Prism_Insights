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
    exit 1
}

Write-Host "Bucket: $BucketName" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host ""

# Check if bucket exists
Write-Host "Checking if bucket exists..." -ForegroundColor Cyan
aws s3 ls "s3://$BucketName" --region $Region 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Bucket not found or access denied" -ForegroundColor Red
    exit 1
}
Write-Host "OK - Bucket exists" -ForegroundColor Green
Write-Host ""

$uploadCount = 0
$errorCount = 0

# Upload Client Profitability documents
Write-Host "Uploading Client Profitability documents..." -ForegroundColor Cyan

$clientDocs = @(
    "knowledge-base/client-profitability/msp-pricing-guidelines.md",
    "knowledge-base/client-profitability/contract-templates.md",
    "knowledge-base/client-profitability/retention-strategies.md"
)

foreach ($doc in $clientDocs) {
    $fileName = Split-Path $doc -Leaf
    $s3Key = "client-profitability/$fileName"
    
    if (Test-Path $doc) {
        Write-Host "  Uploading $fileName..." -ForegroundColor Gray
        aws s3 cp $doc "s3://$BucketName/$s3Key" --region $Region --content-type "text/markdown" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK - $fileName uploaded" -ForegroundColor Green
            $uploadCount++
        } else {
            Write-Host "  FAILED - $fileName" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "  MISSING - $doc" -ForegroundColor Red
        $errorCount++
    }
}

# Upload Software License documents
Write-Host ""
Write-Host "Uploading Software License documents..." -ForegroundColor Cyan

$licenseDocs = @(
    "knowledge-base/software-license/vendor-pricing-data.md",
    "knowledge-base/software-license/compliance-regulations.md",
    "knowledge-base/software-license/negotiation-strategies.md"
)

foreach ($doc in $licenseDocs) {
    $fileName = Split-Path $doc -Leaf
    $s3Key = "software-license/$fileName"
    
    if (Test-Path $doc) {
        Write-Host "  Uploading $fileName..." -ForegroundColor Gray
        aws s3 cp $doc "s3://$BucketName/$s3Key" --region $Region --content-type "text/markdown" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK - $fileName uploaded" -ForegroundColor Green
            $uploadCount++
        } else {
            Write-Host "  FAILED - $fileName" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "  MISSING - $doc" -ForegroundColor Red
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
Write-Host ""
Write-Host "Client Profitability documents:" -ForegroundColor Yellow
aws s3 ls "s3://$BucketName/client-profitability/" --region $Region --recursive
Write-Host ""
Write-Host "Software License documents:" -ForegroundColor Yellow
aws s3 ls "s3://$BucketName/software-license/" --region $Region --recursive

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Go to AWS Bedrock Console to create agents!" -ForegroundColor Yellow
Write-Host "URL: https://console.aws.amazon.com/bedrock/" -ForegroundColor Gray
Write-Host ""
