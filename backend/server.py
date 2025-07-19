from fastapi import FastAPI, APIRouter, HTTPException, Query, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import requests
import httpx
from pathlib import Path
from pydantic import BaseModel, Field
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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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