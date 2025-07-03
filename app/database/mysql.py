# app/database/mysql.py
import mysql.connector
from mysql.connector import pooling
from app.config import MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB
from typing import List, Dict, Any, Optional, Union
from app.utils.outlier_detection import filter_mysql_results
import time
import logging

logger = logging.getLogger(__name__)

# OPTIMIZED: Advanced cache with intelligent memory management
from collections import OrderedDict
import threading
import weakref

class AdvancedQueryCache:
    """
    High-performance query cache with:
    - O(1) LRU operations using OrderedDict
    - Intelligent memory management
    - Automatic cleanup of expired entries
    - Thread-safe operations
    """
    
    def __init__(self, max_size: int = 1000, max_memory_mb: int = 256):
        self.max_size = max_size
        self.max_memory_bytes = max_memory_mb * 1024 * 1024
        self.cache = OrderedDict()
        self.current_memory = 0
        self.hit_count = 0
        self.miss_count = 0
        self._lock = threading.RLock()
        self._memory_tracker = {}
    
    def get(self, key: str):
        """Get with O(1) LRU update"""
        with self._lock:
            if key in self.cache:
                entry = self.cache[key]
                if time.time() < entry["expires"]:
                    # Move to end (most recently used)
                    self.cache.move_to_end(key)
                    self.hit_count += 1
                    return entry["data"]
                else:
                    # Remove expired entry
                    self._remove_entry(key)
            
            self.miss_count += 1
            return None
    
    def set(self, key: str, data, ttl: int):
        """Set with intelligent memory management"""
        import sys
        data_size = sys.getsizeof(data)
        
        with self._lock:
            # Ensure capacity
            self._ensure_capacity(data_size)
            
            self.cache[key] = {
                "data": data,
                "expires": time.time() + ttl
            }
            self._memory_tracker[key] = data_size
            self.current_memory += data_size
    
    def _ensure_capacity(self, new_item_size: int):
        """Ensure cache has capacity with O(1) amortized complexity"""
        # Remove expired items first
        self._cleanup_expired()
        
        # Remove LRU items if needed
        while (len(self.cache) >= self.max_size or 
               self.current_memory + new_item_size > self.max_memory_bytes):
            
            if not self.cache:
                break
            
            # Remove least recently used (first item)
            oldest_key = next(iter(self.cache))
            self._remove_entry(oldest_key)
    
    def _remove_entry(self, key: str):
        """Remove entry and update memory tracking"""
        if key in self.cache:
            del self.cache[key]
            memory_size = self._memory_tracker.pop(key, 0)
            self.current_memory -= memory_size
    
    def _cleanup_expired(self):
        """Remove expired entries efficiently"""
        current_time = time.time()
        expired_keys = [
            key for key, entry in self.cache.items() 
            if entry["expires"] < current_time
        ]
        
        for key in expired_keys:
            self._remove_entry(key)
    
    def get_stats(self):
        """Get cache statistics"""
        with self._lock:
            total_requests = self.hit_count + self.miss_count
            hit_rate = (self.hit_count / total_requests * 100) if total_requests > 0 else 0
            
            return {
                'size': len(self.cache),
                'max_size': self.max_size,
                'memory_mb': self.current_memory / (1024 * 1024),
                'max_memory_mb': self.max_memory_bytes / (1024 * 1024),
                'hit_rate': f"{hit_rate:.2f}%",
                'hit_count': self.hit_count,
                'miss_count': self.miss_count
            }

# Global optimized cache instance
_query_cache = AdvancedQueryCache(max_size=1000, max_memory_mb=256)

# Create connection pool
pool = None

def initialize_pool():
    global pool
    pool = pooling.MySQLConnectionPool(
        pool_name="mysql_pool",
        pool_size=20,  # Increased for high concurrency
        pool_reset_session=True,  # Reset session variables
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        connection_timeout=30,  # Increased timeout
        buffered=True
    )

def get_connection():
    """Get a connection from the pool"""
    if pool is None:
        initialize_pool()
    return pool.get_connection()

def get_from_cache(key: str) -> Optional[List[Dict[str, Any]]]:
    """OPTIMIZED: Get query result with O(1) LRU cache operations."""
    return _query_cache.get(key)

def add_to_cache(key: str, data: List[Dict[str, Any]], ttl: int):
    """OPTIMIZED: Add to cache with intelligent memory management."""
    _query_cache.set(key, data, ttl)

def get_cache_stats() -> Dict[str, Any]:
    """Get comprehensive cache statistics for monitoring."""
    return _query_cache.get_stats()

