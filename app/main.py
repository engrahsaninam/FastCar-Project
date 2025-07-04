# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import asyncio
import stripe
from app.config import STRIPE_SECRET_KEY
from app.database.mysql import execute_query, optimize_database
from app.database.sqlite import get_db, create_tables, is_cars_table_empty
from app.database.migrations import apply_migrations
from app.scripts.populate_car_data import populate_dummy_data
from app.models.car import Car
from app.models.charges import AdditionalCharges
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.utils.car_availability_checker import check_and_update_car_availability

# Import routers
from app.api import cars, auth, users, filters, purchase, charges, admin_availability

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Initialize Stripe
stripe.api_key = STRIPE_SECRET_KEY
if not stripe.api_key:
    logger.error("STRIPE_SECRET_KEY not set")
    raise RuntimeError("STRIPE_SECRET_KEY not set")

app = FastAPI(
    title="EUCar API",
    description="API for European Car Insights",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cars.router, prefix="/api/cars", tags=["cars"])
app.include_router(filters.router, prefix="/api/filters", tags=["filters"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(purchase.router, prefix="/api/purchase", tags=["purchase"])
app.include_router(charges.router, prefix="/api/charges", tags=["charges"])
app.include_router(admin_availability.router, prefix="/api/admin/availability", tags=["admin-availability"])

def update_total_prices(db: Session):
    """Update total_price for all cars based on current charges."""
    charges = db.query(AdditionalCharges).first()
    if not charges:
        logger.error("No charges found, creating default values")
        charges = AdditionalCharges(
            vat=22.0,
            services_total=1111.0,
            car_inspection=119.0,
            delivery=0.0,
            registration_tax=293.0,
            pre_delivery_prep=699.0,
            fuel=0.0,
            extended_warranty=0.0
        )
        db.add(charges)
        db.commit()
        db.refresh(charges)

    cars = db.query(Car).all()
    for car in cars:
        vat_amount = car.price * charges.vat / 100
        car.price_without_vat = car.price / (1 + charges.vat / 100)
        car.total_price = (
            car.price +
            vat_amount +
            charges.services_total +
            charges.car_inspection +
            charges.delivery +
            charges.registration_tax +
            charges.pre_delivery_prep +
            charges.fuel +
            charges.extended_warranty
        )
    db.commit()
    logger.info(f"Updated total_price and price_without_vat for {len(cars)} cars")

async def sync_mysql_to_sqlite(db: Session):
    """Fetch 300,000 cars from MySQL and store in SQLite if cars table is empty."""
    if not is_cars_table_empty():
        logger.info("SQLite cars table already populated, skipping sync")
        return

    logger.info("Fetching 300,000 cars from MySQL")
    query = """
    SELECT id, brand, model, version, price, mileage, age, power, gear, fuel, 
           country, zipcode, images, url, attrs, FLOOR(age) as year
    FROM cars
    WHERE price IS NOT NULL AND brand IS NOT NULL AND model IS NOT NULL
    LIMIT 300000
    """
    cars = await execute_query(query, fetch=True, remove_outliers=False)
    cars = cars[:100000]
    if not cars:
        logger.warning("No cars fetched from MySQL")
        return

    # Get VAT rate for price_without_vat calculation
    charges = db.query(AdditionalCharges).first()
    vat_rate = charges.vat if charges else 22.0  # Default to 22% if no charges

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
                year=car["year"],
                price_without_vat=car["price"] / (1 + vat_rate / 100),
                status="available"
            ) for car in batch
        ]
        db.bulk_save_objects(db_cars)
        db.commit()
        logger.info(f"Inserted {i + len(batch)}/{len(cars)} cars")
    logger.info("MySQL to SQLite sync completed")

