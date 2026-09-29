@echo off
title AgroAI Precision Agriculture Platform (Next.js)
color 0A
echo =====================================================================
echo   🌱 AGRO-AI: PRECISION CROP & FERTILIZER DECISION PLATFORM
echo   Tech Stack: Next.js + TypeScript + Tailwind CSS
echo =====================================================================
echo.
echo Starting Next.js Web Application on http://localhost:3000 ...
echo.
cd /d "%~dp0"
start http://localhost:3000
npm run dev
pause
