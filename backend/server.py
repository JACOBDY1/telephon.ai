from fastapi import FastAPI, APIRouter, HTTPException, Query, BackgroundTasks, Depends, status, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import requests
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta, date
import asyncio
import json
import aiofiles
import base64
from cryptography.fernet import Fernet
from pymongo import MongoClient
from bson import ObjectId
import random
import jwt
from passlib.context import CryptContext
from passlib.hash import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Real API Configuration
CHECKCALL_USERNAME = "office@day-1.co.il"
CHECKCALL_PASSWORD = "121212kobi!"
CHECKCALL_USER_ID = "2367"
CHECKCALL_API_BASE = "http://ws.callindex.co.il/index.php"
WEBHOOK_URL = "https://hook.us1.make.com/pu4619an5ekdfcaakli38gfsdy5lr40s"

MASTERPBX_URL = "https://woopress.ippbx.co.il"
MASTERPBX_USERNAME = "day1"
MASTERPBX_PASSWORD = "0505552220"

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "telephony_ai_secret_key_2024_hebrew_platform")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# MongoDB connection for users (sync for authentication)
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]
users_collection = db.users
sessions_collection = db.sessions

# MongoDB async client for API operations
async_client = AsyncIOMotorClient(MONGO_URL)
async_db = async_client[DB_NAME]

