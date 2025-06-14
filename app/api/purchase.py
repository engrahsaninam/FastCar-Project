#app/api/purchase.py
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel, validator
import re
import stripe
from app.config import STRIPE_SECRET_KEY, DOMAIN
from app.database.sqlite import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.car import Car
from app.models.purchase import FinanceApplication, BankTransferInfo, Purchase
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter(tags=["purchase"])

# Pydantic Schemas
class FinanceApplicationCreate(BaseModel):
    car_id: str
    name: str
    surname: str
    telephone_number: str
    email: str
    identification_number: str
    date_of_birth: str

    @validator("telephone_number")
    def validate_phone(cls, v):
        if not re.match(r"^\+\d{1,3}\d{6,14}$", v):
            raise ValueError("Invalid phone number format, e.g., +43...")
        return v

    @validator("email")
    def validate_email(cls, v):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email format")
        return v

    @validator("date_of_birth")
    def validate_dob(cls, v):
        if not re.match(r"^\d{2}/\d{2}/\d{4}$", v):
            raise ValueError("Invalid date format, use DD/MM/YYYY")
        return v

class FinanceApplicationResponse(BaseModel):
    id: int
    user_id: int
    car_id: str
    name: str
    surname: str
    telephone_number: str
    email: str
    identification_number: str
    date_of_birth: str
    status: str
    created_at: str
    updated_at: str

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

    @validator("telephone_number")
    def validate_phone(cls, v):
        if not re.match(r"^\+\d{1,3}\d{6,14}$", v):
            raise ValueError("Invalid phone number format, e.g., +39...")
        return v

    @validator("birth_date")
    def validate_birth_date(cls, v):
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
    id: int
    user_id: int
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
    is_company: bool
    is_vat_payer: Optional[bool]
    company_id: Optional[str]
    company_name: Optional[str]
    created_at: str

# Finance Endpoints
@router.post("/finance/apply", response_model=FinanceApplicationResponse)
async def apply_finance(
    data: FinanceApplicationCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    
    application = FinanceApplication(
        user_id=user.id,
        car_id=data.car_id,
        name=data.name,
        surname=data.surname,
        telephone_number=data.telephone_number,
        email=data.email,
        identification_number=data.identification_number,
        date_of_birth=data.date_of_birth,
        status="in_progress"
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    
    logger.info(f"Finance application created: user_id={user.id}, car_id={data.car_id}")
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
        status=application.status,
        created_at=application.created_at.isoformat(),
        updated_at=application.updated_at.isoformat()
    )

@router.get("/finance/applications", response_model=List[FinanceApplicationResponse])
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
            status=app.status,
            created_at=app.created_at.isoformat(),
            updated_at=app.updated_at.isoformat()
        )
        for app in applications
    ]

@router.patch("/finance/applications/{id}/status", response_model=FinanceApplicationResponse)
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
        status=application.status,
        created_at=application.created_at.isoformat(),
        updated_at=application.updated_at.isoformat()
    )

@router.get("/finance/my-application", response_model=Optional[FinanceApplicationResponse])
async def get_my_finance_application(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    
    application = db.query(FinanceApplication).filter(FinanceApplication.user_id == user.id).first()
    if not application:
        return None
    
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
        status=application.status,
        created_at=application.created_at.isoformat(),
        updated_at=application.updated_at.isoformat()
    )

# Bank Transfer Endpoints
@router.post("/bank-transfer/submit", response_model=BankTransferResponse)
async def submit_bank_transfer(
    data: BankTransferCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    
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
        company_name=data.company_name if data.is_company else None
    )
    db.add(bank_info)
    db.commit()
    db.refresh(bank_info)
    
    logger.info(f"Bank transfer info submitted: user_id={user.id}, car_id={data.car_id}")
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

@router.get("/bank-transfer/data", response_model=List[BankTransferResponse])
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

@router.get("/bank-transfer/my-data", response_model=Optional[BankTransferResponse])
async def get_my_bank_transfer_data(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    
    bank_info = db.query(BankTransferInfo).filter(BankTransferInfo.user_id == user.id).first()
    if not bank_info:
        return None
    
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
    car = db.query(Car).filter(Car.id == car_id).first()
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

@router.get("/success")
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
        car = db.query(Car).filter(Car.id == car_id).first()
        if not car:
            raise HTTPException(status_code=404, detail="Car not found")
        if car.status != "available":
            raise HTTPException(status_code=400, detail="Car is not available")

        # Create purchase record
        purchase = Purchase(
            user_id=user_id,
            car_id=car_id,
            total_price=car.total_price,
            stripe_payment_id=session.payment_intent
        )
        db.add(purchase)
        car.status = "sold"
        db.commit()

        logger.info(f"Purchase completed for car {car_id} by user {user_id}")
        return RedirectResponse(url="/purchase/complete")  # Adjust to frontend
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/cancel")
async def checkout_cancel():
    """Handle canceled checkout."""
    return RedirectResponse(url="/purchase/canceled")  # Adjust to frontend


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