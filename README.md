# GITAM Education Policy AI — High-Accuracy Prototype

A full-stack AI system for querying education policies with high accuracy retrieval, knowledge graph traversal, and comprehensive citation tracking.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Infrastructure │
│   Next.js       │◄──►│   FastAPI       │◄──►│   Vector DB     │
│   TypeScript    │    │   Python        │    │   Knowledge     │
│   Tailwind      │    │   LangChain     │    │   Graph         │
│   shadcn/ui     │    │   Ray/Prefect   │    │   Elasticsearch │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Components

### Frontend (`/frontend`)
- **Next.js App Router** with TypeScript
- **Chat Interface** at `/chat` with real-time messaging
- **Developer Debug Panel** showing processing traces and citations
- **shadcn/ui** components for modern UI

### Backend (`/backend`)
- **FastAPI** REST API with structured endpoints
- **Query Processing** with language detection and routing
- **Retrieval Services** (dense/sparse search placeholders)
- **Knowledge Graph** traversal (Neo4j integration ready)
- **LLM Controller** with iteration tracking

### Infrastructure (`/infra`)
- **Docker Compose** for local development
- **Vector Database** (Qdrant) for embeddings
- **Search Engine** (Elasticsearch) for full-text search
- **Graph Database** (Neo4j) for knowledge relationships
- **PostgreSQL** for metadata and audit logs

## High-Accuracy Implementation Points

### 1. Embedding Pipeline
**Location**: `backend/backend_app/services/retrieval.py`
```python
# TODO: Implement embedding creation
# - Use sentence-transformers or OpenAI embeddings
# - Batch processing for large document sets
# - Caching strategy for repeated queries
```

### 2. Knowledge Graph Ingestion
**Location**: `backend/backend_app/services/kg.py`
```python
# TODO: Implement KG ingestion
# - Extract entities and relationships from policies
# - Use spaCy/NLTK for NLP preprocessing
# - Neo4j Cypher queries for graph operations
```

### 3. LLM Serving Options
**Location**: `backend/backend_app/services/controller.py`
```python
# TODO: Choose LLM serving approach
# Option A: OpenAI API (quick start)
# Option B: Self-hosted LLaMA (privacy)
# Option C: Hybrid approach (local + cloud)
```

### 4. Monitoring & Audit
**Location**: `backend/backend_app/api/schemas.py`
```python
# TODO: Implement audit logging
# - Query tracking with timestamps
# - Citation verification
# - Performance metrics
# - Error rate monitoring
```

## Development Workflow

1. **Start Infrastructure**: `docker-compose up -d`
2. **Install Dependencies**: See `INSTALL.md`
3. **Run Development Servers**: See `RUNNING.md`
4. **Access Chat Interface**: `http://localhost:3000/chat`

## Current Status

🚧 **Prototype Phase** - All endpoints return placeholder data
- ✅ Frontend UI with debug panel
- ✅ Backend API structure
- ✅ Docker infrastructure skeleton
- ⏳ Vector DB integration (Qdrant)
- ⏳ Knowledge Graph (Neo4j)
- ⏳ LLM integration (OpenAI/LLaMA)

## Next Steps

1. Configure environment variables (see `INSTALL.md`)
2. Set up vector database with sample embeddings
3. Implement knowledge graph ingestion pipeline
4. Integrate LLM for response generation
5. Add comprehensive testing and monitoring

## File Structure

```
/
├─ README.md                 # This file
├─ INSTALL.md               # Installation instructions
├─ RUNNING.md               # Development server setup
├─ docker-compose.yml       # Infrastructure services
├─ frontend/                # Next.js application
├─ backend/                 # FastAPI application
├─ .github/workflows/       # CI/CD pipeline
└─ infra/                   # Infrastructure configs
```

## Contributing

See `INSTALL.md` for development setup and `RUNNING.md` for server configuration.
