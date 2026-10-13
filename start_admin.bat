@echo off
title Legal AI - Admin Portal
echo ===================================================
echo Starting Legal AI Admin Backend (Port 5001)...
echo Starting Legal AI Admin Frontend (Port 5174)...
echo ===================================================
start "Admin Backend (5001)" cmd /k "cd /d %~dp0backend\admin && npm start"
timeout /t 2 /nobreak >nul
start "Admin Frontend (5174)" cmd /k "cd /d %~dp0frontend\admin && npm run dev"
echo Admin Suite running! Navigate to http://localhost:5174
