"""
Efficient Car Availability Checker
- Async HTTP requests with connection pooling
- Intelligent batching and rate limiting
- Retry logic for network failures
- Soft deletion approach
- Progress tracking and logging
"""
import asyncio
import aiohttp
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from sqlalchemy import and_, or_
from app.database.sqlite import get_db
from app.models.car import Car
import time
import random

logger = logging.getLogger(__name__)

class CarAvailabilityChecker:
    def __init__(self, 
                 batch_size: int = 50,
                 max_concurrent: int = 10,
                 timeout: int = 15,
                 max_retries: int = 3,
                 retry_delay: float = 1.0,
                 rate_limit_delay: float = 0.1):
        self.batch_size = batch_size
        self.max_concurrent = max_concurrent
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.rate_limit_delay = rate_limit_delay
        
        # Statistics
        self.checked_count = 0
        self.unavailable_count = 0
        self.error_count = 0
        self.start_time = None
        
        # Create async session with connection pooling
        self.connector = aiohttp.TCPConnector(
            limit=max_concurrent,
            limit_per_host=5,
            ttl_dns_cache=300,
            ttl_connection_pool=60,
            enable_cleanup_closed=True
        )
        
        self.session = None
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            connector=self.connector,
            timeout=aiohttp.ClientTimeout(total=self.timeout),
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    async def check_single_url(self, url: str, car_id: str) -> Tuple[str, bool, str]:
        """
        Check if a single URL is available
        Returns: (car_id, is_available, error_message)
        """
        if not url or not url.startswith(('http://', 'https://')):
            return car_id, False, "Invalid URL format"
        
        for attempt in range(self.max_retries + 1):
            try:
                async with self.session.head(url, allow_redirects=True) as response:
                    # Consider car available if status is 200-299 or 3xx (redirects)
                    is_available = response.status < 400
                    
                    if is_available:
                        return car_id, True, ""
                    else:
                        # If it's a client error (4xx), likely permanently unavailable
                        if 400 <= response.status < 500:
                            return car_id, False, f"HTTP {response.status}"
                        # If it's a server error (5xx), might be temporary
                        elif response.status >= 500 and attempt < self.max_retries:
                            await asyncio.sleep(self.retry_delay * (2 ** attempt))
                            continue
                        else:
                            return car_id, False, f"HTTP {response.status}"
            
            except aiohttp.ClientError as e:
                if attempt < self.max_retries:
                    await asyncio.sleep(self.retry_delay * (2 ** attempt))
                    continue
                return car_id, False, f"Network error: {str(e)}"
            
            except asyncio.TimeoutError:
                if attempt < self.max_retries:
                    await asyncio.sleep(self.retry_delay * (2 ** attempt))
                    continue
                return car_id, False, "Timeout"
            
            except Exception as e:
                if attempt < self.max_retries:
                    await asyncio.sleep(self.retry_delay * (2 ** attempt))
                    continue
                return car_id, False, f"Unexpected error: {str(e)}"
        
        return car_id, False, "Max retries exceeded"
    
    async def check_batch_urls(self, car_data: List[Dict]) -> List[Tuple[str, bool, str]]:
        """
        Check a batch of URLs concurrently
        """
        # Add random delay to avoid overwhelming servers
        await asyncio.sleep(random.uniform(0.1, 0.5))
        
        # Create semaphore to limit concurrent requests
        semaphore = asyncio.Semaphore(self.max_concurrent)
        
        async def check_with_semaphore(car):
            async with semaphore:
                result = await self.check_single_url(car['url'], car['id'])
                # Rate limiting between requests
                await asyncio.sleep(self.rate_limit_delay)
                return result
        
        # Execute all checks concurrently
        tasks = [check_with_semaphore(car) for car in car_data]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle exceptions
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                car_id = car_data[i]['id']
                processed_results.append((car_id, False, f"Exception: {str(result)}"))
                logger.error(f"Error checking car {car_id}: {str(result)}")
            else:
                processed_results.append(result)
        
        return processed_results
    
    def update_car_availability(self, db: Session, results: List[Tuple[str, bool, str]]):
        """
        Update car availability in database - DELETE unavailable cars immediately
        """
        current_time = datetime.utcnow()
        
        # Prepare batch updates
        available_cars = []
        unavailable_car_ids = []
        
        for car_id, is_available, error_msg in results:
            if is_available:
                available_cars.append({
                    'id': car_id,
                    'is_available': True,
                    'last_checked': current_time,
                    'check_attempts': 0,
                    'unavailable_since': None
                })
            else:
                unavailable_car_ids.append(car_id)
                self.unavailable_count += 1
                logger.warning(f"Car {car_id} will be DELETED (unavailable): {error_msg}")
        
        # Batch update available cars
        if available_cars:
            db.execute(
                text("""
                    UPDATE cars 
                    SET is_available = :is_available,
                        last_checked = :last_checked,
                        check_attempts = :check_attempts,
                        unavailable_since = :unavailable_since
                    WHERE id = :id
                """),
                available_cars
            )
        
        # DELETE unavailable cars immediately
        if unavailable_car_ids:
            # Delete from cars table
            db.execute(
                text("DELETE FROM cars WHERE id IN ({})".format(
                    ','.join([':id{}'.format(i) for i in range(len(unavailable_car_ids))])
                )),
                {f'id{i}': car_id for i, car_id in enumerate(unavailable_car_ids)}
            )
            
            # Also clean up related data
            db.execute(
                text("DELETE FROM car_features WHERE car_id IN ({})".format(
                    ','.join([':id{}'.format(i) for i in range(len(unavailable_car_ids))])
                )),
                {f'id{i}': car_id for i, car_id in enumerate(unavailable_car_ids)}
            )
            
            logger.info(f"DELETED {len(unavailable_car_ids)} unavailable cars from database")
        
        db.commit()
        self.checked_count += len(results)
    
    async def check_cars_availability(self, 
                                    db: Session,
                                    priority_check: bool = False,
                                    max_cars: Optional[int] = None) -> Dict[str, any]:
        """
        Main method to check car availability
        """
        self.start_time = time.time()
        
        logger.info(f"Starting car availability check (priority: {priority_check})")
        
        # Build query to get cars that need checking
        query_conditions = []
        
        if priority_check:
            # Check cars that haven't been checked recently or have failed before
            query_conditions.append(
                or_(
                    Car.last_checked.is_(None),
                    Car.last_checked < datetime.utcnow() - timedelta(hours=24),
                    and_(
                        Car.check_attempts > 0,
                        Car.check_attempts < 3,
                        Car.last_checked < datetime.utcnow() - timedelta(hours=6)
                    )
                )
            )
        else:
            # Regular check: cars not checked in the last week
            query_conditions.append(
                or_(
                    Car.last_checked.is_(None),
                    Car.last_checked < datetime.utcnow() - timedelta(days=7)
                )
            )
        
        # Only check cars that have URLs (no need to check is_available since we delete unavailable cars)
        query_conditions.extend([
            Car.url.isnot(None),
            Car.url != ''
        ])
        
        # Get cars to check
        cars_query = db.query(Car).filter(and_(*query_conditions))
        
        if max_cars:
            cars_query = cars_query.limit(max_cars)
        
        cars_to_check = cars_query.all()
        
        if not cars_to_check:
            logger.info("No cars need availability checking")
            return {
                'status': 'completed',
                'checked_count': 0,
                'unavailable_count': 0,
                'duration': 0
            }
        
        logger.info(f"Found {len(cars_to_check)} cars to check")
        
        # Convert to list of dictionaries for processing
        car_data = [{'id': car.id, 'url': car.url} for car in cars_to_check]
        
        # Process in batches
        total_batches = (len(car_data) + self.batch_size - 1) // self.batch_size
        
        for batch_num in range(total_batches):
            start_idx = batch_num * self.batch_size
            end_idx = min(start_idx + self.batch_size, len(car_data))
            batch = car_data[start_idx:end_idx]
            
            logger.info(f"Processing batch {batch_num + 1}/{total_batches} ({len(batch)} cars)")
            
            try:
                # Check batch URLs
                results = await self.check_batch_urls(batch)
                
                # Update database
                self.update_car_availability(db, results)
                
                # Log progress
                progress = (batch_num + 1) / total_batches * 100
                logger.info(f"Progress: {progress:.1f}% - Checked: {self.checked_count}, Unavailable: {self.unavailable_count}")
                
            except Exception as e:
                logger.error(f"Error processing batch {batch_num + 1}: {str(e)}")
                self.error_count += 1
                continue
        
        duration = time.time() - self.start_time
        
        logger.info(f"Availability check completed in {duration:.2f}s")
        logger.info(f"Total checked: {self.checked_count}, Unavailable: {self.unavailable_count}, Errors: {self.error_count}")
        
        return {
            'status': 'completed',
            'checked_count': self.checked_count,
            'unavailable_count': self.unavailable_count,
            'error_count': self.error_count,
            'duration': duration
        }

