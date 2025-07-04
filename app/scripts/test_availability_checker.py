#!/usr/bin/env python3
"""
Test script for car availability checker functionality.
This script demonstrates how to use the car availability checking system.
"""

import asyncio
import sys
import os

# Add the parent directory to the path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.car_availability_checker import (
    CarAvailabilityChecker, 
    check_and_update_car_availability,
    get_availability_stats,
    test_single_car_availability
)
from app.database.sqlite import get_db
from app.models.car import Car
from sqlalchemy.sql import text
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_single_car():
    """Test availability checking for a single car."""
    print("\n🔍 Testing single car availability check...")
    
    # Get a sample car from database
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        car = db.execute(text("""
            SELECT id, url, brand, model, status 
            FROM cars 
            WHERE url IS NOT NULL AND url != '' 
            LIMIT 1
        """)).fetchone()
        
        if not car:
            print("❌ No cars with URLs found in database")
            return
        
        print(f"📋 Testing car: {car.brand} {car.model} (ID: {car.id})")
        print(f"🔗 URL: {car.url}")
        print(f"📊 Current status: {car.status}")
        
        # Test the availability
        is_available = await test_single_car_availability(car.id, car.url)
        
        print(f"✅ Availability check result: {'Available' if is_available else 'Unavailable'}")
        
        if car.status == 'available' and not is_available:
            print("⚠️  Recommendation: This car should be marked as unavailable")
        elif car.status == 'unavailable' and is_available:
            print("⚠️  Recommendation: This car could be reactivated")
        else:
            print("✅ Database status matches availability check")
            
    finally:
        db.close()

async def test_batch_check():
    """Test batch availability checking."""
    print("\n🔍 Testing batch availability check...")
    
    # Run a small batch check
    print("🚀 Starting batch check for up to 50 cars...")
    await check_and_update_car_availability(batch_size=10, max_cars_per_run=50)
    print("✅ Batch check completed")

async def show_stats():
    """Show availability statistics."""
    print("\n📊 Car Availability Statistics")
    print("=" * 50)
    
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        stats = await get_availability_stats(db)
        
        print(f"📈 Total cars: {stats.get('total_cars', 0):,}")
        print(f"✅ Available cars: {stats.get('available', 0):,} ({stats.get('available_percentage', 0)}%)")
        print(f"❌ Unavailable cars: {stats.get('unavailable', 0):,} ({stats.get('unavailable_percentage', 0)}%)")
        print(f"❓ Other status: {stats.get('other', 0):,}")
        
        # Show sample unavailable cars
        unavailable_cars = db.execute(text("""
            SELECT id, brand, model, url, status
            FROM cars 
            WHERE status = 'unavailable'
            LIMIT 5
        """)).fetchall()
        
        if unavailable_cars:
            print(f"\n📋 Sample unavailable cars:")
            for car in unavailable_cars:
                print(f"   - {car.brand} {car.model} (ID: {car.id})")
        
    except Exception as e:
        print(f"❌ Error getting stats: {e}")
    finally:
        db.close()

async def test_checker_class():
    """Test the CarAvailabilityChecker class directly."""
    print("\n🔍 Testing CarAvailabilityChecker class...")
    
    # Sample test URLs (these are just examples)
    test_cars = [
        {"id": "test1", "url": "https://httpbin.org/status/200"},  # Should be available
        {"id": "test2", "url": "https://httpbin.org/status/404"},  # Should be unavailable
        {"id": "test3", "url": "https://nonexistent-domain-12345.com/"},  # Should be unavailable
    ]
    
    async with CarAvailabilityChecker(max_concurrent_requests=3) as checker:
        results = await checker.check_batch_availability(test_cars)
        
        print("📋 Test Results:")
        for car_id, is_available in results.items():
            status = "✅ Available" if is_available else "❌ Unavailable"
            print(f"   {car_id}: {status}")

async def main():
    """Main test function."""
    print("🚗 Car Availability Checker Test Suite")
    print("=" * 50)
    
    try:
        # Show current stats
        await show_stats()
        
        # Test single car check
        await test_single_car()
        
        # Test the checker class with sample URLs
        await test_checker_class()
        
        # Optionally run a small batch check
        print("\n❓ Would you like to run a batch availability check? (y/n): ", end="")
        # In a real interactive environment, you could get user input
        # For this test, we'll skip it
        print("Skipped (test mode)")
        
        print("\n✅ All tests completed successfully!")
        print("\n📝 Usage Instructions:")
        print("1. Use the admin API endpoints to manage car availability")
        print("2. Access /api/admin/availability/stats for statistics")
        print("3. Use /api/admin/availability/check/manual for batch checks")
        print("4. The system automatically runs availability checks every 6 hours")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        logger.exception("Test error")

if __name__ == "__main__":
    # Run the test
    asyncio.run(main()) 