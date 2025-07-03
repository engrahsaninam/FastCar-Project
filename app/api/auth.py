#app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from google.auth.transport import requests
from google.oauth2 import id_token
import secrets
import random
import logging

from app.database.sqlite import get_db
from app.models.user import User, PasswordReset
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.config import JWT_SECRET, JWT_ALGORITHM, GOOGLE_CLIENT_ID, OTP_EXPIRY_MINUTES
from app.utils.email import send_email, send_verification_email
from app.schemas.user import (
    UserSignup, GoogleSignup, UserResponse, Token, TokenData, 
    PasswordResetRequest, PasswordReset as PasswordResetSchema, LoginRequest,
    OTPVerificationRequest, OTPResendRequest, RegistrationResponse
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

def generate_otp():
    """Generate a 6-digit OTP"""
    return f"{random.randint(100000, 999999)}"

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not user.hashed_password:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    if not user.is_email_verified:
        return "unverified"
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

@router.post("/register", response_model=RegistrationResponse)
async def register(
    user: UserSignup,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        if existing_user.is_email_verified:
            # Email is already registered and verified
            raise HTTPException(status_code=400, detail="Email already registered")
        else:
            # Email exists but not verified - regenerate OTP and resend verification
            otp = generate_otp()
            otp_expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
            
            # Update the existing user with new OTP and potentially new password
            existing_user.email_verification_otp = otp
            existing_user.otp_expires_at = otp_expires_at
            existing_user.hashed_password = get_password_hash(user.password)  # Update password
            existing_user.is_admin = user.is_admin  # Update admin status if needed
            
            db.commit()
            db.refresh(existing_user)
            
            # Send verification email in background
            background_tasks.add_task(send_verification_email, user.email, otp, existing_user.username)
            
            logger.info(f"Existing unverified user registration attempt - OTP resent: email={user.email}")
            return RegistrationResponse(
                message="An account with this email already exists but is not verified. A new verification code has been sent to your email.",
                email=user.email,
                verification_required=True
            )
    
    # Check if username is already taken
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Generate OTP and expiry time for new user
    otp = generate_otp()
    otp_expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_active=True,
        is_admin=user.is_admin,
        is_email_verified=False,  # Email not verified yet
        email_verification_otp=otp,
        otp_expires_at=otp_expires_at
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Send verification email in background
    background_tasks.add_task(send_verification_email, user.email, otp, user.username)
    
    logger.info(f"User registered with email verification required: email={user.email}, is_admin={user.is_admin}")
    return RegistrationResponse(
        message="Registration successful! Please check your email for verification code.",
        email=user.email,
        verification_required=True
    )

@router.post("/verify-email")
async def verify_email(
    verification_data: OTPVerificationRequest,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, verification_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    # Check if OTP is valid and not expired
    if not user.email_verification_otp or user.email_verification_otp != verification_data.otp:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    if not user.otp_expires_at or user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Verification code has expired")
    
    # Verify the email
    user.is_email_verified = True
    user.email_verification_otp = None
    user.otp_expires_at = None
    db.commit()
    
    logger.info(f"Email verified successfully: email={user.email}")
    return {"message": "Email verified successfully! You can now log in."}

@router.post("/verify-otp")
async def verify_otp(
    verification_data: OTPVerificationRequest,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, verification_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    # Check if OTP is valid and not expired
    if not user.email_verification_otp or user.email_verification_otp != verification_data.otp:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    if not user.otp_expires_at or user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Verification code has expired")
    
    # Verify the email
    user.is_email_verified = True
    user.email_verification_otp = None
    user.otp_expires_at = None
    db.commit()
    
    logger.info(f"OTP verified successfully: email={user.email}")
    return {"message": "OTP verified successfully! You can now log in."}

@router.post("/resend-otp")
async def resend_otp(
    resend_data: OTPResendRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, resend_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    # Generate new OTP
    otp = generate_otp()
    otp_expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
    
    user.email_verification_otp = otp
    user.otp_expires_at = otp_expires_at
    db.commit()
    
    # Send verification email in background
    background_tasks.add_task(send_verification_email, user.email, otp, user.username)
    
    logger.info(f"OTP resent: email={user.email}")
    return {"message": "Verification code sent! Please check your email."}

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
        is_active=True,
        is_admin=False,  # Explicitly set for Google Sign-In
        is_email_verified=True  # Google emails are pre-verified
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(data={"sub": db_user.email})
    logger.info(f"Google Sign-In: Created new user email={email}, username={username}, is_admin=False")
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
    if user == "unverified":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email before logging in",
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
    if user == "unverified":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email before logging in",
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