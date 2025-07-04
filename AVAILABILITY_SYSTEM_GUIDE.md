# Car Availability System Guide

## Overview

The Car Availability System is an efficient, low-compute solution designed to automatically detect and remove unavailable cars from the FastCar-Project database. When car URLs are no longer working (indicating the car is no longer available from the source), the system marks them as unavailable so they don't appear to users on the frontend.

## Key Features

### ✅ **Efficiency & Performance**
- **Asynchronous HTTP requests** with connection pooling
- **Batch processing** to handle large datasets efficiently
- **Rate limiting** to avoid overwhelming source websites
- **Intelligent caching** and memory management
- **Background processing** that doesn't impact user experience

### ✅ **Robust Error Handling**
- **Timeout management** (30s total, 10s connect, 20s read)
- **Graceful failure handling** for network issues
- **Retry logic** with exponential backoff
- **Comprehensive logging** for monitoring and debugging

### ✅ **Admin Controls**
- **Manual availability checks** via admin API
- **Real-time statistics** and monitoring
- **Single car testing** for debugging
- **Bulk reactivation** capabilities
- **Cleanup tools** for database maintenance

## System Architecture

### Components

1. **CarAvailabilityChecker** (`app/utils/car_availability_checker.py`)
   - Core availability checking logic
   - Async HTTP session management
   - Batch processing capabilities

2. **Background Tasks** (`app/main.py`)
   - Periodic automatic checks (every 6 hours)
   - Non-blocking execution
   - Configurable batch sizes

3. **Admin API** (`app/api/admin_availability.py`)
   - Manual trigger endpoints
   - Statistics and monitoring
   - Car reactivation tools

4. **Database Integration**
   - Status field filtering in all car queries
   - Materialized views updates
   - Bulk update operations

## Configuration

### Performance Settings
```python
# Concurrent requests (default: 50)
max_concurrent_requests = 50

# Request delay to avoid overwhelming servers (default: 0.1s)
request_delay = 0.1

# Batch size for processing (default: 1000)
batch_size = 1000

# Maximum cars per run (default: 10000)
max_cars_per_run = 10000
```

### Automatic Scheduling
- **First check**: 30 minutes after startup
- **Frequency**: Every 6 hours
- **Batch size**: 500 cars per batch
- **Max per run**: 5000 cars

## API Endpoints

### Admin Endpoints (Require Admin Authentication)

#### Get Availability Statistics
```http
GET /api/admin/availability/stats
```

**Response:**
```json
{
  "availability_stats": {
    "total_cars": 100000,
    "available": 85000,
    "unavailable": 15000,
    "available_percentage": 85.0,
    "unavailable_percentage": 15.0
  },
  "detailed_breakdown": {
    "available": 85000,
    "unavailable": 15000,
    "other_status": 0,
    "total": 100000,
    "cars_without_url": 5000
  },
  "data_quality": {
    "cars_with_valid_urls": 95000,
    "url_coverage_percentage": 95.0
  }
}
```

#### Trigger Manual Check
```http
POST /api/admin/availability/check/manual
Content-Type: application/json

{
  "batch_size": 500,
  "max_cars_per_run": 2000
}
```

#### Check Single Car
```http
POST /api/admin/availability/check/single
Content-Type: application/json

{
  "car_id": "12345",
  "car_url": "https://example.com/car/12345"
}
```

#### Get Unavailable Cars
```http
GET /api/admin/availability/unavailable-cars?page=1&limit=20
```

#### Reactivate Car
```http
POST /api/admin/availability/reactivate/{car_id}
```

#### System Status
```http
GET /api/admin/availability/system-status
```

## Database Schema Changes

### Car Status Field
The system uses the existing `status` field in the `cars` table:
- `'available'` - Car is available and shown to users
- `'unavailable'` - Car is not available and hidden from users

### Query Filtering
All car-related queries now include `WHERE status = 'available'`:

```sql
-- Example: Get available cars
SELECT * FROM cars WHERE status = 'available' AND brand = 'BMW';

-- Example: Get available brands
SELECT DISTINCT brand FROM cars WHERE status = 'available';
```

## Implementation Details

### HTTP Request Strategy
```python
# Uses HEAD requests for efficiency (no body download)
async with session.head(car_url, allow_redirects=True) as response:
    if response.status < 400:
        return True  # Available
    else:
        return False  # Unavailable
```

### Batch Processing Flow
1. **Query Selection**: Get cars with `status = 'available'`
2. **Batch Creation**: Split into manageable chunks (500-1000 cars)
3. **Parallel Checking**: Use semaphore to limit concurrent requests
4. **Results Processing**: Bulk update database with results
5. **Progress Logging**: Track and log processing progress

