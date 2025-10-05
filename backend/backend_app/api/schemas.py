"""
Pydantic schemas for API request/response models

These schemas define the structure of data exchanged between frontend and backend.
All fields include proper validation and documentation.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Request Models

class QueryRequest(BaseModel):
    """Request model for query endpoint"""
    query: str = Field(..., description="User query about education policies", min_length=1, max_length=1000)
    simulate_failure: Optional[bool] = Field(False, description="Simulate error response for testing")
    model: Optional[str] = Field("deepseek-r1:7b", description="AI model to use for response generation")
    thinking_mode: Optional[str] = Field("smart", description="Thinking mode: smart, general, deep, reasoning")

class DocumentRequest(BaseModel):
    """Request model for document ingestion"""
    title: str = Field(..., description="Document title", min_length=1, max_length=200)
    content: str = Field(..., description="Document content", min_length=1)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional document metadata")
    source: Optional[str] = Field(None, description="Document source URL or path")

class FeedbackRequest(BaseModel):
    """Request model for user feedback"""
    query: str = Field(..., description="Original query", min_length=1, max_length=1000)
    response: str = Field(..., description="AI response", min_length=1)
    rating: int = Field(..., description="User rating (1-5)", ge=1, le=5)
    comments: Optional[str] = Field(None, description="Additional comments", max_length=1000)

# Response Models

class Citation(BaseModel):
    """Citation model for document references"""
    docId: str = Field(..., description="Document identifier")
    page: int = Field(..., description="Page number", ge=1)
    span: str = Field(..., description="Text span or section reference")

class RetrievalResult(BaseModel):
    """Retrieval result model"""
    dense: List[str] = Field(default_factory=list, description="Dense retrieval candidates")
    sparse: List[str] = Field(default_factory=list, description="Sparse retrieval candidates")

class ProcessingTrace(BaseModel):
    """Processing trace model for debugging"""
    language: str = Field(..., description="Detected language")
    retrieval: RetrievalResult = Field(..., description="Retrieval results")
    kg_traversal: str = Field(..., description="Knowledge graph traversal result")
    controller_iterations: int = Field(..., description="Number of LLM controller iterations")

class QueryResponse(BaseModel):
    """Response model for query endpoint"""
    answer: str = Field(..., description="AI-generated answer")
    citations: List[Citation] = Field(default_factory=list, description="Document citations")
    processing_trace: ProcessingTrace = Field(..., description="Processing trace for debugging")
    risk_assessment: str = Field(..., description="Risk assessment result")

class DocumentResponse(BaseModel):
    """Response model for document endpoint"""
    id: str = Field(..., description="Document identifier")
    title: str = Field(..., description="Document title")
    content: str = Field(..., description="Document content")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Document metadata")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

class IngestResponse(BaseModel):
    """Response model for document ingestion"""
    jobId: str = Field(..., description="Ingestion job identifier")
    status: str = Field(..., description="Job status")
    message: str = Field(..., description="Status message")

class FeedbackResponse(BaseModel):
    """Response model for feedback submission"""
    status: str = Field(..., description="Submission status")
    message: str = Field(..., description="Status message")

# Error Models

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str = Field(..., description="Error message")
    details: str = Field(..., description="Error details")

# Service Status Models

class ServiceStatus(BaseModel):
    """Service status model"""
    name: str = Field(..., description="Service name")
    status: str = Field(..., description="Service status")
    url: Optional[str] = Field(None, description="Service URL")
    last_check: Optional[datetime] = Field(None, description="Last health check")

class SystemStatus(BaseModel):
    """System status model"""
    overall_status: str = Field(..., description="Overall system status")
    services: List[ServiceStatus] = Field(..., description="Individual service statuses")
    timestamp: datetime = Field(default_factory=datetime.now, description="Status check timestamp")
