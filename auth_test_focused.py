#!/usr/bin/env python3
"""
Focused Authentication System Tests
"""

import requests
import json
import sys
from datetime import datetime
import time

# Backend URL from frontend/.env
BACKEND_URL = "https://85599114-0b34-4acc-a752-adb95ae9b552.preview.emergentagent.com/api"

# Demo user credentials for authentication testing
DEMO_USERS = {
    "admin": {"username": "admin", "password": "admin123", "role": "admin"},
    "manager": {"username": "manager", "password": "manager123", "role": "manager"},
    "demo": {"username": "demo", "password": "demo123", "role": "user"}
}

class AuthTester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.timeout = 15
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
            
            return login_success_count >= 2  # At least 2 demo users should work
            
        except Exception as e:
            self.log_result("User Login", False, f"Login test failed: {str(e)}")
            return False
    
    def test_protected_endpoints(self):
        """Test protected endpoints require authentication"""
        try:
            if not self.auth_tokens:
                self.log_result("Protected Endpoints", False, "No auth tokens available for testing")
                return False
            
            # Test /auth/me endpoint with valid token
            admin_token = self.auth_tokens.get("admin") or list(self.auth_tokens.values())[0]
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
            
            return True
            
        except Exception as e:
            self.log_result("Protected Endpoints", False, f"Protected endpoints test failed: {str(e)}")
            return False
    
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
                    self.log_result("User Registration", True, 
                                  f"Successfully registered user: {test_user['username']}")
                    return True
                else:
                    self.log_result("User Registration", False, 
                                  "Missing required fields in registration response", data)
                    return False
            else:
                self.log_result("User Registration", False, 
                              f"Registration failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("User Registration", False, f"Registration test failed: {str(e)}")
            return False
    
    def run_auth_tests(self):
        """Run focused authentication tests"""
        print("=" * 60)
        print("FOCUSED AUTHENTICATION SYSTEM TESTS")
        print("=" * 60)
        print(f"Testing backend at: {BACKEND_URL}")
        print(f"Test started at: {datetime.now().isoformat()}")
        print()
        
        # Run tests in order
        tests = [
            self.test_health_check,
            self.test_demo_data_creation,
            self.test_user_login,
            self.test_protected_endpoints,
            self.test_user_registration
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.log_result(test.__name__, False, f"Test execution failed: {str(e)}")
            print()  # Add spacing between tests
        
        # Summary
        print("=" * 60)
        print("AUTHENTICATION TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        print("\nFailed Tests:")
        failed_tests = [r for r in self.results if not r["success"]]
        if failed_tests:
            for result in failed_tests:
                print(f"  ❌ {result['test']}: {result['message']}")
        else:
            print("  🎉 No failed tests!")
        
        print("\nPassed Tests:")
        for result in self.results:
            if result["success"]:
                print(f"  ✅ {result['test']}: {result['message']}")
        
        return self.results

if __name__ == "__main__":
    tester = AuthTester()
    results = tester.run_auth_tests()
    
    # Exit with error code if any tests failed
    failed_tests = [r for r in results if not r["success"]]
    if failed_tests:
        sys.exit(1)
    else:
        sys.exit(0)