#app/models/purchase.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, Float
from sqlalchemy.sql import func
from app.database.base import Base

class FinanceApplication(Base):
    __tablename__ = "finance_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    car_id = Column(String, nullable=False)  # From cars table
    loan_type = Column(String, default="regular") 
    apr = Column(Float, nullable=False) # Annual Percentage Rate
    interest_rate = Column(Float, nullable=False)
    payback_period_months = Column(Integer, nullable=False) 
    down_payment_percent = Column(Float, nullable=False) 
    down_payment_amount = Column(Float, nullable=False)
    last_payment_percent = Column(Float, nullable=False) 
    last_payment_amount = Column(Float, nullable=False)
    monthly_installment = Column(Float, nullable=False)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    telephone_number = Column(String, nullable=False)
    email = Column(String, nullable=False)
    identification_number = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=False)  # Format: DD/MM/YYYY
    status = Column(Enum("in_progress", "approved", "rejected", name="finance_status"), default="in_progress")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class BankTransferInfo(Base):
    __tablename__ = "bank_transfer_info"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # car_id = Column(String, nullable=False)  # From cars table
    car_id = Column(String, ForeignKey("cars.id"), nullable=False)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    telephone_number = Column(String, nullable=False)
    birth_date = Column(String, nullable=False)  # Format: DD.MM.YYYY
    billing_address_street = Column(String, nullable=False)
    billing_address_house_number = Column(String, nullable=False)
    billing_address_postal_code = Column(String, nullable=False)
    billing_address_city = Column(String, nullable=False)
    billing_address_country = Column(String, nullable=False)
    is_company = Column(Boolean, default=False)
    is_vat_payer = Column(Boolean, default=False)
    company_id = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    status = Column(String, default="in_progress")
    created_at = Column(DateTime, default=func.now())

class Purchase(Base):
    __tablename__ = "purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    car_id = Column(String, ForeignKey("cars.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    stripe_payment_id = Column(String, nullable=True)
    status = Column(String, default="in_progress")
    created_at = Column(DateTime, default=func.now())
    
class DeliveryInfo(Base):
    __tablename__ = "delivery_info"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    car_id = Column(String, ForeignKey("cars.id"), nullable=False)
    finance_id = Column(Integer, ForeignKey("finance_applications.id"), nullable=True)
    
    delivery_type = Column(Enum("home_delivery", "pickup", name="delivery_type_enum"), nullable=False)
    
    # Home delivery address fields (only required if delivery_type == "home_delivery")
    name = Column(String, nullable=True, default="None")
    email = Column(String, nullable=True, default="None")
    pone_number = Column(String, nullable=True, default="None")
    address = Column(String, nullable=True, default="None")
    
    # Billing address and delivery address aren't the same
    billing_delivery_same = Column(Boolean, nullable=False, default=True)
    delivery_address = Column(String, nullable=True, default="None")
    city = Column(String, nullable=True, default="None")
    postal_code = Column(String, nullable=True, default="None")
    country = Column(String, nullable=True, default="None")

    # Pickup location (only required if delivery_type == "pickup")
    pickup_location_id = Column(String, nullable=True, default="None")

    total_price = Column(Float, nullable=False)
    status = Column(String, default="in_progress")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
class ServiceAddon(Base):
    __tablename__ = "service_addons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price_eur = Column(Float, nullable=False)
    

    created_at = Column(DateTime, default=func.now())

class PurchaseAddon(Base):
    __tablename__ = "purchase_addons"

    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id"), nullable=True)
    finance_id = Column(Integer, ForeignKey("finance_applications.id"), nullable=True)
    addon_name = Column(String, nullable=True)
    addon_price = Column(Float, nullable=True)
    status = Column(String, default="in_progress")
    created_at = Column(DateTime, default=func.now())
