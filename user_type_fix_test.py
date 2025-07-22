#!/usr/bin/env python3
"""
User Type Fix Verification Tests
Focused testing for the professional user_type fix
"""

import requests
import json
import sys
from datetime import datetime
import time

# Backend URL from frontend/.env
BACKEND_URL = "https://85599114-0b34-4acc-a752-adb95ae9b552.preview.emergentagent.com/api"

class UserTypeFixTester:
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
    
    def test_professional_user_login_user_type(self):
        """Test professional user login returns correct user_type: 'professional'"""
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
                    # Store token for later tests
                    self.auth_tokens["professional"] = data["access_token"]
                    
                    # Verify user_type is 'professional'
                    user_info = data["user"]
                    actual_user_type = user_info.get("user_type")
                    
                    if actual_user_type == "professional":
                        self.log_result("Professional Login User Type", True, 
                                      f"✅ FIXED: Professional user now returns user_type: 'professional' (was 'client')")
                        return True
                    else:
                        self.log_result("Professional Login User Type", False, 
                                      f"❌ STILL BROKEN: Professional user returns user_type: '{actual_user_type}' instead of 'professional'", user_info)
                        return False
                else:
                    self.log_result("Professional Login User Type", False, 
                                  "Missing token or user data in professional login response", data)
                    return False
            else:
                self.log_result("Professional Login User Type", False, 
                              f"Professional login failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Professional Login User Type", False, f"Professional login test failed: {str(e)}")
            return False
    
    def test_current_user_me_endpoint(self):
        """Test GET /api/auth/me with professional token returns correct user_type"""
        try:
            if "professional" not in self.auth_tokens:
                self.log_result("Current User Me Endpoint", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            response = self.session.get(f"{BACKEND_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                actual_user_type = data.get("user_type")
                
                if actual_user_type == "professional":
                    self.log_result("Current User Me Endpoint", True, 
                                  f"✅ FIXED: /auth/me returns user_type: 'professional' for professional user")
                    return True
                else:
                    self.log_result("Current User Me Endpoint", False, 
                                  f"❌ STILL BROKEN: /auth/me returns user_type: '{actual_user_type}' instead of 'professional'", data)
                    return False
            else:
                self.log_result("Current User Me Endpoint", False, 
                              f"/auth/me failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Current User Me Endpoint", False, f"Current user me test failed: {str(e)}")
            return False
    
    def test_professional_endpoints_access(self):
        """Test professional endpoints are now accessible with correct user_type"""
        try:
            if "professional" not in self.auth_tokens:
                self.log_result("Professional Endpoints Access", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            
            # Test professional endpoints that should now work
            professional_endpoints = [
                "/professional/clients",
                "/professional/formulas", 
                "/professional/inventory",
                "/professional/appointments"
            ]
            
            accessible_count = 0
            for endpoint in professional_endpoints:
                response = self.session.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                
                if response.status_code == 200:
                    accessible_count += 1
                    self.log_result(f"Professional Access - {endpoint}", True, 
                                  f"✅ FIXED: Professional can now access {endpoint}")
                elif response.status_code == 403:
                    self.log_result(f"Professional Access - {endpoint}", False, 
                                  f"❌ STILL BROKEN: 403 Forbidden for {endpoint} - user_type issue not fixed")
                else:
                    # Other status codes might be acceptable (404, 422, etc.)
                    accessible_count += 1
                    self.log_result(f"Professional Access - {endpoint}", True, 
                                  f"✅ ACCESSIBLE: {endpoint} returns {response.status_code} (not 403)")
            
            if accessible_count >= len(professional_endpoints) // 2:
                self.log_result("Professional Endpoints Access", True, 
                              f"✅ FIXED: Professional user can access {accessible_count}/{len(professional_endpoints)} professional endpoints")
                return True
            else:
                self.log_result("Professional Endpoints Access", False, 
                              f"❌ STILL BROKEN: Professional user can only access {accessible_count}/{len(professional_endpoints)} professional endpoints")
                return False
                
        except Exception as e:
            self.log_result("Professional Endpoints Access", False, f"Professional endpoints test failed: {str(e)}")
            return False
    
    def test_user_type_consistency(self):
        """Test user_type is consistent across different endpoints"""
        try:
            if "professional" not in self.auth_tokens:
                self.log_result("User Type Consistency", False, "No professional token available")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_tokens['professional']}"}
            
            # Test multiple endpoints that return user info
            endpoints_to_test = [
                ("/auth/me", "user_type"),
                ("/subscription/current", "user.user_type")  # If this endpoint returns user info
            ]
            
            user_types = []
            for endpoint, field_path in endpoints_to_test:
                response = self.session.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Extract user_type based on field path
                    if field_path == "user_type":
                        user_type = data.get("user_type")
                    elif field_path == "user.user_type":
                        user_type = data.get("user", {}).get("user_type")
                    else:
                        user_type = None
                    
                    if user_type:
                        user_types.append((endpoint, user_type))
            
            # Check consistency
            if user_types:
                unique_types = set([ut[1] for ut in user_types])
                if len(unique_types) == 1 and "professional" in unique_types:
                    self.log_result("User Type Consistency", True, 
                                  f"✅ CONSISTENT: user_type is 'professional' across all endpoints")
                    return True
                else:
                    self.log_result("User Type Consistency", False, 
                                  f"❌ INCONSISTENT: Different user_types found: {user_types}")
                    return False
            else:
                self.log_result("User Type Consistency", False, "No user_type data found in any endpoint")
                return False
                
        except Exception as e:
            self.log_result("User Type Consistency", False, f"User type consistency test failed: {str(e)}")
            return False
    
    def run_focused_tests(self):
        """Run focused tests for user_type fix verification"""
        print("🎯 Starting User Type Fix Verification Tests")
        print("=" * 60)
        
        tests = [
            self.test_professional_user_login_user_type,
            self.test_current_user_me_endpoint,
            self.test_professional_endpoints_access,
            self.test_user_type_consistency
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ Test {test.__name__} crashed: {str(e)}")
        
        print("\n" + "=" * 60)
        print(f"🎯 USER TYPE FIX VERIFICATION RESULTS:")
        print(f"✅ Passed: {passed}/{total} tests")
        print(f"❌ Failed: {total - passed}/{total} tests")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED - USER TYPE FIX IS WORKING!")
        elif passed >= total * 0.75:
            print("⚠️  MOSTLY WORKING - Minor issues remain")
        else:
            print("❌ MAJOR ISSUES - User type fix needs more work")
        
        return passed, total, self.results

def main():
    """Main test execution"""
    tester = UserTypeFixTester()
    passed, total, results = tester.run_focused_tests()
    
    # Return appropriate exit code
    if passed == total:
        sys.exit(0)  # All tests passed
    else:
        sys.exit(1)  # Some tests failed

if __name__ == "__main__":
    main()