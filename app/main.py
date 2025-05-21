# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

# Import routers
from app.api import cars, auth, users, filters

# Import database initialization
from app.database.sqlite import create_tables
from app.database.mysql import optimize_database
from app.utils import email

# Configure simple logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create app
app = FastAPI(
    title="EUCar API",
    description="API for European Car Insights",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cars.router, prefix="/api/cars", tags=["cars"])
app.include_router(filters.router, prefix="/api/filters", tags=["filters"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])


@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("Starting EUCar API application")
    
    # Create SQLite tables for user data
    create_tables()
    
    # Create database indexes for better performance
    try:
        await optimize_database()
        logger.info("Database optimization completed")
    except Exception as e:
        logger.warning(f"Database optimization failed: {str(e)}")
        logger.info("Application will continue with unoptimized database")

@app.get("/")
async def root():
    return {"message": "Welcome to EUCar API"}

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)