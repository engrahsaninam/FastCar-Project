#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
SQLite-based Car Scraper
Scrapes cars from AutoScout24 and directly adds them to SQLite database
"""

import asyncio
import aiohttp
import logging
import time
import json
import hashlib
from datetime import datetime
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
import random
import re

from app.utils.sqlite_scraper_db import sqlite_db

logger = logging.getLogger(__name__)

class SQLiteCarScraper:
    """Car scraper that directly adds to SQLite database"""
    
    def __init__(self, max_concurrent_requests: int = 5, request_delay: float = 2.0):
        self.max_concurrent_requests = max_concurrent_requests
        self.request_delay = request_delay
        self.session = None
        self.semaphore = asyncio.Semaphore(max_concurrent_requests)
        
    async def __aenter__(self):
        """Async context manager entry"""
        timeout = aiohttp.ClientTimeout(total=30, connect=10, sock_read=20)
        self.session = aiohttp.ClientSession(
            timeout=timeout,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    async def scrape_car_listings(self, brand: str, model: str, max_pages: int = 5) -> List[Dict[str, Any]]:
        """Scrape car listings for a specific brand and model"""
        cars = []
        
        for page in range(1, max_pages + 1):
            try:
                # Construct AutoScout24 URL
                url = f"https://www.autoscout24.com/lst/{brand}/{model}/?page={page}"
                
                async with self.semaphore:
                    await asyncio.sleep(random.uniform(1, self.request_delay))
                    
                    async with self.session.get(url) as response:
                        if response.status == 200:
                            html = await response.text()
                            
                            page_cars = self._parse_car_listings(html, brand, model)
                            cars.extend(page_cars)
                            
                            logger.info(f"📄 Scraped page {page} for {brand} {model}: {len(page_cars)} cars")
                            
                            # Stop if no cars found on this page
                            if not page_cars:
                                break
                        else:
                            logger.warning(f"⚠️ Failed to fetch page {page} for {brand} {model}: {response.status}")
                            break
                            
            except Exception as e:
                logger.error(f"💥 Error scraping page {page} for {brand} {model}: {e}")
                break
        
        logger.info(f"✅ Scraped {len(cars)} total cars for {brand} {model}")
        return cars
    
    def _parse_car_listings(self, html: str, brand: str, model: str) -> List[Dict[str, Any]]:
        """Parse car listings from HTML"""
        cars = []
        soup = BeautifulSoup(html, 'html.parser')
        
        # First try to get structured data from __NEXT_DATA__ script (like MySQL scraper)
        script = soup.find("script", {"id": "__NEXT_DATA__"})
        if script:
            try:
                raw_data = json.loads(script.text)
                listings = raw_data.get("props", {}).get("pageProps", {}).get("listings", [])
                
                logger.info(f"📋 Found {len(listings)} cars using JSON data")
                
                for listing in listings:
                    car_data = self._extract_car_data_from_json(listing, brand, model)
                    if car_data:
                        cars.append(car_data)
                
                return cars
                
            except Exception as e:
                logger.warning(f"⚠️ Failed to parse JSON data: {e}")
        
        # Fallback to HTML parsing if JSON data not available
        logger.info("🔄 Falling back to HTML parsing")
        
        # Try multiple selectors for AutoScout24's car listings
        selectors = [
            'article[data-testid="listing-item"]',
            'div[data-testid="listing-item"]',
            'article.listing-item',
            'div.listing-item',
            'article[class*="listing"]',
            'div[class*="listing"]',
            'article[class*="car"]',
            'div[class*="car"]',
            'article[class*="vehicle"]',
            'div[class*="vehicle"]'
        ]
        
        car_containers = []
        for selector in selectors:
            car_containers = soup.select(selector)
            if car_containers:
                logger.debug(f"Found {len(car_containers)} cars using selector: {selector}")
                break
        
        # If no cars found with selectors, try a more generic approach
        if not car_containers:
            # Look for any article or div that might contain car data
            car_containers = soup.find_all(['article', 'div'], class_=re.compile(r'item|card|listing|car|vehicle', re.I))
            logger.debug(f"Found {len(car_containers)} potential containers with generic approach")
        
        logger.info(f"📋 Found {len(car_containers)} car containers to parse")
        
        for container in car_containers:
            try:
                car_data = self._extract_car_data(container, brand, model)
                if car_data:
                    cars.append(car_data)
            except Exception as e:
                logger.debug(f"Error parsing car container: {e}")
                continue
        
        return cars
    
    def _extract_car_data_from_json(self, listing: Dict[str, Any], brand: str, model: str) -> Optional[Dict[str, Any]]:
        """Extract car data from JSON listing (like MySQL scraper)"""
        try:
            # Extract basic info
            car_id = listing.get("id", "")
            if not car_id:
                return None
            
            # Vehicle info
            vehicle_info = listing.get("vehicle", {})
            version = vehicle_info.get("modelVersionInput", "")
            
            # Location info
            location_data = listing.get("location", {})
            country = location_data.get("countryCode", "")
            zipcode = location_data.get("zip", "")
            
            # Vehicle details
            vehicle_details = listing.get("vehicleDetails", [])
            gear = ""
            fuel = ""
            power = 0
            
            for detail in vehicle_details:
                field_label = detail.get("iconName", "")
                field_value = detail.get("data", "")
                
                if field_label == "transmission":
                    gear = field_value.replace("- Gear", "").strip()
                elif field_label == "nozzle":
                    fuel = field_value.replace("- Fuel type", "").strip()
                elif field_label == "speedometer":
                    # Convert "110 kW (150 hp)" to "110"
                    power_match = re.search(r"(\d+)\s*kW", field_value)
                    if power_match:
                        power = int(power_match.group(1))
            
            # Images
            image_urls = listing.get("images", [])
            images = [image.replace("/250x188.webp", "") for image in image_urls]
            
            # Price, mileage, age from tracking
            tracking_data = listing.get("tracking", {})
            price = float(tracking_data.get("price", "0"))
            price = round(price, 2)
            
            mileage = 0
            try:
                mileage = float(tracking_data.get("mileage", "0"))
                mileage = round(mileage, 2)
            except:
                pass
            
            age = 0
            age_str = tracking_data.get("firstRegistration", "")
            if age_str:
                age_match = re.search(r"(\d+)-(\d+)", age_str)
                if age_match:
                    age = int(age_match.group(2)) + int(age_match.group(1)) / 12
                    age = round(age, 4)
            
            # URL
            url = listing.get("url", "")
            if url:
                url = f"https://www.autoscout24.com{url[1:]}"
            
            # Calculate year from age
            current_year = datetime.now().year
            year = current_year - int(age) if age > 0 else 0
            
            car_data = {
                'id': car_id,
                'brand': brand,
                'model': model,
                'version': version,
                'price': price,
                'mileage': mileage,
                'age': age,
                'power': power,
                'gear': gear,
                'fuel': fuel,
                'country': country,
                'zipcode': zipcode,
                'images': images,
                'url': url,
                'attrs': {},
                'year': year,
                'CO2_emissions': '',
                'engine_size': '',
                'body_type': '',
                'colour': '',
                'features': []
            }
            
            logger.debug(f"✅ Extracted car from JSON: {brand} {model} {year} - €{price:,}")
            return car_data
            
        except Exception as e:
            logger.debug(f"Error extracting car data from JSON: {e}")
            return None
    
    def _extract_car_data(self, container, brand: str, model: str) -> Optional[Dict[str, Any]]:
        """Extract car data from a container element (HTML fallback)"""
        try:
            # Extract car ID
            car_id = (
                container.get('data-id') or 
                container.get('id') or 
                container.get('data-listing-id') or
                f"{brand}_{model}_{hash(str(container))}"
            )
            
            # Extract price with multiple selectors
            price = 0
            price_selectors = [
                '[data-testid="price"]',
                '.price',
                '.cost',
                '[class*="price"]',
                '[class*="cost"]',
                'span[class*="price"]',
                'div[class*="price"]',
                '[data-testid="listing-price"]',
                '.listing-price'
            ]
            
            for selector in price_selectors:
                price_elem = container.select_one(selector)
                if price_elem:
                    price_text = price_elem.get_text().strip()
                    price = self._extract_price(price_text)
                    if price > 0:
                        break
            
            # Extract mileage with better patterns
            mileage = 0
            mileage_text = container.get_text()
            mileage_patterns = [
                r'(\d{1,3}(?:,\d{3})*)\s*(km|miles)',
                r'(\d+)\s*(km|miles)',
                r'(\d{1,3}(?:\.\d{3})*)\s*(km|miles)'
            ]
            
            for pattern in mileage_patterns:
                mileage_match = re.search(pattern, mileage_text, re.I)
                if mileage_match:
                    mileage_str = mileage_match.group(1).replace(',', '').replace('.', '')
                    mileage = int(mileage_str)
                    break
            
            # Extract year with better patterns
            year = 0
            year_patterns = [
                r'\b(19|20)\d{2}\b',
                r'(\d{4})\s*reg',
                r'(\d{4})\s*model'
            ]
            
            for pattern in year_patterns:
                year_match = re.search(pattern, container.get_text(), re.I)
                if year_match:
                    year = int(year_match.group(1))
                    break
            
            # Extract fuel type with more patterns
            fuel = ''
            fuel_patterns = [
                r'petrol', r'diesel', r'electric', r'hybrid', r'gasoline',
                r'benzine', r'plug-in', r'plug in', r'hydrogen'
            ]
            for pattern in fuel_patterns:
                fuel_match = re.search(pattern, container.get_text(), re.I)
                if fuel_match:
                    fuel = fuel_match.group().lower()
                    break
            
            # Extract gearbox with more patterns
            gear = ''
            gear_patterns = [
                r'manual', r'automatic', r'auto', r'cvt', r'semi-auto',
                r'semi automatic', r'robotized'
            ]
            for pattern in gear_patterns:
                gear_match = re.search(pattern, container.get_text(), re.I)
                if gear_match:
                    gear = gear_match.group().lower()
                    break
            
            # Extract power with better patterns
            power = 0
            power_patterns = [
                r'(\d+)\s*(hp|ps|kw)',
                r'(\d+)\s*bhp',
                r'(\d+)\s*horsepower'
            ]
            
            for pattern in power_patterns:
                power_match = re.search(pattern, container.get_text(), re.I)
                if power_match:
                    power = int(power_match.group(1))
                    # Convert HP to KW if needed (rough conversion)
                    if power_match.group(2).lower() in ['hp', 'ps', 'bhp', 'horsepower']:
                        power = int(power * 0.735)  # Convert HP to KW
                    break
            
            # Extract images with better handling
            images = []
            img_selectors = ['img', '[data-testid="image"]', '.car-image']
            
            for selector in img_selectors:
                img_elems = container.select(selector)
                for img_elem in img_elems:
                    src = img_elem.get('src') or img_elem.get('data-src') or img_elem.get('data-lazy-src')
                    if src:
                        if not src.startswith('http'):
                            src = f"https://www.autoscout24.com{src}"
                        images.append(src)
                if images:
                    break
            
            # Extract URL with better handling
            url = ''
            link_selectors = ['a[href]', '[data-testid="listing-link"]', '.listing-link']
            
            for selector in link_selectors:
                link_elem = container.select_one(selector)
                if link_elem:
                    url = link_elem.get('href')
                    if url and not url.startswith('http'):
                        url = f"https://www.autoscout24.com{url}"
                    break
            
            # Calculate age
            current_year = datetime.now().year
            age = current_year - year if year > 0 else 0
            
            # Extract additional info
            country = ''
            zipcode = ''
            version = ''
            
            # Try to extract version from text
            version_patterns = [
                r'(GTI|GTD|TSI|TDI|S|SE|Sport|Comfort|Executive)',
                r'(\d+\.\d+\s*[Tt]urbo)',
                r'(\d+\.\d+\s*[Ll]itre)'
            ]
            
            for pattern in version_patterns:
                version_match = re.search(pattern, container.get_text(), re.I)
                if version_match:
                    version = version_match.group(1)
                    break
            
            # Only return car data if we have at least a price or year
            if price > 0 or year > 0:
                car_data = {
                    'id': car_id,
                    'brand': brand,
                    'model': model,
                    'version': version,
                    'price': price,
                    'mileage': mileage,
                    'age': age,
                    'power': power,
                    'gear': gear,
                    'fuel': fuel,
                    'country': country,
                    'zipcode': zipcode,
                    'images': images,
                    'url': url,
                    'attrs': {},
                    'year': year,
                    'CO2_emissions': '',
                    'engine_size': '',
                    'body_type': '',
                    'colour': '',
                    'features': []
                }
                
                logger.debug(f"✅ Extracted car from HTML: {brand} {model} {year} - €{price:,}")
                return car_data
            else:
                logger.debug(f"⚠️ Skipping car with insufficient data: {brand} {model}")
                return None
            
        except Exception as e:
            logger.debug(f"Error extracting car data: {e}")
            return None
    
    def _extract_price(self, price_text: str) -> float:
        """Extract price from text"""
        try:
            # Remove currency symbols and spaces, keep only numbers
            price_match = re.search(r'[\d,]+', price_text.replace(' ', ''))
            if price_match:
                return float(price_match.group().replace(',', ''))
        except:
            pass
        return 0.0
    
    def _extract_number(self, text: str) -> int:
        """Extract number from text"""
        try:
            number_match = re.search(r'\d+', text)
            if number_match:
                return int(number_match.group())
        except:
            pass
        return 0


async def scrape_and_save_cars(brands_models: List[tuple], max_cars_per_brand: int = 50) -> int:
    """Main function to scrape cars and save to SQLite"""
    logger.info(f"🚀 Starting car scraping for {len(brands_models)} brand-model combinations")
    
    # Ensure cars table exists
    sqlite_db.create_tables_if_not_exist()
    
    total_cars_scraped = 0
    
    async with SQLiteCarScraper(max_concurrent_requests=3, request_delay=3.0) as scraper:
        for brand, model in brands_models:
            try:
                logger.info(f"🔄 Scraping {brand} {model}...")
                
                # Scrape cars for this brand-model
                cars = await scraper.scrape_car_listings(brand, model, max_pages=3)
                
                # Limit cars per brand
                if len(cars) > max_cars_per_brand:
                    cars = cars[:max_cars_per_brand]
                
                # Save to SQLite
                if cars:
                    success_count = sqlite_db.insert_cars_batch(cars)
                    total_cars_scraped += success_count
                    logger.info(f"✅ Saved {success_count} cars for {brand} {model}")
                else:
                    logger.warning(f"⚠️ No cars found for {brand} {model}")
                
                # Delay between brands
                await asyncio.sleep(5)
                
            except Exception as e:
                logger.error(f"💥 Error scraping {brand} {model}: {e}")
                continue
    
    logger.info(f"🎉 Scraping completed! Total cars saved: {total_cars_scraped}")
    return total_cars_scraped


# Example usage
if __name__ == "__main__":
    # Example brand-model combinations
    brands_models = [
        ("volkswagen", "golf"),
        ("bmw", "3-series"),
        ("audi", "a4"),
        ("mercedes-benz", "c-class"),
        ("ford", "focus")
    ]
    
    asyncio.run(scrape_and_save_cars(brands_models)) 