# Create the main app without a prefix
app = FastAPI(title="AI Telephony Platform", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class CallRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    caller_name: str
    caller_number: str
    callee_number: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    duration: Optional[int] = None  # in seconds
    status: str = "active"  # active, completed, missed
    transcription: Optional[str] = None
    sentiment: Optional[str] = None  # positive, negative, neutral
    language: Optional[str] = "he"
    recording_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CallRecordCreate(BaseModel):
    caller_name: str
    caller_number: str
    callee_number: Optional[str] = None
    language: Optional[str] = "he"

class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone_number: str
    email: Optional[str] = None
    company: Optional[str] = None
    tags: List[str] = []
    last_call_date: Optional[datetime] = None
    total_calls: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactCreate(BaseModel):
    name: str
    phone_number: str
    email: Optional[str] = None
    company: Optional[str] = None
    tags: List[str] = []

class AIInsight(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    call_id: str
    insight_type: str  # sentiment, keyword, recommendation
    content: str
    confidence: float
    language: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PlaybookSection(BaseModel):
    title: str
    items: List[Dict[str, str]]

class SalesPlaybook(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    sections: List[PlaybookSection]
    language: str = "he"
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ===== USER AUTHENTICATION MODELS =====

class User(BaseModel):
    id: Optional[str] = None
    username: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: str = "user"  # user, admin, manager, professional
    user_type: str = "client"  # client, professional, therapist, consultant, barber
    is_active: bool = True
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    preferences: Dict[str, Any] = {}
    subscription: Dict[str, Any] = {}

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    user_type: Optional[str] = "client"  # client, professional, therapist, consultant, barber

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class UserInDB(BaseModel):
    id: str
    username: str
    email: str
    hashed_password: str
    full_name: str
    phone: Optional[str] = None
    role: str = "user"
    user_type: str = "client"  # client, professional, therapist, consultant, barber
    is_active: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None
    preferences: Dict[str, Any] = {}
    subscription: Dict[str, Any] = {}

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    preferences: Optional[Dict[str, Any]] = None

class SubscriptionPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    currency: str = "ILS"  # Israeli Shekel
    features: List[str]
    max_users: int
    max_calls: int
    billing_period: str = "monthly"  # monthly, yearly
    is_active: bool = True

# ===== COMPREHENSIVE BARBER/PROFESSIONAL MODELS =====

class ClientProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    professional_id: str  # ID של הספר/בעל המקצוע
    personal_info: Dict[str, Any] = {
        "full_name": "",
        "phone": "",
        "email": "",
        "birth_date": None,
        "address": "",
        "emergency_contact": ""
    }
    hair_profile: Dict[str, Any] = {
        "natural_color": "",
        "current_color": "",
        "hair_type": "",  # חלק, מתולתל, גלי
        "hair_thickness": "",  # דק, בינוני, עבה
        "scalp_condition": "",  # רגיל, יבש, שמן, רגיש
        "hair_length": "",
        "previous_treatments": []
    }
    chemistry_card: Dict[str, Any] = {
        "allergies": [],
        "sensitivities": [],
        "patch_test_date": None,
        "patch_test_result": "",
        "notes": "",
        "restrictions": []
    }
    preferences: Dict[str, Any] = {
        "preferred_time_slots": [],
        "preferred_services": [],
        "communication_preference": "phone",  # phone, email, whatsapp
        "language": "he",
        "special_requests": ""
    }
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class TreatmentRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    professional_id: str
    appointment_id: Optional[str] = None
    service_type: str
    service_details: Dict[str, Any] = {
        "service_name": "",
        "duration_minutes": 0,
        "base_price": 0,
        "final_price": 0,
        "discount": 0
    }
    color_formula: Dict[str, Any] = {
        "brand": "",
        "series": "",
        "colors_used": [],  # [{"code": "6-0", "amount": "30g", "price": 28}]
        "developer": {"vol": "", "amount": "", "price": 0},
        "mixing_ratio": "",
        "processing_time": "",
        "final_result": ""
    }
    before_photos: List[str] = []
    after_photos: List[str] = []
    treatment_notes: str = ""
    client_satisfaction: Optional[int] = None  # 1-5 scale
    next_treatment_date: Optional[datetime] = None
    recommendations: List[str] = []
    products_sold: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

class Appointment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    professional_id: str
    scheduled_datetime: datetime
    duration_minutes: int = 60
    service_type: str
    service_details: Dict[str, Any] = {}
    status: str = "scheduled"  # scheduled, confirmed, in_progress, completed, cancelled, no_show
    notes: str = ""
    reminder_sent: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProfessionalSchedule(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    professional_id: str
    schedule_date: date
    work_hours: Dict[str, Any] = {
        "start_time": "09:00",
        "end_time": "18:00",
        "break_times": [{"start": "13:00", "end": "14:00"}]
    }
    availability_slots: List[Dict[str, Any]] = []
    status: str = "available"  # available, busy, off, vacation
    notes: str = ""

class ClientCommunication(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    professional_id: str
    communication_type: str  # call, sms, whatsapp, email
    direction: str  # incoming, outgoing
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = "sent"  # sent, delivered, read, failed
    metadata: Dict[str, Any] = {}

class ProfessionalGoals(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    professional_id: str
    goal_type: str  # daily, weekly, monthly, yearly
    target_date: date
    goals: Dict[str, Any] = {
        "revenue_target": 0,
        "clients_target": 0,
        "new_clients_target": 0,
        "satisfaction_target": 4.5,
        "services_target": {}
    }
    current_progress: Dict[str, Any] = {}
    is_achieved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ===== PROFESSIONAL HAIR SALON MODELS - COMPLETE SYSTEM =====

class ColorFormula(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    professional_id: str
    formula_name: str
    colors_used: List[Dict[str, Any]] = []  # [{"brand": "schwarzkopf", "code": "8-0", "planned_weight": 60, "actual_weight": 58}]
    developer: Dict[str, Any] = {
        "vol": "20vol",
        "amount_ml": 60,
        "actual_amount_ml": 58
    }
    total_planned_weight: float = 0
    total_actual_weight: float = 0
    waste_grams: float = 0
    waste_percentage: float = 0
    mixing_ratio: str = "1:1"
    processing_time_minutes: int = 35
    cost_breakdown: Dict[str, float] = {
        "color_cost": 0,
        "developer_cost": 0,
        "total_material_cost": 0,
        "waste_cost": 0
    }
    service_price: float = 0
    profit_margin: float = 0
    efficiency_score: float = 0
    client_satisfaction: Optional[int] = None  # 1-5
    before_photo_base64: Optional[str] = None
    after_photo_base64: Optional[str] = None
    notes: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SmartInventoryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    professional_id: str
    brand: str
    product_name: str
    product_code: str
    category: str  # color, developer, shampoo, conditioner, tools
    unit_type: str  # grams, ml, pieces
    current_stock: float
    minimum_stock: float
    maximum_stock: float
    reorder_point: float
    cost_per_unit: float  # cost per gram/ml/piece
    selling_price_per_unit: float
    supplier: str
    average_daily_usage: float
    days_until_empty: int = 0
    last_restocked: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    usage_history: List[Dict[str, Any]] = []  # [{"date": "2024-01-01", "amount_used": 60, "client_id": "123", "formula_id": "456"}]
    reorder_alerts: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BluetoothScaleReading(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    formula_id: str
    component_type: str  # color, developer
    component_code: str  # 8-0, 20vol
    planned_weight: float
    actual_weight: float
    variance: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ClientChemistryCard(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    professional_id: str
    allergies: List[str] = []  # ["PPD", "Ammonia", "Parabens"]
    sensitivities: List[str] = []  # ["Strong fragrances", "Peroxide over 20vol"]
    skin_test_results: List[Dict[str, Any]] = []  # [{"date": "2024-01-01", "product": "IGORA ROYAL", "result": "negative", "patch_location": "behind_ear"}]
    hair_analysis: Dict[str, Any] = {
        "porosity": "medium",  # low, medium, high
        "elasticity": "good",  # poor, fair, good, excellent
        "density": "medium",  # low, medium, high
        "texture": "medium",  # fine, medium, coarse
        "natural_color_level": 6,  # 1-10 scale
        "grey_percentage": 10,
        "previous_chemical_treatments": []
    }
    contraindications: List[str] = []
    recommended_products: List[str] = []
    notes: str = ""
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class TreatmentSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    professional_id: str
    appointment_id: Optional[str] = None
    session_date: datetime = Field(default_factory=datetime.utcnow)
    services_performed: List[str] = []  # ["hair_color", "cut", "blow_dry"]
    formulas_used: List[str] = []  # List of formula IDs
    total_time_minutes: int
    service_cost: float
    tip_amount: float = 0
    total_amount: float
    payment_method: str = "cash"  # cash, card, transfer
    client_satisfaction_rating: Optional[int] = None
    follow_up_notes: str = ""
    next_appointment_recommended: Optional[datetime] = None
    before_photos: List[str] = []
    after_photos: List[str] = []
    products_sold: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProfessionalMetrics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    professional_id: str
    metrics_date: date = Field(default_factory=lambda: datetime.utcnow().date())
    clients_served: int = 0
    total_revenue: float = 0
    total_tips: float = 0
    formulas_created: int = 0
    average_formula_efficiency: float = 0
    color_waste_percentage: float = 0
    client_satisfaction_average: float = 0
    new_clients_acquired: int = 0
    repeat_clients_served: int = 0
    average_service_time: float = 0
    most_used_colors: List[str] = []
    inventory_alerts: int = 0

# Legacy model for backward compatibility
ProductInventory = SmartInventoryItem

# ===== PROFESSIONAL CALCULATION ENGINES =====

class FormulaCalculator:
    def __init__(self, color_database):
        self.color_database = color_database
        self.developer_cost_per_ml = 0.05  # 5 agorot per ml
    
    def calculate_formula_cost(self, formula_data):
        """Calculate comprehensive formula cost including waste and efficiency"""
        color_cost = 0
        total_planned_weight = 0
        total_actual_weight = 0
        
        for color in formula_data.get('colors_used', []):
            color_info = self.find_color_in_database(color['brand'], color['code'])
            if color_info:
                cost_per_gram = color_info['price'] / 60  # Assuming 60g tubes
                planned_weight = color.get('planned_weight', 0)
                actual_weight = color.get('actual_weight', planned_weight)
                
                color_cost += actual_weight * cost_per_gram
                total_planned_weight += planned_weight
                total_actual_weight += actual_weight
        
        # Developer cost
        developer_amount = formula_data.get('developer', {}).get('actual_amount_ml', 0)
        developer_cost = developer_amount * self.developer_cost_per_ml
        
        # Calculate waste and efficiency
        waste_grams = max(0, total_planned_weight - total_actual_weight)
        waste_percentage = (waste_grams / total_planned_weight * 100) if total_planned_weight > 0 else 0
        waste_cost = waste_grams * (color_cost / total_actual_weight) if total_actual_weight > 0 else 0
        
        total_material_cost = color_cost + developer_cost
        efficiency_score = max(0, 100 - waste_percentage)
        
        return {
            "color_cost": round(color_cost, 2),
            "developer_cost": round(developer_cost, 2),
            "total_material_cost": round(total_material_cost, 2),
            "waste_cost": round(waste_cost, 2),
            "waste_grams": round(waste_grams, 2),
            "waste_percentage": round(waste_percentage, 2),
            "efficiency_score": round(efficiency_score, 2),
            "profit_margin": 0  # Will be calculated with service_price
        }
    
    def find_color_in_database(self, brand, code):
        """Find color information in the color database"""
        if brand not in self.color_database:
            return None
            
        brand_data = self.color_database[brand]
        for series_key, series_data in brand_data.get('series', {}).items():
            for color in series_data.get('colors', []):
                if color.get('code') == code:
                    return color
        return None
    
    def calculate_profit_margin(self, material_cost, service_price):
        """Calculate profit margin percentage"""
        if service_price <= 0:
            return 0
        return round(((service_price - material_cost) / service_price) * 100, 2)

class SmartInventoryManager:
    def __init__(self):
        self.low_stock_threshold_days = 7
    
    def calculate_days_until_empty(self, current_stock, daily_usage):
        """Calculate how many days until product runs out"""
        if daily_usage <= 0:
            return 999  # Essentially infinite
        return max(0, int(current_stock / daily_usage))
    
    def get_reorder_recommendation(self, item):
        """Get smart reorder recommendations"""
        days_until_empty = self.calculate_days_until_empty(
            item.current_stock, 
            item.average_daily_usage
        )
        
        if days_until_empty <= 3:
            urgency = "CRITICAL"
            message = "הזמן מיידית! נותרו פחות מ-3 ימים"
        elif days_until_empty <= 7:
            urgency = "HIGH" 
            message = f"נדרש להזמין בקרוב - נותרו {days_until_empty} ימים"
        elif days_until_empty <= 14:
            urgency = "MEDIUM"
            message = f"כדאי להזמין השבוע - נותרו {days_until_empty} ימים"
        else:
            urgency = "LOW"
            message = f"מלאי תקין - נותרו {days_until_empty} ימים"
        
        recommended_quantity = max(
            item.maximum_stock - item.current_stock,
            item.average_daily_usage * 30  # 30 days supply
        )
        
        return {
            "urgency": urgency,
            "message": message,
            "days_until_empty": days_until_empty,
            "recommended_quantity": round(recommended_quantity, 2),
            "estimated_cost": round(recommended_quantity * item.cost_per_unit, 2)
        }
    
    def update_usage_history(self, item_id, amount_used, client_id=None, formula_id=None):
        """Update product usage history and recalculate daily average"""
        usage_entry = {
            "date": datetime.utcnow().isoformat(),
            "amount_used": amount_used,
            "client_id": client_id,
            "formula_id": formula_id
        }
        return usage_entry

class BluetoothScaleManager:
    def __init__(self):
        self.connected = False
        self.current_reading = 0
        self.readings_history = []
        self.tolerance_grams = 2  # ±2g tolerance
    
    def connect_scale(self):
        """Simulate bluetooth scale connection"""
        # In real implementation, this would use Web Bluetooth API
        self.connected = True
        return {"status": "connected", "device": "Professional Scale Pro"}
    
    def get_weight_reading(self):
        """Get current weight from scale"""
        # Simulated reading - in real app this comes from Bluetooth
        import random
        self.current_reading = round(random.uniform(0, 100), 1)
        
        self.readings_history.append({
            "weight": self.current_reading,
            "timestamp": datetime.utcnow().isoformat(),
            "stable": True
        })
        
        return self.current_reading
    
    def validate_measurement(self, expected_weight, actual_weight):
        """Validate if measurement is within acceptable tolerance"""
        variance = abs(expected_weight - actual_weight)
        within_tolerance = variance <= self.tolerance_grams
        
        return {
            "within_tolerance": within_tolerance,
            "variance": round(variance, 2),
            "variance_percentage": round((variance / expected_weight * 100), 2) if expected_weight > 0 else 0,
            "recommendation": self.get_measurement_recommendation(variance)
        }
    
    def get_measurement_recommendation(self, variance):
        """Get recommendation based on measurement variance"""
        if variance <= 1:
            return "מדידה מעולה - המשך"
        elif variance <= 2:
            return "מדידה טובה - קבילה"
        elif variance <= 5:
            return "שקול למדוד שוב"
        else:
            return "מדידה לא מדויקת - מדוד מחדש"

# ===== AUTHENTICATION FUNCTIONS =====

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_username(username: str) -> Optional[UserInDB]:
    """Get user by username"""
    try:
        user_data = users_collection.find_one({"username": username})
        if user_data:
            user_data["id"] = str(user_data["_id"])
            del user_data["_id"]
            # Ensure user_type and subscription exist with safe defaults
            if "user_type" not in user_data or user_data["user_type"] is None:
                user_data["user_type"] = "client"
            if "subscription" not in user_data or user_data["subscription"] is None:
                user_data["subscription"] = {
                    "plan_id": "free_trial",
                    "plan_name": "ניסיון חינם", 
                    "status": "trial"
                }
            return UserInDB(**user_data)
        return None
    except Exception as e:
        logger.error(f"Error getting user by username: {str(e)}")
        return None

async def get_user_by_email(email: str) -> Optional[UserInDB]:
    """Get user by email"""
    try:
        user_data = users_collection.find_one({"email": email})
        if user_data:
            user_data["id"] = str(user_data["_id"])
            del user_data["_id"]
            return UserInDB(**user_data)
        return None
    except Exception as e:
        logger.error(f"Error getting user by email: {str(e)}")
        return None

async def authenticate_user(username: str, password: str) -> Optional[UserInDB]:
    """Authenticate a user"""
    user = await get_user_by_username(username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="אישורים לא תקינים",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await get_user_by_username(username)
    if user is None:
        raise credentials_exception
    
    # Convert to User model (without password)
    return User(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role,
        user_type=user.user_type,  # Use actual user_type from database
        is_active=user.is_active,
        created_at=user.created_at,
        last_login=user.last_login,
        preferences=user.preferences or {},
        subscription=user.subscription or {}
    )

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="משתמש לא פעיל")
    return current_user

# ===== ATTENDANCE & BOOKING MODELS =====

class Employee(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    department: str
    phone: Optional[str] = None
    email: Optional[str] = None
    status: str = "active"  # active, inactive, on_leave
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    attendance_status: str = "absent"  # present, absent, late
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EmployeeCreate(BaseModel):
    name: str
    department: str
    phone: Optional[str] = None
    email: Optional[str] = None

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employee_id: str
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    service: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    duration_minutes: int = 60
    status: str = "confirmed"  # confirmed, pending, cancelled, completed
    value: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None  # user ID

class BookingCreate(BaseModel):
    employee_id: str
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    service: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    duration_minutes: int = 60
    value: Optional[float] = None
    notes: Optional[str] = None

class BookingLead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    source: str = "booking_followup"  # booking_followup, website, referral
    interest: str
    value: Optional[float] = None
    probability: int = 50  # 0-100
    assigned_to: Optional[str] = None  # employee ID
    status: str = "warm"  # hot, warm, cold
    last_contact: Optional[str] = None  # YYYY-MM-DD
    booking_id: Optional[str] = None  # original booking ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BookingLeadCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    interest: str
    value: Optional[float] = None
    probability: int = 50
    assigned_to: Optional[str] = None
    booking_id: Optional[str] = None

class AttendanceRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employee_id: str
    date: str  # YYYY-MM-DD
    check_in: Optional[str] = None  # HH:MM:SS
    check_out: Optional[str] = None  # HH:MM:SS
    status: str = "absent"  # present, absent, late, half_day
    hours_worked: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ===== DOCUMENT GENERATION MODELS =====

class DocumentTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    template_type: str  # quote, contract, invoice, report
    description: str
    content: str  # HTML template
    fields: List[Dict[str, Any]]  # field definitions
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None

class GeneratedDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    template_id: str
    name: str
    customer_name: str
    customer_email: Optional[str] = None
    status: str = "draft"  # draft, sent, signed, archived
    data: Dict[str, Any]  # form data
    pdf_content: Optional[str] = None  # base64 encoded PDF
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None

class DocumentCreate(BaseModel):
    template_id: str
    name: str
    customer_name: str
    customer_email: Optional[str] = None
    data: Dict[str, Any]

class DocumentSend(BaseModel):
    document_id: str
    recipient_email: str
    subject: Optional[str] = None
    message: Optional[str] = None

# ===== MESSAGING MODELS =====

class MessageTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    platform: str  # whatsapp, sms, email
    category: str
    content: str
    variables: List[str]  # list of variable names like ['name', 'date', 'time']
    usage_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None

class Campaign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    platform: str  # whatsapp, sms, email
    template_id: Optional[str] = None
    status: str = "draft"  # draft, active, scheduled, completed, paused
    recipients: List[str]  # phone numbers or email addresses
    sent_count: int = 0
    delivered_count: int = 0
    read_count: int = 0
    reply_count: int = 0
    schedule_type: str = "immediate"  # immediate, scheduled, recurring
    schedule_datetime: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None

class CampaignCreate(BaseModel):
    name: str
    platform: str
    template_id: Optional[str] = None
    recipients: List[str]
    schedule_type: str = "immediate"
    schedule_datetime: Optional[datetime] = None

class Conversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    contact_name: str
    contact_phone: str
    contact_email: Optional[str] = None
    platform: str  # whatsapp, sms, email
    status: str = "active"  # active, pending, new, closed
    last_message: Dict[str, Any]  # last message data
    unread_count: int = 0
    tags: List[str] = []
    assigned_to: Optional[str] = None  # agent ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    content: str
    sender: str  # customer, agent
    platform: str  # whatsapp, sms, email
    message_type: str = "text"  # text, image, document, audio
    is_read: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MessageSend(BaseModel):
    conversation_id: str
    content: str
    message_type: str = "text"

# ===== CRM MODELS =====

class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    company: Optional[str] = None
    status: str = "new"  # new, contacted, qualified, lost, converted
    source: str = "website"  # website, call, referral, marketing
    assigned_to: Optional[str] = None  # user ID
    notes: Optional[str] = None
    tags: List[str] = []
    estimated_value: Optional[float] = None
    priority: str = "medium"  # low, medium, high
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None  # user ID

class LeadCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    company: Optional[str] = None
    source: str = "website"
    notes: Optional[str] = None
    tags: List[str] = []
    estimated_value: Optional[float] = None
    priority: str = "medium"

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    source: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    estimated_value: Optional[float] = None
    priority: Optional[str] = None

class Deal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    contact_id: Optional[str] = None
    lead_id: Optional[str] = None
    amount: float
    currency: str = "ILS"
    stage: str = "proposal"  # proposal, negotiation, closed_won, closed_lost
    probability: int = 50  # 0-100
    assigned_to: Optional[str] = None  # user ID
    expected_close_date: Optional[datetime] = None
    actual_close_date: Optional[datetime] = None
    notes: Optional[str] = None
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None  # user ID

class DealCreate(BaseModel):
    title: str
    description: Optional[str] = None
    contact_id: Optional[str] = None
    lead_id: Optional[str] = None
    amount: float
    currency: str = "ILS"
    probability: int = 50
    expected_close_date: Optional[datetime] = None
    notes: Optional[str] = None
    tags: List[str] = []

class DealUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    contact_id: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    stage: Optional[str] = None
    probability: Optional[int] = None
    assigned_to: Optional[str] = None
    expected_close_date: Optional[datetime] = None
    actual_close_date: Optional[datetime] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None

class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    type: str = "call"  # call, email, meeting, follow_up
    status: str = "pending"  # pending, completed, cancelled
    priority: str = "medium"  # low, medium, high
    assigned_to: Optional[str] = None  # user ID
    related_contact_id: Optional[str] = None
    related_lead_id: Optional[str] = None
    related_deal_id: Optional[str] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None  # user ID

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: str = "call"
    priority: str = "medium"
    assigned_to: Optional[str] = None
    related_contact_id: Optional[str] = None
    related_lead_id: Optional[str] = None
    related_deal_id: Optional[str] = None
    due_date: Optional[datetime] = None
    notes: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    related_contact_id: Optional[str] = None
    related_lead_id: Optional[str] = None
    related_deal_id: Optional[str] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None

# Enhanced Contact and Call models
class ContactUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    tags: Optional[List[str]] = None

class CallRecordUpdate(BaseModel):
    end_time: Optional[datetime] = None
    duration: Optional[int] = None
    status: Optional[str] = None
    transcription: Optional[str] = None
    sentiment: Optional[str] = None
    recording_url: Optional[str] = None

# Advanced AI Analytics Models
class RealTimeAnalysis(BaseModel):
    sentiment: str
    confidence: float
    keywords: List[str]
    emotions: Dict[str, float]
    suggestions: List[str]
    risk_level: str

class TranscriptionEntry(BaseModel):
    speaker: str
    text: str
    timestamp: str
    sentiment: str

class MessageTemplate(BaseModel):
    name: str
    platform: str
    category: str
    content: str
    variables: List[str]

class Campaign(BaseModel):
    name: str
    platform: str
    status: str
    template: str
    schedule: str
    target_audience: List[str]

class DocumentTemplate(BaseModel):
    name: str
    type: str
    fields: List[Dict[str, Any]]
    template: str

class AutomationRule(BaseModel):
    name: str
    type: str
    active: bool
    conditions: List[str]
    actions: List[str]
    template: str

# Existing models
class CallData(BaseModel):
    caller_name: str
    caller_number: str
    duration: str
    status: str
    sentiment: str = "neutral"
    transcription: str = ""
    ai_insights: List[str] = []

# Mock Checkcall API integration functions
async def get_checkcall_calls(user_id: str, from_date: str = None, to_date: str = None):
    """
    Mock function to simulate Checkcall API integration
    In production, this would make actual HTTP requests to Checkcall API
    """
    # Simulate API response with mock data
    mock_calls = [
        {
            "id": "12345",
            "start": "2024-01-15 10:30:00",
            "end": "2024-01-15 10:35:23",
            "callerid": "+972-50-123-4567",
            "callee": "+972-3-123-4567",
            "price": "0.15",
            "status": "completed",
            "recording_url": "http://example.com/recording1.wav"
        },
        {
            "id": "12346", 
            "start": "2024-01-15 11:15:00",
            "end": "2024-01-15 11:18:45",
            "callerid": "+1-555-987-6543",
            "callee": "+972-3-123-4567", 
            "price": "0.12",
            "status": "completed",
            "recording_url": "http://example.com/recording2.wav"
        }
    ]
    return mock_calls

async def get_masterpbx_call_log(token_id: str, start_date: str = None, end_date: str = None):
    """
    Mock function to simulate MasterPBX API integration
    In production, this would make actual HTTP requests to MasterPBX API
    """
    mock_log = [
        {
            "tenant_id": "tenant123",
            "caller": "+972-50-123-4567",
            "callee": "+972-3-123-4567",
            "start_time": "2024-01-15 10:30:00",
            "duration": "323",
            "status": "ANSWERED"
        }
    ]
    return mock_log

async def mock_transcribe_audio(audio_url: str, language: str = "he-IL") -> str:
    """
    Mock transcription function
    In production, this would use Google Cloud Speech-to-Text or similar
    """
    mock_transcriptions = {
        "he": "שלום, אני מעוניין לקבל מידע נוסף על המוצרים החדשים שלכם",
        "en": "Hi, I'd like to get more information about your new products",
        "ar": "مرحبا، أريد الحصول على مزيد من المعلومات حول منتجاتكم الجديدة"
    }
    return mock_transcriptions.get(language, mock_transcriptions["en"])

async def mock_analyze_sentiment(text: str, language: str = "he") -> str:
    """
    Mock sentiment analysis function
    In production, this would use Google Cloud Natural Language, HuggingFace models, etc.
    """
    # Simple mock logic
    positive_keywords = ["מעולה", "נהדר", "תודה", "excellent", "great", "thanks", "شكرا", "ممتاز"]
    negative_keywords = ["בעיה", "לא טוב", "problem", "bad", "مشكلة", "سيء"]
    
    text_lower = text.lower()
    
    if any(keyword in text_lower for keyword in positive_keywords):
        return "positive"
    elif any(keyword in text_lower for keyword in negative_keywords):
        return "negative"
    else:
        return "neutral"

# API Routes
@api_router.get("/")
async def root():
    return {"message": "AI Telephony Platform API", "version": "1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Calls Management
@api_router.post("/calls", response_model=CallRecord)
async def create_call(
    call_data: CallRecordCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new call record"""
    call_dict = call_data.dict()
    call_dict["start_time"] = datetime.utcnow()
    call_obj = CallRecord(**call_dict)
    
    # Insert into database
    await async_db.calls.insert_one(call_obj.dict())
    
    # Update contact statistics
    await update_contact_call_stats(call_obj.caller_number)
    
    return call_obj

@api_router.get("/calls", response_model=List[CallRecord])
async def get_calls(
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user)
):
    """Get calls with optional filtering"""
    query = {}
    if status:
        query["status"] = status
    if language:
        query["language"] = language
    
    calls = await async_db.calls.find(query).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    return [CallRecord(**call) for call in calls]

@api_router.get("/calls/{call_id}", response_model=CallRecord)
async def get_call(
    call_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific call by ID"""
    call = await async_db.calls.find_one({"id": call_id})
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return CallRecord(**call)

@api_router.put("/calls/{call_id}/end")
async def end_call(
    call_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """End an active call"""
    call = await async_db.calls.find_one({"id": call_id})
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    end_time = datetime.utcnow()
    start_time = call["start_time"]
    duration = int((end_time - start_time).total_seconds())
    
    update_data = {
        "end_time": end_time,
        "duration": duration,
        "status": "completed"
    }
    
    await async_db.calls.update_one({"id": call_id}, {"$set": update_data})
    
    # Trigger AI processing for completed call
    await process_call_ai(call_id)
    
    return {"message": "Call ended successfully", "duration": duration}

async def process_call_ai(call_id: str):
    """Process call with AI (transcription, sentiment analysis)"""
    call = await async_db.calls.find_one({"id": call_id})
    if not call:
        return
    
    # Mock transcription (in production, would process actual audio)
    transcription = await mock_transcribe_audio("mock_audio_url", call.get("language", "he"))
    sentiment = await mock_analyze_sentiment(transcription, call.get("language", "he"))
    
    # Update call with AI results
    await async_db.calls.update_one(
        {"id": call_id},
        {"$set": {
            "transcription": transcription,
            "sentiment": sentiment
        }}
    )
    
    # Store AI insights
    insight = AIInsight(
        call_id=call_id,
        insight_type="sentiment",
        content=f"Call sentiment analyzed as {sentiment}",
        confidence=0.85,
        language=call.get("language", "he")
    )
    await async_db.ai_insights.insert_one(insight.dict())

# Contacts Management
@api_router.post("/contacts", response_model=Contact)
async def create_contact(
    contact_data: ContactCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new contact"""
    contact_dict = contact_data.dict()
    contact_obj = Contact(**contact_dict)
    await async_db.contacts.insert_one(contact_obj.dict())
    return contact_obj

@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts(
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user)
):
    """Get contacts with optional search"""
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"phone_number": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}}
        ]
    
    contacts = await async_db.contacts.find(query).skip(skip).limit(limit).to_list(limit)
    return [Contact(**contact) for contact in contacts]

@api_router.get("/contacts/{contact_id}", response_model=Contact)
async def get_contact(
    contact_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific contact by ID"""
    contact = await async_db.contacts.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return Contact(**contact)

async def update_contact_call_stats(phone_number: str):
    """Update contact call statistics"""
    await async_db.contacts.update_one(
        {"phone_number": phone_number},
        {
            "$set": {"last_call_date": datetime.utcnow()},
            "$inc": {"total_calls": 1}
        },
        upsert=True
    )

# Analytics & Insights
@api_router.get("/analytics/summary")
async def get_analytics_summary():
    """Get overall analytics summary"""
    # Get date range for last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    # Aggregate data
    total_calls = await db.calls.count_documents({})
    recent_calls = await db.calls.count_documents({"created_at": {"$gte": thirty_days_ago}})
    
    # Sentiment analysis
    sentiment_pipeline = [
        {"$match": {"sentiment": {"$ne": None}}},
        {"$group": {"_id": "$sentiment", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    sentiment_data = await db.calls.aggregate(sentiment_pipeline).to_list(10)
    
    # Language distribution
    language_pipeline = [
        {"$group": {"_id": "$language", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    language_data = await db.calls.aggregate(language_pipeline).to_list(10)
    
    # Average call duration
    duration_pipeline = [
        {"$match": {"duration": {"$ne": None}}},
        {"$group": {"_id": None, "avg_duration": {"$avg": "$duration"}}}
    ]
    duration_result = await db.calls.aggregate(duration_pipeline).to_list(1)
    avg_duration = duration_result[0]["avg_duration"] if duration_result else 0
    
    return {
        "total_calls": total_calls,
        "recent_calls": recent_calls,
        "sentiment_distribution": {item["_id"]: item["count"] for item in sentiment_data},
        "language_distribution": {item["_id"]: item["count"] for item in language_data},
        "average_call_duration": round(avg_duration, 2)
    }

@api_router.get("/analytics/insights", response_model=List[AIInsight])
async def get_ai_insights(
    limit: int = Query(20, ge=1, le=100),
    insight_type: Optional[str] = Query(None)
):
    """Get AI insights"""
    query = {}
    if insight_type:
        query["insight_type"] = insight_type
    
    insights = await db.ai_insights.find(query).limit(limit).sort("created_at", -1).to_list(limit)
    return [AIInsight(**insight) for insight in insights]

# Sales Playbook
@api_router.get("/playbook/default")
async def get_default_playbook():
    """Get the default sales playbook"""
    default_playbook = {
        "title": "Qualified Lead Playbook",
        "language": "he",
        "sections": [
            {
                "title": "Qualification",
                "items": [
                    {"label": "Budget", "prompt": "What's your budget for this solution?"},
                    {"label": "Timeline", "prompt": "When are you looking to implement?"},
                    {"label": "Decision Maker", "prompt": "Who else is involved in the decision?"}
                ]
            },
            {
                "title": "Needs Analysis",
                "items": [
                    {"label": "Current Solution", "prompt": "What are you using currently?"},
                    {"label": "Pain Points", "prompt": "What challenges are you facing?"},
                    {"label": "Goals", "prompt": "What outcomes are you hoping to achieve?"}
                ]
            },
            {
                "title": "Demo Scheduling",
                "items": [
                    {"label": "Best Time", "prompt": "When would be the best time for a demo?"},
                    {"label": "Key Features", "prompt": "Which features are most important?"}
                ]
            }
        ]
    }
    return default_playbook

# Real API Integration Classes
class CheckcallAPI:
    """Real Checkcall API integration"""
    
    def __init__(self):
        self.base_url = CHECKCALL_API_BASE
        self.username = CHECKCALL_USERNAME
        self.password = CHECKCALL_PASSWORD
        self.user_id = CHECKCALL_USER_ID
        
    async def get_calls(self, from_date: str = None, to_date: str = None):
        """Get calls from Checkcall API"""
        try:
            post_data = {
                'uId': self.user_id,
                'action': 'getCalls',
                'fromDate': from_date or (datetime.now() - timedelta(days=30)).strftime('%d-%m-%Y'),
                'toDate': to_date or datetime.now().strftime('%d-%m-%Y')
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    data=post_data,
                    auth=(self.username, self.password),
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    logger.info(f"Retrieved {len(data)} calls from Checkcall")
                    return data
                else:
                    logger.error(f"Checkcall API error: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error getting calls from Checkcall: {e}")
            return []
    
    async def download_record(self, call_id: str):
        """Download call recording from Checkcall"""
        try:
            post_data = {
                'uId': self.user_id,
                'action': 'downloadRecord',
                'callId': call_id
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    data=post_data,
                    auth=(self.username, self.password),
                    timeout=60.0
                )
                
                if response.status_code == 200:
                    return response.content
                else:
                    logger.error(f"Failed to download recording: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error downloading recording: {e}")
            return None
    
    async def get_transcription(self, call_id: str):
        """Get transcription for a call"""
        try:
            post_data = {
                'uId': self.user_id,
                'action': 'getTranscription',
                'callId': call_id
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    data=post_data,
                    auth=(self.username, self.password),
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Failed to get transcription: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error getting transcription: {e}")
            return None

class MasterPBXAPI:
    """Real MasterPBX API integration"""
    
    def __init__(self):
        self.base_url = MASTERPBX_URL
        self.username = MASTERPBX_USERNAME
        self.password = MASTERPBX_PASSWORD
        self.session = None
        self.token = None
    
    async def authenticate(self):
        """Authenticate with MasterPBX"""
        try:
            async with httpx.AsyncClient() as client:
                login_data = {
                    'username': self.username,
                    'password': self.password
                }
                
                response = await client.post(
                    f"{self.base_url}/index.php/site/login",
                    data=login_data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    # Extract session cookies or token from response
                    self.session = response.cookies
                    logger.info("Successfully authenticated with MasterPBX")
                    return True
                else:
                    logger.error(f"MasterPBX auth failed: {response.status_code}")
                    return False
                    
        except Exception as e:
            logger.error(f"Error authenticating with MasterPBX: {e}")
            return False
    
    async def get_call_log(self, start_date: str = None, end_date: str = None):
        """Get call logs from MasterPBX"""
        if not self.session:
            await self.authenticate()
        
        try:
            params = {}
            if start_date:
                params['startDate'] = start_date
            if end_date:
                params['endDate'] = end_date
                
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/api/call-logs",
                    params=params,
                    cookies=self.session,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"MasterPBX call log error: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error getting call logs from MasterPBX: {e}")
            return []
    
    async def get_active_calls(self):
        """Get active calls from MasterPBX"""
        if not self.session:
            await self.authenticate()
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/api/active-calls",
                    cookies=self.session,
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"MasterPBX active calls error: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error getting active calls: {e}")
            return []

# Initialize API clients
checkcall_api = CheckcallAPI()
masterpbx_api = MasterPBXAPI()

# Real API Integration Endpoints
@api_router.get("/integrations/checkcall/calls")
async def get_checkcall_integration_calls(
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None)
):
    """Get calls from real Checkcall API"""
    calls = await checkcall_api.get_calls(from_date, to_date)
    
    # Store in database
    if calls:
        for call in calls:
            call_record = CallRecord(
                caller_name=call.get('caller_name', 'Unknown'),
                caller_number=call.get('caller_id', ''),
                duration=int(call.get('duration', 0)),
                status="completed",
                transcription=call.get('transcription', ''),
                sentiment=call.get('sentiment', 'neutral'),
                recording_url=call.get('recording_url', ''),
                start_time=datetime.now()
            )
            await db.calls.insert_one(call_record.dict())
    
    return {"status": "success", "data": calls, "count": len(calls)}

@api_router.get("/integrations/checkcall/recording/{call_id}")
async def download_call_recording(call_id: str):
    """Download recording from Checkcall"""
    recording_data = await checkcall_api.download_record(call_id)
    
    if recording_data:
        # Convert to base64 for frontend
        recording_b64 = base64.b64encode(recording_data).decode()
        return {"status": "success", "recording": recording_b64}
    else:
        raise HTTPException(status_code=404, detail="Recording not found")

@api_router.get("/integrations/checkcall/transcription/{call_id}")
async def get_call_transcription(call_id: str):
    """Get transcription from Checkcall"""
    transcription = await checkcall_api.get_transcription(call_id)
    
    if transcription:
        return {"status": "success", "transcription": transcription}
    else:
        raise HTTPException(status_code=404, detail="Transcription not found")

@api_router.get("/integrations/masterpbx/calllog")
async def get_masterpbx_integration_calllog(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Get call log from real MasterPBX API"""
    call_log = await masterpbx_api.get_call_log(start_date, end_date)
    
    # Store in database
    if call_log:
        for log_entry in call_log:
            # Convert MasterPBX format to our format
            call_record = CallRecord(
                caller_name=log_entry.get('caller_name', 'Unknown'),
                caller_number=log_entry.get('caller', ''),
                callee_number=log_entry.get('callee', ''),
                duration=int(log_entry.get('duration', 0)),
                status=log_entry.get('status', 'completed').lower(),
                start_time=datetime.now()
            )
            await db.calls.insert_one(call_record.dict())
    
    return {"status": "success", "data": call_log, "count": len(call_log)}

@api_router.get("/integrations/masterpbx/active-calls")
async def get_masterpbx_active_calls():
    """Get active calls from MasterPBX"""
    active_calls = await masterpbx_api.get_active_calls()
    return {"status": "success", "data": active_calls, "count": len(active_calls)}

# Real-time webhook endpoint for Checkcall
@api_router.post("/webhook/checkcall")
async def checkcall_webhook(data: dict):
    """Handle real-time webhooks from Checkcall"""
    try:
        logger.info(f"Received Checkcall webhook: {data}")
        
        # Process different event types
        event_type = data.get("event", "unknown")
        
        if event_type == "call_started":
            # Handle call start
            call_data = data.get("call_data", {})
            call_record = CallRecord(
                caller_name=call_data.get('caller_name', 'Unknown'),
                caller_number=call_data.get('caller_id', ''),
                status="active",
                start_time=datetime.now()
            )
            await db.calls.insert_one(call_record.dict())
            
        elif event_type == "call_ended":
            # Handle call end
            call_id = data.get("call_id")
            if call_id:
                await db.calls.update_one(
                    {"id": call_id},
                    {"$set": {
                        "status": "completed",
                        "end_time": datetime.now(),
                        "transcription": data.get("transcription", ""),
                        "sentiment": data.get("sentiment", "neutral")
                    }}
                )
        
        elif event_type == "transcription_ready":
            # Handle transcription completion
            call_id = data.get("call_id")
            transcription = data.get("transcription", "")
            sentiment = data.get("sentiment", "neutral")
            
            if call_id:
                await db.calls.update_one(
                    {"id": call_id},
                    {"$set": {
                        "transcription": transcription,
                        "sentiment": sentiment
                    }}
                )
        
        return {"status": "processed", "event": event_type}
        
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

# Advanced analytics endpoint
@api_router.get("/analytics/realtime")
async def get_realtime_analytics():
    """Get real-time analytics combining both APIs"""
    try:
        # Get recent data from both APIs
        checkcall_calls = await checkcall_api.get_calls()
        masterpbx_active = await masterpbx_api.get_active_calls()
        
        # Combine and analyze
        analytics = {
            "total_calls_today": len([c for c in checkcall_calls if is_today(c.get('start_time'))]),
            "active_calls": len(masterpbx_active),
            "checkcall_data": {
                "total_calls": len(checkcall_calls),
                "recent_transcriptions": [c for c in checkcall_calls if c.get('transcription')],
                "sentiment_breakdown": analyze_sentiment(checkcall_calls)
            },
            "masterpbx_data": {
                "active_calls": masterpbx_active,
                "system_status": "online"
            },
            "timestamp": datetime.now().isoformat()
        }
        
        return analytics
        
    except Exception as e:
        logger.error(f"Error getting realtime analytics: {e}")
        raise HTTPException(status_code=500, detail="Analytics error")

def is_today(timestamp_str):
    """Check if timestamp is from today"""
    try:
        if not timestamp_str:
            return False
        # Parse timestamp and check if it's today
        # Implementation depends on timestamp format from APIs
        return True  # Placeholder
    except:
        return False

def analyze_sentiment(calls):
    """Analyze sentiment distribution in calls"""
    sentiments = {'positive': 0, 'negative': 0, 'neutral': 0}
    for call in calls:
        sentiment = call.get('sentiment', 'neutral')
        if sentiment in sentiments:
            sentiments[sentiment] += 1
    return sentiments

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint - public access"""
    try:
        # Test database connection using synchronous client
        client.admin.command("ping")
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow(),
            "services": {
                "database": "connected",
                "api": "running"
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow(),
            "error": str(e)
        }

# ===== AUTHENTICATION ENDPOINTS =====

@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        # Check if username already exists
        existing_user = await get_user_by_username(user_data.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="שם משתמש כבר קיים"
            )
        
        # Check if email already exists
        existing_email = await get_user_by_email(user_data.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="כתובת אימייל כבר רשומה"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user
        user_doc = {
            "username": user_data.username,
            "email": user_data.email,
            "hashed_password": hashed_password,
            "full_name": user_data.full_name,
            "phone": user_data.phone,
            "role": "user",
            "user_type": user_data.user_type or "client",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "last_login": None,
            "preferences": {
                "language": "he",
                "theme": "light",
                "notifications": True
            },
            "subscription": {
                "plan_id": "free_trial",
                "plan_name": "ניסיון חינם",
                "status": "trial",
                "start_date": datetime.utcnow(),
                "end_date": datetime.utcnow() + timedelta(days=7),
                "trial_end_date": datetime.utcnow() + timedelta(days=7),
                "auto_renew": False,
                "features": ["basic_calls", "basic_crm", "web_dialer"]
            }
        }
        
        # Insert to database
        result = users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.username}, expires_delta=access_token_expires
        )
        
        # Return user data and token
        user = User(
            id=user_id,
            username=user_data.username,
            email=user_data.email,
            full_name=user_data.full_name,
            phone=user_data.phone,
            role="user",
            user_type=user_data.user_type or "client",
            is_active=True,
            created_at=datetime.utcnow(),
            preferences=user_doc["preferences"],
            subscription=user_doc["subscription"]
        )
        
        return Token(access_token=access_token, token_type="bearer", user=user)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה ברישום משתמש")

@api_router.post("/auth/login", response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return JWT token"""
    try:
        user = await authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="שם משתמש או סיסמה שגויים",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Update last login
        users_collection.update_one(
            {"username": user.username},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        # Return user data and token
        user_response = User(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            phone=user.phone,
            role=user.role,
            user_type=user.user_type,  # Use actual user_type from database
            is_active=user.is_active,
            created_at=user.created_at,
            last_login=datetime.utcnow(),
            preferences=user.preferences or {},
            subscription=user.subscription or {}
        )
        
        return Token(access_token=access_token, token_type="bearer", user=user_response)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in user: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בהתחברות")

@api_router.get("/auth/me", response_model=User)
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user

@api_router.put("/auth/profile", response_model=User)
async def update_user_profile(
    full_name: Optional[str] = None,
    phone: Optional[str] = None,
    preferences: Optional[Dict[str, Any]] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Update user profile"""
    try:
        update_data = {}
        if full_name is not None:
            update_data["full_name"] = full_name
        if phone is not None:
            update_data["phone"] = phone
        if preferences is not None:
            update_data["preferences"] = preferences
            
        if update_data:
            # Update in database
            users_collection.update_one(
                {"username": current_user.username},
                {"$set": update_data}
            )
            
            # Update current user object
            for key, value in update_data.items():
                setattr(current_user, key, value)
        
        return current_user
        
    except Exception as e:
        logger.error(f"Error updating user profile: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בעדכון פרופיל")

@api_router.post("/auth/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_active_user)
):
    """Change user password"""
    try:
        # Get user with password hash
        user_in_db = await get_user_by_username(current_user.username)
        if not user_in_db:
            raise HTTPException(status_code=404, detail="משתמש לא נמצא")
        
        # Verify current password
        if not verify_password(current_password, user_in_db.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="סיסמה נוכחית שגויה"
            )
        
        # Hash new password
        new_hashed_password = get_password_hash(new_password)
        
        # Update in database
        users_collection.update_one(
            {"username": current_user.username},
            {"$set": {"hashed_password": new_hashed_password}}
        )
        
        return {"message": "סיסמה עודכנה בהצלחה"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing password: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בשינוי סיסמה")

# ===== USER PROFILE & SUBSCRIPTION MANAGEMENT =====

@api_router.put("/auth/profile/advanced", response_model=User)
async def update_user_profile_advanced(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Advanced user profile update"""
    try:
        update_data = {}
        if profile_data.full_name is not None:
            update_data["full_name"] = profile_data.full_name
        if profile_data.phone is not None:
            update_data["phone"] = profile_data.phone
        if profile_data.email is not None:
            # Check if email already exists (excluding current user)
            existing_email = users_collection.find_one({
                "email": str(profile_data.email),
                "username": {"$ne": current_user.username}
            })
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="כתובת אימייל כבר בשימוש"
                )
            update_data["email"] = str(profile_data.email)
        if profile_data.preferences is not None:
            # Merge with existing preferences
            existing_preferences = current_user.preferences or {}
            existing_preferences.update(profile_data.preferences)
            update_data["preferences"] = existing_preferences
            
        if update_data:
            # Update in database
            users_collection.update_one(
                {"username": current_user.username},
                {"$set": update_data}
            )
            
            # Update current user object
            for key, value in update_data.items():
                setattr(current_user, key, value)
        
        return current_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user profile: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בעדכון פרופיל")

@api_router.get("/subscription/plans")
async def get_subscription_plans():
    """Get available subscription plans"""
    try:
        plans = [
            SubscriptionPlan(
                id="free_trial",
                name="ניסיון חינם",
                description="7 ימים חינם לכל התכונות",
                price=0,
                features=["עד 50 שיחות", "CRM בסיסי", "חייגן דיגיטלי", "תמיכה בצ'אט"],
                max_users=1,
                max_calls=50,
                billing_period="trial"
            ),
            SubscriptionPlan(
                id="basic",
                name="תכנית בסיסית",
                description="מושלמת לעסקים קטנים",
                price=99,
                features=["עד 500 שיחות", "CRM מתקדם", "חייגן דיגיטלי", "ניתוחי AI", "תמיכה בטלפון"],
                max_users=3,
                max_calls=500,
                billing_period="monthly"
            ),
            SubscriptionPlan(
                id="professional",
                name="תכנית מקצועית - HairPro",
                description="מיועדת לספרים ומטפלים מקצועיים",
                price=199,
                features=[
                    "שיחות ללא הגבלה", "HairPro IL Advanced", "מאגר צבעים מקצועי", 
                    "כרטיסי כימיה", "ניהול תורים מתקדם", "שקילה דיגיטלית", 
                    "ניתוחי AI מתקדמים", "תמיכה VIP"
                ],
                max_users=5,
                max_calls=-1,  # unlimited
                billing_period="monthly"
            ),
            SubscriptionPlan(
                id="enterprise",
                name="תכנית עסקית",
                description="לעסקים גדולים עם צרכים מתקדמים",
                price=499,
                features=[
                    "כל התכונות", "משתמשים ללא הגבלה", "אינטגרציות מותאמות אישית",
                    "ניתוחי BI מתקדמים", "תמיכה 24/7", "הכשרת צוות", "API פתוח"
                ],
                max_users=-1,  # unlimited
                max_calls=-1,  # unlimited
                billing_period="monthly"
            )
        ]
        return {"plans": plans}
        
    except Exception as e:
        logger.error(f"Error getting subscription plans: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת תכניות מנוי")

@api_router.get("/subscription/current")
async def get_current_subscription(current_user: User = Depends(get_current_active_user)):
    """Get current user subscription"""
    try:
        user_in_db = users_collection.find_one({"username": current_user.username})
        if not user_in_db:
            raise HTTPException(status_code=404, detail="משתמש לא נמצא")
        
        subscription = user_in_db.get("subscription", {})
        if not subscription:
            # Set default trial subscription if none exists
            subscription = {
                "plan_id": "free_trial",
                "plan_name": "ניסיון חינם",
                "status": "trial",
                "start_date": datetime.utcnow(),
                "end_date": datetime.utcnow() + timedelta(days=7),
                "trial_end_date": datetime.utcnow() + timedelta(days=7),
                "auto_renew": False,
                "features": ["basic_calls", "basic_crm", "web_dialer"]
            }
            # Update user with default subscription
            users_collection.update_one(
                {"username": current_user.username},
                {"$set": {"subscription": subscription}}
            )
        
        return {"subscription": subscription}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current subscription: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת מנוי נוכחי")

@api_router.post("/subscription/upgrade")
async def upgrade_subscription(
    plan_id: str,
    payment_method: Optional[str] = "credit_card",
    current_user: User = Depends(get_current_active_user)
):
    """Upgrade user subscription"""
    try:
        # Get plan details (in real app, this would come from database)
        plan_mapping = {
            "basic": {"name": "תכנית בסיסית", "price": 99},
            "professional": {"name": "תכנית מקצועית - HairPro", "price": 199},
            "enterprise": {"name": "תכנית עסקית", "price": 499}
        }
        
        if plan_id not in plan_mapping:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="תכנית מנוי לא קיימת"
            )
        
        plan_info = plan_mapping[plan_id]
        
        # Create new subscription
        new_subscription = {
            "plan_id": plan_id,
            "plan_name": plan_info["name"],
            "status": "active",
            "start_date": datetime.utcnow(),
            "end_date": datetime.utcnow() + timedelta(days=30),  # Monthly
            "trial_end_date": None,
            "auto_renew": True,
            "payment_method": payment_method,
            "last_payment_date": datetime.utcnow(),
            "next_payment_date": datetime.utcnow() + timedelta(days=30)
        }
        
        # Update user subscription
        users_collection.update_one(
            {"username": current_user.username},
            {"$set": {"subscription": new_subscription}}
        )
        
        return {
            "message": "מנוי שודרג בהצלחה",
            "subscription": new_subscription
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error upgrading subscription: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בשדרוג מנוי")

@api_router.get("/users/professional")
async def get_professional_users():
    """Get all professional users (for demo purposes)"""
    try:
        professionals = list(users_collection.find({
            "user_type": {"$in": ["professional", "therapist", "consultant", "barber"]}
        }))
        
        # Convert ObjectId to string and remove sensitive data
        for user in professionals:
            user["id"] = str(user.pop("_id", ""))
            user.pop("hashed_password", None)
        
        return {"professionals": professionals}
        
    except Exception as e:
        logger.error(f"Error getting professional users: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת משתמשים מקצועיים")

# ===== COMPREHENSIVE PROFESSIONAL SYSTEM API ENDPOINTS =====

# Collection references
clients_collection = db.clients
treatments_collection = db.treatments  
appointments_collection = db.appointments
schedules_collection = db.schedules
communications_collection = db.communications
goals_collection = db.goals
inventory_collection = db.inventory
attendance_collection = db.attendance

# ===== CLIENT MANAGEMENT ENDPOINTS =====

@api_router.post("/professional/clients", response_model=ClientProfile)
async def create_client(
    client_data: ClientProfile,
    current_user: User = Depends(get_current_active_user)
):
    """יצירת לקוח חדש"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        client_data.professional_id = current_user.id
        client_dict = client_data.dict()
        
        result = clients_collection.insert_one(client_dict)
        client_dict["id"] = str(result.inserted_id)
        
        return ClientProfile(**client_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating client: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה ביצירת לקוח")

@api_router.get("/professional/clients")
async def get_professional_clients(
    current_user: User = Depends(get_current_active_user)
):
    """קבלת כל הלקוחות של המשתמש המקצועי"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        clients = list(clients_collection.find({
            "professional_id": current_user.id,
            "is_active": True
        }))
        
        for client in clients:
            client["id"] = str(client.pop("_id"))
            
        return {"clients": clients, "total": len(clients)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting clients: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת לקוחות")

@api_router.get("/professional/clients/{client_id}")
async def get_client_details(
    client_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """קבלת פרטי לקוח מפורטים"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        # קבלת פרטי לקוח
        client = clients_collection.find_one({
            "id": client_id,
            "professional_id": current_user.id
        })
        
        if not client:
            raise HTTPException(status_code=404, detail="לקוח לא נמצא")
            
        client["id"] = str(client.pop("_id", client_id))
        
        # קבלת היסטוריית טיפולים
        treatments = list(treatments_collection.find({
            "client_id": client_id,
            "professional_id": current_user.id
        }).sort("created_at", -1))
        
        for treatment in treatments:
            treatment["id"] = str(treatment.pop("_id"))
            
        # קבלת תורים עתידיים
        upcoming_appointments = list(appointments_collection.find({
            "client_id": client_id,
            "professional_id": current_user.id,
            "scheduled_datetime": {"$gte": datetime.utcnow()},
            "status": {"$in": ["scheduled", "confirmed"]}
        }).sort("scheduled_datetime", 1))
        
        for appointment in upcoming_appointments:
            appointment["id"] = str(appointment.pop("_id"))
            
        return {
            "client": client,
            "treatments_history": treatments,
            "upcoming_appointments": upcoming_appointments,
            "total_treatments": len(treatments),
            "last_treatment": treatments[0] if treatments else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting client details: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת פרטי לקוח")

@api_router.put("/professional/clients/{client_id}")
async def update_client(
    client_id: str,
    client_updates: Dict[str, Any],
    current_user: User = Depends(get_current_active_user)
):
    """עדכון פרטי לקוח"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        client_updates["updated_at"] = datetime.utcnow()
        
        result = clients_collection.update_one(
            {"id": client_id, "professional_id": current_user.id},
            {"$set": client_updates}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="לקוח לא נמצא")
            
        return {"message": "פרטי הלקוח עודכנו בהצלחה"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating client: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בעדכון לקוח")

# ===== TREATMENT MANAGEMENT ENDPOINTS =====

@api_router.post("/professional/treatments", response_model=TreatmentRecord)
async def create_treatment_record(
    treatment_data: TreatmentRecord,
    current_user: User = Depends(get_current_active_user)
):
    """יצירת רשומת טיפול"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        treatment_data.professional_id = current_user.id
        treatment_dict = treatment_data.dict()
        
        result = treatments_collection.insert_one(treatment_dict)
        treatment_dict["id"] = str(result.inserted_id)
        
        # עדכון היסטוריית הלקוח
        clients_collection.update_one(
            {"id": treatment_data.client_id},
            {"$push": {"hair_profile.previous_treatments": {
                "treatment_id": treatment_dict["id"],
                "date": treatment_data.created_at,
                "service": treatment_data.service_type
            }}}
        )
        
        return TreatmentRecord(**treatment_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating treatment: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה ביצירת רשומת טיפול")

@api_router.get("/professional/treatments")
async def get_treatments(
    client_id: Optional[str] = None,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user)
):
    """קבלת רשומות טיפולים"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        query = {"professional_id": current_user.id}
        if client_id:
            query["client_id"] = client_id
            
        treatments = list(treatments_collection.find(query)
                         .sort("created_at", -1)
                         .limit(limit))
        
        for treatment in treatments:
            treatment["id"] = str(treatment.pop("_id"))
            
        return {"treatments": treatments, "total": len(treatments)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting treatments: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת רשומות טיפולים")

# ===== APPOINTMENT MANAGEMENT ENDPOINTS =====

@api_router.post("/professional/appointments", response_model=Appointment)
async def create_appointment(
    appointment_data: Appointment,
    current_user: User = Depends(get_current_active_user)
):
    """יצירת תור חדש"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        appointment_data.professional_id = current_user.id
        appointment_dict = appointment_data.dict()
        
        result = appointments_collection.insert_one(appointment_dict)
        appointment_dict["id"] = str(result.inserted_id)
        
        return Appointment(**appointment_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה ביצירת תור")

@api_router.get("/professional/appointments")
async def get_appointments(
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """קבלת תורים"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        query = {"professional_id": current_user.id}
        
        if date_from or date_to:
            date_query = {}
            if date_from:
                date_query["$gte"] = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
            if date_to:
                date_query["$lte"] = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
            query["scheduled_datetime"] = date_query
            
        if status:
            query["status"] = status
            
        appointments = list(appointments_collection.find(query)
                          .sort("scheduled_datetime", 1))
        
        for appointment in appointments:
            appointment["id"] = str(appointment.pop("_id"))
            
        return {"appointments": appointments, "total": len(appointments)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting appointments: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת תורים")

# ===== PROFESSIONAL SCHEDULE MANAGEMENT =====

@api_router.post("/professional/schedule")
async def set_schedule(
    schedule_data: ProfessionalSchedule,
    current_user: User = Depends(get_current_active_user)
):
    """הגדרת לוח זמנים יומי"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        schedule_data.professional_id = current_user.id
        schedule_dict = schedule_data.dict()
        
        # עדכון או יצירה
        result = schedules_collection.update_one(
            {"professional_id": current_user.id, "date": schedule_data.date},
            {"$set": schedule_dict},
            upsert=True
        )
        
        return {"message": "לוח הזמנים עודכן בהצלחה"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error setting schedule: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בהגדרת לוח זמנים")

@api_router.get("/professional/schedule")
async def get_schedule(
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """קבלת לוח זמנים"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        query = {"professional_id": current_user.id}
        
        if date_from or date_to:
            date_query = {}
            if date_from:
                date_query["$gte"] = datetime.fromisoformat(date_from).date()
            if date_to:
                date_query["$lte"] = datetime.fromisoformat(date_to).date()
            query["date"] = date_query
            
        schedules = list(schedules_collection.find(query).sort("date", 1))
        
        for schedule in schedules:
            schedule["id"] = str(schedule.pop("_id"))
            
        return {"schedules": schedules}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting schedule: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת לוח זמנים")

# ===== GOALS AND ANALYTICS =====

@api_router.post("/professional/goals")
async def set_goals(
    goals_data: ProfessionalGoals,
    current_user: User = Depends(get_current_active_user)
):
    """הגדרת יעדים"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        goals_data.professional_id = current_user.id
        goals_dict = goals_data.dict()
        
        result = goals_collection.insert_one(goals_dict)
        goals_dict["id"] = str(result.inserted_id)
        
        return {"message": "יעדים נשמרו בהצלחה", "goals": goals_dict}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error setting goals: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בהגדרת יעדים")

@api_router.get("/professional/analytics")
async def get_professional_analytics(
    period: str = "month",  # day, week, month, year
    current_user: User = Depends(get_current_active_user)
):
    """קבלת אנליטיקה מקצועית"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        # חישוב תקופת זמן
        now = datetime.utcnow()
        if period == "day":
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == "week":
            start_date = now - timedelta(days=7)
        elif period == "month":
            start_date = now - timedelta(days=30)
        else:  # year
            start_date = now - timedelta(days=365)
            
        # סטטיסטיקות טיפולים
        treatments_stats = treatments_collection.aggregate([
            {"$match": {
                "professional_id": current_user.id,
                "created_at": {"$gte": start_date}
            }},
            {"$group": {
                "_id": None,
                "total_treatments": {"$sum": 1},
                "total_revenue": {"$sum": "$service_details.final_price"},
                "avg_satisfaction": {"$avg": "$client_satisfaction"}
            }}
        ])
        treatments_data = list(treatments_stats)
        
        # סטטיסטיקות לקוחות
        clients_stats = clients_collection.count_documents({
            "professional_id": current_user.id,
            "created_at": {"$gte": start_date}
        })
        
        # סטטיסטיקות תורים
        appointments_stats = appointments_collection.aggregate([
            {"$match": {
                "professional_id": current_user.id,
                "scheduled_datetime": {"$gte": start_date}
            }},
            {"$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }}
        ])
        appointments_data = list(appointments_stats)
        
        return {
            "period": period,
            "treatments": treatments_data[0] if treatments_data else {
                "total_treatments": 0,
                "total_revenue": 0,
                "avg_satisfaction": 0
            },
            "new_clients": clients_stats,
            "appointments": {item["_id"]: item["count"] for item in appointments_data}
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת אנליטיקה")

# ===== INVENTORY MANAGEMENT =====

@api_router.post("/professional/inventory")
async def add_product_to_inventory(
    product_data: ProductInventory,
    current_user: User = Depends(get_current_active_user)
):
    """הוספת מוצר למלאי"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        product_data.professional_id = current_user.id
        product_dict = product_data.dict()
        
        result = inventory_collection.insert_one(product_dict)
        product_dict["id"] = str(result.inserted_id)
        
        return {"message": "מוצר נוסף למלאי בהצלחה", "product": product_dict}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding product to inventory: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בהוספת מוצר למלאי")

@api_router.get("/professional/inventory")
async def get_inventory(
    category: Optional[str] = None,
    low_stock_only: bool = False,
    current_user: User = Depends(get_current_active_user)
):
    """קבלת מלאי"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        query = {"professional_id": current_user.id}
        
        if category:
            query["product_category"] = category
            
        if low_stock_only:
            query["$expr"] = {"$lte": ["$current_stock", "$minimum_stock"]}
            
        products = list(inventory_collection.find(query))
        
        for product in products:
            product["id"] = str(product.pop("_id"))
            
        return {"inventory": products, "total": len(products)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting inventory: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת מלאי")

@api_router.put("/professional/inventory/{product_id}/stock")
async def update_product_stock(
    product_id: str,
    stock_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_user)
):
    """עדכון מלאי מוצר"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        update_data = {
            "current_stock": stock_data.get("new_stock", 0),
            "last_restocked": datetime.utcnow()
        }
        
        if "usage" in stock_data:
            update_data["$push"] = {
                "usage_tracking": {
                    "date": datetime.utcnow(),
                    "amount_used": stock_data["usage"],
                    "treatment_id": stock_data.get("treatment_id"),
                    "notes": stock_data.get("notes", "")
                }
            }
        
        result = inventory_collection.update_one(
            {"id": product_id, "professional_id": current_user.id},
            {"$set" if "usage" not in stock_data else "$set": update_data} if "usage" not in stock_data else update_data
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="מוצר לא נמצא")
            
        return {"message": "מלאי המוצר עודכן בהצלחה"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product stock: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בעדכון מלאי מוצר")

# ===== COMMUNICATION TRACKING =====

@api_router.post("/professional/communications")
async def log_communication(
    comm_data: ClientCommunication,
    current_user: User = Depends(get_current_active_user)
):
    """תיעוד תקשורת עם לקוח"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        comm_data.professional_id = current_user.id
        comm_dict = comm_data.dict()
        
        result = communications_collection.insert_one(comm_dict)
        comm_dict["id"] = str(result.inserted_id)
        
        return {"message": "תקשורת תועדה בהצלחה", "communication": comm_dict}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging communication: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בתיעוד תקשורת")

@api_router.get("/professional/communications/{client_id}")
async def get_client_communications(
    client_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """קבלת היסטוריית תקשורת עם לקוח"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        communications = list(communications_collection.find({
            "client_id": client_id,
            "professional_id": current_user.id
        }).sort("timestamp", -1).limit(50))
        
        for comm in communications:
            comm["id"] = str(comm.pop("_id"))
            
        return {"communications": communications, "total": len(communications)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting communications: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת תקשורת")

# ===== COMPREHENSIVE DASHBOARD DATA =====

@api_router.get("/professional/dashboard")
async def get_professional_dashboard(
    current_user: User = Depends(get_current_active_user)
):
    """קבלת נתוני דשבורד מקיפים"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + timedelta(days=1)
        
        # תורים היום
        today_appointments = list(appointments_collection.find({
            "professional_id": current_user.id,
            "scheduled_datetime": {"$gte": today, "$lt": tomorrow}
        }).sort("scheduled_datetime", 1))
        
        for apt in today_appointments:
            apt["id"] = str(apt.pop("_id"))
            
        # סטטיסטיקות היום
        today_treatments = treatments_collection.count_documents({
            "professional_id": current_user.id,
            "created_at": {"$gte": today}
        })
        
        today_revenue = list(treatments_collection.aggregate([
            {"$match": {
                "professional_id": current_user.id,
                "created_at": {"$gte": today}
            }},
            {"$group": {
                "_id": None,
                "total": {"$sum": "$service_details.final_price"}
            }}
        ]))
        
        # לקוחות חדשים השבוע
        week_ago = today - timedelta(days=7)
        new_clients_week = clients_collection.count_documents({
            "professional_id": current_user.id,
            "created_at": {"$gte": week_ago}
        })
        
        # מלאי נמוך
        low_stock = list(inventory_collection.find({
            "professional_id": current_user.id,
            "$expr": {"$lte": ["$current_stock", "$minimum_stock"]}
        }))
        
        for item in low_stock:
            item["id"] = str(item.pop("_id"))
            
        # יעדים נוכחיים
        current_goals = list(goals_collection.find({
            "professional_id": current_user.id,
            "target_date": {"$gte": today.date().isoformat()}
        }).sort("target_date", 1).limit(3))
        
        for goal in current_goals:
            goal["id"] = str(goal.pop("_id"))
            # Convert date to string for JSON serialization
            if "target_date" in goal:
                goal["target_date"] = goal["target_date"] if isinstance(goal["target_date"], str) else goal["target_date"].isoformat()
        
        return {
            "today_appointments": today_appointments,
            "today_stats": {
                "treatments_completed": today_treatments,
                "revenue": today_revenue[0]["total"] if today_revenue else 0,
                "appointments_scheduled": len(today_appointments)
            },
            "weekly_stats": {
                "new_clients": new_clients_week
            },
            "alerts": {
                "low_stock_items": low_stock,
                "low_stock_count": len(low_stock)
            },
            "current_goals": current_goals
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dashboard data: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת נתוני דשבורד")

# ===== DEMO DATA POPULATION FOR PROFESSIONAL SYSTEM =====

@api_router.post("/professional/populate-demo-data")
async def populate_professional_demo_data(
    current_user: User = Depends(get_current_active_user)
):
    """יצירת נתוני דמו מקיפים למערכת מקצועית"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        professional_id = current_user.id
        
        # יצירת לקוחות דמו
        demo_clients = [
            {
                "id": str(uuid.uuid4()),
                "professional_id": professional_id,
                "personal_info": {
                    "full_name": "שרה כהן",
                    "phone": "050-1234567",
                    "email": "sarah.cohen@gmail.com",
                    "birth_date": "1985-03-15",
                    "address": "תל אביב",
                    "emergency_contact": "יעל כהן - 052-7654321"
                },
                "hair_profile": {
                    "natural_color": "חום כהה 4",
                    "current_color": "בלונד בהיר 8.3",
                    "hair_type": "חלק",
                    "hair_thickness": "דק",
                    "scalp_condition": "רגיל",
                    "hair_length": "כתפיים",
                    "previous_treatments": []
                },
                "chemistry_card": {
                    "allergies": ["PPD - פניל דיאמין"],
                    "sensitivities": ["אמוניה חזקה"],
                    "patch_test_date": "2024-01-10",
                    "patch_test_result": "שלילי",
                    "notes": "לקוחה VIP - מעדיפה בלונדים",
                    "restrictions": []
                },
                "preferences": {
                    "preferred_time_slots": ["10:00-12:00", "14:00-16:00"],
                    "preferred_services": ["צביעה", "גוונים", "תספורת"],
                    "communication_preference": "whatsapp",
                    "language": "he",
                    "special_requests": "אוהבת שינויים דרמטיים"
                },
                "created_at": datetime.utcnow() - timedelta(days=90),
                "updated_at": datetime.utcnow(),
                "is_active": True
            },
            {
                "id": str(uuid.uuid4()),
                "professional_id": professional_id,
                "personal_info": {
                    "full_name": "רחל אברהם",
                    "phone": "053-9876543",
                    "email": "rachel.abraham@hotmail.com",
                    "birth_date": "1978-08-22",
                    "address": "רמת גן",
                    "emergency_contact": ""
                },
                "hair_profile": {
                    "natural_color": "חום בינוני 5",
                    "current_color": "חום עם גוונים 5.52",
                    "hair_type": "גלי",
                    "hair_thickness": "עבה",
                    "scalp_condition": "יבש",
                    "hair_length": "קצר",
                    "previous_treatments": []
                },
                "chemistry_card": {
                    "allergies": [],
                    "sensitivities": ["ריחות חזקים"],
                    "patch_test_date": "2024-02-05",
                    "patch_test_result": "שלילי",
                    "notes": "לקוחה קבועה - מגיעה כל חודש",
                    "restrictions": []
                },
                "preferences": {
                    "preferred_time_slots": ["09:00-11:00"],
                    "preferred_services": ["צביעת שורשים", "טיפולי שיער"],
                    "communication_preference": "phone",
                    "language": "he",
                    "special_requests": "מעדיפה שקט"
                },
                "created_at": datetime.utcnow() - timedelta(days=60),
                "updated_at": datetime.utcnow(),
                "is_active": True
            },
            {
                "id": str(uuid.uuid4()),
                "professional_id": professional_id,
                "personal_info": {
                    "full_name": "מירי לוי",
                    "phone": "052-5555555",
                    "email": "miri.levi@walla.com",
                    "birth_date": "1990-12-03",
                    "address": "חיפה",
                    "emergency_contact": "דני לוי - 050-1111111"
                },
                "hair_profile": {
                    "natural_color": "שחור 2",
                    "current_color": "שחור טבעי",
                    "hair_type": "מתולתל",
                    "hair_thickness": "בינוני",
                    "scalp_condition": "שמן",
                    "hair_length": "ארוך",
                    "previous_treatments": []
                },
                "chemistry_card": {
                    "allergies": [],
                    "sensitivities": [],
                    "patch_test_date": None,
                    "patch_test_result": "",
                    "notes": "לקוחה חדשה - רוצה שינוי דרמטי",
                    "restrictions": []
                },
                "preferences": {
                    "preferred_time_slots": ["16:00-18:00"],
                    "preferred_services": ["צביעה", "החלקות", "תספורת"],
                    "communication_preference": "email",
                    "language": "he",
                    "special_requests": ""
                },
                "created_at": datetime.utcnow() - timedelta(days=5),
                "updated_at": datetime.utcnow(),
                "is_active": True
            }
        ]
        
        # הכנסת לקוחות למסד נתונים
        clients_collection.insert_many(demo_clients)
        
        # יצירת רשומות טיפולים
        demo_treatments = []
        for i, client in enumerate(demo_clients[:2]):  # רק לשני הראשונים
            treatment = {
                "id": str(uuid.uuid4()),
                "client_id": client["id"],
                "professional_id": professional_id,
                "service_type": "צביעה + תספורת" if i == 0 else "צביעת שורשים",
                "service_details": {
                    "service_name": "צביעה מלאה + תספורת" if i == 0 else "צביעת שורשים",
                    "duration_minutes": 120 if i == 0 else 90,
                    "base_price": 350 if i == 0 else 250,
                    "final_price": 380 if i == 0 else 250,
                    "discount": 0
                },
                "color_formula": {
                    "brand": "שוורצקוף" if i == 0 else "לוריאל",
                    "series": "IGORA ROYAL" if i == 0 else "MAJIREL",
                    "colors_used": [
                        {"code": "8-3" if i == 0 else "5-52", "amount": "60g", "price": 28}
                    ],
                    "developer": {"vol": "20vol", "amount": "90ml", "price": 12},
                    "mixing_ratio": "1:1.5",
                    "processing_time": "35 דקות",
                    "final_result": "בלונד זהוב מושלם" if i == 0 else "חום מהגוני יפה"
                },
                "before_photos": [],
                "after_photos": [],
                "treatment_notes": "הלקוחה מאוד מרוצה מהתוצאה" if i == 0 else "צבע יפה ואחיד",
                "client_satisfaction": 5 if i == 0 else 4,
                "next_treatment_date": datetime.utcnow() + timedelta(days=45),
                "recommendations": ["טיפול קרטין", "מסכת לחות"] if i == 0 else ["צביעה חוזרת בעוד חודש"],
                "products_sold": [
                    {"name": "שמפו מיוחד לשיער צבוע", "price": 45, "quantity": 1}
                ] if i == 0 else [],
                "created_at": datetime.utcnow() - timedelta(days=30 if i == 0 else 15),
                "completed_at": datetime.utcnow() - timedelta(days=30 if i == 0 else 15)
            }
            demo_treatments.append(treatment)
            
        treatments_collection.insert_many(demo_treatments)
        
        # יצירת תורים עתידיים
        demo_appointments = []
        for i, client in enumerate(demo_clients):
            appointment = {
                "id": str(uuid.uuid4()),
                "client_id": client["id"],
                "professional_id": professional_id,
                "scheduled_datetime": datetime.utcnow() + timedelta(days=i+1, hours=10+i*2),
                "duration_minutes": 90,
                "service_type": ["גוונים", "צביעת שורשים", "צביעה מלאה"][i],
                "service_details": {
                    "estimated_price": [280, 250, 380][i],
                    "notes": ["גוונים עדינים", "שורשים בלבד", "שינוי צבע דרמטי"][i]
                },
                "status": "confirmed",
                "notes": "לקוחה קבועה" if i < 2 else "לקוחה חדשה - זקוקה לייעוץ",
                "reminder_sent": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            demo_appointments.append(appointment)
            
        appointments_collection.insert_many(demo_appointments)
        
        # יצירת מלאי דמו
        demo_inventory = [
            {
                "id": str(uuid.uuid4()),
                "professional_id": professional_id,
                "product_category": "color",
                "product_details": {
                    "brand": "שוורצקוף",
                    "name": "IGORA ROYAL 6-0",
                    "code": "6-0",
                    "size": "60ml",
                    "unit_price": 28,
                    "supplier": "יבואן רשמי"
                },
                "current_stock": 15,
                "minimum_stock": 5,
                "last_restocked": datetime.utcnow() - timedelta(days=10),
                "usage_tracking": [
                    {
                        "date": datetime.utcnow() - timedelta(days=2),
                        "amount_used": 30,
                        "treatment_id": demo_treatments[0]["id"] if demo_treatments else None,
                        "notes": "טיפול מלא"
                    }
                ],
                "created_at": datetime.utcnow() - timedelta(days=30)
            },
            {
                "id": str(uuid.uuid4()),
                "professional_id": professional_id,
                "product_category": "color",
                "product_details": {
                    "brand": "לוריאל",
                    "name": "MAJIREL 8.3",
                    "code": "8.3",
                    "size": "50ml",
                    "unit_price": 32,
                    "supplier": "יבואן רשמי"
                },
                "current_stock": 3,  # מלאי נמוך!
                "minimum_stock": 5,
                "last_restocked": datetime.utcnow() - timedelta(days=20),
                "usage_tracking": [],
                "created_at": datetime.utcnow() - timedelta(days=45)
            }
        ]
        
        inventory_collection.insert_many(demo_inventory)
        
        # יצירת יעדים
        demo_goals = {
            "id": str(uuid.uuid4()),
            "professional_id": professional_id,
            "goal_type": "monthly",
            "target_date": (datetime.utcnow() + timedelta(days=30)).date().isoformat(),
            "goals": {
                "revenue_target": 15000,
                "clients_target": 50,
                "new_clients_target": 10,
                "satisfaction_target": 4.5,
                "services_target": {"צביעה": 20, "תספורת": 30, "טיפולים": 15}
            },
            "current_progress": {
                "revenue_current": 8500,
                "clients_current": 28,
                "new_clients_current": 6,
                "satisfaction_current": 4.7
            },
            "is_achieved": False,
            "created_at": datetime.utcnow()
        }
        
        goals_collection.insert_one(demo_goals)
        
        # יצירת תקשורת דמו
        demo_communications = [
            {
                "id": str(uuid.uuid4()),
                "client_id": demo_clients[0]["id"],
                "professional_id": professional_id,
                "communication_type": "whatsapp",
                "direction": "outgoing",
                "content": "היי שרה! תזכורת לתור שלך מחר בשעה 10:00. נשמח לראות אותך!",
                "timestamp": datetime.utcnow() - timedelta(hours=12),
                "status": "delivered",
                "metadata": {"reminder_type": "appointment"}
            },
            {
                "id": str(uuid.uuid4()),
                "client_id": demo_clients[1]["id"],
                "professional_id": professional_id,
                "communication_type": "phone",
                "direction": "incoming",
                "content": "שיחת טלפון - רוצה לקבוע תור לשבוע הבא",
                "timestamp": datetime.utcnow() - timedelta(days=2),
                "status": "completed",
                "metadata": {"call_duration": "5 minutes"}
            }
        ]
        
        communications_collection.insert_many(demo_communications)
        
        return {
            "message": "נתוני דמו נוצרו בהצלחה!",
            "data_created": {
                "clients": len(demo_clients),
                "treatments": len(demo_treatments),
                "appointments": len(demo_appointments),
                "inventory_items": len(demo_inventory),
                "goals": 1,
                "communications": len(demo_communications)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating demo data: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה ביצירת נתוני דמו")

# ===== ADVANCED PROFESSIONAL SYSTEM API ENDPOINTS =====

# Initialize professional calculation engines
formula_calculator = None
inventory_manager = SmartInventoryManager()
scale_manager = BluetoothScaleManager()

# New collections for advanced features
formulas_collection = db.formulas
chemistry_cards_collection = db.chemistry_cards
treatment_sessions_collection = db.treatment_sessions
scale_readings_collection = db.scale_readings
metrics_collection = db.professional_metrics

# ===== COLOR FORMULA MANAGEMENT =====

@api_router.post("/professional/formulas", response_model=ColorFormula)
async def create_color_formula(
    formula_data: ColorFormula,
    current_user: User = Depends(get_current_active_user)
):
    """יצירת פורמולת צבע עם חישובי עלות מדויקים"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        formula_data.professional_id = current_user.id
        
        # Initialize formula calculator with color database
        from .color_database import color_database  # This should be your color database
        global formula_calculator
        if not formula_calculator:
            formula_calculator = FormulaCalculator(color_database)
        
        # Calculate costs and efficiency
        cost_analysis = formula_calculator.calculate_formula_cost({
            'colors_used': formula_data.colors_used,
            'developer': formula_data.developer
        })
        
        # Update formula with calculations
        formula_data.cost_breakdown = cost_analysis
        formula_data.waste_grams = cost_analysis['waste_grams']
        formula_data.waste_percentage = cost_analysis['waste_percentage']
        formula_data.efficiency_score = cost_analysis['efficiency_score']
        
        if formula_data.service_price > 0:
            formula_data.profit_margin = formula_calculator.calculate_profit_margin(
                cost_analysis['total_material_cost'],
                formula_data.service_price
            )
        
        formula_dict = formula_data.dict()
        result = formulas_collection.insert_one(formula_dict)
        formula_dict["id"] = str(result.inserted_id)
        
        # Update inventory usage
        await update_inventory_usage(formula_data.colors_used, formula_data.developer, current_user.id)
        
        return ColorFormula(**formula_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating formula: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה ביצירת פורמולה")

@api_router.get("/professional/formulas")
async def get_formulas(
    client_id: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user)
):
    """קבלת פורמולות צבע עם סינון"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        query = {"professional_id": current_user.id}
        
        if client_id:
            query["client_id"] = client_id
        
        if date_from or date_to:
            date_query = {}
            if date_from:
                date_query["$gte"] = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
            if date_to:
                date_query["$lte"] = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
            query["created_at"] = date_query
        
        formulas = list(formulas_collection.find(query)
                       .sort("created_at", -1)
                       .limit(limit))
        
        for formula in formulas:
            formula["id"] = str(formula.pop("_id"))
            
        return {"formulas": formulas, "total": len(formulas)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting formulas: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת פורמולות")

@api_router.get("/professional/formulas/{formula_id}/cost-analysis")
async def get_formula_cost_analysis(
    formula_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """ניתוח עלויות מפורט לפורמולה"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        formula = formulas_collection.find_one({
            "id": formula_id,
            "professional_id": current_user.id
        })
        
        if not formula:
            raise HTTPException(status_code=404, detail="פורמולה לא נמצאה")
        
        # Enhanced cost analysis
        analysis = {
            "formula_id": formula_id,
            "cost_breakdown": formula.get("cost_breakdown", {}),
            "efficiency_metrics": {
                "waste_percentage": formula.get("waste_percentage", 0),
                "efficiency_score": formula.get("efficiency_score", 0),
                "profit_margin": formula.get("profit_margin", 0)
            },
            "recommendations": []
        }
        
        # Add recommendations based on analysis
        if formula.get("waste_percentage", 0) > 10:
            analysis["recommendations"].append({
                "type": "waste_reduction",
                "message": "אחוז בזבוז גבוה - שקול למדוד בדקדוק רב יותר",
                "priority": "high"
            })
        
        if formula.get("efficiency_score", 0) > 95:
            analysis["recommendations"].append({
                "type": "excellent_work",
                "message": "עבודה מעולה! יעילות גבוהה מאוד",
                "priority": "info"
            })
        
        return analysis
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting cost analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בניתוח עלויות")

# ===== BLUETOOTH SCALE INTEGRATION =====

@api_router.post("/professional/scale/connect")
async def connect_bluetooth_scale(
    current_user: User = Depends(get_current_active_user)
):
    """חיבור למשקל בלוטות'"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        connection_result = scale_manager.connect_scale()
        return connection_result
        
    except Exception as e:
        logger.error(f"Error connecting scale: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בחיבור למשקל")

@api_router.get("/professional/scale/reading")
async def get_scale_reading(
    formula_id: Optional[str] = None,
    component_type: Optional[str] = None,
    component_code: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """קריאת משקל נוכחי"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        current_weight = scale_manager.get_weight_reading()
        
        reading = {
            "weight": current_weight,
            "timestamp": datetime.utcnow().isoformat(),
            "scale_connected": scale_manager.connected,
            "reading_stable": True
        }
        
        # Save reading if formula context provided
        if formula_id and component_type and component_code:
            scale_reading = BluetoothScaleReading(
                formula_id=formula_id,
                component_type=component_type,
                component_code=component_code,
                planned_weight=0,  # To be updated
                actual_weight=current_weight,
                variance=0  # To be calculated
            )
            
            reading_dict = scale_reading.dict()
            result = scale_readings_collection.insert_one(reading_dict)
            reading["reading_id"] = str(result.inserted_id)
        
        return reading
        
    except Exception as e:
        logger.error(f"Error getting scale reading: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקריאת משקל")

@api_router.post("/professional/scale/validate")
async def validate_measurement(
    expected_weight: float,
    actual_weight: float,
    current_user: User = Depends(get_current_active_user)
):
    """אימות מדידה מול משקל מתוכנן"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        validation = scale_manager.validate_measurement(expected_weight, actual_weight)
        return validation
        
    except Exception as e:
        logger.error(f"Error validating measurement: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה באימות מדידה")

# ===== CHEMISTRY CARDS MANAGEMENT =====

@api_router.post("/professional/chemistry-cards", response_model=ClientChemistryCard)
async def create_chemistry_card(
    card_data: ClientChemistryCard,
    current_user: User = Depends(get_current_active_user)
):
    """יצירת כרטיס כימיה ללקוח"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        card_data.professional_id = current_user.id
        card_dict = card_data.dict()
        
        result = chemistry_cards_collection.insert_one(card_dict)
        card_dict["id"] = str(result.inserted_id)
        
        return ClientChemistryCard(**card_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating chemistry card: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה ביצירת כרטיס כימיה")

@api_router.get("/professional/chemistry-cards/{client_id}")
async def get_client_chemistry_card(
    client_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """קבלת כרטיס כימיה של לקוח"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        card = chemistry_cards_collection.find_one({
            "client_id": client_id,
            "professional_id": current_user.id
        })
        
        if not card:
            raise HTTPException(status_code=404, detail="כרטיס כימיה לא נמצא")
        
        card["id"] = str(card.pop("_id"))
        return card
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting chemistry card: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת כרטיס כימיה")

# ===== SMART INVENTORY WITH ADVANCED CALCULATIONS =====

@api_router.get("/professional/inventory/smart-analysis")
async def get_smart_inventory_analysis(
    current_user: User = Depends(get_current_active_user)
):
    """ניתוח מלאי חכם עם המלצות"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        inventory_items = list(inventory_collection.find({
            "professional_id": current_user.id
        }))
        
        analysis = {
            "total_items": len(inventory_items),
            "low_stock_items": [],
            "reorder_recommendations": [],
            "critical_alerts": [],
            "cost_analysis": {
                "total_inventory_value": 0,
                "low_stock_value": 0
            }
        }
        
        for item in inventory_items:
            item["id"] = str(item.pop("_id"))
            
            # Calculate days until empty and recommendations
            recommendation = inventory_manager.get_reorder_recommendation(
                SmartInventoryItem(**item)
            )
            
            item["days_until_empty"] = recommendation["days_until_empty"]
            item["reorder_recommendation"] = recommendation
            
            analysis["cost_analysis"]["total_inventory_value"] += item["current_stock"] * item.get("cost_per_unit", 0)
            
            if recommendation["urgency"] in ["CRITICAL", "HIGH"]:
                analysis["low_stock_items"].append(item)
                analysis["cost_analysis"]["low_stock_value"] += item["current_stock"] * item.get("cost_per_unit", 0)
                
                if recommendation["urgency"] == "CRITICAL":
                    analysis["critical_alerts"].append({
                        "item_name": f"{item['brand']} {item['product_name']}",
                        "message": recommendation["message"],
                        "urgency": "CRITICAL"
                    })
            
            if recommendation["days_until_empty"] <= 14:
                analysis["reorder_recommendations"].append({
                    "item": item,
                    "recommendation": recommendation
                })
        
        return analysis
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting smart inventory analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בניתוח מלאי חכם")

async def update_inventory_usage(colors_used, developer, professional_id):
    """עדכון שימוש במלאי בעקבות פורמולה"""
    try:
        # Update color usage
        for color in colors_used:
            inventory_collection.update_one(
                {
                    "professional_id": professional_id,
                    "product_code": color.get("code"),
                    "brand": color.get("brand")
                },
                {
                    "$inc": {"current_stock": -color.get("actual_weight", 0)},
                    "$push": {
                        "usage_history": inventory_manager.update_usage_history(
                            None, color.get("actual_weight", 0)
                        )
                    }
                }
            )
        
        # Update developer usage
        developer_amount = developer.get("actual_amount_ml", 0)
        if developer_amount > 0:
            inventory_collection.update_one(
                {
                    "professional_id": professional_id,
                    "category": "developer",
                    "product_code": developer.get("vol", "20vol")
                },
                {
                    "$inc": {"current_stock": -developer_amount},
                    "$push": {
                        "usage_history": inventory_manager.update_usage_history(
                            None, developer_amount
                        )
                    }
                }
            )
    except Exception as e:
        logger.error(f"Error updating inventory usage: {str(e)}")

@api_router.post("/setup/demo-data")
async def create_demo_data():
    """Create demo users and data - Development only"""
    try:
        # Demo users data
        demo_users = [
            {
                "username": "admin",
                "email": "admin@telephony.ai",
                "password": "admin123",
                "full_name": "מנהל המערכת",
                "phone": "+972-50-123-4567",
                "role": "admin"
            },
            {
                "username": "manager",
                "email": "manager@telephony.ai", 
                "password": "manager123",
                "full_name": "דנה לוי - מנהלת מכירות",
                "phone": "+972-50-234-5678",
                "role": "manager"
            },
            {
                "username": "agent1",
                "email": "agent1@telephony.ai",
                "password": "agent123", 
                "full_name": "יוסי כהן - נציג מכירות",
                "phone": "+972-50-345-6789",
                "role": "user"
            },
            {
                "username": "agent2",
                "email": "agent2@telephony.ai",
                "password": "agent123",
                "full_name": "שרה מילר - נציגת תמיכה", 
                "phone": "+972-50-456-7890",
                "role": "user"
            },
            {
                "username": "demo",
                "email": "demo@telephony.ai",
                "password": "demo123",
                "full_name": "משתמש דמו",
                "phone": "+972-50-567-8901", 
                "role": "user",
                "user_type": "client"
            },
            {
                "username": "professional",
                "email": "professional@hairpro.il",
                "password": "pro123",
                "full_name": "בעל מקצוע - ספר מקצועי",
                "phone": "+972-50-678-9012",
                "role": "user",
                "user_type": "professional"
            }
        ]
        
        created_users = []
        
        for user_data in demo_users:
            # Check if user already exists
            existing_user = await get_user_by_username(user_data["username"])
            if existing_user:
                logger.info(f"User {user_data['username']} already exists, skipping...")
                continue
                
            # Hash password
            hashed_password = get_password_hash(user_data["password"])
            
            # Create user document
            user_type = user_data.get("user_type", "client")
            
            # Set subscription based on user type
            if user_type == "professional":
                subscription = {
                    "plan_id": "professional",
                    "plan_name": "תכנית מקצועית - HairPro",
                    "status": "active",
                    "start_date": datetime.utcnow(),
                    "end_date": datetime.utcnow() + timedelta(days=365),  # 1 year for demo
                    "trial_end_date": None,
                    "auto_renew": True,
                    "features": [
                        "hairpro_advanced", "color_database", "chemistry_cards", 
                        "digital_weighing", "appointment_management", "unlimited_calls"
                    ]
                }
            else:
                subscription = {
                    "plan_id": "basic",
                    "plan_name": "תכנית בסיסית",
                    "status": "active",
                    "start_date": datetime.utcnow(),
                    "end_date": datetime.utcnow() + timedelta(days=30),
                    "trial_end_date": None,
                    "auto_renew": True,
                    "features": ["basic_calls", "basic_crm", "web_dialer"]
                }
            
            user_doc = {
                "username": user_data["username"],
                "email": user_data["email"],
                "hashed_password": hashed_password,
                "full_name": user_data["full_name"], 
                "phone": user_data["phone"],
                "role": user_data["role"],
                "user_type": user_type,
                "is_active": True,
                "created_at": datetime.utcnow(),
                "last_login": None,
                "preferences": {
                    "language": "he",
                    "theme": "light",
                    "notifications": True
                },
                "subscription": subscription
            }
            
            # Insert to database
            result = users_collection.insert_one(user_doc)
            user_id = str(result.inserted_id)
            
            created_users.append({
                "id": user_id,
                "username": user_data["username"],
                "email": user_data["email"],
                "full_name": user_data["full_name"],
                "role": user_data["role"]
            })
            
            logger.info(f"Created demo user: {user_data['username']}")
        
        # Create demo CRM data for users
        demo_crm_data = {
            "leads": [
                {
                    "id": str(uuid.uuid4()),
                    "name": "אברהם שטרן",
                    "company": "חברת הייטק צעירה",
                    "email": "avraham@startup.co.il",
                    "phone": "+972-50-111-2222",
                    "status": "hot",
                    "value": 85000,
                    "source": "אתר אינטרנט",
                    "assigned_to": "agent1",
                    "created_at": datetime.utcnow(),
                    "notes": "מעוניין בחבילה מתקדמת, יש תקציב מאושר"
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "רחל גולדברג", 
                    "company": "רשת חנויות אופנה",
                    "email": "rachel@fashion.co.il",
                    "phone": "+972-50-222-3333",
                    "status": "warm",
                    "value": 45000,
                    "source": "Google Ads",
                    "assigned_to": "agent2",
                    "created_at": datetime.utcnow() - timedelta(days=2),
                    "notes": "צריכה להציג למועצת המנהלים"
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "David Miller",
                    "company": "International Trading",
                    "email": "david@trading.com",
                    "phone": "+1-555-444-5555",
                    "status": "cold",
                    "value": 120000,
                    "source": "המלצה",
                    "assigned_to": "manager",
                    "created_at": datetime.utcnow() - timedelta(days=5),
                    "notes": "לקוח פוטנציאלי גדול, דורש מפגש פרונטלי"
                }
            ],
            "deals": [
                {
                    "id": str(uuid.uuid4()),
                    "name": "עסקת מערכת CRM מלאה",
                    "client": "אברהם שטרן",
                    "value": 85000,
                    "stage": "משא ומתן",
                    "probability": 85,
                    "expected_close": datetime.utcnow() + timedelta(days=15),
                    "assigned_to": "agent1",
                    "created_at": datetime.utcnow() - timedelta(days=10)
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "חבילת תמיכה שנתית",
                    "client": "רחל גולדברג",
                    "value": 45000,
                    "stage": "הצעה נשלחה",
                    "probability": 60,
                    "expected_close": datetime.utcnow() + timedelta(days=30),
                    "assigned_to": "agent2",
                    "created_at": datetime.utcnow() - timedelta(days=7)
                }
            ],
            "tasks": [
                {
                    "id": str(uuid.uuid4()),
                    "title": "התקשר לאברהם לבירור סופי",
                    "description": "לוודא שכל התנאים ברורים לפני חתימה",
                    "assigned_to": "agent1",
                    "due_date": datetime.utcnow() + timedelta(days=1),
                    "priority": "high",
                    "status": "pending",
                    "created_at": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "הכנת הצגה לרחל",
                    "description": "הצגת ROI למועצת המנהלים",
                    "assigned_to": "agent2", 
                    "due_date": datetime.utcnow() + timedelta(days=3),
                    "priority": "medium",
                    "status": "in_progress",
                    "created_at": datetime.utcnow() - timedelta(days=1)
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "מעקב עם David Miller",
                    "description": "תיאום פגישה בארה\"ב",
                    "assigned_to": "manager",
                    "due_date": datetime.utcnow() + timedelta(days=7),
                    "priority": "high", 
                    "status": "pending",
                    "created_at": datetime.utcnow() - timedelta(days=2)
                }
            ]
        }
        
        # Store CRM data in database
        crm_collection = db.crm_data
        crm_collection.delete_many({})  # Clear existing demo data
        crm_collection.insert_one(demo_crm_data)
        
        # Create demo conversations
        demo_conversations = [
            {
                "id": str(uuid.uuid4()),
                "contact": {
                    "name": "אברהם שטרן",
                    "phone": "+972-50-111-2222",
                    "email": "avraham@startup.co.il"
                },
                "platform": "whatsapp",
                "messages": [
                    {
                        "id": str(uuid.uuid4()),
                        "text": "שלום, אני מעוניין במידע על המערכת שלכם",
                        "sender": "customer",
                        "timestamp": datetime.utcnow() - timedelta(hours=2),
                        "is_read": True
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "text": "שלום אברהם! בוודאי אשמח לעזור. איזה סוג מערכת מעניין אותך?",
                        "sender": "agent",
                        "timestamp": datetime.utcnow() - timedelta(hours=2, minutes=5),
                        "is_read": True
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "text": "אנחנו חברת הייטק עם 50 עובדים, מחפשים פתרון CRM מתקדם",
                        "sender": "customer", 
                        "timestamp": datetime.utcnow() - timedelta(hours=1),
                        "is_read": True
                    }
                ],
                "status": "active",
                "assigned_to": "agent1",
                "created_at": datetime.utcnow() - timedelta(hours=3)
            }
        ]
        
        # Store conversations
        conversations_collection = db.conversations
        conversations_collection.delete_many({})
        conversations_collection.insert_many(demo_conversations)
        
        return {
            "status": "success",
            "message": f"נוצרו {len(created_users)} משתמשי דמו ונתונים",
            "users_created": created_users,
            "demo_data": {
                "leads": len(demo_crm_data["leads"]),
                "deals": len(demo_crm_data["deals"]),
                "tasks": len(demo_crm_data["tasks"]),
                "conversations": len(demo_conversations)
            }
        }
        
    except Exception as e:
        logger.error(f"Error creating demo data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"שגיאה ביצירת נתוני דמו: {str(e)}")

# ===== ADVANCED AI ANALYTICS ENDPOINTS =====

@api_router.get("/ai/realtime-analysis")
async def get_realtime_analysis(current_user: User = Depends(get_current_active_user)):
    """Get real-time AI analysis during active call"""
    try:
        # Simulate real-time AI analysis
        sentiments = ['positive', 'negative', 'neutral']
        sentiment = random.choice(sentiments)
        
        keywords = [
            'מחיר', 'הנחה', 'תנאים', 'חוזה', 'משלוח', 'תמיכה',
            'איכות', 'מוצר', 'שירות', 'זמן', 'תשלום', 'הזמנה'
        ]
        
        selected_keywords = random.sample(keywords, 3)
        
        suggestions = {
            'positive': [
                'הלקוח מרוצה - זה הזמן לסגור את העסקה',
                'הזכר את ההטבות הנוספות',
                'הציע אפשרות לשדרוג'
            ],
            'negative': [
                'הלקוח מביע חוסר שביעות רצון - הקשב בעיון',
                'הציע פתרון אלטרנטיבי',
                'העבר למנהל אם נדרש'
            ],
            'neutral': [
                'המשך בשיחה רגילה',
                'נסה לזהות צרכים נוספים',
                'שאל שאלות מפתח'
            ]
        }
        
        analysis = RealTimeAnalysis(
            sentiment=sentiment,
            confidence=round(random.uniform(70, 95), 2),
            keywords=selected_keywords,
            emotions={
                'happiness': round(random.uniform(0, 100), 2),
                'anger': round(random.uniform(0, 30), 2),
                'surprise': round(random.uniform(0, 50), 2),
                'sadness': round(random.uniform(0, 20), 2)
            },
            suggestions=suggestions[sentiment],
            risk_level='high' if sentiment == 'negative' else 'low' if sentiment == 'positive' else 'medium'
        )
        
        return {"status": "success", "data": analysis.dict()}
    
    except Exception as e:
        logger.error(f"Error getting real-time analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/ai/transcription")
async def get_transcription(current_user: User = Depends(get_current_active_user)):
    """Get real-time transcription entries"""
    try:
        # Simulate transcription entries
        sample_texts = [
            "שלום, אני מעוניין בשירותים שלכם",
            "כמה עולה המוצר?",
            "האם יש אפשרות להנחה?",
            "מתי אוכל לקבל את המוצר?",
            "תודה על המידע, אני אחשוב על זה"
        ]
        
        entries = []
        for i in range(3):
            entry = TranscriptionEntry(
                speaker=random.choice(['customer', 'agent']),
                text=random.choice(sample_texts),
                timestamp=datetime.now().strftime("%H:%M:%S"),
                sentiment=random.choice(['positive', 'negative', 'neutral'])
            )
            entries.append(entry.dict())
        
        return {"status": "success", "data": entries}
    
    except Exception as e:
        logger.error(f"Error getting transcription: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== MESSAGING CENTER ENDPOINTS =====

@api_router.get("/messaging/conversations")
async def get_conversations(current_user: User = Depends(get_current_active_user)):
    """Get all messaging conversations"""
    try:
        conversations = [
            {
                "id": "1",
                "contact": {"name": "יוסי כהן", "phone": "+972-50-123-4567"},
                "platform": "whatsapp",
                "last_message": {
                    "text": "תודה על השירות המעולה!",
                    "timestamp": "14:30",
                    "is_read": True,
                    "sender": "customer"
                },
                "status": "active",
                "unread_count": 0,
                "tags": ["לקוח VIP", "עסקה פתוחה"]
            },
            {
                "id": "2",
                "contact": {"name": "Sarah Miller", "phone": "+1-555-987-6543"},
                "platform": "sms",
                "last_message": {
                    "text": "מתי תוכל להתקשר אלי?",
                    "timestamp": "13:45",
                    "is_read": False,
                    "sender": "customer"
                },
                "status": "pending",
                "unread_count": 2,
                "tags": ["פרוספקט"]
            }
        ]
        
        return {"status": "success", "data": conversations}
    
    except Exception as e:
        logger.error(f"Error getting conversations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/messaging/campaigns")
async def get_campaigns(current_user: User = Depends(get_current_active_user)):
    """Get all messaging campaigns"""
    try:
        campaigns = [
            {
                "id": "1",
                "name": "ברכה ללקוחות חדשים",
                "platform": "whatsapp",
                "status": "active",
                "sent": 145,
                "delivered": 142,
                "read": 128,
                "replied": 34,
                "created": "2024-01-15",
                "schedule": "מיידי",
                "template": "ברוכים הבאים! תודה על הצטרפותכם לשירותי {company_name}",
                "target_audience": ["new_customers"]
            },
            {
                "id": "2",
                "name": "תזכורת פגישה",
                "platform": "sms",
                "status": "scheduled",
                "sent": 0,
                "delivered": 0,
                "read": 0,
                "replied": 0,
                "created": "2024-01-14",
                "schedule": "יומי ב-09:00",
                "template": "תזכורת: יש לך פגישה ב-{meeting_time} עם {agent_name}",
                "target_audience": ["customers_with_meetings"]
            }
        ]
        
        return {"status": "success", "data": campaigns}
    
    except Exception as e:
        logger.error(f"Error getting campaigns: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/messaging/templates")
async def get_message_templates(current_user: User = Depends(get_current_active_user)):
    """Get all message templates"""
    try:
        templates = [
            {
                "id": "1",
                "name": "ברכה ראשונית",
                "platform": "whatsapp",
                "category": "ברכות",
                "content": "שלום {name}! תודה על פנייתך. נציג יחזור אליך בקרוב 😊",
                "variables": ["name"],
                "usage": 45
            },
            {
                "id": "2",
                "name": "תזכורת תשלום",
                "platform": "sms",
                "category": "תזכורות",
                "content": "תזכורת: התשלום בסך {amount} ₪ יגיע לפירעון ב-{due_date}",
                "variables": ["amount", "due_date"],
                "usage": 23
            }
        ]
        
        return {"status": "success", "data": templates}
    
    except Exception as e:
        logger.error(f"Error getting templates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== DOCUMENT GENERATOR ENDPOINTS =====

@api_router.get("/documents/templates")
async def get_document_templates(current_user: User = Depends(get_current_active_user)):
    """Get all document templates"""
    try:
        templates = [
            {
                "id": "quote",
                "name": "הצעת מחיר",
                "description": "הצעת מחיר מפורטת עם פירוט מוצרים ומחירים",
                "type": "quote",
                "fields": [
                    {"name": "customerName", "label": "שם לקוח", "type": "text", "required": True},
                    {"name": "customerEmail", "label": "אימייל לקוח", "type": "email", "required": True},
                    {"name": "validUntil", "label": "תוקף עד", "type": "date", "required": True}
                ]
            },
            {
                "id": "contract",
                "name": "חוזה שירות",
                "description": "חוזה שירות סטנדרטי עם תנאים כלליים",
                "type": "contract",
                "fields": [
                    {"name": "customerName", "label": "שם לקוח", "type": "text", "required": True},
                    {"name": "serviceType", "label": "סוג שירות", "type": "select", "required": True},
                    {"name": "startDate", "label": "תאריך התחלה", "type": "date", "required": True}
                ]
            }
        ]
        
        return {"status": "success", "data": templates}
    
    except Exception as e:
        logger.error(f"Error getting document templates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/documents/generate")
async def generate_document(template_id: str, data: Dict[str, Any], current_user: User = Depends(get_current_active_user)):
    """Generate a document from template"""
    try:
        # Simulate document generation
        document = {
            "id": str(uuid.uuid4()),
            "template_id": template_id,
            "name": f"מסמך - {data.get('customerName', 'לקוח חדש')}",
            "created": datetime.now().isoformat(),
            "status": "draft",
            "data": data,
            "download_url": f"/api/documents/download/{uuid.uuid4()}"
        }
        
        return {"status": "success", "data": document}
    
    except Exception as e:
        logger.error(f"Error generating document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== AUTOMATION CENTER ENDPOINTS =====

@api_router.get("/automations/rules")
async def get_automation_rules(current_user: User = Depends(get_current_active_user)):
    """Get all automation rules"""
    try:
        rules = [
            {
                "id": "1",
                "name": "SMS אוטומטי ללידים חדשים",
                "type": "sms",
                "active": True,
                "triggers": 15,
                "success_rate": 85,
                "template": "שלום {name}, תודה על פנייתך! נציג יחזור אליך בקרוב.",
                "conditions": ["new_lead", "source_website"],
                "actions": ["send_sms", "create_task", "notify_agent"],
                "last_run": "2024-01-15 14:30"
            },
            {
                "id": "2",
                "name": "WhatsApp מעקב אחר שיחות לא נענו",
                "type": "whatsapp",
                "active": True,
                "triggers": 8,
                "success_rate": 92,
                "template": "היי! ראיתי שניסיתי להתקשר אליך. איך אוכל לעזור? 😊",
                "conditions": ["missed_call", "duration_0"],
                "actions": ["send_whatsapp", "schedule_callback"],
                "last_run": "2024-01-15 13:45"
            }
        ]
        
        return {"status": "success", "data": rules}
    
    except Exception as e:
        logger.error(f"Error getting automation rules: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/automations/rules")
async def create_automation_rule(rule: AutomationRule, current_user: User = Depends(get_current_active_user)):
    """Create a new automation rule"""
    try:
        new_rule = {
            "id": str(uuid.uuid4()),
            **rule.dict(),
            "created": datetime.now().isoformat(),
            "triggers": 0,
            "success_rate": 0,
            "last_run": None
        }
        
        return {"status": "success", "data": new_rule}
    
    except Exception as e:
        logger.error(f"Error creating automation rule: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/automations/rules/{rule_id}/toggle")
async def toggle_automation_rule(rule_id: str, current_user: User = Depends(get_current_active_user)):
    """Toggle automation rule active status"""
    try:
        # Simulate toggling
        return {"status": "success", "message": f"Rule {rule_id} toggled"}
    
    except Exception as e:
        logger.error(f"Error toggling automation rule: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== CALL FLOW CANVAS ENDPOINTS =====

@api_router.get("/callflows")
async def get_call_flows(current_user: User = Depends(get_current_active_user)):
    """Get all call flows"""
    try:
        flows = [
            {
                "id": "1",
                "name": "זרימה בסיסית - קבלת שיחות",
                "description": "זרימה סטנדרטית לקבלת שיחות עם בוט ראשוני",
                "nodes": [
                    {"id": "start", "type": "start", "x": 100, "y": 100, "label": "שיחה נכנסת"},
                    {"id": "greeting", "type": "message", "x": 250, "y": 100, "label": "ברוכים הבאים"},
                    {"id": "menu", "type": "bot", "x": 400, "y": 100, "label": "תפריט ראשי"}
                ],
                "connections": []
            }
        ]
        
        return {"status": "success", "data": flows}
    
    except Exception as e:
        logger.error(f"Error getting call flows: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/callflows")
async def save_call_flow(flow_data: Dict[str, Any], current_user: User = Depends(get_current_active_user)):
    """Save a call flow"""
    try:
        new_flow = {
            "id": str(uuid.uuid4()),
            **flow_data,
            "created": datetime.now().isoformat(),
            "updated": datetime.now().isoformat()
        }
        
        return {"status": "success", "data": new_flow}
    
    except Exception as e:
        logger.error(f"Error saving call flow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== CRM CRUD ENDPOINTS =====

# LEADS ENDPOINTS
@api_router.get("/crm/leads", response_model=List[Lead])
async def get_leads(
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user)
):
    """Get leads with optional filtering"""
    query = {}
    if status:
        query["status"] = status
    if assigned_to:
        query["assigned_to"] = assigned_to
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]
    
    leads = await async_db.leads.find(query).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    return [Lead(**lead) for lead in leads]

@api_router.post("/crm/leads", response_model=Lead)
async def create_lead(
    lead_data: LeadCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new lead"""
    lead_dict = lead_data.dict()
    lead_dict["created_by"] = current_user.id
    lead_obj = Lead(**lead_dict)
    await async_db.leads.insert_one(lead_obj.dict())
    return lead_obj

@api_router.get("/crm/leads/{lead_id}", response_model=Lead)
async def get_lead(
    lead_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific lead by ID"""
    lead = await async_db.leads.find_one({"id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return Lead(**lead)

@api_router.put("/crm/leads/{lead_id}", response_model=Lead)
async def update_lead(
    lead_id: str,
    lead_update: LeadUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update a lead"""
    lead = await async_db.leads.find_one({"id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = {k: v for k, v in lead_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await async_db.leads.update_one({"id": lead_id}, {"$set": update_data})
    
    updated_lead = await async_db.leads.find_one({"id": lead_id})
    return Lead(**updated_lead)

@api_router.delete("/crm/leads/{lead_id}")
async def delete_lead(
    lead_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a lead"""
    result = await async_db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}

# DEALS ENDPOINTS
@api_router.get("/crm/deals", response_model=List[Deal])
async def get_deals(
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    stage: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user)
):
    """Get deals with optional filtering"""
    query = {}
    if stage:
        query["stage"] = stage
    if assigned_to:
        query["assigned_to"] = assigned_to
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    deals = await async_db.deals.find(query).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    return [Deal(**deal) for deal in deals]

@api_router.post("/crm/deals", response_model=Deal)
async def create_deal(
    deal_data: DealCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new deal"""
    deal_dict = deal_data.dict()
    deal_dict["created_by"] = current_user.id
    deal_obj = Deal(**deal_dict)
    await async_db.deals.insert_one(deal_obj.dict())
    return deal_obj

@api_router.get("/crm/deals/{deal_id}", response_model=Deal)
async def get_deal(
    deal_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific deal by ID"""
    deal = await async_db.deals.find_one({"id": deal_id})
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return Deal(**deal)

@api_router.put("/crm/deals/{deal_id}", response_model=Deal)
async def update_deal(
    deal_id: str,
    deal_update: DealUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update a deal"""
    deal = await async_db.deals.find_one({"id": deal_id})
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    update_data = {k: v for k, v in deal_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await async_db.deals.update_one({"id": deal_id}, {"$set": update_data})
    
    updated_deal = await async_db.deals.find_one({"id": deal_id})
    return Deal(**updated_deal)

@api_router.delete("/crm/deals/{deal_id}")
async def delete_deal(
    deal_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a deal"""
    result = await async_db.deals.delete_one({"id": deal_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Deal not found")
    return {"message": "Deal deleted successfully"}

# TASKS ENDPOINTS
@api_router.get("/crm/tasks", response_model=List[Task])
async def get_tasks(
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user)
):
    """Get tasks with optional filtering"""
    query = {}
    if status:
        query["status"] = status
    if assigned_to:
        query["assigned_to"] = assigned_to
    if type:
        query["type"] = type
    
    tasks = await async_db.tasks.find(query).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    return [Task(**task) for task in tasks]

@api_router.post("/crm/tasks", response_model=Task)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new task"""
    task_dict = task_data.dict()
    task_dict["created_by"] = current_user.id
    task_obj = Task(**task_dict)
    await async_db.tasks.insert_one(task_obj.dict())
    return task_obj

@api_router.get("/crm/tasks/{task_id}", response_model=Task)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific task by ID"""
    task = await async_db.tasks.find_one({"id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return Task(**task)

@api_router.put("/crm/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update a task"""
    task = await async_db.tasks.find_one({"id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = {k: v for k, v in task_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # Handle status change to completed
    if update_data.get("status") == "completed" and task.get("status") != "completed":
        update_data["completed_at"] = datetime.utcnow()
    
    await async_db.tasks.update_one({"id": task_id}, {"$set": update_data})
    
    updated_task = await async_db.tasks.find_one({"id": task_id})
    return Task(**updated_task)

@api_router.delete("/crm/tasks/{task_id}")
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a task"""
    result = await async_db.tasks.delete_one({"id": task_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

# ENHANCED CONTACTS ENDPOINTS
@api_router.put("/contacts/{contact_id}", response_model=Contact)
async def update_contact(
    contact_id: str,
    contact_update: ContactUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update a contact"""
    contact = await async_db.contacts.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    update_data = {k: v for k, v in contact_update.dict().items() if v is not None}
    
    await async_db.contacts.update_one({"id": contact_id}, {"$set": update_data})
    
    updated_contact = await async_db.contacts.find_one({"id": contact_id})
    return Contact(**updated_contact)

@api_router.delete("/contacts/{contact_id}")
async def delete_contact(
    contact_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a contact"""
    result = await async_db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}

# ENHANCED CALLS ENDPOINTS
@api_router.put("/calls/{call_id}", response_model=CallRecord)
async def update_call(
    call_id: str,
    call_update: CallRecordUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update a call record"""
    call = await async_db.calls.find_one({"id": call_id})
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    update_data = {k: v for k, v in call_update.dict().items() if v is not None}
    
    await async_db.calls.update_one({"id": call_id}, {"$set": update_data})
    
    updated_call = await async_db.calls.find_one({"id": call_id})
    return CallRecord(**updated_call)

@api_router.delete("/calls/{call_id}")
async def delete_call(
    call_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a call record"""
    result = await async_db.calls.delete_one({"id": call_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Call not found")
    return {"message": "Call deleted successfully"}

# CRM ANALYTICS ENDPOINTS
@api_router.get("/crm/analytics/summary")
async def get_crm_analytics_summary(current_user: User = Depends(get_current_active_user)):
    """Get CRM analytics summary"""
    try:
        # Get counts
        total_leads = await async_db.leads.count_documents({})
        total_deals = await async_db.deals.count_documents({})
        total_tasks = await async_db.tasks.count_documents({})
        total_contacts = await async_db.contacts.count_documents({})
        
        # Get leads by status
        leads_by_status = {}
        for status in ["new", "contacted", "qualified", "lost", "converted"]:
            count = await async_db.leads.count_documents({"status": status})
            leads_by_status[status] = count
        
        # Get deals by stage
        deals_by_stage = {}
        for stage in ["proposal", "negotiation", "closed_won", "closed_lost"]:
            count = await async_db.deals.count_documents({"stage": stage})
            deals_by_stage[stage] = count
        
        # Get tasks by status
        tasks_by_status = {}
        for status in ["pending", "completed", "cancelled"]:
            count = await async_db.tasks.count_documents({"status": status})
            tasks_by_status[status] = count
        
        # Calculate total deal value
        deals_cursor = async_db.deals.find({"stage": "closed_won"})
        deals = await deals_cursor.to_list(None)
        total_won_value = sum(deal.get("amount", 0) for deal in deals)
        
        return {
            "totals": {
                "leads": total_leads,
                "deals": total_deals,
                "tasks": total_tasks,
                "contacts": total_contacts
            },
            "leads_by_status": leads_by_status,
            "deals_by_stage": deals_by_stage,
            "tasks_by_status": tasks_by_status,
            "total_won_value": total_won_value
        }
        
    except Exception as e:
        logger.error(f"Error getting CRM analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving analytics")

# ===== ATTENDANCE & BOOKING ENDPOINTS =====

@api_router.get("/attendance/employees")
async def get_employees(current_user: User = Depends(get_current_active_user)):
    """Get all employees for attendance tracking"""
    try:
        employees = await async_db.employees.find({}).to_list(100)
        return [Employee(**emp) for emp in employees]
    except Exception as e:
        logger.error(f"Error getting employees: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving employees")

@api_router.post("/attendance/employees", response_model=Employee)
async def create_employee(
    employee_data: EmployeeCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new employee"""
    try:
        employee_obj = Employee(**employee_data.dict())
        await async_db.employees.insert_one(employee_obj.dict())
        return employee_obj
    except Exception as e:
        logger.error(f"Error creating employee: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating employee")

@api_router.post("/attendance/checkin/{employee_id}")
async def check_in_employee(
    employee_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Check in an employee"""
    try:
        current_time = datetime.now().strftime("%H:%M:%S")
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        # Update employee status
        await async_db.employees.update_one(
            {"id": employee_id},
            {"$set": {
                "attendance_status": "present",
                "check_in": current_time,
                "updated_at": datetime.utcnow()
            }}
        )
        
        # Create attendance record
        attendance_record = AttendanceRecord(
            employee_id=employee_id,
            date=current_date,
            check_in=current_time,
            status="present"
        )
        
        await async_db.attendance.insert_one(attendance_record.dict())
        
        return {"message": "Employee checked in successfully", "time": current_time}
    except Exception as e:
        logger.error(f"Error checking in employee: {str(e)}")
        raise HTTPException(status_code=500, detail="Error checking in")

@api_router.post("/attendance/checkout/{employee_id}")
async def check_out_employee(
    employee_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Check out an employee"""
    try:
        current_time = datetime.now().strftime("%H:%M:%S")
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        # Update employee status
        await async_db.employees.update_one(
            {"id": employee_id},
            {"$set": {
                "check_out": current_time,
                "updated_at": datetime.utcnow()
            }}
        )
        
        # Update attendance record
        attendance_record = await async_db.attendance.find_one({
            "employee_id": employee_id,
            "date": current_date
        })
        
        if attendance_record:
            # Calculate hours worked
            check_in_time = datetime.strptime(attendance_record["check_in"], "%H:%M:%S")
            check_out_time = datetime.strptime(current_time, "%H:%M:%S")
            hours_worked = (check_out_time - check_in_time).seconds / 3600
            
            await async_db.attendance.update_one(
                {"employee_id": employee_id, "date": current_date},
                {"$set": {
                    "check_out": current_time,
                    "hours_worked": round(hours_worked, 2),
                    "updated_at": datetime.utcnow()
                }}
            )
        
        return {"message": "Employee checked out successfully", "time": current_time}
    except Exception as e:
        logger.error(f"Error checking out employee: {str(e)}")
        raise HTTPException(status_code=500, detail="Error checking out")

@api_router.get("/bookings")
async def get_bookings(
    date: Optional[str] = None,
    employee_id: Optional[str] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Get bookings with optional filtering"""
    try:
        query = {}
        if date:
            query["date"] = date
        if employee_id:
            query["employee_id"] = employee_id
        if status:
            query["status"] = status
        
        bookings = await async_db.bookings.find(query).sort("date", 1).to_list(100)
        return [Booking(**booking) for booking in bookings]
    except Exception as e:
        logger.error(f"Error getting bookings: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving bookings")

@api_router.post("/bookings", response_model=Booking)
async def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new booking"""
    try:
        booking_dict = booking_data.dict()
        booking_dict["created_by"] = current_user.id
        booking_obj = Booking(**booking_dict)
        
        await async_db.bookings.insert_one(booking_obj.dict())
        
        # Automatically create a potential lead from this booking
        lead_data = BookingLeadCreate(
            name=booking_data.client_name,
            phone=booking_data.client_phone,
            email=booking_data.client_email,
            interest=f"Follow-up from {booking_data.service} booking",
            value=booking_data.value,
            assigned_to=booking_data.employee_id,
            booking_id=booking_obj.id
        )
        
        lead_obj = BookingLead(**lead_data.dict())
        await async_db.booking_leads.insert_one(lead_obj.dict())
        
        return booking_obj
    except Exception as e:
        logger.error(f"Error creating booking: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating booking")

@api_router.put("/bookings/{booking_id}")
async def update_booking(
    booking_id: str,
    status: Optional[str] = None,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Update booking status and notes"""
    try:
        update_data = {"updated_at": datetime.utcnow()}
        if status:
            update_data["status"] = status
        if notes is not None:
            update_data["notes"] = notes
        
        await async_db.bookings.update_one(
            {"id": booking_id},
            {"$set": update_data}
        )
        
        updated_booking = await async_db.bookings.find_one({"id": booking_id})
        if not updated_booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        return Booking(**updated_booking)
    except Exception as e:
        logger.error(f"Error updating booking: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating booking")

@api_router.get("/booking-leads")
async def get_booking_leads(
    status: Optional[str] = None,
    assigned_to: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Get booking-generated leads"""
    try:
        query = {}
        if status:
            query["status"] = status
        if assigned_to:
            query["assigned_to"] = assigned_to
        
        leads = await async_db.booking_leads.find(query).sort("created_at", -1).to_list(100)
        return [BookingLead(**lead) for lead in leads]
    except Exception as e:
        logger.error(f"Error getting booking leads: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving booking leads")

@api_router.put("/booking-leads/{lead_id}")
async def update_booking_lead(
    lead_id: str,
    status: Optional[str] = None,
    probability: Optional[int] = None,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Update booking lead"""
    try:
        update_data = {"updated_at": datetime.utcnow()}
        if status:
            update_data["status"] = status
        if probability is not None:
            update_data["probability"] = probability
        if notes is not None:
            update_data["notes"] = notes
        
        await async_db.booking_leads.update_one(
            {"id": lead_id},
            {"$set": update_data}
        )
        
        updated_lead = await async_db.booking_leads.find_one({"id": lead_id})
        if not updated_lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        return BookingLead(**updated_lead)
    except Exception as e:
        logger.error(f"Error updating booking lead: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating lead")

@api_router.get("/attendance/dashboard")
async def get_attendance_dashboard(
    date: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Get attendance dashboard data"""
    try:
        target_date = date or datetime.now().strftime("%Y-%m-%d")
        
        # Get all employees
        total_employees = await async_db.employees.count_documents({"status": "active"})
        
        # Get attendance for target date
        present_count = await async_db.attendance.count_documents({
            "date": target_date,
            "status": "present"
        })
        
        absent_count = total_employees - present_count
        attendance_percentage = (present_count / total_employees * 100) if total_employees > 0 else 0
        
        # Get bookings for today
        today_bookings = await async_db.bookings.find({"date": target_date}).to_list(100)
        
        # Get recent leads from bookings
        recent_leads = await async_db.booking_leads.find({}).sort("created_at", -1).limit(5).to_list(5)
        
        return {
            "attendance": {
                "total_employees": total_employees,
                "present": present_count,
                "absent": absent_count,
                "percentage": round(attendance_percentage, 1)
            },
            "bookings": {
                "today_total": len(today_bookings),
                "confirmed": len([b for b in today_bookings if b.get("status") == "confirmed"]),
                "pending": len([b for b in today_bookings if b.get("status") == "pending"])
            },
            "leads": {
                "recent_count": len(recent_leads),
                "hot_leads": len([l for l in recent_leads if l.get("status") == "hot"])
            }
        }
    except Exception as e:
        logger.error(f"Error getting attendance dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving dashboard data")

# ===== DOCUMENT GENERATION WITH PDF SUPPORT =====

from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
import io

@api_router.post("/documents/generate-pdf")
async def generate_pdf_document(
    template_id: str,
    data: Dict[str, Any],
    current_user: User = Depends(get_current_active_user)
):
    """Generate a PDF document from template"""
    try:
        # Create PDF in memory
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            alignment=1,  # Center
            spaceAfter=30
        )
        
        # Add title based on template
        template_titles = {
            "quote": "הצעת מחיר",
            "contract": "חוזה שירות", 
            "invoice": "חשבונית",
            "report": "דוח פעילות"
        }
        
        title = template_titles.get(template_id, "מסמך")
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 20))
        
        # Add customer information
        if data.get("customerName"):
            story.append(Paragraph(f"<b>שם לקוח:</b> {data['customerName']}", styles['Normal']))
        if data.get("customerEmail"):
            story.append(Paragraph(f"<b>אימייל:</b> {data['customerEmail']}", styles['Normal']))
        if data.get("customerPhone"):
            story.append(Paragraph(f"<b>טלפון:</b> {data['customerPhone']}", styles['Normal']))
        
        story.append(Spacer(1, 20))
        
        # Add other fields based on template
        for key, value in data.items():
            if key not in ["customerName", "customerEmail", "customerPhone"] and value:
                story.append(Paragraph(f"<b>{key}:</b> {value}", styles['Normal']))
        
        story.append(Spacer(1, 30))
        
        # Add footer
        story.append(Paragraph(
            f"מסמך נוצר ב-{datetime.now().strftime('%d/%m/%Y')} • AI Telephony Platform",
            styles['Normal']
        ))
        
        # Build PDF
        doc.build(story)
        
        # Get PDF content as base64
        buffer.seek(0)
        pdf_content = base64.b64encode(buffer.getvalue()).decode()
        buffer.close()
        
        # Save document to database
        document = GeneratedDocument(
            template_id=template_id,
            name=f"{title} - {data.get('customerName', 'לקוח חדש')}",
            customer_name=data.get('customerName', ''),
            customer_email=data.get('customerEmail'),
            data=data,
            pdf_content=pdf_content,
            created_by=current_user.id
        )
        
        await async_db.documents.insert_one(document.dict())
        
        return {
            "status": "success",
            "document_id": document.id,
            "pdf_content": pdf_content,
            "download_url": f"/api/documents/download/{document.id}"
        }
        
    except Exception as e:
        logger.error(f"Error generating PDF document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating document: {str(e)}")

@api_router.get("/documents/download/{document_id}")
async def download_document(
    document_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Download a generated document"""
    try:
        document = await async_db.documents.find_one({"id": document_id})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        if not document.get("pdf_content"):
            raise HTTPException(status_code=404, detail="PDF content not found")
        
        # Decode base64 PDF content
        pdf_bytes = base64.b64decode(document["pdf_content"])
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={document['name']}.pdf"}
        )
        
    except Exception as e:
        logger.error(f"Error downloading document: {str(e)}")
        raise HTTPException(status_code=500, detail="Error downloading document")

# ===== PROFESSIONAL ATTENDANCE SYSTEM =====

@api_router.post("/professional/attendance/start")
async def start_professional_attendance(
    attendance_data: dict,
    current_user: User = Depends(get_current_active_user)
):
    """התחלת יום עבודה לכל המשתמשים"""
    try:
        # הסרת הגבלה - כל המשתמשים יכולים להשתמש במערכת הנוכחות
        current_date = datetime.utcnow().date().isoformat()
        start_time = datetime.utcnow()
        
        # בדיקה אם כבר יש רשומת נוכחות היום
        existing_attendance = attendance_collection.find_one({
            "professional_id": current_user.id,
            "date": current_date,
            "status": "active"
        })
        
        if existing_attendance:
            return {"status": "error", "message": "יום עבודה כבר החל היום"}
        
        # יצירת רשומת נוכחות חדשה
        attendance_record = {
            "id": str(uuid.uuid4()),
            "professional_id": current_user.id,
            "date": current_date,
            "start_time": start_time,
            "status": "active",
            "location": attendance_data.get("location", ""),
            "notes": attendance_data.get("notes", ""),
            "created_at": datetime.utcnow()
        }
        
        attendance_collection.insert_one(attendance_record)
        
        return {
            "status": "success",
            "message": "יום עבודה החל בהצלחה",
            "id": attendance_record["id"],
            "start_time": start_time.isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting attendance: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בהתחלת יום עבודה")

@api_router.post("/professional/attendance/end")
async def end_professional_attendance(
    attendance_data: dict,
    current_user: User = Depends(get_current_active_user)
):
    """סיום יום עבודה לכל המשתמשים"""
    try:
        # הסרת הגבלה - כל המשתמשים יכולים להשתמש במערכת הנוכחות
        current_date = datetime.utcnow().date().isoformat()
        end_time = datetime.utcnow()
        
        # מציאת רשומת הנוכחות הפעילה
        active_attendance = attendance_collection.find_one({
            "professional_id": current_user.id,
            "date": current_date,
            "status": "active"
        })
        
        if not active_attendance:
            raise HTTPException(status_code=404, detail="לא נמצאה רשומת נוכחות פעילה היום")
        
        # חישוב שעות עבודה
        start_time = active_attendance["start_time"]
        if isinstance(start_time, str):
            start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        
        total_hours = (end_time - start_time).total_seconds() / 3600
        
        # עדכון רשומת הנוכחות
        attendance_collection.update_one(
            {"id": active_attendance["id"]},
            {"$set": {
                "end_time": end_time,
                "total_hours": round(total_hours, 2),
                "status": "completed",
                "end_notes": attendance_data.get("notes", ""),
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {
            "status": "success",
            "message": "יום עבודה הסתיים בהצלחה",
            "end_time": end_time.isoformat(),
            "total_hours": round(total_hours, 2)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error ending attendance: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בסיום יום עבודה")

@api_router.get("/professional/attendance/status")
async def get_professional_attendance_status(
    current_user: User = Depends(get_current_active_user)
):
    """קבלת סטטוס נוכחות נוכחי לכל המשתמשים"""
    try:
        # הסרת הגבלה - כל המשתמשים יכולים לראות סטטוס נוכחות
        current_date = datetime.utcnow().date().isoformat()
        
        # מציאת רשומת הנוכחות של היום
        attendance_record = attendance_collection.find_one({
            "professional_id": current_user.id,
            "date": current_date
        })
        
        if not attendance_record:
            return {
                "status": "not_started",
                "message": "יום עבודה טרם החל",
                "is_active": False
            }
        
        # חישוב זמן עבודה נוכחי אם פעיל
        current_work_time = None
        if attendance_record.get("status") == "active":
            start_time = attendance_record["start_time"]
            if isinstance(start_time, str):
                start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            
            current_hours = (datetime.utcnow() - start_time).total_seconds() / 3600
            current_work_time = round(current_hours, 2)
        
        return {
            "status": attendance_record.get("status", "unknown"),
            "start_time": attendance_record.get("start_time", "").isoformat() if attendance_record.get("start_time") else None,
            "end_time": attendance_record.get("end_time", "").isoformat() if attendance_record.get("end_time") else None,
            "total_hours": attendance_record.get("total_hours"),
            "current_work_time": current_work_time,
            "is_active": attendance_record.get("status") == "active",
            "location": attendance_record.get("location", ""),
            "notes": attendance_record.get("notes", "")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting attendance status: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת סטטוס נוכחות")

@api_router.get("/professional/goals")
async def get_professional_goals(
    current_user: User = Depends(get_current_active_user)
):
    """קבלת יעדים של המשתמש המקצועי"""
    try:
        if current_user.user_type not in ["professional", "barber", "therapist"]:
            raise HTTPException(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד")
        
        # מציאת יעדים קיימים
        goals = goals_collection.find_one({"professional_id": current_user.id})
        
        if not goals:
            # יצירת יעדים דיפולטיביים
            default_goals = {
                "id": str(uuid.uuid4()),
                "professional_id": current_user.id,
                "daily": {
                    "appointments": {"target": 8, "current": 0},
                    "revenue": {"target": 1500, "current": 0},
                    "efficiency": {"target": 90, "current": 0},
                    "satisfaction": {"target": 4.5, "current": 0}
                },
                "weekly": {
                    "appointments": {"target": 40, "current": 0},
                    "revenue": {"target": 7500, "current": 0},
                    "new_clients": {"target": 5, "current": 0}
                },
                "monthly": {
                    "appointments": {"target": 160, "current": 0},
                    "revenue": {"target": 30000, "current": 0},
                    "retention": {"target": 85, "current": 0}
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            goals_collection.insert_one(default_goals)
            goals = default_goals
        
        # הסרת _id של MongoDB לסידור JSON
        if "_id" in goals:
            del goals["_id"]
        
        return goals
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting professional goals: {str(e)}")
        raise HTTPException(status_code=500, detail="שגיאה בקבלת יעדים")

# ===== EMAIL INTEGRATION FOR DOCUMENTS =====

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

@api_router.post("/documents/send-email")
async def send_document_email(
    document_send: DocumentSend,
    current_user: User = Depends(get_current_active_user)
):
    """Send document via email"""
    try:
        # Get document
        document = await async_db.documents.find_one({"id": document_send.document_id})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Email configuration (you'll need to add these to your .env)
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME", "your-email@gmail.com")
        smtp_password = os.getenv("SMTP_PASSWORD", "your-app-password")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = document_send.recipient_email
        msg['Subject'] = document_send.subject or f"{document['name']} - AI Telephony Platform"
        
        # Email body
        body = document_send.message or f"""
        שלום,
        
        מצורף אליכם {document['name']}.
        
        תודה,
        צוות AI Telephony Platform
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Attach PDF
        if document.get("pdf_content"):
            pdf_bytes = base64.b64decode(document["pdf_content"])
            attachment = MIMEBase('application', 'octet-stream')
            attachment.set_payload(pdf_bytes)
            encoders.encode_base64(attachment)
            attachment.add_header(
                'Content-Disposition',
                f'attachment; filename= {document["name"]}.pdf'
            )
            msg.attach(attachment)
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_username, document_send.recipient_email, text)
        server.quit()
        
        # Update document status
        await async_db.documents.update_one(
            {"id": document_send.document_id},
            {"$set": {"status": "sent", "updated_at": datetime.utcnow()}}
        )
        
        return {"status": "success", "message": "Document sent successfully"}
        
    except Exception as e:
        logger.error(f"Error sending document email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("AI Telephony Platform API starting up...")

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Shutting down AI Telephony Platform API...")
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)