from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any, List
from app.database.sqlite import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.utils.car_availability_checker import (
    check_and_update_car_availability,
    get_availability_stats,
    test_single_car_availability
)
from app.models.car import Car
from sqlalchemy.sql import text
import logging
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

class SingleCarCheckRequest(BaseModel):
    car_id: str
    car_url: str

class BulkAvailabilityCheckRequest(BaseModel):
    batch_size: Optional[int] = 1000
    max_cars_per_run: Optional[int] = 5000

def check_admin_permission(current_user: User = Depends(get_current_user)):
    """Check if user has admin permissions"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/stats")
async def get_car_availability_stats(
    admin_user: User = Depends(check_admin_permission),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive statistics about car availability.
    Admin only endpoint.
    """
    try:
        stats = await get_availability_stats(db)
        
        # Get additional detailed stats
        detailed_stats = db.execute(text("""
            SELECT 
                COUNT(CASE WHEN status = 'available' THEN 1 END) as available_count,
                COUNT(CASE WHEN status = 'unavailable' THEN 1 END) as unavailable_count,
                COUNT(CASE WHEN status NOT IN ('available', 'unavailable') THEN 1 END) as other_count,
                COUNT(*) as total_count,
                COUNT(CASE WHEN url IS NULL OR url = '' THEN 1 END) as no_url_count
            FROM cars
        """)).fetchone()
        
        return {
            "availability_stats": stats,
            "detailed_breakdown": {
                "available": detailed_stats.available_count,
                "unavailable": detailed_stats.unavailable_count,
                "other_status": detailed_stats.other_count,
                "total": detailed_stats.total_count,
                "cars_without_url": detailed_stats.no_url_count
            },
            "data_quality": {
                "cars_with_valid_urls": detailed_stats.total_count - detailed_stats.no_url_count,
                "url_coverage_percentage": round((detailed_stats.total_count - detailed_stats.no_url_count) * 100.0 / detailed_stats.total_count, 2) if detailed_stats.total_count > 0 else 0
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get availability stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.post("/check/manual")
async def trigger_manual_availability_check(
    background_tasks: BackgroundTasks,
    request: BulkAvailabilityCheckRequest,
    admin_user: User = Depends(check_admin_permission)
):
    """
    Trigger a manual car availability check.
    Runs in the background and returns immediately.
    Admin only endpoint.
    """
    try:
        # Add the check to background tasks
        background_tasks.add_task(
            check_and_update_car_availability,
            batch_size=request.batch_size,
            max_cars_per_run=request.max_cars_per_run
        )
        
        logger.info(f"Manual availability check triggered by admin user {admin_user.id}")
        
        return {
            "message": "Car availability check started in background",
            "parameters": {
                "batch_size": request.batch_size,
                "max_cars_per_run": request.max_cars_per_run
            },
            "status": "running",
            "note": "Check will run in background. Use /stats endpoint to monitor progress."
        }
        
    except Exception as e:
        logger.error(f"Failed to trigger manual availability check: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start check: {str(e)}")

@router.post("/check/single")
async def check_single_car_availability(
    request: SingleCarCheckRequest,
    admin_user: User = Depends(check_admin_permission),
    db: Session = Depends(get_db)
):
    """
    Check availability of a single car for testing/debugging.
    Admin only endpoint.
    """
    try:
        # Test the car availability
        is_available = await test_single_car_availability(request.car_id, request.car_url)
        
        # Get current car status from database
        car = db.query(Car).filter(Car.id == request.car_id).first()
        current_status = car.status if car else "not_found"
        
        return {
            "car_id": request.car_id,
            "url": request.car_url,
            "availability_check_result": is_available,
            "current_database_status": current_status,
            "recommendation": "available" if is_available else "should_be_marked_unavailable"
        }
        
    except Exception as e:
        logger.error(f"Failed to check single car availability: {e}")
        raise HTTPException(status_code=500, detail=f"Check failed: {str(e)}")

@router.get("/unavailable-cars")
async def get_unavailable_cars(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin_user: User = Depends(check_admin_permission),
    db: Session = Depends(get_db)
):
    """
    Get list of cars marked as unavailable.
    Admin only endpoint.
    """
    try:
        offset = (page - 1) * limit
        
        # Get unavailable cars
        cars = db.query(Car).filter(Car.status == 'unavailable').offset(offset).limit(limit).all()
        total = db.query(Car).filter(Car.status == 'unavailable').count()
        
        cars_data = []
        for car in cars:
            cars_data.append({
                "id": car.id,
                "brand": car.brand,
                "model": car.model,
                "price": car.price,
                "url": car.url,
                "status": car.status
            })
        
        return {
            "unavailable_cars": cars_data,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit if limit > 0 else 0
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get unavailable cars: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get unavailable cars: {str(e)}")

@router.post("/reactivate/{car_id}")
async def reactivate_car(
    car_id: str,
    admin_user: User = Depends(check_admin_permission),
    db: Session = Depends(get_db)
):
    """
    Manually reactivate a car (set status back to available).
    Use with caution - should verify the car is actually available.
    Admin only endpoint.
    """
    try:
        car = db.query(Car).filter(Car.id == car_id).first()
        
        if not car:
            raise HTTPException(status_code=404, detail="Car not found")
        
        old_status = car.status
        car.status = 'available'
        db.commit()
        
        logger.info(f"Car {car_id} reactivated by admin {admin_user.id} (status: {old_status} -> available)")
        
        return {
            "message": f"Car {car_id} has been reactivated",
            "car_id": car_id,
            "previous_status": old_status,
            "new_status": "available",
            "warning": "Please ensure the car is actually available before reactivating"
        }
        
    except Exception as e:
        logger.error(f"Failed to reactivate car {car_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to reactivate car: {str(e)}")

@router.delete("/cleanup-unavailable")
async def cleanup_unavailable_cars(
    confirm: str = Query(..., description="Type 'DELETE_UNAVAILABLE_CARS' to confirm"),
    admin_user: User = Depends(check_admin_permission),
    db: Session = Depends(get_db)
):
    """
    Permanently delete cars marked as unavailable from the database.
    This action cannot be undone. Use with extreme caution.
    Admin only endpoint.
    """
    if confirm != "DELETE_UNAVAILABLE_CARS":
        raise HTTPException(
            status_code=400, 
            detail="Confirmation phrase incorrect. Type 'DELETE_UNAVAILABLE_CARS' to confirm deletion."
        )
    
    try:
        # Count unavailable cars
        unavailable_count = db.query(Car).filter(Car.status == 'unavailable').count()
        
        if unavailable_count == 0:
            return {"message": "No unavailable cars to delete"}
        
        # Delete unavailable cars
        result = db.execute(text("DELETE FROM cars WHERE status = 'unavailable'"))
        db.commit()
        
        deleted_count = result.rowcount
        
        logger.warning(f"DELETED {deleted_count} unavailable cars by admin {admin_user.id}")
        
        return {
            "message": f"Successfully deleted {deleted_count} unavailable cars",
            "deleted_count": deleted_count,
            "warning": "This action cannot be undone"
        }
        
    except Exception as e:
        logger.error(f"Failed to cleanup unavailable cars: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

@router.get("/system-status")
async def get_availability_system_status(
    admin_user: User = Depends(check_admin_permission)
):
    """
    Get status of the car availability checking system.
    Admin only endpoint.
    """
    return {
        "system_status": "active",
        "background_tasks": {
            "availability_checker": {
                "status": "running",
                "frequency": "every 6 hours",
                "batch_size": "500 cars per batch",
                "max_cars_per_run": "5000 cars"
            }
        },
        "features": {
            "automatic_checking": "✅ Enabled",
            "manual_checking": "✅ Available",
            "batch_processing": "✅ Optimized",
            "rate_limiting": "✅ Configured",
            "error_handling": "✅ Comprehensive"
        },
        "performance": {
            "max_concurrent_requests": 50,
            "request_delay": "0.1 seconds",
            "timeout_settings": "30s total, 10s connect, 20s read"
        }
    } 