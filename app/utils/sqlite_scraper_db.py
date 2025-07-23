#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
SQLite Database Interface for Car Scraper
Directly adds cars to SQLite database instead of MySQL
"""

import sqlite3
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

class SQLiteScraperDB:
    """SQLite database interface for scraper operations"""
    
    def __init__(self, db_path: str = "eucar_users.db"):
        self.db_path = db_path
        self.conn = None
        
    def get_connection(self):
        """Get SQLite connection"""
        if self.conn is None:
            self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
            self.conn.row_factory = sqlite3.Row  # Enable dict-like access
        return self.conn
    
    def close_connection(self):
        """Close SQLite connection"""
        if self.conn:
            self.conn.close()
            self.conn = None
    
    def execute_query(self, sql: str, params: tuple = None) -> Optional[List[Dict[str, Any]]]:
        """Execute a query and return results"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            if params:
                cursor.execute(sql, params)
            else:
                cursor.execute(sql)
            
            if sql.strip().upper().startswith('SELECT'):
                results = []
                for row in cursor.fetchall():
                    results.append(dict(row))
                return results
            else:
                conn.commit()
                return cursor.rowcount
                
        except Exception as e:
            logger.error(f"Database query error: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
    
    def insert_car(self, car_data: Dict[str, Any]) -> bool:
        """Insert a single car into the database"""
        try:
            # Calculate price_without_vat and total_price
            price = float(car_data.get('price', 0))
            vat_rate = 22.0  # Default VAT rate
            price_without_vat = price / (1 + vat_rate / 100)
            
            # Calculate total price with additional charges
            additional_charges = 1111.0 + 119.0 + 0.0 + 293.0 + 699.0 + 0.0 + 0.0  # services + inspection + delivery + tax + prep + fuel + warranty
            total_price = price + additional_charges
            
            sql = """
                INSERT OR REPLACE INTO cars (
                    id, brand, model, version, price, price_without_vat, mileage, 
                    age, power, gear, fuel, country, zipcode, images, url, attrs, 
                    year, CO2_emissions, engine_size, body_type, colour, features, 
                    total_price, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            
            params = (
                car_data.get('id', ''),
                car_data.get('brand', ''),
                car_data.get('model', ''),
                car_data.get('version', ''),
                price,
                price_without_vat,
                car_data.get('mileage', 0),
                car_data.get('age', 0),
                car_data.get('power', 0),
                car_data.get('gear', ''),
                car_data.get('fuel', ''),
                car_data.get('country', ''),
                car_data.get('zipcode', ''),
                json.dumps(car_data.get('images', [])),
                car_data.get('url', ''),
                json.dumps(car_data.get('attrs', {})),
                car_data.get('year', 0),
                car_data.get('CO2_emissions', ''),
                car_data.get('engine_size', ''),
                car_data.get('body_type', ''),
                car_data.get('colour', ''),
                json.dumps(car_data.get('features', [])),
                total_price,
                'available'
            )
            
            result = self.execute_query(sql, params)
            return result is not None
            
        except Exception as e:
            logger.error(f"Error inserting car {car_data.get('id', 'unknown')}: {e}")
            return False
    
    def insert_cars_batch(self, cars_data: List[Dict[str, Any]]) -> int:
        """Insert multiple cars in a batch"""
        success_count = 0
        
        for car_data in cars_data:
            if self.insert_car(car_data):
                success_count += 1
        
        logger.info(f"Inserted {success_count}/{len(cars_data)} cars into SQLite")
        return success_count
    
    def get_car_count(self) -> int:
        """Get total number of cars in database"""
        sql = "SELECT COUNT(*) as count FROM cars"
        result = self.execute_query(sql)
        return result[0]['count'] if result else 0
    
    def get_cars_by_brand_model(self, brand: str, model: str) -> List[Dict[str, Any]]:
        """Get cars by brand and model"""
        sql = "SELECT * FROM cars WHERE brand = ? AND model = ? AND status = 'available'"
        return self.execute_query(sql, (brand, model)) or []
    
    def update_car_status(self, car_id: str, status: str) -> bool:
        """Update car status"""
        sql = "UPDATE cars SET status = ? WHERE id = ?"
        result = self.execute_query(sql, (status, car_id))
        return result is not None
    
    def get_available_cars(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get available cars with limit"""
        sql = "SELECT * FROM cars WHERE status = 'available' LIMIT ?"
        return self.execute_query(sql, (limit,)) or []
    
    def search_cars(self, filters: Dict[str, Any], limit: int = 100) -> List[Dict[str, Any]]:
        """Search cars with filters"""
        conditions = ["status = 'available'"]
        params = []
        
        if filters.get('brand'):
            conditions.append("brand = ?")
            params.append(filters['brand'])
        
        if filters.get('model'):
            conditions.append("model = ?")
            params.append(filters['model'])
        
        if filters.get('min_price'):
            conditions.append("price >= ?")
            params.append(filters['min_price'])
        
        if filters.get('max_price'):
            conditions.append("price <= ?")
            params.append(filters['max_price'])
        
        if filters.get('fuel'):
            conditions.append("fuel = ?")
            params.append(filters['fuel'])
        
        if filters.get('gear'):
            conditions.append("gear = ?")
            params.append(filters['gear'])
        
        where_clause = " AND ".join(conditions)
        sql = f"SELECT * FROM cars WHERE {where_clause} LIMIT ?"
        params.append(limit)
        
        return self.execute_query(sql, tuple(params)) or []
    
    def create_tables_if_not_exist(self):
        """Create cars table if it doesn't exist"""
        sql = """
        CREATE TABLE IF NOT EXISTS cars (
            id TEXT PRIMARY KEY,
            brand TEXT NOT NULL,
            model TEXT NOT NULL,
            version TEXT,
            price REAL NOT NULL,
            price_without_vat REAL NOT NULL,
            mileage REAL,
            age REAL,
            power INTEGER,
            gear TEXT,
            fuel TEXT,
            country TEXT,
            zipcode TEXT,
            images TEXT,
            url TEXT,
            attrs TEXT,
            year INTEGER,
            CO2_emissions TEXT,
            engine_size TEXT,
            body_type TEXT,
            colour TEXT,
            features TEXT,
            total_price REAL,
            status TEXT DEFAULT 'available'
        )
        """
        self.execute_query(sql)
        logger.info("Cars table created/verified in SQLite database")


# Global instance
sqlite_db = SQLiteScraperDB() 