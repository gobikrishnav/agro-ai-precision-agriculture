@echo off
title Pushing AgroAI Project to GitHub (gobikrishnav)...
color 0A
echo =====================================================================
echo   🌱 AGRO-AI: PUSHING PROJECT TO GITHUB REPOSITORY
echo   User: gobikrishnav
echo   Repo: smart-crop-fertilizer-recommendation-system
echo =====================================================================
echo.
echo Pushing branch 'main' to origin...
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo =====================================================================
    echo   ✅ SUCCESS! Your project has been uploaded to:
    echo   https://github.com/gobikrishnav/smart-crop-fertilizer-recommendation-system
    echo =====================================================================
) else (
    echo.
    echo ---------------------------------------------------------------------
    echo If the push failed because the repository does not exist on GitHub yet:
    echo 1. Go to https://github.com/new
    echo 2. Create a repository named: smart-crop-fertilizer-recommendation-system
    echo 3. Run this script again!
    echo ---------------------------------------------------------------------
)
echo.
pause
