'use client'

import { useState, useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ChatBot } from './ChatBot'
import { modelService } from '@/lib/modelService'

interface ChatHistoryItem {
  id: string
  title: string
  preview: string
  timestamp: Date
}

export default function ChatPage() {
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [activeChatId, setActiveChatId] = useState<string | undefined>()
  const [selectedModel, setSelectedModel] = useState<string>("")

  // Load available models and set default
  useEffect(() => {
    const loadDefaultModel = async () => {
      try {
        console.log('Loading available models for default selection...')
        const allModels = await modelService.refreshModels()
        console.log('Available models:', allModels)
        
        if (allModels.length > 0) {
          // Prefer Ollama models first, then cloud models
          const ollamaModels = allModels.filter(m => m.category === 'ollama')
          const cloudModels = allModels.filter(m => m.category === 'cloud')
          
          const defaultModel = ollamaModels.length > 0 ? ollamaModels[0].id : cloudModels[0].id
          console.log('Setting default model to:', defaultModel)
          setSelectedModel(defaultModel)
        } else {
          console.log('No models available, using fallback')
          setSelectedModel("gemini-2.5-flash")
        }
      } catch (error) {
        console.error('Error loading models:', error)
        setSelectedModel("gemini-2.5-flash")
      }
    }
    
    loadDefaultModel()
  }, [])

  const handleNewChat = () => {
    // Create a new chat session
    const newChatId = Date.now().toString()
    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: 'New Chat',
      preview: 'Start a new conversation...',
      timestamp: new Date(),
    }
    setChatHistory(prev => [newChat, ...prev])
    setActiveChatId(newChatId)
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId)
  }

  const handleDeleteChat = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
    if (activeChatId === chatId) {
      setActiveChatId(undefined)
    }
  }

  const handleUpdateChatHistory = (chatId: string, title: string, preview: string) => {
    const newChat: ChatHistoryItem = {
      id: chatId,
      title,
      preview,
      timestamp: new Date(),
    }
    setChatHistory(prev => [newChat, ...prev])
    setActiveChatId(chatId)
  }

  const handleModelChange = (modelId: string) => {
    console.log('Model changed to:', modelId)
    setSelectedModel(modelId)
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        variant="inset" 
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        showDebugPanel={showDebugPanel}
        onToggleDebugPanel={() => setShowDebugPanel(!showDebugPanel)}
        simulateFailure={simulateFailure}
        onToggleSimulateFailure={() => setSimulateFailure(!simulateFailure)}
      />
      <SidebarInset>
        <SiteHeader 
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
        
        <div className="flex-1 flex flex-col min-h-0">
          {selectedModel ? (
            <ChatBot 
              showDebugPanel={showDebugPanel}
              simulateFailure={simulateFailure}
              onUpdateChatHistory={handleUpdateChatHistory}
              selectedModel={selectedModel}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Loading available models...</p>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}