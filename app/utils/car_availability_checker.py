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
            logger.warning(f"[AVAILABILITY] Car {car_id} has empty URL - marking as unavailable")
            return False
        
        async with self.semaphore:
            start_time = time.time()
            try:
                # Add random delay to avoid overwhelming servers
                await asyncio.sleep(random.uniform(0.05, self.request_delay))
                
                logger.debug(f"[AVAILABILITY] Checking car {car_id} at URL: {car_url}")
                
                async with self.session.head(car_url, allow_redirects=True) as response:
                    check_time = time.time() - start_time
                    
                    # Consider car available if we get any successful response
                    if response.status < 400:
                        logger.info(f"[AVAILABILITY] ✅ Car {car_id} is AVAILABLE (status: {response.status}, time: {check_time:.2f}s)")
                        return True
                    else:
                        logger.warning(f"[AVAILABILITY] ❌ Car {car_id} is UNAVAILABLE (status: {response.status}, time: {check_time:.2f}s)")
                        return False
                        
            except asyncio.TimeoutError:
                check_time = time.time() - start_time
                logger.warning(f"[AVAILABILITY] ⏱️  Car {car_id} check TIMED OUT after {check_time:.2f}s - marking as unavailable")
                return False
            except aiohttp.ClientError as e:
                check_time = time.time() - start_time
                logger.warning(f"[AVAILABILITY] 🔗 Car {car_id} CLIENT ERROR after {check_time:.2f}s: {e}")
                return False
            except Exception as e:
                check_time = time.time() - start_time
                logger.error(f"[AVAILABILITY] 💥 Car {car_id} UNEXPECTED ERROR after {check_time:.2f}s: {e}")
                return False
    
    async def check_batch_availability(self, cars: List[Dict[str, Any]]) -> Dict[str, bool]:
        """
        Check availability for a batch of cars efficiently.
        Returns a dict mapping car_id to availability status.
        """
        if not cars:
            return {}
        
        batch_start_time = time.time()
        logger.info(f"[BATCH] 🚀 Starting availability check for {len(cars)} cars")
        
        # Create tasks for all cars
        tasks = []
        for i, car in enumerate(cars):
            task = self.check_car_availability(car['id'], car['url'])
            tasks.append((car['id'], task))
            
            # Log progress every 100 cars
            if (i + 1) % 100 == 0:
                logger.info(f"[BATCH] 📝 Created {i + 1}/{len(cars)} check tasks")
        
        logger.info(f"[BATCH] 🔄 Executing {len(tasks)} availability checks concurrently...")
        
        # Execute all tasks concurrently
        results = {}
        completed_tasks = await asyncio.gather(*[task for _, task in tasks], return_exceptions=True)
        
        # Process results with detailed logging
        error_count = 0
        for (car_id, _), result in zip(tasks, completed_tasks):
            if isinstance(result, Exception):
                logger.error(f"[BATCH] 💥 Car {car_id} check failed with exception: {result}")
                results[car_id] = False
                error_count += 1
            else:
                results[car_id] = result
        
        # Calculate and log statistics
        available_count = sum(1 for status in results.values() if status)
        unavailable_count = len(results) - available_count
        batch_time = time.time() - batch_start_time
        
        logger.info(f"[BATCH] ✅ Batch check completed in {batch_time:.2f}s")
        logger.info(f"[BATCH] 📊 Results: {available_count} available, {unavailable_count} unavailable, {error_count} errors")
        logger.info(f"[BATCH] ⚡ Performance: {len(cars)/batch_time:.1f} cars/second")
        
        return results

async def update_car_availability_status(db: Session, availability_results: Dict[str, bool]):
    """
    Remove unavailable cars from the database.
    Uses bulk delete for better performance.
    """
    unavailable_cars = [car_id for car_id, is_available in availability_results.items() if not is_available]
    
    if not unavailable_cars:
        logger.info("[DATABASE] 📊 No cars to remove - all cars are available!")
        return 0
    
    logger.info(f"[DATABASE] 🔄 Removing {len(unavailable_cars)} unavailable cars...")
    
    try:
        # Convert list to comma-separated string for SQL
        car_ids_str = "'" + "','".join(unavailable_cars) + "'"
        
        # Get car details before deletion for logging
        cars_to_delete = db.execute(
            text(f"""
                SELECT id, brand, model, price, url 
                FROM cars 
                WHERE id IN ({car_ids_str})
            """)
        ).fetchall()

        # Log details of each car being deleted
        for car in cars_to_delete:
            logger.warning(f"[DELETE] 🚗 Car being removed: ID={car.id}, {car.brand} {car.model}, Price=${car.price:,.2f}")
            logger.warning(f"[DELETE] 🔗 Unavailable URL: {car.url}")

        # Bulk delete unavailable cars
        result = db.execute(
            text(f"""
                DELETE FROM cars 
                WHERE id IN ({car_ids_str})
            """)
        )
        
        db.commit()
        deleted_count = result.rowcount
        
        if deleted_count > 0:
            logger.warning(f"[DATABASE] ❌ Removed {deleted_count} unavailable cars")
            logger.warning(f"[DATABASE] 📊 Deletion summary:")
            logger.warning(f"[DATABASE] 🔍 Cars checked: {len(unavailable_cars)}")
            logger.warning(f"[DATABASE] ❌ Cars deleted: {deleted_count}")
            logger.warning(f"[DATABASE] 📝 Deleted car IDs: {', '.join(unavailable_cars[:10])}{'...' if len(unavailable_cars) > 10 else ''}")
        else:
            logger.info(f"[DATABASE] ✅ No cars were deleted (they were already removed)")
            
        return deleted_count
        
    except Exception as e:
        logger.error(f"[DATABASE] 💥 Failed to remove unavailable cars: {e}")
        db.rollback()
        return 0

