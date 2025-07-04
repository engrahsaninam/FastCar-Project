#app/models/car.py
from sqlalchemy import Column, String, Float, Integer, JSON, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from app.database.base import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(String, primary_key=True, index=True)
    brand = Column(String, index=True, nullable=False)
    model = Column(String, index=True, nullable=False)
    version = Column(String, nullable=True)
    price = Column(Float, index=True, nullable=False)
    price_without_vat = Column(Float, nullable=False)  # Price excluding VAT
    mileage = Column(Float, nullable=True)
    age = Column(Float, nullable=True)
    power = Column(Integer, nullable=True)
    gear = Column(String, nullable=True)
    fuel = Column(String, nullable=True)
    country = Column(String, nullable=True)
    zipcode = Column(String, nullable=True)
    images = Column(JSON, nullable=True)
    url = Column(Text, nullable=True)
    attrs = Column(JSON, nullable=True)
    year = Column(Integer, nullable=True)
    CO2_emissions = Column(String, nullable=True)
    engine_size = Column(String, nullable=True)
    body_type = Column(String, nullable=True)
    colour = Column(String, nullable=True)
    features = Column(JSON, nullable=True)
    total_price = Column(Float, nullable=True)  # Total price including charges
    status = Column(String, default="available")  # available, sold, unavailable
    
    # New availability tracking fields
    is_available = Column(Boolean, default=True, index=True)  # Quick availability check
    last_checked = Column(DateTime, nullable=True)  # When URL was last checked
    check_attempts = Column(Integer, default=0)  # Number of failed attempts
    unavailable_since = Column(DateTime, nullable=True)  # When car became unavailable
    
class SavedSearch(Base):
    __tablename__ = "saved_searches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)  # Custom name provided by user
    search_params = Column(String, nullable=False)  # JSON string of filters
    created_at = Column(DateTime, default=func.now())