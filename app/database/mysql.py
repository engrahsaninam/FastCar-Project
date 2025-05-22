# app/database/mysql.py
import mysql.connector
from mysql.connector import pooling
from app.config import MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB
from typing import List, Dict, Any, Optional, Union
from app.utils.outlier_detection import filter_mysql_results
import time
import logging

logger = logging.getLogger(__name__)

# Simple in-memory cache
_query_cache = {}

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
    """Get a query result from in-memory cache if it exists and is not expired."""
    if key in _query_cache:
        entry = _query_cache[key]
        if time.time() < entry["expires"]:
            return entry["data"]
        else:
            del _query_cache[key]
    return None

def add_to_cache(key: str, data: List[Dict[str, Any]], ttl: int):
    """Add a query result to in-memory cache with expiration time."""
    _query_cache[key] = {
        "data": data,
        "expires": time.time() + ttl
    }
    
    # Manage cache size
    if len(_query_cache) > 100:
        sorted_keys = sorted(_query_cache.keys(), 
                           key=lambda k: _query_cache[k]["expires"])
        for old_key in sorted_keys[:20]:
            del _query_cache[old_key]

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
    """Clear the in-memory cache."""
    global _query_cache
    _query_cache = {}

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