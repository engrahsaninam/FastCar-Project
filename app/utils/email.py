#app/utils/email.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import (
    SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM_EMAIL, SMTP_FROM_NAME,
    FASTCAR_SMTP_SERVER, FASTCAR_SMTP_PORT, FASTCAR_SMTP_USERNAME, FASTCAR_SMTP_PASSWORD,
    FASTCAR_FROM_EMAIL, FASTCAR_FROM_NAME
)

async def send_email(to_email, subject, html_content):
    """Send an email using SMTP settings from config"""
    
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
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Enable TLS encryption
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM_EMAIL, to_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

async def send_verification_email(to_email, otp, username):
    """Send a verification email with OTP using FastCar email settings"""
    
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
    message["From"] = f"{FASTCAR_FROM_NAME} <{FASTCAR_FROM_EMAIL}>"
    message["To"] = to_email
    
    # Add HTML content
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)
    
    # Connect to SMTP server and send email
    try:
        server = smtplib.SMTP(FASTCAR_SMTP_SERVER, FASTCAR_SMTP_PORT)
        server.starttls()  # Enable TLS encryption
        server.login(FASTCAR_SMTP_USERNAME, FASTCAR_SMTP_PASSWORD)
        server.sendmail(FASTCAR_FROM_EMAIL, to_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send verification email: {e}")
        return False