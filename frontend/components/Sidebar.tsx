'use client'

import { Button } from '@/components/ui/button'
import { Plus, MessageSquare, Trash2, Settings, User } from 'lucide-react'
import { SettingsDialog } from '@/components/SettingsDialog'

interface ChatHistoryItem {
  id: string
  title: string
  preview: string
  timestamp: Date
}

interface SidebarProps {
  chatHistory: ChatHistoryItem[]
  activeChatId?: string
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
}

export function Sidebar({
  chatHistory,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  return (
    <div className="w-64 h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button 
          className="w-full justify-start text-white bg-transparent hover:bg-gray-800 border border-gray-700 hover:border-gray-600 h-12 text-sm font-medium" 
          variant="outline"
          onClick={onNewChat}
        >
          <Plus className="mr-3 h-4 w-4" />
          New chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2">
        {chatHistory.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <MessageSquare className="h-8 w-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No conversations yet</p>
            <p className="text-gray-600 text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <div 
                key={chat.id} 
                className={`group relative flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeChatId === chat.id 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {chat.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                      {chat.preview}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-gray-500 hover:text-gray-300 hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="space-y-1">
          <SettingsDialog>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 h-10 text-sm"
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </SettingsDialog>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                nithin
              </div>
              <div className="text-xs text-gray-500">
                Free Plan
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}