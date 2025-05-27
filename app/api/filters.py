# app/api/filters.py
from fastapi import APIRouter, Query, Depends
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy import or_, text
from app.database.sqlite import get_db
from app.models.car import Car
from app.utils.outlier_detection import detect_outliers
import logging
import time

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/years", response_model=Dict[str, int])
async def get_years_range(remove_outliers: bool = True, db: Session = Depends(get_db)):
    start_time = time.time()
    current_year = 2025

    if remove_outliers:
        cars = db.query(Car).filter(Car.year.isnot(None)).all()
        if not cars:
            logger.info("No cars found for years with remove_outliers=True")
            return {"min_year": 2000, "max_year": current_year}
        
        car_dicts = [{"year": car.year} for car in cars]
        clean_data, _ = detect_outliers(car_dicts, numeric_columns=["year"])
        
        if not clean_data:
            logger.info("No clean data after outlier removal for years")
            return {"min_year": 2000, "max_year": current_year}
        
        years = [int(item["year"]) for item in clean_data]
        min_year = min(years)
        max_year = max(years)
    else:
        result = db.query(
            func.min(Car.year).label('min_year'),
            func.max(Car.year).label('max_year')
        ).filter(Car.year.isnot(None)).first()
        
        if not result or result.min_year is None:
            logger.info("No year data found without outlier removal")
            return {"min_year": 2000, "max_year": current_year}
        
        min_year = int(result.min_year)
        max_year = int(result.max_year)
    
    min_year = max(1950, min_year)
    max_year = min(current_year, max_year)
    
    query_time = time.time() - start_time
    logger.info(f"Get years query took {query_time:.2f} seconds")
    return {"min_year": min_year, "max_year": max_year}

@router.get("/prices", response_model=Dict[str, float])
async def get_price_range(remove_outliers: bool = True, db: Session = Depends(get_db)):
    start_time = time.time()
    if remove_outliers:
        cars = db.query(Car).filter(Car.price.isnot(None)).all()
        if not cars:
            logger.info("No cars found for prices with remove_outliers=True")
            return {"min_price": 0, "max_price": 100000}
        
        car_dicts = [{"price": car.price} for car in cars]
        clean_data, _ = detect_outliers(car_dicts, numeric_columns=["price"])
        
        if not clean_data:
            logger.info("No clean data after outlier removal for prices")
            return {"min_price": 0, "max_price": 100000}
        
        min_price = min(float(item["price"]) for item in clean_data)
        max_price = max(float(item["price"]) for item in clean_data)
        
        query_time = time.time() - start_time
        logger.info(f"Get prices query took {query_time:.2f} seconds")
        return {"min_price": min_price, "max_price": max_price}
    else:
        result = db.query(
            func.min(Car.price).label('min_price'),
            func.max(Car.price).label('max_price')
        ).filter(Car.price.isnot(None)).first()
        
        query_time = time.time() - start_time
        logger.info(f"Get prices query took {query_time:.2f} seconds")
        return {
            "min_price": result.min_price or 0,
            "max_price": result.max_price or 100000
        }

@router.get("/mileage", response_model=Dict[str, float])
async def get_mileage_range(remove_outliers: bool = True, db: Session = Depends(get_db)):
    start_time = time.time()
    if remove_outliers:
        cars = db.query(Car).filter(Car.mileage.isnot(None)).all()
        if not cars:
            logger.info("No cars found for mileage with remove_outliers=True")
            return {"min_mileage": 0, "max_mileage": 300000}
        
        car_dicts = [{"mileage": car.mileage} for car in cars]
        clean_data, _ = detect_outliers(car_dicts, numeric_columns=["mileage"])
        
        if not clean_data:
            logger.info("No clean data after outlier removal for mileage")
            return {"min_mileage": 0, "max_mileage": 300000}
        
        min_mileage = min(float(item["mileage"]) for item in clean_data)
        max_mileage = max(float(item["mileage"]) for item in clean_data)
        
        query_time = time.time() - start_time
        logger.info(f"Get mileage query took {query_time:.2f} seconds")
        return {"min_mileage": min_mileage, "max_mileage": max_mileage}
    else:
        result = db.query(
            func.min(Car.mileage).label('min_mileage'),
            func.max(Car.mileage).label('max_mileage')
        ).filter(Car.mileage.isnot(None)).first()
        
        query_time = time.time() - start_time
        logger.info(f"Get mileage query took {query_time:.2f} seconds")
        return {
            "min_mileage": result.min_mileage or 0,
            "max_mileage": result.max_mileage or 300000
        }

@router.get("/fuel-types", response_model=List[str])
async def get_fuel_types(db: Session = Depends(get_db)):
    start_time = time.time()
    fuels = db.query(Car.fuel).filter(Car.fuel.isnot(None)).distinct().order_by(Car.fuel).all()
    query_time = time.time() - start_time
    logger.info(f"Get fuel types query took {query_time:.2f} seconds")
    return [fuel[0] for fuel in fuels]

