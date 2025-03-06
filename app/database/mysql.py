#app/database/mysql.py 
import mysql.connector
from mysql.connector import pooling
from app.config import MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB

# Create connection pool
pool = None

def initialize_pool():
    global pool
    pool = pooling.MySQLConnectionPool(
        pool_name="mysql_pool",
        pool_size=5,
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB
    )

def get_connection():
    """Get a connection from the pool"""
    if pool is None:
        initialize_pool()
    return pool.get_connection()

async def execute_query(query, params=None, fetch=True):
    """Execute a MySQL query and return results if needed"""
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params or ())
        
        if fetch:
            result = cursor.fetchall()
            return result
        else:
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close()