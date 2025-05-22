#app/schemas/car.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import json

class CarFilterParams(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_year: Optional[int] = None
    max_year: Optional[int] = None
    min_mileage: Optional[float] = None
    max_mileage: Optional[float] = None
    fuel: Optional[str] = None
    gear: Optional[str] = None
    vat_deduction: Optional[bool] = None
    power_min: Optional[int] = None
    power_max: Optional[int] = None

class CarResponse(BaseModel):
    id: str
    brand: str
    model: str
    version: Optional[str] = None
    price: float
    mileage: float
    age: float
    power: Optional[int] = None
    gear: Optional[str] = None
    fuel: Optional[str] = None
    country: Optional[str] = None
    zipcode: Optional[str] = None
    images: Optional[List[str]] = None
    url: Optional[str] = None
    attrs: Optional[Dict[str, Any]] = None
    year: int = Field(None)
    
    class Config:
        from_attributes = True
    
    def __init__(self, **data):
        # Convert images from JSON string if needed
        if isinstance(data.get('images'), str):
            try:
                data['images'] = json.loads(data['images'])
            except:
                data['images'] = []
                
        # Convert attrs from JSON string if needed
        if isinstance(data.get('attrs'), str):
            try:
                data['attrs'] = json.loads(data['attrs'])
            except:
                data['attrs'] = {}
                
        # Calculate year from age - the age field actually contains the manufacturing year
        # with a decimal component (e.g., 2021.25 for a car manufactured in 2021, first quarter)
        if 'age' in data and 'year' not in data:
            data['year'] = int(float(data['age']))
            
        super().__init__(**data)

class PaginatedCarResponse(BaseModel):
    data: List[CarResponse]
    total: int
    page: int
    limit: int
    pages: int