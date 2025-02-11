from fastapi import APIRouter
from typing import List
from fastapi import APIRouter, Query
from typing import List, Optional

from pydantic import BaseModel

router = APIRouter()

cars = [
    {"id": 1, "name": "Toyota Corolla", "price": 20000},
    {"id": 2, "name": "Honda Civic", "price": 22000},
]

@router.get("/")
def get_cars():
    return {"cars": cars}

@router.get("/car")
def get_car(id: int):
    car = next((car for car in cars if car["id"] == id), None)
    if car:
        return car
    return {"error": "Car not found"}


# Sample car data (Replace with a database later)
cars = [
    {
        "id": 1, "name": "Toyota Corolla", "price": 20000, "registration": 2018,
        "mileage": 50000, "transmission": "Automatic", "fuel": "Petrol",
        "electric": False, "hybrid": "None", "power_hp": 120, "vehicle_type": "Sedan",
        "drive_type": "2WD", "color": "Black", "features": ["Air conditioning", "Cruise control"]
    },
    {
        "id": 2, "name": "Honda Civic", "price": 22000, "registration": 2020,
        "mileage": 30000, "transmission": "Manual", "fuel": "Diesel",
        "electric": False, "hybrid": "Plug-in hybrid", "power_hp": 150, "vehicle_type": "Hatchback",
        "drive_type": "2WD", "color": "Red", "features": ["LED headlights", "Navigation system"]
    },
    {
        "id": 3, "name": "Tesla Model 3", "price": 45000, "registration": 2022,
        "mileage": 10000, "transmission": "Automatic", "fuel": "Electric",
        "electric": True, "hybrid": "None", "power_hp": 300, "vehicle_type": "Sedan",
        "drive_type": "4WD", "color": "White", "features": ["Cruise control", "Air conditioning"]
    }
]

@router.get("/search")
def search_cars(
    make: Optional[str] = Query(None, description="Car brand or model"),
    min_price: Optional[int] = Query(None, description="Minimum price (€)"),
    max_price: Optional[int] = Query(None, description="Maximum price (€)"),
    min_registration: Optional[int] = Query(None, description="Minimum registration year"),
    max_registration: Optional[int] = Query(None, description="Maximum registration year"),
    min_mileage: Optional[int] = Query(None, description="Minimum mileage"),
    max_mileage: Optional[int] = Query(None, description="Maximum mileage"),
    transmission: Optional[str] = Query(None, description="Transmission type (Automatic/Manual)"),
    fuel: Optional[str] = Query(None, description="Fuel type"),
    electric: Optional[bool] = Query(None, description="Filter electric cars"),
    hybrid: Optional[str] = Query(None, description="Hybrid type (Plug-in hybrid/Full hybrid)"),
    min_power: Optional[int] = Query(None, description="Minimum power in hp"),
    max_power: Optional[int] = Query(None, description="Maximum power in hp"),
    vehicle_type: Optional[str] = Query(None, description="Vehicle type"),
    drive_type: Optional[str] = Query(None, description="Drive type (2WD/4WD)"),
    color: Optional[str] = Query(None, description="Exterior color"),
    features: Optional[List[str]] = Query(None, description="List of required features"),
):
    """Search cars based on multiple filters."""
    
    filtered_cars = cars

    if make:
        filtered_cars = [car for car in filtered_cars if make.lower() in car["name"].lower()]
    if min_price is not None:
        filtered_cars = [car for car in filtered_cars if car["price"] >= min_price]
    if max_price is not None:
        filtered_cars = [car for car in filtered_cars if car["price"] <= max_price]
    if min_registration is not None:
        filtered_cars = [car for car in filtered_cars if car["registration"] >= min_registration]
    if max_registration is not None:
        filtered_cars = [car for car in filtered_cars if car["registration"] <= max_registration]
    if min_mileage is not None:
        filtered_cars = [car for car in filtered_cars if car["mileage"] >= min_mileage]
    if max_mileage is not None:
        filtered_cars = [car for car in filtered_cars if car["mileage"] <= max_mileage]
    if transmission:
        filtered_cars = [car for car in filtered_cars if car["transmission"].lower() == transmission.lower()]
    if fuel:
        filtered_cars = [car for car in filtered_cars if car["fuel"].lower() == fuel.lower()]
    if electric is not None:
        filtered_cars = [car for car in filtered_cars if car["electric"] == electric]
    if hybrid:
        filtered_cars = [car for car in filtered_cars if car["hybrid"].lower() == hybrid.lower()]
    if min_power is not None:
        filtered_cars = [car for car in filtered_cars if car["power_hp"] >= min_power]
    if max_power is not None:
        filtered_cars = [car for car in filtered_cars if car["power_hp"] <= max_power]
    if vehicle_type:
        filtered_cars = [car for car in filtered_cars if car["vehicle_type"].lower() == vehicle_type.lower()]
    if drive_type:
        filtered_cars = [car for car in filtered_cars if car["drive_type"].lower() == drive_type.lower()]
    if color:
        filtered_cars = [car for car in filtered_cars if car["color"].lower() == color.lower()]
    if features:
        filtered_cars = [car for car in filtered_cars if all(feature in car["features"] for feature in features)]
    
    return {"filtered_cars": filtered_cars}


