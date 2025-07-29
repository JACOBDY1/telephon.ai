#!/usr/bin/env python3
"""
סקריפט לתיקון כל האנדפוינטים המקצועיים כך שיעבדו לכל המשתמשים
"""

import re

def fix_professional_endpoints():
    """תיקון כל ההגבלות של user_type באנדפוינטים המקצועיים"""
    
    with open('/app/backend/server.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # רשימת כל התיקונים הנדרשים
    fixes = [
        # פורמולות
        {
            'pattern': r'@api_router\.get\("/professional/formulas"\)\nasync def get_formulas\(\n.*?\):\n.*?""".*?"""\n.*?try:\n.*?if current_user\.user_type not in \["professional", "barber", "therapist"\]:\n.*?raise HTTPException\(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד"\)',
            'replacement': '@api_router.get("/professional/formulas")\nasync def get_formulas(\n    client_id: Optional[str] = None,\n    date_from: Optional[str] = None,\n    date_to: Optional[str] = None,\n    limit: int = 20,\n    current_user: User = Depends(get_current_active_user)\n):\n    """קבלת פורמולות צבע עם סינון - זמין לכל המשתמשים"""\n    try:\n        # הסרת הגבלה - כל המשתמשים יכולים לגשת למערכת הפורמולות'
        },
        
        # מלאי
        {
            'pattern': r'if current_user\.user_type not in \["professional", "barber", "therapist"\]:\s*raise HTTPException\(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד"\)',
            'replacement': '# הסרת הגבלה - כל המשתמשים יכולים לגשת למערכת המלאי'
        }
    ]
    
    # החלת התיקונים
    modified_content = content
    
    # תיקון כל ההגבלות של user_type
    modified_content = re.sub(
        r'if current_user\.user_type not in \["professional", "barber", "therapist"\]:\s*raise HTTPException\(status_code=403, detail="גישה מוגבלת למשתמשים מקצועיים בלבד"\)',
        '# הסרת הגבלה - כל המשתמשים יכולים לגשת למערכות המקצועיות',
        modified_content,
        flags=re.MULTILINE | re.DOTALL
    )
    
    # שמירת הקובץ המתוקן
    with open('/app/backend/server.py', 'w', encoding='utf-8') as f:
        f.write(modified_content)
    
    print("✅ תוקנו כל האנדפוינטים המקצועיים להיות זמינים לכל המשתמשים")

if __name__ == "__main__":
    fix_professional_endpoints()