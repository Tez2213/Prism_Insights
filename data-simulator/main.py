from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
from typing import Dict, List
from datetime import datetime
import logging

from config import settings
from data_generator import generator
from dynamodb_client import db_client
from models import Client, License, Lead, Technician, Department, Vendor, Contract

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
    # Disabled for local testing - enable when deploying to AWS
    return
    
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=True
    )
