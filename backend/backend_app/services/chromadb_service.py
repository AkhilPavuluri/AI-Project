"""
ChromaDB Vector Database Service for GITAM Education Policy AI

This service handles document storage, embedding generation, and vector similarity search
using ChromaDB as the vector database backend.
"""

import logging
import os
import uuid
from typing import List, Dict, Any, Optional, Tuple
import asyncio
from datetime import datetime
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import numpy as np

logger = logging.getLogger(__name__)

class ChromaDBService:
    """Service for ChromaDB vector database operations"""
    
    def __init__(self):
        """Initialize ChromaDB service with configuration"""
        self.chroma_host = os.getenv("CHROMA_HOST", "localhost")
        self.chroma_port = int(os.getenv("CHROMA_PORT", "8000"))
        self.embedding_model_name = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        self.collection_name = os.getenv("CHROMA_COLLECTION", "gitam_policy_documents")
        
        # Initialize ChromaDB client
        self.client = chromadb.HttpClient(
            host=self.chroma_host,
            port=self.chroma_port,
            settings=Settings(allow_reset=True)
        )
        
        # Initialize embedding model
        self.embedding_model = SentenceTransformer(self.embedding_model_name)
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "GITAM Education Policy Documents"}
        )
        
        logger.info(f"ChromaDB service initialized with collection: {self.collection_name}")
    
    async def add_document(self, 
                          content: str, 
                          metadata: Dict[str, Any], 
                          doc_id: Optional[str] = None) -> str:
        """
        Add a document to the vector database with embeddings.
        
        Args:
            content: Document text content
            metadata: Document metadata (title, source, type, etc.)
            doc_id: Optional document ID (generated if not provided)
            
        Returns:
            Document ID
        """
        try:
            if not doc_id:
                doc_id = str(uuid.uuid4())
            
            logger.info(f"Adding document to ChromaDB: {doc_id}")
            
            # Generate embedding for the content
            embedding = self.embedding_model.encode(content).tolist()
            
            # Add document to collection
            self.collection.add(
                ids=[doc_id],
                documents=[content],
                embeddings=[embedding],
                metadatas=[metadata]
            )
            
            logger.info(f"Document added successfully: {doc_id}")
            return doc_id
            
        except Exception as e:
            logger.error(f"Error adding document to ChromaDB: {e}")
            raise
    
    async def search_similar(self, 
                           query: str, 
                           top_k: int = 10,
                           filter_metadata: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Search for similar documents using vector similarity.
        
        Args:
            query: Search query text
            top_k: Number of results to return
            filter_metadata: Optional metadata filters
            
        Returns:
            List of similar documents with scores
        """
        try:
            logger.info(f"Searching for similar documents: {query[:50]}...")
            
            # Generate query embedding
            query_embedding = self.embedding_model.encode(query).tolist()
            
            # Search collection
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where=filter_metadata
            )
            
            # Format results
            similar_docs = []
            if results['ids'] and results['ids'][0]:
                for i, doc_id in enumerate(results['ids'][0]):
                    doc_data = {
                        'id': doc_id,
                        'content': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i],
                        'score': 1 - results['distances'][0][i] if results['distances'] else 0.0
                    }
                    similar_docs.append(doc_data)
            
            logger.info(f"Found {len(similar_docs)} similar documents")
            return similar_docs
            
        except Exception as e:
            logger.error(f"Error searching ChromaDB: {e}")
            raise
    
    async def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a specific document by ID.
        
        Args:
            doc_id: Document ID
            
        Returns:
            Document data or None if not found
        """
        try:
            logger.info(f"Retrieving document: {doc_id}")
            
            results = self.collection.get(ids=[doc_id])
            
            if results['ids']:
                doc_data = {
                    'id': doc_id,
                    'content': results['documents'][0],
                    'metadata': results['metadatas'][0]
                }
                logger.info(f"Document retrieved: {doc_id}")
                return doc_data
            else:
                logger.warning(f"Document not found: {doc_id}")
                return None
                
        except Exception as e:
            logger.error(f"Error retrieving document from ChromaDB: {e}")
            raise
    
    async def update_document(self, 
                            doc_id: str, 
                            content: Optional[str] = None,
                            metadata: Optional[Dict[str, Any]] = None) -> bool:
        """
        Update an existing document.
        
        Args:
            doc_id: Document ID
            content: New content (optional)
            metadata: New metadata (optional)
            
        Returns:
            True if updated successfully
        """
        try:
            logger.info(f"Updating document: {doc_id}")
            
            # Get existing document
            existing = await self.get_document(doc_id)
            if not existing:
                return False
            
            # Prepare update data
            new_content = content if content is not None else existing['content']
            new_metadata = metadata if metadata is not None else existing['metadata']
            
            # Generate new embedding if content changed
            if content is not None:
                embedding = self.embedding_model.encode(new_content).tolist()
                self.collection.update(
                    ids=[doc_id],
                    documents=[new_content],
                    embeddings=[embedding],
                    metadatas=[new_metadata]
                )
            else:
                self.collection.update(
                    ids=[doc_id],
                    metadatas=[new_metadata]
                )
            
            logger.info(f"Document updated successfully: {doc_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating document in ChromaDB: {e}")
            raise
    
    async def delete_document(self, doc_id: str) -> bool:
        """
        Delete a document from the database.
        
        Args:
            doc_id: Document ID
            
        Returns:
            True if deleted successfully
        """
        try:
            logger.info(f"Deleting document: {doc_id}")
            
            self.collection.delete(ids=[doc_id])
            
            logger.info(f"Document deleted successfully: {doc_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting document from ChromaDB: {e}")
            raise
    
    async def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get collection statistics and metadata.
        
        Returns:
            Collection statistics
        """
        try:
            count = self.collection.count()
            
            stats = {
                'total_documents': count,
                'collection_name': self.collection_name,
                'embedding_model': self.embedding_model_name,
                'embedding_dimensions': self.embedding_model.get_sentence_embedding_dimension(),
                'last_updated': datetime.now().isoformat()
            }
            
            logger.info(f"Collection stats: {count} documents")
            return stats
            
        except Exception as e:
            logger.error(f"Error getting collection stats: {e}")
            raise
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Check ChromaDB service health.
        
        Returns:
            Health status information
        """
        try:
            # Test connection
            collections = self.client.list_collections()
            
            # Test embedding generation
            test_embedding = self.embedding_model.encode("test query").tolist()
            
            health_status = {
                'chromadb': {
                    'status': 'connected',
                    'host': self.chroma_host,
                    'port': self.chroma_port,
                    'collections': len(collections)
                },
                'embedding_model': {
                    'status': 'loaded',
                    'model': self.embedding_model_name,
                    'dimensions': len(test_embedding)
                },
                'collection': {
                    'name': self.collection_name,
                    'document_count': self.collection.count()
                }
            }
            
            logger.info("ChromaDB health check completed successfully")
            return health_status
            
        except Exception as e:
            logger.error(f"ChromaDB health check failed: {e}")
            return {
                'chromadb': {
                    'status': 'error',
                    'error': str(e)
                },
                'embedding_model': {
                    'status': 'error',
                    'error': str(e)
                }
            }
    
    async def batch_add_documents(self, 
                                 documents: List[Dict[str, Any]]) -> List[str]:
        """
        Add multiple documents in batch for efficiency.
        
        Args:
            documents: List of document dictionaries with 'content' and 'metadata'
            
        Returns:
            List of document IDs
        """
        try:
            logger.info(f"Batch adding {len(documents)} documents")
            
            doc_ids = []
            contents = []
            embeddings = []
            metadatas = []
            
            for doc in documents:
                doc_id = str(uuid.uuid4())
                doc_ids.append(doc_id)
                contents.append(doc['content'])
                embeddings.append(self.embedding_model.encode(doc['content']).tolist())
                metadatas.append(doc['metadata'])
            
            # Add all documents at once
            self.collection.add(
                ids=doc_ids,
                documents=contents,
                embeddings=embeddings,
                metadatas=metadatas
            )
            
            logger.info(f"Batch added {len(doc_ids)} documents successfully")
            return doc_ids
            
        except Exception as e:
            logger.error(f"Error batch adding documents: {e}")
            raise
