@echo off
REM GITAM Education Policy AI - Setup Script for Windows
REM This script sets up the complete system with ChromaDB and Ollama integration

echo 🚀 Setting up GITAM Education Policy AI System...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

echo [SUCCESS] Docker and Docker Compose are installed

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -e .
echo [SUCCESS] Backend dependencies installed
cd ..

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd frontend
call npm install
echo [SUCCESS] Frontend dependencies installed
cd ..

REM Start ChromaDB with Docker
echo [INFO] Starting ChromaDB with Docker...
docker-compose up -d chromadb

REM Wait for ChromaDB to be ready
echo [INFO] Waiting for ChromaDB to be ready...
timeout /t 10 /nobreak >nul

REM Check if ChromaDB is responding
curl -s http://localhost:8000/api/v1/heartbeat >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] ChromaDB is running on http://localhost:8000
) else (
    echo [ERROR] ChromaDB failed to start. Check Docker logs: docker-compose logs chromadb
    exit /b 1
)

REM Check if Ollama is running
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Ollama is ready for local model inference
) else (
    echo [WARNING] Ollama not available. Cloud models will be used if API keys are configured.
)

REM Ingest sample data
echo [INFO] Ingesting sample education policy documents...
cd backend
call venv\Scripts\activate.bat
python ingest_sample_data.py
echo [SUCCESS] Sample data ingested successfully
cd ..

REM Start backend service
echo [INFO] Starting backend service...
cd backend
call venv\Scripts\activate.bat
start /b uvicorn backend_app.main:app --host 0.0.0.0 --port 8000 --reload
cd ..

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Check if backend is responding
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Backend is running on http://localhost:8000
) else (
    echo [WARNING] Backend may still be starting...
)

REM Start frontend service
echo [INFO] Starting frontend service...
cd frontend
start /b npm run dev
cd ..

REM Wait for frontend to start
timeout /t 10 /nobreak >nul

echo [SUCCESS] 🎉 GITAM Education Policy AI is now running!
echo.
echo 📋 Service URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo    ChromaDB: http://localhost:8000
echo.
echo 🔧 Management Commands:
echo    Stop all services: stop.bat
echo    View logs: Check console windows
echo    Restart ChromaDB: docker-compose restart chromadb
echo.
echo 📚 Next Steps:
echo    1. Open http://localhost:3000 in your browser
echo    2. Configure API keys in Settings for cloud models
echo    3. Test the system with sample queries
echo    4. Add more documents via the web scraper

pause
