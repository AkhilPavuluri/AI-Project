'use client'

import { useState } from 'react'
import { User, Bot, AlertCircle, ChevronDown, ChevronRight, Brain } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  response?: any
}

interface ChatMessageProps {
  message: Message
}

// Utility function to format time consistently across server and client
function formatTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  return `${displayHours}:${displayMinutes} ${ampm}`
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [isThinkingOpen, setIsThinkingOpen] = useState(false)

  // Extract thinking content from message
  const extractThinkingContent = (content: string) => {
    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/i)
    return thinkMatch ? thinkMatch[1].trim() : null
  }

  // Clean message content by removing think tags
  const cleanMessageContent = (content: string) => {
    return content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
  }

  const thinkingContent = extractThinkingContent(message.content)
  const cleanContent = cleanMessageContent(message.content)

  const getAvatarIcon = () => {
    switch (message.role) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'assistant':
        return <Bot className="h-4 w-4" />
      case 'system':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getInitials = () => {
    switch (message.role) {
      case 'user':
        return 'U'
      case 'assistant':
        return 'AI'
      case 'system':
        return 'S'
      default:
        return '?'
    }
  }

  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <Avatar className={`w-8 h-8 ${
        isUser 
          ? 'bg-primary' 
          : isSystem 
            ? 'bg-destructive'
            : 'bg-secondary'
      }`}>
        <AvatarFallback className={`text-primary-foreground text-sm font-medium ${
          isUser 
            ? 'bg-primary' 
            : isSystem 
              ? 'bg-destructive'
              : 'bg-secondary'
        }`}>
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : isSystem
              ? 'bg-destructive/10 text-destructive border border-destructive/20'
              : 'bg-muted text-foreground border border-border'
        }`}>
          <div className="whitespace-pre-wrap break-words">
            {cleanContent}
          </div>
          
          {/* Show placeholder warning for assistant messages */}
          {message.role === 'assistant' && message.content.includes('N/A') && (
            <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400">
              <Badge variant="outline" className="text-amber-400 border-amber-500/20 bg-amber-500/10">
                ⚠️ Placeholder Data
              </Badge>
              <p className="mt-1">System not yet connected to vector databases or LLM services.</p>
            </div>
          )}

          {/* Thinking Section for Assistant Messages */}
          {message.role === 'assistant' && (message.response?.processing_trace || thinkingContent) && (
            <div className="mt-3">
              <Collapsible open={isThinkingOpen} onOpenChange={setIsThinkingOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {isThinkingOpen ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  <Brain className="h-3 w-3" />
                  <span>Thinking process</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="bg-muted/50 border border-border/50 rounded-lg p-3 text-xs space-y-2">
                    {/* Show extracted thinking content */}
                    {thinkingContent && (
                      <div>
                        <span className="font-medium text-foreground">Reasoning:</span>
                        <div className="ml-2 mt-1 text-xs text-muted-foreground whitespace-pre-wrap">
                          {thinkingContent}
                        </div>
                      </div>
                    )}

                    {/* Show processing trace data */}
                    {message.response?.processing_trace && (
                      <>
                        {message.response.processing_trace.language && (
                          <div>
                            <span className="font-medium text-foreground">Language:</span>
                            <span className="ml-2 text-muted-foreground">{message.response.processing_trace.language}</span>
                          </div>
                        )}
                        
                        {message.response.processing_trace.retrieval && (
                          <div>
                            <span className="font-medium text-foreground">Retrieval:</span>
                            <div className="ml-2 mt-1 space-y-1">
                              {message.response.processing_trace.retrieval.dense && message.response.processing_trace.retrieval.dense.length > 0 && (
                                <div>
                                  <span className="text-muted-foreground">Dense:</span>
                                  <div className="ml-2 text-xs text-muted-foreground">
                                    {message.response.processing_trace.retrieval.dense.map((item, index) => (
                                      <div key={index} className="truncate">• {item}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {message.response.processing_trace.retrieval.sparse && message.response.processing_trace.retrieval.sparse.length > 0 && (
                                <div>
                                  <span className="text-muted-foreground">Sparse:</span>
                                  <div className="ml-2 text-xs text-muted-foreground">
                                    {message.response.processing_trace.retrieval.sparse.map((item, index) => (
                                      <div key={index} className="truncate">• {item}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {message.response.processing_trace.kg_traversal && (
                          <div>
                            <span className="font-medium text-foreground">Knowledge Graph:</span>
                            <div className="ml-2 text-xs text-muted-foreground">
                              {message.response.processing_trace.kg_traversal}
                            </div>
                          </div>
                        )}
                        
                        {message.response.processing_trace.controller_iterations && (
                          <div>
                            <span className="font-medium text-foreground">Controller Iterations:</span>
                            <span className="ml-2 text-muted-foreground">{message.response.processing_trace.controller_iterations}</span>
                          </div>
                        )}
                      </>
                    )}

                    {Array.isArray(message.response?.citations) && message.response.citations.length > 0 && (
                      <div>
                        <span className="font-medium text-foreground">Citations:</span>
                        <div className="ml-2 mt-1 space-y-1 text-muted-foreground">
                          {message.response.citations.map((c: any, i: number) => (
                            <div key={i} className="truncate">• Doc {c.docId} p.{c.page} — {c.span}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.response?.risk_assessment && (
                      <div>
                        <span className="font-medium text-foreground">Risk assessment:</span>
                        <div className="ml-2 text-xs text-muted-foreground whitespace-pre-wrap">
                          {message.response.risk_assessment}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
        
        <div className={`text-xs text-muted-foreground mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
