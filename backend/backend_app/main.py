"""
Main FastAPI application for GITAM Education Policy AI Backend

This module sets up the FastAPI app with CORS, middleware, and route configuration.
All endpoints return placeholder data until vector DB, KG, and LLM services are integrated.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="GITAM Education Policy AI",
    description="High-accuracy AI system for querying education policies",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend development server
        "http://127.0.0.1:3000",
        # TODO: Add production frontend URLs
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import API routes
from backend_app.api.v1 import router as v1_router

# Include API routes
app.include_router(v1_router, prefix="/v1")

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "GITAM Education Policy AI Backend",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc",
        "note": "This is a prototype. All endpoints return placeholder data."
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    from backend_app.services.chromadb_service import ChromaDBService
    from backend_app.services.ollama_service import OllamaService
    
    try:
        # Check ChromaDB health
        chromadb_service = ChromaDBService()
        chromadb_health = await chromadb_service.health_check()
        
        # Check Ollama health
        ollama_service = OllamaService()
        ollama_health = await ollama_service.health_check()
        
        return {
            "status": "healthy",
            "services": {
                "api": "running",
                "vector_db": "connected" if chromadb_health.get('chromadb', {}).get('status') == 'connected' else "not_connected",
                "llm_service": "connected" if ollama_health.get('ollama', {}).get('status') == 'connected' else "not_connected",
                "search_engine": "not_connected",  # TODO: Implement search engine
                "knowledge_graph": "not_connected",  # TODO: Implement knowledge graph
            },
            "details": {
                "chromadb": chromadb_health,
                "ollama": ollama_health
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "degraded",
            "services": {
                "api": "running",
                "vector_db": "error",
                "llm_service": "error",
                "search_engine": "not_connected",
                "knowledge_graph": "not_connected",
            },
            "error": str(e)
        }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "details": "N/A"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend_app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
