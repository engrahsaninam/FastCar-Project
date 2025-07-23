#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2024-03-13
Desc   :  Scheduler for running car scraper in background threads
"""

import threading
import time
import schedule
import sys
import pathlib
from datetime import datetime
import logging

# Add parent directory to path
sys.path.append("{}/../".format(pathlib.Path(__file__).parent))

from common import db_mysql, settings
from common.logger import logger
from scraper import autoscout24_scraper
from utils import image_downloader, image_task_handler


class CarScraperScheduler:
    def __init__(self):
        self.running = False
        self.thread = None
        self.cars_per_batch = 100
        self.interval_minutes = 30
        
    def start(self):
        """Start the scheduler in a separate thread"""
        if self.running:
            logger.info("Scheduler is already running")
            return
            
        self.running = True
        self.thread = threading.Thread(target=self._run_scheduler, daemon=True)
        self.thread.start()
        logger.info(f"Car scraper scheduler started - will scrape {self.cars_per_batch} cars every {self.interval_minutes} minutes")
        
    def stop(self):
        """Stop the scheduler"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
        logger.info("Car scraper scheduler stopped")
        
    def _run_scheduler(self):
        """Main scheduler loop"""
        # Schedule the scraping job
        schedule.every(self.interval_minutes).minutes.do(self._scrape_cars_batch)
        
        logger.info(f"Scheduler configured: {self.cars_per_batch} cars every {self.interval_minutes} minutes")
        
        # Run the first batch immediately
        self._scrape_cars_batch()
        
        # Main scheduling loop
        while self.running:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except Exception as e:
                logger.error(f"Error in scheduler loop: {str(e)}")
                time.sleep(60)  # Wait before retrying
                
    def _scrape_cars_batch(self):
        """Scrape a batch of cars"""
        try:
            logger.info(f"Starting car scraping batch at {datetime.now()}")
            
            # Check if we have tasks to scrape
            sql = f"""
                SELECT COUNT(*) FROM tasks 
                WHERE source = '{settings.SOURCE_AUTOSCOUT24}' 
                AND status = {settings.STATUS_INIT}
            """
            result = db_mysql.query_by_sql(sql)
            if not result or result[0][0] == 0:
                logger.info("No pending tasks found. Generating new tasks...")
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
                logger.info("No tasks available for scraping")
                return
                
            logger.info(f"Found {len(tasks)} tasks to scrape in this batch")
            
            # Process each task
            for task in tasks:
                if not self.running:
                    break
                    
                try:
                    task_id, source, context, unique_value, status, last_updated = task
                    logger.info(f"Processing task {task_id}")
                    
                    # Scrape the car listing
                    autoscout24_scraper.scrape_auto_scout24_listings(task)
                    
                    # Small delay between requests to avoid rate limiting
                    time.sleep(2)
                    
                except Exception as e:
                    # Get task_id safely for error handling
                    task_id = task[0] if task else "unknown"
                    logger.error(f"Error processing task {task_id}: {str(e)}")
                    # Mark task as failed
                    if task_id != "unknown":
                        db_mysql.update_task(task_id, settings.STATUS_REQ_FAILED)
                    
            logger.info(f"Completed car scraping batch at {datetime.now()}")
            
        except Exception as e:
            logger.error(f"Error in car scraping batch: {str(e)}")
            
    def _generate_tasks(self):
        """Generate new scraping tasks if needed"""
        try:
            logger.info("Generating new scraping tasks...")
            
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
                logger.info("Generated new tasks from model tasks")
            else:
                # Generate model tasks first
                logger.info("No model tasks found. Generating model tasks first...")
                autoscout24_scraper.scrape_all_auto_scout24_models()
                
        except Exception as e:
            logger.error(f"Error generating tasks: {str(e)}")
            
    def set_batch_size(self, cars_per_batch):
        """Set the number of cars to scrape per batch"""
        self.cars_per_batch = cars_per_batch
        logger.info(f"Batch size updated to {self.cars_per_batch} cars")
        
    def set_interval(self, interval_minutes):
        """Set the interval between batches in minutes"""
        self.interval_minutes = interval_minutes
        logger.info(f"Interval updated to {self.interval_minutes} minutes")
        
    def get_status(self):
        """Get current scheduler status"""
        return {
            'running': self.running,
            'cars_per_batch': self.cars_per_batch,
            'interval_minutes': self.interval_minutes,
            'thread_alive': self.thread.is_alive() if self.thread else False
        }


# Global scheduler instance
scheduler = CarScraperScheduler()


def start_scheduler(cars_per_batch=100, interval_minutes=30):
    """Start the car scraper scheduler"""
    scheduler.set_batch_size(cars_per_batch)
    scheduler.set_interval(interval_minutes)
    scheduler.start()
    return scheduler


def stop_scheduler():
    """Stop the car scraper scheduler"""
    scheduler.stop()


def get_scheduler_status():
    """Get the current status of the scheduler"""
    return scheduler.get_status()


# if __name__ == "__main__":
    # Example usage
    # print("Starting car scraper scheduler...")
    # start_scheduler(cars_per_batch=100, interval_minutes=30)
    
    # try:
    #     # Keep the main thread alive
    #     while True:
    #         time.sleep(60)
    #         status = get_scheduler_status()
    #         print(f"Scheduler status: {status}")
    # except KeyboardInterrupt:
    #     print("Stopping scheduler...")
    #     stop_scheduler()
    #     print("Scheduler stopped") 