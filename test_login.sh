#!/bin/bash
curl -s -w "\nHTTP_CODE:%{http_code}\n" -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"3818838587@qq.com","password":"1234567"}'
