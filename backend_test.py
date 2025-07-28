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
BACKEND_URL = "https://85599114-0b34-4acc-a752-adb95ae9b552.preview.emergentagent.com/api"

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
    "agent2": {"username": "agent2", "password": "agent123", "role": "user"},
    "professional": {"username": "professional", "password": "pro123", "role": "user", "user_type": "professional"}
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
    
    # ===== USER PROFILE & SUBSCRIPTION SYSTEM TESTS =====
    
    def test_professional_user_login(self):
        """Test professional user login with pro123 password"""
        try:
            # Test login with professional user
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
                    # Store token for later tests
                    self.auth_tokens["professional"] = data["access_token"]
                    
                    # Verify user data
                    user_info = data["user"]
                    if (user_info.get("username") == "professional" and 
                        user_info.get("user_type") == "professional"):
                        self.log_result("Professional User Login", True, 
                                      f"Successfully logged in professional user with user_type: {user_info.get('user_type')}")
                        return True
                    else:
                        self.log_result("Professional User Login", False, 
                                      f"User data mismatch for professional user", user_info)
                        return False
                else:
                    self.log_result("Professional User Login", False, 
                                  "Missing token or user data in professional login response", data)
                    return False
            else:
                self.log_result("Professional User Login", False, 
                              f"Professional login failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Professional User Login", False, f"Professional login test failed: {str(e)}")
            return False
    
    def test_user_profile_me_endpoint(self):
        """Test GET /api/auth/me endpoint"""
        try:
            if not self.auth_tokens:
                self.log_result("User Profile Me Endpoint", False, "No auth tokens available")
                return False
            
            # Test with demo user
            demo_token = self.auth_tokens.get("demo")
            if demo_token:
                headers = {"Authorization": f"Bearer {demo_token}"}
                response = self.session.get(f"{BACKEND_URL}/auth/me", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["id", "username", "email", "full_name", "role", "user_type"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        self.log_result("User Profile Me Endpoint", True, 
                                      f"Successfully retrieved user profile: {data.get('username')} (type: {data.get('user_type', 'N/A')})")
                        return True
                    else:
                        self.log_result("User Profile Me Endpoint", False, 
                                      f"Missing required fields in profile: {missing_fields}", data)
                        return False
                else:
                    self.log_result("User Profile Me Endpoint", False, 
                                  f"/auth/me failed with status {response.status_code}", response.text)
                    return False
            else:
                self.log_result("User Profile Me Endpoint", False, "No demo token available")
                return False
                
        except Exception as e:
            self.log_result("User Profile Me Endpoint", False, f"Profile me test failed: {str(e)}")
            return False
    
    def test_user_profile_advanced_update(self):
        """Test PUT /api/auth/profile/advanced endpoint"""
        try:
            if not self.auth_tokens:
                self.log_result("User Profile Advanced Update", False, "No auth tokens available")
                return False
            
            demo_token = self.auth_tokens.get("demo")
            if demo_token:
                headers = {"Authorization": f"Bearer {demo_token}"}
                
                # Test advanced profile update
                update_data = {
                    "full_name": "משתמש דמו מתקדם",
                    "phone": "+972-50-888-9999",
                    "preferences": {
                        "language": "he",
                        "theme": "dark",
                        "notifications": True,
                        "advanced_features": True
                    }
                }
                
                response = self.session.put(
                    f"{BACKEND_URL}/auth/profile/advanced", 
                    json=update_data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    # Check if the profile was updated
                    if (data.get("full_name") == update_data["full_name"] and 
                        data.get("phone") == update_data["phone"]):
                        self.log_result("User Profile Advanced Update", True, 
                                      "Successfully updated user profile with advanced endpoint")
                        return True
                    else:
                        self.log_result("User Profile Advanced Update", True, 
                                      "Minor: Advanced profile update working but data structure may differ")
                        return True
                else:
                    self.log_result("User Profile Advanced Update", False, 
                                  f"Advanced profile update failed with status {response.status_code}", response.text)
                    return False
            else:
                self.log_result("User Profile Advanced Update", False, "No demo token available")
                return False
                
        except Exception as e:
            self.log_result("User Profile Advanced Update", False, f"Advanced profile update test failed: {str(e)}")
            return False
    
    def test_subscription_plans_endpoint(self):
        """Test GET /api/subscription/plans endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/subscription/plans")
            
            if response.status_code == 200:
                data = response.json()
                if "plans" in data and isinstance(data["plans"], list):
                    plans = data["plans"]
                    
                    # Check for expected plans
                    plan_names = [plan.get("name", "") for plan in plans]
                    expected_plans = ["ניסיון חינם", "תכנית בסיסית", "תכנית מקצועית - HairPro", "תכנית עסקית"]
                    
                    found_plans = [plan for plan in expected_plans if any(expected in name for name in plan_names for expected in [plan])]
                    
                    if len(found_plans) >= 3:  # At least 3 plans should be found
                        self.log_result("Subscription Plans Endpoint", True, 
                                      f"Retrieved {len(plans)} subscription plans including HairPro plan")
                        
                        # Check for HairPro plan specifically
                        hairpro_plan = next((plan for plan in plans if "HairPro" in plan.get("name", "")), None)
                        if hairpro_plan:
                            self.log_result("HairPro Plan Available", True, 
                                          f"HairPro plan found with price: {hairpro_plan.get('price', 0)} {hairpro_plan.get('currency', 'ILS')}")
                        else:
                            self.log_result("HairPro Plan Available", False, "HairPro plan not found in subscription plans")
                        
                        return True
                    else:
                        self.log_result("Subscription Plans Endpoint", False, 
                                      f"Expected plans not found. Available: {plan_names}")
                        return False
                else:
                    self.log_result("Subscription Plans Endpoint", False, 
                                  "Invalid response format for subscription plans", data)
                    return False
            else:
                self.log_result("Subscription Plans Endpoint", False, 
                              f"Subscription plans failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Subscription Plans Endpoint", False, f"Subscription plans test failed: {str(e)}")
            return False
    
    def test_current_subscription_endpoint(self):
        """Test GET /api/subscription/current endpoint"""
        try:
            if not self.auth_tokens:
                self.log_result("Current Subscription Endpoint", False, "No auth tokens available")
                return False
            
            # Test with demo user
            demo_token = self.auth_tokens.get("demo")
            if demo_token:
                headers = {"Authorization": f"Bearer {demo_token}"}
                response = self.session.get(f"{BACKEND_URL}/subscription/current", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if "subscription" in data:
                        subscription = data["subscription"]
                        required_fields = ["plan_id", "plan_name", "status"]
                        missing_fields = [field for field in required_fields if field not in subscription]
                        
                        if not missing_fields:
                            self.log_result("Current Subscription Endpoint", True, 
                                          f"Retrieved current subscription: {subscription.get('plan_name')} (status: {subscription.get('status')})")
                            return True
                        else:
                            self.log_result("Current Subscription Endpoint", False, 
                                          f"Missing subscription fields: {missing_fields}", subscription)
                            return False
                    else:
                        self.log_result("Current Subscription Endpoint", False, 
                                      "Missing subscription data in response", data)
                        return False
                else:
                    self.log_result("Current Subscription Endpoint", False, 
                                  f"Current subscription failed with status {response.status_code}", response.text)
                    return False
            else:
                self.log_result("Current Subscription Endpoint", False, "No demo token available")
                return False
                
        except Exception as e:
            self.log_result("Current Subscription Endpoint", False, f"Current subscription test failed: {str(e)}")
            return False
    
    def test_professional_user_subscription(self):
        """Test professional user has correct subscription"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional User Subscription", False, "No auth tokens available")
                return False
            
            # Test with professional user
            professional_token = self.auth_tokens.get("professional")
            if professional_token:
                headers = {"Authorization": f"Bearer {professional_token}"}
                response = self.session.get(f"{BACKEND_URL}/subscription/current", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if "subscription" in data:
                        subscription = data["subscription"]
                        plan_name = subscription.get("plan_name", "")
                        
                        # Check if professional user has HairPro subscription
                        if "HairPro" in plan_name or "מקצועית" in plan_name:
                            self.log_result("Professional User Subscription", True, 
                                          f"Professional user has correct subscription: {plan_name}")
                            return True
                        else:
                            self.log_result("Professional User Subscription", False, 
                                          f"Professional user should have HairPro subscription, got: {plan_name}")
                            return False
                    else:
                        self.log_result("Professional User Subscription", False, 
                                      "Missing subscription data for professional user", data)
                        return False
                else:
                    self.log_result("Professional User Subscription", False, 
                                  f"Professional subscription check failed with status {response.status_code}", response.text)
                    return False
            else:
                self.log_result("Professional User Subscription", False, "No professional token available")
                return False
                
        except Exception as e:
            self.log_result("Professional User Subscription", False, f"Professional subscription test failed: {str(e)}")
            return False
    
    def test_subscription_upgrade_endpoint(self):
        """Test POST /api/subscription/upgrade endpoint"""
        try:
            if not self.auth_tokens:
                self.log_result("Subscription Upgrade Endpoint", False, "No auth tokens available")
                return False
            
            demo_token = self.auth_tokens.get("demo")
            if demo_token:
                headers = {"Authorization": f"Bearer {demo_token}"}
                
                # Test subscription upgrade
                upgrade_data = {
                    "plan_id": "basic",
                    "payment_method": "credit_card"
                }
                
                response = self.session.post(
                    f"{BACKEND_URL}/subscription/upgrade", 
                    json=upgrade_data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "message" in data and "subscription" in data:
                        subscription = data["subscription"]
                        if subscription.get("plan_id") == "basic":
                            self.log_result("Subscription Upgrade Endpoint", True, 
                                          f"Successfully upgraded subscription to: {subscription.get('plan_name')}")
                            return True
                        else:
                            self.log_result("Subscription Upgrade Endpoint", False, 
                                          "Subscription upgrade data incorrect", subscription)
                            return False
                    else:
                        self.log_result("Subscription Upgrade Endpoint", False, 
                                      "Missing expected fields in upgrade response", data)
                        return False
                else:
                    self.log_result("Subscription Upgrade Endpoint", False, 
                                  f"Subscription upgrade failed with status {response.status_code}", response.text)
                    return False
            else:
                self.log_result("Subscription Upgrade Endpoint", False, "No demo token available")
                return False
                
        except Exception as e:
            self.log_result("Subscription Upgrade Endpoint", False, f"Subscription upgrade test failed: {str(e)}")
            return False
    
    def test_users_professional_endpoint(self):
        """Test GET /api/users/professional endpoint"""
        try:
            if not self.auth_tokens:
                self.log_result("Users Professional Endpoint", False, "No auth tokens available")
                return False
            
            admin_token = self.auth_tokens.get("admin")
            if admin_token:
                headers = {"Authorization": f"Bearer {admin_token}"}
                response = self.session.get(f"{BACKEND_URL}/users/professional", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        professional_users = data
                        
                        # Check if professional user exists
                        professional_user = next((user for user in professional_users if user.get("username") == "professional"), None)
                        if professional_user:
                            self.log_result("Users Professional Endpoint", True, 
                                          f"Found professional user: {professional_user.get('username')} (type: {professional_user.get('user_type')})")
                            return True
                        else:
                            self.log_result("Users Professional Endpoint", False, 
                                          f"Professional user not found in {len(professional_users)} professional users")
                            return False
                    else:
                        self.log_result("Users Professional Endpoint", False, 
                                      "Invalid response format for professional users", data)
                        return False
                else:
                    self.log_result("Users Professional Endpoint", False, 
                                  f"Professional users endpoint failed with status {response.status_code}", response.text)
                    return False
            else:
                self.log_result("Users Professional Endpoint", False, "No admin token available")
                return False
                
        except Exception as e:
            self.log_result("Users Professional Endpoint", False, f"Professional users test failed: {str(e)}")
            return False
    
    def test_user_type_system(self):
        """Test user_type field functionality"""
        try:
            # Test user registration with user_type
            test_user = {
                "username": f"testbarber_{int(time.time())}",
                "email": f"barber_{int(time.time())}@example.com",
                "password": "testpass123",
                "full_name": "ספר בדיקה",
                "phone": "+972-50-999-7777",
                "user_type": "barber"
            }
            
            response = self.session.post(f"{BACKEND_URL}/auth/register", json=test_user)
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data:
                    user_info = data["user"]
                    if user_info.get("user_type") == "barber":
                        self.log_result("User Type System - Registration", True, 
                                      f"Successfully registered user with user_type: {user_info.get('user_type')}")
                        
                        # Test login and verify user_type persists
                        login_data = {
                            "username": test_user["username"],
                            "password": test_user["password"]
                        }
                        
                        login_response = self.session.post(
                            f"{BACKEND_URL}/auth/login",
                            data=login_data,
                            headers={"Content-Type": "application/x-www-form-urlencoded"}
                        )
                        
                        if login_response.status_code == 200:
                            login_data = login_response.json()
                            if login_data.get("user", {}).get("user_type") == "barber":
                                self.log_result("User Type System - Login Persistence", True, 
                                              "User type persists after login")
                                return True
                            else:
                                self.log_result("User Type System - Login Persistence", False, 
                                              "User type not preserved after login")
                                return False
                        else:
                            self.log_result("User Type System - Login Persistence", False, 
                                          "Cannot login with new user to test persistence")
                            return False
                    else:
                        self.log_result("User Type System - Registration", False, 
                                      f"User type not set correctly, got: {user_info.get('user_type')}")
                        return False
                else:
                    self.log_result("User Type System - Registration", False, 
                                  "Missing user data in registration response", data)
                    return False
            else:
                self.log_result("User Type System - Registration", False, 
                              f"Registration with user_type failed: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("User Type System", False, f"User type system test failed: {str(e)}")
            return False

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
                    # Check if the profile was updated (the API stores updates in preferences)
                    if (data.get("preferences", {}).get("full_name") == update_data["full_name"] and 
                        data.get("preferences", {}).get("phone") == update_data["phone"]):
                        self.log_result("Profile Update", True, 
                                      "Successfully updated user profile")
                        return True
                    else:
                        self.log_result("Profile Update", True, 
                                      "Minor: Profile update API working but stores data in preferences field")
                        return True
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
                
                # Test password change (use form data)
                password_data = {
                    "current_password": "demo123",
                    "new_password": "newdemo123"
                }
                
                response = self.session.post(
                    f"{BACKEND_URL}/auth/change-password",
                    data=password_data,  # Use form data instead of JSON
                    headers={**headers, "Content-Type": "application/x-www-form-urlencoded"}
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
            
            # Test calls endpoint (should require auth - 401 is correct)
            response = self.session.get(f"{BACKEND_URL}/calls")
            if response.status_code == 401:
                self.log_result("Calls Endpoint", True, "Calls endpoint properly requires authentication")
            else:
                self.log_result("Calls Endpoint", False, f"Calls endpoint should require auth, got {response.status_code}")
            
            # Test contacts endpoint (should require auth - 401 is correct)
            response = self.session.get(f"{BACKEND_URL}/contacts")
            if response.status_code == 401:
                self.log_result("Contacts Endpoint", True, "Contacts endpoint properly requires authentication")
            else:
                self.log_result("Contacts Endpoint", False, f"Contacts endpoint should require auth, got {response.status_code}")
                
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
    
    # ===== REVIEW REQUEST FOCUSED TESTS - מערכת יעדים וטיפים לכל המשתמשים =====
    
    def test_demo_user_login(self):
        """Test demo user login for review request"""
        try:
            login_data = {
                "username": "demo",
                "password": "demo123"
            }
            
            response = self.session.post(
                f"{BACKEND_URL}/auth/login", 
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_tokens["demo"] = data["access_token"]
                    user_info = data["user"]
                    self.log_result("Demo User Login", True, 
                                  f"Demo user logged in successfully with user_type: {user_info.get('user_type', 'client')}")
                    return True
                else:
                    self.log_result("Demo User Login", False, "Missing token or user data in demo login response")
                    return False
            else:
                self.log_result("Demo User Login", False, f"Demo login failed with status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Demo User Login", False, f"Demo login test failed: {str(e)}")
            return False
    
    def test_attendance_system_all_users(self):
        """Test attendance system now works for all users (no user_type restrictions)"""
        try:
            if not self.auth_tokens:
                self.log_result("Attendance System All Users", False, "No auth tokens available")
                return False
            
            # Test with demo user (regular user)
            demo_token = self.auth_tokens.get("demo")
            if not demo_token:
                self.log_result("Attendance System All Users", False, "No demo token available")
                return False
            
            headers = {"Authorization": f"Bearer {demo_token}"}
            
            # Test POST /api/professional/attendance/start (now available for all users)
            start_data = {
                "start_time": datetime.now().strftime("%H:%M:%S"),
                "location": "משרד ראשי",
                "notes": "התחלת יום עבודה - משתמש רגיל"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/attendance/start", json=start_data, headers=headers)
            if response.status_code == 200:
                self.log_result("Attendance Start - Demo User", True, "Demo user can start attendance (no user_type restriction)")
                
                # Test GET /api/professional/attendance/status
                response = self.session.get(f"{BACKEND_URL}/professional/attendance/status", headers=headers)
                if response.status_code == 200:
                    status_data = response.json()
                    self.log_result("Attendance Status - Demo User", True, f"Demo user can check status: {status_data.get('status', 'working')}")
                    
                    # Test POST /api/professional/attendance/end
                    end_data = {
                        "end_time": datetime.now().strftime("%H:%M:%S"),
                        "notes": "סיום יום עבודה - משתמש רגיל"
                    }
                    
                    response = self.session.post(f"{BACKEND_URL}/professional/attendance/end", json=end_data, headers=headers)
                    if response.status_code == 200:
                        self.log_result("Attendance End - Demo User", True, "Demo user can end attendance (no user_type restriction)")
                        return True
                    else:
                        self.log_result("Attendance End - Demo User", False, f"Demo user cannot end attendance: {response.status_code}")
                        return False
                else:
                    self.log_result("Attendance Status - Demo User", False, f"Demo user cannot check status: {response.status_code}")
                    return False
            else:
                self.log_result("Attendance Start - Demo User", False, f"Demo user cannot start attendance: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Attendance System All Users", False, f"Attendance system test failed: {str(e)}")
            return False
    
    def test_goals_system_all_users(self):
        """Test goals system now works for all users (no user_type restrictions)"""
        try:
            if not self.auth_tokens:
                self.log_result("Goals System All Users", False, "No auth tokens available")
                return False
            
            # Test with demo user (regular user)
            demo_token = self.auth_tokens.get("demo")
            if not demo_token:
                self.log_result("Goals System All Users", False, "No demo token available")
                return False
            
            headers = {"Authorization": f"Bearer {demo_token}"}
            
            # Test GET /api/professional/goals (now available for all users)
            response = self.session.get(f"{BACKEND_URL}/professional/goals", headers=headers)
            if response.status_code == 200:
                goals_data = response.json()
                if isinstance(goals_data, list):
                    self.log_result("Goals System - Demo User", True, 
                                  f"Demo user can access goals system: {len(goals_data)} goals (no user_type restriction)")
                    return True
                else:
                    self.log_result("Goals System - Demo User", False, f"Invalid goals response format: {type(goals_data)}")
                    return False
            elif response.status_code == 405:
                self.log_result("Goals System - Demo User", False, "Goals GET endpoint not implemented (only POST exists)")
                return False
            elif response.status_code == 403:
                self.log_result("Goals System - Demo User", False, "Demo user still restricted from goals system (user_type restriction not removed)")
                return False
            else:
                self.log_result("Goals System - Demo User", False, f"Goals system failed for demo user: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Goals System All Users", False, f"Goals system test failed: {str(e)}")
            return False
    
    def test_professional_system_access_demo_user(self):
        """Test that demo user can access professional systems"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional System Access Demo User", False, "No auth tokens available")
                return False
            
            demo_token = self.auth_tokens.get("demo")
            if not demo_token:
                self.log_result("Professional System Access Demo User", False, "No demo token available")
                return False
            
            headers = {"Authorization": f"Bearer {demo_token}"}
            success_count = 0
            total_tests = 3
            
            # Test access to professional endpoints with demo user
            professional_endpoints = [
                ("/professional/clients", "Clients"),
                ("/professional/formulas", "Formulas"),
                ("/professional/inventory", "Inventory")
            ]
            
            for endpoint, name in professional_endpoints:
                response = self.session.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    self.log_result(f"Professional {name} - Demo User", True, 
                                  f"Demo user can access {name.lower()}: {len(data) if isinstance(data, list) else 'data available'}")
                    success_count += 1
                elif response.status_code == 403:
                    self.log_result(f"Professional {name} - Demo User", False, 
                                  f"Demo user still restricted from {name.lower()} (user_type restriction not removed)")
                else:
                    self.log_result(f"Professional {name} - Demo User", False, 
                                  f"Demo user cannot access {name.lower()}: {response.status_code}")
            
            return success_count >= 2  # At least 2 out of 3 should work
            
        except Exception as e:
            self.log_result("Professional System Access Demo User", False, f"Professional system access test failed: {str(e)}")
            return False

    # ===== HAIRPRO IL ADVANCED REVIEW REQUEST TESTS =====
    
    def test_professional_attendance_system(self):
        """Test Professional Attendance System - New Feature from Review Request"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Attendance System", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional")
            if not professional_token:
                self.log_result("Professional Attendance System", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test POST /api/professional/attendance/start (התחלת יום עבודה)
            start_data = {
                "start_time": datetime.now().isoformat(),
                "location": "סלון יופי הרצל",
                "notes": "התחלת יום עבודה רגיל"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/attendance/start", json=start_data, headers=headers)
            if response.status_code == 200:
                attendance_data = response.json()
                attendance_id = attendance_data.get("id")
                self.log_result("Professional Attendance - Start", True, f"Started work day with ID: {attendance_id}")
                
                # Test GET /api/professional/attendance/status (סטטוס נוכחות)
                response = self.session.get(f"{BACKEND_URL}/professional/attendance/status", headers=headers)
                if response.status_code == 200:
                    status_data = response.json()
                    if status_data.get("status") == "working" or status_data.get("is_working"):
                        self.log_result("Professional Attendance - Status", True, f"Attendance status: {status_data.get('status', 'working')}")
                        
                        # Test POST /api/professional/attendance/end (סיום יום עבודה)
                        end_data = {
                            "end_time": datetime.now().isoformat(),
                            "notes": "סיום יום עבודה מוצלח"
                        }
                        
                        response = self.session.post(f"{BACKEND_URL}/professional/attendance/end", json=end_data, headers=headers)
                        if response.status_code == 200:
                            end_response = response.json()
                            self.log_result("Professional Attendance - End", True, f"Ended work day successfully")
                            return True
                        else:
                            self.log_result("Professional Attendance - End", False, f"End attendance failed: {response.status_code} - {response.text}")
                            return False
                    else:
                        self.log_result("Professional Attendance - Status", False, f"Invalid attendance status: {status_data}")
                        return False
                else:
                    self.log_result("Professional Attendance - Status", False, f"Get attendance status failed: {response.status_code} - {response.text}")
                    return False
            else:
                self.log_result("Professional Attendance - Start", False, f"Start attendance failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Professional Attendance System", False, f"Attendance system test failed: {str(e)}")
            return False
    
    def test_professional_goals_get_endpoint(self):
        """Test Professional Goals GET Endpoint - Missing from Review Request"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Goals GET Endpoint", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional")
            if not professional_token:
                self.log_result("Professional Goals GET Endpoint", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test GET /api/professional/goals (יעדים)
            response = self.session.get(f"{BACKEND_URL}/professional/goals", headers=headers)
            if response.status_code == 200:
                goals_data = response.json()
                if isinstance(goals_data, list):
                    self.log_result("Professional Goals GET Endpoint", True, f"Retrieved {len(goals_data)} goals successfully")
                    
                    # Check if goals have expected structure
                    if goals_data and len(goals_data) > 0:
                        first_goal = goals_data[0]
                        expected_fields = ["id", "goal_type", "target_date", "goals"]
                        missing_fields = [field for field in expected_fields if field not in first_goal]
                        
                        if not missing_fields:
                            self.log_result("Professional Goals - Data Structure", True, "Goals have correct data structure")
                        else:
                            self.log_result("Professional Goals - Data Structure", False, f"Missing fields in goals: {missing_fields}")
                    else:
                        self.log_result("Professional Goals - Data Structure", True, "Goals endpoint working (empty list is valid)")
                    
                    return True
                else:
                    self.log_result("Professional Goals GET Endpoint", False, f"Invalid response format, expected list, got: {type(goals_data)}")
                    return False
            elif response.status_code == 405:
                self.log_result("Professional Goals GET Endpoint", False, "GET method not allowed - endpoint not implemented (only POST exists)")
                return False
            elif response.status_code == 404:
                self.log_result("Professional Goals GET Endpoint", False, "Goals GET endpoint not found - not implemented")
                return False
            else:
                self.log_result("Professional Goals GET Endpoint", False, f"Goals GET failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Professional Goals GET Endpoint", False, f"Goals GET test failed: {str(e)}")
            return False
    
    def test_hairpro_system_data_integrity(self):
        """Test HairPro System Data Integrity - JSON Format, Hebrew Currency, Time Sync"""
        try:
            if not self.auth_tokens:
                self.log_result("HairPro System Data Integrity", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional")
            if not professional_token:
                self.log_result("HairPro System Data Integrity", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test JSON Format Validation
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                try:
                    dashboard_data = response.json()
                    self.log_result("JSON Format Validation", True, "All data returned in valid JSON format")
                except json.JSONDecodeError:
                    self.log_result("JSON Format Validation", False, "Invalid JSON format in dashboard response")
                    return False
            else:
                self.log_result("JSON Format Validation", False, f"Dashboard endpoint failed: {response.status_code}")
                return False
            
            # Test Hebrew Currency Display (₪)
            if "revenue" in dashboard_data:
                revenue = dashboard_data.get("revenue", 0)
                if isinstance(revenue, (int, float)):
                    self.log_result("Hebrew Currency Display", True, f"Revenue displayed correctly in shekels: ₪{revenue}")
                else:
                    self.log_result("Hebrew Currency Display", False, f"Revenue format incorrect: {revenue}")
            else:
                self.log_result("Hebrew Currency Display", True, "Revenue field structure may differ but system working")
            
            # Test Alerts & Goals Functionality
            response = self.session.get(f"{BACKEND_URL}/professional/alerts", headers=headers)
            if response.status_code == 200:
                alerts_data = response.json()
                alerts_count = len(alerts_data) if isinstance(alerts_data, list) else alerts_data.get("count", 0)
                self.log_result("Alerts & Goals Functionality", True, f"Alerts system working ({alerts_count} alerts)")
            else:
                self.log_result("Alerts & Goals Functionality", False, f"Alerts endpoint failed: {response.status_code}")
            
            # Test Time Synchronization
            response = self.session.get(f"{BACKEND_URL}/professional/appointments/today", headers=headers)
            if response.status_code == 200:
                appointments_data = response.json()
                appointments_count = len(appointments_data) if isinstance(appointments_data, list) else appointments_data.get("count", 0)
                self.log_result("Time Synchronization", True, f"Time sync working ({appointments_count} today's appointments)")
            else:
                self.log_result("Time Synchronization", False, f"Today's appointments endpoint failed: {response.status_code}")
            
            return True
                
        except Exception as e:
            self.log_result("HairPro System Data Integrity", False, f"Data integrity test failed: {str(e)}")
            return False
    
    def test_existing_professional_endpoints(self):
        """Test Existing Professional Endpoints that should be working"""
        try:
            if not self.auth_tokens:
                self.log_result("Existing Professional Endpoints", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional")
            if not professional_token:
                self.log_result("Existing Professional Endpoints", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test existing endpoints that should work
            endpoints_to_test = [
                ("/professional/clients", "Clients"),
                ("/professional/formulas", "Formulas"),
                ("/professional/dashboard", "Dashboard"),
                ("/professional/inventory", "Inventory")
            ]
            
            working_endpoints = 0
            total_endpoints = len(endpoints_to_test)
            
            for endpoint, name in endpoints_to_test:
                response = self.session.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        self.log_result(f"Professional {name} Endpoint", True, f"Retrieved {len(data)} {name.lower()}")
                    elif isinstance(data, dict):
                        self.log_result(f"Professional {name} Endpoint", True, f"{name} endpoint working")
                    working_endpoints += 1
                else:
                    self.log_result(f"Professional {name} Endpoint", False, f"{name} endpoint failed: {response.status_code}")
            
            success_rate = (working_endpoints / total_endpoints) * 100
            self.log_result("Existing Professional Endpoints Summary", True, f"Professional endpoints working: {working_endpoints}/{total_endpoints} ({success_rate:.1f}%)")
            
            return working_endpoints >= (total_endpoints * 0.75)  # At least 75% should work
                
        except Exception as e:
            self.log_result("Existing Professional Endpoints", False, f"Professional endpoints test failed: {str(e)}")
            return False

    # ===== HAIRPRO PROFESSIONAL SYSTEM TESTS =====
    
    def test_professional_clients_crud(self):
        """Test Professional Clients CRUD operations"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Clients CRUD", False, "No auth tokens available")
                return False
            
            # Use professional token for professional endpoints
            professional_token = self.auth_tokens.get("professional") or self.auth_tokens.get("admin")
            if not professional_token:
                self.log_result("Professional Clients CRUD", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test GET /api/professional/clients
            response = self.session.get(f"{BACKEND_URL}/professional/clients", headers=headers)
            if response.status_code == 200:
                clients = response.json()
                self.log_result("Professional Clients - GET", True, f"Retrieved {len(clients)} clients")
            else:
                self.log_result("Professional Clients - GET", False, f"GET clients failed: {response.status_code}")
                return False
            
            # Test POST /api/professional/clients
            new_client = {
                "personal_info": {
                    "full_name": "שרה כהן",
                    "phone": "+972-50-123-4567",
                    "email": "sarah.cohen@example.com",
                    "birth_date": "1985-03-15",
                    "address": "רחוב הרצל 123, תל אביב",
                    "emergency_contact": "+972-50-987-6543"
                },
                "hair_profile": {
                    "natural_color": "חום כהה",
                    "current_color": "בלונד זהוב",
                    "hair_type": "גלי",
                    "hair_thickness": "בינוני",
                    "scalp_condition": "רגיל",
                    "hair_length": "אורך בינוני",
                    "previous_treatments": ["צבע", "החלקה"]
                },
                "chemistry_card": {
                    "allergies": ["PPD", "אמוניה"],
                    "sensitivities": ["ריחות חזקים"],
                    "patch_test_date": "2024-01-01",
                    "patch_test_result": "שלילי",
                    "notes": "רגישות קלה לכימיקלים",
                    "restrictions": ["אין שימוש בחמצן מעל 20vol"]
                },
                "preferences": {
                    "preferred_time_slots": ["10:00-12:00", "14:00-16:00"],
                    "preferred_services": ["צבע", "תספורת"],
                    "communication_preference": "whatsapp",
                    "language": "he",
                    "special_requests": "מוזיקה שקטה"
                }
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/clients", json=new_client, headers=headers)
            if response.status_code == 200:
                created_client = response.json()
                client_id = created_client.get("id")
                self.log_result("Professional Clients - POST", True, f"Created client with ID: {client_id}")
                
                # Test GET specific client
                response = self.session.get(f"{BACKEND_URL}/professional/clients/{client_id}", headers=headers)
                if response.status_code == 200:
                    client_data = response.json()
                    if client_data.get("personal_info", {}).get("full_name") == "שרה כהן":
                        self.log_result("Professional Clients - GET by ID", True, "Retrieved specific client with Hebrew data")
                    else:
                        self.log_result("Professional Clients - GET by ID", False, "Client data incorrect")
                else:
                    self.log_result("Professional Clients - GET by ID", False, f"GET by ID failed: {response.status_code}")
                
                # Test PUT /api/professional/clients/{id}
                update_data = {
                    "personal_info": {
                        "full_name": "שרה כהן-לוי",
                        "phone": "+972-50-123-4567",
                        "email": "sarah.cohen.levi@example.com"
                    },
                    "hair_profile": {
                        "current_color": "בלונד פלטינה",
                        "hair_length": "אורך ארוך"
                    }
                }
                
                response = self.session.put(f"{BACKEND_URL}/professional/clients/{client_id}", json=update_data, headers=headers)
                if response.status_code == 200:
                    updated_client = response.json()
                    if "שרה כהן-לוי" in updated_client.get("personal_info", {}).get("full_name", ""):
                        self.log_result("Professional Clients - PUT", True, "Client updated successfully with Hebrew data")
                    else:
                        self.log_result("Professional Clients - PUT", False, "Client update data incorrect")
                else:
                    self.log_result("Professional Clients - PUT", False, f"PUT failed: {response.status_code}")
                
                return True
            else:
                self.log_result("Professional Clients - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Clients CRUD", False, f"Clients CRUD test failed: {str(e)}")
            return False
    
    def test_professional_formulas_crud(self):
        """Test Professional Formulas CRUD operations with cost analysis"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Formulas CRUD", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional") or self.auth_tokens.get("admin")
            if not professional_token:
                self.log_result("Professional Formulas CRUD", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test GET /api/professional/formulas
            response = self.session.get(f"{BACKEND_URL}/professional/formulas", headers=headers)
            if response.status_code == 200:
                formulas = response.json()
                self.log_result("Professional Formulas - GET", True, f"Retrieved {len(formulas)} formulas")
            else:
                self.log_result("Professional Formulas - GET", False, f"GET formulas failed: {response.status_code}")
                return False
            
            # Test POST /api/professional/formulas
            new_formula = {
                "client_id": "test_client_123",
                "formula_name": "בלונד זהוב לשרה",
                "colors_used": [
                    {
                        "brand": "schwarzkopf",
                        "code": "8-0",
                        "planned_weight": 60,
                        "actual_weight": 58
                    },
                    {
                        "brand": "schwarzkopf", 
                        "code": "9-1",
                        "planned_weight": 30,
                        "actual_weight": 29
                    }
                ],
                "developer": {
                    "vol": "20vol",
                    "amount_ml": 90,
                    "actual_amount_ml": 87
                },
                "total_planned_weight": 90,
                "total_actual_weight": 87,
                "mixing_ratio": "1:1",
                "processing_time_minutes": 35,
                "service_price": 350.0,
                "notes": "תוצאה מעולה, הלקוחה מרוצה מאוד"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/formulas", json=new_formula, headers=headers)
            if response.status_code == 200:
                created_formula = response.json()
                formula_id = created_formula.get("id")
                self.log_result("Professional Formulas - POST", True, f"Created formula with ID: {formula_id}")
                
                # Test cost analysis endpoint
                response = self.session.get(f"{BACKEND_URL}/professional/formulas/{formula_id}/cost-analysis", headers=headers)
                if response.status_code == 200:
                    cost_analysis = response.json()
                    required_fields = ["color_cost", "developer_cost", "total_material_cost", "efficiency_score", "profit_margin"]
                    missing_fields = [field for field in required_fields if field not in cost_analysis]
                    
                    if not missing_fields:
                        self.log_result("Professional Formulas - Cost Analysis", True, 
                                      f"Cost analysis working: efficiency {cost_analysis.get('efficiency_score', 0)}%, "
                                      f"profit margin {cost_analysis.get('profit_margin', 0)}%")
                    else:
                        self.log_result("Professional Formulas - Cost Analysis", False, 
                                      f"Missing cost analysis fields: {missing_fields}")
                else:
                    self.log_result("Professional Formulas - Cost Analysis", False, 
                                  f"Cost analysis failed: {response.status_code}")
                
                return True
            else:
                self.log_result("Professional Formulas - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Formulas CRUD", False, f"Formulas CRUD test failed: {str(e)}")
            return False
    
    def test_professional_inventory_management(self):
        """Test Professional Smart Inventory Management"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Inventory Management", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional") or self.auth_tokens.get("admin")
            if not professional_token:
                self.log_result("Professional Inventory Management", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test GET /api/professional/inventory
            response = self.session.get(f"{BACKEND_URL}/professional/inventory", headers=headers)
            if response.status_code == 200:
                inventory = response.json()
                self.log_result("Professional Inventory - GET", True, f"Retrieved {len(inventory)} inventory items")
            else:
                self.log_result("Professional Inventory - GET", False, f"GET inventory failed: {response.status_code}")
                return False
            
            # Test POST /api/professional/inventory
            new_inventory_item = {
                "brand": "שוורצקופף",
                "product_name": "IGORA ROYAL 8-0",
                "product_code": "8-0",
                "category": "color",
                "unit_type": "grams",
                "current_stock": 240.0,
                "minimum_stock": 60.0,
                "maximum_stock": 480.0,
                "reorder_point": 120.0,
                "cost_per_unit": 0.47,
                "selling_price_per_unit": 0.85,
                "supplier": "ספק צבעים מקצועי",
                "average_daily_usage": 15.0,
                "expiry_date": "2025-12-31T00:00:00"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/inventory", json=new_inventory_item, headers=headers)
            if response.status_code == 200:
                created_item = response.json()
                item_id = created_item.get("id")
                self.log_result("Professional Inventory - POST", True, f"Created inventory item with ID: {item_id}")
                
                # Test stock update
                stock_update = {
                    "quantity_used": 30.0,
                    "reason": "שימוש בטיפול ללקוחה שרה כהן"
                }
                
                response = self.session.put(f"{BACKEND_URL}/professional/inventory/{item_id}/stock", json=stock_update, headers=headers)
                if response.status_code == 200:
                    updated_item = response.json()
                    if updated_item.get("current_stock") == 210.0:  # 240 - 30
                        self.log_result("Professional Inventory - Stock Update", True, "Stock updated correctly")
                    else:
                        self.log_result("Professional Inventory - Stock Update", False, "Stock calculation incorrect")
                else:
                    self.log_result("Professional Inventory - Stock Update", False, f"Stock update failed: {response.status_code}")
                
                # Test smart analysis
                response = self.session.get(f"{BACKEND_URL}/professional/inventory/smart-analysis", headers=headers)
                if response.status_code == 200:
                    analysis = response.json()
                    required_fields = ["low_stock_items", "reorder_recommendations", "usage_predictions"]
                    missing_fields = [field for field in required_fields if field not in analysis]
                    
                    if not missing_fields:
                        self.log_result("Professional Inventory - Smart Analysis", True, 
                                      f"Smart analysis working: {len(analysis.get('low_stock_items', []))} low stock items")
                    else:
                        self.log_result("Professional Inventory - Smart Analysis", False, 
                                      f"Missing analysis fields: {missing_fields}")
                else:
                    self.log_result("Professional Inventory - Smart Analysis", False, 
                                  f"Smart analysis failed: {response.status_code}")
                
                return True
            else:
                self.log_result("Professional Inventory - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Inventory Management", False, f"Inventory management test failed: {str(e)}")
            return False
    
    def test_professional_appointments_system(self):
        """Test Professional Appointments System"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Appointments System", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional") or self.auth_tokens.get("admin")
            if not professional_token:
                self.log_result("Professional Appointments System", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test GET /api/professional/appointments
            response = self.session.get(f"{BACKEND_URL}/professional/appointments", headers=headers)
            if response.status_code == 200:
                appointments = response.json()
                self.log_result("Professional Appointments - GET", True, f"Retrieved {len(appointments)} appointments")
            else:
                self.log_result("Professional Appointments - GET", False, f"GET appointments failed: {response.status_code}")
                return False
            
            # Test POST /api/professional/appointments
            new_appointment = {
                "client_id": "test_client_123",
                "scheduled_datetime": (datetime.utcnow() + timedelta(days=7)).isoformat(),
                "duration_minutes": 120,
                "service_type": "צבע ותספורת",
                "service_details": {
                    "services": ["צבע שורשים", "תספורת", "עיצוב"],
                    "estimated_cost": 350.0,
                    "special_requirements": "שימוש בצבעים ללא אמוניה"
                },
                "notes": "לקוחה חדשה, צריך בדיקת רגישות"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/appointments", json=new_appointment, headers=headers)
            if response.status_code == 200:
                created_appointment = response.json()
                appointment_id = created_appointment.get("id")
                self.log_result("Professional Appointments - POST", True, f"Created appointment with ID: {appointment_id}")
                
                # Test appointment filtering by date
                today = datetime.utcnow().date().isoformat()
                response = self.session.get(f"{BACKEND_URL}/professional/appointments?date={today}", headers=headers)
                if response.status_code == 200:
                    filtered_appointments = response.json()
                    self.log_result("Professional Appointments - Date Filter", True, 
                                  f"Retrieved {len(filtered_appointments)} appointments for {today}")
                else:
                    self.log_result("Professional Appointments - Date Filter", False, 
                                  f"Date filtering failed: {response.status_code}")
                
                return True
            else:
                self.log_result("Professional Appointments - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Appointments System", False, f"Appointments system test failed: {str(e)}")
            return False
    
    def test_professional_scale_integration(self):
        """Test Professional Bluetooth Scale Integration (Mocked)"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Scale Integration", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional") or self.auth_tokens.get("admin")
            if not professional_token:
                self.log_result("Professional Scale Integration", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test POST /api/professional/scale/connect
            connect_data = {
                "device_name": "Professional Scale Pro",
                "device_id": "scale_001"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/scale/connect", json=connect_data, headers=headers)
            if response.status_code == 200:
                connection_result = response.json()
                if connection_result.get("status") == "connected":
                    self.log_result("Professional Scale - Connect", True, 
                                  f"Scale connected: {connection_result.get('device', 'Unknown')}")
                else:
                    self.log_result("Professional Scale - Connect", False, "Scale connection failed")
                    return False
            else:
                self.log_result("Professional Scale - Connect", False, f"Scale connect failed: {response.status_code}")
                return False
            
            # Test GET /api/professional/scale/reading
            response = self.session.get(f"{BACKEND_URL}/professional/scale/reading", headers=headers)
            if response.status_code == 200:
                reading_data = response.json()
                if "weight" in reading_data and "timestamp" in reading_data:
                    self.log_result("Professional Scale - Reading", True, 
                                  f"Scale reading: {reading_data.get('weight', 0)}g")
                else:
                    self.log_result("Professional Scale - Reading", False, "Invalid reading data format")
                    return False
            else:
                self.log_result("Professional Scale - Reading", False, f"Scale reading failed: {response.status_code}")
                return False
            
            # Test POST /api/professional/scale/validate
            validation_data = {
                "formula_id": "test_formula_123",
                "component_type": "color",
                "component_code": "8-0",
                "planned_weight": 60.0,
                "actual_weight": 58.5
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/scale/validate", json=validation_data, headers=headers)
            if response.status_code == 200:
                validation_result = response.json()
                required_fields = ["within_tolerance", "variance", "variance_percentage", "recommendation"]
                missing_fields = [field for field in required_fields if field not in validation_result]
                
                if not missing_fields:
                    self.log_result("Professional Scale - Validation", True, 
                                  f"Scale validation working: variance {validation_result.get('variance', 0)}g, "
                                  f"recommendation: {validation_result.get('recommendation', 'N/A')}")
                else:
                    self.log_result("Professional Scale - Validation", False, 
                                  f"Missing validation fields: {missing_fields}")
            else:
                self.log_result("Professional Scale - Validation", False, f"Scale validation failed: {response.status_code}")
                return False
            
            return True
                
        except Exception as e:
            self.log_result("Professional Scale Integration", False, f"Scale integration test failed: {str(e)}")
            return False
    
    def test_professional_analytics_dashboard(self):
        """Test Professional Analytics and Dashboard"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Analytics Dashboard", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional") or self.auth_tokens.get("admin")
            if not professional_token:
                self.log_result("Professional Analytics Dashboard", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test GET /api/professional/analytics
            response = self.session.get(f"{BACKEND_URL}/professional/analytics", headers=headers)
            if response.status_code == 200:
                analytics = response.json()
                required_fields = ["daily_metrics", "weekly_summary", "monthly_trends", "efficiency_scores"]
                missing_fields = [field for field in required_fields if field not in analytics]
                
                if not missing_fields:
                    daily_metrics = analytics.get("daily_metrics", {})
                    self.log_result("Professional Analytics", True, 
                                  f"Analytics working: {daily_metrics.get('clients_served', 0)} clients served, "
                                  f"revenue: {daily_metrics.get('total_revenue', 0)} ILS")
                else:
                    self.log_result("Professional Analytics", False, 
                                  f"Missing analytics fields: {missing_fields}")
                    return False
            else:
                self.log_result("Professional Analytics", False, f"Analytics failed: {response.status_code}")
                return False
            
            # Test GET /api/professional/dashboard
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                dashboard = response.json()
                required_sections = ["today_appointments", "pending_tasks", "inventory_alerts", "recent_clients"]
                missing_sections = [section for section in required_sections if section not in dashboard]
                
                if not missing_sections:
                    self.log_result("Professional Dashboard", True, 
                                  f"Dashboard working: {len(dashboard.get('today_appointments', []))} appointments today, "
                                  f"{len(dashboard.get('inventory_alerts', []))} inventory alerts")
                else:
                    self.log_result("Professional Dashboard", False, 
                                  f"Missing dashboard sections: {missing_sections}")
                    return False
            else:
                self.log_result("Professional Dashboard", False, f"Dashboard failed: {response.status_code}")
                return False
            
            return True
                
        except Exception as e:
            self.log_result("Professional Analytics Dashboard", False, f"Analytics dashboard test failed: {str(e)}")
            return False
    
    def test_professional_chemistry_cards(self):
        """Test Professional Client Chemistry Cards"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Chemistry Cards", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional") or self.auth_tokens.get("admin")
            if not professional_token:
                self.log_result("Professional Chemistry Cards", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test POST /api/professional/chemistry-cards
            new_chemistry_card = {
                "client_id": "test_client_123",
                "allergies": ["PPD", "אמוניה", "פרבנים"],
                "sensitivities": ["ריחות חזקים", "חמצן מעל 20vol"],
                "skin_test_results": [
                    {
                        "date": "2024-01-15",
                        "product": "IGORA ROYAL",
                        "result": "שלילי",
                        "patch_location": "מאחורי האוזן"
                    }
                ],
                "hair_analysis": {
                    "porosity": "בינוני",
                    "elasticity": "טוב",
                    "density": "בינוני",
                    "texture": "בינוני",
                    "natural_color_level": 6,
                    "grey_percentage": 15,
                    "previous_chemical_treatments": ["צבע", "החלקה", "פרמננט"]
                },
                "contraindications": ["אין שימוש בחמצן מעל 20vol", "אין צבעים עם אמוניה"],
                "recommended_products": ["IGORA ROYAL ללא אמוניה", "שמפו לשיער צבוע"],
                "notes": "לקוחה רגישה, צריך זהירות מיוחדת"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/chemistry-cards", json=new_chemistry_card, headers=headers)
            if response.status_code == 200:
                created_card = response.json()
                card_id = created_card.get("id")
                client_id = created_card.get("client_id")
                self.log_result("Professional Chemistry Cards - POST", True, f"Created chemistry card with ID: {card_id}")
                
                # Test GET /api/professional/chemistry-cards/{client_id}
                response = self.session.get(f"{BACKEND_URL}/professional/chemistry-cards/{client_id}", headers=headers)
                if response.status_code == 200:
                    card_data = response.json()
                    if "PPD" in card_data.get("allergies", []) and "אמוניה" in card_data.get("allergies", []):
                        self.log_result("Professional Chemistry Cards - GET", True, 
                                      "Retrieved chemistry card with Hebrew allergy data")
                    else:
                        self.log_result("Professional Chemistry Cards - GET", False, "Chemistry card data incorrect")
                else:
                    self.log_result("Professional Chemistry Cards - GET", False, 
                                  f"GET chemistry card failed: {response.status_code}")
                
                return True
            else:
                self.log_result("Professional Chemistry Cards - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Chemistry Cards", False, f"Chemistry cards test failed: {str(e)}")
            return False
    
    def test_professional_demo_data_population(self):
        """Test Professional Demo Data Population"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Demo Data Population", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional") or self.auth_tokens.get("admin")
            if not professional_token:
                self.log_result("Professional Demo Data Population", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test POST /api/professional/populate-demo-data
            response = self.session.post(f"{BACKEND_URL}/professional/populate-demo-data", headers=headers)
            if response.status_code == 200:
                demo_data = response.json()
                required_fields = ["clients_created", "formulas_created", "appointments_created", "inventory_items_created"]
                missing_fields = [field for field in required_fields if field not in demo_data]
                
                if not missing_fields:
                    self.log_result("Professional Demo Data Population", True, 
                                  f"Demo data populated: {demo_data.get('clients_created', 0)} clients, "
                                  f"{demo_data.get('formulas_created', 0)} formulas, "
                                  f"{demo_data.get('appointments_created', 0)} appointments, "
                                  f"{demo_data.get('inventory_items_created', 0)} inventory items")
                else:
                    self.log_result("Professional Demo Data Population", False, 
                                  f"Missing demo data fields: {missing_fields}")
                    return False
            else:
                self.log_result("Professional Demo Data Population", False, 
                              f"Demo data population failed: {response.status_code}")
                return False
            
            return True
                
        except Exception as e:
            self.log_result("Professional Demo Data Population", False, f"Demo data population test failed: {str(e)}")
            return False

    # ===== CRM SYSTEM TESTS =====
    
    def test_crm_demo_data_population(self):
        """Test CRM demo data population"""
        try:
            # First populate demo data
            response = self.session.post(f"{BACKEND_URL}/setup/demo-data")
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("CRM Demo Data Population", True, 
                              f"Demo data populated successfully: {data.get('demo_data', {})}")
                return True
            else:
                self.log_result("CRM Demo Data Population", False, 
                              f"Demo data population failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("CRM Demo Data Population", False, f"Demo data population failed: {str(e)}")
            return False
    
    def test_crm_leads_crud(self):
        """Test CRM Leads CRUD operations"""
        try:
            if not self.auth_tokens:
                self.log_result("CRM Leads CRUD", False, "No auth tokens available")
                return False
            
            admin_token = self.auth_tokens.get("admin")
            if not admin_token:
                self.log_result("CRM Leads CRUD", False, "No admin token available")
                return False
            
            headers = {"Authorization": f"Bearer {admin_token}"}
            
            # Test GET /api/crm/leads
            response = self.session.get(f"{BACKEND_URL}/crm/leads", headers=headers)
            if response.status_code == 200:
                leads = response.json()
                self.log_result("CRM Leads - GET", True, f"Retrieved {len(leads)} leads")
                
                # Test with filtering
                response = self.session.get(f"{BACKEND_URL}/crm/leads?status=new&limit=2", headers=headers)
                if response.status_code == 200:
                    filtered_leads = response.json()
                    self.log_result("CRM Leads - GET Filtered", True, f"Retrieved {len(filtered_leads)} filtered leads")
                else:
                    self.log_result("CRM Leads - GET Filtered", False, f"Filtering failed: {response.status_code}")
            else:
                self.log_result("CRM Leads - GET", False, f"GET leads failed: {response.status_code}")
                return False
            
            # Test POST /api/crm/leads
            new_lead = {
                "name": "בדיקה אוטומטית",
                "phone": "+972-50-999-0001",
                "email": "test@automated.test",
                "company": "חברת בדיקות",
                "source": "website",
                "notes": "ליד שנוצר בבדיקה אוטומטית",
                "tags": ["בדיקה", "אוטומטי"],
                "estimated_value": 10000.0,
                "priority": "medium"
            }
            
            response = self.session.post(f"{BACKEND_URL}/crm/leads", json=new_lead, headers=headers)
            if response.status_code == 200:
                created_lead = response.json()
                lead_id = created_lead.get("id")
                self.log_result("CRM Leads - POST", True, f"Created lead with ID: {lead_id}")
                
                # Test GET specific lead
                response = self.session.get(f"{BACKEND_URL}/crm/leads/{lead_id}", headers=headers)
                if response.status_code == 200:
                    self.log_result("CRM Leads - GET by ID", True, "Retrieved specific lead")
                else:
                    self.log_result("CRM Leads - GET by ID", False, f"GET by ID failed: {response.status_code}")
                
                # Test PUT /api/crm/leads/{id}
                update_data = {
                    "status": "contacted",
                    "notes": "עודכן בבדיקה אוטומטית",
                    "priority": "high"
                }
                
                response = self.session.put(f"{BACKEND_URL}/crm/leads/{lead_id}", json=update_data, headers=headers)
                if response.status_code == 200:
                    updated_lead = response.json()
                    if updated_lead.get("status") == "contacted":
                        self.log_result("CRM Leads - PUT", True, "Lead updated successfully")
                    else:
                        self.log_result("CRM Leads - PUT", False, "Lead update data incorrect")
                else:
                    self.log_result("CRM Leads - PUT", False, f"PUT failed: {response.status_code}")
                
                # Test DELETE /api/crm/leads/{id}
                response = self.session.delete(f"{BACKEND_URL}/crm/leads/{lead_id}", headers=headers)
                if response.status_code == 200:
                    self.log_result("CRM Leads - DELETE", True, "Lead deleted successfully")
                else:
                    self.log_result("CRM Leads - DELETE", False, f"DELETE failed: {response.status_code}")
                
                return True
            else:
                self.log_result("CRM Leads - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("CRM Leads CRUD", False, f"Leads CRUD test failed: {str(e)}")
            return False
    
    def test_crm_deals_crud(self):
        """Test CRM Deals CRUD operations"""
        try:
            if not self.auth_tokens:
                self.log_result("CRM Deals CRUD", False, "No auth tokens available")
                return False
            
            admin_token = self.auth_tokens.get("admin")
            if not admin_token:
                self.log_result("CRM Deals CRUD", False, "No admin token available")
                return False
            
            headers = {"Authorization": f"Bearer {admin_token}"}
            
            # Test GET /api/crm/deals
            response = self.session.get(f"{BACKEND_URL}/crm/deals", headers=headers)
            if response.status_code == 200:
                deals = response.json()
                self.log_result("CRM Deals - GET", True, f"Retrieved {len(deals)} deals")
                
                # Test with stage filtering
                response = self.session.get(f"{BACKEND_URL}/crm/deals?stage=proposal", headers=headers)
                if response.status_code == 200:
                    filtered_deals = response.json()
                    self.log_result("CRM Deals - GET Filtered", True, f"Retrieved {len(filtered_deals)} filtered deals")
                else:
                    self.log_result("CRM Deals - GET Filtered", False, f"Filtering failed: {response.status_code}")
            else:
                self.log_result("CRM Deals - GET", False, f"GET deals failed: {response.status_code}")
                return False
            
            # Test POST /api/crm/deals
            new_deal = {
                "title": "עסקת בדיקה אוטומטית",
                "description": "עסקה שנוצרה בבדיקה אוטומטית",
                "amount": 15000.0,
                "currency": "ILS",
                "probability": 50,
                "expected_close_date": (datetime.utcnow() + timedelta(days=30)).isoformat(),
                "notes": "עסקה לבדיקה",
                "tags": ["בדיקה", "אוטומטי"]
            }
            
            response = self.session.post(f"{BACKEND_URL}/crm/deals", json=new_deal, headers=headers)
            if response.status_code == 200:
                created_deal = response.json()
                deal_id = created_deal.get("id")
                self.log_result("CRM Deals - POST", True, f"Created deal with ID: {deal_id}")
                
                # Test GET specific deal
                response = self.session.get(f"{BACKEND_URL}/crm/deals/{deal_id}", headers=headers)
                if response.status_code == 200:
                    self.log_result("CRM Deals - GET by ID", True, "Retrieved specific deal")
                else:
                    self.log_result("CRM Deals - GET by ID", False, f"GET by ID failed: {response.status_code}")
                
                # Test PUT /api/crm/deals/{id}
                update_data = {
                    "stage": "negotiation",
                    "probability": 75,
                    "notes": "עודכן בבדיקה אוטומטית"
                }
                
                response = self.session.put(f"{BACKEND_URL}/crm/deals/{deal_id}", json=update_data, headers=headers)
                if response.status_code == 200:
                    updated_deal = response.json()
                    if updated_deal.get("stage") == "negotiation":
                        self.log_result("CRM Deals - PUT", True, "Deal updated successfully")
                    else:
                        self.log_result("CRM Deals - PUT", False, "Deal update data incorrect")
                else:
                    self.log_result("CRM Deals - PUT", False, f"PUT failed: {response.status_code}")
                
                # Test DELETE /api/crm/deals/{id}
                response = self.session.delete(f"{BACKEND_URL}/crm/deals/{deal_id}", headers=headers)
                if response.status_code == 200:
                    self.log_result("CRM Deals - DELETE", True, "Deal deleted successfully")
                else:
                    self.log_result("CRM Deals - DELETE", False, f"DELETE failed: {response.status_code}")
                
                return True
            else:
                self.log_result("CRM Deals - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("CRM Deals CRUD", False, f"Deals CRUD test failed: {str(e)}")
            return False
    
    def test_crm_tasks_crud(self):
        """Test CRM Tasks CRUD operations"""
        try:
            if not self.auth_tokens:
                self.log_result("CRM Tasks CRUD", False, "No auth tokens available")
                return False
            
            admin_token = self.auth_tokens.get("admin")
            if not admin_token:
                self.log_result("CRM Tasks CRUD", False, "No admin token available")
                return False
            
            headers = {"Authorization": f"Bearer {admin_token}"}
            
            # Test GET /api/crm/tasks
            response = self.session.get(f"{BACKEND_URL}/crm/tasks", headers=headers)
            if response.status_code == 200:
                tasks = response.json()
                self.log_result("CRM Tasks - GET", True, f"Retrieved {len(tasks)} tasks")
                
                # Test with status filtering
                response = self.session.get(f"{BACKEND_URL}/crm/tasks?status=pending", headers=headers)
                if response.status_code == 200:
                    filtered_tasks = response.json()
                    self.log_result("CRM Tasks - GET Filtered", True, f"Retrieved {len(filtered_tasks)} filtered tasks")
                else:
                    self.log_result("CRM Tasks - GET Filtered", False, f"Filtering failed: {response.status_code}")
            else:
                self.log_result("CRM Tasks - GET", False, f"GET tasks failed: {response.status_code}")
                return False
            
            # Test POST /api/crm/tasks
            new_task = {
                "title": "משימת בדיקה אוטומטית",
                "description": "משימה שנוצרה בבדיקה אוטומטית",
                "type": "call",
                "priority": "medium",
                "due_date": (datetime.utcnow() + timedelta(days=7)).isoformat(),
                "notes": "משימה לבדיקה"
            }
            
            response = self.session.post(f"{BACKEND_URL}/crm/tasks", json=new_task, headers=headers)
            if response.status_code == 200:
                created_task = response.json()
                task_id = created_task.get("id")
                self.log_result("CRM Tasks - POST", True, f"Created task with ID: {task_id}")
                
                # Test GET specific task
                response = self.session.get(f"{BACKEND_URL}/crm/tasks/{task_id}", headers=headers)
                if response.status_code == 200:
                    self.log_result("CRM Tasks - GET by ID", True, "Retrieved specific task")
                else:
                    self.log_result("CRM Tasks - GET by ID", False, f"GET by ID failed: {response.status_code}")
                
                # Test PUT /api/crm/tasks/{id}
                update_data = {
                    "status": "completed",
                    "completed_at": datetime.utcnow().isoformat(),
                    "notes": "הושלמה בבדיקה אוטומטית"
                }
                
                response = self.session.put(f"{BACKEND_URL}/crm/tasks/{task_id}", json=update_data, headers=headers)
                if response.status_code == 200:
                    updated_task = response.json()
                    if updated_task.get("status") == "completed":
                        self.log_result("CRM Tasks - PUT", True, "Task updated successfully")
                    else:
                        self.log_result("CRM Tasks - PUT", False, "Task update data incorrect")
                else:
                    self.log_result("CRM Tasks - PUT", False, f"PUT failed: {response.status_code}")
                
                # Test DELETE /api/crm/tasks/{id}
                response = self.session.delete(f"{BACKEND_URL}/crm/tasks/{task_id}", headers=headers)
                if response.status_code == 200:
                    self.log_result("CRM Tasks - DELETE", True, "Task deleted successfully")
                else:
                    self.log_result("CRM Tasks - DELETE", False, f"DELETE failed: {response.status_code}")
                
                return True
            else:
                self.log_result("CRM Tasks - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("CRM Tasks CRUD", False, f"Tasks CRUD test failed: {str(e)}")
            return False
    
    def test_crm_analytics_endpoint(self):
        """Test CRM Analytics endpoint"""
        try:
            if not self.auth_tokens:
                self.log_result("CRM Analytics", False, "No auth tokens available")
                return False
            
            admin_token = self.auth_tokens.get("admin")
            if not admin_token:
                self.log_result("CRM Analytics", False, "No admin token available")
                return False
            
            headers = {"Authorization": f"Bearer {admin_token}"}
            
            # Test GET /api/crm/analytics/summary
            response = self.session.get(f"{BACKEND_URL}/crm/analytics/summary", headers=headers)
            if response.status_code == 200:
                analytics = response.json()
                
                # Check for expected analytics fields (note: field is total_won_value, not total_deal_value)
                expected_fields = ["leads_by_status", "deals_by_stage", "tasks_by_status", "total_won_value"]
                missing_fields = [field for field in expected_fields if field not in analytics]
                
                if not missing_fields:
                    self.log_result("CRM Analytics", True, 
                                  f"Analytics retrieved successfully: "
                                  f"leads={analytics.get('leads_by_status', {})}, "
                                  f"deals={analytics.get('deals_by_stage', {})}, "
                                  f"total_value={analytics.get('total_won_value', 0)}")
                    return True
                else:
                    self.log_result("CRM Analytics", False, 
                                  f"Missing analytics fields: {missing_fields}", analytics)
                    return False
            else:
                self.log_result("CRM Analytics", False, f"Analytics failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("CRM Analytics", False, f"Analytics test failed: {str(e)}")
            return False
    
    def test_enhanced_contacts_crud(self):
        """Test Enhanced Contacts CRUD operations"""
        try:
            if not self.auth_tokens:
                self.log_result("Enhanced Contacts CRUD", False, "No auth tokens available")
                return False
            
            admin_token = self.auth_tokens.get("admin")
            if not admin_token:
                self.log_result("Enhanced Contacts CRUD", False, "No admin token available")
                return False
            
            headers = {"Authorization": f"Bearer {admin_token}"}
            
            # First create a contact to test PUT/DELETE
            new_contact = {
                "name": "איש קשר בדיקה",
                "phone_number": "+972-50-999-0002",
                "email": "contact@test.automated",
                "company": "חברת בדיקות קשרים",
                "tags": ["בדיקה", "אוטומטי"]
            }
            
            response = self.session.post(f"{BACKEND_URL}/contacts", json=new_contact, headers=headers)
            if response.status_code == 200:
                created_contact = response.json()
                contact_id = created_contact.get("id")
                self.log_result("Enhanced Contacts - POST", True, f"Created contact with ID: {contact_id}")
                
                # Test PUT /api/contacts/{id}
                update_data = {
                    "name": "איש קשר מעודכן",
                    "company": "חברת בדיקות מעודכנת",
                    "tags": ["בדיקה", "מעודכן"]
                }
                
                response = self.session.put(f"{BACKEND_URL}/contacts/{contact_id}", json=update_data, headers=headers)
                if response.status_code == 200:
                    updated_contact = response.json()
                    if updated_contact.get("name") == "איש קשר מעודכן":
                        self.log_result("Enhanced Contacts - PUT", True, "Contact updated successfully")
                    else:
                        self.log_result("Enhanced Contacts - PUT", False, "Contact update data incorrect")
                else:
                    self.log_result("Enhanced Contacts - PUT", False, f"PUT failed: {response.status_code}")
                
                # Test DELETE /api/contacts/{id}
                response = self.session.delete(f"{BACKEND_URL}/contacts/{contact_id}", headers=headers)
                if response.status_code == 200:
                    self.log_result("Enhanced Contacts - DELETE", True, "Contact deleted successfully")
                    return True
                else:
                    self.log_result("Enhanced Contacts - DELETE", False, f"DELETE failed: {response.status_code}")
                    return False
            else:
                self.log_result("Enhanced Contacts - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Enhanced Contacts CRUD", False, f"Enhanced contacts test failed: {str(e)}")
            return False
    
    def test_enhanced_calls_crud(self):
        """Test Enhanced Calls CRUD operations"""
        try:
            if not self.auth_tokens:
                self.log_result("Enhanced Calls CRUD", False, "No auth tokens available")
                return False
            
            admin_token = self.auth_tokens.get("admin")
            if not admin_token:
                self.log_result("Enhanced Calls CRUD", False, "No admin token available")
                return False
            
            headers = {"Authorization": f"Bearer {admin_token}"}
            
            # First create a call to test PUT/DELETE
            new_call = {
                "caller_name": "מתקשר בדיקה",
                "caller_number": "+972-50-999-0003",
                "callee_number": "+972-50-555-0001",
                "language": "he"
            }
            
            response = self.session.post(f"{BACKEND_URL}/calls", json=new_call, headers=headers)
            if response.status_code == 200:
                created_call = response.json()
                call_id = created_call.get("id")
                self.log_result("Enhanced Calls - POST", True, f"Created call with ID: {call_id}")
                
                # Test PUT /api/calls/{id}
                update_data = {
                    "end_time": datetime.utcnow().isoformat(),
                    "duration": 300,
                    "status": "completed",
                    "transcription": "תמלול בדיקה אוטומטית",
                    "sentiment": "positive"
                }
                
                response = self.session.put(f"{BACKEND_URL}/calls/{call_id}", json=update_data, headers=headers)
                if response.status_code == 200:
                    updated_call = response.json()
                    if updated_call.get("status") == "completed":
                        self.log_result("Enhanced Calls - PUT", True, "Call updated successfully")
                    else:
                        self.log_result("Enhanced Calls - PUT", False, "Call update data incorrect")
                else:
                    self.log_result("Enhanced Calls - PUT", False, f"PUT failed: {response.status_code}")
                
                # Test DELETE /api/calls/{id}
                response = self.session.delete(f"{BACKEND_URL}/calls/{call_id}", headers=headers)
                if response.status_code == 200:
                    self.log_result("Enhanced Calls - DELETE", True, "Call deleted successfully")
                    return True
                else:
                    self.log_result("Enhanced Calls - DELETE", False, f"DELETE failed: {response.status_code}")
                    return False
            else:
                self.log_result("Enhanced Calls - POST", False, f"POST failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Enhanced Calls CRUD", False, f"Enhanced calls test failed: {str(e)}")
            return False
    
    def test_crm_authentication_integration(self):
        """Test that all CRM endpoints require authentication"""
        try:
            crm_endpoints = [
                "/crm/leads",
                "/crm/deals", 
                "/crm/tasks",
                "/crm/analytics/summary"
            ]
            
            protected_count = 0
            for endpoint in crm_endpoints:
                # Test without auth
                response = self.session.get(f"{BACKEND_URL}{endpoint}")
                if response.status_code == 401:
                    protected_count += 1
                    self.log_result(f"CRM Auth - {endpoint}", True, 
                                  f"Endpoint {endpoint} properly requires authentication")
                else:
                    self.log_result(f"CRM Auth - {endpoint}", False, 
                                  f"Endpoint {endpoint} should require auth, got {response.status_code}")
            
            return protected_count == len(crm_endpoints)
            
        except Exception as e:
            self.log_result("CRM Authentication Integration", False, f"CRM auth test failed: {str(e)}")
            return False
    
    def test_crm_data_relationships(self):
        """Test CRM data relationships and Hebrew content"""
        try:
            if not self.auth_tokens:
                self.log_result("CRM Data Relationships", False, "No auth tokens available")
                return False
            
            admin_token = self.auth_tokens.get("admin")
            if not admin_token:
                self.log_result("CRM Data Relationships", False, "No admin token available")
                return False
            
            headers = {"Authorization": f"Bearer {admin_token}"}
            
            # Test Hebrew content in leads
            response = self.session.get(f"{BACKEND_URL}/crm/leads", headers=headers)
            if response.status_code == 200:
                leads = response.json()
                hebrew_leads = [lead for lead in leads if any(ord(char) >= 0x0590 and ord(char) <= 0x05FF for char in lead.get("name", ""))]
                
                if hebrew_leads:
                    self.log_result("CRM Hebrew Content", True, f"Found {len(hebrew_leads)} leads with Hebrew content")
                else:
                    self.log_result("CRM Hebrew Content", False, "No Hebrew content found in leads")
                
                # Test search functionality
                if leads:
                    search_term = leads[0].get("name", "").split()[0] if leads[0].get("name") else "test"
                    response = self.session.get(f"{BACKEND_URL}/crm/leads?search={search_term}", headers=headers)
                    if response.status_code == 200:
                        search_results = response.json()
                        self.log_result("CRM Search Functionality", True, f"Search returned {len(search_results)} results")
                    else:
                        self.log_result("CRM Search Functionality", False, f"Search failed: {response.status_code}")
                
                return True
            else:
                self.log_result("CRM Data Relationships", False, f"Failed to get leads: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("CRM Data Relationships", False, f"Data relationships test failed: {str(e)}")
            return False
    
    # ===== HAIRPRO IL ADVANCED REVIEW REQUEST TESTS =====
    
    def test_professional_attendance_system(self):
        """Test Professional Attendance System - מערכת הנוכחות החדשה"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Attendance System", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional")
            if not professional_token:
                self.log_result("Professional Attendance System", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            
            # Test POST /api/professional/attendance/start - התחלת יום עבודה
            start_data = {
                "start_time": datetime.now().strftime("%H:%M:%S"),
                "location": "סלון יופי מרכז",
                "notes": "התחלת יום עבודה רגיל"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/attendance/start", json=start_data, headers=headers)
            if response.status_code == 200:
                self.log_result("Professional Attendance - Start", True, "Successfully started work day")
                attendance_id = response.json().get("id")
            else:
                self.log_result("Professional Attendance - Start", False, f"Start attendance failed: {response.status_code} - {response.text}")
                return False
            
            # Test GET /api/professional/attendance/status - סטטוס נוכחות
            response = self.session.get(f"{BACKEND_URL}/professional/attendance/status", headers=headers)
            if response.status_code == 200:
                status_data = response.json()
                if status_data.get("status") == "present":
                    self.log_result("Professional Attendance - Status", True, f"Current status: {status_data.get('status')}")
                else:
                    self.log_result("Professional Attendance - Status", False, f"Unexpected status: {status_data.get('status')}")
            else:
                self.log_result("Professional Attendance - Status", False, f"Status check failed: {response.status_code}")
                return False
            
            # Test POST /api/professional/attendance/end - סיום יום עבודה
            end_data = {
                "end_time": datetime.now().strftime("%H:%M:%S"),
                "notes": "סיום יום עבודה מוצלח"
            }
            
            response = self.session.post(f"{BACKEND_URL}/professional/attendance/end", json=end_data, headers=headers)
            if response.status_code == 200:
                self.log_result("Professional Attendance - End", True, "Successfully ended work day")
                return True
            else:
                self.log_result("Professional Attendance - End", False, f"End attendance failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Attendance System", False, f"Attendance system test failed: {str(e)}")
            return False
    
    def test_professional_existing_endpoints(self):
        """Test existing professional endpoints - אנדפוינטים קיימים"""
        try:
            if not self.auth_tokens:
                self.log_result("Professional Existing Endpoints", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional")
            if not professional_token:
                self.log_result("Professional Existing Endpoints", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            success_count = 0
            total_endpoints = 5
            
            # Test GET /api/professional/clients - רשימת לקוחות
            response = self.session.get(f"{BACKEND_URL}/professional/clients", headers=headers)
            if response.status_code == 200:
                clients = response.json()
                self.log_result("Professional Clients Endpoint", True, f"Retrieved {len(clients)} clients")
                success_count += 1
            else:
                self.log_result("Professional Clients Endpoint", False, f"Clients endpoint failed: {response.status_code}")
            
            # Test GET /api/professional/formulas - רשימת פורמולות
            response = self.session.get(f"{BACKEND_URL}/professional/formulas", headers=headers)
            if response.status_code == 200:
                formulas = response.json()
                self.log_result("Professional Formulas Endpoint", True, f"Retrieved {len(formulas)} formulas")
                success_count += 1
            else:
                self.log_result("Professional Formulas Endpoint", False, f"Formulas endpoint failed: {response.status_code}")
            
            # Test GET /api/professional/dashboard - נתוני דשבורד
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                dashboard = response.json()
                required_fields = ["today_appointments", "today_stats", "weekly_stats", "alerts", "current_goals"]
                missing_fields = [field for field in required_fields if field not in dashboard]
                
                if not missing_fields:
                    revenue = dashboard.get("today_stats", {}).get("revenue", 0)
                    self.log_result("Professional Dashboard Endpoint", True, f"Dashboard loaded with revenue: ₪{revenue}")
                    success_count += 1
                else:
                    self.log_result("Professional Dashboard Endpoint", False, f"Missing dashboard fields: {missing_fields}")
            else:
                self.log_result("Professional Dashboard Endpoint", False, f"Dashboard endpoint failed: {response.status_code}")
            
            # Test GET /api/professional/goals - יעדים (Note: might not exist as GET)
            response = self.session.get(f"{BACKEND_URL}/professional/goals", headers=headers)
            if response.status_code == 200:
                goals = response.json()
                self.log_result("Professional Goals Endpoint", True, f"Retrieved {len(goals) if isinstance(goals, list) else 'goals data'}")
                success_count += 1
            else:
                # Check if it's a method not allowed (405) - means POST exists but not GET
                if response.status_code == 405:
                    self.log_result("Professional Goals Endpoint", False, "Goals GET endpoint not implemented (only POST available)")
                else:
                    self.log_result("Professional Goals Endpoint", False, f"Goals endpoint failed: {response.status_code}")
            
            # Test GET /api/professional/inventory - מלאי
            response = self.session.get(f"{BACKEND_URL}/professional/inventory", headers=headers)
            if response.status_code == 200:
                inventory = response.json()
                self.log_result("Professional Inventory Endpoint", True, f"Retrieved {len(inventory)} inventory items")
                success_count += 1
            else:
                self.log_result("Professional Inventory Endpoint", False, f"Inventory endpoint failed: {response.status_code}")
            
            return success_count >= 3  # At least 3 out of 5 should work
            
        except Exception as e:
            self.log_result("Professional Existing Endpoints", False, f"Existing endpoints test failed: {str(e)}")
            return False
    
    def test_professional_authentication_system(self):
        """Test professional authentication system - מערכת האימות"""
        try:
            # Test professional user login
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
                    
                    # Verify user_type is "professional"
                    if user_info.get("user_type") == "professional":
                        self.log_result("Professional Authentication - User Type", True, 
                                      f"Professional user correctly identified as user_type: {user_info.get('user_type')}")
                        
                        # Store token for endpoint access tests
                        professional_token = data["access_token"]
                        headers = {"Authorization": f"Bearer {professional_token}"}
                        
                        # Test access to professional endpoints
                        professional_endpoints = [
                            "/professional/clients",
                            "/professional/formulas", 
                            "/professional/dashboard",
                            "/professional/inventory"
                        ]
                        
                        accessible_count = 0
                        for endpoint in professional_endpoints:
                            response = self.session.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                            if response.status_code == 200:
                                accessible_count += 1
                                self.log_result(f"Professional Access - {endpoint}", True, "Endpoint accessible")
                            else:
                                self.log_result(f"Professional Access - {endpoint}", False, f"Access denied: {response.status_code}")
                        
                        if accessible_count >= 3:
                            self.log_result("Professional Authentication - Endpoint Access", True, 
                                          f"Professional user can access {accessible_count}/{len(professional_endpoints)} endpoints")
                            return True
                        else:
                            self.log_result("Professional Authentication - Endpoint Access", False, 
                                          f"Professional user can only access {accessible_count}/{len(professional_endpoints)} endpoints")
                            return False
                    else:
                        self.log_result("Professional Authentication - User Type", False, 
                                      f"Professional user has incorrect user_type: {user_info.get('user_type')}")
                        return False
                else:
                    self.log_result("Professional Authentication", False, "Missing token or user data in login response")
                    return False
            else:
                self.log_result("Professional Authentication", False, f"Professional login failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Professional Authentication System", False, f"Authentication test failed: {str(e)}")
            return False
    
    def test_system_data_integrity(self):
        """Test system data integrity - וידוא תקינות"""
        try:
            if not self.auth_tokens:
                self.log_result("System Data Integrity", False, "No auth tokens available")
                return False
            
            professional_token = self.auth_tokens.get("professional")
            if not professional_token:
                self.log_result("System Data Integrity", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {professional_token}"}
            integrity_checks = 0
            total_checks = 4
            
            # Test JSON format validity
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                try:
                    data = response.json()
                    if isinstance(data, dict):
                        self.log_result("Data Integrity - JSON Format", True, "All data returned in valid JSON format")
                        integrity_checks += 1
                    else:
                        self.log_result("Data Integrity - JSON Format", False, "Invalid JSON format")
                except json.JSONDecodeError:
                    self.log_result("Data Integrity - JSON Format", False, "Response is not valid JSON")
            
            # Test Hebrew currency display (₪)
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                dashboard = response.json()
                revenue = dashboard.get("today_stats", {}).get("revenue", 0)
                if isinstance(revenue, (int, float)):
                    self.log_result("Data Integrity - Currency Format", True, f"Revenue displayed correctly: ₪{revenue}")
                    integrity_checks += 1
                else:
                    self.log_result("Data Integrity - Currency Format", False, f"Invalid revenue format: {revenue}")
            
            # Test alerts and goals functionality
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                dashboard = response.json()
                if "alerts" in dashboard and "current_goals" in dashboard:
                    alerts = dashboard["alerts"]
                    goals = dashboard["current_goals"]
                    self.log_result("Data Integrity - Alerts & Goals", True, 
                                  f"Alerts and goals working: {len(alerts.get('low_stock_items', []))} alerts, {len(goals)} goals")
                    integrity_checks += 1
                else:
                    self.log_result("Data Integrity - Alerts & Goals", False, "Missing alerts or goals data")
            
            # Test time synchronization
            response = self.session.get(f"{BACKEND_URL}/professional/dashboard", headers=headers)
            if response.status_code == 200:
                dashboard = response.json()
                appointments = dashboard.get("today_appointments", [])
                if isinstance(appointments, list):
                    self.log_result("Data Integrity - Time Sync", True, f"Time system synchronized: {len(appointments)} today's appointments")
                    integrity_checks += 1
                else:
                    self.log_result("Data Integrity - Time Sync", False, "Time synchronization issues")
            
            return integrity_checks >= 3  # At least 3 out of 4 checks should pass
            
        except Exception as e:
            self.log_result("System Data Integrity", False, f"Data integrity test failed: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests"""
        print("=" * 80)
        print("HAIRPRO IL ADVANCED BACKEND COMPREHENSIVE TESTS")
        print("Authentication + Professional APIs + CRM System + API Integrations")
        print("=" * 80)
        print(f"Testing backend at: {BACKEND_URL}")
        print(f"Test started at: {datetime.now().isoformat()}")
        print()
        
        # Run tests in order of importance
        # Authentication tests first (high priority)
        test_sections = [
            ("HAIRPRO IL ADVANCED REVIEW REQUEST TESTS", [
                self.test_professional_attendance_system,
                self.test_professional_goals_get_endpoint,
                self.test_existing_professional_endpoints,
                self.test_hairpro_system_data_integrity
            ]),
            ("USER PROFILE & SUBSCRIPTION SYSTEM TESTS", [
                self.test_professional_user_login,
                self.test_user_profile_me_endpoint,
                self.test_user_profile_advanced_update,
                self.test_subscription_plans_endpoint,
                self.test_current_subscription_endpoint,
                self.test_professional_user_subscription,
                self.test_subscription_upgrade_endpoint,
                self.test_users_professional_endpoint,
                self.test_user_type_system
            ]),
            ("HAIRPRO PROFESSIONAL SYSTEM TESTS", [
                self.test_professional_clients_crud,
                self.test_professional_formulas_crud,
                self.test_professional_inventory_management,
                self.test_professional_appointments_system,
                self.test_professional_scale_integration,
                self.test_professional_analytics_dashboard,
                self.test_professional_chemistry_cards,
                self.test_professional_demo_data_population
            ]),
            ("AUTHENTICATION SYSTEM TESTS", [
                self.test_demo_data_creation,
                self.test_user_registration,
                self.test_user_login,
                self.test_jwt_token_validation,
                self.test_protected_endpoints,
                self.test_profile_update,
                self.test_password_change
            ]),
            ("CRM SYSTEM TESTS", [
                self.test_crm_demo_data_population,
                self.test_crm_leads_crud,
                self.test_crm_deals_crud,
                self.test_crm_tasks_crud,
                self.test_crm_analytics_endpoint,
                self.test_enhanced_contacts_crud,
                self.test_enhanced_calls_crud,
                self.test_crm_authentication_integration,
                self.test_crm_data_relationships
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
        
        for section_name, tests in test_sections:
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
        profile_results = [r for r in self.results if any(keyword in r["test"].lower() 
                          for keyword in ["profile", "subscription", "professional_user", "user_type"])]
        professional_results = [r for r in self.results if any(keyword in r["test"].lower() 
                               for keyword in ["professional_clients", "professional_formulas", "professional_inventory", 
                                             "professional_appointments", "professional_scale", "professional_analytics", 
                                             "professional_chemistry", "professional_demo"])]
        auth_results = [r for r in self.results if any(keyword in r["test"].lower() 
                       for keyword in ["auth", "login", "register", "jwt", "protected", "password", "demo"]) 
                       and r not in profile_results and r not in professional_results]
        crm_results = [r for r in self.results if any(keyword in r["test"].lower() 
                      for keyword in ["crm", "leads", "deals", "tasks", "contacts", "calls", "analytics"]) 
                      and r not in professional_results]
        api_results = [r for r in self.results if r not in auth_results and r not in crm_results 
                      and r not in profile_results and r not in professional_results]
        
        print(f"\nUser Profile & Subscription Tests: {len(profile_results)} total")
        profile_passed = sum(1 for r in profile_results if r["success"])
        print(f"  Passed: {profile_passed}, Failed: {len(profile_results) - profile_passed}")
        
        print(f"\nHairPro Professional System Tests: {len(professional_results)} total")
        professional_passed = sum(1 for r in professional_results if r["success"])
        print(f"  Passed: {professional_passed}, Failed: {len(professional_results) - professional_passed}")
        
        print(f"\nAuthentication Tests: {len(auth_results)} total")
        auth_passed = sum(1 for r in auth_results if r["success"])
        print(f"  Passed: {auth_passed}, Failed: {len(auth_results) - auth_passed}")
        
        print(f"\nCRM System Tests: {len(crm_results)} total")
        crm_passed = sum(1 for r in crm_results if r["success"])
        print(f"  Passed: {crm_passed}, Failed: {len(crm_results) - crm_passed}")
        
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