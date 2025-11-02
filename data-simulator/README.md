# Prism Insights - Data Simulator Backend

FastAPI-based backend service that generates realistic MSP business data in real-time and provides API endpoints for the frontend application.

## Overview

The data simulator creates and maintains realistic business data for:
- Client profitability metrics
- Software license inventory and usage
- Sales pipeline opportunities
- Technician resource allocation
- Departmental spending
- Vendor relationships and contracts

Data updates automatically every 30 seconds to simulate real-time business operations.

## Features

### Real-Time Data Generation
- Generates realistic MSP business data using Faker library
- Updates data every 30 seconds with realistic changes
- Maintains data consistency and relationships
- Simulates business trends and patterns

### DynamoDB Integration
- Syncs generated data to AWS DynamoDB tables
- Batch write operations for efficiency
- Automatic retry logic for failed writes
- Supports both local development and AWS deployment

### Professional PDF Reports
- Generates AI-powered PDF reports with insights
- Includes executive summaries and recommendations
- Charts and visualizations using Matplotlib
- Risk assessments and action items
- Professional formatting with ReportLab

### RESTful API
- FastAPI framework for high performance
- Automatic API documentation with Swagger
- CORS enabled for frontend integration
- Health check and statistics endpoints

## Technology Stack

- **Framework:** FastAPI
- **Language:** Python 3.9+
- **Data Models:** Pydantic
- **Server:** Uvicorn
- **Data Generation:** Faker
- **PDF Generation:** ReportLab
- **Charts:** Matplotlib
- **AWS SDK:** Boto3
- **Database:** DynamoDB (optional)

## Installation

### Prerequisites
- Python 3.9 or higher
- pip package manager
- Virtual environment (recommended)
- AWS credentials (for DynamoDB integration)

### Setup

1. Navigate to data-simulator directory:
```bash
cd data-simulator
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment (optional):
Create `.env` file:
```env
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DYNAMODB_TABLE_PREFIX=prism-
UPDATE_INTERVAL_SECONDS=30
PORT=8000
```

6. Start the server:
```bash
python main.py
```

Server runs on: http://localhost:8000

## API Endpoints

### Health & Status

**GET /** - Root endpoint
```json
{
  "message": "MSP Data Simulator API",
  "status": "running",
  "update_interval": "30s",
  "last_update": "2025-01-15T10:30:00"
}
```

**GET /health** - Health check
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00",
  "data_counts": {
    "clients": 20,
    "licenses": 30,
    "leads": 25,
    "technicians": 15,
    "departments": 6,
    "vendors": 15,
    "contracts": 20
  }
}
```

**GET /api/stats** - Statistics
```json
{
  "timestamp": "2025-01-15T10:30:00",
  "counts": {
    "clients": 20,
    "licenses": 30,
    "leads": 25
  },
  "update_interval": 30,
  "is_running": true
}
```

### Data Endpoints

**GET /api/clients** - Get all clients
Returns array of client objects with profitability metrics.

**GET /api/licenses** - Get all licenses
Returns array of software license objects with usage data.

**GET /api/leads** - Get all sales leads
Returns array of sales pipeline opportunities.

**GET /api/technicians** - Get all technicians
Returns array of technician resources with utilization.

**GET /api/departments** - Get all departments
Returns array of departments with spending data.

**GET /api/vendors** - Get all vendors
Returns array of vendor relationships.

**GET /api/contracts** - Get all contracts
Returns array of contract details.

### Management Endpoints

**POST /api/regenerate** - Regenerate all data
Generates fresh data for all entities.

**POST /api/sync** - Manual DynamoDB sync
Triggers immediate sync to DynamoDB.

**POST /api/generate-report** - Generate PDF report
Generates professional PDF report with AI insights.

Request body:
```json
{
  "pageType": "client-profitability",
  "summary": "Custom summary text",
  "insights": {
    "keyFindings": ["Finding 1", "Finding 2"],
    "recommendations": ["Rec 1", "Rec 2"]
  }
}
```

## Data Models

### Client
```python
{
  "id": "client-1",
  "name": "TechFlow Solutions",
  "industry": "Technology",
  "employeeCount": 150,
  "annualRevenue": 180000.00,
  "annualCosts": 104400.00,
  "contractValue": 180000.00,
  "contractType": "Premium",
  "status": "Active",
  "monthlyRecurring": 15000.00,
  "churnRisk": "Low",
  "lastUpdated": "2025-01-15T10:30:00"
}
```

