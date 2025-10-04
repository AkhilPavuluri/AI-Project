"""
Ollama LLM Service for GITAM Education Policy AI

This service handles LLM interactions using Ollama for local model inference.
Supports both Ollama models and cloud-based models (OpenAI, Anthropic, etc.).
"""

import logging
import os
import json
from typing import List, Dict, Any, Optional
import asyncio
import httpx
from datetime import datetime

logger = logging.getLogger(__name__)

class OllamaService:
    """Service for Ollama LLM interactions"""
    
    def __init__(self):
        """Initialize Ollama service with configuration"""
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        
        # Default model configurations
        self.default_ollama_model = "deepseek-r1:7b"
        self.default_openai_model = "gpt-4o"
        self.default_anthropic_model = "claude-3-5-sonnet-20241022"
        self.default_gemini_model = "gemini-2.5-flash"
        
        logger.info(f"Ollama service initialized with URL: {self.ollama_url}")
    
    async def generate_response(self, 
                              query: str, 
                              model: str,
                              context: Optional[str] = None,
                              temperature: float = 0.7,
                              max_tokens: int = 1000) -> Dict[str, Any]:
        """
        Generate response using the specified model.
        
        Args:
            query: User query
            model: Model identifier (ollama model name or cloud model)
            context: Optional context for the query
            temperature: Response randomness (0.0 to 1.0)
            max_tokens: Maximum tokens in response
            
        Returns:
            Response dictionary with answer and metadata
        """
        try:
            logger.info(f"Generating response with model: {model}")
            
            # Determine model type and route accordingly
            if self._is_ollama_model(model):
                return await self._generate_ollama_response(query, model, context, temperature, max_tokens)
            elif self._is_openai_model(model):
                return await self._generate_openai_response(query, model, context, temperature, max_tokens)
            elif self._is_anthropic_model(model):
                return await self._generate_anthropic_response(query, model, context, temperature, max_tokens)
            elif self._is_gemini_model(model):
                return await self._generate_gemini_response(query, model, context, temperature, max_tokens)
            else:
                # Default to Ollama if model type is unknown
                logger.warning(f"Unknown model type: {model}, defaulting to Ollama")
                return await self._generate_ollama_response(query, self.default_ollama_model, context, temperature, max_tokens)
                
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise
    
    async def _generate_ollama_response(self, 
                                     query: str, 
                                     model: str,
                                     context: Optional[str] = None,
                                     temperature: float = 0.7,
                                     max_tokens: int = 1000) -> Dict[str, Any]:
        """Generate response using Ollama"""
        try:
            # Prepare prompt with context
            prompt = self._prepare_prompt(query, context)
            
            # Ollama API request
            payload = {
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens
                }
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                
                return {
                    "answer": result.get("response", ""),
                    "model": model,
                    "provider": "ollama",
                    "tokens_used": result.get("eval_count", 0),
                    "response_time": result.get("total_duration", 0) / 1e9,  # Convert nanoseconds to seconds
                    "timestamp": datetime.now().isoformat()
                }
                
        except httpx.ConnectError:
            logger.error(f"Cannot connect to Ollama at {self.ollama_url}")
            raise Exception(f"Ollama service unavailable at {self.ollama_url}")
        except Exception as e:
            logger.error(f"Error generating Ollama response: {e}")
            raise
    
    async def _generate_openai_response(self, 
                                      query: str, 
                                      model: str,
                                      context: Optional[str] = None,
                                      temperature: float = 0.7,
                                      max_tokens: int = 1000) -> Dict[str, Any]:
        """Generate response using OpenAI API"""
        if not self.openai_api_key:
            raise Exception("OpenAI API key not configured")
        
        try:
            prompt = self._prepare_prompt(query, context)
            
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            
            headers = {
                "Authorization": f"Bearer {self.openai_api_key}",
                "Content-Type": "application/json"
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    json=payload,
                    headers=headers
                )
                response.raise_for_status()
                
                result = response.json()
                
                return {
                    "answer": result["choices"][0]["message"]["content"],
                    "model": model,
                    "provider": "openai",
                    "tokens_used": result["usage"]["total_tokens"],
                    "response_time": 0,  # OpenAI doesn't provide response time
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            logger.error(f"Error generating OpenAI response: {e}")
            raise
    
    async def _generate_anthropic_response(self, 
                                         query: str, 
                                         model: str,
                                         context: Optional[str] = None,
                                         temperature: float = 0.7,
                                         max_tokens: int = 1000) -> Dict[str, Any]:
        """Generate response using Anthropic API"""
        if not self.anthropic_api_key:
            raise Exception("Anthropic API key not configured")
        
        try:
            prompt = self._prepare_prompt(query, context)
            
            payload = {
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": [{"role": "user", "content": prompt}]
            }
            
            headers = {
                "x-api-key": self.anthropic_api_key,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    json=payload,
                    headers=headers
                )
                response.raise_for_status()
                
                result = response.json()
                
                return {
                    "answer": result["content"][0]["text"],
                    "model": model,
                    "provider": "anthropic",
                    "tokens_used": result["usage"]["input_tokens"] + result["usage"]["output_tokens"],
                    "response_time": 0,
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            logger.error(f"Error generating Anthropic response: {e}")
            raise
    
    async def _generate_gemini_response(self, 
                                       query: str, 
                                       model: str,
                                       context: Optional[str] = None,
                                       temperature: float = 0.7,
                                       max_tokens: int = 1000) -> Dict[str, Any]:
        """Generate response using Google Gemini API"""
        if not self.gemini_api_key:
            raise Exception("Gemini API key not configured")
        
        try:
            prompt = self._prepare_prompt(query, context)
            
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": temperature,
                    "maxOutputTokens": max_tokens
                }
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.gemini_api_key}",
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                
                return {
                    "answer": result["candidates"][0]["content"]["parts"][0]["text"],
                    "model": model,
                    "provider": "gemini",
                    "tokens_used": result["usageMetadata"]["totalTokenCount"],
                    "response_time": 0,
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            logger.error(f"Error generating Gemini response: {e}")
            raise
    
    def _prepare_prompt(self, query: str, context: Optional[str] = None) -> str:
        """Prepare prompt with context for education policy queries"""
        system_prompt = """You are an AI assistant specialized in GITAM Education Policy queries. 
        Provide accurate, helpful, and detailed responses about education policies, admission procedures, 
        academic regulations, and university guidelines. Always cite relevant policy documents when possible.
        
        Guidelines:
        - Be precise and factual
        - Use clear, professional language
        - Provide specific policy references when available
        - If uncertain, clearly state limitations
        - Focus on GITAM-specific policies and procedures"""
        
        if context:
            prompt = f"{system_prompt}\n\nContext:\n{context}\n\nQuery: {query}\n\nResponse:"
        else:
            prompt = f"{system_prompt}\n\nQuery: {query}\n\nResponse:"
        
        return prompt
    
    def _is_ollama_model(self, model: str) -> bool:
        """Check if model is an Ollama model"""
        # Common Ollama model patterns
        ollama_patterns = [
            "llama", "deepseek", "qwen", "gemma", "phi", "codellama", 
            "mistral", "mixtral", "neural-chat", "orca"
        ]
        return any(pattern in model.lower() for pattern in ollama_patterns)
    
    def _is_openai_model(self, model: str) -> bool:
        """Check if model is an OpenAI model"""
        openai_patterns = ["gpt-3", "gpt-4", "gpt-4o"]
        return any(pattern in model.lower() for pattern in openai_patterns)
    
    def _is_anthropic_model(self, model: str) -> bool:
        """Check if model is an Anthropic model"""
        anthropic_patterns = ["claude"]
        return any(pattern in model.lower() for pattern in anthropic_patterns)
    
    def _is_gemini_model(self, model: str) -> bool:
        """Check if model is a Gemini model"""
        gemini_patterns = ["gemini"]
        return any(pattern in model.lower() for pattern in gemini_patterns)
    
    async def list_available_models(self) -> Dict[str, List[str]]:
        """List available models by provider"""
        models = {
            "ollama": [],
            "openai": [],
            "anthropic": [],
            "gemini": []
        }
        
        try:
            # Get Ollama models
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.ollama_url}/api/tags")
                if response.status_code == 200:
                    ollama_data = response.json()
                    models["ollama"] = [model["name"] for model in ollama_data.get("models", [])]
        except Exception as e:
            logger.warning(f"Could not fetch Ollama models: {e}")
        
        # Add cloud models if API keys are configured
        if self.openai_api_key:
            models["openai"] = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"]
        
        if self.anthropic_api_key:
            models["anthropic"] = ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", "claude-3-sonnet-20240229"]
        
        if self.gemini_api_key:
            models["gemini"] = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash", "gemini-1.5-pro"]
        
        return models
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Ollama service health"""
        health_status = {
            "ollama": {
                "status": "unknown",
                "url": self.ollama_url,
                "models": []
            },
            "openai": {
                "status": "not_configured",
                "api_key_configured": bool(self.openai_api_key)
            },
            "anthropic": {
                "status": "not_configured", 
                "api_key_configured": bool(self.anthropic_api_key)
            },
            "gemini": {
                "status": "not_configured",
                "api_key_configured": bool(self.gemini_api_key)
            }
        }
        
        try:
            # Test Ollama connection
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.ollama_url}/api/tags")
                if response.status_code == 200:
                    ollama_data = response.json()
                    health_status["ollama"]["status"] = "connected"
                    health_status["ollama"]["models"] = [model["name"] for model in ollama_data.get("models", [])]
                else:
                    health_status["ollama"]["status"] = "error"
        except Exception as e:
            health_status["ollama"]["status"] = "disconnected"
            health_status["ollama"]["error"] = str(e)
        
        # Check cloud API configurations
        if self.openai_api_key:
            health_status["openai"]["status"] = "configured"
        if self.anthropic_api_key:
            health_status["anthropic"]["status"] = "configured"
        if self.gemini_api_key:
            health_status["gemini"]["status"] = "configured"
        
        return health_status
