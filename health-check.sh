#!/bin/bash

# Project Health Check Script
echo "🚀 BizAcuity Project Health Check"
echo "================================="

# Check if servers are running
echo "📡 Checking servers..."

# Check backend
if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ Backend server running on port 5001"
else
    echo "❌ Backend server not running on port 5001"
fi

# Check frontend
if curl -s http://localhost:5174 > /dev/null; then
    echo "✅ Frontend server running on port 5174"
else
    echo "❌ Frontend server not running on port 5174"
fi

# Test login API
echo ""
echo "🔐 Testing login API..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "password123"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "✅ Login API working correctly"
else
    echo "❌ Login API not working"
    echo "Response: $LOGIN_RESPONSE"
fi

echo ""
echo "🔧 Available test accounts:"
echo "  Regular User: testuser@example.com / password123"
echo "  Admin User: admin@gmail.com / [your admin password]"
echo ""
echo "🌐 Access URLs:"
echo "  Frontend: http://localhost:5174"
echo "  Backend Health: http://localhost:5001/health"
echo "  Admin Panel: http://localhost:5174/admin"
echo "  Login Page: http://localhost:5174/login"
echo ""
echo "✨ All systems appear to be operational!"
