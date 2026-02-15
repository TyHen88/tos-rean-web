#!/bin/bash

# Authentication System Test Suite
# This script tests all authentication flows to verify they work correctly

echo "=================================================="
echo "TosRean Authentication System Test Suite"
echo "=================================================="
echo ""

API_URL="http://localhost:3300/api"
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_PASSWORD="testpassword123"
TEST_NAME="Test User"

echo "Test Configuration:"
echo "  API URL: $API_URL"
echo "  Test Email: $TEST_EMAIL"
echo "  Test Password: $TEST_PASSWORD"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test manual registration
test_manual_registration() {
    echo "=================================================="
    echo "Test 1: Manual Registration (Database Only)"
    echo "=================================================="
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$TEST_EMAIL\",
            \"password\": \"$TEST_PASSWORD\",
            \"name\": \"$TEST_NAME\",
            \"role\": \"STUDENT\"
        }")
    
    echo "Response:"
    echo "$RESPONSE" | jq .
    echo ""
    
    # Check if registration was successful
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    if [ "$SUCCESS" = "true" ]; then
        echo -e "${GREEN}✓ PASSED${NC}: User registered successfully"
        PASSED=$((PASSED + 1))
        
        # Extract and save token for later tests
        TOKEN=$(echo "$RESPONSE" | jq -r '.data.token')
        echo "  Token saved: ${TOKEN:0:20}..."
        
        # Check that firebaseUid is not in response (should be null)
        FIREBASE_UID=$(echo "$RESPONSE" | jq -r '.data.user.firebaseUid')
        if [ "$FIREBASE_UID" = "null" ]; then
            echo -e "${GREEN}✓ PASSED${NC}: firebaseUid is NULL (correct for manual registration)"
            PASSED=$((PASSED + 1))
        else
            echo -e "${RED}✗ FAILED${NC}: firebaseUid should be NULL but is: $FIREBASE_UID"
            FAILED=$((FAILED + 1))
        fi
    else
        echo -e "${RED}✗ FAILED${NC}: Registration failed"
        FAILED=$((FAILED + 1))
        return 1
    fi
    echo ""
}

# Function to test manual login
test_manual_login() {
    echo "=================================================="
    echo "Test 2: Manual Login (Database Only)"
    echo "=================================================="
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$TEST_EMAIL\",
            \"password\": \"$TEST_PASSWORD\"
        }")
    
    echo "Response:"
    echo "$RESPONSE" | jq .
    echo ""
    
    # Check if login was successful
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    if [ "$SUCCESS" = "true" ]; then
        echo -e "${GREEN}✓ PASSED${NC}: User logged in successfully"
        PASSED=$((PASSED + 1))
        
        # Extract token
        TOKEN=$(echo "$RESPONSE" | jq -r '.data.token')
        echo "  Token: ${TOKEN:0:20}..."
        
        # Check that passwordHash is not in response
        PASSWORD_HASH=$(echo "$RESPONSE" | jq -r '.data.user.passwordHash')
        if [ "$PASSWORD_HASH" = "null" ] || [ -z "$PASSWORD_HASH" ]; then
            echo -e "${GREEN}✓ PASSED${NC}: passwordHash not exposed in response"
            PASSED=$((PASSED + 1))
        else
            echo -e "${RED}✗ FAILED${NC}: passwordHash should not be in response"
            FAILED=$((FAILED + 1))
        fi
        
        # Save token for next test
        export AUTH_TOKEN="$TOKEN"
    else
        echo -e "${RED}✗ FAILED${NC}: Login failed"
        FAILED=$((FAILED + 1))
        return 1
    fi
    echo ""
}

# Function to test wrong password
test_wrong_password() {
    echo "=================================================="
    echo "Test 3: Login with Wrong Password"
    echo "=================================================="
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$TEST_EMAIL\",
            \"password\": \"wrongpassword\"
        }")
    
    echo "Response:"
    echo "$RESPONSE" | jq .
    echo ""
    
    # Check that login failed
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    if [ "$SUCCESS" = "false" ]; then
        echo -e "${GREEN}✓ PASSED${NC}: Login correctly rejected with wrong password"
        PASSED=$((PASSED + 1))
        
        # Check error code
        CODE=$(echo "$RESPONSE" | jq -r '.code')
        if [ "$CODE" = "AUTH_005" ]; then
            echo -e "${GREEN}✓ PASSED${NC}: Correct error code (AUTH_005)"
            PASSED=$((PASSED + 1))
        else
            echo -e "${YELLOW}⚠ WARNING${NC}: Expected error code AUTH_005, got: $CODE"
        fi
    else
        echo -e "${RED}✗ FAILED${NC}: Login should have failed with wrong password"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

