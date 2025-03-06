# EuCar API

A RESTful API for managing car data and user information.

## Overview

EuCar API provides endpoints for car searching, filtering, user authentication, and management. It uses FastAPI for high-performance API development with automatic documentation.

## Project Structure

```
eucar-api/
│
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration settings
│   │
│   ├── api/                 # API endpoints
│   │   ├── cars.py          # Car-related endpoints
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── users.py         # User management endpoints
│   │   └── filters.py       # Filter-related endpoints
│   │
│   ├── database/            # Database connections
│   │   ├── mysql.py         # MySQL connection for cars data
│   │   └── sqlite.py        # SQLite for user data
│   │
│   ├── models/              # Database models
│   │   ├── car.py           # Car-related models
│   │   └── user.py          # User-related models
│   │
│   ├── schemas/             # Pydantic schemas
│   │   ├── car.py           # Car request/response schemas
│   │   └── user.py          # User request/response schemas
│   │
│   └── utils/               # Utility functions
│       ├── security.py      # Auth-related utilities
│       └── helpers.py       # Helper functions
│
├── .env                     # Environment variables
└── requirements.txt         # Python dependencies
```

## Installation

### Prerequisites

- Python 3.10+
- MySQL (for car data)
- SQLite (for user data)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/eucar-api.git
   cd eucar-api
   ```
2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:

   ```bash
   # General settings
   DEBUG=True

   # MySQL settings
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=aliarain786
   MYSQL_DB=eucar

   # Security
   JWT_SECRET=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30


   # SMTP settings for email
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=alihasnain2k19@gmail.com
   SMTP_PASSWORD=password
   SMTP_FROM_EMAIL=email
   SMTP_FROM_NAME=EUCar Support
   ```

   Edit the `.env` file to configure your database connections and other settings.

## Usage

### Running the API

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

### API Documentation

Once the server is running, you can access:

- Interactive API documentation: `http://localhost:8000/docs`
- Alternative API documentation: `http://localhost:8000/redoc`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Users

- `GET /api/users/me` - Get current user information
- `PUT /api/users/me` - Update current user information
- `DELETE /api/users/me` - Delete current user

### Cars

- `GET /api/cars` - List available cars
- `GET /api/cars/{id}` - Get car details
- `POST /api/cars` - Add a new car (admin only)
- `PUT /api/cars/{id}` - Update car information (admin only)
- `DELETE /api/cars/{id}` - Delete a car (admin only)

### Filters

- `GET /api/filters` - Get available filter options
- `POST /api/filters/search` - Search cars with complex filters

## Database Structure

The application uses two databases:

1. **MySQL** - For car-related data (higher performance for complex queries)
2. **SQLite** - For user authentication and profile data (simpler maintenance)

## Development

### Adding New Endpoints

1. Create or modify route files in the `app/api` directory
2. Register new routers in `app/main.py`
