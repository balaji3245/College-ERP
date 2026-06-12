import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'smartcampus-erp-secret-key-2025-college-system')
    MONGODB_SETTINGS = {
        'db': 'smartcampus_erp',
        'host': 'mongodb://localhost:27017/smartcampus_erp'
    }
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-smartcampus-erp-secret-key-2025-college')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds
