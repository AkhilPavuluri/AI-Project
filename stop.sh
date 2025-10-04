#!/bin/bash

# GITAM Education Policy AI - Stop Script
# This script stops all running services

set -e

echo "🛑 Stopping GITAM Education Policy AI System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Stop frontend service
stop_frontend() {
    if [ -f "frontend/frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend/frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            print_status "Stopping frontend service (PID: $FRONTEND_PID)..."
            kill $FRONTEND_PID
            rm frontend/frontend.pid
            print_success "Frontend service stopped"
        else
            print_warning "Frontend service was not running"
            rm frontend/frontend.pid
        fi
    else
        print_warning "No frontend PID file found"
    fi
}

# Stop backend service
stop_backend() {
    if [ -f "backend/backend.pid" ]; then
        BACKEND_PID=$(cat backend/backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_status "Stopping backend service (PID: $BACKEND_PID)..."
            kill $BACKEND_PID
            rm backend/backend.pid
            print_success "Backend service stopped"
        else
            print_warning "Backend service was not running"
            rm backend/backend.pid
        fi
    else
        print_warning "No backend PID file found"
    fi
}

# Stop ChromaDB
stop_chromadb() {
    print_status "Stopping ChromaDB..."
    docker-compose down
    print_success "ChromaDB stopped"
}

# Main stop function
main() {
    print_status "Stopping all services..."
    
    stop_frontend
    stop_backend
    stop_chromadb
    
    print_success "🎉 All services stopped successfully!"
    echo ""
    echo "📋 Cleanup completed:"
    echo "   ✅ Frontend service stopped"
    echo "   ✅ Backend service stopped"
    echo "   ✅ ChromaDB container stopped"
    echo ""
    echo "💡 To restart the system, run: ./setup.sh"
}

# Run main function
main "$@"
