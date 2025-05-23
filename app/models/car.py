#app/models/car.py
from sqlalchemy import Column, String, Float, Integer, JSON, Text
from app.database.sqlite import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(String, primary_key=True, index=True)
    brand = Column(String, index=True, nullable=False)
    model = Column(String, index=True, nullable=False)
    version = Column(String, nullable=True)
    price = Column(Float, index=True, nullable=False)
    mileage = Column(Float, nullable=True)
    age = Column(Float, nullable=True)
    power = Column(Integer, nullable=True)
    gear = Column(String, nullable=True)
    fuel = Column(String, nullable=True)
    country = Column(String, nullable=True)
    zipcode = Column(String, nullable=True)
    images = Column(JSON, nullable=True)  # Store as JSON string
    url = Column(Text, nullable=True)
    attrs = Column(JSON, nullable=True)  # Store as JSON string
    year = Column(Integer, nullable=True)