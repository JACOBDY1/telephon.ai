#!/usr/bin/env python3
"""
CRM Demo Data Population Script
Creates comprehensive demo data for leads, deals, tasks, contacts, and calls
"""

import os
import sys
from dotenv import load_dotenv
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime, timedelta
import uuid
import random

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

def create_crm_demo_data():
    """Create comprehensive CRM demo data"""
    
    # MongoDB connection
    MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "test_database")
    print(f"Connecting to MongoDB: {MONGO_URL}/{DB_NAME}")
    
    try:
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Get user IDs for assignment
        users = list(db.users.find({}, {"_id": 1, "username": 1}))
        user_ids = [str(user["_id"]) for user in users]
        
        print(f"Found {len(user_ids)} users for data assignment")
        
        # Create comprehensive demo leads
        leads_collection = db.leads
        leads_collection.delete_many({})  # Clear existing
        
        demo_leads = [
            {
                "id": str(uuid.uuid4()),
                "name": "יואב כהן",
                "phone": "+972-50-111-2233",
                "email": "yoav@tech-startup.co.il",
                "company": "סטארט-אפ טכנולוגיה",
                "status": "new",
                "source": "website",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "notes": "מעוניין בפתרון טלפוניה מתקדם לחברה גדולה",
                "tags": ["עסקי", "בעדיפות גבוהה"],
                "estimated_value": 50000.0,
                "priority": "high",
                "created_at": datetime.utcnow() - timedelta(days=2),
                "updated_at": datetime.utcnow(),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "name": "שרה לוי",
                "phone": "+972-54-444-5566",
                "email": "sarah@marketing-agency.com",
                "company": "סוכנות שיווק דיגיטלי",
                "status": "contacted",
                "source": "referral",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "notes": "התקשרה אחרי המלצה מלקוח קיים",
                "tags": ["שיווק", "המלצה"],
                "estimated_value": 25000.0,
                "priority": "medium",
                "created_at": datetime.utcnow() - timedelta(days=5),
                "updated_at": datetime.utcnow() - timedelta(days=1),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "name": "דוד אברמוביץ",
                "phone": "+972-52-777-8899",
                "email": "david@construction.co.il",
                "company": "חברת בנייה משפחתית",
                "status": "qualified",
                "source": "call",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "notes": "זקוק למערכת לניהול קשרי לקוחות ועובדים",
                "tags": ["בנייה", "CRM"],
                "estimated_value": 15000.0,
                "priority": "medium",
                "created_at": datetime.utcnow() - timedelta(days=10),
                "updated_at": datetime.utcnow() - timedelta(hours=6),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "name": "רחל מזרחי",
                "phone": "+972-58-123-9999",
                "email": "rachel@restaurant-chain.co.il",
                "company": "רשת מסעדות כשרות",
                "status": "new",
                "source": "marketing",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "notes": "רוצה מערכת הזמנות טלפונית חכמה",
                "tags": ["מסעדות", "הזמנות"],
                "estimated_value": 35000.0,
                "priority": "high",
                "created_at": datetime.utcnow() - timedelta(hours=12),
                "updated_at": datetime.utcnow(),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "name": "מיכאל רוזן",
                "phone": "+972-50-555-1122",
                "email": "michael@law-firm.co.il",
                "company": "משרד עורכי דין",
                "status": "lost",
                "source": "website",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "notes": "החליט ללכת עם פתרון אחר - מחיר גבוה מדי",
                "tags": ["עורכי דין", "מחיר"],
                "estimated_value": 20000.0,
                "priority": "low",
                "created_at": datetime.utcnow() - timedelta(days=15),
                "updated_at": datetime.utcnow() - timedelta(days=3),
                "created_by": random.choice(user_ids) if user_ids else None
            }
        ]
        
        for lead in demo_leads:
            leads_collection.insert_one(lead)
        
        print(f"✅ Created {len(demo_leads)} demo leads")
        
        # Create demo deals
        deals_collection = db.deals
        deals_collection.delete_many({})  # Clear existing
        
        demo_deals = [
            {
                "id": str(uuid.uuid4()),
                "title": "מערכת טלפוניה לסטארט-אפ",
                "description": "פתרון מלא לחברת הייטק צומחת עם 50 עובדים",
                "contact_id": None,
                "lead_id": demo_leads[0]["id"],
                "amount": 45000.0,
                "currency": "ILS",
                "stage": "proposal",
                "probability": 70,
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "expected_close_date": datetime.utcnow() + timedelta(days=14),
                "actual_close_date": None,
                "notes": "בהכנת הצעת מחיר מפורטת",
                "tags": ["הייטק", "צומח"],
                "created_at": datetime.utcnow() - timedelta(days=1),
                "updated_at": datetime.utcnow(),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "title": "פתרון שיווק דיגיטלי",
                "description": "מערכת לניהול קמפיינים טלפוניים",
                "contact_id": None,
                "lead_id": demo_leads[1]["id"],
                "amount": 22000.0,
                "currency": "ILS",
                "stage": "negotiation",
                "probability": 85,
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "expected_close_date": datetime.utcnow() + timedelta(days=7),
                "actual_close_date": None,
                "notes": "במו\"מ על תנאי תשלום",
                "tags": ["שיווק", "קמפיינים"],
                "created_at": datetime.utcnow() - timedelta(days=4),
                "updated_at": datetime.utcnow() - timedelta(hours=2),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "title": "עסקה נסגרה - חברת בנייה",
                "description": "מערכת CRM ו-PBX מלאה",
                "contact_id": None,
                "lead_id": demo_leads[2]["id"],
                "amount": 18000.0,
                "currency": "ILS",
                "stage": "closed_won",
                "probability": 100,
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "expected_close_date": datetime.utcnow() - timedelta(days=2),
                "actual_close_date": datetime.utcnow() - timedelta(days=1),
                "notes": "עסקה נסגרה בהצלחה! התקנה תתחיל בשבוע הבא",
                "tags": ["בנייה", "נסגר"],
                "created_at": datetime.utcnow() - timedelta(days=8),
                "updated_at": datetime.utcnow() - timedelta(days=1),
                "created_by": random.choice(user_ids) if user_ids else None
            }
        ]
        
        for deal in demo_deals:
            deals_collection.insert_one(deal)
            
        print(f"✅ Created {len(demo_deals)} demo deals")
        
        # Create demo tasks
        tasks_collection = db.tasks
        tasks_collection.delete_many({})  # Clear existing
        
        demo_tasks = [
            {
                "id": str(uuid.uuid4()),
                "title": "התקשרות מעקב ליואב",
                "description": "לבדוק אם יש שאלות נוספות לגבי ההצעה",
                "type": "call",
                "status": "pending",
                "priority": "high",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "related_contact_id": None,
                "related_lead_id": demo_leads[0]["id"],
                "related_deal_id": demo_deals[0]["id"],
                "due_date": datetime.utcnow() + timedelta(days=1),
                "completed_at": None,
                "notes": "חשוב להתקשר אחרי השעה 14:00",
                "created_at": datetime.utcnow() - timedelta(hours=6),
                "updated_at": datetime.utcnow(),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "title": "שליחת חוזה לשרה",
                "description": "להכין ולשלוח חוזה מעודכן",
                "type": "email",
                "status": "pending",
                "priority": "high",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "related_contact_id": None,
                "related_lead_id": demo_leads[1]["id"],
                "related_deal_id": demo_deals[1]["id"],
                "due_date": datetime.utcnow() + timedelta(hours=8),
                "completed_at": None,
                "notes": "לכלול את השינויים שבקשה",
                "created_at": datetime.utcnow() - timedelta(hours=3),
                "updated_at": datetime.utcnow(),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "title": "פגישה עם דוד - התקנה",
                "description": "לתאם מועד התקנה במשרד",
                "type": "meeting",
                "status": "completed",
                "priority": "medium",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "related_contact_id": None,
                "related_lead_id": demo_leads[2]["id"],
                "related_deal_id": demo_deals[2]["id"],
                "due_date": datetime.utcnow() - timedelta(hours=12),
                "completed_at": datetime.utcnow() - timedelta(hours=6),
                "notes": "פגישה עברה בהצלחה - התקנה ביום ראשון",
                "created_at": datetime.utcnow() - timedelta(days=2),
                "updated_at": datetime.utcnow() - timedelta(hours=6),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "title": "מעקב אחרי רחל",
                "description": "לבדוק אם קיבלה את חומר המידע",
                "type": "follow_up",
                "status": "pending",
                "priority": "medium",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "related_contact_id": None,
                "related_lead_id": demo_leads[3]["id"],
                "related_deal_id": None,
                "due_date": datetime.utcnow() + timedelta(days=2),
                "completed_at": None,
                "notes": "שלחנו חומר אתמול",
                "created_at": datetime.utcnow() - timedelta(hours=18),
                "updated_at": datetime.utcnow(),
                "created_by": random.choice(user_ids) if user_ids else None
            },
            {
                "id": str(uuid.uuid4()),
                "title": "ניתוח למה העסקה נכשלה",
                "description": "לכתוב סיכום למה מיכאל בחר בפתרון אחר",
                "type": "follow_up",
                "status": "completed",
                "priority": "low",
                "assigned_to": random.choice(user_ids) if user_ids else None,
                "related_contact_id": None,
                "related_lead_id": demo_leads[4]["id"],
                "related_deal_id": None,
                "due_date": datetime.utcnow() - timedelta(days=1),
                "completed_at": datetime.utcnow() - timedelta(hours=8),
                "notes": "מחיר היה הגורם העיקרי - לשפר את מדיניות התמחור",
                "created_at": datetime.utcnow() - timedelta(days=3),
                "updated_at": datetime.utcnow() - timedelta(hours=8),
                "created_by": random.choice(user_ids) if user_ids else None
            }
        ]
        
        for task in demo_tasks:
            tasks_collection.insert_one(task)
            
        print(f"✅ Created {len(demo_tasks)} demo tasks")
        
        # Enhanced demo calls with CRM relationships
        calls_collection = db.calls
        calls_collection.delete_many({})  # Clear existing
        
        demo_calls = [
            {
                "id": str(uuid.uuid4()),
                "caller_name": "יואב כהן",
                "caller_number": "+972-50-111-2233",
                "callee_number": "+972-50-555-0003",
                "start_time": datetime.utcnow() - timedelta(hours=2),
                "end_time": datetime.utcnow() - timedelta(hours=2) + timedelta(minutes=12),
                "duration": 720,  # 12 minutes
                "status": "completed",
                "transcription": "שלום, רציתי לשמוע פרטים נוספים על המערכת הטלפונית שלכם. אנחנו חברה צומחת עם 50 עובדים וזקוקים לפתרון מקצועי.",
                "sentiment": "positive",
                "language": "he",
                "recording_url": "https://example.com/recording1.wav",
                "created_at": datetime.utcnow() - timedelta(hours=2)
            },
            {
                "id": str(uuid.uuid4()),
                "caller_name": "שרה לוי",
                "caller_number": "+972-54-444-5566",
                "callee_number": "+972-50-555-0005",
                "start_time": datetime.utcnow() - timedelta(days=1),
                "end_time": datetime.utcnow() - timedelta(days=1) + timedelta(minutes=8),
                "duration": 480,  # 8 minutes
                "status": "completed",
                "transcription": "היי, אני שרה מסוכנות השיווק. קיבלתי המלצה עליכם מדוד אברמוביץ. רציתי לברר על אפשרויות למערכת טלפוניה לקמפיינים.",
                "sentiment": "positive",
                "language": "he",
                "recording_url": "https://example.com/recording2.wav",
                "created_at": datetime.utcnow() - timedelta(days=1)
            },
            {
                "id": str(uuid.uuid4()),
                "caller_name": "רחל מזרחי",
                "caller_number": "+972-58-123-9999",
                "callee_number": "+972-50-555-0002",
                "start_time": datetime.utcnow() - timedelta(hours=10),
                "end_time": datetime.utcnow() - timedelta(hours=10) + timedelta(minutes=15),
                "duration": 900,  # 15 minutes
                "status": "completed",
                "transcription": "שלום, אני רחל מרשת מסעדות כשרות. אני מעוניינת במערכת לניהול הזמנות טלפוניות חכמה עם זיהוי לקוח אוטומטי.",
                "sentiment": "positive",
                "language": "he",
                "recording_url": "https://example.com/recording3.wav",
                "created_at": datetime.utcnow() - timedelta(hours=10)
            },
            {
                "id": str(uuid.uuid4()),
                "caller_name": "מיכאל רוזן",
                "caller_number": "+972-50-555-1122",
                "callee_number": "+972-50-555-0004",
                "start_time": datetime.utcnow() - timedelta(days=3),
                "end_time": datetime.utcnow() - timedelta(days=3) + timedelta(minutes=6),
                "duration": 360,  # 6 minutes
                "status": "completed",
                "transcription": "לצערי אחרי בדיקה מעמיקה החלטנו ללכת עם ספק אחר. המחיר שלכם קצת גבוה מדי עבור משרד בגודל שלנו.",
                "sentiment": "neutral",
                "language": "he",
                "recording_url": "https://example.com/recording4.wav",
                "created_at": datetime.utcnow() - timedelta(days=3)
            }
        ]
        
        for call in demo_calls:
            calls_collection.insert_one(call)
            
        print(f"✅ Created {len(demo_calls)} demo calls with CRM relationships")
        
        # Enhanced demo contacts
        contacts_collection = db.contacts
        contacts_collection.delete_many({})  # Clear existing
        
        demo_contacts = [
            {
                "id": str(uuid.uuid4()),
                "name": "יואב כהן",
                "phone_number": "+972-50-111-2233",
                "email": "yoav@tech-startup.co.il",
                "company": "סטארט-אפ טכנולוגיה",
                "tags": ["לקוח פוטנציאלי", "הייטק", "בעדיפות גבוהה"],
                "last_call_date": datetime.utcnow() - timedelta(hours=2),
                "total_calls": 3,
                "created_at": datetime.utcnow() - timedelta(days=2)
            },
            {
                "id": str(uuid.uuid4()),
                "name": "שרה לוי",
                "phone_number": "+972-54-444-5566", 
                "email": "sarah@marketing-agency.com",
                "company": "סוכנות שיווק דיגיטלי",
                "tags": ["לקוחה פוטנציאלית", "שיווק", "המלצה"],
                "last_call_date": datetime.utcnow() - timedelta(days=1),
                "total_calls": 2,
                "created_at": datetime.utcnow() - timedelta(days=5)
            },
            {
                "id": str(uuid.uuid4()),
                "name": "דוד אברמוביץ",
                "phone_number": "+972-52-777-8899",
                "email": "david@construction.co.il", 
                "company": "חברת בנייה משפחתית",
                "tags": ["לקוח", "בנייה", "נסגר"],
                "last_call_date": datetime.utcnow() - timedelta(days=3),
                "total_calls": 5,
                "created_at": datetime.utcnow() - timedelta(days=10)
            },
            {
                "id": str(uuid.uuid4()),
                "name": "רחל מזרחי",
                "phone_number": "+972-58-123-9999",
                "email": "rachel@restaurant-chain.co.il",
                "company": "רשת מסעדות כשרות",
                "tags": ["לקוחה פוטנציאלית", "מסעדות", "חדשה"],
                "last_call_date": datetime.utcnow() - timedelta(hours=10),
                "total_calls": 1,
                "created_at": datetime.utcnow() - timedelta(hours=12)
            },
            {
                "id": str(uuid.uuid4()),
                "name": "מיכאל רוזן",
                "phone_number": "+972-50-555-1122",
                "email": "michael@law-firm.co.il",
                "company": "משרד עורכי דין",
                "tags": ["לקוח לשעבר", "עורכי דין", "מחיר"],
                "last_call_date": datetime.utcnow() - timedelta(days=3),
                "total_calls": 4,
                "created_at": datetime.utcnow() - timedelta(days=15)
            }
        ]
        
        for contact in demo_contacts:
            contacts_collection.insert_one(contact)
            
        print(f"✅ Created {len(demo_contacts)} demo contacts")
        
        # Summary
        print("\n🎉 CRM Demo Data Creation Complete!")
        print("=" * 50)
        print(f"📊 Summary:")
        print(f"   • {len(demo_leads)} Leads created")
        print(f"   • {len(demo_deals)} Deals created")  
        print(f"   • {len(demo_tasks)} Tasks created")
        print(f"   • {len(demo_calls)} Calls created")
        print(f"   • {len(demo_contacts)} Contacts created")
        print("=" * 50)
        print("✨ Your CRM system now has comprehensive demo data for testing!")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error creating CRM demo data: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    print("🚀 AI Telephony Platform - CRM Demo Data Population")
    print("=" * 60)
    create_crm_demo_data()