# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import asyncio
from app.database.mysql import execute_query, optimize_database
from app.database.sqlite import get_db, create_tables, is_cars_table_empty
from app.database.migrations import apply_migrations
from app.models.car import Car
from sqlalchemy.orm import Session

# Import routers
from app.api import cars, auth, users, filters, purchase

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
app.include_router(purchase.router, prefix="/api/purchase", tags=["purchase"])

async def sync_mysql_to_sqlite(db: Session):
    """Fetch 50,000 cars from MySQL and store in SQLite if cars table is empty"""
    if not is_cars_table_empty():
        logger.info("SQLite cars table already populated, skipping sync")
        return

    logger.info("Fetching 50,000 cars from MySQL")
    query = """
    SELECT id, brand, model, version, price, mileage, age, power, gear, fuel, 
           country, zipcode, images, url, attrs, FLOOR(age) as year
    FROM cars
    WHERE price IS NOT NULL AND brand IS NOT NULL AND model IS NOT NULL
    LIMIT 50000
    """
    cars = await execute_query(query, fetch=True, remove_outliers=False)

    if not cars:
        logger.warning("No cars fetched from MySQL")
        return

    logger.info(f"Inserting {len(cars)} cars into SQLite")
    batch_size = 1000
    for i in range(0, len(cars), batch_size):
        batch = cars[i:i + batch_size]
        db_cars = [
            Car(
                id=car["id"],
                brand=car["brand"],
                model=car["model"],
                version=car["version"],
                price=car["price"],
                mileage=car["mileage"],
                age=car["age"],
                power=car["power"],
                gear=car["gear"],
                fuel=car["fuel"],
                country=car["country"],
                zipcode=car["zipcode"],
                images=car["images"],
                url=car["url"],
                attrs=car["attrs"],
                year=car["year"]
            ) for car in batch
        ]
        db.bulk_save_objects(db_cars)
        db.commit()
        logger.info(f"Inserted {i + len(batch)}/{len(cars)} cars")
    logger.info("MySQL to SQLite sync completed")

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("Starting EUCar API application")

    # Apply database migrations
    apply_migrations()
    
    # Create SQLite tables for user data and cars
    create_tables()
    
    # Sync MySQL cars to SQLite
    db_gen = get_db()
    db = next(db_gen)
    try:
        await sync_mysql_to_sqlite(db)
    finally:
        db.close()
    
    # Create database indexes for MySQL (for any remaining MySQL queries)
    try:
        await optimize_database()
        logger.info("MySQL database optimization completed")
    except Exception as e:
        logger.warning(f"MySQL database optimization failed: {str(e)}")
        logger.info("Application will continue with unoptimized MySQL database")

@app.get("/")
async def root():
    return {"message": "Welcome to EUCar API"}

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)