 
from fastapi import APIRouter
from typing import Dict, List

from app.database.mysql import execute_query

router = APIRouter()

@router.get("/years", response_model=Dict[str, int])
async def get_years_range():
    """Get min and max available years for filtering"""
    query = """
    SELECT 
        FLOOR(MAX(2025 - FLOOR(age))) as max_year, 
        FLOOR(MIN(2025 - FLOOR(age))) as min_year 
    FROM cars
    """
    result = await execute_query(query)
    
    if not result or result[0]["min_year"] is None or result[0]["max_year"] is None:
        return {"min_year": 2000, "max_year": 2025}
    
    # Ensure sensible values
    min_year = max(1950, int(result[0]["min_year"]))
    max_year = min(2025, int(result[0]["max_year"]))
    
    return {"min_year": min_year, "max_year": max_year}

@router.get("/prices", response_model=Dict[str, float])
async def get_price_range():
    """Get min and max prices for filtering"""
    query = "SELECT MIN(price) as min_price, MAX(price) as max_price FROM cars"
    result = await execute_query(query)
    return result[0] if result else {"min_price": 0, "max_price": 100000}

@router.get("/mileage", response_model=Dict[str, float])
async def get_mileage_range():
    """Get min and max mileage for filtering"""
    query = "SELECT MIN(mileage) as min_mileage, MAX(mileage) as max_mileage FROM cars"
    result = await execute_query(query)
    return result[0] if result else {"min_mileage": 0, "max_mileage": 300000}

@router.get("/fuel-types", response_model=List[str])
async def get_fuel_types():
    """Get available fuel types"""
    query = "SELECT DISTINCT fuel FROM cars WHERE fuel IS NOT NULL ORDER BY fuel"
    result = await execute_query(query)
    return [item["fuel"] for item in result]

@router.get("/transmission-types", response_model=List[str])
async def get_transmission_types():
    """Get available transmission types"""
    query = "SELECT DISTINCT gear FROM cars WHERE gear IS NOT NULL ORDER BY gear"
    result = await execute_query(query)
    return [item["gear"] for item in result]

@router.get("/countries", response_model=List[str])
async def get_countries():
    """Get available countries"""
    query = "SELECT DISTINCT country FROM cars WHERE country IS NOT NULL ORDER BY country"
    result = await execute_query(query)
    return [item["country"] for item in result]