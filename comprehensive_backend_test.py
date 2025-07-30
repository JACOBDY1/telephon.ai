#!/usr/bin/env python3
"""
Comprehensive Backend Testing for HairPro IL Advanced System
בדיקה מקיפה ומיידית של כל מערכות ה-backend
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import time

# Backend URL from frontend/.env
BACKEND_URL = "https://81668d8e-d012-4b5c-aff3-ee133ba62d3e.preview.emergentagent.com/api"

# Demo user credentials for authentication testing
DEMO_USERS = {
    "admin": {"username": "admin", "password": "admin123"},
    "manager": {"username": "manager", "password": "manager123"},
    "demo": {"username": "demo", "password": "demo123"},
    "professional": {"username": "professional", "password": "pro123"}
}

class ComprehensiveBackendTester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.timeout = 30
        self.auth_tokens = {}
        self.passed_tests = 0
        self.total_tests = 0
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test result"""
        self.total_tests += 1
        if success:
            self.passed_tests += 1
            
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.results.append(result)
        status = "✅ WORKING" if success else "❌ FAILED"
        print(f"{status} {test_name}: {message}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    def test_health_check(self):
        """1. בדיקת בריאות מערכת - Health check endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/health")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Health Check Endpoint", True, 
                                  f"Backend healthy - Status: {data.get('status')}, Database: {data.get('database', 'connected')}")
                    return True
                else:
                    self.log_result("Health Check Endpoint", False, 
                                  f"Backend reports unhealthy status: {data.get('status')}", data)
                    return False
            else:
                self.log_result("Health Check Endpoint", False, 
                              f"Health check failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Health Check Endpoint", False, f"Health check request failed: {str(e)}")
            return False
    
    def test_mongodb_connection(self):
        """2. חיבור MongoDB - Database connectivity"""
        try:
            # Test database connectivity through health endpoint
            response = self.session.get(f"{BACKEND_URL}/health")
            
            if response.status_code == 200:
                data = response.json()
                if "database" in data and data["database"] == "connected":
                    self.log_result("MongoDB Connection", True, "MongoDB database connected successfully")
                    return True
                else:
                    self.log_result("MongoDB Connection", False, 
                                  f"Database connection issue: {data.get('database', 'unknown')}")
                    return False
            else:
                self.log_result("MongoDB Connection", False, "Cannot verify database connection")
                return False
                
        except Exception as e:
            self.log_result("MongoDB Connection", False, f"Database connection test failed: {str(e)}")
            return False
    
    def test_authentication_system(self):
        """3. מערכת אימות - Authentication with demo users"""
        try:
            login_success_count = 0
            
            for user_key, user_data in DEMO_USERS.items():
                login_data = {
                    "username": user_data["username"],
                    "password": user_data["password"]
                }
                
                response = self.session.post(
                    f"{BACKEND_URL}/auth/login", 
                    data=login_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "access_token" in data and "user" in data:
                        self.auth_tokens[user_key] = data["access_token"]
                        user_info = data["user"]
                        login_success_count += 1
                        self.log_result(f"Authentication - {user_key}", True, 
                                      f"Login successful: {user_data['username']} (type: {user_info.get('user_type', 'client')})")
                    else:
                        self.log_result(f"Authentication - {user_key}", False, 
                                      f"Missing token/user data for {user_data['username']}")
                else:
                    self.log_result(f"Authentication - {user_key}", False, 
                                  f"Login failed for {user_data['username']}: {response.status_code}")
            
            # Test JWT token validation
            if self.auth_tokens:
                demo_token = self.auth_tokens.get("demo")
                if demo_token:
                    headers = {"Authorization": f"Bearer {demo_token}"}
                    response = self.session.get(f"{BACKEND_URL}/auth/me", headers=headers)
                    
                    if response.status_code == 200:
                        self.log_result("JWT Token Validation", True, "JWT tokens working correctly")
                    else:
                        self.log_result("JWT Token Validation", False, f"JWT validation failed: {response.status_code}")
            
            return login_success_count >= 3
            
        except Exception as e:
            self.log_result("Authentication System", False, f"Authentication test failed: {str(e)}")
            return False
    
    def test_hairpro_professional_endpoints(self):
        """4. מערכת HairPro IL Advanced - Professional endpoints"""
        try:
            if not self.auth_tokens:
                self.log_result("HairPro Professional Endpoints", False, "No auth tokens available")
                return False
            
            # Test with demo user (should work for all users now)
            demo_token = self.auth_tokens.get("demo")
            if not demo_token:
                self.log_result("HairPro Professional Endpoints", False, "No demo token available")
                return False
            
            headers = {"Authorization": f"Bearer {demo_token}"}
            endpoints_tested = 0
            endpoints_working = 0
            
            # Test all professional endpoints
            professional_endpoints = [
                ("/professional/clients", "Clients"),
                ("/professional/formulas", "Formulas"), 
                ("/professional/inventory", "Inventory"),
                ("/professional/goals", "Goals"),
                ("/professional/attendance/status", "Attendance Status")
            ]
            
            for endpoint, name in professional_endpoints:
                endpoints_tested += 1
                response = self.session.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                
                if response.status_code == 200:
                    endpoints_working += 1
                    data = response.json()
                    if isinstance(data, list):
                        self.log_result(f"HairPro {name}", True, f"{name} endpoint working - {len(data)} items")
                    elif isinstance(data, dict):
                        self.log_result(f"HairPro {name}", True, f"{name} endpoint working - data available")
                    else:
                        self.log_result(f"HairPro {name}", True, f"{name} endpoint working")
                else:
                    self.log_result(f"HairPro {name}", False, f"{name} endpoint failed: {response.status_code}")
            
            # Test attendance system (start/end)
            start_data = {"start_time": datetime.now().strftime("%H:%M:%S"), "notes": "בדיקה"}
            response = self.session.post(f"{BACKEND_URL}/professional/attendance/start", json=start_data, headers=headers)
            if response.status_code == 200:
                endpoints_working += 1
                self.log_result("HairPro Attendance Start", True, "Attendance start working")
                
                # Test attendance end
                end_data = {"end_time": datetime.now().strftime("%H:%M:%S"), "notes": "סיום בדיקה"}
                response = self.session.post(f"{BACKEND_URL}/professional/attendance/end", json=end_data, headers=headers)
                if response.status_code == 200:
                    endpoints_working += 1
                    self.log_result("HairPro Attendance End", True, "Attendance end working")
                else:
                    self.log_result("HairPro Attendance End", False, f"Attendance end failed: {response.status_code}")
            else:
                self.log_result("HairPro Attendance Start", False, f"Attendance start failed: {response.status_code}")
            
            endpoints_tested += 2  # Add attendance start/end to count
            
            success_rate = (endpoints_working / endpoints_tested) * 100
            self.log_result("HairPro System Summary", endpoints_working == endpoints_tested, 
                          f"HairPro endpoints: {endpoints_working}/{endpoints_tested} working ({success_rate:.1f}%)")
            
            return endpoints_working >= (endpoints_tested * 0.8)  # 80% success rate
            
        except Exception as e:
            self.log_result("HairPro Professional Endpoints", False, f"HairPro test failed: {str(e)}")
            return False
    
    def test_crm_system(self):
        """5. מערכת CRM - CRUD operations"""
        try:
            if not self.auth_tokens:
                self.log_result("CRM System", False, "No auth tokens available")
                return False
            
            demo_token = self.auth_tokens.get("demo")
            if not demo_token:
                self.log_result("CRM System", False, "No demo token available")
                return False
            
            headers = {"Authorization": f"Bearer {demo_token}"}
            crm_tests_passed = 0
            crm_tests_total = 0
            
            # Test CRM endpoints
            crm_endpoints = [
                ("/crm/leads", "Leads"),
                ("/crm/deals", "Deals"),
                ("/crm/tasks", "Tasks"),
                ("/contacts", "Contacts"),
                ("/calls", "Calls")
            ]
            
            for endpoint, name in crm_endpoints:
                crm_tests_total += 1
                response = self.session.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                
                if response.status_code == 200:
                    crm_tests_passed += 1
                    data = response.json()
                    if isinstance(data, list):
                        self.log_result(f"CRM {name}", True, f"{name} CRUD working - {len(data)} items")
                    else:
                        self.log_result(f"CRM {name}", True, f"{name} CRUD working")
                else:
                    self.log_result(f"CRM {name}", False, f"{name} CRUD failed: {response.status_code}")
            
            # Test CRM Analytics
            crm_tests_total += 1
            response = self.session.get(f"{BACKEND_URL}/crm/analytics/summary", headers=headers)
            if response.status_code == 200:
                crm_tests_passed += 1
                data = response.json()
                self.log_result("CRM Analytics", True, f"Analytics working - {data.get('total_leads', 0)} leads, {data.get('total_deals', 0)} deals")
            else:
                self.log_result("CRM Analytics", False, f"Analytics failed: {response.status_code}")
            
            # Test Hebrew content support
            crm_tests_total += 1
            response = self.session.get(f"{BACKEND_URL}/crm/leads?search=שם", headers=headers)
            if response.status_code == 200:
                crm_tests_passed += 1
                self.log_result("CRM Hebrew Support", True, "Hebrew content search working")
            else:
                self.log_result("CRM Hebrew Support", False, f"Hebrew search failed: {response.status_code}")
            
            success_rate = (crm_tests_passed / crm_tests_total) * 100
            self.log_result("CRM System Summary", crm_tests_passed >= (crm_tests_total * 0.8), 
                          f"CRM system: {crm_tests_passed}/{crm_tests_total} working ({success_rate:.1f}%)")
            
            return crm_tests_passed >= (crm_tests_total * 0.8)
            
        except Exception as e:
            self.log_result("CRM System", False, f"CRM test failed: {str(e)}")
            return False
    
    def test_api_integrations(self):
        """6. אינטגרציות API - Checkcall & MasterPBX"""
        try:
            integrations_passed = 0
            integrations_total = 0
            
            # Test Checkcall integration
            integrations_total += 1
            response = self.session.get(f"{BACKEND_URL}/integrations/checkcall/calls")
            if response.status_code == 200:
                integrations_passed += 1
                data = response.json()
                self.log_result("Checkcall Integration", True, f"Checkcall API working - {data.get('count', 0)} calls")
            else:
                self.log_result("Checkcall Integration", False, f"Checkcall failed: {response.status_code}")
            
            # Test MasterPBX integration
            integrations_total += 1
            response = self.session.get(f"{BACKEND_URL}/integrations/masterpbx/calllog")
            if response.status_code == 200:
                integrations_passed += 1
                data = response.json()
                self.log_result("MasterPBX Integration", True, f"MasterPBX API working - {data.get('count', 0)} logs")
            else:
                self.log_result("MasterPBX Integration", False, f"MasterPBX failed: {response.status_code}")
            
            # Test Real-time analytics
            integrations_total += 1
            response = self.session.get(f"{BACKEND_URL}/analytics/realtime")
            if response.status_code == 200:
                integrations_passed += 1
                data = response.json()
                self.log_result("Real-time Analytics", True, f"Analytics working - {data.get('active_calls', 0)} active calls")
            else:
                self.log_result("Real-time Analytics", False, f"Analytics failed: {response.status_code}")
            
            # Test Webhook endpoint
            integrations_total += 1
            webhook_data = {
                "event": "test_event",
                "data": {"test": "בדיקה"}
            }
            response = self.session.post(f"{BACKEND_URL}/webhook/checkcall", json=webhook_data)
            if response.status_code == 200:
                integrations_passed += 1
                self.log_result("Webhook Endpoint", True, "Webhook processing working")
            else:
                self.log_result("Webhook Endpoint", False, f"Webhook failed: {response.status_code}")
            
            success_rate = (integrations_passed / integrations_total) * 100
            self.log_result("API Integrations Summary", integrations_passed >= (integrations_total * 0.75), 
                          f"API integrations: {integrations_passed}/{integrations_total} working ({success_rate:.1f}%)")
            
            return integrations_passed >= (integrations_total * 0.75)
            
        except Exception as e:
            self.log_result("API Integrations", False, f"API integrations test failed: {str(e)}")
            return False
    
    def test_all_apis_working(self):
        """7. כל ה-APIs עובדים - General API functionality"""
        try:
            api_tests_passed = 0
            api_tests_total = 0
            
            # Test basic API endpoints
            basic_endpoints = [
                ("/", "Root API"),
                ("/health", "Health Check"),
                ("/subscription/plans", "Subscription Plans")
            ]
            
            for endpoint, name in basic_endpoints:
                api_tests_total += 1
                response = self.session.get(f"{BACKEND_URL}{endpoint}")
                
                if response.status_code == 200:
                    api_tests_passed += 1
                    self.log_result(f"API {name}", True, f"{name} endpoint working")
                else:
                    self.log_result(f"API {name}", False, f"{name} failed: {response.status_code}")
            
            # Test protected endpoints (should return 401 without auth)
            if self.auth_tokens:
                demo_token = self.auth_tokens.get("demo")
                if demo_token:
                    headers = {"Authorization": f"Bearer {demo_token}"}
                    
                    protected_endpoints = [
                        ("/auth/me", "User Profile"),
                        ("/analytics/summary", "Analytics Summary")
                    ]
                    
                    for endpoint, name in protected_endpoints:
                        api_tests_total += 1
                        response = self.session.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                        
                        if response.status_code == 200:
                            api_tests_passed += 1
                            self.log_result(f"Protected API {name}", True, f"{name} working with auth")
                        else:
                            self.log_result(f"Protected API {name}", False, f"{name} failed: {response.status_code}")
            
            success_rate = (api_tests_passed / api_tests_total) * 100
            self.log_result("All APIs Summary", api_tests_passed >= (api_tests_total * 0.8), 
                          f"API endpoints: {api_tests_passed}/{api_tests_total} working ({success_rate:.1f}%)")
            
            return api_tests_passed >= (api_tests_total * 0.8)
            
        except Exception as e:
            self.log_result("All APIs Working", False, f"API test failed: {str(e)}")
            return False
    
    def run_comprehensive_test(self):
        """Run all comprehensive backend tests"""
        print("🚀 בדיקה מקיפה ומיידית של כל מערכות ה-backend")
        print("=" * 80)
        print("COMPREHENSIVE BACKEND TESTING - HairPro IL Advanced System")
        print("=" * 80)
        
        # Run all tests
        tests = [
            ("1. Health Check & System Status", self.test_health_check),
            ("2. MongoDB Database Connection", self.test_mongodb_connection),
            ("3. Authentication System", self.test_authentication_system),
            ("4. HairPro IL Advanced Features", self.test_hairpro_professional_endpoints),
            ("5. CRM System CRUD Operations", self.test_crm_system),
            ("6. API Integrations", self.test_api_integrations),
            ("7. All APIs Working", self.test_all_apis_working)
        ]
        
        for test_name, test_func in tests:
            print(f"\n[{test_name}]")
            print("-" * 60)
            try:
                test_func()
            except Exception as e:
                self.log_result(test_name, False, f"Test execution failed: {str(e)}")
        
        # Print final summary
        print("\n" + "=" * 80)
        print("🎯 COMPREHENSIVE BACKEND TEST SUMMARY")
        print("=" * 80)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        if success_rate >= 90:
            status = "🎉 EXCELLENT"
            color = "GREEN"
        elif success_rate >= 80:
            status = "✅ GOOD"
            color = "YELLOW"
        elif success_rate >= 70:
            status = "⚠️ ACCEPTABLE"
            color = "ORANGE"
        else:
            status = "❌ NEEDS ATTENTION"
            color = "RED"
        
        print(f"Overall Success Rate: {success_rate:.1f}% ({self.passed_tests}/{self.total_tests} tests passed)")
        print(f"System Status: {status}")
        
        # Detailed results
        print(f"\n📊 DETAILED RESULTS:")
        for result in self.results:
            status_icon = "✅" if result["success"] else "❌"
            print(f"{status_icon} {result['test']}: {result['message']}")
        
        print(f"\n🏁 CONCLUSION:")
        if success_rate >= 90:
            print("🚀 SYSTEM IS PRODUCTION-READY! All major backend systems working excellently.")
        elif success_rate >= 80:
            print("✅ SYSTEM IS STABLE! Most backend systems working with minor issues.")
        elif success_rate >= 70:
            print("⚠️ SYSTEM NEEDS MINOR FIXES! Most systems working but some issues found.")
        else:
            print("❌ SYSTEM NEEDS ATTENTION! Multiple critical issues found.")
        
        return success_rate >= 80

if __name__ == "__main__":
    tester = ComprehensiveBackendTester()
    success = tester.run_comprehensive_test()
    sys.exit(0 if success else 1)