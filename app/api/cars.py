# app/api/cars.py
from fastapi import APIRouter, Query, HTTPException, Depends, Request
from app.api.auth import get_current_user
from app.models.user import User
from app.models.car import Car
from app.models.charges import AdditionalCharges
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

def car_to_dict(car: Car, vat: bool = False, vat_rate: float = 0.0) -> dict:
    price = car.price if vat else car.price_without_vat
    logger.debug(f"Car id={car.id}: VAT={vat}, vat_rate={vat_rate}%, price={price}, price_without_vat={car.price_without_vat}")
    return {
        "id": car.id,
        "brand": car.brand,
        "model": car.model,
        "version": car.version,
        "price": price,
        "price_without_vat": car.price_without_vat,
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
        "features": car.features,
        "total_price": car.total_price
    }

@router.get("/best-deals", response_model=PaginatedCarResponse)
async def get_best_deals(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    remove_outliers: bool = True,
    brand: Optional[str] = None,
    model: Optional[str] = None,
    year: Optional[int] = None,
    vat: Optional[bool] = None,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"[REQUEST] Fetching best deals - page={page}, limit={limit}, brand={brand}, model={model}, year={year}, vat={vat}")
    start_time = time.time()

    # Fetch VAT percentage
    charges = db.query(AdditionalCharges).first()
    if not charges:
        logger.error("[ERROR] No additional_charges record found")
        raise HTTPException(status_code=500, detail="No additional charges configuration found")
    vat_rate = max(charges.vat, 0.0) if vat else 0.0
    logger.info(f"[VAT] Using vat_rate={vat_rate}%")

    offset = (page - 1) * limit

    filters = []
    if brand:
        filters.append(Car.brand == brand)
    if model:
        filters.append(Car.model == model)
    if year:
        filters.append(Car.year == year)

    # Adjust price for VAT in subquery
    price_column = Car.price if vat else Car.price_without_vat

    avg_prices = db.query(
        Car.brand,
        Car.model,
        func.avg(price_column).label('avg_price'),
        func.count().label('group_count')
    ).filter(
        Car.price.isnot(None),
        Car.brand.isnot(None),
        Car.model.isnot(None),
        *filters
    ).group_by(Car.brand, Car.model).subquery()

    primary_query = db.query(Car).join(
        avg_prices,
        and_(Car.brand == avg_prices.c.brand, Car.model == avg_prices.c.model)
    ).filter(
        price_column < avg_prices.c.avg_price,
        Car.price.isnot(None),
        *filters
    ).order_by((avg_prices.c.avg_price - price_column).desc())

    total = primary_query.count()
    cars = primary_query.offset(offset).limit(limit).all()
    logger.info(f"[DATA] Primary query fetched {len(cars)} cars (total matching: {total})")

    if cars:
        logger.info("[DATA] Sample primary cars (2-3 shown):")
        for car in cars[:3]:
            logger.info(f"[CAR] {json.dumps(car_to_dict(car, vat, vat_rate), indent=2)}")

    if remove_outliers and cars:
        logger.info("[INFO] Removing outliers from primary results...")
        car_dicts = [car_to_dict(car, vat, vat_rate) for car in cars]
        clean_data, _ = detect_outliers(car_dicts, numeric_columns=['price', 'mileage', 'age'])
        cars = [car for car in cars if car_to_dict(car, vat, vat_rate) in clean_data]
        total = len(clean_data) if total > len(clean_data) else total
        logger.info(f"[INFO] {len(cars)} cars left after outlier removal")

        if cars:
            logger.info("[DATA] Sample cars after outlier removal (2-3 shown):")
            for car in cars[:3]:
                logger.info(f"[CAR] {json.dumps(car_to_dict(car, vat, vat_rate), indent=2)}")

    if not cars:
        logger.info("[FALLBACK] No suitable cars found in primary query. Executing fallback logic...")

        median_prices = db.query(
            Car.brand,
            Car.model,
            func.min(price_column).label('min_price'),
            func.max(price_column).label('max_price'),
            ((func.min(price_column) + func.max(price_column)) / 2).label('price_threshold'),
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
            price_column <= median_prices.c.price_threshold,
            Car.price.isnot(None),
            *filters
        ).order_by(price_column.asc())

        total = fallback_query.count()
        cars = fallback_query.offset(offset).limit(limit).all()
        logger.info(f"[DATA] Fallback query fetched {len(cars)} cars (total matching: {total})")

        if cars:
            logger.info("[DATA] Sample fallback cars (2-3 shown):")
            for car in cars[:3]:
                logger.info(f"[CAR] {json.dumps(car_to_dict(car, vat, vat_rate), indent=2)}")

        if remove_outliers and cars:
            logger.info("[INFO] Removing outliers from fallback results...")
            car_dicts = [car_to_dict(car, vat, vat_rate) for car in cars]
            clean_data, _ = detect_outliers(car_dicts, numeric_columns=['price', 'mileage', 'age'])
            cars = [car for car in cars if car_to_dict(car, vat, vat_rate) in clean_data]
            total = len(clean_data) if total > len(clean_data) else total
            logger.info(f"[INFO] {len(cars)} cars left after outlier removal")

            if cars:
                logger.info("[DATA] Sample cars after outlier removal (2-3 shown):")
                for car in cars[:3]:
                    logger.info(f"[CAR] {json.dumps(car_to_dict(car, vat, vat_rate), indent=2)}")

    query_time = time.time() - start_time
    logger.info(f"[SUCCESS] Best deals query completed in {query_time:.2f}s")

    if current_user:
        from app.models.user import SearchHistory
        search_params = {
            "page": page,
            "limit": limit,
            "remove_outliers": remove_outliers,
            "brand": brand,
            "model": model,
            "year": year,
            "vat": vat
        }
        search_history = SearchHistory(
            user_id=current_user.id,
            search_params=json.dumps(search_params)
        )
        db.add(search_history)
        db.commit()
        logger.info(f"[HISTORY] Saved search for user_id={current_user.id}")

    return {
        "data": [CarResponse(**car_to_dict(car, vat, vat_rate)) for car in cars],
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
    vat: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    remove_outliers: bool = True,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"[REQUEST] Fetching cars - page={page}, limit={limit}, brand={brand}, model={model}, vat={vat}")
    start_time = time.time()

    # Fetch VAT percentage
    charges = db.query(AdditionalCharges).first()
    if not charges:
        logger.error("[ERROR] No additional_charges record found")
        raise HTTPException(status_code=500, detail="No additional charges configuration found")
    vat_rate = max(charges.vat, 0.0) if vat else 0.0
    logger.info(f"[VAT] Using vat_rate={vat_rate}%")

    query = db.query(Car)
    filters = []

    if brand:
        filters.append(Car.brand == brand)
    if model:
        filters.append(Car.model == model)
    if min_price:
        price_column = Car.price if vat else Car.price_without_vat
        filters.append(price_column >= min_price)
    if max_price:
        price_column = Car.price if vat else Car.price_without_vat
        filters.append(price_column <= max_price)
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
        logger.info("[INFO] Removing outliers...")
        car_dicts = [car_to_dict(car, vat, vat_rate) for car in cars]
        clean_data, _ = detect_outliers(car_dicts, numeric_columns=['price', 'mileage', 'age'])
        cars = [car for car in cars if car_to_dict(car, vat, vat_rate) in clean_data]
        total = len(clean_data) if total > len(clean_data) else total
        logger.info(f"[INFO] {len(cars)} cars left after outlier removal")

    query_time = time.time() - start_time
    logger.info(f"[SUCCESS] Get cars query took {query_time:.2f} seconds")

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
            "vat": vat,
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
        logger.info(f"[HISTORY] Saved search for user_id={current_user.id}")

    return {
        "data": [CarResponse(**car_to_dict(car, vat, vat_rate)) for car in cars],
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
    vat: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    remove_outliers: bool = True,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logger.info(f"[REQUEST] Searching cars - page={page}, limit={limit}, brand={brand}, model={model}, vat={vat}")
    search_params = dict(request.query_params)
    result = await get_cars(
        brand, model, min_price, max_price, min_year, max_year, 
        min_mileage, max_mileage, fuel, gear, power_min, power_max,
        body_type, colour, features, vat, page, limit, remove_outliers, 
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
        logger.info(f"[HISTORY] Saved search for user_id={current_user.id}")
    
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