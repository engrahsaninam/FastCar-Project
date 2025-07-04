# app/api/filters.py
from fastapi import APIRouter, Query, Depends
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.database.sqlite import get_db
import logging
import time
import json

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_iqr_bounds(db: Session, column: str):
    """Calculate IQR bounds for outlier detection."""
    result = db.execute(text(f"""
        SELECT
            (SELECT value FROM (
                SELECT value, ntile(4) OVER (ORDER BY value) as quartile
                FROM (SELECT {column} as value FROM cars WHERE {column} IS NOT NULL AND status = 'available')
            ) WHERE quartile = 1 ORDER BY value DESC LIMIT 1) as q1,
            (SELECT value FROM (
                SELECT value, ntile(4) OVER (ORDER BY value) as quartile
                FROM (SELECT {column} as value FROM cars WHERE {column} IS NOT NULL AND status = 'available')
            ) WHERE quartile = 3 ORDER BY value LIMIT 1) as q3
    """)).fetchone()
    if result:
        q1, q3 = result
        iqr = q3 - q1
        return q1 - 1.5 * iqr, q3 + 1.5 * iqr
    return None, None

@router.get("/years", response_model=Dict[str, int])
async def get_years_range(remove_outliers: bool = True, db: Session = Depends(get_db)):
    start_time = time.time()
    current_year = 2025

    if remove_outliers:
        min_bound, max_bound = get_iqr_bounds(db, "year")
        if min_bound is None:
            logger.info("No year data for IQR calculation")
            return {"min_year": 2000, "max_year": current_year}
        result = db.execute(text("""
            SELECT MIN(year), MAX(year)
            FROM cars
            WHERE year IS NOT NULL AND year BETWEEN :min_bound AND :max_bound AND status = 'available'
        """).bindparams(min_bound=min_bound, max_bound=max_bound)).fetchone()
    else:
        result = db.execute(text("""
            SELECT MIN(year), MAX(year)
            FROM cars
            WHERE year IS NOT NULL AND status = 'available'
        """)).fetchone()

    if not result or result[0] is None:
        logger.info("No year data found")
        return {"min_year": 2000, "max_year": current_year}
    min_year, max_year = int(result[0]), int(result[1])
    min_year = max(1950, min_year)
    max_year = min(current_year, max_year)

    query_time = time.time() - start_time
    logger.info(f"Get years query took {query_time:.2f} seconds")
    return {"min_year": min_year, "max_year": max_year}

@router.get("/prices", response_model=Dict[str, float])
async def get_price_range(remove_outliers: bool = True, db: Session = Depends(get_db)):
    start_time = time.time()
    if remove_outliers:
        min_bound, max_bound = get_iqr_bounds(db, "price")
        if min_bound is None:
            logger.info("No price data for IQR calculation")
            return {"min_price": 0, "max_price": 100000}
        result = db.execute(text("""
            SELECT MIN(price), MAX(price)
            FROM cars
            WHERE price IS NOT NULL AND price BETWEEN :min_bound AND :max_bound AND status = 'available'
        """).bindparams(min_bound=min_bound, max_bound=max_bound)).fetchone()
    else:
        result = db.execute(text("""
            SELECT MIN(price), MAX(price)
            FROM cars
            WHERE price IS NOT NULL AND status = 'available'
        """)).fetchone()

    if not result or result[0] is None:
        logger.info("No price data found")
        return {"min_price": 0, "max_price": 100000}
    min_price, max_price = float(result[0]), float(result[1])

    query_time = time.time() - start_time
    logger.info(f"Get prices query took {query_time:.2f} seconds")
    return {"min_price": min_price, "max_price": max_price}

@router.get("/mileage", response_model=Dict[str, float])
async def get_mileage_range(remove_outliers: bool = True, db: Session = Depends(get_db)):
    start_time = time.time()
    if remove_outliers:
        min_bound, max_bound = get_iqr_bounds(db, "mileage")
        if min_bound is None:
            logger.info("No mileage data for IQR calculation")
            return {"min_mileage": 0, "max_mileage": 300000}
        result = db.execute(text("""
            SELECT MIN(mileage), MAX(mileage)
            FROM cars
            WHERE mileage IS NOT NULL AND mileage BETWEEN :min_bound AND :max_bound AND status = 'available'
        """).bindparams(min_bound=min_bound, max_bound=max_bound)).fetchone()
    else:
        result = db.execute(text("""
            SELECT MIN(mileage), MAX(mileage)
            FROM cars
            WHERE mileage IS NOT NULL AND status = 'available'
        """)).fetchone()

    if not result or result[0] is None:
        logger.info("No mileage data found")
        return {"min_mileage": 0, "max_mileage": 300000}
    min_mileage, max_mileage = float(result[0]), float(result[1])

    query_time = time.time() - start_time
    logger.info(f"Get mileage query took {query_time:.2f} seconds")
    return {"min_mileage": min_mileage, "max_mileage": max_mileage}

@router.get("/fuel-types", response_model=List[str])
async def get_fuel_types(db: Session = Depends(get_db)):
    start_time = time.time()
    fuels = db.execute(text("""
        SELECT DISTINCT fuel
        FROM car_filters
        WHERE fuel IS NOT NULL
        ORDER BY fuel
    """)).fetchall()
    query_time = time.time() - start_time
    logger.info(f"Get fuel types query took {query_time:.2f} seconds")
    return [fuel[0] for fuel in fuels]

