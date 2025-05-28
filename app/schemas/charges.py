from pydantic import BaseModel
from typing import Optional

class ChargesResponse(BaseModel):
    car_price: float
    price_without_vat: float
    vat_percentage: float
    services_total: float
    car_inspection: float
    delivery: Optional[float] = None
    registration_tax: float
    pre_delivery_prep: float
    fuel: float
    extended_warranty: float
    total_price: float

    class Config:
        from_attributes = True

class ChargesUpdate(BaseModel):
    vat: Optional[float] = None
    services_total: Optional[float] = None
    car_inspection: Optional[float] = None
    delivery: Optional[float] = None
    registration_tax: Optional[float] = None
    pre_delivery_prep: Optional[float] = None
    fuel: Optional[float] = None
    extended_warranty: Optional[float] = None