async def refresh_materialized_views():
    while True:
        db_gen = get_db()
        db = next(db_gen)
        try:
            with db.begin():
                db.execute(text("""
                    DELETE FROM avg_prices;
                    INSERT INTO avg_prices (brand, model, avg_price, group_count, last_updated)
                    SELECT brand, model, AVG(price), COUNT(*), DATETIME('now')
                    FROM cars
                    WHERE price IS NOT NULL AND brand IS NOT NULL AND model IS NOT NULL AND status = 'available'
                    GROUP BY brand, model
                """))
                db.execute(text("""
                    DELETE FROM car_filters;
                    INSERT INTO car_filters (fuel, gear, country, body_type, colour)
                    SELECT DISTINCT fuel, gear, country, body_type, colour
                    FROM cars
                    WHERE (fuel IS NOT NULL OR gear IS NOT NULL OR country IS NOT NULL
                        OR body_type IS NOT NULL OR colour IS NOT NULL) AND status = 'available'
                """))
                db.execute(text("""
                    DELETE FROM car_features;
                    INSERT INTO car_features (car_id, feature)
                    SELECT cars.id, json_each.value
                    FROM cars
                    CROSS JOIN json_each(cars.features)
                    WHERE json_each.value IS NOT NULL AND cars.status = 'available'
                """))
                db.commit()
                logger.info("Refreshed materialized views")
        except Exception as e:
            logger.error(f"Failed to refresh materialized views: {str(e)}")
        finally:
            db.close()
        await asyncio.sleep(86400)

async def check_car_availability_periodically():
    """
    Background task to periodically check car availability.
    Runs every 6 hours and checks a subset of cars each time.
    """
    logger.info("🔄 [SCHEDULER] Car availability checker scheduled - waiting 30 minutes before first run")
    
    while True:
        try:
            # Wait 30 minutes before starting the first check (let the app fully initialize)
            if not hasattr(check_car_availability_periodically, '_first_run'):
                logger.info("⏰ [SCHEDULER] Waiting 30 minutes for app initialization...")
                await asyncio.sleep(1800)
                check_car_availability_periodically._first_run = True
                logger.info("✅ [SCHEDULER] App initialization complete - starting first availability check")
            else:
                # Wait 6 hours between checks
                logger.info("⏰ [SCHEDULER] Waiting 6 hours until next availability check...")
                await asyncio.sleep(21600)  # 6 hours
                logger.info("🔔 [SCHEDULER] 6 hours elapsed - starting next availability check")
            
            logger.info("🚀 [SCHEDULER] Triggering periodic car availability check")
            
            # Check availability for up to 5000 cars per run
            await check_and_update_car_availability(
                batch_size=500,  # Smaller batches for better performance
                max_cars_per_run=5000  # Limit to avoid overloading
            )
            
            logger.info("🎉 [SCHEDULER] Periodic car availability check completed successfully")
            
        except Exception as e:
            logger.error(f"💥 [SCHEDULER] Periodic car availability check failed: {e}")
            logger.info("⏰ [SCHEDULER] Will retry in 6 hours")

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("Starting EUCar API application")

    # Create SQLite tables for user data and cars
    create_tables()              

    # Apply database migrations
    apply_migrations()
    
    # Populate dummy data for new car columns
    # populate_dummy_data()
    
    # Sync MySQL cars to SQLite
    db_gen = get_db()
    db = next(db_gen)
    try:
        await sync_mysql_to_sqlite(db)
        update_total_prices(db)
    finally:
        db.close()
    
    # Create database indexes for MySQL
    try:
        await optimize_database()
        logger.info("MySQL database optimization completed")
    except Exception as e:
        logger.warning(f"MySQL database optimization failed: {str(e)}")
        logger.info("Application will continue with unoptimized MySQL database")

    # Start background task for materialized views
    asyncio.create_task(refresh_materialized_views())
    
    # Start background task for car availability checking
    asyncio.create_task(check_car_availability_periodically())
    logger.info("🚀 [STARTUP] Car availability checker background task started")

@app.get("/")
async def root():
    return {"message": "Welcome to EUCar API"}

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)