### License
```python
{
  "id": "license-1",
  "vendor": "Microsoft",
  "product": "Office 365",
  "licenseType": "User",
  "totalLicenses": 150,
  "usedLicenses": 105,
  "availableLicenses": 45,
  "costPerLicense": 22.00,
  "totalCost": 3300.00,
  "renewalDate": "2025-06-15",
  "complianceStatus": "Compliant",
  "utilizationRate": 70.00,
  "lastUpdated": "2025-01-15T10:30:00"
}
```

### Lead
```python
{
  "id": "lead-1",
  "companyName": "Acme Corp",
  "contactName": "John Smith",
  "email": "john@acme.com",
  "phone": "+1-555-0123",
  "stage": "Proposal",
  "value": 145000.00,
  "probability": 75,
  "expectedCloseDate": "2025-02-28",
  "source": "Referral",
  "industry": "Technology",
  "employeeCount": 200,
  "lastContact": "2025-01-10",
  "lastUpdated": "2025-01-15T10:30:00"
}
```

## Configuration

### Environment Variables

**AWS_REGION** (default: us-east-2)
AWS region for DynamoDB

**AWS_ACCESS_KEY_ID**
AWS access key for authentication

**AWS_SECRET_ACCESS_KEY**
AWS secret key for authentication

**DYNAMODB_TABLE_PREFIX** (default: prism-)
Prefix for DynamoDB table names

**UPDATE_INTERVAL_SECONDS** (default: 30)
Interval for automatic data updates

**PORT** (default: 8000)
Server port number

### Data Generation Settings

Modify `data_generator.py` to customize:
- Number of entities generated
- Data ranges and distributions
- Update frequency and patterns
- Industry-specific values

## Development

### Project Structure
```
data-simulator/
├── main.py                 # FastAPI application
├── config.py              # Configuration settings
├── models.py              # Pydantic data models
├── data_generator.py      # Data generation logic
├── report_generator.py    # PDF report generation
├── dynamodb_client.py     # DynamoDB integration
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
└── reports/               # Generated PDF reports
```

### Adding New Data Types

1. Define Pydantic model in `models.py`
2. Add generation logic in `data_generator.py`
3. Create API endpoint in `main.py`
4. Add DynamoDB sync in `dynamodb_client.py`
5. Update data store initialization

### Testing

Test API endpoints:
```bash
# Health check
curl http://localhost:8000/health

# Get clients
curl http://localhost:8000/api/clients

# Get statistics
curl http://localhost:8000/api/stats

# Regenerate data
curl -X POST http://localhost:8000/api/regenerate
```

Access interactive API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

### Local Development
```bash
python main.py
```

### Production Deployment

**AWS EC2:**
```bash
# Install dependencies
pip install -r requirements.txt

# Run with Uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Docker:**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**AWS App Runner:**
Deploy directly from GitHub with automatic builds.

**AWS Lambda:**
Use Mangum adapter for serverless deployment.

## Performance

### Metrics
- Startup time: < 2 seconds
- API response time: < 100ms
- Data generation: < 1 second for all entities
- PDF generation: 2-3 seconds
- Memory usage: ~100MB

### Optimization
- Batch DynamoDB writes for efficiency
- Async operations with FastAPI
- Caching for frequently accessed data
- Connection pooling for database

## Troubleshooting

### Server won't start
- Check Python version (3.9+)
- Verify virtual environment is activated
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is available

### DynamoDB errors
- Verify AWS credentials are configured
- Check IAM permissions for DynamoDB
- Ensure tables exist in correct region
- Verify table names match configuration

### Data not updating
- Check UPDATE_INTERVAL_SECONDS setting
- Verify background task is running
- Check server logs for errors
- Restart server if needed

### PDF generation fails
- Ensure ReportLab is installed
- Check reports/ directory exists
- Verify write permissions
- Check Matplotlib backend configuration

## API Documentation

Full interactive API documentation available at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## License

This project is part of Prism Insights and is private and proprietary.

## Support

For issues or questions, contact the development team.
