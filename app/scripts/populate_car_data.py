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

def generate_dummy_data():
    """Generate dummy data for a single car."""
    co2 = f"{random.randint(100, 250)} g"
    engine = f"{random.randint(1000, 3000)} cc"
    body = random.choice(BODY_TYPES)
    colour = random.choice(COLOURS)
    features = {
        "Comfort & Convenience": random.sample(COMFORT_FEATURES, random.randint(2, 5)),
        "Safety & Security": random.sample(SAFETY_FEATURES, random.randint(2, 5)),
        "Extras": random.sample(EXTRAS, random.randint(1, 3))
    }
    return {
        "CO2_emissions": co2,
        "engine_size": engine,
        "body_type": body,
        "colour": colour,
        "features": json.dumps(features)
    }

def populate_dummy_data():
    """Populate dummy data for all cars in the cars table."""
    logger.info("Starting dummy data population for cars table")
    
    with engine.connect() as conn:
        # Check if new columns have data
        result = conn.execute(text("SELECT CO2_emissions FROM cars LIMIT 1")).fetchone()
        if result and result[0] is not None:
            logger.info("New columns already populated, skipping dummy data insertion")
            return
        
        # Get all car IDs
        car_ids = conn.execute(text("SELECT id FROM cars")).fetchall()
        if not car_ids:
            logger.warning("No cars found in the cars table")
            return
        
        logger.info(f"Populating dummy data for {len(car_ids)} cars")
        # populate only first 100k cars in the cars table
        car_ids = car_ids[:100000]
        batch_size = 1000
        for i in range(0, len(car_ids), batch_size):
            batch = car_ids[i:i + batch_size]
            for car_id in batch:
                data = generate_dummy_data()
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
                    {
                        "id": car_id[0],
                        "CO2_emissions": data["CO2_emissions"],
                        "engine_size": data["engine_size"],
                        "body_type": data["body_type"],
                        "colour": data["colour"],
                        "features": data["features"]
                    }
                )
            conn.commit()
            logger.info(f"Populated dummy data for {i + len(batch)}/{len(car_ids)} cars")
    
    logger.info("Dummy data population completed")