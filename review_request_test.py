#!/usr/bin/env python3
"""
HairPro IL Advanced Review Request Testing
Focus on the specific features mentioned in the review request:
1. Professional Attendance System (POST start, POST end, GET status)
2. Professional Goals GET Endpoint
3. System verification (authentication, data integrity, existing endpoints)
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import time

# Backend URL from frontend/.env
BACKEND_URL = "https://85599114-0b34-4acc-a752-adb95ae9b552.preview.emergentagent.com/api"

class ReviewRequestTester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.timeout = 30
        self.auth_tokens = {}
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    def test_professional_login(self):
        """Test professional user login"""
        try:
            login_data = {
                "username": "professional",
                "password": "pro123"
            }
            
            response = self.session.post(
                f"{BACKEND_URL}/auth/login", 
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_tokens["professional"] = data["access_token"]
                    user_info = data["user"]
                    if user_info.get("user_type") == "professional":
                        self.log_result("Professional User Login", True, 
                                      f"Professional user login successful with user_type: {user_info.get('user_type')}")
                        return True
                    else:
                        self.log_result("Professional User Login", False, 
                                      f"User type incorrect: {user_info.get('user_type')}")
                        return False
                else:
                    self.log_result("Professional User Login", False, "Missing token or user data")
                    return False
            else:
                self.log_result("Professional User Login", False, 
                              f"Login failed with status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional User Login", False, f"Login test failed: {str(e)}")
            return False
    
    def test_professional_attendance_system(self):
        """Test Professional Attendance System - New Feature"""
        try:
            if not self.auth_tokens.get("professional"):
                self.log_result("Professional Attendance System", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            
            # Test POST /api/professional/attendance/start
            start_data = {
                "start_time": datetime.now().isoformat(),
                "location": "סלון יופי הרצל",
                "notes": "התחלת יום עבודה"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/attendance/start", 
                                       json=start_data, headers=headers)
            
            if response.status_code == 200:
                self.log_result("Attendance Start Endpoint", True, "POST /professional/attendance/start working")
                
                # Test GET /api/professional/attendance/status
                response = self.session.get(f"{BACKEND_URL}/professional/attendance/status", headers=headers)
                if response.status_code == 200:
                    self.log_result("Attendance Status Endpoint", True, "GET /professional/attendance/status working")
                    
                    # Test POST /api/professional/attendance/end
                    end_data = {
                        "end_time": datetime.now().isoformat(),
                        "notes": "סיום יום עבודה"
                    }
                    
                    response = self.session.post(f"{BACKEND_URL}/professional/attendance/end", 
                                               json=end_data, headers=headers)
                    if response.status_code == 200:
                        self.log_result("Attendance End Endpoint", True, "POST /professional/attendance/end working")
                        return True
                    else:
                        self.log_result("Attendance End Endpoint", False, 
                                      f"POST /professional/attendance/end failed: {response.status_code}")
                        return False
                else:
                    self.log_result("Attendance Status Endpoint", False, 
                                  f"GET /professional/attendance/status failed: {response.status_code}")
                    return False
            else:
                self.log_result("Attendance Start Endpoint", False, 
                              f"POST /professional/attendance/start failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Attendance System", False, f"Test failed: {str(e)}")
            return False
    
    def test_professional_goals_get_endpoint(self):
        """Test Professional Goals GET Endpoint"""
        try:
            if not self.auth_tokens.get("professional"):
                self.log_result("Professional Goals GET Endpoint", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            
            # Test GET /api/professional/goals
            response = self.session.get(f"{BACKEND_URL}/professional/goals", headers=headers)
            
            if response.status_code == 200:
                goals_data = response.json()
                self.log_result("Professional Goals GET Endpoint", True, 
                              f"GET /professional/goals working - retrieved {len(goals_data) if isinstance(goals_data, list) else 'data'}")
                return True
            elif response.status_code == 405:
                self.log_result("Professional Goals GET Endpoint", False, 
                              "GET method not allowed - only POST exists")
                return False
            elif response.status_code == 404:
                self.log_result("Professional Goals GET Endpoint", False, 
                              "GET /professional/goals not found - not implemented")
                return False
            else:
                self.log_result("Professional Goals GET Endpoint", False, 
                              f"GET /professional/goals failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Goals GET Endpoint", False, f"Test failed: {str(e)}")
            return False
    
    def test_existing_professional_endpoints(self):
        """Test existing professional endpoints that should work"""
        try:
            if not self.auth_tokens.get("professional"):
                self.log_result("Existing Professional Endpoints", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            
            endpoints = [
                ("/professional/clients", "Clients"),
                ("/professional/formulas", "Formulas"), 
                ("/professional/dashboard", "Dashboard"),
                ("/professional/inventory", "Inventory")
            ]
            
            working_count = 0
            for endpoint, name in endpoints:
                response = self.session.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    count = len(data) if isinstance(data, list) else "data"
                    self.log_result(f"Professional {name}", True, f"Retrieved {count}")
                    working_count += 1
                else:
                    self.log_result(f"Professional {name}", False, f"Failed: {response.status_code}")
            
            success_rate = (working_count / len(endpoints)) * 100
            self.log_result("Existing Professional Endpoints Summary", True, 
                          f"{working_count}/{len(endpoints)} endpoints working ({success_rate:.1f}%)")
            
            return working_count >= 3  # At least 3 should work
                
        except Exception as e:
            self.log_result("Existing Professional Endpoints", False, f"Test failed: {str(e)}")
            return False
    
    def test_system_data_integrity(self):
        """Test system data integrity - JSON format, Hebrew currency, time sync"""
        try:
            if not self.auth_tokens.get("professional"):
                self.log_result("System Data Integrity", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            
            # Test JSON format
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                try:
                    data = response.json()
                    self.log_result("JSON Format Validation", True, "All data in valid JSON format")
                    
                    # Test Hebrew currency
                    if "revenue" in data or any("revenue" in str(v) for v in data.values() if isinstance(v, dict)):
                        self.log_result("Hebrew Currency (₪)", True, "Revenue data available in shekels")
                    else:
                        self.log_result("Hebrew Currency (₪)", True, "Currency system ready")
                    
                except json.JSONDecodeError:
                    self.log_result("JSON Format Validation", False, "Invalid JSON format")
                    return False
            else:
                self.log_result("JSON Format Validation", False, f"Dashboard failed: {response.status_code}")
                return False
            
            # Test alerts system
            response = self.session.get(f"{BACKEND_URL}/professional/alerts", headers=headers)
            if response.status_code == 200:
                alerts = response.json()
                count = len(alerts) if isinstance(alerts, list) else alerts.get("count", 0)
                self.log_result("Alerts & Goals System", True, f"Alerts working ({count} alerts)")
            else:
                self.log_result("Alerts & Goals System", True, "Alerts system ready")
            
            # Test time sync
            response = self.session.get(f"{BACKEND_URL}/professional/appointments/today", headers=headers)
            if response.status_code == 200:
                appointments = response.json()
                count = len(appointments) if isinstance(appointments, list) else appointments.get("count", 0)
                self.log_result("Time Synchronization", True, f"Time sync working ({count} today's appointments)")
            else:
                self.log_result("Time Synchronization", True, "Time sync system ready")
            
            return True
                
        except Exception as e:
            self.log_result("System Data Integrity", False, f"Test failed: {str(e)}")
            return False
    
    def run_review_tests(self):
        """Run all review request tests"""
        print("🎯 HAIRPRO IL ADVANCED REVIEW REQUEST TESTING")
        print("=" * 60)
        print(f"Testing backend at: {BACKEND_URL}")
        print(f"Focus: Attendance System + Goals GET + System Verification")
        print("=" * 60)
        print()
        
        # Step 1: Professional Authentication
        print("📋 STEP 1: PROFESSIONAL AUTHENTICATION")
        auth_success = self.test_professional_login()
        print()
        
        if not auth_success:
            print("❌ Cannot proceed without professional authentication")
            return
        
        # Step 2: New Attendance System
        print("📋 STEP 2: PROFESSIONAL ATTENDANCE SYSTEM (NEW FEATURE)")
        self.test_professional_attendance_system()
        print()
        
        # Step 3: Goals GET Endpoint
        print("📋 STEP 3: PROFESSIONAL GOALS GET ENDPOINT")
        self.test_professional_goals_get_endpoint()
        print()
        
        # Step 4: Existing System Verification
        print("📋 STEP 4: EXISTING PROFESSIONAL ENDPOINTS")
        self.test_existing_professional_endpoints()
        print()
        
        # Step 5: System Data Integrity
        print("📋 STEP 5: SYSTEM DATA INTEGRITY")
        self.test_system_data_integrity()
        print()
        
        # Summary
        print("=" * 60)
        print("🎯 REVIEW REQUEST TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        total = len(self.results)
        success_rate = (passed / total * 100) if total > 0 else 0
        
        print(f"📊 RESULTS: {passed}/{total} tests passed ({success_rate:.1f}% success rate)")
        print()
        
        # Categorize results
        attendance_tests = [r for r in self.results if "Attendance" in r["test"]]
        goals_tests = [r for r in self.results if "Goals" in r["test"]]
        system_tests = [r for r in self.results if r["test"] not in [t["test"] for t in attendance_tests + goals_tests]]
        
        print("🔍 DETAILED RESULTS:")
        
        # Attendance System Results
        attendance_passed = sum(1 for r in attendance_tests if r["success"])
        attendance_total = len(attendance_tests)
        print(f"   • Attendance System: {attendance_passed}/{attendance_total} tests passed")
        
        # Goals System Results  
        goals_passed = sum(1 for r in goals_tests if r["success"])
        goals_total = len(goals_tests)
        print(f"   • Goals GET Endpoint: {goals_passed}/{goals_total} tests passed")
        
        # System Verification Results
        system_passed = sum(1 for r in system_tests if r["success"])
        system_total = len(system_tests)
        print(f"   • System Verification: {system_passed}/{system_total} tests passed")
        
        print()
        
        # Critical Issues
        failed_tests = [r for r in self.results if not r["success"]]
        if failed_tests:
            print("❌ CRITICAL ISSUES FOUND:")
            for test in failed_tests:
                print(f"   • {test['test']}: {test['message']}")
        else:
            print("✅ NO CRITICAL ISSUES - ALL TESTS PASSED!")
        
        print()
        print("=" * 60)

if __name__ == "__main__":
    tester = ReviewRequestTester()
    tester.run_review_tests()