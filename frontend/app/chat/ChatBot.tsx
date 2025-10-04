'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'
import { TypingIndicator } from '@/components/TypingIndicator'
import { DebugPanel } from './DebugPanel'
import { queryAPI, type QueryResponse } from '@/lib/api'

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
  selectedModel?: string
}

export function ChatBot({ showDebugPanel, simulateFailure, onUpdateChatHistory, selectedModel }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      const response = await queryAPI(content, simulateFailure, selectedModel || "gpt-4")
      
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
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
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
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 -mt-8">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <h1 className="text-xl font-light text-foreground/80 tracking-wide">
              What would you like to know about GITAM?
            </h1>
          </div>
          
          {/* Centered Input Field */}
          <div className="w-full max-w-3xl">
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
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="px-6 py-6 border-t">
            <div className="max-w-4xl mx-auto">
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
