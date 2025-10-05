'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Plus, Mic, Loader2, Zap, Brain, Lightbulb, Cog, Paperclip, Camera, Search, Image, BookOpen, MoreHorizontal, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  placeholder?: string
  onThinkingModeChange?: (mode: 'smart' | 'general' | 'deep' | 'reasoning') => void
}

export function ChatInput({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Ask about education policies or say hi...",
  onThinkingModeChange,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [thinkingMode, setThinkingMode] = useState<'smart' | 'general' | 'deep' | 'reasoning'>('smart')

  const inferModeFromMessage = (text: string): 'general' | 'deep' | 'reasoning' => {
    const lower = text.toLowerCase()
    const lengthScore = text.length
    const hasReasoningHints = /(reason|why|how|explain|analy(s|z)e|step\s*by\s*step|derive|proof|chain\s*of\s*thought|plan|strategy|compare|evaluate)/i.test(lower)
    const hasComplexityHints = /(multi-?step|detailed|in\s*depth|thorough|comprehensive|trade-?offs|optim(ize|isation)|architecture|design)/i.test(lower)

    if (hasReasoningHints && (hasComplexityHints || lengthScore > 240)) return 'reasoning'
    if (hasReasoningHints || hasComplexityHints || lengthScore > 120) return 'deep'
    return 'general'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    // If Smart mode, infer the concrete mode just-in-time and reflect it in UI
    if (thinkingMode === 'smart') {
      const inferred = inferModeFromMessage(message.trim())
      setThinkingMode(inferred)
      onThinkingModeChange?.(inferred)
    }

    onSendMessage(message.trim())
    setMessage('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`

    // Live suggest mode when Smart is selected (non-destructive; only reflect on submit)
    if (thinkingMode === 'smart' && value.trim().length > 0) {
      const suggested = inferModeFromMessage(value)
      // Do not change the actual mode here to avoid flicker; you can surface suggestion via tooltip later
      // If you'd like to reflect immediately, uncomment below:
      // setThinkingMode(suggested)
      // onThinkingModeChange?.(suggested)
    }
  }

  useEffect(() => {
    // Focus the input when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleThinkingModeChange = (value: 'smart' | 'general' | 'deep' | 'reasoning') => {
    setThinkingMode(value)
    onThinkingModeChange?.(value)
  }

  const getModeIcon = (mode: 'smart' | 'general' | 'deep' | 'reasoning') => {
    switch (mode) {
      case 'smart': return <Zap className="h-3 w-3" />
      case 'general': return <Lightbulb className="h-3 w-3" />
      case 'deep': return <Brain className="h-3 w-3" />
      case 'reasoning': return <Cog className="h-3 w-3" />
      default: return <Zap className="h-3 w-3" />
    }
  }

  const getModeDisplayText = (mode: 'smart' | 'general' | 'deep' | 'reasoning') => {
    switch (mode) {
      case 'smart': return 'Smart'
      case 'general': return 'General'
      case 'deep': return 'Deep Thinking'
      case 'reasoning': return 'Reasoning'
      default: return 'Smart'
    }
  }

  const isSpecialMode = thinkingMode !== 'smart'

  return (
    <TooltipProvider>
      <div className="relative">
        {/* Mode Display - always shows current mode */}
        <div className="mb-3 group">
          {isSpecialMode ? (
            <button
              onClick={() => handleThinkingModeChange('smart')}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              title="Click to remove mode"
            >
              <div className="flex-shrink-0 w-3 h-3 flex items-center justify-center">
                <div className="group-hover:hidden">
                  {getModeIcon(thinkingMode)}
                </div>
                <div className="hidden group-hover:block">
                  <X className="h-3 w-3" />
                </div>
              </div>
              <span>{getModeDisplayText(thinkingMode)}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <div className="flex-shrink-0 w-3 h-3 flex items-center justify-center">
                {getModeIcon(thinkingMode)}
              </div>
              <span>{getModeDisplayText(thinkingMode)}</span>
            </div>
          )}
        </div>

        <div className="flex items-end gap-3 bg-background border border-border rounded-2xl p-4 shadow-lg hover:border-border/80 transition-colors">
          {/* Add Button with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {/* File Options */}
              <DropdownMenuItem>
                <Paperclip className="h-4 w-4 mr-2" />
                Add photos & files
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Camera className="h-4 w-4 mr-2" />
                Take screenshot
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Camera className="h-4 w-4 mr-2" />
                Take photo
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Thinking Mode Options */}
              <DropdownMenuItem 
                onClick={() => handleThinkingModeChange('smart')}
                className={thinkingMode === 'smart' ? 'bg-blue-50 text-blue-600' : ''}
              >
                <Zap className="h-4 w-4 mr-2" />
                Smart (Auto)
                {thinkingMode === 'smart' && <span className="ml-auto text-blue-600">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleThinkingModeChange('general')}
                className={thinkingMode === 'general' ? 'bg-blue-50 text-blue-600' : ''}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                General
                {thinkingMode === 'general' && <span className="ml-auto text-blue-600">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleThinkingModeChange('deep')}
                className={thinkingMode === 'deep' ? 'bg-blue-50 text-blue-600' : ''}
              >
                <Brain className="h-4 w-4 mr-2" />
                Deep Thinking
                {thinkingMode === 'deep' && <span className="ml-auto text-blue-600">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleThinkingModeChange('reasoning')}
                className={thinkingMode === 'reasoning' ? 'bg-blue-50 text-blue-600' : ''}
              >
                <Cog className="h-4 w-4 mr-2" />
                Reasoning (Max Thinking)
                {thinkingMode === 'reasoning' && <span className="ml-auto text-blue-600">✓</span>}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <MoreHorizontal className="h-4 w-4 mr-2" />
                More
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="w-full bg-transparent border-0 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-base leading-6"
              rows={1}
              style={{ minHeight: '24px', maxHeight: '200px' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Voice Input */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice input</p>
              </TooltipContent>
            </Tooltip>

            {/* Send Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading || !message.trim()}
                  className="h-8 w-8 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-full transition-colors"
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLoading ? 'Sending...' : 'Send message'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Subtle hint text */}
        <div className="text-center mt-3">
          <p className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}