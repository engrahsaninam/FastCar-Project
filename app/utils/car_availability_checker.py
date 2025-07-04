import asyncio
import aiohttp
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.database.sqlite import get_db
from app.models.car import Car
import time
from datetime import datetime, timedelta
import random

logger = logging.getLogger(__name__)

class CarAvailabilityChecker:
    """
    Efficient car availability checker with:
    - Async HTTP requests for parallel processing
    - Rate limiting to avoid overwhelming source websites
    - Batch processing for large datasets
    - Connection pooling for optimal performance
    - Proper error handling and retry logic
    """
    
    def __init__(self, max_concurrent_requests: int = 50, request_delay: float = 0.1):
        self.max_concurrent_requests = max_concurrent_requests
        self.request_delay = request_delay
        self.session = None
        self.semaphore = asyncio.Semaphore(max_concurrent_requests)
        
    async def __aenter__(self):
        """Async context manager entry"""
        connector = aiohttp.TCPConnector(
            limit=100,  # Connection pool limit
            limit_per_host=10,  # Max connections per host
            keepalive_timeout=30,
            enable_cleanup_closed=True
        )
        
        timeout = aiohttp.ClientTimeout(
            total=30,  # Total timeout
            connect=10,  # Connection timeout
            sock_read=20  # Socket read timeout
        )
        
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=timeout,
            headers={
                'User-Agent': 'FastCar-AvailabilityChecker/1.0'
            }
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    async def check_car_availability(self, car_id: str, car_url: str) -> bool:
        """
        Check if a single car is available by testing its URL.
        Returns True if available, False if not available.
        """
        if not car_url or car_url.strip() == "":
            logger.warning(f"Car {car_id} has empty URL")
            return False
        
        async with self.semaphore:
            try:
                # Add random delay to avoid overwhelming servers
                await asyncio.sleep(random.uniform(0.05, self.request_delay))
                
                async with self.session.head(car_url, allow_redirects=True) as response:
                    # Consider car available if we get any successful response
                    if response.status < 400:
                        logger.debug(f"Car {car_id} is available (status: {response.status})")
                        return True
                    else:
                        logger.info(f"Car {car_id} is unavailable (status: {response.status})")
                        return False
                        
            except asyncio.TimeoutError:
                logger.warning(f"Car {car_id} check timed out - marking as unavailable")
                return False
            except aiohttp.ClientError as e:
                logger.warning(f"Car {car_id} check failed with client error: {e}")
                return False
            except Exception as e:
                logger.error(f"Car {car_id} check failed with unexpected error: {e}")
                return False
    
    async def check_batch_availability(self, cars: List[Dict[str, Any]]) -> Dict[str, bool]:
        """
        Check availability for a batch of cars efficiently.
        Returns a dict mapping car_id to availability status.
        """
        if not cars:
            return {}
        
        logger.info(f"Checking availability for {len(cars)} cars")
        
        # Create tasks for all cars
        tasks = []
        for car in cars:
            task = self.check_car_availability(car['id'], car['url'])
            tasks.append((car['id'], task))
        
        # Execute all tasks concurrently
        results = {}
        completed_tasks = await asyncio.gather(*[task for _, task in tasks], return_exceptions=True)
        
        for (car_id, _), result in zip(tasks, completed_tasks):
            if isinstance(result, Exception):
                logger.error(f"Car {car_id} check failed: {result}")
                results[car_id] = False
            else:
                results[car_id] = result
        
        available_count = sum(1 for status in results.values() if status)
        unavailable_count = len(results) - available_count
        
        logger.info(f"Batch check completed: {available_count} available, {unavailable_count} unavailable")
        return results

async def update_car_availability_status(db: Session, availability_results: Dict[str, bool]):
    """
    Update car availability status in the database efficiently.
    Uses bulk update for better performance.
    """
    unavailable_cars = [car_id for car_id, is_available in availability_results.items() if not is_available]
    
    if not unavailable_cars:
        logger.info("No cars to mark as unavailable")
        return 0
    
    try:
        # Bulk update unavailable cars
        result = db.execute(
            text("""
                UPDATE cars 
                SET status = 'unavailable', 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id IN :car_ids AND status != 'unavailable'
            """),
            {"car_ids": tuple(unavailable_cars)}
        )
        
        db.commit()
        updated_count = result.rowcount
        logger.info(f"Marked {updated_count} cars as unavailable")
        return updated_count
        
    except Exception as e:
        logger.error(f"Failed to update car availability status: {e}")
        db.rollback()
        return 0

async def check_and_update_car_availability(batch_size: int = 1000, max_cars_per_run: int = 10000):
    """
    Main function to check and update car availability.
    Processes cars in batches for optimal performance.
    """
    logger.info("Starting car availability check process")
    start_time = time.time()
    
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        # Get cars that need availability check (currently marked as available)
        cars_to_check = db.execute(text("""
            SELECT id, url 
            FROM cars 
            WHERE status = 'available' 
              AND url IS NOT NULL 
              AND url != ''
            ORDER BY RANDOM()
            LIMIT :max_cars
        """), {"max_cars": max_cars_per_run}).fetchall()
        
        if not cars_to_check:
            logger.info("No cars found that need availability checking")
            return
        
        logger.info(f"Found {len(cars_to_check)} cars to check")
        
        total_updated = 0
        
        # Process cars in batches
        async with CarAvailabilityChecker() as checker:
            for i in range(0, len(cars_to_check), batch_size):
                batch = cars_to_check[i:i + batch_size]
                batch_cars = [{"id": car.id, "url": car.url} for car in batch]
                
                logger.info(f"Processing batch {i//batch_size + 1}: {len(batch_cars)} cars")
                
                # Check availability for this batch
                availability_results = await checker.check_batch_availability(batch_cars)
                
                # Update database with results
                updated_count = await update_car_availability_status(db, availability_results)
                total_updated += updated_count
                
                # Log progress
                progress = min(i + batch_size, len(cars_to_check))
                logger.info(f"Progress: {progress}/{len(cars_to_check)} cars processed")
        
        elapsed_time = time.time() - start_time
        logger.info(f"Car availability check completed in {elapsed_time:.2f} seconds")
        logger.info(f"Total cars marked as unavailable: {total_updated}")
        
    except Exception as e:
        logger.error(f"Car availability check failed: {e}")
        raise
    finally:
        db.close()

async def get_availability_stats(db: Session) -> Dict[str, Any]:
    """
    Get statistics about car availability.
    """
    try:
        result = db.execute(text("""
            SELECT 
                status,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cars), 2) as percentage
            FROM cars 
            GROUP BY status
        """)).fetchall()
        
        stats = {
            "total_cars": 0,
            "available": 0,
            "unavailable": 0,
            "other": 0,
            "available_percentage": 0.0,
            "unavailable_percentage": 0.0
        }
        
        for row in result:
            stats["total_cars"] += row.count
            if row.status == "available":
                stats["available"] = row.count
                stats["available_percentage"] = row.percentage
            elif row.status == "unavailable":
                stats["unavailable"] = row.count
                stats["unavailable_percentage"] = row.percentage
            else:
                stats["other"] += row.count
        
        return stats
        
    except Exception as e:
        logger.error(f"Failed to get availability stats: {e}")
        return {}

# Helper function for manual testing
async def test_single_car_availability(car_id: str, car_url: str) -> bool:
    """
    Test availability of a single car (for debugging/testing).
    """
    async with CarAvailabilityChecker(max_concurrent_requests=1) as checker:
        return await checker.check_car_availability(car_id, car_url) 