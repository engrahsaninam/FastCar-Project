#app/api/purchase.py
from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile, File
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel, validator
import re, unicodedata
import stripe
from app.config import STRIPE_SECRET_KEY, DOMAIN
from app.database.sqlite import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.car import Car, CarInspection
from app.models.purchase import FinanceApplication, BankTransferInfo, Purchase, DeliveryInfo, PurchaseAddon, ServiceAddon
import logging
import os
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)
router = APIRouter(tags=["purchase"])

# Pydantic Schemas
class FinanceApplicationCreate(BaseModel):
    # financing fields
    loan_type: Optional[str] = "regular"  
    apr: float  # e.g., 10.25
    interest_rate: float  # e.g., 8.99
    payback_period_months: int  # e.g., 12
    down_payment_percent: float  # e.g., 20.0
    down_payment_amount: float  # e.g., 5488.0
    last_payment_percent: float  # e.g., 49.0
    last_payment_amount: float  # e.g., 13446.0
    monthly_installment: float  # e.g., 1915.0
    
    # More details
    car_id: str
    name: str
    surname: str
    telephone_number: str
    email: str
    identification_number: str
    date_of_birth: str

    @validator("telephone_number")
    def validate_phone(cls, v):
        v = unicodedata.normalize("NFKC", v)
        v = ''.join(c for c in v if not unicodedata.category(c).startswith('C'))
        if not re.match(r"^\+\d{1,3}\d{6,14}$", v):
            raise ValueError("Invalid phone number format, e.g., +39...")
        return v

    @validator("email")
    def validate_email(cls, v):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email format")
        return v

    @validator("date_of_birth")
    def validate_birth_date(cls, v):
        if not re.match(r"^\d{2}\.\d{2}\.\d{4}$", v):
            raise ValueError("Invalid date format, use DD.MM.YYYY")
        return v

class FinanceApplicationResponse(BaseModel):
    # New loan-related fields
    loan_type: Optional[str] = "regular"
    apr: float = 0.0
    interest_rate: float = 0.0
    payback_period_months: int = 12
    down_payment_percent: float = 0.0
    down_payment_amount: float = 0.0
    last_payment_percent: float = 0.0
    last_payment_amount: float = 0.0
    monthly_installment: float = 0.0
    
    # more details
    id: int
    user_id: int
    car_id: str = "no-any"
    name: str 
    surname: str = "no-any"
    telephone_number: str = "Not provided"
    email: str = "not_provided@example.com"
    identification_number: str = "N/A"
    date_of_birth: str = "1900-01-01"
    status: str = "no-any"

    created_at: str = "0000-00-00T00:00:00"
    updated_at: str = "0000-00-00T00:00:00"


class FinanceApplicationUpdate(BaseModel):
    status: str

    @validator("status")
    def validate_status(cls, v):
        if v not in ["in_progress", "approved", "rejected"]:
            raise ValueError("Status must be in_progress, approved, or rejected")
        return v

class BankTransferCreate(BaseModel):
    car_id: str
    name: str
    surname: str
    telephone_number: str
    birth_date: str
    billing_address_street: str
    billing_address_house_number: str
    billing_address_postal_code: str
    billing_address_city: str
    billing_address_country: str
    is_company: bool = False
    is_vat_payer: Optional[bool] = None
    company_id: Optional[str] = None
    company_name: Optional[str] = None

    # @validator("telephone_number")
    # def validate_phone(cls, v):
    #     if not re.match(r"^\+\d{1,3}\d{6,14}$", v):
    #         raise ValueError("Invalid phone number format, e.g., +39...")
    #     return v
    @validator("telephone_number")
    def validate_phone(cls, v):
        # Normalize and remove invisible characters
        v = unicodedata.normalize("NFKC", v)
        v = ''.join(c for c in v if not unicodedata.category(c).startswith('C'))  # remove control characters

        if not re.match(r"^\+\d{1,3}\d{6,14}$", v):
            raise ValueError("Invalid phone number format, e.g., +39...")
        return v

    # @validator("birth_date")
    # def validate_birth_date(cls, v):
    #     if not re.match(r"^\d{2}\.\d{2}\.\d{4}$", v):
    #         raise ValueError("Invalid date format, use DD.MM.YYYY")
    #     return v
    @validator("birth_date")
    def validate_birth_date(cls, v):
        # Remove invisible control characters
        v = ''.join(c for c in v if c.isprintable())

        # Validate the cleaned date format
        if not re.match(r"^\d{2}\.\d{2}\.\d{4}$", v):
            raise ValueError("Invalid date format, use DD.MM.YYYY")
        return v

    @validator("company_id", "company_name")
    def validate_company_fields(cls, v, values):
        is_company = values.get("is_company", False)
        if is_company and not v:
            raise ValueError("Company ID and name are required for company")
        if not is_company and v:
            raise ValueError("Company fields should be null for consumer")
        return v

class BankTransferResponse(BaseModel):
    id: int = 0
    user_id: int = 0
    car_id: str = "N/A"
    name: str = "Unknown"
    surname: str = "Unknown"
    telephone_number: str = "Not provided"
    birth_date: str = "1900-01-01"
    billing_address_street: str = "N/A"
    billing_address_house_number: str = "-"
    billing_address_postal_code: str = "00000"
    billing_address_city: str = "Unknown"
    billing_address_country: str = "Unknown"
    is_company: bool = False
    is_vat_payer: Optional[bool] = False
    company_id: Optional[str] = None
    company_name: Optional[str] = None
    status: str = "in_progress"
    created_at: str = "0000-00-00T00:00:00"

class DeliveryCreate(BaseModel):
    car_id: str
    delivery_type: str  # "home_delivery" or "pickup"
    name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    billing_delivery_same: bool = True
    delivery_address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    pickup_location_id: Optional[str] = None
    total_price: float

class DeliveryResponse(BaseModel):
    id: int
    user_id: int
    car_id: str
    purchase_id: Optional[int] = None
    finance_id: Optional[int] = None
    delivery_type: str
    name: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]
    address: Optional[str]
    billing_delivery_same: bool
    delivery_address: Optional[str]
    city: Optional[str]
    postal_code: Optional[str]
    country: Optional[str]
    pickup_location_id: Optional[str]
    total_price: float
    created_at: str
    updated_at: str


class AddonCreate(BaseModel):
    name: str
    price_eur: float

class AddonItem(BaseModel):
    addon_name: str
    addon_price: float

