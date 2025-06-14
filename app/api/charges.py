# app/api/charges.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.sqlite import get_db
from app.models.charges import AdditionalCharges
from app.models.car import Car
from app.models.user import User
from app.api.auth import get_current_user
from app.schemas.charges import ChargesResponse, ChargesUpdate
from typing import Optional
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

def calculate_delivery_charge(car_country: str, user_zipcode: str) -> float:
    """Placeholder for delivery charge calculation based on distance."""
    if not user_zipcode or not car_country:
        return 0.0
    # Mock distance-based charge (e.g., €1 per km)
    distance_km = 100  # Placeholder distance
    return distance_km * 1.0

@router.get("", response_model=ChargesResponse)
async def get_charges(
    car_id: str,
    zipcode: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all charge components for a car."""
    # Fetch car
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    # Fetch or create default charges
    charges = db.query(AdditionalCharges).first()
    if not charges:
        logger.warning("No charges found, using default values")
        charges = AdditionalCharges(
            vat=22.0,
            services_total=1111.0,
            car_inspection=119.0,
            delivery=0.0,
            registration_tax=293.0,
            pre_delivery_prep=699.0,
            fuel=0.0,
            extended_warranty=0.0
        )
        db.add(charges)
        db.commit()
        db.refresh(charges)

    # Calculate delivery charge
    delivery = calculate_delivery_charge(car.country, zipcode) if zipcode else 0.0

    # Calculate VAT
    vat_percentage = charges.vat
    price_without_vat = car.price / (1 + vat_percentage / 100)
    vat_amount = car.price - price_without_vat

    # Calculate total price
    total_price = (
        car.price +
        vat_amount +
        charges.services_total +
        charges.car_inspection +
        delivery +
        charges.registration_tax +
        charges.pre_delivery_prep +
        charges.fuel +
        charges.extended_warranty
    )

    return ChargesResponse(
        car_price=car.price,
        price_without_vat=round(price_without_vat, 2),
        vat_percentage=vat_percentage,
        services_total=charges.services_total,
        car_inspection=charges.car_inspection,
        delivery=delivery,
        registration_tax=charges.registration_tax,
        pre_delivery_prep=charges.pre_delivery_prep,
        fuel=charges.fuel,
        extended_warranty=charges.extended_warranty,
        total_price=round(total_price, 2)
    )

@router.patch("", response_model=ChargesResponse)
async def update_charges(
    update_data: ChargesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update charge values (admin only)."""
    if not current_user or not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    charges = db.query(AdditionalCharges).first()
    if not charges:
        logger.warning("No charges found, creating with default values")
        charges = AdditionalCharges(
            vat=22.0,
            services_total=1111.0,
            car_inspection=119.0,
            delivery=0.0,
            registration_tax=293.0,
            pre_delivery_prep=699.0,
            fuel=0.0,
            extended_warranty=0.0
        )
        db.add(charges)
        db.commit()
        db.refresh(charges)

    # Update fields if provided
    update_fields = update_data.dict(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(charges, field, value)

    db.commit()
    db.refresh(charges)

    # Return updated charges (using car_id=None for defaults)
    return await get_charges(car_id=None, zipcode=None, db=db)