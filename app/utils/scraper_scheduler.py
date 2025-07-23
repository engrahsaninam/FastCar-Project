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
    from common import db_mysql, settings
    from common.logger import logger as scraper_logger
    from scraper import autoscout24_scraper
    from utils import image_downloader, image_task_handler
    SCRAPER_AVAILABLE = True
except ImportError as e:
    logging.warning(f"Scraper modules not available: {e}")
    SCRAPER_AVAILABLE = False
except Exception as e:
    logging.warning(f"Scraper configuration error: {e}")
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
        """Scrape a batch of cars"""
        if not SCRAPER_AVAILABLE:
            return
            
        start_time = time.time()
        self.last_run = datetime.now()
        self.total_runs += 1
        
        try:
            logger.info(f"🔄 Starting car scraping batch at {self.last_run}")
            
            # Check system resources before starting
            if not self._check_system_resources():
                logger.info("⏸️ Skipping scraper batch due to high system resource usage")
                return
            
            # Test database connection first
            try:
                test_sql = "SELECT 1"
                test_result = db_mysql.query_by_sql(test_sql)
                if test_result is None:
                    logger.error("💥 Database connection failed - skipping this batch")
                    self.failed_runs += 1
                    return
                logger.debug("✅ Database connection test successful")
            except Exception as db_error:
                logger.error(f"💥 Database connection error: {db_error}")
                self.failed_runs += 1
                return
            
            # Check if we have tasks to scrape
            sql = f"""
                SELECT COUNT(*) FROM tasks 
                WHERE source = '{settings.SOURCE_AUTOSCOUT24}' 
                AND status = {settings.STATUS_INIT}
            """
            result = db_mysql.query_by_sql(sql)
            
            if not result or result[0][0] == 0:
                logger.info("📝 No pending tasks found. Generating new tasks...")
                self._generate_tasks()
            
            # Get limited number of tasks for this batch
            sql = f"""
                SELECT id, source, context, unique_value, status, last_updated
                FROM tasks 
                WHERE source = '{settings.SOURCE_AUTOSCOUT24}' 
                AND status = {settings.STATUS_INIT}
                LIMIT {self.cars_per_batch}
            """
            tasks = db_mysql.query_by_sql(sql)
            
            if not tasks:
                logger.info("📭 No tasks available for scraping")
                return
                
            logger.info(f"📋 Found {len(tasks)} tasks to scrape in this batch")
            
            # Process each task with resource management
            processed_count = 0
            for i, task in enumerate(tasks):
                if not self.running:
                    break
                    
                # Add longer delay every 10 tasks to prevent overwhelming the system
                if i > 0 and i % 10 == 0:
                    logger.debug(f"⏸️  Taking a short break after {i} tasks to prevent system overload")
                    time.sleep(5)  # 5 second break every 10 tasks
                
                try:
                    task_id, source, context, unique_value, status, last_updated = task
                    logger.debug(f"🔍 Processing task {task_id} ({i+1}/{len(tasks)})")
                    
                    # Scrape the car listing
                    autoscout24_scraper.scrape_auto_scout24_listings(task)
                    processed_count += 1
                    
                    # Small delay between requests to avoid rate limiting
                    time.sleep(2)
                    
                except Exception as e:
                    # Get task_id safely for error handling
                    task_id = task[0] if task else "unknown"
                    logger.error(f"💥 Error processing task {task_id}: {str(e)}")
                    # Mark task as failed
                    if task_id != "unknown":
                        try:
                            db_mysql.update_task(task_id, settings.STATUS_REQ_FAILED)
                        except Exception as update_error:
                            logger.error(f"💥 Failed to update task {task_id} status: {update_error}")
                    
            run_time = time.time() - start_time
            self.successful_runs += 1
            
            logger.info(f"✅ Completed car scraping batch at {datetime.now()} - Processed {processed_count} tasks in {run_time:.2f}s")
            
        except Exception as e:
            self.failed_runs += 1
            run_time = time.time() - start_time
            logger.error(f"💥 Error in car scraping batch after {run_time:.2f}s: {str(e)}")
            logger.error(f"📋 Traceback: {traceback.format_exc()}")
            
    def _generate_tasks(self):
        """Generate new scraping tasks if needed"""
        if not SCRAPER_AVAILABLE:
            return
            
        try:
            logger.info("🔧 Generating new scraping tasks...")
            
            # Check if we have model tasks to create car tasks from
            sql = f"""
                SELECT COUNT(*) FROM model_tasks 
                WHERE source = '{settings.SOURCE_AUTOSCOUT24}' 
                AND status = {settings.STATUS_SUCCESS}
            """
            result = db_mysql.query_by_sql(sql)
            
            if result and result[0][0] > 0:
                # Generate tasks from successful model tasks
                autoscout24_scraper.build_auto_scout24_tasks()
                logger.info("✅ Generated new tasks from model tasks")
            else:
                # Generate model tasks first
                logger.info("🔧 No model tasks found. Generating model tasks first...")
                autoscout24_scraper.scrape_all_auto_scout24_models()
                
        except Exception as e:
            logger.error(f"💥 Error generating tasks: {str(e)}")
            
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