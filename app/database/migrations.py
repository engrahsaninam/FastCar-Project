#app/database/migrations.py
import logging
from sqlalchemy.sql import text
from app.database.sqlite import engine

logger = logging.getLogger(__name__)

def apply_migrations():
    """Apply database migrations for schema changes."""
    with engine.connect() as conn:
        with conn.begin():  # Ensure transaction
            try:
                # Check and apply migrations for users table
                result = conn.execute(text("PRAGMA table_info(users)")).fetchall()
                columns = [row[1] for row in result]
                if "is_admin" not in columns:
                    logger.info("Adding is_admin column to users table")
                    try:
                        conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))
                        logger.info("Successfully added is_admin column")
                    except Exception as e:
                        logger.error(f"Failed to add is_admin column: {str(e)}")
                        raise

                # Check and apply migrations for cars table
                result = conn.execute(text("PRAGMA table_info(cars)")).fetchall()
                columns = [row[1] for row in result]
                
                if "CO2_emissions" not in columns:
                    logger.info("Adding CO2_emissions column to cars table")
                    try:
                        conn.execute(text("ALTER TABLE cars ADD COLUMN CO2_emissions VARCHAR"))
                        logger.info("Successfully added CO2_emissions column")
                    except Exception as e:
                        logger.error(f"Failed to add CO2_emissions column: {str(e)}")
                        raise
                
                if "engine_size" not in columns:
                    logger.info("Adding engine_size column to cars table")
                    try:
                        conn.execute(text("ALTER TABLE cars ADD COLUMN engine_size VARCHAR"))
                        logger.info("Successfully added engine_size column")
                    except Exception as e:
                        logger.error(f"Failed to add engine_size column: {str(e)}")
                        raise
                
                if "body_type" not in columns:
                    logger.info("Adding body_type column to cars table")
                    try:
                        conn.execute(text("ALTER TABLE cars ADD COLUMN body_type VARCHAR"))
                        logger.info("Successfully added body_type column")
                    except Exception as e:
                        logger.error(f"Failed to add body_type column: {str(e)}")
                        raise
                
                if "colour" not in columns:
                    logger.info("Adding colour column to cars table")
                    try:
                        conn.execute(text("ALTER TABLE cars ADD COLUMN colour VARCHAR"))
                        logger.info("Successfully added colour column")
                    except Exception as e:
                        logger.error(f"Failed to add colour column: {str(e)}")
                        raise
                
                if "features" not in columns:
                    logger.info("Adding features column to cars table")
                    try:
                        conn.execute(text("ALTER TABLE cars ADD COLUMN features JSON"))
                        logger.info("Successfully added features column")
                    except Exception as e:
                        logger.error(f"Failed to add features column: {str(e)}")
                        raise
                
                if "total_price" not in columns:
                    logger.info("Adding total_price column to cars table")
                    try:
                        conn.execute(text("ALTER TABLE cars ADD COLUMN total_price FLOAT"))
                        logger.info("Successfully added total_price column")
                    except Exception as e:
                        logger.error(f"Failed to add total_price column: {str(e)}")
                        raise

                # Create additional_charges table
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='additional_charges'")).fetchall()
                if not result:
                    logger.info("Creating additional_charges table")
                    try:
                        conn.execute(text("""
                            CREATE TABLE additional_charges (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                vat FLOAT NOT NULL,
                                services_total FLOAT NOT NULL,
                                car_inspection FLOAT NOT NULL,
                                delivery FLOAT NOT NULL,
                                registration_tax FLOAT NOT NULL,
                                pre_delivery_prep FLOAT NOT NULL,
                                fuel FLOAT NOT NULL,
                                extended_warranty FLOAT NOT NULL
                            )
                        """))
                        logger.info("Successfully created additional_charges table")
                    except Exception as e:
                        logger.error(f"Failed to create additional_charges table: {str(e)}")
                        raise

                # Ensure default values exist in additional_charges
                result = conn.execute(text("SELECT COUNT(*) FROM additional_charges")).fetchone()
                if result[0] == 0:
                    logger.info("Inserting default values into additional_charges")
                    try:
                        conn.execute(text("""
                            INSERT INTO additional_charges (
                                vat, services_total, car_inspection, delivery,
                                registration_tax, pre_delivery_prep, fuel, extended_warranty
                            ) VALUES (
                                22.0, 1111.0, 119.0, 0.0,
                                293.0, 699.0, 0.0, 0.0
                            )
                        """))
                        logger.info("Successfully inserted default values into additional_charges")
                    except Exception as e:
                        logger.error(f"Failed to insert default values: {str(e)}")
                        raise
                else:
                    logger.info("Default values already exist in additional_charges table")

                # Create indexes on cars table
                indexes = [
                    ("idx_cars_brand_model", "brand, model"),
                    ("idx_cars_price", "price"),
                    ("idx_cars_year", "year"),
                    ("idx_cars_mileage", "mileage"),
                    ("idx_cars_fuel", "fuel"),
                    ("idx_cars_gear", "gear"),
                    ("idx_cars_power", "power"),
                    ("idx_cars_body_type", "body_type"),
                    ("idx_cars_colour", "colour"),
                ]
                for index_name, columns in indexes:
                    result = conn.execute(text(f"SELECT name FROM sqlite_master WHERE type='index' AND name='{index_name}'")).fetchall()
                    if not result:
                        logger.info(f"Creating index {index_name} ON cars ({columns})")
                        try:
                            conn.execute(text(f"CREATE INDEX {index_name} ON cars ({columns})"))
                            logger.info(f"Successfully created index {index_name}")
                        except Exception as e:
                            logger.error(f"Failed to create index {index_name}: {str(e)}")
                            raise

                # Create avg_prices table (materialized view)
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='avg_prices'")).fetchall()
                if not result:
                    logger.info("Creating avg_prices table")
                    try:
                        conn.execute(text("""
                            CREATE TABLE avg_prices (
                                brand TEXT NOT NULL,
                                model TEXT NOT NULL,
                                avg_price REAL,
                                group_count INTEGER,
                                last_updated TEXT NOT NULL,
                                PRIMARY KEY (brand, model)
                            )
                        """))
                        # Populate avg_prices
                        conn.execute(text("""
                            INSERT INTO avg_prices (brand, model, avg_price, group_count, last_updated)
                            SELECT brand, model, AVG(price), COUNT(*), DATETIME('now')
                            FROM cars
                            WHERE price IS NOT NULL AND brand IS NOT NULL AND model IS NOT NULL
                            GROUP BY brand, model
                        """))
                        logger.info("Successfully created and populated avg_prices table")
                    except Exception as e:
                        logger.error(f"Failed to create or populate avg_prices table: {str(e)}")
                        raise

                # Create car_filters table
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='car_filters'")).fetchall()
                if not result:
                    logger.info("Creating car_filters table")
                    try:
                        conn.execute(text("""
                            CREATE TABLE car_filters (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                fuel TEXT,
                                gear TEXT,
                                country TEXT,
                                body_type TEXT,
                                colour TEXT
                            )
                        """))
                        # Populate car_filters
                        conn.execute(text("""
                            INSERT INTO car_filters (fuel, gear, country, body_type, colour)
                            SELECT DISTINCT fuel, gear, country, body_type, colour
                            FROM cars
                            WHERE fuel IS NOT NULL OR gear IS NOT NULL OR country IS NOT NULL
                                OR body_type IS NOT NULL OR colour IS NOT NULL
                        """))
                        # Create indexes for car_filters
                        conn.execute(text("CREATE INDEX idx_car_filters_fuel ON car_filters(fuel)"))
                        conn.execute(text("CREATE INDEX idx_car_filters_gear ON car_filters(gear)"))
                        conn.execute(text("CREATE INDEX idx_car_filters_country ON car_filters(country)"))
                        conn.execute(text("CREATE INDEX idx_car_filters_body_type ON car_filters(body_type)"))
                        conn.execute(text("CREATE INDEX idx_car_filters_colour ON car_filters(colour)"))
                        logger.info("Successfully created and populated car_filters table with indexes")
                    except Exception as e:
                        logger.error(f"Failed to create or populate car_filters table: {str(e)}")
                        raise

                # Create car_features table
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='car_features'")).fetchall()
                if not result:
                    logger.info("Creating car_features table")
                    try:
                        conn.execute(text("""
                            CREATE TABLE car_features (
                                car_id TEXT NOT NULL,
                                feature TEXT NOT NULL,
                                PRIMARY KEY (car_id, feature)
                            )
                        """))
                        # Populate car_features from JSON features
                        conn.execute(text("""
                            INSERT INTO car_features (car_id, feature)
                            SELECT cars.id, json_each.value
                            FROM cars
                            CROSS JOIN json_each(cars.features)
                            WHERE json_each.value IS NOT NULL
                        """))
                        # Create index for car_features
                        conn.execute(text("CREATE INDEX idx_car_features_feature ON car_features(feature)"))
                        logger.info("Successfully created and populated car_features table with index")
                    except Exception as e:
                        logger.error(f"Failed to create or populate car_features table: {str(e)}")
                        raise
            except Exception as e:
                logger.error(f"Migration failed: {str(e)}")
                raise
            finally:
                logger.info("Database migrations completed successfully")