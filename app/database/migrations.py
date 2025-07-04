#app/database/migrations.py
import logging
from sqlalchemy.sql import text
from app.database.sqlite import engine

logger = logging.getLogger(__name__)

def apply_migrations():
    """Apply database migrations for schema changes."""
    with engine.connect() as conn:
        with conn.begin():
            try:
                # Users table migrations
                result = conn.execute(text("PRAGMA table_info(users)")).fetchall()
                columns = [row[1] for row in result]
                if "is_admin" not in columns:
                    logger.info("Adding is_admin column to users table")
                    conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))
                    logger.info("Successfully added is_admin column")
                
                # Email verification columns
                if "is_email_verified" not in columns:
                    logger.info("Adding is_email_verified column to users table")
                    conn.execute(text("ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT 0"))
                    logger.info("Successfully added is_email_verified column")
                
                if "email_verification_otp" not in columns:
                    logger.info("Adding email_verification_otp column to users table")
                    conn.execute(text("ALTER TABLE users ADD COLUMN email_verification_otp VARCHAR"))
                    logger.info("Successfully added email_verification_otp column")
                
                if "otp_expires_at" not in columns:
                    logger.info("Adding otp_expires_at column to users table")
                    conn.execute(text("ALTER TABLE users ADD COLUMN otp_expires_at DATETIME"))
                    logger.info("Successfully added otp_expires_at column")
                
                # Set existing users as email verified to avoid breaking existing accounts
                logger.info("Setting existing users as email verified")
                conn.execute(text("UPDATE users SET is_email_verified = 1 WHERE is_email_verified IS NULL OR is_email_verified = 0"))
                logger.info("Successfully updated existing users email verification status")

                # Cars table migrations
                result = conn.execute(text("PRAGMA table_info(cars)")).fetchall()
                columns = [row[1] for row in result]
                
                if "CO2_emissions" not in columns:
                    logger.info("Adding CO2_emissions column to cars table")
                    conn.execute(text("ALTER TABLE cars ADD COLUMN CO2_emissions VARCHAR"))
                    logger.info("Successfully added CO2_emissions column")
                
                if "engine_size" not in columns:
                    logger.info("Adding engine_size column to cars table")
                    conn.execute(text("ALTER TABLE cars ADD COLUMN engine_size VARCHAR"))
                    logger.info("Successfully added engine_size column")
                
                if "body_type" not in columns:
                    logger.info("Adding body_type column to cars table")
                    conn.execute(text("ALTER TABLE cars ADD COLUMN body_type VARCHAR"))
                    logger.info("Successfully added body_type column")
                
                if "colour" not in columns:
                    logger.info("Adding colour column to cars table")
                    conn.execute(text("ALTER TABLE cars ADD COLUMN colour VARCHAR"))
                    logger.info("Successfully added colour column")
                
                if "features" not in columns:
                    logger.info("Adding features column to cars table")
                    conn.execute(text("ALTER TABLE cars ADD COLUMN features JSON"))
                    logger.info("Successfully added features column")
                
                if "total_price" not in columns:
                    logger.info("Adding total_price column to cars table")
                    conn.execute(text("ALTER TABLE cars ADD COLUMN total_price FLOAT"))
                    logger.info("Successfully added total_price column")
                
                if "price_without_vat" not in columns:
                    logger.info("Adding price_without_vat column to cars table")
                    conn.execute(text("ALTER TABLE cars ADD COLUMN price_without_vat FLOAT NOT NULL DEFAULT 0.0"))
                    logger.info("Successfully added price_without_vat column")
                    logger.info("Populating price_without_vat for existing cars")
                    vat_result = conn.execute(text("SELECT vat FROM additional_charges LIMIT 1")).fetchone()
                    if not vat_result:
                        logger.error("No additional_charges record found for VAT rate")
                        raise Exception("Cannot populate price_without_vat: No VAT rate found")
                    vat_rate = max(vat_result[0], 0.0)
                    conn.execute(
                        text("UPDATE cars SET price_without_vat = ROUND(price / (1 + :vat_rate / 100), 2)"),
                        {"vat_rate": vat_rate}
                    )
                    logger.info("Successfully populated price_without_vat")

                if "status" not in columns:
                    logger.info("Adding status column to cars table")
                    conn.execute(text("ALTER TABLE cars ADD COLUMN status VARCHAR DEFAULT 'available'"))
                    logger.info("Successfully added status column")

                # Additional charges table
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='additional_charges'")).fetchall()
                if not result:
                    logger.info("Creating additional_charges table")
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

                # Ensure default values in additional_charges
                result = conn.execute(text("SELECT COUNT(*) FROM additional_charges")).fetchone()
                if result[0] == 0:
                    logger.info("Inserting default values into additional_charges")
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
                else:
                    logger.info("Default values already exist in additional_charges table")

                # Purchases table
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='purchases'")).fetchall()
                if not result:
                    logger.info("Creating purchases table")
                    conn.execute(text("""
                        CREATE TABLE purchases (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id INTEGER NOT NULL,
                            car_id VARCHAR NOT NULL,
                            total_price FLOAT NOT NULL,
                            stripe_payment_id VARCHAR,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users(id),
                            FOREIGN KEY (car_id) REFERENCES cars(id)
                        )
                    """))
                    logger.info("Successfully created purchases table")

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
                    ("idx_cars_price_without_vat", "price_without_vat"),
                ]
                for index_name, columns in indexes:
                    result = conn.execute(text(f"SELECT name FROM sqlite_master WHERE type='index' AND name='{index_name}'")).fetchall()
                    if not result:
                        logger.info(f"Creating index {index_name} ON cars ({columns})")
                        conn.execute(text(f"CREATE INDEX {index_name} ON cars ({columns})"))
                        logger.info(f"Successfully created index {index_name}")

                # Create avg_prices table
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='avg_prices'")).fetchall()
                if not result:
                    logger.info("Creating avg_prices table")
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
                    conn.execute(text("""
                        INSERT INTO avg_prices (brand, model, avg_price, group_count, last_updated)
                        SELECT brand, model, AVG(price), COUNT(*), DATETIME('now')
                        FROM cars
                        WHERE price IS NOT NULL AND brand IS NOT NULL AND model IS NOT NULL
                        GROUP BY brand, model
                    """))
                    logger.info("Successfully created and populated avg_prices table")

                # Create car_filters table
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='car_filters'")).fetchall()
                if not result:
                    logger.info("Creating car_filters table")
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
                    conn.execute(text("""
                        INSERT INTO car_filters (fuel, gear, country, body_type, colour)
                        SELECT DISTINCT fuel, gear, country, body_type, colour
                        FROM cars
                        WHERE fuel IS NOT NULL OR gear IS NOT NULL OR country IS NOT NULL
                            OR body_type IS NOT NULL OR colour IS NOT NULL
                    """))
                    conn.execute(text("CREATE INDEX idx_car_filters_fuel ON car_filters(fuel)"))
                    conn.execute(text("CREATE INDEX idx_car_filters_gear ON car_filters(gear)"))
                    conn.execute(text("CREATE INDEX idx_car_filters_country ON car_filters(country)"))
                    conn.execute(text("CREATE INDEX idx_car_filters_body_type ON car_filters(body_type)"))
                    conn.execute(text("CREATE INDEX idx_car_filters_colour ON car_filters(colour)"))
                    logger.info("Successfully created and populated car_filters table with indexes")

                # Create car_features table
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='car_features'")).fetchall()
                if not result:
                    logger.info("Creating car_features table")
                    conn.execute(text("""
                        CREATE TABLE car_features (
                            car_id TEXT NOT NULL,
                            feature TEXT NOT NULL,
                            PRIMARY KEY (car_id, feature)
                        )
                    """))
                    conn.execute(text("""
                        INSERT INTO car_features (car_id, feature)
                        SELECT cars.id, json_each.value
                        FROM cars
                        CROSS JOIN json_each(cars.features)
                        WHERE json_each.value IS NOT NULL
                    """))
                    conn.execute(text("CREATE INDEX idx_car_features_feature ON car_features(feature)"))
                    logger.info("Successfully created and populated car_features table with index")
            except Exception as e:
                logger.error(f"Migration failed: {str(e)}")
                raise
            finally:
                logger.info("Database migrations completed successfully")