# Installation Guide

This guide will help you set up the GITAM Education Policy AI development environment.

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+ and pip
- **Docker** and Docker Compose
- **Git**

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd gitam-education-policy-ai
```

### 2. Infrastructure Setup

```bash
# Start all services (Qdrant, Elasticsearch, Neo4j, PostgreSQL)
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .

# Set environment variables
cp .env.example .env
# TODO: Edit .env with your API keys and database URLs
```

**Required Environment Variables:**
```bash
# .env file
OPENAI_API_KEY=your_openai_key_here
QDRANT_URL=http://localhost:6333
ELASTICSEARCH_URL=http://localhost:9200
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password
POSTGRES_URL=postgresql://postgres:password@localhost:5432/gitam_policy
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Install shadcn/ui components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input textarea
```

## Manual Configuration Steps

### Database Setup

1. **PostgreSQL**: Database `gitam_policy` will be created automatically
2. **Neo4j**: Set password in docker-compose.yml or environment
3. **Qdrant**: No initial setup required
4. **Elasticsearch**: No initial setup required

### API Keys Required

- **OpenAI API Key**: For LLM responses (or configure local LLaMA)
- **Optional**: Anthropic Claude, Cohere, or other LLM providers

### Service URLs

All services run on localhost with these ports:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Qdrant: `http://localhost:6333`
- Elasticsearch: `http://localhost:9200`
- Neo4j: `http://localhost:7474` (web), `bolt://localhost:7687` (API)
- PostgreSQL: `localhost:5432`

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Check if ports 3000, 8000, 6333, 9200, 7474, 7687, 5432 are available
2. **Docker Issues**: Ensure Docker Desktop is running
3. **Python Version**: Use Python 3.11+ for compatibility
4. **Node Version**: Use Node.js 18+ for Next.js compatibility

### Reset Environment

```bash
# Stop all services
docker-compose down -v

# Remove all data volumes
docker volume prune

# Restart fresh
docker-compose up -d
```

## Development Tools

### Recommended VS Code Extensions

- Python
- TypeScript and JavaScript
- Docker
- REST Client (for API testing)

### Testing Commands

```bash
# Backend tests
cd backend && python -m pytest

# Frontend tests
cd frontend && npm test

# Linting
cd backend && python -m black .
cd frontend && npm run lint
```

## Next Steps

After installation:
1. See `RUNNING.md` for starting development servers
2. Visit `http://localhost:3000/chat` to test the interface
3. Check the Developer Debug panel for processing traces
4. Review TODO comments in code for integration points
