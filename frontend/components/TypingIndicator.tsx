'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <Avatar className="w-8 h-8 bg-secondary">
        <AvatarFallback className="text-secondary-foreground text-sm font-medium bg-secondary">
          AI
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 max-w-3xl">
        <div className="inline-block rounded-2xl px-4 py-3 text-sm bg-muted text-foreground border border-border">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}