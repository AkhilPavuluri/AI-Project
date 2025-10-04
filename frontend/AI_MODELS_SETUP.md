# AI Models Setup Guide

This application now supports both local Ollama models and cloud-based AI models. Here's how to set them up:

## Cloud Models Setup

### Google Gemini
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

### OpenAI GPT Models
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

### Anthropic Claude Models
1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

## Local Ollama Setup

### Install Ollama
1. Download and install Ollama from [ollama.ai](https://ollama.ai)
2. Start the Ollama service

### Download Models
Popular models you can download:
```bash
# Meta Llama models
ollama pull llama3.2:3b
ollama pull llama3.2:1b

# Alibaba Qwen models
ollama pull qwen2.5:7b
ollama pull qwen2.5:14b

# Google Gemma models
ollama pull gemma2:9b
ollama pull gemma2:27b

# Microsoft Phi models
ollama pull phi3:3.8b
ollama pull phi3:14b

# Code generation models
ollama pull codellama:7b
ollama pull codellama:13b
```

### Configure Ollama URL (Optional)
If Ollama is running on a different host/port, add to `.env.local`:
```
NEXT_PUBLIC_OLLAMA_URL=http://your-ollama-host:11434
```

## Usage Examples

### Using Gemini API
```typescript
import { generateWithGemini } from '@/lib/geminiApi'

// Basic usage
const response = await generateWithGemini(
  'gemini-2.5-flash',
  [{ role: 'user', content: 'Hello!' }]
)

// With custom configuration
const response = await generateWithGemini(
  'gemini-2.5-flash',
  [{ role: 'user', content: 'Explain AI' }],
  {
    temperature: 0.7,
    maxTokens: 1000,
    thinkingBudget: 0 // Disable thinking
  }
)
```

## Model Categories

### Local Models (Ollama)
- **Status**: Shows if downloaded or not
- **Size**: Displays model size
- **Connection**: Shows Ollama server status
- **Usage**: Free, runs locally

### Cloud Models
- **Status**: Shows if API key is configured
- **Pricing**: Displays token costs
- **Usage**: Requires API key and internet connection

## Features

- **Real-time Detection**: Automatically detects which Ollama models are downloaded
- **API Key Validation**: Checks if cloud model API keys are configured
- **Visual Indicators**: Clear status badges for model availability
- **Categorized Display**: Separate sections for local and cloud models
- **Connection Status**: Shows Ollama server connectivity
