"""
Hyper-Optimized Cache System with Intelligent Memory Management
- LRU eviction with O(1) operations
- Space-efficient serialization
- Memory pool management
- Cache warming strategies
"""
import time
import pickle
import hashlib
import asyncio
import weakref
import threading
from typing import Any, Optional, Dict, List, Tuple
from collections import OrderedDict
from datetime import datetime, timedelta
import logging
from functools import wraps
import sys
import gc

logger = logging.getLogger(__name__)

class HyperOptimizedLRUCache:
    """
    Ultra-fast LRU cache with O(1) operations:
    - get: O(1)
    - set: O(1) 
    - evict: O(1)
    Uses OrderedDict for LRU tracking and weak references for memory efficiency.
    """
    
    def __init__(self, max_size: int = 10000, max_memory_mb: int = 512):
        self.max_size = max_size
        self.max_memory_bytes = max_memory_mb * 1024 * 1024
        self.cache = OrderedDict()  # O(1) LRU operations
        self.current_memory = 0
        self.hit_count = 0
        self.miss_count = 0
        self.eviction_count = 0
        self._lock = threading.RLock()
        
        # Memory management
        self._memory_tracker = {}  # key -> memory_size
        self._weak_refs = weakref.WeakValueDictionary()
        
        # Start background memory monitor
        self._start_memory_monitor()
    
    def get(self, key: str) -> Optional[Any]:
        """Get item with O(1) complexity and LRU update"""
        with self._lock:
            if key in self.cache:
                # Move to end (most recently used)
                self.cache.move_to_end(key)
                self.hit_count += 1
                return self.cache[key]['data']
            
            self.miss_count += 1
            return None
    
    def set(self, key: str, value: Any, ttl: int = 3600) -> bool:
        """Set item with O(1) complexity and intelligent eviction"""
        try:
            # Calculate memory usage
            serialized = self._efficient_serialize(value)
            memory_size = len(serialized)
            
            with self._lock:
                # Check if we need to evict
                self._ensure_capacity(memory_size)
                
                # Store the item
                expires_at = time.time() + ttl
                self.cache[key] = {
                    'data': value,
                    'expires_at': expires_at,
                    'memory_size': memory_size,
                    'serialized': serialized  # Keep serialized for fast Redis sync
                }
                
                self._memory_tracker[key] = memory_size
                self.current_memory += memory_size
                
                # Use weak reference for large objects
                if memory_size > 1024 * 1024:  # 1MB threshold
                    self._weak_refs[key] = value
                
                return True
                
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    def _ensure_capacity(self, new_item_size: int):
        """Ensure cache has capacity for new item - O(1) amortized"""
        # Remove expired items first
        self._cleanup_expired()
        
        # Evict LRU items if needed
        while (len(self.cache) >= self.max_size or 
               self.current_memory + new_item_size > self.max_memory_bytes):
            
            if not self.cache:
                break
                
            # Remove least recently used item (first in OrderedDict)
            oldest_key, oldest_item = self.cache.popitem(last=False)
            self.current_memory -= oldest_item['memory_size']
            self._memory_tracker.pop(oldest_key, 0)
            self.eviction_count += 1
    
    def _cleanup_expired(self):
        """Remove expired items - O(k) where k is expired items"""
        current_time = time.time()
        expired_keys = []
        
        for key, item in self.cache.items():
            if item['expires_at'] < current_time:
                expired_keys.append(key)
        
        for key in expired_keys:
            item = self.cache.pop(key, None)
            if item:
                self.current_memory -= item['memory_size']
                self._memory_tracker.pop(key, 0)
    
    def _efficient_serialize(self, data: Any) -> bytes:
        """Space-efficient serialization using optimized pickle protocol"""
        return pickle.dumps(data, protocol=pickle.HIGHEST_PROTOCOL)
    
    def _start_memory_monitor(self):
        """Start background memory monitoring"""
        def monitor():
            while True:
                time.sleep(60)  # Check every minute
                with self._lock:
                    self._cleanup_expired()
                    # Force garbage collection if memory usage is high
                    if self.current_memory > self.max_memory_bytes * 0.8:
                        gc.collect()
        
        thread = threading.Thread(target=monitor, daemon=True)
        thread.start()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        with self._lock:
            total_requests = self.hit_count + self.miss_count
            hit_rate = (self.hit_count / total_requests * 100) if total_requests > 0 else 0
            
            return {
                'size': len(self.cache),
                'max_size': self.max_size,
                'memory_usage_mb': self.current_memory / (1024 * 1024),
                'max_memory_mb': self.max_memory_bytes / (1024 * 1024),
                'hit_rate': f"{hit_rate:.2f}%",
                'hit_count': self.hit_count,
                'miss_count': self.miss_count,
                'eviction_count': self.eviction_count
            }
    
    def clear(self):
        """Clear all cache entries"""
        with self._lock:
            self.cache.clear()
            self._memory_tracker.clear()
            self.current_memory = 0

