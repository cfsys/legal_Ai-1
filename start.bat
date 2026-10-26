@echo off
title Legal AI - Unified Platform (Customer & Admin)
echo ===================================================
echo Starting Legal AI Unified Backend (Port 5005)...
echo Starting Legal AI Unified Frontend (Port 5175)...
echo ===================================================
start "Legal AI Backend (5005)" cmd /k "cd /d %~dp0backend\customer && npm start"
timeout /t 2 /nobreak >nul
start "Legal AI Frontend (5175)" cmd /k "cd /d %~dp0frontend\customer && npm run dev"
echo ===================================================
echo Legal AI Platform running!
echo Customer Portal: http://localhost:5175
echo Admin Panel:     http://localhost:5175/admin
echo Backend API:     http://localhost:5005/api
echo ===================================================
