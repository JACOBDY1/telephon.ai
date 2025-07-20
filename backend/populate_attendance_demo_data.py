#!/usr/bin/env python3
"""
Demo data population script for Attendance and Booking system
Creates sample employees, bookings, and attendance records
"""

import asyncio
import sys
import uuid
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")

# MongoDB async client for API operations
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

async def create_demo_employees():
    """Create demo employees for attendance tracking"""
    print("Creating demo employees...")
    
    employees = [
        {
            "id": str(uuid.uuid4()),
            "name": "יוסי כהן",
            "department": "מכירות",
            "phone": "+972-50-123-4567",
            "email": "yossi@company.com",
            "status": "active",
            "attendance_status": "present",
            "check_in": "08:30:00",
            "check_out": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "שרה לוי",
            "department": "תמיכה טכנית",
            "phone": "+972-50-234-5678",
            "email": "sarah@company.com",
            "status": "active",
            "attendance_status": "present",
            "check_in": "09:00:00",
            "check_out": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "אחמד חסן",
            "department": "פיתוח",
            "phone": "+972-50-345-6789",
            "email": "ahmad@company.com",
            "status": "active",
            "attendance_status": "absent",
            "check_in": None,
            "check_out": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "רחל דוד",
            "department": "שיווק",
            "phone": "+972-50-456-7890",
            "email": "rachel@company.com",
            "status": "active",
            "attendance_status": "present",
            "check_in": "08:45:00",
            "check_out": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "דנה מילר",
            "department": "ניהול",
            "phone": "+972-50-567-8901",
            "email": "dana@company.com",
            "status": "active",
            "attendance_status": "present",
            "check_in": "08:15:00",
            "check_out": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Clear existing data
    await db.employees.delete_many({})
    
    # Insert new data
    if employees:
        await db.employees.insert_many(employees)
        print(f"✅ Created {len(employees)} demo employees")
    
    return employees

async def create_demo_bookings(employees):
    """Create demo bookings"""
    print("Creating demo bookings...")
    
    # Get employee IDs
    emp_ids = [emp["id"] for emp in employees[:3]]  # First 3 employees
    
    bookings = []
    
    # Create bookings for today and next few days
    base_date = datetime.now()
    
    # Today's bookings
    today_str = base_date.strftime("%Y-%m-%d")
    bookings.extend([
        {
            "id": str(uuid.uuid4()),
            "employee_id": emp_ids[0],
            "client_name": "אברהם שטרן",
            "client_phone": "+972-50-111-2222",
            "client_email": "avraham@client.com",
            "service": "ייעוץ עסקי מתקדם",
            "date": today_str,
            "time": "10:00",
            "duration_minutes": 90,
            "status": "confirmed",
            "value": 1500.0,
            "notes": "לקוח חדש מעוניין בפתרונות מתקדמים",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": "admin"
        },
        {
            "id": str(uuid.uuid4()),
            "employee_id": emp_ids[1],
            "client_name": "רחל גולדברג",
            "client_phone": "+972-50-222-3333",
            "client_email": "rachel@fashion.com",
            "service": "התקנת מערכת CRM",
            "date": today_str,
            "time": "14:00",
            "duration_minutes": 120,
            "status": "pending",
            "value": 3000.0,
            "notes": "דרושה בדיקת תשתית לפני ההתקנה",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": "admin"
        }
    ])
    
    # Tomorrow's bookings
    tomorrow = base_date + timedelta(days=1)
    tomorrow_str = tomorrow.strftime("%Y-%m-%d")
    bookings.extend([
        {
            "id": str(uuid.uuid4()),
            "employee_id": emp_ids[2],
            "client_name": "דוד מילר",
            "client_phone": "+1-555-444-5555",
            "client_email": "david@trading.com",
            "service": "הדרכה על מערכת חדשה",
            "date": tomorrow_str,
            "time": "11:00",
            "duration_minutes": 180,
            "status": "confirmed",
            "value": 2500.0,
            "notes": "הדרכה מקיפה לצוות של 5 אנשים",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": "admin"
        },
        {
            "id": str(uuid.uuid4()),
            "employee_id": emp_ids[0],
            "client_name": "עדי כהן",
            "client_phone": "+972-50-333-4444",
            "client_email": "adi@startup.co.il",
            "service": "ייעוץ טכני",
            "date": tomorrow_str,
            "time": "16:00",
            "duration_minutes": 60,
            "status": "confirmed",
            "value": 800.0,
            "notes": "סטארטאפ צעיר מחפש פתרונות חסכוניים",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": "admin"
        }
    ])
    
    # Clear existing data
    await db.bookings.delete_many({})
    
    # Insert new data
    if bookings:
        await db.bookings.insert_many(bookings)
        print(f"✅ Created {len(bookings)} demo bookings")
    
    return bookings

async def create_demo_booking_leads(bookings):
    """Create demo leads from bookings"""
    print("Creating demo booking leads...")
    
    leads = []
    
    for booking in bookings[:2]:  # Create leads for first 2 bookings
        leads.append({
            "id": str(uuid.uuid4()),
            "name": f"{booking['client_name']} - מעקב",
            "phone": booking["client_phone"],
            "email": booking.get("client_email"),
            "source": "booking_followup",
            "interest": f"עסקה נוספת לאחר {booking['service']}",
            "value": booking["value"] * 1.5,  # Potential for 50% more value
            "probability": 70,
            "assigned_to": booking["employee_id"],
            "status": "hot",
            "last_contact": datetime.now().strftime("%Y-%m-%d"),
            "booking_id": booking["id"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
    
    # Additional leads not from bookings
    leads.extend([
        {
            "id": str(uuid.uuid4()),
            "name": "מיכל אברהם",
            "phone": "+972-50-555-6666",
            "email": "michal@company.co.il",
            "source": "website",
            "interest": "פתרון תקשורת מתקדם",
            "value": 4000.0,
            "probability": 50,
            "assigned_to": bookings[0]["employee_id"] if bookings else None,
            "status": "warm",
            "last_contact": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
            "booking_id": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "יואב רוזן",
            "phone": "+972-50-777-8888",
            "email": "yoav@restaurant.co.il",
            "source": "referral",
            "interest": "מערכת הזמנות אונליין",
            "value": 2200.0,
            "probability": 80,
            "assigned_to": bookings[1]["employee_id"] if len(bookings) > 1 else None,
            "status": "hot",
            "last_contact": datetime.now().strftime("%Y-%m-%d"),
            "booking_id": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ])
    
    # Clear existing data
    await db.booking_leads.delete_many({})
    
    # Insert new data
    if leads:
        await db.booking_leads.insert_many(leads)
        print(f"✅ Created {len(leads)} demo booking leads")
    
    return leads

async def create_demo_attendance_records(employees):
    """Create demo attendance records"""
    print("Creating demo attendance records...")
    
    records = []
    
    # Create records for past 7 days
    for i in range(7):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        
        for emp in employees:
            # Simulate some variation in attendance
            if i == 0:  # Today
                status = emp["attendance_status"]
                check_in = emp.get("check_in")
                check_out = emp.get("check_out")
            else:  # Past days
                import random
                status = "present" if random.random() > 0.1 else "absent"  # 90% attendance
                if status == "present":
                    # Random check-in time between 8:00-9:30
                    hour = random.randint(8, 9)
                    minute = random.randint(0, 59) if hour == 8 else random.randint(0, 30)
                    check_in = f"{hour:02d}:{minute:02d}:00"
                    
                    # Check-out time between 17:00-19:00
                    out_hour = random.randint(17, 18)
                    out_minute = random.randint(0, 59)
                    check_out = f"{out_hour:02d}:{out_minute:02d}:00"
                else:
                    check_in = None
                    check_out = None
            
            # Calculate hours worked
            hours_worked = None
            if check_in and check_out:
                check_in_time = datetime.strptime(check_in, "%H:%M:%S")
                check_out_time = datetime.strptime(check_out, "%H:%M:%S")
                hours_worked = round((check_out_time - check_in_time).seconds / 3600, 2)
            
            records.append({
                "id": str(uuid.uuid4()),
                "employee_id": emp["id"],
                "date": date,
                "check_in": check_in,
                "check_out": check_out,
                "status": status,
                "hours_worked": hours_worked,
                "notes": "רגיל" if status == "present" else "חסר ללא הודעה מוקדמת" if status == "absent" else None,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
    
    # Clear existing data
    await db.attendance.delete_many({})
    
    # Insert new data
    if records:
        await db.attendance.insert_many(records)
        print(f"✅ Created {len(records)} demo attendance records")
    
    return records

async def main():
    """Main function to populate all demo data"""
    print("🚀 Starting attendance and booking demo data population...")
    print(f"MongoDB URL: {MONGO_URL}")
    print(f"Database: {DB_NAME}")
    
    try:
        # Test connection
        await client.admin.command("ping")
        print("✅ Connected to MongoDB successfully")
        
        # Create demo data
        employees = await create_demo_employees()
        bookings = await create_demo_bookings(employees)
        leads = await create_demo_booking_leads(bookings)
        records = await create_demo_attendance_records(employees)
        
        print("\n🎉 Demo data population completed successfully!")
        print(f"📊 Summary:")
        print(f"   • {len(employees)} employees created")
        print(f"   • {len(bookings)} bookings created")
        print(f"   • {len(leads)} booking leads created")
        print(f"   • {len(records)} attendance records created")
        print("\n💡 You can now test the attendance and booking system!")
        
    except Exception as e:
        print(f"❌ Error during demo data population: {str(e)}")
        sys.exit(1)
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())