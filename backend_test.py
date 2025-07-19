#!/usr/bin/env python3
"""
Backend API Integration Tests
Tests the real API integrations for Checkcall and MasterPBX
AND comprehensive authentication system testing
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import time
import jwt
import base64

# Backend URL from frontend/.env
BACKEND_URL = "https://d049263f-d848-461f-9be9-362032e6c2b9.preview.emergentagent.com/api"

# Test credentials provided
CHECKCALL_CREDS = {
    "username": "office@day-1.co.il",
    "password": "121212kobi!",
    "user_id": "2367"
}

MASTERPBX_CREDS = {
    "username": "day1",
    "password": "0505552220"
}

# Demo user credentials for authentication testing
DEMO_USERS = {
    "admin": {"username": "admin", "password": "admin123", "role": "admin"},
    "manager": {"username": "manager", "password": "manager123", "role": "manager"},
    "demo": {"username": "demo", "password": "demo123", "role": "user"},
    "agent1": {"username": "agent1", "password": "agent123", "role": "user"},
    "agent2": {"username": "agent2", "password": "agent123", "role": "user"}
}

class APITester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.timeout = 30
        self.auth_tokens = {}  # Store auth tokens for different users
        
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
    
    # ===== AUTHENTICATION SYSTEM TESTS =====
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        try:
            # Test valid registration
            test_user = {
                "username": f"testuser_{int(time.time())}",
                "email": f"test_{int(time.time())}@example.com",
                "password": "testpass123",
                "full_name": "משתמש בדיקה",
                "phone": "+972-50-999-8888"
            }
            
            response = self.session.post(f"{BACKEND_URL}/auth/register", json=test_user)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.log_result("User Registration - Valid", True, 
                                  f"Successfully registered user: {test_user['username']}")
                    
                    # Test duplicate username
                    response2 = self.session.post(f"{BACKEND_URL}/auth/register", json=test_user)
                    if response2.status_code == 400:
                        self.log_result("User Registration - Duplicate", True, 
                                      "Properly rejects duplicate username")
                    else:
                        self.log_result("User Registration - Duplicate", False, 
                                      f"Should reject duplicate, got status {response2.status_code}")
                    return True
                else:
                    self.log_result("User Registration - Valid", False, 
                                  "Missing required fields in registration response", data)
                    return False
            else:
                self.log_result("User Registration - Valid", False, 
                              f"Registration failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("User Registration", False, f"Registration test failed: {str(e)}")
            return False
    
    def test_user_login(self):
        """Test user login with demo users"""
        try:
            login_success_count = 0
            
            for user_key, user_data in DEMO_USERS.items():
                # Test login with form data (OAuth2PasswordRequestForm)
                login_data = {
                    "username": user_data["username"],
                    "password": user_data["password"]
                }
                
                response = self.session.post(
                    f"{BACKEND_URL}/auth/login", 
                    data=login_data,  # Use form data, not JSON
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "access_token" in data and "user" in data:
                        # Store token for later tests
                        self.auth_tokens[user_key] = data["access_token"]
                        
                        # Verify user data
                        user_info = data["user"]
                        if (user_info.get("username") == user_data["username"] and 
                            user_info.get("role") == user_data["role"]):
                            login_success_count += 1
                            self.log_result(f"Login - {user_key}", True, 
                                          f"Successfully logged in {user_data['username']} with role {user_data['role']}")
                        else:
                            self.log_result(f"Login - {user_key}", False, 
                                          f"User data mismatch for {user_data['username']}", user_info)
                    else:
                        self.log_result(f"Login - {user_key}", False, 
                                      f"Missing token or user data in login response for {user_data['username']}", data)
                else:
                    self.log_result(f"Login - {user_key}", False, 
                                  f"Login failed for {user_data['username']} with status {response.status_code}", response.text)
            
            # Test invalid login
            invalid_login = {"username": "invalid_user", "password": "wrong_password"}
            response = self.session.post(
                f"{BACKEND_URL}/auth/login", 
                data=invalid_login,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 401:
                self.log_result("Login - Invalid Credentials", True, 
                              "Properly rejects invalid credentials")
            else:
                self.log_result("Login - Invalid Credentials", False, 
                              f"Should return 401 for invalid login, got {response.status_code}")
            
            return login_success_count >= 3  # At least 3 demo users should work
            
        except Exception as e:
            self.log_result("User Login", False, f"Login test failed: {str(e)}")
            return False
    
    def test_jwt_token_validation(self):
        """Test JWT token validation and structure"""
        try:
            if not self.auth_tokens:
                self.log_result("JWT Token Validation", False, "No auth tokens available for testing")
                return False
            
            # Test token structure
            admin_token = self.auth_tokens.get("admin")
            if admin_token:
                try:
                    # Decode without verification to check structure
                    decoded = jwt.decode(admin_token, options={"verify_signature": False})
                    
                    required_fields = ["sub", "exp"]
                    missing_fields = [field for field in required_fields if field not in decoded]
                    
                    if not missing_fields:
                        # Check expiration
                        exp_timestamp = decoded["exp"]
                        exp_datetime = datetime.fromtimestamp(exp_timestamp)
                        
                        if exp_datetime > datetime.now():
                            self.log_result("JWT Token Structure", True, 
                                          f"Token valid until {exp_datetime.isoformat()}")
                        else:
                            self.log_result("JWT Token Structure", False, 
                                          f"Token already expired at {exp_datetime.isoformat()}")
                    else:
                        self.log_result("JWT Token Structure", False, 
                                      f"Missing required JWT fields: {missing_fields}")
                        
                except jwt.DecodeError:
                    self.log_result("JWT Token Structure", False, "Invalid JWT token format")
            
            # Test invalid token handling
            invalid_headers = {"Authorization": "Bearer invalid_token_here"}
            response = self.session.get(f"{BACKEND_URL}/auth/me", headers=invalid_headers)
            
            if response.status_code == 401:
                self.log_result("JWT Invalid Token", True, "Properly rejects invalid tokens")
            else:
                self.log_result("JWT Invalid Token", False, 
                              f"Should return 401 for invalid token, got {response.status_code}")
            
            return True
            
        except Exception as e:
            self.log_result("JWT Token Validation", False, f"JWT validation test failed: {str(e)}")
            return False
    
    def test_protected_endpoints(self):
        """Test protected endpoints require authentication"""
        try:
            if not self.auth_tokens:
                self.log_result("Protected Endpoints", False, "No auth tokens available for testing")
                return False
            
            # Test /auth/me endpoint with valid token
            admin_token = self.auth_tokens.get("admin")
            if admin_token:
                headers = {"Authorization": f"Bearer {admin_token}"}
                response = self.session.get(f"{BACKEND_URL}/auth/me", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if "username" in data and "role" in data:
                        self.log_result("Protected Endpoint - /auth/me", True, 
                                      f"Successfully accessed profile for {data.get('username')}")
                    else:
                        self.log_result("Protected Endpoint - /auth/me", False, 
                                      "Missing user data in profile response", data)
                else:
                    self.log_result("Protected Endpoint - /auth/me", False, 
                                  f"/auth/me failed with status {response.status_code}")
            
            # Test /auth/me without token
            response = self.session.get(f"{BACKEND_URL}/auth/me")
            if response.status_code == 401:
                self.log_result("Protected Endpoint - No Auth", True, 
                              "Properly requires authentication for /auth/me")
            else:
                self.log_result("Protected Endpoint - No Auth", False, 
                              f"Should return 401 without auth, got {response.status_code}")
            
            # Test other endpoints that should be protected
            protected_endpoints = [
                "/calls",
                "/contacts", 
                "/analytics/summary",
                "/ai/realtime-analysis"
            ]
            
            protected_count = 0
            for endpoint in protected_endpoints:
                # Test without auth
                response = self.session.get(f"{BACKEND_URL}{endpoint}")
                if response.status_code == 401:
                    protected_count += 1
                    self.log_result(f"Protected - {endpoint}", True, 
                                  f"Endpoint {endpoint} properly requires authentication")
                else:
                    self.log_result(f"Protected - {endpoint}", False, 
                                  f"Endpoint {endpoint} should require auth, got {response.status_code}")
            
            return protected_count >= len(protected_endpoints) // 2  # At least half should be protected
            
        except Exception as e:
            self.log_result("Protected Endpoints", False, f"Protected endpoints test failed: {str(e)}")
            return False
    
    def test_profile_update(self):
        """Test user profile update functionality"""
        try:
            if not self.auth_tokens:
                self.log_result("Profile Update", False, "No auth tokens available for testing")
                return False
            
            demo_token = self.auth_tokens.get("demo")
            if demo_token:
                headers = {"Authorization": f"Bearer {demo_token}"}
                
                # Test profile update
                update_data = {
                    "full_name": "משתמש דמו מעודכן",
                    "phone": "+972-50-999-7777",
                    "preferences": {
                        "language": "he",
                        "theme": "dark",
                        "notifications": False
                    }
                }
                
                response = self.session.put(
                    f"{BACKEND_URL}/auth/profile", 
                    json=update_data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if (data.get("full_name") == update_data["full_name"] and 
                        data.get("phone") == update_data["phone"]):
                        self.log_result("Profile Update", True, 
                                      "Successfully updated user profile")
                        return True
                    else:
                        self.log_result("Profile Update", False, 
                                      "Profile data not updated correctly", data)
                        return False
                else:
                    self.log_result("Profile Update", False, 
                                  f"Profile update failed with status {response.status_code}", response.text)
                    return False
            else:
                self.log_result("Profile Update", False, "No demo token available for profile update test")
                return False
                
        except Exception as e:
            self.log_result("Profile Update", False, f"Profile update test failed: {str(e)}")
            return False
    
    def test_demo_data_creation(self):
        """Test demo data creation endpoint"""
        try:
            response = self.session.post(f"{BACKEND_URL}/setup/demo-data")
            
            if response.status_code == 200:
                data = response.json()
                if "users_created" in data and "demo_data" in data:
                    users_count = len(data.get("users_created", []))
                    demo_data = data.get("demo_data", {})
                    
                    self.log_result("Demo Data Creation", True, 
                                  f"Created {users_count} users and demo data: "
                                  f"leads={demo_data.get('leads', 0)}, "
                                  f"deals={demo_data.get('deals', 0)}, "
                                  f"tasks={demo_data.get('tasks', 0)}")
                    return True
                else:
                    self.log_result("Demo Data Creation", False, 
                                  "Missing expected fields in demo data response", data)
                    return False
            else:
                self.log_result("Demo Data Creation", False, 
                              f"Demo data creation failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Demo Data Creation", False, f"Demo data creation test failed: {str(e)}")
            return False
    
    def test_password_change(self):
        """Test password change functionality"""
        try:
            if not self.auth_tokens:
                self.log_result("Password Change", False, "No auth tokens available for testing")
                return False
            
            demo_token = self.auth_tokens.get("demo")
            if demo_token:
                headers = {"Authorization": f"Bearer {demo_token}"}
                
                # Test password change
                password_data = {
                    "current_password": "demo123",
                    "new_password": "newdemo123"
                }
                
                response = self.session.post(
                    f"{BACKEND_URL}/auth/change-password",
                    json=password_data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "message" in data:
                        self.log_result("Password Change", True, "Successfully changed password")
                        
                        # Test login with new password
                        login_data = {
                            "username": "demo",
                            "password": "newdemo123"
                        }
                        
                        login_response = self.session.post(
                            f"{BACKEND_URL}/auth/login",
                            data=login_data,
                            headers={"Content-Type": "application/x-www-form-urlencoded"}
                        )
                        
                        if login_response.status_code == 200:
                            self.log_result("Password Change - Login Test", True, 
                                          "Can login with new password")
                        else:
                            self.log_result("Password Change - Login Test", False, 
                                          "Cannot login with new password")
                        
                        return True
                    else:
                        self.log_result("Password Change", False, 
                                      "Missing success message in password change response", data)
                        return False
                else:
                    self.log_result("Password Change", False, 
                                  f"Password change failed with status {response.status_code}", response.text)
                    return False
            else:
                self.log_result("Password Change", False, "No demo token available for password change test")
                return False
                
        except Exception as e:
            self.log_result("Password Change", False, f"Password change test failed: {str(e)}")
            return False
    def test_health_check(self):
        """Test the health check endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/health")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Health Check", True, "Backend is healthy and running")
                    return True
                else:
                    self.log_result("Health Check", False, f"Backend reports unhealthy status: {data.get('status')}", data)
                    return False
            else:
                self.log_result("Health Check", False, f"Health check failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Health Check", False, f"Health check request failed: {str(e)}")
            return False
    
    def test_checkcall_integration(self):
        """Test Checkcall integration endpoint"""
        try:
            # Test basic endpoint access
            response = self.session.get(f"{BACKEND_URL}/integrations/checkcall/calls")
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and "data" in data:
                    self.log_result("Checkcall Integration", True, 
                                  f"Successfully connected to Checkcall API, retrieved {data.get('count', 0)} calls")
                    return True
                else:
                    self.log_result("Checkcall Integration", False, 
                                  "Unexpected response format from Checkcall endpoint", data)
                    return False
            else:
                self.log_result("Checkcall Integration", False, 
                              f"Checkcall endpoint failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Checkcall Integration", False, 
                          f"Checkcall integration request failed: {str(e)}")
            return False
    
    def test_checkcall_with_date_params(self):
        """Test Checkcall integration with date parameters"""
        try:
            # Test with date range
            from_date = (datetime.now() - timedelta(days=7)).strftime('%d-%m-%Y')
            to_date = datetime.now().strftime('%d-%m-%Y')
            
            params = {
                'from_date': from_date,
                'to_date': to_date
            }
            
            response = self.session.get(f"{BACKEND_URL}/integrations/checkcall/calls", params=params)
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Checkcall Date Range", True, 
                              f"Successfully retrieved calls for date range {from_date} to {to_date}")
                return True
            else:
                self.log_result("Checkcall Date Range", False, 
                              f"Date range query failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Checkcall Date Range", False, 
                          f"Date range query failed: {str(e)}")
            return False
    
    def test_masterpbx_calllog(self):
        """Test MasterPBX call log endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/integrations/masterpbx/calllog")
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and "data" in data:
                    self.log_result("MasterPBX Call Log", True, 
                                  f"Successfully connected to MasterPBX API, retrieved {data.get('count', 0)} call logs")
                    return True
                else:
                    self.log_result("MasterPBX Call Log", False, 
                                  "Unexpected response format from MasterPBX calllog endpoint", data)
                    return False
            else:
                self.log_result("MasterPBX Call Log", False, 
                              f"MasterPBX calllog failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("MasterPBX Call Log", False, 
                          f"MasterPBX calllog request failed: {str(e)}")
            return False
    
    def test_masterpbx_active_calls(self):
        """Test MasterPBX active calls endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/integrations/masterpbx/active-calls")
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and "data" in data:
                    self.log_result("MasterPBX Active Calls", True, 
                                  f"Successfully retrieved {data.get('count', 0)} active calls from MasterPBX")
                    return True
                else:
                    self.log_result("MasterPBX Active Calls", False, 
                                  "Unexpected response format from MasterPBX active calls endpoint", data)
                    return False
            else:
                self.log_result("MasterPBX Active Calls", False, 
                              f"MasterPBX active calls failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("MasterPBX Active Calls", False, 
                          f"MasterPBX active calls request failed: {str(e)}")
            return False
    
    def test_webhook_endpoint(self):
        """Test the Checkcall webhook endpoint"""
        try:
            # Test webhook with sample data
            webhook_data = {
                "event": "call_started",
                "call_data": {
                    "caller_name": "Test Caller",
                    "caller_id": "+972-50-123-4567",
                    "timestamp": datetime.now().isoformat()
                }
            }
            
            response = self.session.post(
                f"{BACKEND_URL}/webhook/checkcall",
                json=webhook_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "processed":
                    self.log_result("Webhook Endpoint", True, 
                                  f"Webhook processed successfully, event: {data.get('event')}")
                    return True
                else:
                    self.log_result("Webhook Endpoint", False, 
                                  "Webhook processing failed", data)
                    return False
            else:
                self.log_result("Webhook Endpoint", False, 
                              f"Webhook failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Webhook Endpoint", False, 
                          f"Webhook request failed: {str(e)}")
            return False
    
    def test_webhook_call_ended(self):
        """Test webhook with call_ended event"""
        try:
            webhook_data = {
                "event": "call_ended",
                "call_id": "test_call_123",
                "transcription": "Test transcription content",
                "sentiment": "positive"
            }
            
            response = self.session.post(
                f"{BACKEND_URL}/webhook/checkcall",
                json=webhook_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Webhook Call Ended", True, 
                              f"Call ended webhook processed: {data.get('event')}")
                return True
            else:
                self.log_result("Webhook Call Ended", False, 
                              f"Call ended webhook failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Webhook Call Ended", False, 
                          f"Call ended webhook failed: {str(e)}")
            return False
    
    def test_realtime_analytics(self):
        """Test the real-time analytics endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/analytics/realtime")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_calls_today", "active_calls", "checkcall_data", "masterpbx_data", "timestamp"]
                
                missing_fields = [field for field in required_fields if field not in data]
                if not missing_fields:
                    self.log_result("Real-time Analytics", True, 
                                  f"Analytics endpoint working, active calls: {data.get('active_calls', 0)}")
                    return True
                else:
                    self.log_result("Real-time Analytics", False, 
                                  f"Missing required fields in analytics response: {missing_fields}", data)
                    return False
            else:
                self.log_result("Real-time Analytics", False, 
                              f"Analytics endpoint failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Real-time Analytics", False, 
                          f"Analytics request failed: {str(e)}")
            return False
    
    def test_basic_api_endpoints(self):
        """Test basic API endpoints for functionality"""
        try:
            # Test root endpoint
            response = self.session.get(f"{BACKEND_URL}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "version" in data:
                    self.log_result("Basic API Root", True, "API root endpoint working")
                else:
                    self.log_result("Basic API Root", False, "API root missing expected fields", data)
            else:
                self.log_result("Basic API Root", False, f"API root failed with status {response.status_code}")
            
            # Test calls endpoint
            response = self.session.get(f"{BACKEND_URL}/calls")
            if response.status_code == 200:
                self.log_result("Calls Endpoint", True, "Calls endpoint accessible")
            else:
                self.log_result("Calls Endpoint", False, f"Calls endpoint failed with status {response.status_code}")
            
            # Test contacts endpoint
            response = self.session.get(f"{BACKEND_URL}/contacts")
            if response.status_code == 200:
                self.log_result("Contacts Endpoint", True, "Contacts endpoint accessible")
            else:
                self.log_result("Contacts Endpoint", False, f"Contacts endpoint failed with status {response.status_code}")
                
        except Exception as e:
            self.log_result("Basic API Endpoints", False, f"Basic API test failed: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid endpoint
            response = self.session.get(f"{BACKEND_URL}/invalid-endpoint")
            if response.status_code == 404:
                self.log_result("Error Handling - 404", True, "Properly returns 404 for invalid endpoints")
            else:
                self.log_result("Error Handling - 404", False, f"Expected 404, got {response.status_code}")
            
            # Test invalid webhook data
            response = self.session.post(f"{BACKEND_URL}/webhook/checkcall", json={"invalid": "data"})
            if response.status_code in [200, 400, 422]:  # Accept various valid error responses
                self.log_result("Error Handling - Invalid Data", True, "Handles invalid webhook data appropriately")
            else:
                self.log_result("Error Handling - Invalid Data", False, f"Unexpected status for invalid data: {response.status_code}")
                
        except Exception as e:
            self.log_result("Error Handling", False, f"Error handling test failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all tests"""
        print("=" * 80)
        print("BACKEND API COMPREHENSIVE TESTS")
        print("Authentication System + API Integrations")
        print("=" * 80)
        print(f"Testing backend at: {BACKEND_URL}")
        print(f"Test started at: {datetime.now().isoformat()}")
        print()
        
        # Run tests in order of importance
        # Authentication tests first (high priority)
        auth_tests = [
            ("AUTHENTICATION SYSTEM TESTS", [
                self.test_demo_data_creation,
                self.test_user_registration,
                self.test_user_login,
                self.test_jwt_token_validation,
                self.test_protected_endpoints,
                self.test_profile_update,
                self.test_password_change
            ]),
            ("API INTEGRATION TESTS", [
                self.test_health_check,
                self.test_basic_api_endpoints,
                self.test_checkcall_integration,
                self.test_checkcall_with_date_params,
                self.test_masterpbx_calllog,
                self.test_masterpbx_active_calls,
                self.test_webhook_endpoint,
                self.test_webhook_call_ended,
                self.test_realtime_analytics,
                self.test_error_handling
            ])
        ]
        
        for section_name, tests in auth_tests:
            print(f"\n{'='*20} {section_name} {'='*20}")
            for test in tests:
                try:
                    test()
                except Exception as e:
                    self.log_result(test.__name__, False, f"Test execution failed: {str(e)}")
                print()  # Add spacing between tests
        
        # Summary
        print("=" * 80)
        print("COMPREHENSIVE TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for r in self.results if r["success"])
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Categorize results
        auth_results = [r for r in self.results if any(keyword in r["test"].lower() 
                       for keyword in ["auth", "login", "register", "jwt", "protected", "profile", "password", "demo"])]
        api_results = [r for r in self.results if r not in auth_results]
        
        print(f"\nAuthentication Tests: {len(auth_results)} total")
        auth_passed = sum(1 for r in auth_results if r["success"])
        print(f"  Passed: {auth_passed}, Failed: {len(auth_results) - auth_passed}")
        
        print(f"\nAPI Integration Tests: {len(api_results)} total")
        api_passed = sum(1 for r in api_results if r["success"])
        print(f"  Passed: {api_passed}, Failed: {len(api_results) - api_passed}")
        
        print("\n" + "="*40)
        print("FAILED TESTS:")
        print("="*40)
        failed_tests = [r for r in self.results if not r["success"]]
        if failed_tests:
            for result in failed_tests:
                print(f"  ❌ {result['test']}: {result['message']}")
        else:
            print("  🎉 No failed tests!")
        
        print("\n" + "="*40)
        print("PASSED TESTS:")
        print("="*40)
        for result in self.results:
            if result["success"]:
                print(f"  ✅ {result['test']}: {result['message']}")
        
        return self.results

if __name__ == "__main__":
    tester = APITester()
    results = tester.run_all_tests()
    
    # Exit with error code if any tests failed
    failed_tests = [r for r in results if not r["success"]]
    if failed_tests:
        sys.exit(1)
    else:
        sys.exit(0)