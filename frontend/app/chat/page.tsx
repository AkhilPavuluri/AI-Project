'use client'

import { useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ChatBot } from './ChatBot'

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
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4")

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
          onModelChange={setSelectedModel}
        />
        <div className="flex-1 flex flex-col min-h-0">
          <ChatBot 
            showDebugPanel={showDebugPanel}
            simulateFailure={simulateFailure}
            onUpdateChatHistory={handleUpdateChatHistory}
            selectedModel={selectedModel}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}