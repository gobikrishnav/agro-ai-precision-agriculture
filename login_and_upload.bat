@echo off
title GitHub 1-Click Upload for gobikrishnav
color 0A
echo =====================================================================
echo   🌱 AGRO-AI: AUTOMATIC GITHUB REPOSITORY CREATOR & UPLOADER
echo   Target Account: gobikrishnav
echo =====================================================================
echo.
echo Step 1: Checking GitHub authentication...
"%~dp0gh_bin\bin\gh.exe" auth status >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo Please authenticate with GitHub in the browser window that opens.
    echo Press ENTER to open GitHub login...
    pause >nul
    "%~dp0gh_bin\bin\gh.exe" auth login --web -h github.com -p https -s repo
)

echo.
echo =====================================================================
echo Step 2: Creating repository 'smart-crop-fertilizer-recommendation-system' on GitHub and pushing all code...
echo =====================================================================
"%~dp0gh_bin\bin\gh.exe" repo create smart-crop-fertilizer-recommendation-system --public --source="%~dp0." --remote=origin --push

if %ERRORLEVEL% equ 0 (
    echo.
    echo =====================================================================
    echo   🎉 SUCCESS! Project uploaded to:
    echo   https://github.com/gobikrishnav/smart-crop-fertilizer-recommendation-system
    echo =====================================================================
) else (
    echo.
    echo Push attempted. Running git push as backup...
    git push -u origin main
)

echo.
pause
