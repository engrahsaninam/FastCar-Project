#app/models/purchase.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from app.database.base import Base

class FinanceApplication(Base):
    __tablename__ = "finance_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    car_id = Column(String, nullable=False)  # From cars table
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
    car_id = Column(String, nullable=False)  # From cars table
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
    created_at = Column(DateTime, default=func.now())

class PaymentInfo(Base):
    __tablename__ = "payment_info"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    car_id = Column(String, nullable=False)  # From cars table
    card_number = Column(String, nullable=False)  # Store last 4 digits only
    expiration_date = Column(String, nullable=False)  # Format: MM/YY
    cvc_cvv = Column(String, nullable=False)  # Store temporarily, clear after processing
    created_at = Column(DateTime, default=func.now())