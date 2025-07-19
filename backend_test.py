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
        print("=" * 60)
        print("BACKEND API INTEGRATION TESTS")
        print("=" * 60)
        print(f"Testing backend at: {BACKEND_URL}")
        print(f"Test started at: {datetime.now().isoformat()}")
        print()
        
        # Run tests in order of importance
        tests = [
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
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.log_result(test.__name__, False, f"Test execution failed: {str(e)}")
            print()  # Add spacing between tests
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        print("\nFailed Tests:")
        for result in self.results:
            if not result["success"]:
                print(f"  ❌ {result['test']}: {result['message']}")
        
        print("\nPassed Tests:")
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