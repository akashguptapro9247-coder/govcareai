@echo off
echo Starting GovCareAI Backend Server...
echo ======================================

cd /d "%~dp0backend"

echo Installing dependencies (if not already installed)...
npm install

echo.
echo Starting server on port 5000...
echo Access the API at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

npm start

pause