# Function to test duplicate registration
test_duplicate_registration() {
    echo "=================================================="
    echo "Test 4: Duplicate Registration"
    echo "=================================================="
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$TEST_EMAIL\",
            \"password\": \"$TEST_PASSWORD\",
            \"name\": \"$TEST_NAME\",
            \"role\": \"STUDENT\"
        }")
    
    echo "Response:"
    echo "$RESPONSE" | jq .
    echo ""
    
    # Check that registration failed
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    if [ "$SUCCESS" = "false" ]; then
        echo -e "${GREEN}✓ PASSED${NC}: Duplicate registration correctly rejected"
        PASSED=$((PASSED + 1))
        
        # Check error code
        CODE=$(echo "$RESPONSE" | jq -r '.code')
        if [ "$CODE" = "AUTH_006" ]; then
            echo -e "${GREEN}✓ PASSED${NC}: Correct error code (AUTH_006)"
            PASSED=$((PASSED + 1))
        else
            echo -e "${YELLOW}⚠ WARNING${NC}: Expected error code AUTH_006, got: $CODE"
        fi
    else
        echo -e "${RED}✗ FAILED${NC}: Duplicate registration should have failed"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

# Function to test get current user
test_get_me() {
    echo "=================================================="
    echo "Test 5: Get Current User (Protected Route)"
    echo "=================================================="
    
    if [ -z "$AUTH_TOKEN" ]; then
        echo -e "${RED}✗ FAILED${NC}: No auth token available from previous tests"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    echo "Response:"
    echo "$RESPONSE" | jq .
    echo ""
    
    # Check if request was successful
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    if [ "$SUCCESS" = "true" ]; then
        echo -e "${GREEN}✓ PASSED${NC}: Successfully retrieved user profile"
        PASSED=$((PASSED + 1))
        
        # Check that email matches
        EMAIL=$(echo "$RESPONSE" | jq -r '.data.email')
        if [ "$EMAIL" = "$TEST_EMAIL" ]; then
            echo -e "${GREEN}✓ PASSED${NC}: Email matches registered user"
            PASSED=$((PASSED + 1))
        else
            echo -e "${RED}✗ FAILED${NC}: Email mismatch. Expected: $TEST_EMAIL, Got: $EMAIL"
            FAILED=$((FAILED + 1))
        fi
    else
        echo -e "${RED}✗ FAILED${NC}: Failed to retrieve user profile"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

# Function to test unauthorized access
test_unauthorized_access() {
    echo "=================================================="
    echo "Test 6: Unauthorized Access (No Token)"
    echo "=================================================="
    
    RESPONSE=$(curl -s -X GET "$API_URL/auth/me")
    
    echo "Response:"
    echo "$RESPONSE" | jq .
    echo ""
    
    # Check that request failed
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    if [ "$SUCCESS" = "false" ]; then
        echo -e "${GREEN}✓ PASSED${NC}: Unauthorized access correctly rejected"
        PASSED=$((PASSED + 1))
        
        # Check for appropriate message
        MESSAGE=$(echo "$RESPONSE" | jq -r '.message')
        if [[ "$MESSAGE" == *"token"* ]] || [[ "$MESSAGE" == *"authorization"* ]]; then
            echo -e "${GREEN}✓ PASSED${NC}: Appropriate error message"
            PASSED=$((PASSED + 1))
        fi
    else
        echo -e "${RED}✗ FAILED${NC}: Should have rejected unauthorized access"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

# Run all tests
echo "Starting tests..."
echo ""

test_manual_registration
test_manual_login
test_wrong_password
test_duplicate_registration
test_get_me
test_unauthorized_access

# Print summary
echo "=================================================="
echo "Test Summary"
echo "=================================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
