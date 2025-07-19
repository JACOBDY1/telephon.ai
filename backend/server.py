from fastapi import FastAPI, APIRouter, HTTPException, Query, BackgroundTasks, Depends, status
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
from datetime import datetime, timedelta
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

# MongoDB connection for users
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/telephony_ai")
client = MongoClient(MONGO_URL)
db = client.get_database()
users_collection = db.users
sessions_collection = db.sessions

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
    role: str = "user"  # user, admin, manager
    is_active: bool = True
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    preferences: Dict[str, Any] = {}

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None

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
    is_active: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None
    preferences: Dict[str, Any] = {}

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
        is_active=user.is_active,
        created_at=user.created_at,
        last_login=user.last_login,
        preferences=user.preferences
    )

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="משתמש לא פעיל")
    return current_user

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
async def create_call(call_data: CallRecordCreate):
    """Create a new call record"""
    call_dict = call_data.dict()
    call_dict["start_time"] = datetime.utcnow()
    call_obj = CallRecord(**call_dict)
    
    # Insert into database
    await db.calls.insert_one(call_obj.dict())
    
    # Update contact statistics
    await update_contact_call_stats(call_obj.caller_number)
    
    return call_obj

@api_router.get("/calls", response_model=List[CallRecord])
async def get_calls(
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    language: Optional[str] = Query(None)
):
    """Get calls with optional filtering"""
    query = {}
    if status:
        query["status"] = status
    if language:
        query["language"] = language
    
    calls = await db.calls.find(query).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    return [CallRecord(**call) for call in calls]

@api_router.get("/calls/{call_id}", response_model=CallRecord)
async def get_call(call_id: str):
    """Get a specific call by ID"""
    call = await db.calls.find_one({"id": call_id})
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return CallRecord(**call)

@api_router.put("/calls/{call_id}/end")
async def end_call(call_id: str):
    """End an active call"""
    call = await db.calls.find_one({"id": call_id})
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
    
    await db.calls.update_one({"id": call_id}, {"$set": update_data})
    
    # Trigger AI processing for completed call
    await process_call_ai(call_id)
    
    return {"message": "Call ended successfully", "duration": duration}

async def process_call_ai(call_id: str):
    """Process call with AI (transcription, sentiment analysis)"""
    call = await db.calls.find_one({"id": call_id})
    if not call:
        return
    
    # Mock transcription (in production, would process actual audio)
    transcription = await mock_transcribe_audio("mock_audio_url", call.get("language", "he"))
    sentiment = await mock_analyze_sentiment(transcription, call.get("language", "he"))
    
    # Update call with AI results
    await db.calls.update_one(
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
    await db.ai_insights.insert_one(insight.dict())

# Contacts Management
@api_router.post("/contacts", response_model=Contact)
async def create_contact(contact_data: ContactCreate):
    """Create a new contact"""
    contact_dict = contact_data.dict()
    contact_obj = Contact(**contact_dict)
    await db.contacts.insert_one(contact_obj.dict())
    return contact_obj

@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts(
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    search: Optional[str] = Query(None)
):
    """Get contacts with optional search"""
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"phone_number": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}}
        ]
    
    contacts = await db.contacts.find(query).skip(skip).limit(limit).to_list(limit)
    return [Contact(**contact) for contact in contacts]

@api_router.get("/contacts/{contact_id}", response_model=Contact)
async def get_contact(contact_id: str):
    """Get a specific contact by ID"""
    contact = await db.contacts.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return Contact(**contact)

async def update_contact_call_stats(phone_number: str):
    """Update contact call statistics"""
    await db.contacts.update_one(
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
    """Health check endpoint"""
    try:
        # Test database connection
        await db.command("ping")
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
            "is_active": True,
            "created_at": datetime.utcnow(),
            "last_login": None,
            "preferences": {
                "language": "he",
                "theme": "light",
                "notifications": True
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
            is_active=True,
            created_at=datetime.utcnow(),
            preferences=user_doc["preferences"]
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
            is_active=user.is_active,
            created_at=user.created_at,
            last_login=datetime.utcnow(),
            preferences=user.preferences
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
async def get_campaigns():
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
async def get_message_templates():
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
async def get_document_templates():
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
async def generate_document(template_id: str, data: Dict[str, Any]):
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
async def get_automation_rules():
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
async def create_automation_rule(rule: AutomationRule):
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
async def toggle_automation_rule(rule_id: str):
    """Toggle automation rule active status"""
    try:
        # Simulate toggling
        return {"status": "success", "message": f"Rule {rule_id} toggled"}
    
    except Exception as e:
        logger.error(f"Error toggling automation rule: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== CALL FLOW CANVAS ENDPOINTS =====

@api_router.get("/callflows")
async def get_call_flows():
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
async def save_call_flow(flow_data: Dict[str, Any]):
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
    # Initialize default data if needed
    await initialize_default_data()

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Shutting down AI Telephony Platform API...")
    client.close()

async def initialize_default_data():
    """Initialize database with default data if empty"""
    # Check if contacts collection is empty and add sample data
    contacts_count = await db.contacts.count_documents({})
    if contacts_count == 0:
        sample_contacts = [
            {
                "id": str(uuid.uuid4()),
                "name": "יוסי כהן",
                "phone_number": "+972-50-123-4567",
                "email": "yossi@example.com",
                "company": "חברת הטכנולוגיה",
                "tags": ["לקוח פוטנציאלי"],
                "total_calls": 3,
                "last_call_date": datetime.utcnow() - timedelta(days=1),
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Sarah Johnson",
                "phone_number": "+1-555-987-6543",
                "email": "sarah@company.com",
                "company": "Tech Corp",
                "tags": ["enterprise"],
                "total_calls": 1,
                "last_call_date": datetime.utcnow() - timedelta(days=2),
                "created_at": datetime.utcnow()
            }
        ]
        await db.contacts.insert_many(sample_contacts)
        logger.info("Initialized sample contacts")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)