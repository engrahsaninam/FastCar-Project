# app/api/filters.py
from fastapi import APIRouter, Query
from typing import Dict, List, Optional

from app.database.mysql import execute_query
from app.utils.outlier_detection import detect_outliers

router = APIRouter()

@router.get("/years", response_model=Dict[str, int])
async def get_years_range(remove_outliers: bool = True):
    """Get min and max available years for filtering"""
    current_year = 2025  # Current year as reference
    
    if remove_outliers:
        # Get all car age data and remove outliers
        query = "SELECT age FROM cars WHERE age IS NOT NULL"
        result = await execute_query(query)
        
        if not result:
            return {"min_year": 2000, "max_year": current_year}
        
        # Remove outliers from the age data
        clean_data, _ = detect_outliers(result, numeric_columns=["age"])
        
        if not clean_data:
            return {"min_year": 2000, "max_year": current_year}
        
        # The age values in the database are actually the manufacturing year with decimal
        # For example, 2021.25 means the year 2021 (first quarter)
        years = [int(float(item["age"])) for item in clean_data]
        
        if not years:
            return {"min_year": 2000, "max_year": current_year}
            
        min_year = min(years)
        max_year = max(years)
    else:
        # Use a direct query to get the year values
        query = """
        SELECT 
            FLOOR(MIN(age)) as min_year,
            FLOOR(MAX(age)) as max_year
        FROM cars
        WHERE age IS NOT NULL
        """
        result = await execute_query(query, remove_outliers=False)
        
        if not result or result[0]["min_year"] is None or result[0]["max_year"] is None:
            return {"min_year": 2000, "max_year": current_year}
        
        min_year = int(result[0]["min_year"])
        max_year = int(result[0]["max_year"])
    
    # Ensure sensible values
    min_year = max(1950, min_year)
    max_year = min(current_year, max_year)
    
    return {"min_year": min_year, "max_year": max_year}

@router.get("/prices", response_model=Dict[str, float])
async def get_price_range(remove_outliers: bool = True):
    """Get min and max prices for filtering"""
    if remove_outliers:
        # Get all price data and remove outliers
        query = "SELECT price FROM cars WHERE price IS NOT NULL"
        result = await execute_query(query)
        
        if not result:
            return {"min_price": 0, "max_price": 100000}
        
        # Remove outliers from the price data
        clean_data, _ = detect_outliers(result, numeric_columns=["price"])
        
        if not clean_data:
            return {"min_price": 0, "max_price": 100000}
        
        # Calculate min and max prices from clean data
        min_price = min(float(item["price"]) for item in clean_data)
        max_price = max(float(item["price"]) for item in clean_data)
        
        return {"min_price": min_price, "max_price": max_price}
    else:
        # Use the original query without outlier removal
        query = "SELECT MIN(price) as min_price, MAX(price) as max_price FROM cars"
        result = await execute_query(query, remove_outliers=False)
        
        return result[0] if result else {"min_price": 0, "max_price": 100000}

@router.get("/mileage", response_model=Dict[str, float])
async def get_mileage_range(remove_outliers: bool = True):
    """Get min and max mileage for filtering"""
    if remove_outliers:
        # Get all mileage data and remove outliers
        query = "SELECT mileage FROM cars WHERE mileage IS NOT NULL"
        result = await execute_query(query)
        
        if not result:
            return {"min_mileage": 0, "max_mileage": 300000}
        
        # Remove outliers from the mileage data
        clean_data, _ = detect_outliers(result, numeric_columns=["mileage"])
        
        if not clean_data:
            return {"min_mileage": 0, "max_mileage": 300000}
        
        # Calculate min and max mileage from clean data
        min_mileage = min(float(item["mileage"]) for item in clean_data)
        max_mileage = max(float(item["mileage"]) for item in clean_data)
        
        return {"min_mileage": min_mileage, "max_mileage": max_mileage}
    else:
        # Use the original query without outlier removal
        query = "SELECT MIN(mileage) as min_mileage, MAX(mileage) as max_mileage FROM cars"
        result = await execute_query(query, remove_outliers=False)
        
        return result[0] if result else {"min_mileage": 0, "max_mileage": 300000}

@router.get("/fuel-types", response_model=List[str])
async def get_fuel_types():
    """Get available fuel types"""
    query = "SELECT DISTINCT fuel FROM cars WHERE fuel IS NOT NULL ORDER BY fuel"
    result = await execute_query(query, remove_outliers=False)
    return [item["fuel"] for item in result]

@router.get("/transmission-types", response_model=List[str])
async def get_transmission_types():
    """Get available transmission types"""
    query = "SELECT DISTINCT gear FROM cars WHERE gear IS NOT NULL ORDER BY gear"
    result = await execute_query(query, remove_outliers=False)
    return [item["gear"] for item in result]

@router.get("/countries", response_model=List[str])
async def get_countries():
    """Get available countries"""
    query = "SELECT DISTINCT country FROM cars WHERE country IS NOT NULL ORDER BY country"
    result = await execute_query(query, remove_outliers=False)
    return [item["country"] for item in result]

@router.get("/outlier-stats")
async def get_outlier_stats():
    """Get statistics about outliers in the database"""
    # Get all car data with numeric columns
    query = "SELECT price, mileage, age FROM cars WHERE price IS NOT NULL OR mileage IS NOT NULL OR age IS NOT NULL"
    result = await execute_query(query, remove_outliers=False)
    
    if not result:
        return {"total_records": 0, "outliers": 0, "outlier_percentage": 0.0}
    
    # Detect outliers
    clean_data, outliers = detect_outliers(result)
    
    total = len(result)
    outlier_count = len(outliers)
    outlier_percentage = round((outlier_count / total) * 100, 2) if total > 0 else 0.0
    
    return {
        "total_records": total,
        "outliers": outlier_count,
        "outlier_percentage": outlier_percentage
    }