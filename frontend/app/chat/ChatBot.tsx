'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'
import { TypingIndicator } from '@/components/TypingIndicator'
import { DebugPanel } from './DebugPanel'
import { queryAPI, queryModelDirect, type QueryResponse } from '@/lib/api'
import { modelService } from '@/lib/modelService'
import { AIModel } from '@/lib/models'
import { Badge } from '@/components/ui/badge'
import { Server, Cloud } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  response?: QueryResponse
  thinkingMode?: ThinkingMode
}

interface ChatBotProps {
  showDebugPanel: boolean
  simulateFailure: boolean
  onUpdateChatHistory?: (chatId: string, title: string, preview: string) => void
  selectedModel: string // Required - must be provided from top bar
}

type ThinkingMode = 'smart' | 'general' | 'deep' | 'reasoning'

export function ChatBot({ showDebugPanel, simulateFailure, onUpdateChatHistory, selectedModel }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState<AIModel | null>(null)
  const [thinkingMode, setThinkingMode] = useState<ThinkingMode>('smart')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load model information when selectedModel changes
  useEffect(() => {
    const loadModelInfo = async () => {
      console.log('ChatBot: selectedModel from top bar:', selectedModel)
      try {
        const allModels = await modelService.getAllModels()
        const model = allModels.find(m => m.id === selectedModel)
        console.log('ChatBot: Found model info for', selectedModel, ':', model)
        setCurrentModel(model || null)
      } catch (error) {
        console.error('ChatBot: Error loading model info:', error)
        setCurrentModel(null)
      }
    }
    
    loadModelInfo()
  }, [selectedModel])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Mode-specific prompting strategies
  const applyModePrompting = (content: string, mode: ThinkingMode, isCloudModel: boolean = false): string => {
    switch (mode) {
      case 'smart':
        // Smart mode: Friendly, context-aware responses for education policy
        return `You are a helpful AI assistant specializing in education policy. Respond in a friendly, conversational way. For simple greetings like "hi", respond warmly and ask how you can help with education policy questions. For policy questions, provide helpful, practical guidance. User query: ${content}`
      
      case 'general':
        // General mode: Direct, minimal prompting for natural conversation
        return content
      
      case 'deep':
        // Deep thinking: Ask it to think longer
        if (isCloudModel) {
          // For cloud models, don't use <think> tags as they get processed by the LLM
          return `Please think through this step by step and consider multiple perspectives. Provide a thorough analysis of: ${content}. Take your time to think through this carefully and provide detailed insights.`
        } else {
          // For local models, use <think> tags for thinking process visibility
          return `<think>Please think through this step by step and consider multiple perspectives.</think>Please provide a thorough analysis of: ${content}. Take your time to think through this carefully and provide detailed insights.`
        }
      
      case 'reasoning':
        // Reasoning: Ask for in-depth reasoning and deep thinking max out for accuracy
        if (isCloudModel) {
          // For cloud models, don't use <think> tags as they get processed by the LLM
          return `Please engage in deep reasoning and critical thinking. Consider all possible angles, potential issues, and provide the most accurate and comprehensive response possible. Provide an in-depth analysis with detailed reasoning for: ${content}. I need maximum accuracy and thoroughness in your response.`
        } else {
          // For local models, use <think> tags for thinking process visibility
          return `<think>Please engage in deep reasoning and critical thinking. Consider all possible angles, potential issues, and provide the most accurate and comprehensive response possible.</think>Please provide an in-depth analysis with detailed reasoning for: ${content}. I need maximum accuracy and thoroughness in your response.`
        }
      
      default:
        return content
    }
  }

  const handleThinkingModeChange = (mode: ThinkingMode) => {
    setThinkingMode(mode)
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Ensure we're using the exact model selected from top bar
      if (!selectedModel) {
        console.error('No model selected from top bar!')
        throw new Error('No model selected. Please select a model from the top bar.')
      }
      
      console.log(`ChatBot: Using selected model from top bar: ${selectedModel}`)
      console.log(`ChatBot: Current model info:`, currentModel)
      console.log(`ChatBot: Using thinking mode: ${thinkingMode}`)
      
      // Determine if this is a cloud model
      const isCloudModel = currentModel?.category === 'cloud'
      
      // Apply mode-specific prompting
      const promptedContent = applyModePrompting(content, thinkingMode, isCloudModel)
      
      // Use direct API calls for cloud models, backend API for Ollama models
      let response: QueryResponse
      if (currentModel?.category === 'cloud') {
        console.log('Using direct cloud API for:', selectedModel)
        const directResponse = await queryModelDirect(promptedContent, selectedModel)
        response = {
          answer: directResponse.answer,
          citations: [], // Cloud models don't have citations in this implementation
          processing_trace: {
            language: 'en',
            retrieval: { dense: [], sparse: [] },
            kg_traversal: 'Direct cloud API call',
            controller_iterations: 1
          },
          risk_assessment: 'N/A'
        }
      } else {
        console.log('Using backend API for:', selectedModel)
        response = await queryAPI(promptedContent, simulateFailure, selectedModel, thinkingMode)
      }
      
      // Fallback if response.answer is empty or undefined
      const responseContent = response.answer || `I received your message "${content}" but couldn't generate a proper response. This might be due to API configuration issues.`
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        response: response,
        thinkingMode: thinkingMode,
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Update chat history with the first user message
      if (messages.length === 0) { // Only the user message (first message)
        const chatId = Date.now().toString()
        const title = content.length > 30 ? content.substring(0, 30) + '...' : content
        const preview = response.answer.length > 50 ? response.answer.substring(0, 50) + '...' : response.answer
        onUpdateChatHistory?.(chatId, title, preview)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I encountered an error while using ${currentModel?.name || selectedModel || 'the selected model'}: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        role: 'system',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">

      {messages.length === 0 ? (
        /* Initial Empty State - Properly Centered */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <h1 className="text-xl font-light text-foreground/80 tracking-wide">
              How can I help you with education policy today?
            </h1>
          </div>
          
          {/* Centered Input Field */}
          <div className="w-full max-w-3xl">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="Ask about education policies or say hi..."
              onThinkingModeChange={handleThinkingModeChange}
            />
          </div>
        </div>
      ) : (
        /* Chat Messages State */
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto premium-scrollbar">
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TypingIndicator />
                  {currentModel && (
                    <span>using {currentModel.name}</span>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="px-6 py-6">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask about education policies or say hi..."
                onThinkingModeChange={handleThinkingModeChange}
              />
            </div>
          </div>
        </>
      )}

      {/* Debug Panel */}
      {showDebugPanel && (
        <DebugPanel 
          lastResponse={messages[messages.length - 1]?.response}
        />
      )}
    </div>
  )
}
