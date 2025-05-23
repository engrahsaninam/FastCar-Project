#app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from google.auth.transport import requests
from google.oauth2 import id_token
import secrets
import logging

from app.database.sqlite import get_db
from app.models.user import User, PasswordReset
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.config import JWT_SECRET, JWT_ALGORITHM, GOOGLE_CLIENT_ID
from app.utils.email import send_email
from app.schemas.user import (
    UserSignup, GoogleSignup, UserResponse, Token, TokenData, 
    PasswordResetRequest, PasswordReset as PasswordResetSchema, LoginRequest
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token", auto_error=False)
logger = logging.getLogger(__name__)

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_google_id(db: Session, google_id: str):
    return db.query(User).filter(User.google_id == google_id).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not user.hashed_password:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        token_data = TokenData(email=email)
    except JWTError:
        return None
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        return None
    return user

@router.post("/register", response_model=UserResponse)
async def register(user: UserSignup, db: Session = Depends(get_db)):
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/google-signup", response_model=Token)
async def google_signup(google_data: GoogleSignup, db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(
            google_data.id_token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )
        google_id = idinfo['sub']
        email = idinfo['email']
        username = idinfo.get('name', email.split('@')[0])
        logger.info(f"Google Sign-In: Valid token for email={email}, google_id={google_id}")
    except ValueError as e:
        logger.error(f"Google Sign-In: Invalid token - {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")

    user = get_user_by_google_id(db, google_id) or get_user_by_email(db, email)
    if user:
        if not user.google_id:
            user.google_id = google_id
            db.commit()
            db.refresh(user)
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}

    while get_user_by_username(db, username):
        username = f"{username}{secrets.randbelow(1000)}"
    
    db_user = User(
        username=username,
        email=email,
        google_id=google_id,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(data={"sub": db_user.email})
    logger.info(f"Google Sign-In: Created new user email={email}, username={username}")
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
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

async def send_password_reset_email(background_tasks: BackgroundTasks, email: str, token: str):
    reset_url = f"http://localhost:3000/reset-password?token={token}"
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
    background_tasks.add_task(
        send_email,
        to_email=email,
        subject="Reset Your EUCar Password",
        html_content=html_content
    )

@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, request.email)
    if not user or user.google_id:
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    reset_record = db.query(PasswordReset).filter(
        PasswordReset.email == request.email,
        PasswordReset.is_used == False,
        PasswordReset.expires_at > datetime.utcnow()
    ).first()
    
    if reset_record:
        reset_record.token = token
        reset_record.expires_at = expires_at
        reset_record.is_used = False
    else:
        reset_record = PasswordReset(
            email=request.email,
            token=token,
            expires_at=expires_at
        )
        db.add(reset_record)
    
    db.commit()
    await send_password_reset_email(background_tasks, request.email, token)
    return {"message": "If your email is registered, you will receive a password reset link"}

@router.post("/reset-password")
async def reset_password(reset_data: PasswordResetSchema, db: Session = Depends(get_db)):
    reset_record = db.query(PasswordReset).filter(
        PasswordReset.token == reset_data.token,
        PasswordReset.is_used == False,
        PasswordReset.expires_at > datetime.utcnow()
    ).first()
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user = get_user_by_email(db, reset_record.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.hashed_password = get_password_hash(reset_data.password)
    reset_record.is_used = True
    db.commit()
    return {"message": "Password has been reset successfully"}