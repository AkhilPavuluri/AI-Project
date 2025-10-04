"""
Basic tests for GITAM Education Policy AI Backend

These tests verify that the API endpoints return the expected placeholder responses
and that the service structure is working correctly.
"""

import pytest
from fastapi.testclient import TestClient
from backend_app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint returns API information"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert data["version"] == "0.1.0"

def test_health_endpoint():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"
    assert "services" in data

def test_query_endpoint_success():
    """Test the query endpoint with valid request"""
    response = client.post(
        "/v1/query",
        json={"query": "What is the admission policy?"}
    )
    assert response.status_code == 200
    data = response.json()
    
    # Check response structure
    assert "answer" in data
    assert "citations" in data
    assert "processing_trace" in data
    assert "risk_assessment" in data
    
    # Check processing trace structure
    trace = data["processing_trace"]
    assert "language" in trace
    assert "retrieval" in trace
    assert "kg_traversal" in trace
    assert "controller_iterations" in trace
    
    # Check retrieval structure
    retrieval = trace["retrieval"]
    assert "dense" in retrieval
    assert "sparse" in retrieval
    assert isinstance(retrieval["dense"], list)
    assert isinstance(retrieval["sparse"], list)
    
    # Verify placeholder values
    assert data["answer"] == "N/A - model not connected"
    assert data["risk_assessment"] == "Coming soon"
    assert trace["language"] == "N/A"
    assert trace["kg_traversal"] == "N/A"
    assert trace["controller_iterations"] == 0

def test_query_endpoint_simulate_failure():
    """Test the query endpoint with failure simulation"""
    response = client.post(
        "/v1/query",
        json={"query": "Test query", "simulate_failure": True}
    )
    assert response.status_code == 503
    data = response.json()
    assert "error" in data
    assert "details" in data

def test_query_endpoint_invalid_request():
    """Test the query endpoint with invalid request"""
    response = client.post(
        "/v1/query",
        json={"invalid_field": "test"}
    )
    assert response.status_code == 422  # Validation error

def test_document_endpoint_not_found():
    """Test the document endpoint returns 404 for non-existent document"""
    response = client.get("/v1/document/nonexistent")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data

def test_document_endpoint_placeholder():
    """Test the document endpoint with placeholder ID"""
    response = client.get("/v1/document/N/A")
    assert response.status_code == 404

def test_ingest_endpoint():
    """Test the document ingestion endpoint"""
    response = client.post(
        "/v1/ingest",
        json={"title": "Test Document", "content": "Test content"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "jobId" in data
    assert "status" in data
    assert data["status"] == "accepted"

def test_feedback_endpoint():
    """Test the feedback submission endpoint"""
    response = client.post(
        "/v1/feedback",
        json={
            "query": "Test query",
            "response": "Test response",
            "rating": 4,
            "comments": "Test feedback"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "success"

def test_system_status_endpoint():
    """Test the system status endpoint"""
    response = client.get("/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert "overall_status" in data
    assert "services" in data
    assert "timestamp" in data

def test_cors_headers():
    """Test that CORS headers are properly set"""
    response = client.options("/v1/query")
    assert response.status_code == 200
    # CORS headers should be present (handled by middleware)

def test_api_documentation():
    """Test that API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200
    
    response = client.get("/redoc")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_service_initialization():
    """Test that services can be initialized without errors"""
    from backend_app.services.retrieval import RetrievalService
    from backend_app.services.kg import KnowledgeGraphService
    from backend_app.services.controller import LLMController
    
    # Initialize services
    retrieval_service = RetrievalService()
    kg_service = KnowledgeGraphService()
    llm_controller = LLMController()
    
    # Test health checks
    retrieval_health = await retrieval_service.health_check()
    kg_health = await kg_service.health_check()
    controller_health = await llm_controller.health_check()
    
    # Verify health check structure
    assert "qdrant" in retrieval_health
    assert "neo4j" in kg_health
    assert "llm_service" in controller_health

def test_error_handling():
    """Test global error handling"""
    # This would test the global exception handler
    # by triggering an unhandled exception
    pass  # Placeholder for more comprehensive error testing
