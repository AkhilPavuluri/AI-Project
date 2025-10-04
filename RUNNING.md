# Running the Development Servers

This guide explains how to start and run the GITAM Education Policy AI development environment.

## Prerequisites

Ensure you've completed the installation steps in `INSTALL.md`.

## Starting the System

### 1. Start Infrastructure Services

```bash
# Start all Docker services
docker-compose up -d

# Check service status
docker-compose ps
```

Expected output:
```
Name                     Command               State           Ports
--------------------------------------------------------------------
gitam-elasticsearch      /usr/local/bin/docker-entrypoint.sh   Up      0.0.0.0:9200->9200/tcp
gitam-neo4j             /startup/docker-entrypoint.sh          Up      0.0.0.0:7474->7474/tcp, 0.0.0.0:7687->7687/tcp
gitam-postgres          docker-entrypoint.sh postgres          Up      0.0.0.0:5432->5432/tcp
gitam-qdrant            /qdrant/qdrant                         Up      0.0.0.0:6333->6333/tcp
```

### 2. Start Backend Server

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

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

## Testing the System

### 1. Backend API Test

```bash
# Test query endpoint
curl -X POST "http://localhost:8000/v1/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the admission policy?"}'

# Expected response:
{
  "answer": "N/A - model not connected",
  "citations": [],
  "processing_trace": {
    "language": "N/A",
    "retrieval": {"dense": [], "sparse": []},
    "kg_traversal": "N/A",
    "controller_iterations": 0
  },
  "risk_assessment": "Coming soon"
}
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

# Stop all Docker services
docker-compose down
```

### Complete Reset

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all Docker volumes
docker volume prune
```

## Monitoring and Logs

### View Service Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f qdrant
docker-compose logs -f elasticsearch
docker-compose logs -f neo4j
docker-compose logs -f postgres
```

### Backend Logs

Backend logs are displayed in the terminal running `uvicorn`. Look for:
- API request/response logs
- Processing trace steps
- Error messages and stack traces

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

1. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :8000  # or :3000, :6333, etc.
   
   # Kill process
   kill -9 <PID>
   ```

2. **Database Connection Errors**
   ```bash
   # Check if services are running
   docker-compose ps
   
   # Restart specific service
   docker-compose restart postgres
   ```

3. **Frontend Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

4. **Backend Import Errors**
   ```bash
   # Reinstall dependencies
   pip install -e .
   ```

### Getting Help

- Check service logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure all required ports are available
- Review TODO comments in code for integration guidance