# Utility functions
async def check_car_availability_batch(max_cars: int = 1000, priority_check: bool = False) -> Dict[str, any]:
    """
    Check car availability in batch
    """
    async with CarAvailabilityChecker(
        batch_size=50,
        max_concurrent=10,
        timeout=15,
        max_retries=2
    ) as checker:
        db_gen = get_db()
        db = next(db_gen)
        try:
            return await checker.check_cars_availability(db, priority_check, max_cars)
        finally:
            db.close()

async def cleanup_permanently_unavailable_cars(days_threshold: int = 30) -> int:
    """
    This function is now obsolete since we delete unavailable cars immediately.
    Kept for backward compatibility.
    """
    logger.info("Cleanup function called but not needed - cars are deleted immediately when unavailable")
    return 0

def get_availability_stats() -> Dict[str, any]:
    """
    Get car availability statistics
    """
    db_gen = get_db()
    db = next(db_gen)
    try:
        stats = db.execute(text("""
            SELECT 
                COUNT(*) as total_cars,
                COUNT(*) as available_cars,
                0 as unavailable_cars,
                SUM(CASE WHEN last_checked IS NULL THEN 1 ELSE 0 END) as never_checked,
                SUM(CASE WHEN last_checked < datetime('now', '-7 days') THEN 1 ELSE 0 END) as need_recheck
            FROM cars
        """)).fetchone()
        
        return {
            'total_cars': stats[0],
            'available_cars': stats[1],
            'unavailable_cars': stats[2],  # Always 0 since we delete unavailable cars
            'never_checked': stats[3],
            'need_recheck': stats[4]
        }
    finally:
        db.close()