@echo off
title Legal AI - Unified Platform (Customer & Admin)
echo ===================================================
echo Starting Legal AI Unified Backend (Port 5000)...
echo Starting Legal AI Unified Frontend (Port 5173)...
echo ===================================================
start "Legal AI Backend (5000)" cmd /k "cd /d %~dp0backend\customer && npm start"
timeout /t 2 /nobreak >nul
start "Legal AI Frontend (5173)" cmd /k "cd /d %~dp0frontend\customer && npm run dev"
echo ===================================================
echo Legal AI Platform running!
echo Customer Portal: http://localhost:5173
echo Admin Panel:     http://localhost:5173/admin
echo Backend API:     http://localhost:5000/api
echo ===================================================
