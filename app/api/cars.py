# app/api/cars.py
from fastapi import APIRouter, Query, HTTPException, Depends, Request
from app.api.auth import get_current_user
from app.models.user import User
from app.models.car import Car
from app.database.sqlite import get_db
from sqlalchemy.orm import Session
from sqlalchemy.sql import func, text
from typing import Optional, List
import json
import logging
import time
from sqlalchemy import and_, or_

from app.schemas.car import CarResponse, PaginatedCarResponse
from app.utils.outlier_detection import detect_outliers

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

def car_to_dict(car: Car) -> dict:
    return {
        "id": car.id,
        "brand": car.brand,
        "model": car.model,
        "version": car.version,
        "price": car.price,
        "mileage": car.mileage,
        "age": car.age,
        "power": car.power,
        "gear": car.gear,
        "fuel": car.fuel,
        "country": car.country,
        "zipcode": car.zipcode,
        "images": car.images,
        "url": car.url,
        "attrs": car.attrs,
        "year": car.year,
        "CO2_emissions": car.CO2_emissions,
        "engine_size": car.engine_size,
        "body_type": car.body_type,
        "colour": car.colour,
        "features": car.features
    }

@router.get("/best-deals", response_model=PaginatedCarResponse)
async def get_best_deals(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    remove_outliers: bool = True,
    brand: Optional[str] = None,
    model: Optional[str] = None,
    year: Optional[int] = None,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Fetching best deals: page={page}, limit={limit}, remove_outliers={remove_outliers}, brand={brand}, model={model}, year={year}")
    start_time = time.time()

    offset = (page - 1) * limit

    filters = []
    if brand:
        filters.append(Car.brand == brand)
    if model:
        filters.append(Car.model == model)
    if year:
        filters.append(Car.year == year)

    # Subquery to calculate average prices per brand/model
    avg_prices = db.query(
        Car.brand,
        Car.model,
        func.avg(Car.price).label('avg_price'),
        func.count().label('group_count')
    ).filter(
        Car.price.isnot(None),
        Car.brand.isnot(None),
        Car.model.isnot(None),
        *filters
    ).group_by(Car.brand, Car.model).subquery()

    # Main query: Select cars with price below average, explicitly selecting all columns
    primary_query = db.query(Car).join(
        avg_prices,
        and_(Car.brand == avg_prices.c.brand, Car.model == avg_prices.c.model)
    ).filter(
        Car.price < avg_prices.c.avg_price,
        Car.price.isnot(None),
        *filters
    ).order_by((avg_prices.c.avg_price - Car.price).desc())

    total = primary_query.count()
    logger.info(f"Primary query found {total} best deals")

    cars = primary_query.offset(offset).limit(limit).all()

    # Log raw car data to debug null fields
    if cars:
        sample_car = cars[0]
        logger.debug(f"Sample car from primary query: CO2_emissions={sample_car.CO2_emissions}, "
                     f"engine_size={sample_car.engine_size}, body_type={sample_car.body_type}, "
                     f"colour={sample_car.colour}, features={sample_car.features}")

    if remove_outliers and cars:
        car_dicts = [car_to_dict(car) for car in cars]
        clean_data, _ = detect_outliers(car_dicts, numeric_columns=['price', 'mileage', 'age'])
        cars = [car for car in cars if car_to_dict(car) in clean_data]
        total = len(clean_data) if total > len(clean_data) else total

    if not cars:
        logger.info("No cars found with primary query, using fallback")
        # Fallback: Use median price threshold
        median_prices = db.query(
            Car.brand,
            Car.model,
            ((func.min(Car.price) + func.max(Car.price)) / 2).label('price_threshold'),
            func.count().label('group_count')
        ).filter(
            Car.price.isnot(None),
            Car.brand.isnot(None),
            Car.model.isnot(None),
            *filters
        ).group_by(Car.brand, Car.model).having(
            func.count() > 1
        ).subquery()

        fallback_query = db.query(Car).join(
            median_prices,
            and_(Car.brand == median_prices.c.brand, Car.model == median_prices.c.model)
        ).filter(
            Car.price <= median_prices.c.price_threshold,
            Car.price.isnot(None),
            *filters
        ).order_by(Car.price.asc())

        total = fallback_query.count()
        logger.info(f"Fallback query found {total} cars")
        cars = fallback_query.offset(offset).limit(limit).all()

        # Log raw car data for fallback
        if cars:
            sample_car = cars[0]
            logger.debug(f"Sample car from fallback query: CO2_emissions={sample_car.CO2_emissions}, "
                         f"engine_size={sample_car.engine_size}, body_type={sample_car.body_type}, "
                         f"colour={sample_car.colour}, features={sample_car.features}")

        if remove_outliers and cars:
            car_dicts = [car_to_dict(car) for car in cars]
            clean_data, _ = detect_outliers(car_dicts, numeric_columns=['price', 'mileage', 'age'])
            cars = [car for car in cars if car_to_dict(car) in clean_data]
            total = len(clean_data) if total > len(clean_data) else total

    query_time = time.time() - start_time
    logger.info(f"Best deals query took {query_time:.2f} seconds")

    if current_user:
        from app.models.user import SearchHistory
        search_params = {
            "page": page,
            "limit": limit,
            "remove_outliers": remove_outliers,
            "brand": brand,
            "model": model,
            "year": year
        }
        search_history = SearchHistory(
            user_id=current_user.id,
            search_params=json.dumps(search_params)
        )
        db.add(search_history)
        db.commit()

    return {
        "data": [CarResponse(**car_to_dict(car)) for car in cars],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if limit > 0 else 0
    }

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
    power_min: Optional[int] = None,
    power_max: Optional[int] = None,
    body_type: Optional[str] = None,
    colour: Optional[str] = None,
    features: Optional[List[str]] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    remove_outliers: bool = True,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    query = db.query(Car)
    filters = []

    if brand:
        filters.append(Car.brand == brand)
    if model:
        filters.append(Car.model == model)
    if min_price:
        filters.append(Car.price >= min_price)
    if max_price:
        filters.append(Car.price <= max_price)
    if min_year:
        filters.append(Car.year >= min_year)
    if max_year:
        filters.append(Car.year <= max_year)
    if min_mileage is not None:
        filters.append(Car.mileage >= min_mileage)
    if max_mileage is not None:
        filters.append(Car.mileage <= max_mileage)
    if fuel:
        filters.append(Car.fuel == fuel)
    if gear:
        filters.append(Car.gear == gear)
    if power_min is not None:
        filters.append(Car.power >= power_min)
    if power_max is not None:
        filters.append(Car.power <= power_max)
    if body_type:
        filters.append(Car.body_type == body_type)
    if colour:
        filters.append(Car.colour == colour)
    if features:
        for feature in features:
            # Filter cars where feature exists in any category
            filters.append(
                text("json_extract(features, '$.\"Comfort & Convenience\"') LIKE :feature "
                     "OR json_extract(features, '$.\"Safety & Security\"') LIKE :feature "
                     "OR json_extract(features, '$.\"Extras\"') LIKE :feature")
                .bindparams(feature=f'%{feature}%')
            )

    query = query.filter(*filters)
    total = query.count()

    offset = (page - 1) * limit
    cars = query.offset(offset).limit(limit).all()

    if remove_outliers and cars:
        car_dicts = [car_to_dict(car) for car in cars]
        clean_data, _ = detect_outliers(car_dicts, numeric_columns=['price', 'mileage', 'age'])
        cars = [car for car in cars if car_to_dict(car) in clean_data]
        total = len(clean_data) if total > len(clean_data) else total

    query_time = time.time() - start_time
    logger.info(f"Get cars query took {query_time:.2f} seconds")

    if current_user:
        from app.models.user import SearchHistory
        search_params = {
            "brand": brand,
            "model": model,
            "min_price": min_price,
            "max_price": max_price,
            "min_year": min_year,
            "max_year": max_year,
            "min_mileage": min_mileage,
            "max_mileage": max_mileage,
            "fuel": fuel,
            "gear": gear,
            "power_min": power_min,
            "power_max": power_max,
            "body_type": body_type,
            "colour": colour,
            "features": features,
            "page": page,
            "limit": limit,
            "remove_outliers": remove_outliers
        }
        search_history = SearchHistory(
            user_id=current_user.id,
            search_params=json.dumps(search_params)
        )
        db.add(search_history)
        db.commit()

    return {
        "data": [CarResponse(**car_to_dict(car)) for car in cars],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if limit > 0 else 0
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
    power_min: Optional[int] = None,
    power_max: Optional[int] = None,
    body_type: Optional[str] = None,
    colour: Optional[str] = None,
    features: Optional[List[str]] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    remove_outliers: bool = True,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    search_params = dict(request.query_params)
    result = await get_cars(
        brand, model, min_price, max_price, min_year, max_year, 
        min_mileage, max_mileage, fuel, gear, power_min, power_max,
        body_type, colour, features, page, limit, remove_outliers, 
        current_user, db
    )
    
    if current_user:
        from app.models.user import SearchHistory
        search_history = SearchHistory(
            user_id=current_user.id,
            search_params=json.dumps(search_params)
        )
        db.add(search_history)
        db.commit()
    
    return result

@router.get("/brands/", response_model=List[str])
async def get_brands(db: Session = Depends(get_db)):
    start_time = time.time()
    brands = db.query(Car.brand).distinct().order_by(Car.brand).all()
    query_time = time.time() - start_time
    logger.info(f"Get brands query took {query_time:.2f} seconds")
    return [brand[0] for brand in brands if brand[0]]

@router.get("/models/", response_model=List[str])
async def get_models(brand: Optional[str] = None, db: Session = Depends(get_db)):
    start_time = time.time()
    query = db.query(Car.model).distinct().order_by(Car.model)
    if brand:
        query = query.filter(Car.brand == brand)
    models = query.all()
    query_time = time.time() - start_time
    logger.info(f"Get models query took {query_time:.2f} seconds")
    return [model[0] for model in models if model[0]]

@router.get("/{car_id}", response_model=CarResponse)
async def get_car(car_id: str, db: Session = Depends(get_db)):
    start_time = time.time()
    car = db.query(Car).filter(Car.id == car_id).first()
    
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    query_time = time.time() - start_time
    logger.info(f"Get car query took {query_time:.2f} seconds")
    return CarResponse(**car_to_dict(car))

@router.get("/{car_id}/similar", response_model=List[CarResponse])
async def get_similar_cars(
    car_id: str, 
    limit: int = Query(5, ge=1, le=20), 
    remove_outliers: bool = True, 
    db: Session = Depends(get_db)
):
    start_time = time.time()
    car = db.query(Car).filter(Car.id == car_id).first()
    
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    query = db.query(Car).filter(
        Car.brand == car.brand,
        Car.model == car.model,
        Car.id != car_id
    ).order_by(
        func.abs(Car.price - car.price)
    )

    cars = query.limit(limit).all()

    if remove_outliers and cars:
        car_dicts = [car_to_dict(c) for c in cars]
        clean_data, _ = detect_outliers(car_dicts, numeric_columns=['price', 'mileage', 'age'])
        cars = [c for c in cars if car_to_dict(c) in clean_data]

    query_time = time.time() - start_time
    logger.info(f"Get similar cars query took {query_time:.2f} seconds")
    return [CarResponse(**car_to_dict(c)) for c in cars]