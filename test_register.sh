#!/bin/bash
curl -s -w "\nHTTP_CODE:%{http_code}\n" -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test_user2@example.com","password":"123456","name":"Test User"}'
