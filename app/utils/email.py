#app/utils/email.py
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import (
    SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM_EMAIL, SMTP_FROM_NAME,
    FASTCAR_SMTP_SERVER, FASTCAR_SMTP_PORT, FASTCAR_SMTP_USERNAME, FASTCAR_SMTP_PASSWORD,
    FASTCAR_FROM_EMAIL, FASTCAR_FROM_NAME
)

logger = logging.getLogger(__name__)

async def send_email(to_email, subject, html_content):
    """Send an email using SMTP settings from config"""
    
    logger.info(f"📧 Attempting to send email to: {to_email}")
    logger.info(f"📧 Subject: {subject}")
    logger.info(f"📧 Using SMTP server: {SMTP_SERVER}:{SMTP_PORT}")
    
    # Create message
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
    message["To"] = to_email
    
    # Add HTML content
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)
    
    # Connect to SMTP server and send email
    try:
        logger.info(f"📧 Connecting to SMTP server: {SMTP_SERVER}:{SMTP_PORT}")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.set_debuglevel(1)  # Enable debug output
        
        logger.info("📧 Starting TLS encryption")
        server.starttls()  # Enable TLS encryption
        
        logger.info(f"📧 Authenticating with username: {SMTP_USERNAME}")
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        
        logger.info(f"📧 Sending email from {SMTP_FROM_EMAIL} to {to_email}")
        server.sendmail(SMTP_FROM_EMAIL, to_email, message.as_string())
        
        logger.info("📧 Email sent successfully!")
        server.quit()
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to send email: {str(e)}")
        logger.error(f"❌ Error type: {type(e).__name__}")
        return False

async def send_verification_email(to_email, otp, username):
    """Send a verification email with OTP using proper Gmail settings"""
    
    logger.info(f"📧 Preparing to send verification email to: {to_email}")
    logger.info(f"📧 OTP: {otp}")
    logger.info(f"📧 Username: {username}")
    logger.info(f"📧 Display sender: Fast4Car Support <no-reply@fast4car.com>")
    
    # Use existing SMTP configuration from config file
    logger.info(f"📧 Using SMTP server: {SMTP_SERVER}:{SMTP_PORT}")
    logger.info(f"📧 Using SMTP username: {SMTP_USERNAME}")
    logger.info(f"📧 Actual sending account: {SMTP_USERNAME}")
    
    subject = "Verify Your Email - Fast4Car"
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #2c3e50; color: white; padding: 20px; text-align: center; }}
            .content {{ background-color: #f9f9f9; padding: 30px; border-radius: 5px; }}
            .otp-box {{ background-color: #3498db; color: white; padding: 20px; text-align: center; 
                        font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0; 
                        letter-spacing: 3px; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #666; }}
            .warning {{ background-color: #e74c3c; color: white; padding: 15px; border-radius: 5px; 
                       margin: 20px 0; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚗 Fast4Car</h1>
                <p>Email Verification Required</p>
            </div>
            <div class="content">
                <h2>Hello {username}!</h2>
                <p>Welcome to Fast4Car! To complete your registration, please verify your email address 
                   by entering the verification code below:</p>
                
                <div class="otp-box">
                    {otp}
                </div>
                
                <p><strong>This verification code will expire in 15 minutes.</strong></p>
                
                <p>If you didn't create an account with Fast4Car, please ignore this email.</p>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong> Do not share this code with anyone. Fast4Car will never ask for this code over phone or email.
                </div>
                
                <p>Need help? Contact our support team at support@fast4car.com</p>
            </div>
            <div class="footer">
                <p>© 2024 Fast4Car. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Create message
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = "Fast4Car Support <no-reply@fast4car.com>"
    message["Reply-To"] = "support@fast4car.com"
    message["To"] = to_email
    
    # Add HTML content
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)
    
    # Connect to SMTP server and send email
    try:
        logger.info(f"📧 Connecting to SMTP server: {SMTP_SERVER}:{SMTP_PORT}")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.set_debuglevel(0)  # Disable debug output for cleaner logs
        
        logger.info("📧 Starting TLS encryption")
        server.starttls()  # Enable TLS encryption
        
        logger.info(f"📧 Authenticating with account: {SMTP_USERNAME}")
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        
        logger.info(f"📧 Sending verification email from no-reply@fast4car.com to {to_email}")
        server.sendmail(SMTP_USERNAME, to_email, message.as_string())
        
        logger.info("✅ Verification email sent successfully!")
        server.quit()
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"❌ SMTP Authentication failed: {str(e)}")
        logger.error("❌ Please check email credentials in config. For Gmail, you need:")
        logger.error("❌ 1. Enable 2-Factor Authentication")
        logger.error("❌ 2. Create an App Password (not your regular password)")
        logger.error("❌ 3. Use the App Password in SMTP_PASSWORD environment variable")
        return False
        
    except smtplib.SMTPRecipientsRefused as e:
        logger.error(f"❌ Recipient refused: {str(e)}")
        logger.error("❌ Please check if the recipient email address is valid")
        return False
        
    except smtplib.SMTPServerDisconnected as e:
        logger.error(f"❌ SMTP server disconnected: {str(e)}")
        logger.error(f"❌ Connection to SMTP server {SMTP_SERVER}:{SMTP_PORT} lost")
        return False
        
    except Exception as e:
        logger.error(f"❌ Failed to send verification email: {str(e)}")
        logger.error(f"❌ Error type: {type(e).__name__}")
        logger.error("❌ Full error details:", exc_info=True)
        return False

async def send_verification_email_alternative(to_email, otp, username):
    """Alternative method using environment variables for Gmail"""
    
    logger.info(f"📧 Using alternative Gmail method for: {to_email}")
    
    # Use existing SMTP configuration but with Gmail
    subject = f"🚗 Fast4Car - Verify Your Email (OTP: {otp})"
    
    # Simple text version for testing
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2>🚗 Fast4Car - Email Verification</h2>
        <p>Hello {username}!</p>
        <p>Your verification code is: <strong style="font-size: 24px; color: #0066cc;">{otp}</strong></p>
        <p>This code expires in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p><small>© 2024 Fast4Car. All rights reserved.</small></p>
    </body>
    </html>
    """
    
    # Create message
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"Fast4Car <{SMTP_USERNAME}>"
    message["To"] = to_email
    
    # Add HTML content
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)
    
    # Connect to SMTP server and send email
    try:
        logger.info(f"📧 Connecting to SMTP: {SMTP_SERVER}:{SMTP_PORT}")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.set_debuglevel(1)
        
        logger.info("📧 Starting TLS")
        server.starttls()
        
        logger.info(f"📧 Logging in with: {SMTP_USERNAME}")
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        
        logger.info(f"📧 Sending from {SMTP_USERNAME} to {to_email}")
        server.sendmail(SMTP_USERNAME, to_email, message.as_string())
        
        logger.info("✅ Alternative email sent successfully!")
        server.quit()
        return True
        
    except Exception as e:
        logger.error(f"❌ Alternative email method failed: {str(e)}")
        logger.error(f"❌ Error type: {type(e).__name__}")
        return False