def is_data_query(query: str) -> bool:
    """
    Determine if a query is likely to return data that needs outlier checking.
    """
    query = query.lower().strip()
    skip_patterns = [
        "select count(", 
        "select min(", 
        "select max(", 
        "select distinct", 
        "select 1", 
        "show ",
        "describe "
    ]
    for pattern in skip_patterns:
        if pattern in query:
            return False
    return query.startswith("select ")

def is_cacheable_query(query: str) -> bool:
    """
    Determine if a query should be cached.
    """
    query = query.lower().strip()
    skip_cache_patterns = [
        "rand(", 
        "now(", 
        "current_timestamp",
        "select * from",  # Avoid caching large result sets
    ]
    for pattern in skip_cache_patterns:
        if pattern in query:
            return False
    return True

async def execute_query(
    query: str, 
    params: Optional[List[Any]] = None, 
    fetch: bool = True,
    remove_outliers: bool = True,
    outlier_method: str = 'iqr',
    use_cache: bool = True,
    cache_ttl: int = 300
) -> Union[List[Dict[str, Any]], int]:
    """
    Execute a MySQL query and return results if needed.
    """
    start_time = time.time()
    
    # Check cache for SELECT queries
    if use_cache and fetch and query.strip().upper().startswith("SELECT") and is_cacheable_query(query):
        cache_key = f"{query}:{str(params)}:{remove_outliers}"
        cached_result = get_from_cache(cache_key)
        if cached_result is not None:
            return cached_result
    
    # Execute query with outlier filtering if needed
    if fetch and remove_outliers and is_data_query(query):
        result = await filter_mysql_results(query, params or [], outlier_method=outlier_method)
    else:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, params or ())
            if fetch:
                result = cursor.fetchall()
            else:
                conn.commit()
                result = cursor.lastrowid
        finally:
            conn.close()
    
    # Cache the result if appropriate
    if use_cache and fetch and query.strip().upper().startswith("SELECT") and is_cacheable_query(query):
        cache_key = f"{query}:{str(params)}:{remove_outliers}"
        add_to_cache(cache_key, result, cache_ttl)
    
    # Log slow queries
    execution_time = time.time() - start_time
    if execution_time > 1.0:
        query_sample = query[:100] + "..." if len(query) > 100 else query
        logger.warning(f"Slow query ({execution_time:.2f}s): {query_sample}")
    
    return result

def clear_cache():
    """OPTIMIZED: Clear the advanced cache with proper memory cleanup."""
    _query_cache.cache.clear()
    _query_cache._memory_tracker.clear()
    _query_cache.current_memory = 0
    _query_cache.hit_count = 0
    _query_cache.miss_count = 0

async def optimize_database():
    """Create optimized indexes for the cars table."""
    recommended_indexes = [
        {"table": "cars", "columns": ["brand"], "name": "idx_cars_brand"},
        {"table": "cars", "columns": ["model"], "name": "idx_cars_model"},
        {"table": "cars", "columns": ["price"], "name": "idx_cars_price"},
        {"table": "cars", "columns": ["mileage"], "name": "idx_cars_mileage"},
        {"table": "cars", "columns": ["brand", "model"], "name": "idx_cars_brand_model"},
        {"table": "cars", "columns": ["price", "mileage"], "name": "idx_cars_price_mileage"},
        {"table": "cars", "columns": ["id"], "name": "idx_cars_id", "type": "UNIQUE"},
        {
            "table": "cars",
            "columns": ["brand(50)", "model(50)", "price", "mileage", "age", "fuel(20)", "gear(20)"],
            "name": "idx_cars_covering",
        },
    ]
    
    conn = get_connection()
    try:
        cursor = conn.cursor()
        for index in recommended_indexes:
            try:
                check_query = """
                SELECT COUNT(*) AS index_exists
                FROM information_schema.statistics
                WHERE table_schema = DATABASE()
                AND table_name = %s
                AND index_name = %s
                """
                cursor.execute(check_query, (index["table"], index["name"]))
                result = cursor.fetchone()
                
                if result[0] == 0:
                    columns_str = ", ".join(index["columns"])
                    index_type = index.get("type", "")
                    create_query = f"CREATE {index_type} INDEX {index['name']} ON {index['table']} ({columns_str})"
                    cursor.execute(create_query)
                    conn.commit()
                    logger.info(f"Created index {index['name']} on {index['table']}")
            except Exception as e:
                logger.warning(f"Error creating index {index['name']}: {str(e)}")
        
        try:
            cursor.execute("ANALYZE TABLE cars")
            conn.commit()
            logger.info("Analyzed cars table to update statistics")
        except Exception as e:
            logger.warning(f"Error analyzing table: {str(e)}")
            
    finally:
        conn.close()