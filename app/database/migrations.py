#app/database/migrations.py
import logging
from sqlalchemy.sql import text
from app.database.sqlite import engine

logger = logging.getLogger(__name__)

def apply_migrations():
    """Apply database migrations for schema changes."""
    with engine.connect() as conn:
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
        else:
            logger.info("is_admin column already exists in users table")

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