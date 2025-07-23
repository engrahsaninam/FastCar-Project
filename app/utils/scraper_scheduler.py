#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Integrated Car Scraper Scheduler for FastAPI
Runs the AutoScout24 scraper in parallel with the main application
"""

import asyncio
import threading
import time
import schedule
import sys
import pathlib
import logging
from datetime import datetime
from typing import Optional, Dict, Any
import traceback
import psutil

# Add scraper directory to path
scraper_path = pathlib.Path(__file__).parent.parent.parent / "scraper"
sys.path.append(str(scraper_path))

try:
    from app.utils.sqlite_scraper import scrape_and_save_cars
    SCRAPER_AVAILABLE = True
except ImportError as e:
    logging.warning(f"SQLite scraper modules not available: {e}")
    SCRAPER_AVAILABLE = False
except Exception as e:
    logging.warning(f"SQLite scraper configuration error: {e}")
    SCRAPER_AVAILABLE = False

logger = logging.getLogger(__name__)


class IntegratedCarScraperScheduler:
    """
    Integrated car scraper scheduler that runs alongside FastAPI
    Uses threading for the scheduler and asyncio for integration
    """
    
    def __init__(self, cars_per_batch: int = 100, interval_minutes: int = 30):
        self.running = False
        self.thread = None
        self.cars_per_batch = cars_per_batch
        self.interval_minutes = interval_minutes
        self.last_run = None
        self.total_runs = 0
        self.successful_runs = 0
        self.failed_runs = 0
        self.current_status = "stopped"
        self.max_concurrent_requests = 10  # Limit concurrent requests to avoid overwhelming the system
        self.request_timeout = 30  # Timeout for individual requests
        
        if not SCRAPER_AVAILABLE:
            logger.warning("⚠️ Scraper modules not available - scheduler will be disabled")
        
    def start(self) -> bool:
        """Start the scheduler in a separate thread"""
        if not SCRAPER_AVAILABLE:
            logger.error("❌ Cannot start scraper scheduler - modules not available")
            return False
            
        if self.running:
            logger.info("🔄 Scraper scheduler is already running")
            return True
            
        try:
            self.running = True
            self.current_status = "starting"
            self.thread = threading.Thread(target=self._run_scheduler, daemon=True)
            self.thread.start()
            self.current_status = "running"
            
            logger.info(f"🚀 Car scraper scheduler started - will scrape {self.cars_per_batch} cars every {self.interval_minutes} minutes")
            return True
            
        except Exception as e:
            self.running = False
            self.current_status = "error"
            logger.error(f"💥 Failed to start scraper scheduler: {e}")
            return False
        
    def stop(self) -> bool:
        """Stop the scheduler"""
        if not self.running:
            logger.info("🔄 Scraper scheduler is not running")
            return True
            
        try:
            self.running = False
            self.current_status = "stopping"
            
            if self.thread:
                self.thread.join(timeout=10)  # Wait up to 10 seconds
                
            self.current_status = "stopped"
            logger.info("🛑 Car scraper scheduler stopped")
            return True
            
        except Exception as e:
            logger.error(f"💥 Error stopping scraper scheduler: {e}")
            return False
        
    def _run_scheduler(self):
        """Main scheduler loop running in separate thread"""
        try:
            # Schedule the scraping job
            schedule.every(self.interval_minutes).minutes.do(self._scrape_cars_batch)
            
            logger.info(f"📅 Scraper scheduler configured: {self.cars_per_batch} cars every {self.interval_minutes} minutes")
            
            # Run the first batch after a longer delay to let the app fully initialize
            time.sleep(120)  # Wait 2 minutes before first run to ensure app is stable
            self._scrape_cars_batch()
            
            # Main scheduling loop with reduced frequency
            while self.running:
                try:
                    schedule.run_pending()
                    time.sleep(120)  # Check every 2 minutes instead of 1 minute
                except Exception as e:
                    logger.error(f"💥 Error in scraper scheduler loop: {str(e)}")
                    time.sleep(120)  # Wait before retrying
                    
        except Exception as e:
            logger.error(f"💥 Fatal error in scraper scheduler: {str(e)}")
            self.current_status = "error"
            self.running = False
                
    def _check_system_resources(self) -> bool:
        """Check if system has enough resources to run scraper"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            
            # Skip if CPU usage is too high (>80%)
            if cpu_percent > 80:
                logger.warning(f"⚠️ CPU usage too high ({cpu_percent:.1f}%) - skipping scraper batch")
                return False
                
            # Skip if memory usage is too high (>90%)
            if memory.percent > 90:
                logger.warning(f"⚠️ Memory usage too high ({memory.percent:.1f}%) - skipping scraper batch")
                return False
                
            # If memory is high but not critical, try to free some memory
            if memory.percent > 85:
                logger.info(f"🔄 Memory usage high ({memory.percent:.1f}%) - attempting memory cleanup")
                self._cleanup_memory()
                
            logger.debug(f"✅ System resources OK - CPU: {cpu_percent:.1f}%, Memory: {memory.percent:.1f}%")
            return True
            
        except Exception as e:
            logger.warning(f"⚠️ Could not check system resources: {e}")
            return True  # Continue if we can't check resources
    
    def _cleanup_memory(self):
        """Attempt to free some memory"""
        try:
            import gc
            gc.collect()  # Force garbage collection
            logger.debug("🧹 Memory cleanup completed")
        except Exception as e:
            logger.debug(f"🧹 Memory cleanup failed: {e}")
    
    def _scrape_cars_batch(self):
        """Scrape a batch of cars directly to SQLite"""
        if not SCRAPER_AVAILABLE:
            return
            
        start_time = time.time()
        self.last_run = datetime.now()
        self.total_runs += 1
        
        try:
            logger.info(f"🔄 Starting SQLite car scraping batch at {self.last_run}")
            
            # Check system resources before starting
            if not self._check_system_resources():
                logger.info("⏸️ Skipping scraper batch due to high system resource usage")
                return
            
            # Define brand-model combinations to scrape
            brands_models = [
                ("volkswagen", "golf"),
                ("bmw", "3-series"),
                ("audi", "a4"),
                ("mercedes-benz", "c-class"),
                ("ford", "focus"),
                ("toyota", "corolla"),
                ("honda", "civic"),
                ("volkswagen", "passat"),
                ("bmw", "5-series"),
                ("audi", "a6")
            ]
            
            # Limit the number of brand-model combinations based on batch size
            max_brands = min(self.cars_per_batch // 10, len(brands_models))
            selected_brands = brands_models[:max_brands]
            
            logger.info(f"📋 Scraping {len(selected_brands)} brand-model combinations")
            
            # Run the scraper asynchronously
            import asyncio
            try:
                # Create new event loop for this thread
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                # Run the scraper
                cars_scraped = loop.run_until_complete(
                    scrape_and_save_cars(selected_brands, max_cars_per_brand=self.cars_per_batch // len(selected_brands))
                )
                
                loop.close()
                
                run_time = time.time() - start_time
                self.successful_runs += 1
                
                logger.info(f"✅ Completed SQLite car scraping batch at {datetime.now()} - Scraped {cars_scraped} cars in {run_time:.2f}s")
                
            except Exception as e:
                logger.error(f"💥 Error in async scraping: {e}")
                self.failed_runs += 1
                
        except Exception as e:
            self.failed_runs += 1
            run_time = time.time() - start_time
            logger.error(f"💥 Error in car scraping batch after {run_time:.2f}s: {str(e)}")
            logger.error(f"📋 Traceback: {traceback.format_exc()}")
            
    def _generate_tasks(self):
        """Generate new scraping tasks if needed - Not used with SQLite scraper"""
        logger.debug("🔧 Task generation not needed with SQLite scraper")
        pass
            
    def set_batch_size(self, cars_per_batch: int):
        """Set the number of cars to scrape per batch"""
        self.cars_per_batch = cars_per_batch
        logger.info(f"📊 Batch size updated to {self.cars_per_batch} cars")
        
    def set_interval(self, interval_minutes: int):
        """Set the interval between batches in minutes"""
        self.interval_minutes = interval_minutes
        logger.info(f"⏰ Interval updated to {self.interval_minutes} minutes")
        
    def get_status(self) -> Dict[str, Any]:
        """Get current scheduler status"""
        return {
            'running': self.running,
            'status': self.current_status,
            'cars_per_batch': self.cars_per_batch,
            'interval_minutes': self.interval_minutes,
            'thread_alive': self.thread.is_alive() if self.thread else False,
            'last_run': self.last_run.isoformat() if self.last_run else None,
            'total_runs': self.total_runs,
            'successful_runs': self.successful_runs,
            'failed_runs': self.failed_runs,
            'scraper_available': SCRAPER_AVAILABLE
        }


# Global scheduler instance
scraper_scheduler = IntegratedCarScraperScheduler()


async def start_scraper_scheduler(cars_per_batch: int = 100, interval_minutes: int = 30) -> bool:
    """Start the car scraper scheduler asynchronously"""
    try:
        # Run the start method in a thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, scraper_scheduler.start)
        return result
    except Exception as e:
        logger.error(f"💥 Error starting scraper scheduler: {e}")
        return False


def is_scraper_available() -> bool:
    """Check if scraper modules are available"""
    return SCRAPER_AVAILABLE 