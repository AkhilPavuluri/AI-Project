#!/bin/bash

# GITAM Education Policy AI - Setup Script
# This script sets up the complete system with ChromaDB and Ollama integration

set -e

echo "🚀 Setting up GITAM Education Policy AI System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Ollama is installed and running
check_ollama() {
    if ! command -v ollama &> /dev/null; then
        print_warning "Ollama is not installed. Please install Ollama from https://ollama.ai"
        print_warning "After installation, run: ollama pull deepseek-r1:7b"
        return 1
    fi
    
    # Check if Ollama is running
    if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        print_warning "Ollama is not running. Please start Ollama service."
        print_warning "Run: ollama serve"
        return 1
    fi
    
    print_success "Ollama is installed and running"
    return 0
}

# Install Python dependencies
install_backend_deps() {
    print_status "Installing backend dependencies..."
    
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate || source venv/Scripts/activate
    
    # Install dependencies
    pip install --upgrade pip
    pip install -e .
    
    print_success "Backend dependencies installed"
    cd ..
}

# Install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    
    cd frontend
    npm install
    print_success "Frontend dependencies installed"
    cd ..
}

# Start ChromaDB with Docker
start_chromadb() {
    print_status "Starting ChromaDB with Docker..."
    
    # Start only ChromaDB service
    docker-compose up -d chromadb
    
    # Wait for ChromaDB to be ready
    print_status "Waiting for ChromaDB to be ready..."
    sleep 10
    
    # Check if ChromaDB is responding
    if curl -s http://localhost:8000/api/v1/heartbeat > /dev/null 2>&1; then
        print_success "ChromaDB is running on http://localhost:8000"
    else
        print_error "ChromaDB failed to start. Check Docker logs: docker-compose logs chromadb"
        exit 1
    fi
}

# Ingest sample data
ingest_sample_data() {
    print_status "Ingesting sample education policy documents..."
    
    cd backend
    source venv/bin/activate || source venv/Scripts/activate
    
    python ingest_sample_data.py
    
    print_success "Sample data ingested successfully"
    cd ..
}

# Start backend service
start_backend() {
    print_status "Starting backend service..."
    
    cd backend
    source venv/bin/activate || source venv/Scripts/activate
    
    # Start backend in background
    nohup uvicorn backend_app.main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 5
    
    # Check if backend is responding
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend is running on http://localhost:8000"
        echo $BACKEND_PID > backend.pid
    else
        print_error "Backend failed to start. Check backend.log for errors"
        exit 1
    fi
    
    cd ..
}

# Start frontend service
start_frontend() {
    print_status "Starting frontend service..."
    
    cd frontend
    
    # Start frontend in background
    nohup npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    sleep 10
    
    # Check if frontend is responding
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is running on http://localhost:3000"
        echo $FRONTEND_PID > frontend.pid
    else
        print_warning "Frontend may still be starting. Check frontend.log for status"
    fi
    
    cd ..
}

# Main setup function
main() {
    print_status "Starting GITAM Education Policy AI setup..."
    
    # Check prerequisites
    check_docker
    
    # Install dependencies
    install_backend_deps
    install_frontend_deps
    
    # Start services
    start_chromadb
    
    # Check Ollama (optional)
    if check_ollama; then
        print_success "Ollama is ready for local model inference"
    else
        print_warning "Ollama not available. Cloud models will be used if API keys are configured."
    fi
    
    # Ingest sample data
    ingest_sample_data
    
    # Start application services
    start_backend
    start_frontend
    
    print_success "🎉 GITAM Education Policy AI is now running!"
    echo ""
    echo "📋 Service URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo "   ChromaDB: http://localhost:8000"
    echo ""
    echo "🔧 Management Commands:"
    echo "   Stop all services: ./stop.sh"
    echo "   View logs: tail -f backend/backend.log frontend/frontend.log"
    echo "   Restart ChromaDB: docker-compose restart chromadb"
    echo ""
    echo "📚 Next Steps:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Configure API keys in Settings for cloud models"
    echo "   3. Test the system with sample queries"
    echo "   4. Add more documents via the web scraper"
}

# Run main function
main "$@"
