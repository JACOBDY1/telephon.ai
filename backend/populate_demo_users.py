#!/usr/bin/env python3
"""
Demo User Population Script for AI Telephony Platform
Creates demo users with different roles and preferences
"""

import os
import sys
from dotenv import load_dotenv
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime
from passlib.context import CryptContext

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_demo_users():
    """Create demo users in MongoDB"""
    
    # MongoDB connection
    MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "test_database")
    print(f"Connecting to MongoDB: {MONGO_URL}/{DB_NAME}")
    
    try:
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        users_collection = db.users
        
        # Check if users already exist
        existing_users = users_collection.count_documents({})
        if existing_users > 0:
            print(f"Found {existing_users} existing users. Clearing collection first...")
            users_collection.delete_many({})
        
        # Demo users data
        demo_users = [
            {
                "username": "admin",
                "email": "admin@telephony-ai.com",
                "password": "admin123",
                "full_name": "מנהל מערכת",
                "phone": "+972-50-555-0001",
                "role": "admin"
            },
            {
                "username": "manager",
                "email": "manager@telephony-ai.com", 
                "password": "manager123",
                "full_name": "יוסי כהן - מנהל",
                "phone": "+972-50-555-0002",
                "role": "manager"
            },
            {
                "username": "agent1",
                "email": "agent1@telephony-ai.com",
                "password": "agent123",
                "full_name": "שרה לוי - נציגה",
                "phone": "+972-50-555-0003",
                "role": "user"
            },
            {
                "username": "agent2", 
                "email": "agent2@telephony-ai.com",
                "password": "agent123",
                "full_name": "דוד אברהם - נציג",
                "phone": "+972-50-555-0004", 
                "role": "user"
            },
            {
                "username": "sales1",
                "email": "sales1@telephony-ai.com",
                "password": "sales123",
                "full_name": "רחל רוזן - מכירות",
                "phone": "+972-50-555-0005",
                "role": "user"
            },
            {
                "username": "demo",
                "email": "demo@telephony-ai.com",
                "password": "demo123", 
                "full_name": "דמו משתמש",
                "phone": "+972-50-555-0006",
                "role": "user"
            }
        ]
        
        print("Creating demo users...")
        
        for user_data in demo_users:
            # Hash password
            hashed_password = get_password_hash(user_data["password"])
            
            # Create user document
            user_doc = {
                "username": user_data["username"],
                "email": user_data["email"],
                "hashed_password": hashed_password,
                "full_name": user_data["full_name"],
                "phone": user_data["phone"],
                "role": user_data["role"],
                "is_active": True,
                "created_at": datetime.utcnow(),
                "last_login": None,
                "preferences": {
                    "language": "he",
                    "theme": "light",
                    "notifications": True,
                    "timezone": "Asia/Jerusalem"
                }
            }
            
            # Insert to database
            result = users_collection.insert_one(user_doc)
            print(f"✅ Created user: {user_data['username']} ({user_data['full_name']}) - ID: {result.inserted_id}")
        
        print(f"\n🎉 Successfully created {len(demo_users)} demo users!")
        print("\n📋 Demo User Credentials:")
        print("=" * 50)
        
        for user_data in demo_users:
            print(f"Username: {user_data['username']:<10} | Password: {user_data['password']:<10} | Role: {user_data['role']}")
            
        print("=" * 50)
        print("\n💡 You can now test the authentication system with these credentials!")
        
        # Create some demo data collections if they don't exist
        create_demo_data(db)
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error creating demo users: {str(e)}")
        sys.exit(1)

def create_demo_data(db):
    """Create demo data for testing"""
    print("\n📊 Creating demo data collections...")
    
    # Create calls collection with some demo data
    calls_collection = db.calls
    calls_collection.delete_many({})  # Clear existing
    
    demo_calls = [
        {
            "id": "call-001",
            "caller_name": "לקוח פוטנציאלי",
            "caller_number": "+972-50-123-4567",
            "callee_number": "+972-50-555-0003",
            "start_time": datetime.utcnow(),
            "duration": 180,
            "status": "completed",
            "transcription": "שלום, אני מעוניין לשמוע על השירות שלכם",
            "sentiment": "positive",
            "language": "he",
            "created_at": datetime.utcnow()
        },
        {
            "id": "call-002", 
            "caller_name": "עסקת מכירה",
            "caller_number": "+972-50-987-6543",
            "callee_number": "+972-50-555-0005",
            "start_time": datetime.utcnow(),
            "duration": 420,
            "status": "completed",
            "transcription": "אנחנו מוכנים לחתום על החוזה",
            "sentiment": "positive",
            "language": "he", 
            "created_at": datetime.utcnow()
        }
    ]
    
    for call in demo_calls:
        calls_collection.insert_one(call)
    
    print(f"✅ Created {len(demo_calls)} demo calls")
    
    # Create contacts collection
    contacts_collection = db.contacts
    contacts_collection.delete_many({})  # Clear existing
    
    demo_contacts = [
        {
            "id": "contact-001",
            "name": "משה ישראלי",
            "phone_number": "+972-50-123-4567", 
            "email": "moshe@example.com",
            "company": "חברת הייטק",
            "tags": ["לקוח", "בעדיפות גבוהה"],
            "total_calls": 3,
            "created_at": datetime.utcnow()
        },
        {
            "id": "contact-002",
            "name": "רינה כהן",
            "phone_number": "+972-50-987-6543",
            "email": "rina@business.co.il",
            "company": "עסקים ושותפות",
            "tags": ["לקוחה פוטנציאלית", "מכירות"],
            "total_calls": 1,
            "created_at": datetime.utcnow()
        }
    ]
    
    for contact in demo_contacts:
        contacts_collection.insert_one(contact)
        
    print(f"✅ Created {len(demo_contacts)} demo contacts")
    print("✨ Demo data setup complete!")

if __name__ == "__main__":
    print("🚀 AI Telephony Platform - Demo User Population Script")
    print("=" * 60)
    create_demo_users()