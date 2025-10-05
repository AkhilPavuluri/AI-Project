# Running the Development Servers

This guide explains how to start and run the GITAM Education Policy AI development environment.

## Prerequisites

Ensure you've completed the installation steps in `INSTALL.md`.

## Starting the System

### 1. Start ChromaDB Service

```bash
# Start ChromaDB on port 8001
docker-compose up -d chromadb

# Verify ChromaDB is running
curl http://localhost:8001/api/v2/heartbeat
```

Expected output: `{"nanosecond heartbeat": <timestamp>}`

### 2. Start Backend Server

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Linux/Mac

# Start FastAPI development server
uvicorn backend_app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### 3. Start Frontend Server

```bash
cd frontend

# Start Next.js development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## Port Configuration

- **Backend**: `8000`
- **Frontend**: `3000` 
- **ChromaDB**: `8001`

## Testing the System

### 1. Backend API Test

```bash
# Test query endpoint (PowerShell)
Invoke-RestMethod -Uri "http://localhost:8000/v1/query" -Method POST -ContentType "application/json" -Body '{"query": "test query"}'

# Test query endpoint (curl)
curl -X POST "http://localhost:8000/v1/query" -H "Content-Type: application/json" -d "{\"query\": \"test query\"}"
```

Expected response:
```json
{
  "answer": "I apologize, but I encountered an error while processing your query: ",
  "citations": [],
  "processing_trace": {
    "language": "N/A",
    "retrieval": {"dense": [], "sparse": []},
    "kg_traversal": "N/A",
    "controller_iterations": 1
  },
  "risk_assessment": "Coming soon"
}
```

### 2. Verify Services

```bash
# Check if backend is running
netstat -an | findstr :8000

# Check if ChromaDB is running  
netstat -an | findstr :8001

# Test ChromaDB health
curl http://localhost:8001/api/v2/heartbeat
```

### 2. Frontend Interface Test

1. Open `http://localhost:3000/chat`
2. Type a test query: "What are the admission requirements?"
3. Click "Send" to submit
4. Open the Developer Debug panel to see processing traces
5. Verify all fields show "N/A" or "Coming soon" placeholders

### 3. Developer Debug Panel

The debug panel shows:
- **Query Planner**: Language detection and routing
- **Retrieval Candidates**: Dense/sparse search results
- **LLM Controller**: Iteration count and next actions
- **Citations**: Document references (all "N/A")
- **Error Status**: Highlighted warnings for placeholder data

## Development Workflow

### Hot Reloading

Both servers support hot reloading:
- **Backend**: FastAPI auto-reloads on Python file changes
- **Frontend**: Next.js auto-reloads on TypeScript/React changes

### API Documentation

FastAPI provides automatic API documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Database Management

```bash
# Access PostgreSQL
docker exec -it gitam-postgres psql -U postgres -d gitam_policy

# Access Neo4j Browser
open http://localhost:7474

# Access Qdrant Dashboard
open http://localhost:6333/dashboard

# Access Elasticsearch
curl http://localhost:9200/_cluster/health
```

## Stopping the System

### Graceful Shutdown

```bash
# Stop frontend (Ctrl+C in terminal)
# Stop backend (Ctrl+C in terminal)

# Stop ChromaDB service
docker-compose down chromadb
```

### Complete Reset

```bash
# Stop and remove ChromaDB container and volumes
docker-compose down -v chromadb

# Remove all Docker volumes (if needed)
docker volume prune
```

## Monitoring and Logs

### View Service Logs

```bash
# ChromaDB logs
docker-compose logs -f chromadb
```

### Backend Logs

Backend logs are displayed in the terminal running `uvicorn`. Look for:
- ✅ ChromaDB connection: `HTTP Request: GET http://localhost:8001/api/v2/auth/identity "HTTP/1.1 200 OK"`
- ✅ Service initialization: `ChromaDB service initialized with collection: gitam_policy_documents`
- ✅ Server startup: `Application startup complete`

### Frontend Logs

Frontend logs are displayed in the terminal running `npm run dev`. Look for:
- Next.js compilation messages
- API call logs
- React component errors

## Production Considerations

### Environment Variables

For production deployment:
1. Set `NODE_ENV=production` for frontend
2. Set `ENVIRONMENT=production` for backend
3. Configure proper database URLs and credentials
4. Set up SSL/TLS certificates
5. Configure reverse proxy (nginx)

### Performance Monitoring

TODO: Add monitoring tools:
- Prometheus metrics
- Grafana dashboards
- Application performance monitoring (APM)

## Troubleshooting

### Common Issues

1. **ChromaDB Connection Error**
   ```
   ValueError: Could not connect to a Chroma server. Are you sure it is running?
   ```
   **Solution:**
   ```bash
   # Start ChromaDB service
   docker-compose up -d chromadb
   
   # Verify it's running on port 8001
   curl http://localhost:8001/api/v2/heartbeat
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port (Windows)
   netstat -an | findstr :8000
   
   # Kill process (Windows)
   taskkill /PID <PID> /F
   ```

3. **Backend Not Starting in Virtual Environment**
   ```bash
   # Make sure to activate virtual environment first
   cd backend
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   
   # Then start backend
   uvicorn backend_app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Frontend Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

### Getting Help

- Check service logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure all required ports are available
- Review TODO comments in code for integration guidance