@router.get("/transmission-types", response_model=List[str])
async def get_transmission_types(db: Session = Depends(get_db)):
    start_time = time.time()
    gears = db.query(Car.gear).filter(Car.gear.isnot(None)).distinct().order_by(Car.gear).all()
    query_time = time.time() - start_time
    logger.info(f"Get transmission types query took {query_time:.2f} seconds")
    return [gear[0] for gear in gears]

@router.get("/countries", response_model=List[str])
async def get_countries(db: Session = Depends(get_db)):
    start_time = time.time()
    countries = db.query(Car.country).filter(Car.country.isnot(None)).distinct().order_by(Car.country).all()
    query_time = time.time() - start_time
    logger.info(f"Get countries query took {query_time:.2f} seconds")
    return [country[0] for country in countries]

@router.get("/power", response_model=Dict[str, int])
async def get_power_range(remove_outliers: bool = True, db: Session = Depends(get_db)):
    """Get min and max power for filtering"""
    start_time = time.time()
    if remove_outliers:
        cars = db.query(Car).filter(Car.power.isnot(None)).all()
        if not cars:
            logger.info("No cars found for power with remove_outliers=True")
            return {"min_power": 50, "max_power": 500}
        
        car_dicts = [{"power": car.power} for car in cars]
        clean_data, _ = detect_outliers(car_dicts, numeric_columns=["power"])
        
        if not clean_data:
            logger.info("No clean data after outlier removal for power")
            return {"min_power": 50, "max_power": 500}
        
        min_power = min(int(item["power"]) for item in clean_data)
        max_power = max(int(item["power"]) for item in clean_data)
        
        query_time = time.time() - start_time
        logger.info(f"Get power query took {query_time:.2f} seconds")
        return {"min_power": min_power, "max_power": max_power}
    else:
        result = db.query(
            func.min(Car.power).label('min_power'),
            func.max(Car.power).label('max_power')
        ).filter(Car.power.isnot(None)).first()
        
        query_time = time.time() - start_time
        logger.info(f"Get power query took {query_time:.2f} seconds")
        return {
            "min_power": result.min_power or 50,
            "max_power": result.max_power or 500
        }

@router.get("/body-types", response_model=List[str])
async def get_body_types(db: Session = Depends(get_db)):
    """Get available body types"""
    start_time = time.time()
    body_types = db.query(Car.body_type).filter(Car.body_type.isnot(None)).distinct().order_by(Car.body_type).all()
    query_time = time.time() - start_time
    logger.info(f"Get body types query took {query_time:.2f} seconds")
    return [body_type[0] for body_type in body_types]

@router.get("/colours", response_model=List[str])
async def get_colours(db: Session = Depends(get_db)):
    """Get available colours"""
    start_time = time.time()
    colours = db.query(Car.colour).filter(Car.colour.isnot(None)).distinct().order_by(Car.colour).all()
    query_time = time.time() - start_time
    logger.info(f"Get colours query took {query_time:.2f} seconds")
    return [colour[0] for colour in colours]

@router.get("/features", response_model=Dict[str, List[str]])
async def get_features(db: Session = Depends(get_db)):
    """Get available features for Comfort & Convenience, Safety & Security, Extras"""
    start_time = time.time()
    feature_categories = {
        "Comfort & Convenience": [],
        "Safety & Security": [],
        "Extras": []
    }
    
    # Raw SQL to extract distinct features from JSON
    for category in feature_categories:
        query = text("""
            SELECT DISTINCT json_each.value
            FROM cars, json_each(cars.features, :category_path)
            WHERE json_each.value IS NOT NULL
            ORDER BY json_each.value
        """).bindparams(category_path=f'$."{category}"')
        
        result = db.execute(query).fetchall()
        feature_categories[category] = [row[0] for row in result]
    
    query_time = time.time() - start_time
    logger.info(f"Get features query took {query_time:.2f} seconds")
    return feature_categories

@router.get("/outlier-stats")
async def get_outlier_stats(db: Session = Depends(get_db)):
    start_time = time.time()
    cars = db.query(Car).filter(
        or_(Car.price.isnot(None), Car.mileage.isnot(None), Car.year.isnot(None))
    ).all()
    
    if not cars:
        logger.info("No cars found for outlier stats")
        return {"total_records": 0, "outliers": 0, "outlier_percentage": 0.0}
    
    car_dicts = [{"price": car.price, "mileage": car.mileage, "year": car.year} for car in cars]
    clean_data, outliers = detect_outliers(car_dicts, numeric_columns=["price", "mileage", "year"])
    
    total = len(car_dicts)
    outlier_count = len(outliers)
    outlier_percentage = round((outlier_count / total) * 100, 2) if total > 0 else 0.0
    
    query_time = time.time() - start_time
    logger.info(f"Get outlier stats query took {query_time:.2f} seconds")
    return {
        "total_records": total,
        "outliers": outlier_count,
        "outlier_percentage": outlier_percentage
    }