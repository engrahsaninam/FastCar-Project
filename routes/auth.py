from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt

# JWT Secret & Algorithm
SECRET_KEY = "supersecretkey"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Simulated database
users_db = {}

router = APIRouter()

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    surname: str
    phone: str
    country: str
    postal_code: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Hash Password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify Password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Generate JWT Token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Decode JWT Token
def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

# Dependency to Get Current User
def get_current_user(token: str):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user_email = payload.get("sub")
    if user_email not in users_db:
        raise HTTPException(status_code=401, detail="User not found")
    return users_db[user_email]

# ✅ Register New User
@router.post("/register", response_model=Token)
def register(user: UserRegister):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    users_db[user.email] = {
        "email": user.email,
        "hashed_password": hash_password(user.password),
        "name": user.name,
        "surname": user.surname,
        "phone": user.phone,
        "country": user.country,
        "postal_code": user.postal_code
    }
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ✅ Login User
@router.post("/login", response_model=Token)
def login(user: UserLogin):
    db_user = users_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ✅ Get Current User (Protected Route)
@router.get("/user")
def get_user_info(token: str = Depends(get_current_user)):
    return token

# ✅ Social Login Placeholder
@router.get("/social-login/{provider}")
def social_login(provider: str):
    if provider not in ["google", "facebook"]:
        raise HTTPException(status_code=400, detail="Unsupported social login provider")
    
    return {"message": f"Redirect to {provider} login (to be implemented)"}