@router.get("/transmission-types", response_model=List[str])
async def get_transmission_types(db: Session = Depends(get_db)):
    start_time = time.time()
    gears = db.execute(text("""
        SELECT DISTINCT gear
        FROM car_filters
        WHERE gear IS NOT NULL
        ORDER BY gear
    """)).fetchall()
    query_time = time.time() - start_time
    logger.info(f"Get transmission types query took {query_time:.2f} seconds")
    return [gear[0] for gear in gears]

@router.get("/countries", response_model=List[str])
async def get_countries(db: Session = Depends(get_db)):
    start_time = time.time()
    countries = db.execute(text("""
        SELECT DISTINCT country
        FROM car_filters
        WHERE country IS NOT NULL
        ORDER BY country
    """)).fetchall()
    query_time = time.time() - start_time
    logger.info(f"Get countries query took {query_time:.2f} seconds")
    return [country[0] for country in countries]

@router.get("/power", response_model=Dict[str, int])
async def get_power_range(remove_outliers: bool = True, db: Session = Depends(get_db)):
    start_time = time.time()
    if remove_outliers:
        min_bound, max_bound = get_iqr_bounds(db, "power")
        if min_bound is None:
            logger.info("No power data for IQR calculation")
            return {"min_power": 50, "max_power": 500}
        result = db.execute(text("""
            SELECT MIN(power), MAX(power)
            FROM cars
            WHERE power IS NOT NULL AND power BETWEEN :min_bound AND :max_bound AND status = 'available'
        """).bindparams(min_bound=min_bound, max_bound=max_bound)).fetchone()
    else:
        result = db.execute(text("""
            SELECT MIN(power), MAX(power)
            FROM cars
            WHERE power IS NOT NULL AND status = 'available'
        """)).fetchone()

    if not result or result[0] is None:
        logger.info("No power data found")
        return {"min_power": 50, "max_power": 500}
    min_power, max_power = int(result[0]), int(result[1])

    query_time = time.time() - start_time
    logger.info(f"Get power query took {query_time:.2f} seconds")
    return {"min_power": min_power, "max_power": max_power}

@router.get("/body-types", response_model=List[str])
async def get_body_types(db: Session = Depends(get_db)):
    start_time = time.time()
    body_types = db.execute(text("""
        SELECT DISTINCT body_type
        FROM car_filters
        WHERE body_type IS NOT NULL
        ORDER BY body_type
    """)).fetchall()
    query_time = time.time() - start_time
    logger.info(f"Get body types query took {query_time:.2f} seconds")
    return [body_type[0] for body_type in body_types]

@router.get("/colours", response_model=List[str])
async def get_colours(db: Session = Depends(get_db)):
    start_time = time.time()
    colours = db.execute(text("""
        SELECT DISTINCT colour
        FROM car_filters
        WHERE colour IS NOT NULL
        ORDER BY colour
    """)).fetchall()
    query_time = time.time() - start_time
    logger.info(f"Get colours query took {query_time:.2f} seconds")
    return [colour[0] for colour in colours]

@router.get("/features", response_model=List[str])
async def get_features(db: Session = Depends(get_db)):
    start_time = time.time()
    # Fetch raw features JSON
    results = db.execute(text("""
        SELECT features
        FROM cars
        WHERE features IS NOT NULL AND features != '' AND features != '{}'
    """)).fetchall()
    
    unique_features = set()
    for row in results:
        try:
            # Parse features (handles both JSON and stringified JSON)
            features = row[0] if isinstance(row[0], dict) else json.loads(row[0])
            # Flatten features from all categories
            for category, feature_list in features.items():
                unique_features.update(feature_list)
        except (json.JSONDecodeError, TypeError):
            logger.warning(f"Invalid features data: {row[0]}")
            continue
    
    query_time = time.time() - start_time
    logger.info(f"Get features query took {query_time:.2f} seconds")
    return sorted(list(unique_features))

@router.get("/outlier-stats")
async def get_outlier_stats(db: Session = Depends(get_db)):
    start_time = time.time()
    total_records = 0
    total_outliers = 0

    for column in ["year", "price", "mileage", "power"]:
        min_bound, max_bound = get_iqr_bounds(db, column)
        if min_bound is None:
            continue
        result = db.execute(text(f"""
            SELECT
                (SELECT COUNT(*) FROM cars WHERE {column} IS NOT NULL) as total_count,
                (SELECT COUNT(*) FROM cars WHERE {column} IS NOT NULL AND ({column} < :min_bound OR {column} > :max_bound)) as outlier_count
        """).bindparams(min_bound=min_bound, max_bound=max_bound)).fetchone()
        if result:
            total_records += result.total_count
            total_outliers += result.outlier_count

    outlier_percentage = round((total_outliers / total_records) * 100, 2) if total_records > 0 else 0.0

    query_time = time.time() - start_time
    logger.info(f"Get outlier stats query took {query_time:.2f} seconds")
    return {
        "total_records": total_records,
        "outliers": total_outliers,
        "outlier_percentage": outlier_percentage
    }