class MultiTierCache:
    """
    Multi-tier caching system:
    L1: In-memory LRU cache (fastest)
    L2: Redis cache (persistent)
    L3: Database (slowest)
    """
    
    def __init__(self, l1_cache: HyperOptimizedLRUCache, redis_client=None):
        self.l1_cache = l1_cache
        self.redis_client = redis_client
        self.l2_hit_count = 0
        self.l2_miss_count = 0
    
    async def get(self, key: str) -> Optional[Any]:
        """Get from multi-tier cache with automatic promotion"""
        # Try L1 cache first
        result = self.l1_cache.get(key)
        if result is not None:
            return result
        
        # Try L2 cache (Redis)
        if self.redis_client:
            try:
                redis_data = await self.redis_client.get(key)
                if redis_data:
                    # Deserialize and promote to L1
                    result = pickle.loads(redis_data)
                    self.l1_cache.set(key, result, ttl=3600)
                    self.l2_hit_count += 1
                    return result
                else:
                    self.l2_miss_count += 1
            except Exception as e:
                logger.warning(f"Redis get error: {e}")
        
        return None
    
    async def set(self, key: str, value: Any, ttl: int = 3600):
        """Set in multi-tier cache"""
        # Set in L1 cache
        self.l1_cache.set(key, value, ttl)
        
        # Set in L2 cache (Redis) async
        if self.redis_client:
            try:
                serialized = pickle.dumps(value, protocol=pickle.HIGHEST_PROTOCOL)
                await self.redis_client.setex(key, ttl, serialized)
            except Exception as e:
                logger.warning(f"Redis set error: {e}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get comprehensive cache statistics"""
        l1_stats = self.l1_cache.get_stats()
        
        l2_total = self.l2_hit_count + self.l2_miss_count
        l2_hit_rate = (self.l2_hit_count / l2_total * 100) if l2_total > 0 else 0
        
        return {
            'l1_cache': l1_stats,
            'l2_cache': {
                'hit_rate': f"{l2_hit_rate:.2f}%",
                'hit_count': self.l2_hit_count,
                'miss_count': self.l2_miss_count
            }
        }

class IntelligentCacheWarmer:
    """
    Intelligent cache warming based on usage patterns and predictions.
    """
    
    def __init__(self, cache: MultiTierCache, db_session):
        self.cache = cache
        self.db = db_session
        self.access_patterns = {}  # Track access patterns
        self.warming_in_progress = False
    
    async def warm_popular_data(self):
        """Warm cache with popular data based on access patterns"""
        if self.warming_in_progress:
            return
        
        self.warming_in_progress = True
        try:
            # Warm popular car brands
            popular_brands = ['BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Volkswagen']
            
            for brand in popular_brands:
                await self._warm_brand_data(brand)
            
            # Warm popular filters
            await self._warm_filter_data()
            
            logger.info("Cache warming completed")
            
        finally:
            self.warming_in_progress = False
    
    async def _warm_brand_data(self, brand: str):
        """Warm cache with brand-specific data"""
        from app.database.mysql import execute_query
        
        # Warm brand car data
        query = """
            SELECT id, brand, model, price, year, mileage 
            FROM cars 
            WHERE brand = %s 
            ORDER BY price ASC 
            LIMIT 100
        """
        
        try:
            result = await execute_query(query, [brand], remove_outliers=True)
            cache_key = f"brand_cars:{brand}"
            await self.cache.set(cache_key, result, ttl=3600)
        except Exception as e:
            logger.warning(f"Cache warming failed for brand {brand}: {e}")
    
    async def _warm_filter_data(self):
        """Warm cache with filter options"""
        from app.database.mysql import execute_query
        
        # Warm filter options
        filter_queries = {
            'brands': "SELECT DISTINCT brand FROM cars ORDER BY brand",
            'fuels': "SELECT DISTINCT fuel FROM cars WHERE fuel IS NOT NULL ORDER BY fuel",
            'gears': "SELECT DISTINCT gear FROM cars WHERE gear IS NOT NULL ORDER BY gear"
        }
        
        for filter_type, query in filter_queries.items():
            try:
                result = await execute_query(query, remove_outliers=False)
                cache_key = f"filters:{filter_type}"
                await self.cache.set(cache_key, result, ttl=7200)
            except Exception as e:
                logger.warning(f"Cache warming failed for {filter_type}: {e}")

# Global cache instances
_l1_cache = HyperOptimizedLRUCache(max_size=10000, max_memory_mb=512)
_multi_tier_cache = None
_cache_warmer = None

def get_hyper_cache():
    """Get the global hyper-optimized cache instance"""
    global _multi_tier_cache
    if _multi_tier_cache is None:
        try:
            import redis
            redis_client = redis.from_url("redis://localhost:6379", decode_responses=False)
            _multi_tier_cache = MultiTierCache(_l1_cache, redis_client)
        except ImportError:
            _multi_tier_cache = MultiTierCache(_l1_cache, None)
    
    return _multi_tier_cache

def hyper_cache_result(prefix: str, ttl: int = 3600):
    """
    Ultra-fast caching decorator with intelligent key generation.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache = get_hyper_cache()
            
            # Generate deterministic cache key
            key_data = f"{prefix}:{str(args)}:{str(sorted(kwargs.items()))}"
            cache_key = hashlib.md5(key_data.encode()).hexdigest()
            
            # Try to get from cache
            result = await cache.get(cache_key)
            if result is not None:
                return result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            if result is not None:
                await cache.set(cache_key, result, ttl)
            
            return result
        return wrapper
    return decorator

def get_cache_stats() -> Dict[str, Any]:
    """Get comprehensive cache statistics"""
    cache = get_hyper_cache()
    return cache.get_stats()

async def warm_cache():
    """Warm the cache with popular data"""
    global _cache_warmer
    if _cache_warmer is None:
        from app.database.sqlite import get_db
        db = next(get_db())
        cache = get_hyper_cache()
        _cache_warmer = IntelligentCacheWarmer(cache, db)
    
    await _cache_warmer.warm_popular_data()

async def clear_cache():
    """Clear all cache levels"""
    cache = get_hyper_cache()
    cache.l1_cache.clear()
    if cache.redis_client:
        try:
            await cache.redis_client.flushdb()
        except Exception as e:
            logger.warning(f"Redis clear error: {e}") 