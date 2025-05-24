# app/database/sqlite.py 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from app.config import SQLITE_DB
from app.database.base import Base

engine = create_engine(
    SQLITE_DB, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Import models after Base to avoid circular imports
from app.models.user import User, SearchHistory, PasswordReset
from app.models.purchase import FinanceApplication, BankTransferInfo, PaymentInfo

def get_db():
    """Get SQLite database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all tables defined in models"""
    Base.metadata.create_all(bind=engine)

def is_cars_table_empty():
    """Check if the cars table is empty"""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT COUNT(*) as count FROM cars")).fetchone()
        return result[0] == 0