async def check_and_update_car_availability(batch_size: int = 1000, max_cars_per_run: int = 10000):
    """
    Main function to check and update car availability.
    Processes cars in batches for optimal performance.
    """
    logger.info("🚀 [SYSTEM] Starting car availability check process")
    system_start_time = time.time()
    
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        # Get total count of cars for statistics
        total_cars_count = db.execute(text("SELECT COUNT(*) FROM cars")).scalar()
        cars_with_urls = db.execute(text("SELECT COUNT(*) FROM cars WHERE url IS NOT NULL AND url != ''")).scalar()
        
        logger.info(f"[SYSTEM] 📊 Database statistics:")
        logger.info(f"[SYSTEM] 📊   Total cars: {total_cars_count}")
        logger.info(f"[SYSTEM] 📊   Cars with URLs: {cars_with_urls}")
        
        # Get cars that need availability check (all cars with valid URLs)
        if max_cars_per_run is None:
            logger.info("[SYSTEM] 🔍 Querying ALL cars to check")
            cars_to_check = db.execute(text("""
                SELECT id, url 
                FROM cars 
                WHERE url IS NOT NULL 
                  AND url != ''
                ORDER BY RANDOM()
            """)).fetchall()
        else:
            logger.info(f"[SYSTEM] 🔍 Querying cars to check (limit: {max_cars_per_run})")
            cars_to_check = db.execute(text("""
                SELECT id, url 
                FROM cars 
                WHERE url IS NOT NULL 
                  AND url != ''
                ORDER BY RANDOM()
                LIMIT :max_cars
            """), {"max_cars": max_cars_per_run}).fetchall()
        
        if not cars_to_check:
            logger.info("[SYSTEM] ✅ No cars found that need availability checking - all cars are already processed!")
            return
        
        logger.info(f"[SYSTEM] 🎯 Found {len(cars_to_check)} cars to check (batch size: {batch_size})")
        
        total_updated = 0
        total_batches = (len(cars_to_check) + batch_size - 1) // batch_size
        
        # Process cars in batches
        async with CarAvailabilityChecker() as checker:
            for i in range(0, len(cars_to_check), batch_size):
                batch_number = i // batch_size + 1
                batch = cars_to_check[i:i + batch_size]
                batch_cars = [{"id": car.id, "url": car.url} for car in batch]
                
                logger.info(f"[SYSTEM] 📦 Processing batch {batch_number}/{total_batches}: {len(batch_cars)} cars")
                
                # Check availability for this batch
                availability_results = await checker.check_batch_availability(batch_cars)
                
                # Remove unavailable cars from database
                deleted_count = await update_car_availability_status(db, availability_results)
                total_updated += deleted_count
                
                # Log progress
                progress = min(i + batch_size, len(cars_to_check))
                progress_percent = (progress / len(cars_to_check)) * 100
                logger.info(f"[SYSTEM] 📈 Progress: {progress}/{len(cars_to_check)} cars processed ({progress_percent:.1f}%)")
                
                # Log batch summary
                batch_available = sum(1 for status in availability_results.values() if status)
                batch_unavailable = len(availability_results) - batch_available
                logger.info(f"[SYSTEM] 📊 Batch {batch_number} summary: {batch_available} available, {batch_unavailable} unavailable")
        
        elapsed_time = time.time() - system_start_time
        processed_per_second = len(cars_to_check) / elapsed_time if elapsed_time > 0 else 0
        
        logger.info(f"[SYSTEM] 🎉 Car availability check completed!")
        logger.info(f"[SYSTEM] ⏱️  Total time: {elapsed_time:.2f} seconds")
        logger.info(f"[SYSTEM] 📊 Total cars processed: {len(cars_to_check)}")
        logger.info(f"[SYSTEM] ❌ Total cars removed: {total_updated}")
        logger.info(f"[SYSTEM] ⚡ Performance: {processed_per_second:.1f} cars/second")
        
        # Get final statistics
        final_total = db.execute(text("SELECT COUNT(*) FROM cars")).scalar()
        final_with_urls = db.execute(text("SELECT COUNT(*) FROM cars WHERE url IS NOT NULL AND url != ''")).scalar()
        
        logger.info(f"[SYSTEM] 📊 Final database state:")
        logger.info(f"[SYSTEM] 📊   Total cars: {final_total}")
        logger.info(f"[SYSTEM] 📊   Cars with URLs: {final_with_urls}")
        
    except Exception as e:
        elapsed_time = time.time() - system_start_time
        logger.error(f"[SYSTEM] 💥 Car availability check failed after {elapsed_time:.2f}s: {e}")
        raise
    finally:
        db.close()

async def get_availability_stats(db: Session) -> Dict[str, Any]:
    """
    Get statistics about car database.
    """
    try:
        total_cars = db.execute(text("SELECT COUNT(*) FROM cars")).scalar()
        cars_with_urls = db.execute(text("SELECT COUNT(*) FROM cars WHERE url IS NOT NULL AND url != ''")).scalar()
        cars_without_urls = total_cars - cars_with_urls
        
        stats = {
            "total_cars": total_cars,
            "cars_with_urls": cars_with_urls,
            "cars_without_urls": cars_without_urls,
            "url_coverage_percentage": round((cars_with_urls / total_cars) * 100, 2) if total_cars > 0 else 0.0
        }
        
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