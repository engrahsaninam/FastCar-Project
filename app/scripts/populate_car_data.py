#app/scripts/populate_car_data.py
import random
import json
import logging
from sqlalchemy.sql import text
from app.database.sqlite import engine

logger = logging.getLogger(__name__)

# Define possible values
BODY_TYPES = ["Compact", "Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Van"]
COLOURS = ["Grey", "Black", "White", "Silver", "Blue", "Red", "Green"]
COMFORT_FEATURES = [
    "Air conditioning", "Armrest", "Automatic climate control", "Cruise control",
    "Electrical side mirrors", "Leather steering wheel", "Light sensor",
    "Lumbar support", "Power windows", "Rain sensor"
]
SAFETY_FEATURES = [
    "ABS", "Alarm system", "Central door lock", "Central door lock with remote control",
    "Driver-side airbag", "Head airbag", "Immobilizer", "Isofix",
    "Passenger-side airbag", "Power steering", "Rear airbag", "Side airbag"
]
EXTRAS = [
    "Alloy wheels (15\")", "Automatically dimming interior mirror", "Trailer hitch"
]

def generate_batch_dummy_data(batch_size):
    """Generate dummy data for a batch of cars efficiently."""
    batch_data = []
    for _ in range(batch_size):
        co2 = f"{random.randint(100, 250)} g"
        engine = f"{random.randint(1000, 3000)} cc"
        body = random.choice(BODY_TYPES)
        colour = random.choice(COLOURS)
        features = {
            "Comfort & Convenience": random.sample(COMFORT_FEATURES, random.randint(2, 5)),
            "Safety & Security": random.sample(SAFETY_FEATURES, random.randint(2, 5)),
            "Extras": random.sample(EXTRAS, random.randint(1, 3))
        }
        batch_data.append({
            "CO2_emissions": co2,
            "engine_size": engine,
            "body_type": body,
            "colour": colour,
            "features": json.dumps(features)
        })
    return batch_data

def populate_dummy_data():
    """Populate dummy data for all cars in the cars table with optimized bulk operations."""
    logger.info("🚀 Starting optimized dummy data population for cars table")
    
    with engine.connect() as conn:
        # Check if new columns have data
        result = conn.execute(text("SELECT CO2_emissions FROM cars LIMIT 1")).fetchone()
        if result and result[0] is not None:
            logger.info("✅ New columns already populated, skipping dummy data insertion")
            return
        
        # Get all car IDs
        car_ids = conn.execute(text("SELECT id FROM cars")).fetchall()
        if not car_ids:
            logger.warning("⚠️ No cars found in the cars table")
            return
        
        # Limit to first 100k cars
        car_ids = car_ids[:100000]
        total_cars = len(car_ids)
        
        logger.info(f"🔄 Populating dummy data for {total_cars:,} cars using optimized bulk operations")
        
        # Use larger batch size for better performance
        batch_size = 5000  # Increased from 1000 to 5000
        progress_log_interval = 25000  # Log every 25k instead of every 1k
        
        # Begin transaction for better performance
        trans = conn.begin()
        
        try:
            for i in range(0, total_cars, batch_size):
                batch = car_ids[i:i + batch_size]
                actual_batch_size = len(batch)
                
                # Pre-generate all data for this batch
                batch_data = generate_batch_dummy_data(actual_batch_size)
                
                # Prepare bulk update using executemany for better performance
                update_data = []
                for j, car_id in enumerate(batch):
                    data = batch_data[j]
                    data["id"] = car_id[0]
                    update_data.append(data)
                
                # Execute bulk update
                conn.execute(
                    text("""
                        UPDATE cars
                        SET CO2_emissions = :CO2_emissions,
                            engine_size = :engine_size,
                            body_type = :body_type,
                            colour = :colour,
                            features = :features
                        WHERE id = :id
                    """),
                    update_data
                )
                
                processed = i + actual_batch_size
                
                # Log progress less frequently
                if processed % progress_log_interval == 0 or processed == total_cars:
                    progress_pct = (processed / total_cars) * 100
                    logger.info(f"📊 Progress: {processed:,}/{total_cars:,} cars ({progress_pct:.1f}%)")
            
            # Commit the transaction
            trans.commit()
            logger.info("✅ Dummy data population completed successfully!")
            
        except Exception as e:
            trans.rollback()
            logger.error(f"❌ Error during dummy data population: {str(e)}")
            raise
    
    logger.info("🎉 Optimized dummy data population process finished!")