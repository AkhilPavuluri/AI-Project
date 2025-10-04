'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Settings, Bug, AlertTriangle } from 'lucide-react'

interface DeveloperControlsProps {
  showDebugPanel: boolean
  onToggleDebugPanel: () => void
  simulateFailure: boolean
  onToggleSimulateFailure: () => void
}

export function DeveloperControls({
  showDebugPanel,
  onToggleDebugPanel,
  simulateFailure,
  onToggleSimulateFailure,
}: DeveloperControlsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={showDebugPanel ? "default" : "outline"}
        size="sm"
        onClick={onToggleDebugPanel}
        className="flex items-center gap-2"
      >
        <Bug className="h-4 w-4" />
        {showDebugPanel ? 'Hide Debug' : 'Show Debug'}
      </Button>
      
      <Button
        variant={simulateFailure ? "destructive" : "outline"}
        size="sm"
        onClick={onToggleSimulateFailure}
        className="flex items-center gap-2"
      >
        <AlertTriangle className="h-4 w-4" />
        {simulateFailure ? 'Disable Failure' : 'Simulate Failure'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </div>
  )
}
