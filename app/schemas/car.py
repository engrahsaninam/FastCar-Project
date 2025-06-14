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
    vat: Optional[bool] = None
    power_min: Optional[int] = None
    power_max: Optional[int] = None
    body_type: Optional[str] = None
    colour: Optional[str] = None
    features: Optional[List[str]] = None

class CarResponse(BaseModel):
    id: str
    brand: str
    model: str
    version: Optional[str] = None
    price: float  # May include VAT if vat=true
    price_without_vat: Optional[float] = None  # Price excluding VAT
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
    CO2_emissions: Optional[str] = None
    engine_size: Optional[str] = None
    body_type: Optional[str] = None
    colour: Optional[str] = None
    features: Optional[Dict[str, List[str]]] = None
    total_price: Optional[float] = None
    
    class Config:
        from_attributes = True
    
    def __init__(self, **data):
        if isinstance(data.get('images'), str):
            try:
                data['images'] = json.loads(data['images'])
            except:
                data['images'] = []
                
        if isinstance(data.get('attrs'), str):
            try:
                data['attrs'] = json.loads(data['attrs'])
            except:
                data['attrs'] = {}
                
        if isinstance(data.get('features'), str):
            try:
                data['features'] = json.loads(data['features'])
            except:
                data['features'] = {}
                
        if 'age' in data and 'year' not in data:
            data['year'] = int(float(data['age']))
            
        super().__init__(**data)

class PaginatedCarResponse(BaseModel):
    data: List[CarResponse]
    total: int
    page: int
    limit: int
    pages: int