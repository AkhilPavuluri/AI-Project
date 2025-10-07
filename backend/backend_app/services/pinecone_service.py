"""
Pinecone Vector Database Service for GITAM Education Policy AI

This service handles document storage, embedding generation, and vector similarity search
using Pinecone as the vector database backend.
"""

import logging
import os
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec


logger = logging.getLogger(__name__)


class PineconeService:
    """Service for Pinecone vector database operations"""

    def __init__(self):
        """Initialize Pinecone service with configuration"""
        self.pinecone_api_key = os.getenv("PINECONE_API_KEY", "")
        self.pinecone_environment = os.getenv("PINECONE_ENV", "us-east-1")
        self.index_name = os.getenv("PINECONE_INDEX", "gitam-policy-docs")
        self.embedding_model_name = os.getenv(
            "EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
        )

        if not self.pinecone_api_key:
            raise RuntimeError("PINECONE_API_KEY is not set")

        # Initialize embedding model
        self.embedding_model = SentenceTransformer(self.embedding_model_name)

        # Initialize Pinecone client and ensure index exists
        self.pc = Pinecone(api_key=self.pinecone_api_key)

        if self.index_name not in [idx["name"] for idx in self.pc.list_indexes()]:
            # Create a serverless index with the model's embedding dimension
            dim = self.embedding_model.get_sentence_embedding_dimension()
            self.pc.create_index(
                name=self.index_name,
                dimension=dim,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region=self.pinecone_environment),
            )

        self.index = self.pc.Index(self.index_name)

        logger.info(f"Pinecone service initialized with index: {self.index_name}")

    async def add_document(
        self, content: str, metadata: Dict[str, Any], doc_id: Optional[str] = None
    ) -> str:
        """
        Add a document to the vector database with embeddings.
        """
        if not doc_id:
            doc_id = str(uuid.uuid4())

        embedding = self.embedding_model.encode(content).tolist()
        self.index.upsert(vectors=[{"id": doc_id, "values": embedding, "metadata": {**metadata, "content": content}}])
        return doc_id

    async def search_similar(
        self, query: str, top_k: int = 10, filter_metadata: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for similar documents using vector similarity.
        """
        query_embedding = self.embedding_model.encode(query).tolist()
        kwargs = {}
        if filter_metadata:
            kwargs["filter"] = filter_metadata

        res = self.index.query(vector=query_embedding, top_k=top_k, include_metadata=True, **kwargs)

        similar_docs: List[Dict[str, Any]] = []
        for match in res.matches or []:
            md = match.metadata or {}
            similar_docs.append(
                {
                    "id": match.id,
                    "content": md.get("content", ""),
                    "metadata": {k: v for k, v in md.items() if k != "content"},
                    "score": match.score or 0.0,
                }
            )
        return similar_docs

    async def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a specific document by ID."""
        res = self.index.fetch(ids=[doc_id])
        vec = (res.vectors or {}).get(doc_id)
        if not vec:
            return None
        md = vec.metadata or {}
        return {
            "id": doc_id,
            "content": md.get("content", ""),
            "metadata": {k: v for k, v in md.items() if k != "content"},
        }

    async def update_document(
        self, doc_id: str, content: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Update an existing document."""
        existing = await self.get_document(doc_id)
        if not existing:
            return False
        new_content = content if content is not None else existing["content"]
        new_metadata = metadata if metadata is not None else existing["metadata"]
        embedding = self.embedding_model.encode(new_content).tolist()
        md = {**new_metadata, "content": new_content}
        self.index.upsert(vectors=[{"id": doc_id, "values": embedding, "metadata": md}])
        return True

    async def delete_document(self, doc_id: str) -> bool:
        """Delete a document from the database."""
        self.index.delete(ids=[doc_id])
        return True

    async def get_collection_stats(self) -> Dict[str, Any]:
        """Get index statistics and metadata."""
        stats = self.index.describe_index_stats()
        return {
            "total_vectors": stats.get("total_vector_count", 0),
            "index_name": self.index_name,
            "embedding_model": self.embedding_model_name,
            "embedding_dimensions": self.embedding_model.get_sentence_embedding_dimension(),
            "last_updated": datetime.now().isoformat(),
        }

    async def health_check(self) -> Dict[str, Any]:
        """Check Pinecone service health."""
        try:
            # List indexes as a lightweight health check
            indexes = self.pc.list_indexes()
            test_embedding = self.embedding_model.encode("test query").tolist()
            return {
                "pinecone": {
                    "status": "connected",
                    "environment": self.pinecone_environment,
                    "indexes": len(indexes),
                    "index_name": self.index_name,
                },
                "embedding_model": {
                    "status": "loaded",
                    "model": self.embedding_model_name,
                    "dimensions": len(test_embedding),
                },
            }
        except Exception as e:
            return {
                "pinecone": {"status": "error", "error": str(e)},
                "embedding_model": {"status": "error", "error": str(e)},
            }

    async def batch_add_documents(self, documents: List[Dict[str, Any]]) -> List[str]:
        """Add multiple documents in batch for efficiency."""
        ids: List[str] = []
        vectors = []
        for doc in documents:
            did = str(uuid.uuid4())
            ids.append(did)
            emb = self.embedding_model.encode(doc["content"]).tolist()
            vectors.append({"id": did, "values": emb, "metadata": {**doc["metadata"], "content": doc["content"]}})
        if vectors:
            self.index.upsert(vectors=vectors)
        return ids



