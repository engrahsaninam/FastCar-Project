# Car Availability Checking System

## Overview

This system efficiently manages car availability by checking URLs periodically and removing unavailable cars from the user-facing API. It uses soft deletion (marking as unavailable) rather than hard deletion to preserve data integrity.

## Key Features

### 🔍 **Intelligent URL Checking**
- Async HTTP requests with connection pooling
- Retry logic with exponential backoff
- Rate limiting to avoid being blocked
- Batch processing for efficiency
- Smart error handling (4xx vs 5xx responses)

### 🗄️ **Immediate Deletion Approach**
- Cars are permanently deleted from database once unavailable
- Ensures only available cars are shown to users
- Cleans up related data (car_features, etc.)
- More aggressive but guarantees data cleanliness

### ⚡ **Performance Optimizations**
- Processes 50 cars per batch concurrently
- Connection pooling reduces overhead
- Database indexes on availability columns
- Background processing doesn't block API

### 📊 **Comprehensive Monitoring**
- Real-time availability statistics
- Admin dashboard for monitoring
- Detailed logging and error tracking
- Recent activity tracking

## Database Schema Changes

### New Fields Added to `cars` Table:
```sql
-- Quick availability check
is_available BOOLEAN DEFAULT 1 INDEX

-- Tracking when URL was last checked
last_checked DATETIME INDEX

-- Number of failed check attempts
check_attempts INTEGER DEFAULT 0

-- When car became unavailable
unavailable_since DATETIME
```

## API Endpoints

### User-Facing Changes
All car endpoints automatically show only available cars (unavailable cars are deleted):
- `GET /api/cars/` - Shows all cars (unavailable ones are deleted)
- `GET /api/cars/brands/` - Shows all brands (only from available cars)
- `GET /api/cars/models/` - Shows all models (only from available cars)
- `GET /api/cars/{car_id}` - Returns 404 if car was deleted due to unavailability
- `GET /api/cars/{car_id}/similar` - Shows similar cars (unavailable ones deleted)

### Admin Endpoints
New admin endpoints for managing availability:

#### `GET /api/admin/availability/stats`
```json
{
  "status": "success",
  "data": {
    "total_cars": 150000,
    "available_cars": 142000,
    "unavailable_cars": 8000,
    "never_checked": 5000,
    "need_recheck": 12000
  },
  "summary": {
    "availability_rate": "94.67%",
    "unavailable_rate": "5.33%",
    "never_checked_rate": "3.33%"
  }
}
```

#### `POST /api/admin/availability/check`
Trigger manual availability check:
```json
{
  "max_cars": 1000,
  "priority_check": false
}
```

#### `POST /api/admin/availability/cleanup`
This endpoint is now obsolete since cars are deleted immediately:
```json
{
  "status": "not_needed",
  "message": "Cleanup not needed - cars are automatically deleted when unavailable"
}
```

## Background Processing

### Automated Schedules
- **Regular Check**: Every 24 hours (1000 cars)
- **Priority Check**: Every 6 hours (cars with previous failures)
- **Cleanup**: Not needed (cars deleted immediately when unavailable)

### Check Logic
```python
# Regular check: Cars not checked in last 7 days
if last_checked < 7_days_ago or last_checked is None:
    check_availability()

# Priority check: Cars with failures, check every 6 hours
if check_attempts > 0 and last_checked < 6_hours_ago:
    check_availability()

# Immediate deletion: Remove cars as soon as they become unavailable
if url_check_fails:
    delete_immediately()
```

## Usage Examples

### Run Manual Check
```bash
# Check 100 cars synchronously
curl -X POST "http://localhost:8000/api/admin/availability/check-sync?max_cars=100" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Start background check for 1000 cars
curl -X POST "http://localhost:8000/api/admin/availability/check" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"max_cars": 1000, "priority_check": false}'
```

### Get Statistics
```bash
curl -X GET "http://localhost:8000/api/admin/availability/stats" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Cleanup Unavailable Cars
```bash
# This endpoint is now obsolete since cars are deleted immediately
curl -X POST "http://localhost:8000/api/admin/availability/cleanup" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
# Returns: {"status": "not_needed", "message": "Cleanup not needed - cars are automatically deleted when unavailable"}
```

## Configuration

### Performance Settings
- **Batch Size**: 50 cars per batch
- **Max Concurrent**: 10 simultaneous requests
- **Timeout**: 15 seconds per request
- **Retry Logic**: 3 attempts with exponential backoff
- **Rate Limiting**: 0.1 second delay between requests

### Thresholds
- **Regular Check**: 7 days
- **Priority Check**: 6 hours
- **Deletion Threshold**: Immediate (1 failure)
- **Max Failures**: 1 attempt before deletion

## Error Handling

### HTTP Response Codes
- **2xx/3xx**: Car available
- **4xx**: Car permanently unavailable (immediate marking)
- **5xx**: Temporary server error (retry with backoff)
- **Timeout/Network**: Retry with exponential backoff

### Fallback Behavior
- Network failures don't immediately mark cars as unavailable
- Multiple failures required before marking unavailable
- Graceful degradation if checking service fails

## Monitoring & Logging

### Key Metrics
- Total cars checked per run
- Availability rate trends
- Check failure rates
- Response time distribution
- Error categorization

### Log Levels
- **INFO**: Regular operation, statistics
- **WARNING**: Individual car unavailability
- **ERROR**: System failures, batch failures
- **DEBUG**: Detailed request/response info

## Security Considerations

### Admin Access
- Only admin users can trigger manual checks
- API endpoints require authentication
- Rate limiting prevents abuse

### Resource Protection
- Connection pooling prevents resource exhaustion
- Request timeouts prevent hanging operations
- Batch limits prevent overwhelming servers

## Deployment Considerations

### Dependencies
```bash
pip install aiohttp==3.9.3
```

### Database Migration
The system automatically applies database migrations on startup to add the new availability columns.

### Monitoring Setup
- Set up log aggregation for availability checker
- Monitor API response times for availability queries
- Set up alerts for high unavailability rates

## Future Enhancements

### Planned Features
1. **Configurable thresholds** via admin API
2. **Webhook notifications** for availability changes
3. **Advanced analytics** dashboard
4. **Machine learning** for predicting unavailability
5. **Integration** with external monitoring systems

### Scaling Considerations
- **Horizontal scaling**: Multiple worker instances
- **Database sharding**: Partition by car region
- **CDN integration**: Cache availability status
- **Queue system**: For high-volume checking

## Troubleshooting

### Common Issues

#### High Unavailability Rate
```bash
# Check recent failures
curl -X GET "http://localhost:8000/api/admin/availability/recent-activity" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Check specific error patterns in logs
grep "unavailable" /var/log/fastcar-api.log
```

#### Slow Performance
```bash
# Check database indexes
sqlite3 eucar_users.db ".schema cars" | grep INDEX

# Monitor concurrent requests
tail -f /var/log/fastcar-api.log | grep "Processing batch"
```

#### Network Issues
```bash
# Test connectivity to source sites
curl -I "https://source-website.com/car-listing"

# Check timeout settings
grep "timeout" app/utils/car_availability_checker.py
```

---

This system provides a robust, efficient, and scalable solution for managing car availability while maintaining excellent user experience and administrative control. 