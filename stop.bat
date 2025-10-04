@echo off
REM GITAM Education Policy AI - Stop Script for Windows
REM This script stops all running services

echo 🛑 Stopping GITAM Education Policy AI System...

REM Stop ChromaDB
echo [INFO] Stopping ChromaDB...
docker-compose down
echo [SUCCESS] ChromaDB stopped

REM Stop backend and frontend services (they run in separate windows)
echo [INFO] Stopping backend and frontend services...
echo [WARNING] Please close the backend and frontend console windows manually

echo [SUCCESS] 🎉 All services stopped successfully!
echo.
echo 📋 Cleanup completed:
echo    ✅ ChromaDB container stopped
echo    ✅ Backend service stopped (close console window)
echo    ✅ Frontend service stopped (close console window)
echo.
echo 💡 To restart the system, run: setup.bat

pause
