# GITAM Education Policy AI

A comprehensive AI-powered system for querying education policies using ChromaDB for vector storage and Ollama for local LLM inference, with support for cloud-based models.

## 🚀 Features

- **Vector Database**: ChromaDB for efficient document storage and similarity search
- **LLM Integration**: Support for Ollama (local) and cloud models (OpenAI, Anthropic, Gemini)
- **Web Scraping**: Advanced web scraping capabilities for government education websites
- **Real-time Chat**: Interactive chat interface with model selection
- **Document Management**: Upload, index, and search education policy documents
- **API Documentation**: Comprehensive API documentation with Swagger UI

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   ChromaDB      │
│   (Next.js)     │◄──►│   (FastAPI)      │◄──►│   (Vector DB)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Ollama        │
                       │   (Local LLM)   │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Cloud APIs    │
                       │   (OpenAI, etc) │
                       └─────────────────┘
```

## 📋 Prerequisites

- **Docker Desktop** (for ChromaDB)
- **Node.js 18+** (for frontend)
- **Python 3.11+** (for backend)
- **Ollama** (optional, for local models)

## 🛠️ Installation

### Quick Start (Windows)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gitam-education-policy-ai
   ```

2. **Run the setup script**
   ```bash
   setup.bat
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Manual Setup

1. **Start ChromaDB**
   ```bash
   docker-compose up -d chromadb
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -e .
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Ingest Sample Data**
   ```bash
   cd backend
   source venv/bin/activate
   python ingest_sample_data.py
   ```

5. **Start Services**
   ```bash
   # Backend
   cd backend
   source venv/bin/activate
   uvicorn backend_app.main:app --host 0.0.0.0 --port 8000 --reload

   # Frontend (in another terminal)
   cd frontend
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# ChromaDB Configuration
CHROMA_HOST=localhost
CHROMA_PORT=8000
CHROMA_COLLECTION=gitam_policy_documents

# Ollama Configuration
OLLAMA_URL=http://localhost:11434

# Cloud API Keys (optional)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key

# Model Configuration
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
DEFAULT_MODEL=deepseek-r1:7b
TEMPERATURE=0.1
MAX_ITERATIONS=3
```

### Ollama Setup (Optional)

1. **Install Ollama**
   ```bash
   # Visit https://ollama.ai for installation instructions
   ```

2. **Pull Models**
   ```bash
   ollama pull deepseek-r1:7b
   ollama pull llama3.1:8b
   ollama pull qwen2.5:7b
   ```

3. **Start Ollama Service**
   ```bash
   ollama serve
   ```

## 📚 Usage

### Web Interface

1. **Open the application**: http://localhost:3000
2. **Select a model** from the top bar (Ollama or cloud models)
3. **Ask questions** about education policies
4. **Configure settings** for API keys and preferences

### API Usage

#### Query Education Policies

```bash
curl -X POST "http://localhost:8000/v1/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the admission requirements for B.Tech programs?",
    "model": "deepseek-r1:7b"
  }'
```

#### Web Scraping

```bash
curl -X POST "http://localhost:8000/v1/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.ugc.gov.in/",
    "method": "auto"
  }'
```

#### Document Ingestion

```bash
curl -X POST "http://localhost:8000/v1/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Policy Document",
    "content": "Document content here...",
    "metadata": {"source": "manual", "type": "policy"}
  }'
```

## 🔍 API Endpoints

### Core Endpoints

- `POST /v1/query` - Query education policies
- `GET /v1/document/{id}` - Retrieve document by ID
- `POST /v1/ingest` - Ingest new documents
- `POST /v1/feedback` - Submit user feedback
- `GET /v1/status` - System status

### Web Scraping Endpoints

- `POST /v1/scrape` - Scrape single URL
- `POST /v1/scrape/batch` - Scrape multiple URLs
- `POST /v1/scrape/government` - Scrape government sites
- `GET /v1/scrape/health` - Scraper health check

### Health Endpoints

- `GET /health` - Overall system health
- `GET /docs` - API documentation (Swagger UI)

## 🧪 Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

### End-to-End Testing

1. **Start all services**
2. **Open the web interface**
3. **Test model selection**
4. **Ask sample questions**
5. **Verify responses**

## 📊 Sample Queries

Try these sample queries to test the system:

- "What are the admission requirements for B.Tech programs?"
- "How does the scholarship application process work?"
- "What is the grading system for undergraduate courses?"
- "What are the hostel rules and regulations?"
- "How can I apply for research funding?"

## 🔧 Troubleshooting

### Common Issues

1. **ChromaDB Connection Error**
   ```bash
   # Check if ChromaDB is running
   docker-compose ps
   docker-compose logs chromadb
   ```

2. **Ollama Connection Error**
   ```bash
   # Check if Ollama is running
   curl http://localhost:11434/api/tags
   ```

3. **Backend Import Errors**
   ```bash
   # Reinstall dependencies
   cd backend
   pip install -e .
   ```

4. **Frontend Build Errors**
   ```bash
   # Clear cache and reinstall
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs

- **Backend logs**: `backend/backend.log`
- **Frontend logs**: `frontend/frontend.log`
- **ChromaDB logs**: `docker-compose logs chromadb`

## 🚀 Deployment

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Production Configuration

1. **Update environment variables**
2. **Configure reverse proxy (nginx)**
3. **Set up SSL certificates**
4. **Configure monitoring and logging**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **ChromaDB** for vector database capabilities
- **Ollama** for local LLM inference
- **FastAPI** for the backend framework
- **Next.js** for the frontend framework
- **GITAM** for the education policy domain

## 📞 Support

For support and questions:

- **Documentation**: Check the API docs at http://localhost:8000/docs
- **Issues**: Create an issue on GitHub
- **Email**: ai-team@gitam.edu

---

**Made with ❤️ by the GITAM AI Team**