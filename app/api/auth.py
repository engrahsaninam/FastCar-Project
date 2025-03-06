 
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta

from app.database.sqlite import get_db
from app.models.user import User, PasswordReset
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.config import JWT_SECRET, JWT_ALGORITHM

from app.utils.email import send_email
from app.schemas.user import (
    UserCreate, UserResponse, Token, TokenData, 
    PasswordResetRequest, PasswordReset as PasswordResetSchema, LoginRequest, Token
)

import uuid
import secrets
from fastapi import BackgroundTasks

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        surname=user.surname,
        phone=user.phone,
        country=user.country,
        postal_code=user.postal_code,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint that accepts email and password in JSON"""
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# Add these functions first
def generate_reset_token():
    """Generate a secure random token for password reset"""
    return secrets.token_urlsafe(32)

async def send_password_reset_email(background_tasks: BackgroundTasks, email: str, token: str):
    """Send password reset email with token"""
    reset_url = f"http://localhost:3000/reset-password?token={token}"
    
    # HTML email template
    html_content = f"""
    <html>
    <body>
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <p><a href="{reset_url}">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>The link will expire in 24 hours.</p>
        <p>Thank you,<br>EUCar Team</p>
    </body>
    </html>
    """
    
    # Send email in background to avoid blocking the API response
    background_tasks.add_task(
        send_email, 
        to_email=email,
        subject="Reset Your EUCar Password",
        html_content=html_content
    )

# Add these endpoints
@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Request a password reset link"""
    # Check if user exists
    user = get_user_by_email(db, request.email)
    if not user:
        # Don't reveal if user exists or not for security
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    # Generate token and create reset record
    token = generate_reset_token()
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    # Create or update password reset record
    reset_record = db.query(PasswordReset).filter(
        PasswordReset.email == request.email,
        PasswordReset.is_used == False,
        PasswordReset.expires_at > datetime.utcnow()
    ).first()
    
    if reset_record:
        # Update existing record
        reset_record.token = token
        reset_record.expires_at = expires_at
        reset_record.is_used = False
    else:
        # Create new record
        reset_record = PasswordReset(
            email=request.email,
            token=token,
            expires_at=expires_at
        )
        db.add(reset_record)
    
    db.commit()
    
    # Send email
    await send_password_reset_email(background_tasks, request.email, token)
    
    return {"message": "If your email is registered, you will receive a password reset link"}

@router.post("/reset-password")
async def reset_password(reset_data: PasswordResetSchema, db: Session = Depends(get_db)):
    """Reset password using token from email"""
    # Find valid reset token
    reset_record = db.query(PasswordReset).filter(
        PasswordReset.token == reset_data.token,
        PasswordReset.is_used == False,
        PasswordReset.expires_at > datetime.utcnow()
    ).first()
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    # Find user and update password
    user = get_user_by_email(db, reset_record.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update password
    user.hashed_password = get_password_hash(reset_data.password)
    
    # Mark reset token as used
    reset_record.is_used = True
    
    db.commit()
    
    return {"message": "Password has been reset successfully"}



