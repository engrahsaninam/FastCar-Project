 
from fastapi import APIRouter, Query, HTTPException, Depends, Request
from app.api.auth import get_current_user
from app.models.user import User
from app.database.sqlite import get_db
from sqlalchemy.orm import Session
from typing import Optional, List
import json

from app.database.mysql import execute_query
from app.schemas.car import CarFilterParams, CarResponse, PaginatedCarResponse

router = APIRouter()

@router.get("/", response_model=PaginatedCarResponse)
async def get_cars(
    brand: Optional[str] = None,
    model: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    min_mileage: Optional[float] = None,
    max_mileage: Optional[float] = None,
    fuel: Optional[str] = None,
    gear: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    """Get paginated list of cars with filters"""
    query = "SELECT * FROM cars WHERE 1=1"
    params = []
    
    # Apply filters
    if brand:
        query += " AND brand = %s"
        params.append(brand)
    
    if model:
        query += " AND model = %s"
        params.append(model)
        
    if min_price:
        query += " AND price >= %s"
        params.append(min_price)
        
    if max_price:
        query += " AND price <= %s"
        params.append(max_price)
        
    if min_year:
        query += " AND FLOOR(age) >= %s"
        params.append(min_year)
        
    if max_year:
        query += " AND FLOOR(age) <= %s"
        params.append(max_year)
        
    if min_mileage is not None:
        query += " AND mileage >= %s"
        params.append(min_mileage)
        
    if max_mileage is not None:
        query += " AND mileage <= %s"
        params.append(max_mileage)
        
    if fuel:
        query += " AND fuel = %s"
        params.append(fuel)
        
    if gear:
        query += " AND gear = %s"
        params.append(gear)
    
    # Count total for pagination
    count_query = f"SELECT COUNT(*) as total FROM ({query}) as filtered_cars"
    count_result = await execute_query(count_query, params)
    total = count_result[0]['total'] if count_result else 0
    
    # Add pagination
    query += " LIMIT %s OFFSET %s"
    offset = (page - 1) * limit
    params.extend([limit, offset])
    
    # Get cars
    cars = await execute_query(query, params)
    
    return {
        "data": [CarResponse(**car) for car in cars],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }

@router.get("/search", response_model=PaginatedCarResponse)
async def search_cars(
    request: Request,
    brand: Optional[str] = None,
    model: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    min_mileage: Optional[float] = None,
    max_mileage: Optional[float] = None,
    fuel: Optional[str] = None,
    gear: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Search cars with all filters and save to history if user is logged in"""
    # Extract all query parameters
    search_params = dict(request.query_params)
    
    # Get the search results by calling the existing get_cars function
    result = await get_cars(
        brand, model, min_price, max_price, min_year, max_year, 
        min_mileage, max_mileage, fuel, gear, page, limit
    )
    
    # Save search to history if user is logged in
    if current_user:
        from app.models.user import SearchHistory
        search_history = SearchHistory(
            user_id=current_user.id,
            search_params=json.dumps(search_params)
        )
        db.add(search_history)
        db.commit()
    
    return result

@router.get("/{car_id}", response_model=CarResponse)
async def get_car(car_id: str):
    """Get a single car by ID"""
    query = "SELECT * FROM cars WHERE id = %s"
    result = await execute_query(query, [car_id])
    
    if not result:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return CarResponse(**result[0])

@router.get("/brands/", response_model=List[str])
async def get_brands():
    """Get list of all car brands"""
    query = "SELECT DISTINCT brand FROM cars ORDER BY brand"
    result = await execute_query(query)
    return [brand["brand"] for brand in result]

@router.get("/models/", response_model=List[str])
async def get_models(brand: Optional[str] = None):
    """Get list of car models, optionally filtered by brand"""
    if brand:
        query = "SELECT DISTINCT model FROM cars WHERE brand = %s ORDER BY model"
        result = await execute_query(query, [brand])
    else:
        query = "SELECT DISTINCT model FROM cars ORDER BY model"
        result = await execute_query(query)
        
    return [model["model"] for model in result]

@router.get("/{car_id}/similar", response_model=List[CarResponse])
async def get_similar_cars(car_id: str, limit: int = Query(5, ge=1, le=20)):
    """Get similar cars based on a specific car"""
    # First get the car
    car_query = "SELECT * FROM cars WHERE id = %s"
    car_result = await execute_query(car_query, [car_id])
    
    if not car_result:
        raise HTTPException(status_code=404, detail="Car not found")
    
    car = car_result[0]
    
    # Find similar cars
    similar_query = """
    SELECT * FROM cars 
    WHERE brand = %s 
        AND model = %s 
        AND id != %s 
    ORDER BY ABS(price - %s) 
    LIMIT %s
    """
    params = [car['brand'], car['model'], car_id, car['price'], limit]
    
    similar_cars = await execute_query(similar_query, params)
    return [CarResponse(**similar_car) for similar_car in similar_cars]