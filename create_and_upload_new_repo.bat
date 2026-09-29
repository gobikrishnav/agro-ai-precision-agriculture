@echo off
title Create & Upload New Public GitHub Repository - AgroAI
color 0A

echo =====================================================================
echo   🌱 AGRO-AI: CREATE NEW PUBLIC GITHUB REPOSITORY & UPLOAD
echo =====================================================================
echo.

:: 1. Check if gh CLI is installed
where gh >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] GitHub CLI (gh) was not found on your system PATH.
    echo Please install it from https://cli.github.com/ or use Git directly.
    pause
    exit /b 1
)

:: 2. Check Authentication
echo [1/3] Checking GitHub authentication status...
gh auth status >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo You are not currently logged into GitHub.
    echo A browser window will now open for you to authorize GitHub CLI.
    echo Press any key to start browser login...
    pause >nul
    gh auth login --web -h github.com -p https -s repo
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] GitHub login was not completed.
        pause
        exit /b 1
    )
)
echo [OK] Authenticated with GitHub!
echo.

:: 3. Ask for New Repository Name
set DEFAULT_REPO=agro-ai-precision-agriculture
set /p REPO_NAME="Enter new repository name [Default: %DEFAULT_REPO%]: "
if "%REPO_NAME%"=="" set REPO_NAME=%DEFAULT_REPO%

echo.
echo [2/3] Creating public repository '%REPO_NAME%' on your GitHub account...
echo.

:: Check if origin remote needs updating
git remote remove new-repo 2>nul

gh repo create %REPO_NAME% --public --source="%~dp0." --remote=origin --push

if %ERRORLEVEL% equ 0 (
    echo.
    echo =====================================================================
    echo   🎉 SUCCESS! Your new public repository has been created and uploaded:
    echo   https://github.com/%REPO_NAME%
    echo =====================================================================
) else (
    echo.
    echo Notice: If the repo was created but push had a conflict, pushing branch 'main'...
    git push -u origin main
)

echo.
pause