from fastapi import APIRouter, HTTPException
from typing import Dict, List

router = APIRouter()

# Sample car data (This should later be connected to a real database)
cars = [
    {
        "id": 1,
        "name": "Toyota Corolla",
        "price": 20000,
        "registration": 2018,
        "mileage": 50000,
        "transmission": "Automatic",
        "fuel": "Petrol",
        "electric": False,
        "hybrid": "None",
        "power_hp": 120,
        "vehicle_type": "Sedan",
        "drive_type": "2WD",
        "color": "Black",
        "features": ["Air conditioning", "Cruise control", "LED headlights"],
        "how_it_works": "This car is imported from Japan with full service history.",
        "price_history": [
            {"date": "2023-01-01", "price": 22000},
            {"date": "2023-06-01", "price": 21000},
            {"date": "2024-01-01", "price": 20000},
        ],
        "price_map": [
            {"location": "Berlin", "price": 19500},
            {"location": "Paris", "price": 20500},
            {"location": "Madrid", "price": 20000},
        ],
        "financing": {
            "monthly_payment": 350,
            "loan_term": "60 months",
            "interest_rate": "3.5%",
        },
    },
    {
        "id": 2,
        "name": "Honda Civic",
        "price": 22000,
        "registration": 2020,
        "mileage": 30000,
        "transmission": "Manual",
        "fuel": "Diesel",
        "electric": False,
        "hybrid": "Plug-in hybrid",
        "power_hp": 150,
        "vehicle_type": "Hatchback",
        "drive_type": "2WD",
        "color": "Red",
        "features": ["Navigation system", "Cruise control", "Air conditioning"],
        "how_it_works": "This car is sourced locally and certified pre-owned.",
        "price_history": [
            {"date": "2023-01-01", "price": 23000},
            {"date": "2023-06-01", "price": 22500},
            {"date": "2024-01-01", "price": 22000},
        ],
        "price_map": [
            {"location": "London", "price": 21800},
            {"location": "Amsterdam", "price": 22000},
            {"location": "Rome", "price": 22500},
        ],
        "financing": {
            "monthly_payment": 370,
            "loan_term": "60 months",
            "interest_rate": "3.2%",
        },
    },
]

# ✅ Fetch all details for a specific car
@router.get("/{car_id}")
def get_car_details(car_id: int):
    car = next((car for car in cars if car["id"] == car_id), None)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car


# ✅ Fetch only the features of a car
@router.get("/{car_id}/features")
def get_car_features(car_id: int):
    car = next((car for car in cars if car["id"] == car_id), None)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"features": car["features"]}


# ✅ Fetch "How it works" details
@router.get("/{car_id}/how-it-works")
def get_car_how_it_works(car_id: int):
    car = next((car for car in cars if car["id"] == car_id), None)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"how_it_works": car["how_it_works"]}


# ✅ Fetch price history of a car
@router.get("/{car_id}/price-history")
def get_car_price_history(car_id: int):
    car = next((car for car in cars if car["id"] == car_id), None)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"price_history": car["price_history"]}


# ✅ Fetch price map of a car (location-based pricing)
@router.get("/{car_id}/price-map")
def get_car_price_map(car_id: int):
    car = next((car for car in cars if car["id"] == car_id), None)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"price_map": car["price_map"]}


# ✅ Fetch financing options for a car
@router.get("/{car_id}/financing")
def get_car_financing(car_id: int):
    car = next((car for car in cars if car["id"] == car_id), None)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"financing": car["financing"]}


# Simulated orders database
orders_db = []

# ✅ Model for Buying a Car
class BuyCarRequest(BaseModel):
    car_id: int
    car_name: str
    price_incl_services: float
    price_without_vat: float
    exchange_rate: float
    audit_fee: float
    additional_services: List[dict]
    total_price: float
    financing: Optional[dict]

# ✅ Buy Car Endpoint
@router.post("/buy")
def buy_car(order: BuyCarRequest):
    """
    Buy a car by providing details such as car ID, pricing, and additional services.
    """
    # Save the order
    orders_db.append(order.dict())

    return {
        "message": "Car purchase successful!",
        "order_id": len(orders_db),  # Order ID based on index
        "order_details": order
    }

@router.get("/orders")
def get_orders():
    """Retrieve all purchased cars"""
    return {"orders": orders_db}
