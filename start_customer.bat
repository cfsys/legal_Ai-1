@echo off
title Legal AI - Customer Workspace
echo ===================================================
echo Starting Legal AI Customer Backend (Port 5000)...
echo Starting Legal AI Customer Frontend (Port 5173)...
echo ===================================================
start "Customer Backend (5000)" cmd /k "cd /d %~dp0backend\customer && npm start"
timeout /t 2 /nobreak >nul
start "Customer Frontend (5173)" cmd /k "cd /d %~dp0frontend\customer && npm run dev"
echo Customer Workspace running! Navigate to http://localhost:5173
