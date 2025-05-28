from sqlalchemy import Column, Integer, Float
from app.database.base import Base

class AdditionalCharges(Base):
    __tablename__ = "additional_charges"

    id = Column(Integer, primary_key=True, index=True)
    vat = Column(Float, nullable=False)
    services_total = Column(Float, nullable=False)
    car_inspection = Column(Float, nullable=False)
    delivery = Column(Float, nullable=False)
    registration_tax = Column(Float, nullable=False)
    pre_delivery_prep = Column(Float, nullable=False)
    fuel = Column(Float, nullable=False)
    extended_warranty = Column(Float, nullable=False)