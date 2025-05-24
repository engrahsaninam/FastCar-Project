import logging
from sqlalchemy.sql import text
from app.database.sqlite import engine

logger = logging.getLogger(__name__)

def apply_migrations():
    """Apply database migrations for schema changes."""
    with engine.connect() as conn:
        # Check if is_admin column exists in users table
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