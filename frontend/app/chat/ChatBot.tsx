'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'
import { TypingIndicator } from '@/components/TypingIndicator'
import { DebugPanel } from './DebugPanel'
import { queryAPI, type QueryResponse } from '@/lib/api'
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
}

interface ChatBotProps {
  showDebugPanel: boolean
  simulateFailure: boolean
  onUpdateChatHistory?: (chatId: string, title: string, preview: string) => void
  selectedModel: string // Required - must be provided from top bar
}

export function ChatBot({ showDebugPanel, simulateFailure, onUpdateChatHistory, selectedModel }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState<AIModel | null>(null)
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
      
      const response = await queryAPI(content, simulateFailure, selectedModel)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date(),
        response: response,
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
      {/* Model Indicator */}
      {currentModel && (
        <div className="px-6 py-2 border-b bg-muted/30">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
            <span>Using:</span>
            <Badge variant="outline" className="flex items-center gap-1">
              {currentModel.category === 'ollama' ? (
                <Server className="h-3 w-3" />
              ) : (
                <Cloud className="h-3 w-3" />
              )}
              {currentModel.name}
            </Badge>
            <span className="text-xs">({currentModel.provider})</span>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        /* Initial Empty State - Properly Centered */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 -mt-8">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <h1 className="text-xl font-light text-foreground/80 tracking-wide">
              What would you like to know about GITAM?
            </h1>
          </div>
          
          {/* Centered Input Field */}
          <div className="w-full max-w-3xl">
            {/* Model indicator above input */}
            {currentModel && (
              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Messages will be sent to:</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  {currentModel.category === 'ollama' ? (
                    <Server className="h-3 w-3" />
                  ) : (
                    <Cloud className="h-3 w-3" />
                  )}
                  {currentModel.name}
                </Badge>
              </div>
            )}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="Ask about GITAM education policies..."
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
          <div className="px-6 py-6 border-t">
            <div className="max-w-4xl mx-auto">
              {/* Model indicator above input */}
              {currentModel && (
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Messages will be sent to:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {currentModel.category === 'ollama' ? (
                      <Server className="h-3 w-3" />
                    ) : (
                      <Cloud className="h-3 w-3" />
                    )}
                    {currentModel.name}
                  </Badge>
                </div>
              )}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask about GITAM education policies..."
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
