 
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import json

from app.database.sqlite import get_db
from app.models.user import User, SavedCar, SearchHistory
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.car import CarResponse
from app.api.auth import get_current_user
from app.database.mysql import execute_query

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update current user information"""
    for key, value in user_update.dict(exclude_unset=True).items():
        if key == "password":
            from app.utils.security import get_password_hash
            setattr(current_user, "hashed_password", get_password_hash(value))
        else:
            setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/saved-cars/{car_id}")
async def save_car(car_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Save a car to user's favorites"""
    # Check if car exists
    car_query = "SELECT * FROM cars WHERE id = %s"
    car_result = await execute_query(car_query, [car_id])
    
    if not car_result:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Check if already saved
    existing = db.query(SavedCar).filter(
        SavedCar.user_id == current_user.id,
        SavedCar.car_id == car_id
    ).first()
    
    if existing:
        return {"message": "Car already saved"}
    
    # Save the car
    saved_car = SavedCar(user_id=current_user.id, car_id=car_id)
    db.add(saved_car)
    db.commit()
    
    return {"message": "Car saved successfully"}

@router.delete("/saved-cars/{car_id}")
async def unsave_car(car_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Remove a car from user's favorites"""
    saved_car = db.query(SavedCar).filter(
        SavedCar.user_id == current_user.id,
        SavedCar.car_id == car_id
    ).first()
    
    if not saved_car:
        raise HTTPException(status_code=404, detail="Car not in saved list")
    
    db.delete(saved_car)
    db.commit()
    
    return {"message": "Car removed from saved list"}

@router.get("/saved-cars", response_model=list[CarResponse])
async def get_saved_cars(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's saved cars"""
    saved_cars = db.query(SavedCar).filter(SavedCar.user_id == current_user.id).all()
    
    if not saved_cars:
        return []
    
    # Get car IDs
    car_ids = [saved.car_id for saved in saved_cars]
    
    # Format for SQL IN clause
    placeholders = ', '.join(['%s'] * len(car_ids))
    query = f"SELECT * FROM cars WHERE id IN ({placeholders})"
    
    # Get car details
    cars = await execute_query(query, car_ids)
    return [CarResponse(**car) for car in cars]

@router.post("/search-history")
async def save_search(request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Save search parameters to history"""
    # Extract all query parameters from the request
    search_params = dict(request.query_params)
    
    # Save to history
    search_history = SearchHistory(
        user_id=current_user.id,
        search_params=json.dumps(search_params)
    )
    db.add(search_history)
    db.commit()
    db.refresh(search_history)
    
    return {"message": "Search saved to history", "id": search_history.id, "params": search_params}

@router.get("/search-history")
async def get_search_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's search history"""
    history = db.query(SearchHistory).filter(
        SearchHistory.user_id == current_user.id
    ).order_by(SearchHistory.created_at.desc()).all()
    
    result = []
    for item in history:
        search_params = json.loads(item.search_params)
        result.append({
            "id": item.id,
            "params": search_params,
            "created_at": item.created_at
        })
    
    return result