class PurchaseAddonCreate(BaseModel):
    addon_ids: List[AddonItem]

class PurchaseAddonResponse(BaseModel):
    id: int
    purchase_id: Optional[int] = None
    finance_id: Optional[int] = None
    addon_name: str
    addon_price: float
    status: str
    created_at: datetime


@router.post("/finance/apply", response_model=FinanceApplicationResponse)
async def apply_finance(
    data: FinanceApplicationCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    car = db.query(Car).filter(Car.id == data.car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    if car.status != "available":
        raise HTTPException(status_code=400, detail="Car is already sold or not available for financing")
    
    application = db.query(FinanceApplication).filter_by(
        user_id=user.id,
        car_id=data.car_id,
        status="in_progress"
    ).first()

    if application:
        application.name = data.name
        application.surname = data.surname
        application.telephone_number = data.telephone_number
        application.email = data.email
        application.identification_number = data.identification_number
        application.date_of_birth = data.date_of_birth
        application.loan_type = data.loan_type
        application.apr = data.apr
        application.interest_rate = data.interest_rate
        application.payback_period_months = data.payback_period_months
        application.down_payment_percent = data.down_payment_percent
        application.down_payment_amount = data.down_payment_amount
        application.last_payment_percent = data.last_payment_percent
        application.last_payment_amount = data.last_payment_amount
        application.monthly_installment = data.monthly_installment
    else:
        application = FinanceApplication(
            user_id=user.id,
            car_id=data.car_id,
            name=data.name,
            surname=data.surname,
            telephone_number=data.telephone_number,
            email=data.email,
            identification_number=data.identification_number,
            date_of_birth=data.date_of_birth,
            loan_type=data.loan_type,
            apr=data.apr,
            interest_rate=data.interest_rate,
            payback_period_months=data.payback_period_months,
            down_payment_percent=data.down_payment_percent,
            down_payment_amount=data.down_payment_amount,
            last_payment_percent=data.last_payment_percent,
            last_payment_amount=data.last_payment_amount,
            monthly_installment=data.monthly_installment,
            status="in_progress"
        )
        db.add(application)

    db.commit()
    db.refresh(application)

    logger.info(f"Finance application saved: user_id={user.id}, car_id={data.car_id}")
    return FinanceApplicationResponse(
        id=application.id,
        user_id=application.user_id,
        car_id=application.car_id,
        name=application.name,
        surname=application.surname,
        telephone_number=application.telephone_number,
        email=application.email,
        identification_number=application.identification_number,
        date_of_birth=application.date_of_birth,
        loan_type=application.loan_type,
        apr=application.apr,
        interest_rate=application.interest_rate,
        payback_period_months=application.payback_period_months,
        down_payment_percent=application.down_payment_percent,
        down_payment_amount=application.down_payment_amount,
        last_payment_percent=application.last_payment_percent,
        last_payment_amount=application.last_payment_amount,
        monthly_installment=application.monthly_installment,
        status=application.status,
        created_at=application.created_at.isoformat(),
        updated_at=application.updated_at.isoformat()
    )

# @router.patch("/finance/applications/{id}/status", response_model=FinanceApplicationResponse)
# async def update_finance_status(
#     id: int,
#     data: FinanceApplicationUpdate,
#     user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     if not user or not user.is_admin:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    
#     application = db.query(FinanceApplication).filter(FinanceApplication.id == id).first()
#     if not application:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
#     application.status = data.status
#     db.commit()
#     db.refresh(application)
    
#     logger.info(f"Finance application updated: id={id}, status={data.status}")
#     return FinanceApplicationResponse(
#         id=application.id,
#         user_id=application.user_id,
#         car_id=application.car_id,
#         name=application.name,
#         surname=application.surname,
#         telephone_number=application.telephone_number,
#         email=application.email,
#         identification_number=application.identification_number,
#         date_of_birth=application.date_of_birth,
#         status=application.status,
#         created_at=application.created_at.isoformat(),
#         updated_at=application.updated_at.isoformat()
#     )

# Bank Transfer Endpoints
@router.post("/bank-transfer/submit", response_model=BankTransferResponse)
async def submit_bank_transfer(
    data: BankTransferCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    
    car = db.query(Car).filter(Car.id == data.car_id, Car.status.notlike(f"%sold%")).first()
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    if car.status != "available":
        raise HTTPException(status_code=400, detail="Car is not available")

    bank_info = db.query(BankTransferInfo).filter_by(
        user_id=user.id,
        car_id=data.car_id,
        status="in_progress"
    ).first()

    if bank_info:
        bank_info.name = data.name
        bank_info.surname = data.surname
        bank_info.telephone_number = data.telephone_number
        bank_info.birth_date = data.birth_date
        bank_info.billing_address_street = data.billing_address_street
        bank_info.billing_address_house_number = data.billing_address_house_number
        bank_info.billing_address_postal_code = data.billing_address_postal_code
        bank_info.billing_address_city = data.billing_address_city
        bank_info.billing_address_country = data.billing_address_country
        bank_info.is_company = data.is_company
        bank_info.is_vat_payer = data.is_vat_payer if data.is_company else False
        bank_info.company_id = data.company_id if data.is_company else None
        bank_info.company_name = data.company_name if data.is_company else None
    else:
        bank_info = BankTransferInfo(
            user_id=user.id,
            car_id=data.car_id,
            name=data.name,
            surname=data.surname,
            telephone_number=data.telephone_number,
            birth_date=data.birth_date,
            billing_address_street=data.billing_address_street,
            billing_address_house_number=data.billing_address_house_number,
            billing_address_postal_code=data.billing_address_postal_code,
            billing_address_city=data.billing_address_city,
            billing_address_country=data.billing_address_country,
            is_company=data.is_company,
            is_vat_payer=data.is_vat_payer if data.is_company else False,
            company_id=data.company_id if data.is_company else None,
            company_name=data.company_name if data.is_company else None,
            status="in_progress"
        )
        db.add(bank_info)

    db.commit()
    db.refresh(bank_info)

    logger.info(f"Bank transfer info saved: user_id={user.id}, car_id={data.car_id}")
    return BankTransferResponse(
        id=bank_info.id,
        user_id=bank_info.user_id,
        car_id=bank_info.car_id,
        name=bank_info.name,
        surname=bank_info.surname,
        telephone_number=bank_info.telephone_number,
        birth_date=bank_info.birth_date,
        billing_address_street=bank_info.billing_address_street,
        billing_address_house_number=bank_info.billing_address_house_number,
        billing_address_postal_code=bank_info.billing_address_postal_code,
        billing_address_city=bank_info.billing_address_city,
        billing_address_country=bank_info.billing_address_country,
        is_company=bank_info.is_company,
        is_vat_payer=bank_info.is_vat_payer,
        company_id=bank_info.company_id,
        company_name=bank_info.company_name,
        created_at=bank_info.created_at.isoformat()
    )

# @router.get("/get-latest-user-context")
# async def get_latest_user_context_api(
#     user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     if not user:
#         raise HTTPException(status_code=401, detail="Authentication required")

#     # Fetch latest finalized purchase
#     purchase = db.query(Purchase).filter(
#         Purchase.user_id == user.id,
#         Purchase.status == "finalized"
#     ).order_by(Purchase.created_at.desc()).first()

#     # Fetch latest in-progress finance application
#     finance = db.query(FinanceApplication).filter(
#         FinanceApplication.user_id == user.id,
#         FinanceApplication.status == "in_progress"
#     ).order_by(FinanceApplication.updated_at.desc()).first()

#     # Decide which context is latest
#     if purchase and finance:
#         if purchase.created_at > finance.updated_at:
#             return {
#                 "context_type": "purchase",
#                 "data": {
#                     "id": purchase.id,
#                     "car_id": purchase.car_id,
#                     "status": purchase.status,
#                     "created_at": purchase.created_at.isoformat()
#                 }
#             }
#         else:
#             return {
#                 "context_type": "finance",
#                 "data": {
#                     "id": finance.id,
#                     "car_id": finance.car_id,
#                     "status": finance.status,
#                     "created_at": finance.created_at.isoformat(),
#                     "updated_at": finance.updated_at.isoformat()
#                 }
#             }

#     elif purchase:
#         return {
#             "context_type": "purchase",
#             "data": {
#                 "id": purchase.id,
#                 "car_id": purchase.car_id,
#                 "status": purchase.status,
#                 "created_at": purchase.created_at.isoformat()
#             }
#         }

#     elif finance:
#         return {
#             "context_type": "finance",
#             "data": {
#                 "id": finance.id,
#                 "car_id": finance.car_id,
#                 "status": finance.status,
#                 "created_at": finance.created_at.isoformat(),
#                 "updated_at": finance.updated_at.isoformat()
#             }
#         }

#     # No context found
#     return {
#         "context_type": None,
#         "data": None
#     }

@router.get("/get-latest-user-context")
async def get_latest_user_context_api(
    car_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    # Fetch latest finalized purchase for the given car
    purchase = db.query(Purchase).filter(
        Purchase.user_id == user.id,
        Purchase.car_id == car_id,
        Purchase.status == "finalized"
    ).order_by(Purchase.created_at.desc()).first()

    # Fetch latest finance application for the given car
    finance = db.query(FinanceApplication).filter(
        FinanceApplication.user_id == user.id,
        FinanceApplication.car_id == car_id,
        FinanceApplication.status == "in_progress"
    ).order_by(FinanceApplication.updated_at.desc()).first()

    # Decide which context is latest
    if purchase and finance:
        if purchase.created_at > finance.updated_at:
            return {
                "context_type": "purchase",
                "data": {
                    "id": purchase.id,
                    "car_id": purchase.car_id,
                    "status": purchase.status,
                    "created_at": purchase.created_at.isoformat()
                }
            }
        else:
            return {
                "context_type": "finance",
                "data": {
                    "id": finance.id,
                    "car_id": finance.car_id,
                    "status": finance.status,
                    "created_at": finance.created_at.isoformat(),
                    "updated_at": finance.updated_at.isoformat()
                }
            }

    elif purchase:
        return {
            "context_type": "purchase",
            "data": {
                "id": purchase.id,
                "car_id": purchase.car_id,
                "status": purchase.status,
                "created_at": purchase.created_at.isoformat()
            }
        }

    elif finance:
        return {
            "context_type": "finance",
            "data": {
                "id": finance.id,
                "car_id": finance.car_id,
                "status": finance.status,
                "created_at": finance.created_at.isoformat(),
                "updated_at": finance.updated_at.isoformat()
            }
        }

    # No context found
    return {
        "context_type": None,
        "data": None
    }

# Stripe Payment Endpoints
@router.post("/checkout/{car_id}")
async def create_checkout_session(
    car_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Stripe Checkout Session for a car purchase."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    # Fetch car
    car = db.query(Car).filter(Car.id == car_id, Car.status.notlike(f"%sold%")).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    if car.status != "available":
        raise HTTPException(status_code=400, detail="Car is not available")
    if not car.total_price:
        raise HTTPException(status_code=400, detail="Total price not set")

    try:
        # Create Stripe Checkout Session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": f"{car.brand} {car.model} {car.version or ''}",
                            "description": f"Year: {car.year}, Mileage: {car.mileage}km",
                        },
                        "unit_amount": int(car.total_price * 100),  # Cents
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=f"{DOMAIN}/api/purchase/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{DOMAIN}/api/purchase/cancel",
            client_reference_id=car_id,
            metadata={"user_id": str(user.id)},
        )
        return {"checkout_url": session.url}
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/success-car-inspection")
async def checkout_success(
    session_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Handle successful checkout."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    try:
        # Retrieve Stripe session
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status != "paid":
            raise HTTPException(status_code=400, detail="Payment not completed")

        car_id = session.client_reference_id
        user_id = int(session.metadata.get("user_id"))

        if user_id != user.id:
            raise HTTPException(status_code=403, detail="Unauthorized")

        # Fetch car
        car = db.query(Car).filter(Car.id == car_id, Car.status.notlike(f"%sold%")).first()
        if not car:
            raise HTTPException(status_code=404, detail="Car not found")
        if car.status != "available":
            raise HTTPException(status_code=400, detail="Car is not available")

        # Create purchase record
        purchase = Purchase(
            user_id=user_id,
            car_id=car_id,
            total_price=car.total_price,
            stripe_payment_id=session.payment_intent,
            status="finalized"
        )
        db.add(purchase)
        car.status = "sold"
        # db.commit()
        
        inspection = CarInspection(
            user_id=user_id,
            car_id=car_id,
            status="pending",
            scheduled_date=datetime.utcnow() + timedelta(days=3)  # 3 business days approx.
        )
        db.add(inspection)
        
        # Finalize other related user draft records
        db.query(BankTransferInfo).filter_by(user_id=user.id, status="in_progress").update({"status": "finalized"})
        # db.query(DeliveryInfo).filter_by(user_id=user.id, status="in_progress").update({"status": "finalized"})
        # db.query(PurchaseAddon).filter(
        #     PurchaseAddon.purchase_id.in_(
        #         db.query(Purchase.id).filter_by(user_id=user.id, status="in_progress")
        #     )
        # ).update({"status": "finalized"}, synchronize_session=False)

        # Also finalize previous purchases marked in_progress (if any)
        db.query(Purchase).filter_by(user_id=user.id, status="in_progress").update({"status": "finalized"})

        db.commit()

        logger.info(f"Purchase completed for car {car_id} by user {user_id}")
        return JSONResponse(
            status_code=200,
            content={
                "message": "Purchase successful. Car inspection scheduled.",
                "purchase_id": purchase.id,
                "inspection_id":inspection.id,
                "inspection_scheduled_for": inspection.scheduled_date.strftime("%Y-%m-%d"),
                "check_back_on": inspection.scheduled_date.strftime("%Y-%m-%d"),
            }
        )
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

from typing import Optional
from fastapi import Query

@router.get("/admin/inspections/")
async def get_inspections(
    status: Optional[str] = Query(None, description="Filter by inspection status: pending or completed"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    # Validate filter if provided
    valid_statuses = ["pending", "completed", "rejected", "in_progress"]
    if status and status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Allowed values: {valid_statuses}")

    # Apply filtering
    query = db.query(CarInspection)
    if status:
        query = query.filter(CarInspection.status == status)

    inspections = query.order_by(CarInspection.created_at.desc()).all()
    if not inspections:
        raise HTTPException(status_code=404, detail="No inspections found")

    # Serialize response
    response = []
    for i in inspections:
        response.append({
            "id": i.id,
            "user_id": i.user_id,
            "car_id": i.car_id,
            "status": i.status,
            "scheduled_date": i.scheduled_date.isoformat() if i.scheduled_date else None,
            "completed_at": i.completed_at.isoformat() if i.completed_at else None,
            "report_url": i.report_url,
            "created_at": i.created_at.isoformat(),
            "updated_at": i.updated_at.isoformat()
        })

    return {"inspections": response}

@router.patch("/admin/inspection/{inspection_id}/complete")
async def upload_inspection_report(
    inspection_id: int,
    report_file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    inspection = db.query(CarInspection).filter_by(id=inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")

    reports_dir = os.path.join(os.getcwd(), "inspection_reports")

    if not os.path.exists(reports_dir):
        os.mkdir(reports_dir)
    
    # Save file locally or to cloud storage (e.g., S3)
    filename = f"{inspection_id}_{report_file.filename}"
    # save_path = f"/path/to/storage/{filename}"  # Adjust as needed
    save_path = os.path.join(reports_dir, filename)

    with open(save_path, "wb") as f:
        f.write(await report_file.read())

    # Update inspection record
    inspection.status = "completed"
    inspection.report_url = save_path  # or public URL if using cloud
    inspection.completed_at = datetime.utcnow()
    db.commit()

    return {"message": "Inspection report uploaded successfully", "report_url": inspection.report_url}

@router.get("/inspection/{car_id}")
async def get_inspection_status(
    car_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    inspection = db.query(CarInspection).filter_by(user_id=user.id, car_id=car_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="No inspection found")

    return {
        "car_id": car_id,
        "status": inspection.status,
        "scheduled_date": inspection.scheduled_date.isoformat(),
        "completed_at": inspection.completed_at.isoformat() if inspection.completed_at else None,
        "report_url": inspection.report_url  # PDF path/URL
    }


@router.get("/cancel")
async def checkout_cancel():
    """Handle canceled checkout."""
    return RedirectResponse(url="/purchase/canceled")  # Adjust to frontend


@router.post("/submit-delivery-info", response_model=DeliveryResponse)
async def submit_delivery_info(
    purchase_id: Optional[int] = None,
    finance_id: Optional[int] = None,
    data: DeliveryCreate = Depends(),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    car_id = None
    total_price = 0.0

    # --- Identify Context ---
    if purchase_id:
        purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
        if not purchase or purchase.status != "finalized":
            raise HTTPException(status_code=400, detail="Car inspection not finalized.")
        car_id = purchase.car_id
        total_price = data.total_price

    elif finance_id:
        finance = db.query(FinanceApplication).filter(FinanceApplication.id == finance_id).first()
        if not finance:
            raise HTTPException(status_code=404, detail="Finance application not found.")
        if finance.status != "approved" or finance.flow_status != "in_progress":
            raise HTTPException(
                status_code=400,
                detail=f"Finance application is {finance.status}. Delivery not allowed until it's approved."
            )
        car_id = finance.car_id
        total_price = data.total_price
        # --- Check Car Validity ---
        car = db.query(Car).filter(Car.id == car_id).first()
        if not car:
            raise HTTPException(status_code=404, detail="Car not found.")
        if car.status != "available":
            raise HTTPException(status_code=400, detail="Car is already sold.")

    else:
        raise HTTPException(status_code=400, detail="Either purchase_id or finance_id is required.")

    # --- Prevent Duplicate Delivery (any status) ---
    existing_delivery = db.query(DeliveryInfo).filter_by(
        user_id=user.id,
        car_id=car_id
    ).first()

    if existing_delivery and existing_delivery.status != "in_progress":
        raise HTTPException(status_code=400, detail="Delivery has already been submitted for this car.")

    # --- Validate Delivery Address ---
    if data.delivery_type == "home_delivery":
        if not all([data.name, data.email, data.phone_number, data.address]):
            raise HTTPException(status_code=400, detail="Contact/address info is required for home delivery")
        if not data.billing_delivery_same and not all([data.delivery_address, data.city, data.postal_code, data.country]):
            raise HTTPException(status_code=400, detail="Complete delivery address required when billing differs")
    elif data.delivery_type == "pickup" and not data.pickup_location_id:
        raise HTTPException(status_code=400, detail="Pickup location is required")

    # --- Upsert Delivery ---
    if existing_delivery:
        delivery = existing_delivery
        delivery.delivery_type = data.delivery_type
        delivery.name = data.name
        delivery.email = data.email
        delivery.pone_number = data.phone_number
        delivery.address = data.address
        delivery.billing_delivery_same = data.billing_delivery_same
        delivery.delivery_address = data.delivery_address
        delivery.city = data.city
        delivery.postal_code = data.postal_code
        delivery.country = data.country
        delivery.pickup_location_id = data.pickup_location_id
        delivery.total_price = total_price
        delivery.finance_id = finance_id
    else:
        delivery = DeliveryInfo(
            user_id=user.id,
            car_id=car_id,
            finance_id=finance_id,
            purchase_id=purchase_id,
            delivery_type=data.delivery_type,
            name=data.name,
            email=data.email,
            pone_number=data.phone_number,
            address=data.address,
            billing_delivery_same=data.billing_delivery_same,
            delivery_address=data.delivery_address,
            city=data.city,
            postal_code=data.postal_code,
            country=data.country,
            pickup_location_id=data.pickup_location_id,
            total_price=total_price,
            status="in_progress"
        )
        db.add(delivery)

    db.commit()
    db.refresh(delivery)

    return DeliveryResponse(
        id=delivery.id,
        user_id=delivery.user_id,
        car_id=delivery.car_id,
        finance_id=delivery.finance_id,
        purchase_id=delivery.purchase_id,
        delivery_type=delivery.delivery_type,
        name=delivery.name,
        email=delivery.email,
        phone_number=delivery.pone_number,
        address=delivery.address,
        billing_delivery_same=delivery.billing_delivery_same,
        delivery_address=delivery.delivery_address,
        city=delivery.city,
        postal_code=delivery.postal_code,
        country=delivery.country,
        pickup_location_id=delivery.pickup_location_id,
        total_price=delivery.total_price,
        created_at=delivery.created_at.isoformat(),
        updated_at=delivery.updated_at.isoformat()
    )

# @router.get("/get-latest-purchase")
# async def get_all_purchases(
#     db: Session = Depends(get_db),
#     user: User = Depends(get_current_user)
# ):
#     if not user:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authenticated")

#     purchases = db.query(Purchase).filter(user.id==Purchase.user_id).order_by(Purchase.created_at.desc()).first()
#     return purchases

@router.post("/purchase-addon", response_model=List[PurchaseAddonResponse])
async def assign_addons(
    purchase_id: Optional[int] = None,
    finance_id: Optional[int] = None,
    data: PurchaseAddonCreate = Depends(),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if not data.addon_ids:
        raise HTTPException(status_code=400, detail="No addon data provided")

    # Validate source context
    if purchase_id and finance_id:
        raise HTTPException(status_code=400, detail="Provide only one of purchase_id or finance_id.")

    if purchase_id:
        purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
        if not purchase or purchase.status != "finalized":
            raise HTTPException(status_code=400, detail="Car inspection not finalized.")
    elif finance_id:
        finance = db.query(FinanceApplication).filter(FinanceApplication.id == finance_id).first()
        if not finance or finance.status != "approved" or finance.flow_status != "in_progress":
            raise HTTPException(status_code=400, detail="Finance application not valid.")
    else:
        raise HTTPException(status_code=400, detail="Either purchase_id or finance_id is required.")

    # Add or update each add-on
    assigned = []
    for addon in data.addon_ids:
        query = db.query(PurchaseAddon).filter_by(
            addon_name=addon.addon_name,
            status="in_progress"
        )

        # Apply context to query
        if purchase_id:
            query = query.filter_by(purchase_id=purchase_id)
        else:
            query = query.filter_by(finance_id=finance_id)

        existing_addon = query.first()

        if existing_addon:
            existing_addon.addon_price = addon.addon_price
            db.commit()
            db.refresh(existing_addon)
            assigned.append(PurchaseAddonResponse(**existing_addon.__dict__))
        else:
            new_addon = PurchaseAddon(
                purchase_id=purchase_id,
                finance_id=finance_id,
                addon_name=addon.addon_name,
                addon_price=addon.addon_price,
                status="in_progress"
            )
            db.add(new_addon)
            db.commit()
            db.refresh(new_addon)
            assigned.append(PurchaseAddonResponse(**new_addon.__dict__))

    return assigned

@router.post("/checkout-delivery")
async def create_delivery_checkout_session(
    purchase_id: Optional[int] = None,
    finance_id: Optional[int] = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create Stripe Checkout Session for delivery + addons + finance down payment (if applicable)."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    if not purchase_id and not finance_id:
        raise HTTPException(status_code=400, detail="You must provide either purchase_id or finance_id.")
    if purchase_id and finance_id:
        raise HTTPException(status_code=400, detail="Provide only one of purchase_id or finance_id.")

    # Shared delivery info
    delivery = db.query(DeliveryInfo).filter(
        DeliveryInfo.user_id == user.id,
        DeliveryInfo.status == "in_progress"
    ).order_by(DeliveryInfo.updated_at.desc()).first()

    if not delivery:
        raise HTTPException(status_code=404, detail="No delivery info in progress.")

    delivery_total = delivery.total_price or 0.0
    car_id = None
    flow = ""
    reference_id = ""
    line_items = []

    # Finance flow
    if finance_id:
        finance = db.query(FinanceApplication).filter(FinanceApplication.id == finance_id).first()
        if not finance or finance.status != "approved" or finance.flow_status != "in_progress":
            raise HTTPException(status_code=400, detail="Finance application not valid.")
        flow = "finance"
        car_id = finance.car_id
        reference_id = car_id
        down_payment = finance.down_payment_amount or 0.0

        # Add delivery charge
        line_items.append({
            "price_data": {
                "currency": "eur",
                "product_data": {"name": "Home Delivery"},
                "unit_amount": int(delivery_total * 100),
            },
            "quantity": 1,
        })

        # Add add-ons (totaled or separate)
        addons = db.query(PurchaseAddon).filter(
            PurchaseAddon.finance_id == finance.id,
            PurchaseAddon.status == "in_progress"
        ).all()

        for addon in addons:
            line_items.append({
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": f"Addon: {addon.addon_name}"},
                    "unit_amount": int(addon.addon_price * 100),
                },
                "quantity": 1,
            })

        # Add down payment
        line_items.append({
            "price_data": {
                "currency": "eur",
                "product_data": {"name": "Finance Down Payment"},
                "unit_amount": int(down_payment * 100),
            },
            "quantity": 1,
        })

    # Purchase flow
    else:
        purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
        if not purchase or purchase.status != "finalized":
            raise HTTPException(status_code=400, detail="Car inspection not finalized.")
        flow = "purchase"
        car_id = purchase.car_id
        reference_id = car_id

        addons = db.query(PurchaseAddon).filter(
            PurchaseAddon.purchase_id == purchase.id,
            PurchaseAddon.status == "in_progress"
        ).all()

        # Add delivery
        line_items.append({
            "price_data": {
                "currency": "eur",
                "product_data": {"name": "Home Delivery"},
                "unit_amount": int(delivery_total * 100),
            },
            "quantity": 1,
        })

        for addon in addons:
            line_items.append({
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": f"Addon: {addon.addon_name}"},
                    "unit_amount": int(addon.addon_price * 100),
                },
                "quantity": 1,
            })

    # Load car (optional)
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found.")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{DOMAIN}/api/purchase/success-delivery?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{DOMAIN}/api/purchase/cancel",
            client_reference_id=reference_id,
            metadata={
                "user_id": str(user.id),
                "flow": flow,
                "car_id": str(car.id)
            },
        )
        return {"checkout_url": session.url}
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/success-delivery")
async def checkout_success_delivery(
    session_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Handle successful car inspection/delivery checkout and create unified Purchase."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status != "paid":
            raise HTTPException(status_code=400, detail="Payment not completed")

        car_id = session.client_reference_id
        user_id = int(session.metadata.get("user_id"))

        if user_id != user.id:
            raise HTTPException(status_code=403, detail="Unauthorized")

        # Fetch car
        car = db.query(Car).filter(Car.id == car_id).first()
        if not car:
            raise HTTPException(status_code=404, detail="Car not found")

        # --- Check existing finalized purchase ---
        existing_purchase = db.query(Purchase).filter_by(
            car_id=car_id,
            user_id=user.id,
            status="in_progress"
        ).order_by(Purchase.created_at.desc()).first()
        
        if existing_purchase:
            purchase = existing_purchase
            # Update existing purchase
            purchase.stripe_payment_id = session.payment_intent
            purchase.status = "finalized"
        else:
            purchase_application = db.query(Purchase).filter_by(
                car_id=car_id,
                user_id=user_id,
                status="finalized",
            ).first()

            delivery = db.query(DeliveryInfo).filter_by(
                    user_id=user.id,
                    car_id=car_id,
                    status="in_progress"
                ).first()
            delivery_total = delivery.total_price if delivery else 0.0

            addons = db.query(PurchaseAddon).filter_by(
                purchase_id=purchase_application.id,
                status="in_progress"
            ).all()
            addons_total = sum(addon.addon_price or 0.0 for addon in addons)

            total_price = delivery_total + addons_total
            print(total_price)

            # Create new purchase
            purchase = Purchase(
                user_id=user_id,
                car_id=car_id,
                total_price=total_price,
                stripe_payment_id=session.payment_intent,
                status="finalized",
            )
            db.add(purchase)

        # Try finance application
        finance_application = db.query(FinanceApplication).filter_by(
            car_id=car_id,
            user_id=user_id,
            status="approved",
            flow_status="in_progress"
        ).first()
        
        is_financed = False
        if finance_application:
            is_financed = True
            down_payment = finance_application.down_payment_amount or 0.0

            delivery = db.query(DeliveryInfo).filter_by(
                user_id=user.id,
                car_id=car_id,
                status="in_progress"
            ).first()
            delivery_total = delivery.total_price if delivery else 0.0

            addons = db.query(PurchaseAddon).filter_by(
                finance_id=finance_application.id,
                status="in_progress"
            ).all()
            addons_total = sum(addon.addon_price or 0.0 for addon in addons)

            total_price = delivery_total + addons_total + down_payment
            
            # Update purchase with finance info
            purchase.total_price = total_price

        # Flush to get the purchase ID before updating related records
        db.flush()

        # Mark car as sold
        car.status = "sold"

        # Finalize related records
        if finance_application:
            db.query(FinanceApplication).filter_by(
                user_id=user.id, 
                flow_status="in_progress"
            ).update({"flow_status": "finalized"})
        
        db.query(DeliveryInfo).filter_by(
            user_id=user.id, 
            status="in_progress"
        ).update({"status": "finalized"})
        
        # Update PurchaseAddon status - Fixed logic
        if is_financed and finance_application:
            # For financed purchases, update addons linked to finance application
            addons_to_update = db.query(PurchaseAddon).filter_by(
                finance_id=finance_application.id,
                status="in_progress"
            ).all()
            
            logger.info(f"Found {len(addons_to_update)} financed addons to update for finance_id: {finance_application.id}")
            
            updated_count = db.query(PurchaseAddon).filter_by(
                finance_id=finance_application.id,
                status="in_progress"
            ).update({"status": "finalized"}, synchronize_session=False)
            
            logger.info(f"Updated {updated_count} financed addons to finalized status")
        else:
            # For non-financed purchases, update addons linked to purchase
            addons_to_update = db.query(PurchaseAddon).filter_by(
                purchase_id=purchase_application.id,
                status="in_progress"
            ).all()
            
            logger.info(f"Found {len(addons_to_update)} purchase addons to update for purchase_id: {purchase.id}")
            
            updated_count = db.query(PurchaseAddon).filter_by(
                purchase_id=purchase_application.id,
                status="in_progress"
            ).update({"status": "finalized"}, synchronize_session=False)
            
            logger.info(f"Updated {updated_count} purchase addons to finalized status")

        db.commit()

        logger.info(f"[Purchase Success] Purchase #{purchase.id} completed for user {user_id} (finance={is_financed})")

        return JSONResponse(
            status_code=200,
            content={
            "message": "Purchase completed successfully.",
            "purchase_id": purchase.id,
            "car_id": car_id,
            "is_financed": is_financed,
            "total_price": purchase.total_price,
            "stripe_payment_id": session.payment_intent
            }
        )

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# For admin
@router.get("/admin/finance/applications", response_model=List[FinanceApplicationResponse])
async def get_finance_applications(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user or not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    
    applications = db.query(FinanceApplication).all()

    return [
        FinanceApplicationResponse(
            id=app.id,
            user_id=app.user_id,
            car_id=app.car_id,
            name=app.name,
            surname=app.surname,
            telephone_number=app.telephone_number,
            email=app.email,
            identification_number=app.identification_number,
            date_of_birth=app.date_of_birth,
            loan_type=app.loan_type,
            apr=app.apr,
            interest_rate=app.interest_rate,
            payback_period_months=app.payback_period_months,
            down_payment_percent=app.down_payment_percent,
            down_payment_amount=app.down_payment_amount,
            last_payment_percent=app.last_payment_percent,
            last_payment_amount=app.last_payment_amount,
            monthly_installment=app.monthly_installment,
            status=app.status,
            created_at=app.created_at.isoformat(),
            updated_at=app.updated_at.isoformat()
        )
        for app in applications
    ]
    
@router.patch("/admin/finance/applications/{id}/status", response_model=FinanceApplicationResponse)
async def update_finance_status(
    id: int,
    data: FinanceApplicationUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user or not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    
    application = db.query(FinanceApplication).filter(FinanceApplication.id == id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    application.status = data.status
    db.commit()
    db.refresh(application)
    
    logger.info(f"Finance application updated: id={id}, status={data.status}")
    return FinanceApplicationResponse(
        id=application.id,
        user_id=application.user_id,
        car_id=application.car_id,
        name=application.name,
        surname=application.surname,
        telephone_number=application.telephone_number,
        email=application.email,
        identification_number=application.identification_number,
        date_of_birth=application.date_of_birth,
        loan_type=application.loan_type,
        apr=application.apr,
        interest_rate=application.interest_rate,
        payback_period_months=application.payback_period_months,
        down_payment_percent=application.down_payment_percent,
        down_payment_amount=application.down_payment_amount,
        last_payment_percent=application.last_payment_percent,
        last_payment_amount=application.last_payment_amount,
        monthly_installment=application.monthly_installment,
        status=application.status,
        created_at=application.created_at.isoformat(),
        updated_at=application.updated_at.isoformat()
    )

@router.get("/admin/bank-transfer/data", response_model=List[BankTransferResponse])
async def get_bank_transfer_data(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user or not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    
    bank_infos = db.query(BankTransferInfo).all()
    return [
        BankTransferResponse(
            id=info.id,
            user_id=info.user_id,
            car_id=info.car_id,
            name=info.name,
            surname=info.surname,
            telephone_number=info.telephone_number,
            birth_date=info.birth_date,
            billing_address_street=info.billing_address_street,
            billing_address_house_number=info.billing_address_house_number,
            billing_address_postal_code=info.billing_address_postal_code,
            billing_address_city=info.billing_address_city,
            billing_address_country=info.billing_address_country,
            is_company=info.is_company,
            is_vat_payer=info.is_vat_payer,
            company_id=info.company_id,
            company_name=info.company_name,
            created_at=info.created_at.isoformat()
        )
        for info in bank_infos
    ]

# For user
# @router.get("/purchase-details-user")
# async def get_purchase_details_user(
#     user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     if not user:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

#     # --- Latest In-Progress Finance Application ---
#     app = db.query(FinanceApplication).filter(
#         FinanceApplication.user_id == user.id,
#         FinanceApplication.flow_status == "in_progress"
#     ).order_by(FinanceApplication.created_at.desc()).first()

#     finance_applications = [
#         FinanceApplicationResponse(
#             id=app.id,
#             user_id=app.user_id,
#             car_id=app.car_id,
#             name=app.name,
#             surname=app.surname,
#             telephone_number=app.telephone_number,
#             email=app.email,
#             identification_number=app.identification_number,
#             date_of_birth=app.date_of_birth,
#             status=app.status,
#             created_at=app.created_at.isoformat(),
#             updated_at=app.updated_at.isoformat()
#         )
#     ] if app else [
#         FinanceApplicationResponse(
#             id=0,
#             user_id=user.id,
#             car_id="N/A",
#             name=user.username,
#             surname="Unknown",
#             telephone_number="Not provided",
#             email=user.email,
#             identification_number="N/A",
#             date_of_birth="1900-01-01",
#             status="pending",
#             created_at="0000-00-00T00:00:00",
#             updated_at="0000-00-00T00:00:00"
#         )
#     ]

#     # --- Latest In-Progress Bank Transfer Info ---
#     info = db.query(BankTransferInfo).filter(
#         BankTransferInfo.user_id == user.id,
#         BankTransferInfo.status == "in_progress"
#     ).order_by(BankTransferInfo.created_at.desc()).first()

#     all_bank_infos = [
#         BankTransferResponse(
#             id=info.id,
#             user_id=info.user_id,
#             car_id=info.car_id,
#             name=info.name,
#             surname=info.surname,
#             telephone_number=info.telephone_number,
#             birth_date=info.birth_date,
#             billing_address_street=info.billing_address_street,
#             billing_address_house_number=info.billing_address_house_number,
#             billing_address_postal_code=info.billing_address_postal_code,
#             billing_address_city=info.billing_address_city,
#             billing_address_country=info.billing_address_country,
#             is_company=info.is_company,
#             is_vat_payer=info.is_vat_payer,
#             company_id=info.company_id,
#             company_name=info.company_name,
#             created_at=info.created_at.isoformat()
#         )
#     ] if info else [
#         BankTransferResponse(
#             id=0,
#             user_id=user.id,
#             car_id="N/A",
#             name=user.username,
#             surname="Unknown",
#             telephone_number="Not provided",
#             birth_date="1900-01-01",
#             billing_address_street="N/A",
#             billing_address_house_number="-",
#             billing_address_postal_code="00000",
#             billing_address_city="Unknown",
#             billing_address_country="Unknown",
#             is_company=False,
#             is_vat_payer=False,
#             company_id=None,
#             company_name=None,
#             created_at="0000-00-00T00:00:00"
#         )
#     ]

#     # --- Latest In-Progress Delivery Info ---
#     delivery = db.query(DeliveryInfo).filter(
#         DeliveryInfo.user_id == user.id,
#         DeliveryInfo.status == "in_progress"
#     ).order_by(DeliveryInfo.created_at.desc()).first()

#     delivery_info = [{
#         "id": delivery.id,
#         "user_id": delivery.user_id,
#         "car_id": delivery.car_id,
#         "delivery_type": delivery.delivery_type,
#         "name": delivery.name,
#         "email": delivery.email,
#         "phone_number": delivery.pone_number,
#         "address": delivery.address,
#         "billing_delivery_same": delivery.billing_delivery_same,
#         "delivery_address": delivery.delivery_address,
#         "city": delivery.city,
#         "postal_code": delivery.postal_code,
#         "country": delivery.country,
#         "pickup_location_id": delivery.pickup_location_id,
#         "total_price": delivery.total_price,
#         "created_at": delivery.created_at.isoformat(),
#         "updated_at": delivery.updated_at.isoformat()
#     }] if delivery else []

#     # --- Latest In-Progress Purchase & Add-ons ---
#     latest_purchase = db.query(Purchase).filter(
#         Purchase.user_id == user.id,
#         Purchase.status == "in_progress"
#     ).order_by(Purchase.created_at.desc()).first()

#     service_addons = []
#     if latest_purchase:
#         addon_entries = db.query(PurchaseAddon).filter(
#             PurchaseAddon.purchase_id == latest_purchase.id,
#             PurchaseAddon.status == "in_progress"
#         ).all()

#         for addon in addon_entries:
#             service_addons.append({
#                 "id": addon.id,
#                 "purchase_id": addon.purchase_id,
#                 "addon_name": addon.addon_name,
#                 "addon_price": addon.addon_price,
#                 "status": addon.status,
#                 "created_at": addon.created_at.isoformat()
#             })

#     return {
#         "finance_applications": finance_applications,
#         "bank_infos": all_bank_infos,
#         "delivery_info": delivery_info,
#         "service_addons": service_addons
#     }

@router.get("/purchase-details-user")
async def get_purchase_details_user(
    car_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    # --- Finance Application ---
    app = db.query(FinanceApplication).filter(
        FinanceApplication.user_id == user.id,
        FinanceApplication.car_id == car_id,
        FinanceApplication.flow_status == "in_progress"
    ).first()

    finance_applications = [
        FinanceApplicationResponse(
            id=app.id,
            user_id=app.user_id,
            car_id=app.car_id,
            name=app.name,
            surname=app.surname,
            telephone_number=app.telephone_number,
            email=app.email,
            identification_number=app.identification_number,
            date_of_birth=app.date_of_birth,
            loan_type=app.loan_type,
            apr=app.apr,
            interest_rate=app.interest_rate,
            payback_period_months=app.payback_period_months,
            down_payment_percent=app.down_payment_percent,
            down_payment_amount=app.down_payment_amount,
            last_payment_percent=app.last_payment_percent,
            last_payment_amount=app.last_payment_amount,
            monthly_installment=app.monthly_installment,
            status=app.status,
            created_at=app.created_at.isoformat(),
            updated_at=app.updated_at.isoformat()
        )
    ] if app else []

    # --- Bank Transfer Info ---
    info = db.query(BankTransferInfo).filter(
        BankTransferInfo.user_id == user.id,
        BankTransferInfo.car_id == car_id,
        BankTransferInfo.status == "in_progress"
    ).order_by(BankTransferInfo.created_at.desc()).first()

    all_bank_infos = [
        BankTransferResponse(
            id=info.id,
            user_id=info.user_id,
            car_id=info.car_id,
            name=info.name,
            surname=info.surname,
            telephone_number=info.telephone_number,
            birth_date=info.birth_date,
            billing_address_street=info.billing_address_street,
            billing_address_house_number=info.billing_address_house_number,
            billing_address_postal_code=info.billing_address_postal_code,
            billing_address_city=info.billing_address_city,
            billing_address_country=info.billing_address_country,
            is_company=info.is_company,
            is_vat_payer=info.is_vat_payer,
            company_id=info.company_id,
            company_name=info.company_name,
            status=info.status,
            created_at=info.created_at.isoformat()
        )
    ] if info else []

    # --- Delivery Info ---
    delivery = db.query(DeliveryInfo).filter(
        DeliveryInfo.user_id == user.id,
        DeliveryInfo.car_id == car_id,
        DeliveryInfo.status == "in_progress"
    ).order_by(DeliveryInfo.created_at.desc()).first()

    delivery_info = [dict(
        id=delivery.id,
        user_id=delivery.user_id,
        car_id=delivery.car_id,
        purchase_id=delivery.purchase_id,
        finance_id=delivery.finance_id,
        delivery_type=delivery.delivery_type,
        name=delivery.name,
        email=delivery.email,
        phone_number=delivery.pone_number,
        address=delivery.address,
        billing_delivery_same=delivery.billing_delivery_same,
        delivery_address=delivery.delivery_address,
        city=delivery.city,
        postal_code=delivery.postal_code,
        country=delivery.country,
        pickup_location_id=delivery.pickup_location_id,
        total_price=delivery.total_price,
        created_at=delivery.created_at.isoformat(),
        updated_at=delivery.updated_at.isoformat()
    )] if delivery else []

    # --- Add-ons ---
    latest_purchase = db.query(Purchase).filter(
        Purchase.user_id == user.id,
        Purchase.car_id == car_id,
        Purchase.status == "in_progress"
    ).order_by(Purchase.created_at.desc()).first()

    service_addons = []
    if latest_purchase:
        addon_entries = db.query(PurchaseAddon).filter(
            PurchaseAddon.purchase_id == latest_purchase.id,
            PurchaseAddon.status == "in_progress"
        ).all()
        for addon in addon_entries:
            service_addons.append(dict(
                id=addon.id,
                purchase_id=addon.purchase_id,
                addon_name=addon.addon_name,
                addon_price=addon.addon_price,
                status=addon.status,
                created_at=addon.created_at.isoformat()
            ))

    return {
        "finance_applications": finance_applications,
        "bank_infos": all_bank_infos,
        "delivery_info": delivery_info,
        "service_addons": service_addons
    }


@router.get("/purchase/complete")
async def purchase_complete():
    """Handle purchase completion page."""
    return {"message": "Purchase completed successfully! Thank you for your order."}

@router.get("/purchase/canceled")
async def purchase_canceled():
    """Handle purchase cancellation page."""
    return {"message": "Purchase was canceled. Please try again or contact support."}



@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle Stripe webhook for payment confirmation."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook error")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        if session["payment_status"] == "paid":
            car_id = session["client_reference_id"]
            user_id = int(session["metadata"]["user_id"])
            car = db.query(Car).filter(Car.id == car_id).first()
            if car and car.status == "available":
                purchase = Purchase(
                    user_id=user_id,
                    car_id=car_id,
                    total_price=car.total_price,
                    stripe_payment_id=session["payment_intent"]
                )
                db.add(purchase)
                car.status = "sold"
                db.commit()
                logger.info(f"Webhook: Purchase completed for car {car_id}")

    return {"status": "success"}