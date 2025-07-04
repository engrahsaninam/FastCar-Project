"""
Admin API for Car Availability Management
- Check car availability manually
- View availability statistics
- Manage availability checking configuration
- Clean up permanently unavailable cars
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from app.api.auth import get_current_user
from app.models.user import User
from app.database.sqlite import get_db
from app.utils.car_availability_checker import (
    check_car_availability_batch,
    cleanup_permanently_unavailable_cars,
    get_availability_stats
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin/availability", tags=["admin-availability"])

def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency to require admin access"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/stats")
async def get_availability_statistics(admin_user: User = Depends(require_admin)) -> Dict[str, Any]:
    """
    Get comprehensive car availability statistics
    """
    logger.info(f"Admin {admin_user.username} requested availability stats")
    
    try:
        stats = get_availability_stats()
        return {
            "status": "success",
            "data": stats,
            "summary": {
                "availability_rate": f"{(stats['available_cars'] / stats['total_cars'] * 100):.2f}%" if stats['total_cars'] > 0 else "0%",
                "unavailable_rate": f"{(stats['unavailable_cars'] / stats['total_cars'] * 100):.2f}%" if stats['total_cars'] > 0 else "0%",
                "never_checked_rate": f"{(stats['never_checked'] / stats['total_cars'] * 100):.2f}%" if stats['total_cars'] > 0 else "0%"
            }
        }
    except Exception as e:
        logger.error(f"Error getting availability stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.post("/check")
async def trigger_availability_check(
    background_tasks: BackgroundTasks,
    max_cars: Optional[int] = 1000,
    priority_check: bool = False,
    admin_user: User = Depends(require_admin)
) -> Dict[str, Any]:
    """
    Trigger manual car availability check
    """
    logger.info(f"Admin {admin_user.username} triggered availability check (max_cars={max_cars}, priority={priority_check})")
    
    async def run_availability_check():
        """Background task to run availability check"""
        try:
            result = await check_car_availability_batch(max_cars, priority_check)
            logger.info(f"Availability check completed: {result}")
        except Exception as e:
            logger.error(f"Availability check failed: {e}")
    
    # Add to background tasks
    background_tasks.add_task(run_availability_check)
    
    return {
        "status": "initiated",
        "message": f"Car availability check started for up to {max_cars} cars",
        "priority_check": priority_check,
        "estimated_duration": f"{max_cars / 50 * 2} seconds",  # Rough estimate
        "admin_user": admin_user.username
    }

@router.post("/check-sync")
async def trigger_availability_check_sync(
    max_cars: Optional[int] = 100,
    priority_check: bool = False,
    admin_user: User = Depends(require_admin)
) -> Dict[str, Any]:
    """
    Trigger synchronous car availability check (smaller batches)
    """
    logger.info(f"Admin {admin_user.username} triggered sync availability check (max_cars={max_cars}, priority={priority_check})")
    
    try:
        result = await check_car_availability_batch(max_cars, priority_check)
        
        return {
            "status": "completed",
            "result": result,
            "admin_user": admin_user.username
        }
    except Exception as e:
        logger.error(f"Sync availability check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Availability check failed: {str(e)}")

@router.post("/cleanup")
async def cleanup_unavailable_cars(
    days_threshold: int = 30,
    admin_user: User = Depends(require_admin)
) -> Dict[str, Any]:
    """
    This endpoint is now obsolete since cars are deleted immediately when unavailable.
    Kept for backward compatibility.
    """
    logger.info(f"Admin {admin_user.username} called cleanup endpoint (now obsolete)")
    
    return {
        "status": "not_needed",
        "removed_count": 0,
        "admin_user": admin_user.username,
        "message": "Cleanup not needed - cars are automatically deleted when unavailable"
    }

@router.get("/config")
async def get_availability_config(admin_user: User = Depends(require_admin)) -> Dict[str, Any]:
    """
    Get current availability checking configuration
    """
    return {
        "status": "success",
        "config": {
            "batch_size": 50,
            "max_concurrent_requests": 10,
            "timeout_seconds": 15,
            "max_retries": 3,
            "retry_delay_seconds": 1.0,
            "rate_limit_delay_seconds": 0.1,
            "regular_check_interval_days": 7,
            "priority_check_interval_hours": 24,
            "cleanup_threshold_days": 30
        },
        "recommendations": {
            "regular_check_frequency": "Daily check of 1000 cars",
            "priority_check_frequency": "Hourly check of 100 cars with previous failures",
            "cleanup_frequency": "Weekly cleanup of cars unavailable for 30+ days"
        }
    }

@router.post("/config")
async def update_availability_config(
    config: Dict[str, Any],
    admin_user: User = Depends(require_admin)
) -> Dict[str, Any]:
    """
    Update availability checking configuration (placeholder for future implementation)
    """
    logger.info(f"Admin {admin_user.username} attempted to update config: {config}")
    
    return {
        "status": "not_implemented",
        "message": "Configuration updates will be implemented in future version",
        "received_config": config,
        "admin_user": admin_user.username
    }

@router.get("/recent-activity")
async def get_recent_availability_activity(
    limit: int = 50,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get recent availability checking activity
    """
    from sqlalchemy.sql import text
    
    try:
        # Get recently checked cars
        recent_checks = db.execute(text("""
            SELECT id, brand, model, is_available, last_checked, check_attempts, unavailable_since
            FROM cars 
            WHERE last_checked IS NOT NULL 
            ORDER BY last_checked DESC 
            LIMIT :limit
        """), {"limit": limit}).fetchall()
        
        # No unavailable cars to show since they are deleted immediately
        recent_unavailable = []
        
        return {
            "status": "success",
            "recent_checks": [
                {
                    "car_id": row[0],
                    "brand": row[1],
                    "model": row[2],
                    "is_available": bool(row[3]),
                    "last_checked": row[4].isoformat() if row[4] else None,
                    "check_attempts": row[5],
                    "unavailable_since": row[6].isoformat() if row[6] else None
                }
                for row in recent_checks
            ],
            "recent_unavailable": [],  # No unavailable cars since they are deleted immediately
            "admin_user": admin_user.username
        }
    except Exception as e:
        logger.error(f"Error getting recent activity: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get recent activity: {str(e)}") 