### Error Classification
- **Timeout**: Mark as unavailable (network issues)
- **4xx Errors**: Mark as unavailable (client errors)
- **5xx Errors**: Mark as unavailable (server errors)  
- **Connection Errors**: Mark as unavailable (DNS/network issues)
- **SSL Errors**: Mark as unavailable (certificate issues)

## Usage Examples

### Running Manual Check (Admin)
```python
# Via API
curl -X POST "http://localhost:8000/api/admin/availability/check/manual" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"batch_size": 1000, "max_cars_per_run": 5000}'
```

### Testing Single Car
```python
# Via test script
python app/scripts/test_availability_checker.py
```

### Checking Statistics
```python
# Via API
curl -X GET "http://localhost:8000/api/admin/availability/stats" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Monitoring & Maintenance

### Log Monitoring
Monitor these log messages for system health:
```
INFO - Starting car availability check process
INFO - Found 1000 cars to check
INFO - Processing batch 1: 500 cars
INFO - Batch check completed: 450 available, 50 unavailable
INFO - Marked 50 cars as unavailable
INFO - Car availability check completed in 45.2 seconds
```

### Performance Metrics
- **Throughput**: ~500-1000 cars per minute
- **Memory Usage**: ~50-100MB during processing
- **Network**: ~50 concurrent connections
- **Success Rate**: Typically >95% successful checks

### Database Maintenance
```sql
-- Check availability distribution
SELECT status, COUNT(*) as count, 
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cars), 2) as percentage
FROM cars GROUP BY status;

-- Find cars without URLs
SELECT COUNT(*) FROM cars WHERE url IS NULL OR url = '';

-- Clean up very old unavailable cars (optional)
DELETE FROM cars WHERE status = 'unavailable' AND created_at < date('now', '-6 months');
```

## Performance Optimizations

### Database Level
- **Indexed status field** for fast filtering
- **Bulk updates** instead of row-by-row operations  
- **Materialized views** updated to exclude unavailable cars
- **Connection pooling** for database operations

### Network Level
- **Connection reuse** with keep-alive
- **Request pipelining** where possible
- **DNS caching** to reduce lookup overhead
- **Intelligent retry** with backoff

### Memory Management
- **Streaming processing** to avoid loading all data
- **Garbage collection** optimization
- **Connection pool limits** to prevent resource exhaustion
- **Batch size tuning** based on available memory

## Troubleshooting

### Common Issues

#### High False Positives
**Problem**: Available cars marked as unavailable
**Solution**: 
- Increase timeout values
- Check for rate limiting from source sites
- Verify User-Agent string acceptance

#### Slow Performance
**Problem**: Availability checks taking too long
**Solution**:
- Reduce batch size
- Decrease concurrent requests
- Check network connectivity
- Monitor database performance

#### Memory Issues
**Problem**: High memory usage during checks
**Solution**:
- Reduce batch size
- Increase garbage collection frequency
- Monitor connection pool size
- Check for memory leaks in logging

### Debug Commands
```bash
# Test single car
curl -X POST "http://localhost:8000/api/admin/availability/check/single" \
     -H "Authorization: Bearer TOKEN" \
     -d '{"car_id": "test", "car_url": "https://example.com"}'

# Get system status
curl -X GET "http://localhost:8000/api/admin/availability/system-status" \
     -H "Authorization: Bearer TOKEN"

# Run test script
python app/scripts/test_availability_checker.py
```

## Security Considerations

### Admin Authentication
- Only admin users can trigger manual checks
- All endpoints require proper JWT authentication
- Admin status verified for each request

### Rate Limiting
- Built-in delays between requests
- Configurable concurrent request limits
- Respectful User-Agent string

### Data Protection
- No sensitive data transmitted
- Secure HTTP session management
- Proper error handling without data leaks

## Future Enhancements

### Planned Features
- **Machine Learning**: Predict availability based on patterns
- **Source Integration**: Direct API integration where available
- **Notification System**: Alert admins of mass unavailability
- **Historical Tracking**: Track availability trends over time
- **Smart Scheduling**: Adjust check frequency based on source reliability

### Configuration Improvements
- **Per-source rate limits**: Different limits for different car sources
- **Availability scoring**: Weighted availability based on source reliability
- **Selective checking**: Priority checks for high-value cars
- **Regional optimization**: Different strategies by geographic region

---

## Quick Start

1. **System starts automatically** with the FastAPI application
2. **First check runs** 30 minutes after startup
3. **Monitor via logs** or admin API endpoints
4. **Use admin dashboard** for manual controls and statistics
5. **Users automatically see** only available cars in search results

The system is designed to be **zero-maintenance** for normal operation while providing **comprehensive admin tools** for monitoring and control when needed. 