from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import asyncio
from typing import Dict, List
from datetime import datetime
import logging
import os

from config import settings
from data_generator import generator
from dynamodb_client import db_client
from models import Client, License, Lead, Technician, Department, Vendor, Contract
from report_generator import (
    generate_client_profitability_report,
    generate_software_license_report,
    generate_sales_pipeline_report
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory data store
data_store: Dict[str, List] = {
    "clients": [],
    "licenses": [],
    "leads": [],
    "technicians": [],
    "departments": [],
    "vendors": [],
    "contracts": []
}

# Background task control
update_task = None
is_running = False

async def update_data_periodically():
    """Background task to update data periodically"""
    global data_store, is_running
    
    logger.info("Starting periodic data updates...")
    
    while is_running:
        try:
            # Update each data type
            for data_type in data_store.keys():
                data_store[data_type] = generator.update_data_realtime(
                    data_type, 
                    data_store[data_type]
                )
            
            # Sync to DynamoDB
            await sync_to_dynamodb()
            
            logger.info(f"Data updated at {datetime.now().isoformat()}")
            
        except Exception as e:
            logger.error(f"Error updating data: {e}")
        
        # Wait for next update
        await asyncio.sleep(settings.update_interval_seconds)

async def sync_to_dynamodb():
    """Sync in-memory data to DynamoDB"""
    try:
        table_mapping = {
            "clients": "clients",
            "licenses": "licenses",
            "leads": "leads",
            "technicians": "technicians",
            "departments": "departments",
            "vendors": "vendors",
            "contracts": "contracts"
        }
        
        for data_type, table_name in table_mapping.items():
            items = [item.model_dump() for item in data_store[data_type]]
            if items:
                db_client.batch_write_items(table_name, items)
        
        logger.info("Data synced to DynamoDB")
    except Exception as e:
        logger.error(f"Error syncing to DynamoDB: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global update_task, is_running, data_store
    
    # Startup
    logger.info("Initializing data simulator...")
    
    # Generate initial data
    data_store["clients"] = generator.generate_clients(20)
    data_store["licenses"] = generator.generate_licenses(30)
    data_store["leads"] = generator.generate_leads(25)
    data_store["technicians"] = generator.generate_technicians(15)
    data_store["departments"] = generator.generate_departments(6)
    data_store["vendors"] = generator.generate_vendors(15)
    data_store["contracts"] = generator.generate_contracts(20)
    
    logger.info("Initial data generated")
    
    # Sync to DynamoDB
    await sync_to_dynamodb()
    
    # Start background updates
    is_running = True
    update_task = asyncio.create_task(update_data_periodically())
    
    logger.info(f"Server started. Updates every {settings.update_interval_seconds} seconds")
    
    yield
    
    # Shutdown
    is_running = False
    if update_task:
        update_task.cancel()
        try:
            await update_task
        except asyncio.CancelledError:
            pass
    
    logger.info("Server shutdown")

# Initialize FastAPI app
app = FastAPI(
    title="MSP Data Simulator",
    description="Real-time data simulator for Prism Insights",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Endpoints

@app.get("/")
async def root():
    return {
        "message": "MSP Data Simulator API",
        "status": "running",
        "update_interval": f"{settings.update_interval_seconds}s",
        "last_update": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "data_counts": {k: len(v) for k, v in data_store.items()}
    }

@app.get("/api/clients", response_model=List[Client])
async def get_clients():
    """Get all clients"""
    return data_store["clients"]

@app.get("/api/licenses", response_model=List[License])
async def get_licenses():
    """Get all licenses"""
    return data_store["licenses"]

@app.get("/api/leads", response_model=List[Lead])
async def get_leads():
    """Get all leads"""
    return data_store["leads"]

@app.get("/api/technicians", response_model=List[Technician])
async def get_technicians():
    """Get all technicians"""
    return data_store["technicians"]

@app.get("/api/departments", response_model=List[Department])
async def get_departments():
    """Get all departments"""
    return data_store["departments"]

@app.get("/api/vendors", response_model=List[Vendor])
async def get_vendors():
    """Get all vendors"""
    return data_store["vendors"]

@app.get("/api/contracts", response_model=List[Contract])
async def get_contracts():
    """Get all contracts"""
    return data_store["contracts"]

@app.post("/api/regenerate")
async def regenerate_data():
    """Regenerate all data from scratch"""
    global data_store
    
    try:
        data_store["clients"] = generator.generate_clients(20)
        data_store["licenses"] = generator.generate_licenses(30)
        data_store["leads"] = generator.generate_leads(25)
        data_store["technicians"] = generator.generate_technicians(15)
        data_store["departments"] = generator.generate_departments(6)
        data_store["vendors"] = generator.generate_vendors(15)
        data_store["contracts"] = generator.generate_contracts(20)
        
        await sync_to_dynamodb()
        
        return {
            "message": "Data regenerated successfully",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sync")
async def manual_sync():
    """Manually trigger sync to DynamoDB"""
    try:
        await sync_to_dynamodb()
        return {
            "message": "Data synced to DynamoDB",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def get_stats():
    """Get statistics about the data"""
    return {
        "timestamp": datetime.now().isoformat(),
        "counts": {k: len(v) for k, v in data_store.items()},
        "update_interval": settings.update_interval_seconds,
        "is_running": is_running
    }

@app.post("/api/generate-report")
async def generate_report(report_data: dict):
    """Generate professional PDF report with AI insights"""
    try:
        report_type = report_data.get('pageType', 'client-profitability')
        
        # Create reports directory if it doesn't exist
        os.makedirs('reports', exist_ok=True)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f"reports/{report_type}_report_{timestamp}.pdf"
        
        # Generate report based on type
        if report_type == 'software-license':
            # Prepare data for software license report
            licenses = [license.model_dump() for license in data_store["licenses"]]
            
            # Calculate metrics
            total_licenses = len(licenses)
            total_cost = sum(l.get('monthlyCost', 0) for l in licenses)
            avg_utilization = sum(l.get('utilizationRate', 0) for l in licenses) / total_licenses if total_licenses > 0 else 0
            underutilized = len([l for l in licenses if l.get('utilizationRate', 0) < 50])
            potential_savings = sum(l.get('monthlyCost', 0) for l in licenses if l.get('utilizationRate', 0) < 50)
            
            # Prepare chart data
            top_licenses = sorted(licenses, key=lambda x: x.get('monthlyCost', 0), reverse=True)[:10]
            
            report_payload = {
                'dateRange': datetime.now().strftime('%B %Y'),
                'summary': report_data.get('summary',
                    f"Analysis of {total_licenses} software licenses reveals significant optimization opportunities. "
                    f"Current average utilization rate of {avg_utilization:.1f}% indicates {underutilized} underutilized licenses "
                    f"with potential monthly savings of ${potential_savings:,.0f}. Strategic license management and right-sizing "
                    f"initiatives can substantially reduce software spend while maintaining operational efficiency."),
                'metrics': [
                    {'label': 'Total Software Licenses', 'value': str(total_licenses), 'trend': 3.2},
                    {'label': 'Total Monthly Cost', 'value': f'${total_cost:,.0f}', 'trend': -5.5},
                    {'label': 'Average Utilization Rate', 'value': f'{avg_utilization:.1f}%', 'trend': 8.3},
                    {'label': 'Underutilized Licenses', 'value': str(underutilized), 'trend': -12.0},
                    {'label': 'Potential Monthly Savings', 'value': f'${potential_savings:,.0f}', 'trend': 0},
                    {'label': 'Compliance Score', 'value': '94%', 'trend': 2.1},
                ],
                'charts': [
                    {
                        'type': 'bar',
                        'title': 'Top 10 Licenses by Monthly Cost',
                        'data': [{'name': f"{l.get('vendor', 'Unknown')} {l.get('product', '')}"[:20], 
                                 'value': l.get('monthlyCost', 0)} for l in top_licenses]
                    },
                    {
                        'type': 'bar',
                        'title': 'License Utilization Rates',
                        'data': [{'name': f"{l.get('vendor', 'Unknown')} {l.get('product', '')}"[:20], 
                                 'value': l.get('utilizationRate', 0)} for l in top_licenses]
                    },
                    {
                        'type': 'pie',
                        'title': 'License Distribution by Vendor',
                        'data': _aggregate_by_field(licenses, 'vendor')[:6]
                    }
                ],
                'insights': report_data.get('insights', {
                    'keyFindings': [
                        f"Portfolio consists of {total_licenses} software licenses across {len(set(l.get('vendor') for l in licenses))} vendors",
                        f"Average utilization rate of {avg_utilization:.1f}% indicates room for optimization",
                        f"{underutilized} licenses identified as underutilized (< 50% usage)",
                        f"Potential monthly savings of ${potential_savings:,.0f} through license right-sizing",
                        "Significant cost variation across vendors presents negotiation opportunities"
                    ],
                    'risks': [
                        {
                            'level': 'high',
                            'description': f'{underutilized} underutilized licenses wasting ${potential_savings:,.0f} monthly in unnecessary costs',
                            'recommendation': 'Immediately audit license usage and reclaim unused seats. Implement automated usage monitoring to prevent future waste.'
                        },
                        {
                            'level': 'medium',
                            'description': 'License renewals approaching without utilization review',
                            'recommendation': 'Establish 90-day pre-renewal review process. Analyze usage trends and right-size license counts before renewal.'
                        },
                        {
                            'level': 'low',
                            'description': 'Potential compliance risks from untracked license deployments',
                            'recommendation': 'Implement centralized license management system. Conduct quarterly compliance audits to ensure proper licensing.'
                        }
                    ],
                    'recommendations': [
                        'Implement automated license usage monitoring and alerting system',
                        'Reclaim unused licenses quarterly to optimize costs',
                        'Negotiate volume discounts with top 3 vendors representing 60% of spend',
                        'Consolidate similar tools to reduce vendor count and complexity',
                        'Establish license approval workflow to prevent unnecessary purchases',
                        'Create license optimization playbook with clear reclamation procedures',
                        'Implement chargeback model to increase departmental accountability',
                        'Evaluate alternative vendors for underperforming or overpriced licenses'
                    ],
                    'nextActions': [
                        'Audit all licenses with utilization below 50% within next 7 days',
                        'Contact vendors to reclaim unused seats and adjust license counts',
                        'Schedule vendor negotiation meetings for top 3 software providers',
                        'Implement automated usage tracking for all critical applications',
                        'Create license optimization dashboard for ongoing monitoring',
                        'Develop license request and approval workflow',
                        'Conduct user training on license compliance and best practices',
                        'Establish quarterly license review meetings with department heads'
                    ]
                })
            }
            
            generate_software_license_report(report_payload, output_file)
            
        elif report_type == 'sales-pipeline':
            # Prepare data for sales pipeline report
            leads = [lead.model_dump() for lead in data_store["leads"]]
            
            # Calculate metrics
            total_leads = len(leads)
            total_value = sum(l.get('estimatedValue', 0) for l in leads)
            avg_deal_size = total_value / total_leads if total_leads > 0 else 0
            closed_won = len([l for l in leads if l.get('stage') == 'Closed Won'])
            conversion_rate = (closed_won / total_leads * 100) if total_leads > 0 else 0
            
            # Stage distribution
            stage_counts = {}
            for lead in leads:
                stage = lead.get('stage', 'Unknown')
                stage_counts[stage] = stage_counts.get(stage, 0) + 1
            
            report_payload = {
                'dateRange': datetime.now().strftime('%B %Y'),
                'summary': report_data.get('summary',
                    f"Analysis of {total_leads} leads in the sales pipeline reveals a total potential value of ${total_value:,.0f}. "
                    f"Current conversion rate of {conversion_rate:.1f}% with average deal size of ${avg_deal_size:,.0f} indicates "
                    f"strong pipeline health. Strategic focus on qualification and proposal stages can accelerate deal velocity "
                    f"and improve overall conversion rates."),
                'metrics': [
                    {'label': 'Total Pipeline Value', 'value': f'${total_value:,.0f}', 'trend': 15.3},
                    {'label': 'Total Active Leads', 'value': str(total_leads), 'trend': 8.7},
                    {'label': 'Average Deal Size', 'value': f'${avg_deal_size:,.0f}', 'trend': 5.2},
                    {'label': 'Conversion Rate', 'value': f'{conversion_rate:.1f}%', 'trend': 3.8},
                    {'label': 'Closed Won', 'value': str(closed_won), 'trend': 12.5},
                    {'label': 'Win Rate', 'value': f'{conversion_rate:.1f}%', 'trend': 4.2},
                ],
                'charts': [
                    {
                        'type': 'bar',
                        'title': 'Pipeline Distribution by Stage',
                        'data': [{'name': k, 'value': v} for k, v in sorted(stage_counts.items(), key=lambda x: x[1], reverse=True)]
                    },
                    {
                        'type': 'bar',
                        'title': 'Top 10 Opportunities by Value',
                        'data': [{'name': l.get('companyName', 'Unknown')[:20], 
                                 'value': l.get('estimatedValue', 0)} 
                                for l in sorted(leads, key=lambda x: x.get('estimatedValue', 0), reverse=True)[:10]]
                    },
                    {
                        'type': 'pie',
                        'title': 'Lead Distribution by Source',
                        'data': _aggregate_by_field(leads, 'source')[:6]
                    }
                ],
                'insights': report_data.get('insights', {
                    'keyFindings': [
                        f"Pipeline contains {total_leads} active opportunities worth ${total_value:,.0f}",
                        f"Current conversion rate of {conversion_rate:.1f}% aligns with industry benchmarks",
                        f"Average deal size of ${avg_deal_size:,.0f} indicates healthy opportunity quality",
                        f"{closed_won} deals closed won this period, representing strong sales execution",
                        "Lead source analysis reveals opportunities for channel optimization"
                    ],
                    'risks': [
                        {
                            'level': 'medium',
                            'description': 'Leads stalling in qualification and proposal stages',
                            'recommendation': 'Implement lead scoring system and automated nurture campaigns. Provide sales team with objection handling training.'
                        },
                        {
                            'level': 'medium',
                            'description': 'Extended sales cycles impacting revenue predictability',
                            'recommendation': 'Analyze deal velocity by stage. Identify and remove bottlenecks in sales process. Consider sales enablement tools.'
                        },
                        {
                            'level': 'low',
                            'description': 'Seasonal pipeline fluctuations affecting forecasting accuracy',
                            'recommendation': 'Develop seasonal pipeline models. Adjust resource allocation and marketing spend based on historical patterns.'
                        }
                    ],
                    'recommendations': [
                        'Implement AI-powered lead scoring to prioritize high-probability opportunities',
                        'Develop stage-specific sales playbooks to accelerate deal progression',
                        'Establish automated follow-up sequences for each pipeline stage',
                        'Create competitive battle cards to improve win rates',
                        'Implement sales enablement platform for content management',
                        'Develop ROI calculator tools to strengthen value propositions',
                        'Establish weekly pipeline review cadence with sales leadership',
                        'Invest in sales training focused on consultative selling techniques'
                    ],
                    'nextActions': [
                        'Review all opportunities stalled over 30 days in qualification stage',
                        'Schedule proposal review sessions for deals in negotiation',
                        'Implement lead scoring system within next 14 days',
                        'Create sales playbook for top 3 use cases',
                        'Develop automated email sequences for each pipeline stage',
                        'Conduct win/loss analysis on last 20 closed opportunities',
                        'Schedule sales training on objection handling techniques',
                        'Establish monthly pipeline health review with executive team'
                    ]
                })
            }
            
            generate_sales_pipeline_report(report_payload, output_file)
            
        elif report_type == 'client-profitability':
            # Prepare data for report
            clients = [client.model_dump() for client in data_store["clients"]]
            
            # Calculate metrics
            total_revenue = sum(c.get('monthlyRecurring', 0) for c in clients)
            total_costs = sum(c.get('annualCosts', 0) / 12 for c in clients)
            avg_margin = ((total_revenue - total_costs) / total_revenue * 100) if total_revenue > 0 else 0
            at_risk = len([c for c in clients if c.get('status') == 'At Risk'])
            
            # Prepare chart data
            top_clients = sorted(clients, key=lambda x: x.get('monthlyRecurring', 0), reverse=True)[:10]
            
            report_payload = {
                'dateRange': datetime.now().strftime('%B %Y'),
                'summary': report_data.get('summary', 
                    f"Comprehensive analysis of {len(clients)} active clients reveals strong overall performance "
                    f"with an average profit margin of {avg_margin:.1f}%. Strategic opportunities identified for "
                    f"margin optimization and risk mitigation across the client portfolio."),
                'metrics': [
                    {'label': 'Total Monthly Recurring Revenue', 'value': f'${total_revenue:,.0f}', 'trend': 8.5},
                    {'label': 'Average Profit Margin', 'value': f'{avg_margin:.1f}%', 'trend': 2.3},
                    {'label': 'Active Clients', 'value': str(len(clients)), 'trend': 5.0},
                    {'label': 'At-Risk Clients', 'value': str(at_risk), 'trend': -15.0},
                    {'label': 'Total Monthly Costs', 'value': f'${total_costs:,.0f}', 'trend': 3.2},
                    {'label': 'Net Monthly Profit', 'value': f'${(total_revenue - total_costs):,.0f}', 'trend': 12.5},
                ],
                'charts': [
                    {
                        'type': 'bar',
                        'title': 'Top 10 Clients by Monthly Recurring Revenue',
                        'data': [{'name': c.get('name', 'Unknown'), 'value': c.get('monthlyRecurring', 0)} 
                                for c in top_clients]
                    },
                    {
                        'type': 'pie',
                        'title': 'Client Distribution by Industry',
                        'data': _aggregate_by_field(clients, 'industry')
                    },
                    {
                        'type': 'bar',
                        'title': 'Client Profitability Analysis',
                        'data': [{'name': c.get('name', 'Unknown')[:15], 
                                 'value': (c.get('annualRevenue', 0) - c.get('annualCosts', 0)) / 12} 
                                for c in top_clients]
                    }
                ],
                'insights': report_data.get('insights', {
                    'keyFindings': [
                        f"Portfolio consists of {len(clients)} active clients across {len(set(c.get('industry') for c in clients))} industries",
                        f"Top 20% of clients generate approximately {_calculate_top_20_percent(clients):.1f}% of total revenue",
                        f"Average profit margin of {avg_margin:.1f}% indicates healthy business performance",
                        f"{at_risk} clients identified as at-risk, requiring immediate attention and intervention",
                        "Significant variation in profitability across client segments presents optimization opportunities"
                    ],
                    'risks': [
                        {
                            'level': 'high',
                            'description': f'{at_risk} clients showing declining margins or at-risk status requiring immediate intervention',
                            'recommendation': 'Conduct comprehensive profitability reviews with at-risk clients within 7 days. Analyze service delivery costs, adjust pricing structures, and implement performance improvement plans.'
                        },
                        {
                            'level': 'medium',
                            'description': 'Contract renewal dates approaching for key accounts within next 90 days',
                            'recommendation': 'Initiate proactive renewal discussions 90 days in advance. Prepare value demonstration materials and competitive analysis to support pricing negotiations.'
                        },
                        {
                            'level': 'low',
                            'description': 'Market conditions and competitive pressures may impact client retention rates',
                            'recommendation': 'Implement quarterly business reviews with top 20% clients. Strengthen relationships through strategic account management and value-added services.'
                        }
                    ],
                    'recommendations': [
                        'Implement tiered service delivery model to optimize resource allocation and improve margins across all client segments',
                        'Develop targeted upsell and cross-sell strategies for high-margin accounts with expansion potential',
                        'Establish automated profitability monitoring dashboard with real-time alerts for margin degradation',
                        'Create standardized service packages with clear pricing tiers to improve predictability and scalability',
                        'Invest in client success programs to reduce churn risk and increase lifetime value',
                        'Conduct comprehensive cost analysis to identify efficiency opportunities in service delivery',
                        'Implement value-based pricing strategies for premium services and specialized expertise',
                        'Develop client segmentation framework to prioritize resources on highest-value relationships'
                    ],
                    'nextActions': [
                        'Schedule profitability review meetings with all at-risk clients within next 7 days',
                        'Analyze service delivery costs and resource allocation for bottom 20% of clients by profitability',
                        'Prepare pricing adjustment proposals for clients with margins below 20% threshold',
                        'Develop client retention playbook with specific interventions for different risk levels',
                        'Create executive dashboard for real-time profitability monitoring and trend analysis',
                        'Initiate contract renewal discussions for clients with agreements expiring within 90 days',
                        'Conduct competitive analysis to ensure pricing remains market-competitive while maintaining margins',
                        'Implement quarterly business reviews with top 10 clients to strengthen strategic partnerships'
                    ]
                })
            }
            
            generate_client_profitability_report(report_payload, output_file)
        
        # Return file for download
        return FileResponse(
            path=output_file,
            media_type='application/pdf',
            filename=os.path.basename(output_file)
        )
        
    except Exception as e:
        logger.error(f"Error generating report: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

def _aggregate_by_field(items: List[dict], field: str) -> List[dict]:
    """Aggregate items by a specific field"""
    aggregated = {}
    for item in items:
        value = item.get(field, 'Unknown')
        aggregated[value] = aggregated.get(value, 0) + 1
    
    return [{'name': k, 'value': v} for k, v in sorted(aggregated.items(), key=lambda x: x[1], reverse=True)]

def _calculate_top_20_percent(clients: List[dict]) -> float:
    """Calculate revenue percentage from top 20% clients"""
    if not clients:
        return 0
    
    sorted_clients = sorted(clients, key=lambda x: x.get('monthlyRecurring', 0), reverse=True)
    top_20_count = max(1, len(sorted_clients) // 5)
    top_20_revenue = sum(c.get('monthlyRecurring', 0) for c in sorted_clients[:top_20_count])
    total_revenue = sum(c.get('monthlyRecurring', 0) for c in sorted_clients)
    
    return (top_20_revenue / total_revenue * 100) if total_revenue > 0 else 0

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=True
    )
