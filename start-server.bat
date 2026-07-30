@echo off
title AV Media Telangana Platform
color 0A

echo.
echo  ====================================================
echo   AV Media Telangana Platform  -  Starting server...
echo  ====================================================
echo.

:: Change to the directory where this .bat file lives
cd /d "%~dp0"

:: Check node is available
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Print Node version
for /f "tokens=*" %%v in ('node --version') do echo  Node.js %%v detected
echo.

:: Start the server
node server.js

:: If the server exits unexpectedly, pause so the window stays open
echo.
echo  [Platform stopped - press any key to close]
pause >nul
