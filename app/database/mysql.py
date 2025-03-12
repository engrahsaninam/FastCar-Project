# app/database/mysql.py
import mysql.connector
from mysql.connector import pooling
from app.config import MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB
from typing import List, Dict, Any, Optional, Union
from app.utils.outlier_detection import filter_mysql_results
import time
import logging

logger = logging.getLogger(__name__)

# Simple cache for frequently accessed results
_query_cache = {}

# Create connection pool
pool = None

def initialize_pool():
    global pool
    pool = pooling.MySQLConnectionPool(
        pool_name="mysql_pool",
        pool_size=10,  # Increased from 5 to 10 for better concurrency
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        # Performance tuning
        connection_timeout=20,
        buffered=True
    )

def get_connection():
    """Get a connection from the pool"""
    if pool is None:
        initialize_pool()
    return pool.get_connection()

async def execute_query(
    query: str, 
    params: Optional[List[Any]] = None, 
    fetch: bool = True,
    remove_outliers: bool = True,
    outlier_method: str = 'iqr',
    use_cache: bool = True,
    cache_ttl: int = 300  # 5 minutes cache lifetime
) -> Union[List[Dict[str, Any]], int]:
    """
    Execute a MySQL query and return results if needed.
    
    Args:
        query: SQL query to execute
        params: Query parameters
        fetch: Whether to fetch results
        remove_outliers: Whether to remove outliers from results
        outlier_method: Method to use for outlier detection ('iqr' or 'zscore')
        use_cache: Whether to use query caching
        cache_ttl: Time-to-live for cache entries in seconds
        
    Returns:
        Query results or lastrowid if not fetching
    """
    start_time = time.time()
    
    # For cacheable SELECT queries, check cache first
    if use_cache and fetch and query.strip().upper().startswith("SELECT") and is_cacheable_query(query):
        cache_key = f"{query}:{str(params)}:{remove_outliers}"
        cached_result = get_from_cache(cache_key)
        if cached_result is not None:
            return cached_result
    
    # Execute query
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params or ())
        
        if fetch:
            result = cursor.fetchall()
            
            # Only process outliers for queries that might contain outliers
            if remove_outliers and result and is_data_query(query):
                result = filter_mysql_results(result, outlier_method)
            
            # Cache the result if appropriate
            if use_cache and query.strip().upper().startswith("SELECT") and is_cacheable_query(query):
                cache_key = f"{query}:{str(params)}:{remove_outliers}"
                add_to_cache(cache_key, result, cache_ttl)
                
            return result
        else:
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close()
        
        # Log slow queries for monitoring
        execution_time = time.time() - start_time
        if execution_time > 1.0:  # Log queries taking more than 1 second
            query_sample = query[:100] + "..." if len(query) > 100 else query
            logger.warning(f"Slow query ({execution_time:.2f}s): {query_sample}")

def is_data_query(query: str) -> bool:
    """
    Determine if a query is likely to return data that needs outlier checking.
    
    Args:
        query: SQL query string
        
    Returns:
        Boolean indicating if query should be checked for outliers
    """
    query = query.lower().strip()
    
    # Skip outlier processing for these types of queries
    skip_patterns = [
        "select count(", 
        "select min(", 
        "select max(", 
        "select distinct", 
        "select 1", 
        "show ",
        "describe "
    ]
    
    # Check if query contains aggregate functions that don't need outlier processing
    for pattern in skip_patterns:
        if pattern in query:
            return False
    
    # Process for regular SELECT queries
    return query.startswith("select ")

def is_cacheable_query(query: str) -> bool:
    """
    Determine if a query should be cached.
    Skip caching for very large result sets or constantly changing data.
    """
    query = query.lower().strip()
    
    # Don't cache these query types
    skip_cache_patterns = [
        "rand(", 
        "now(", 
        "current_timestamp",
        "select * from",  # Typically large result sets
    ]
    
    for pattern in skip_cache_patterns:
        if pattern in query:
            return False
            
    return True

def get_from_cache(key: str) -> Optional[List[Dict[str, Any]]]:
    """Get a query result from cache if it exists and is not expired."""
    if key in _query_cache:
        entry = _query_cache[key]
        if time.time() < entry["expires"]:
            return entry["data"]
        else:
            # Clean up expired entry
            del _query_cache[key]
    return None

def add_to_cache(key: str, data: List[Dict[str, Any]], ttl: int):
    """Add a query result to the cache with expiration time."""
    _query_cache[key] = {
        "data": data,
        "expires": time.time() + ttl
    }
    
    # Simple cache size management - if over 100 entries, clear oldest 20
    if len(_query_cache) > 100:
        # Sort by expiration time and remove oldest 20%
        sorted_keys = sorted(_query_cache.keys(), 
                           key=lambda k: _query_cache[k]["expires"])
        for old_key in sorted_keys[:20]:
            del _query_cache[old_key]

def clear_cache():
    """Clear the query cache."""
    global _query_cache
    _query_cache = {}

async def optimize_database():
    """Create basic indexes on the database to improve query performance."""
    recommended_indexes = [
        {"table": "cars", "columns": ["brand"], "name": "idx_cars_brand"},
        {"table": "cars", "columns": ["model"], "name": "idx_cars_model"},
        {"table": "cars", "columns": ["price"], "name": "idx_cars_price"},
        {"table": "cars", "columns": ["mileage"], "name": "idx_cars_mileage"}
    ]
    
    conn = get_connection()
    try:
        cursor = conn.cursor()
        
        # Create missing indexes
        for index in recommended_indexes:
            try:
                # Check if index exists
                check_query = """
                SELECT COUNT(*) AS index_exists
                FROM information_schema.statistics
                WHERE table_schema = DATABASE()
                AND table_name = %s
                AND index_name = %s
                """
                cursor.execute(check_query, (index["table"], index["name"]))
                result = cursor.fetchone()
                
                # Create index if it doesn't exist
                if result[0] == 0:
                    columns_str = ", ".join(index["columns"])
                    create_query = f"CREATE INDEX {index['name']} ON {index['table']} ({columns_str})"
                    cursor.execute(create_query)
                    conn.commit()
                    logger.info(f"Created index {index['name']} on {index['table']}")
            except Exception as e:
                logger.warning(f"Error creating index {index['name']}: {str(e)}")
        
        # Analyze table to update statistics
        try:
            cursor.execute("ANALYZE TABLE cars")
            conn.commit()
            logger.info("Analyzed cars table to update statistics")
        except Exception as e:
            logger.warning(f"Error analyzing table: {str(e)}")
            
    finally:
        conn.close()