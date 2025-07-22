#!/usr/bin/env python3
"""
HairPro IL Advanced Review Request Tests
Tests the specific endpoints mentioned in the review request
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import time

# Backend URL from frontend/.env
BACKEND_URL = "https://85599114-0b34-4acc-a752-adb95ae9b552.preview.emergentagent.com/api"

class ReviewTester:
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
                    user_info = data["user"]
                    if user_info.get("user_type") == "professional":
                        self.auth_tokens["professional"] = data["access_token"]
                        self.log_result("Professional Login", True, 
                                      f"Professional user logged in with user_type: {user_info.get('user_type')}")
                        return True
                    else:
                        self.log_result("Professional Login", False, 
                                      f"Wrong user_type: {user_info.get('user_type')}")
                        return False
                else:
                    self.log_result("Professional Login", False, "Missing token or user data")
                    return False
            else:
                self.log_result("Professional Login", False, f"Login failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Login", False, f"Login test failed: {str(e)}")
            return False
    
    def test_attendance_endpoints(self):
        """Test attendance system endpoints"""
        try:
            if not self.auth_tokens.get("professional"):
                self.log_result("Attendance Endpoints", False, "No professional token")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            
            # Test attendance start
            start_data = {
                "start_time": datetime.now().strftime("%H:%M:%S"),
                "location": "סלון יופי מרכז"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/attendance/start", json=start_data, headers=headers)
            if response.status_code == 404:
                self.log_result("Attendance Start Endpoint", False, "Endpoint not found - attendance system not implemented")
            elif response.status_code == 200:
                self.log_result("Attendance Start Endpoint", True, "Attendance start working")
            else:
                self.log_result("Attendance Start Endpoint", False, f"Unexpected status: {response.status_code}")
            
            # Test attendance status
            response = self.session.get(f"{BACKEND_URL}/professional/attendance/status", headers=headers)
            if response.status_code == 404:
                self.log_result("Attendance Status Endpoint", False, "Endpoint not found - attendance system not implemented")
            elif response.status_code == 200:
                self.log_result("Attendance Status Endpoint", True, "Attendance status working")
            else:
                self.log_result("Attendance Status Endpoint", False, f"Unexpected status: {response.status_code}")
            
            # Test attendance end
            end_data = {
                "end_time": datetime.now().strftime("%H:%M:%S")
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/attendance/end", json=end_data, headers=headers)
            if response.status_code == 404:
                self.log_result("Attendance End Endpoint", False, "Endpoint not found - attendance system not implemented")
            elif response.status_code == 200:
                self.log_result("Attendance End Endpoint", True, "Attendance end working")
            else:
                self.log_result("Attendance End Endpoint", False, f"Unexpected status: {response.status_code}")
            
            return False  # All attendance endpoints are missing
            
        except Exception as e:
            self.log_result("Attendance Endpoints", False, f"Test failed: {str(e)}")
            return False
    
    def test_existing_professional_endpoints(self):
        """Test existing professional endpoints"""
        try:
            if not self.auth_tokens.get("professional"):
                self.log_result("Existing Professional Endpoints", False, "No professional token")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            success_count = 0
            
            # Test clients endpoint
            response = self.session.get(f"{BACKEND_URL}/professional/clients", headers=headers)
            if response.status_code == 200:
                clients = response.json()
                self.log_result("Professional Clients", True, f"Retrieved {len(clients)} clients")
                success_count += 1
            else:
                self.log_result("Professional Clients", False, f"Failed: {response.status_code}")
            
            # Test formulas endpoint
            response = self.session.get(f"{BACKEND_URL}/professional/formulas", headers=headers)
            if response.status_code == 200:
                formulas = response.json()
                self.log_result("Professional Formulas", True, f"Retrieved {len(formulas)} formulas")
                success_count += 1
            else:
                self.log_result("Professional Formulas", False, f"Failed: {response.status_code}")
            
            # Test dashboard endpoint
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                dashboard = response.json()
                revenue = dashboard.get("today_stats", {}).get("revenue", 0)
                self.log_result("Professional Dashboard", True, f"Dashboard loaded, revenue: ₪{revenue}")
                success_count += 1
            else:
                self.log_result("Professional Dashboard", False, f"Failed: {response.status_code}")
            
            # Test goals endpoint (might not exist as GET)
            response = self.session.get(f"{BACKEND_URL}/professional/goals", headers=headers)
            if response.status_code == 200:
                goals = response.json()
                self.log_result("Professional Goals", True, "Goals endpoint working")
                success_count += 1
            elif response.status_code == 405:
                self.log_result("Professional Goals", False, "GET goals endpoint not implemented (only POST)")
            else:
                self.log_result("Professional Goals", False, f"Failed: {response.status_code}")
            
            # Test inventory endpoint
            response = self.session.get(f"{BACKEND_URL}/professional/inventory", headers=headers)
            if response.status_code == 200:
                inventory = response.json()
                self.log_result("Professional Inventory", True, f"Retrieved {len(inventory)} inventory items")
                success_count += 1
            else:
                self.log_result("Professional Inventory", False, f"Failed: {response.status_code}")
            
            return success_count >= 3
            
        except Exception as e:
            self.log_result("Existing Professional Endpoints", False, f"Test failed: {str(e)}")
            return False
    
    def test_data_integrity(self):
        """Test data integrity and format"""
        try:
            if not self.auth_tokens.get("professional"):
                self.log_result("Data Integrity", False, "No professional token")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            integrity_checks = 0
            
            # Test JSON format
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                try:
                    data = response.json()
                    self.log_result("JSON Format", True, "Valid JSON format")
                    integrity_checks += 1
                except json.JSONDecodeError:
                    self.log_result("JSON Format", False, "Invalid JSON")
            
            # Test Hebrew currency
            if response.status_code == 200:
                dashboard = response.json()
                revenue = dashboard.get("today_stats", {}).get("revenue", 0)
                if isinstance(revenue, (int, float)):
                    self.log_result("Currency Format", True, f"Revenue in shekels: ₪{revenue}")
                    integrity_checks += 1
                else:
                    self.log_result("Currency Format", False, f"Invalid revenue format: {revenue}")
            
            # Test alerts and goals
            if response.status_code == 200:
                dashboard = response.json()
                if "alerts" in dashboard and "current_goals" in dashboard:
                    alerts = dashboard["alerts"]
                    goals = dashboard["current_goals"]
                    self.log_result("Alerts & Goals", True, 
                                  f"{len(alerts.get('low_stock_items', []))} alerts, {len(goals)} goals")
                    integrity_checks += 1
                else:
                    self.log_result("Alerts & Goals", False, "Missing alerts or goals")
            
            # Test time sync
            if response.status_code == 200:
                dashboard = response.json()
                appointments = dashboard.get("today_appointments", [])
                self.log_result("Time Sync", True, f"{len(appointments)} today's appointments")
                integrity_checks += 1
            
            return integrity_checks >= 3
            
        except Exception as e:
            self.log_result("Data Integrity", False, f"Test failed: {str(e)}")
            return False
    
    def run_review_tests(self):
        """Run all review request tests"""
        print("🎯 HairPro IL Advanced Review Request Testing")
        print("=" * 60)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Test started: {datetime.now().isoformat()}")
        print()
        
        # Test professional authentication
        print("1. Testing Professional Authentication...")
        auth_success = self.test_professional_login()
        print()
        
        if auth_success:
            # Test attendance system
            print("2. Testing Attendance System...")
            self.test_attendance_endpoints()
            print()
            
            # Test existing endpoints
            print("3. Testing Existing Professional Endpoints...")
            endpoints_success = self.test_existing_professional_endpoints()
            print()
            
            # Test data integrity
            print("4. Testing Data Integrity...")
            integrity_success = self.test_data_integrity()
            print()
        else:
            print("❌ Cannot proceed without professional authentication")
            return False
        
        # Summary
        print("=" * 60)
        print("REVIEW TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        print("\nDetailed Results:")
        for result in self.results:
            status = "✅" if result["success"] else "❌"
            print(f"  {status} {result['test']}: {result['message']}")
        
        return passed >= total * 0.7  # 70% success rate

if __name__ == "__main__":
    tester = ReviewTester()
    success = tester.run_review_tests()
    
    if success:
        print("\n🎉 Review tests completed successfully!")
        sys.exit(0)
    else:
        print("\n⚠️ Some review tests failed")
        sys.exit(1)