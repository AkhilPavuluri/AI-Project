'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, Loader2, FileText, Zap, Shield, Users, MessageSquare, Maximize2, Minimize2, ChevronLeft, ChevronRight, ArrowLeftRight, ZoomIn, ZoomOut, RotateCcw, Download, Printer, Maximize } from 'lucide-react'

interface PolicyCrafterProps {
  onReturnToChat: () => void
}

type LayoutState = 'default' | 'focus' | 'deep-assist' | 'full-agent'

export function PolicyCrafter({ onReturnToChat }: PolicyCrafterProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [layoutState, setLayoutState] = useState<LayoutState>('default')
  const [isSwapped, setIsSwapped] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Layout state functions - A4 gets more space regardless of position
  const getLayoutClasses = () => {
    switch (layoutState) {
      case 'default':
        return {
          left: 'w-[25%]',    // Agent gets 25%
          right: 'w-[75%]'    // A4 gets 75%
        }
      case 'focus':
        return {
          left: 'w-[5%]',     // Agent collapsed
          right: 'w-[95%]'    // A4 gets almost full space
        }
      case 'deep-assist':
        return {
          left: 'w-[35%]',    // Agent gets more space for collaboration
          right: 'w-[65%]'    // A4 still gets majority
        }
      case 'full-agent':
        return {
          left: 'w-[50%]',    // Agent gets equal space
          right: 'w-[50%]'    // A4 gets equal space
        }
      default:
        return {
          left: 'w-[25%]',
          right: 'w-[75%]'
        }
    }
  }

  const layoutClasses = getLayoutClasses()

  // Zoom control functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50))
  }

  const handleZoomReset = () => {
    setZoomLevel(100)
  }

  const handleFitToWidth = () => {
    setZoomLevel(85) // Approximate fit-to-width for A4
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleDownload = () => {
    // TODO: Implement PDF download functionality
    console.log('Download PDF')
  }

  const handlePrint = () => {
    // TODO: Implement print functionality
    window.print()
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20 z-50">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          {/* Loading Animation */}
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Initializing Policy Crafter
            </h2>
            <p className="text-sm text-muted-foreground">
              Preparing advanced policy analysis tools...
            </p>
          </div>

          {/* Loading Steps */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-muted-foreground">Loading policy templates</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-muted-foreground">Initializing compliance engine</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-muted-foreground">Setting up AI analysis tools</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background to-muted/20 z-50 overflow-hidden">

      {/* Dual Panel Layout */}
      <div className={`h-full flex transition-all duration-300 ease-in-out ${isSwapped ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Agent Chatbot Panel */}
        <div className={`${layoutClasses.left} transition-all duration-300 ease-in-out bg-muted/20 ${isSwapped ? 'border-l' : 'border-r'}`}>
          {layoutState === 'focus' ? (
            /* Collapsed Agent - Just Icon */
            <div className="h-full flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setLayoutState('default')}
                className="rounded-full w-12 h-12 bg-primary/10 hover:bg-primary/20"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </Button>
            </div>
          ) : (
            /* Expanded Agent Panel */
            <div className="h-full flex flex-col">
              {/* Agent Header */}
              <div className="border-b bg-background/80 backdrop-blur-sm p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Policy Assistant</h3>
                    <p className="text-xs text-muted-foreground">AI-powered policy guidance</p>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto premium-scrollbar p-3 space-y-4">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3 h-3 text-primary" />
                  </div>
                  <div className="bg-background rounded-lg p-3 text-sm">
                    <p>Hello! I'm your Policy Assistant. I can help you:</p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>• Draft policy sections</li>
                      <li>• Review compliance requirements</li>
                      <li>• Suggest improvements</li>
                      <li>• Answer policy questions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">U</span>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3 text-sm">
                    <p>How can I help you with your policy document today?</p>
                  </div>
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="border-t bg-background/80 backdrop-blur-sm p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about policy drafting..."
                    className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button size="sm" className="px-3">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* A4 Policy Canvas Panel */}
        <div className={`${layoutClasses.right} transition-all duration-300 ease-in-out ${isSwapped ? 'border-r' : 'border-l'} bg-background/50`}>
          {/* Document Controls */}
          <div className="border-b bg-background/80 backdrop-blur-sm p-3">
            <div className="flex items-center justify-between">
              {/* Left Side - Return Button and Policy Crafter Title */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReturnToChat}
                  className="gap-2 hover:bg-primary/10 h-7 px-2 text-xs font-medium"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Return to Chat</span>
                </Button>
                
                <div className="w-px h-4 bg-border" />
                
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                    Alpha
                  </div>
                  <h1 className="text-base font-semibold">Policy Crafter</h1>
                </div>
              </div>

              {/* Center Controls - Zoom and Document Actions */}
              <div className="flex items-center gap-4">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 50}
                    className="h-7 w-7 p-0"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </Button>
                  <div className="px-2 py-1 text-xs font-medium min-w-[3rem] text-center">
                    {zoomLevel}%
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 300}
                    className="h-7 w-7 p-0"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomReset}
                  className="h-7 px-2 text-xs"
                  title="Reset Zoom"
                >
                  Reset
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFitToWidth}
                  className="h-7 px-2 text-xs"
                  title="Fit to Width"
                >
                  <Maximize className="w-3 h-3 mr-1" />
                  Fit
                </Button>

                {/* Document Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRotate}
                    className="h-7 w-7 p-0"
                    title="Rotate Document"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="h-7 w-7 p-0"
                    title="Download PDF"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrint}
                    className="h-7 w-7 p-0"
                    title="Print Document"
                  >
                    <Printer className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Layout Controls - Right Side */}
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                  <Button
                    variant={layoutState === 'focus' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutState('focus')}
                    className="h-7 w-7 p-0"
                    title="Focus Mode"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={layoutState === 'default' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutState('default')}
                    className="h-7 w-7 p-0"
                    title="Default Layout"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={layoutState === 'deep-assist' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutState('deep-assist')}
                    className="h-7 w-7 p-0"
                    title="Deep Assist Mode"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={layoutState === 'full-agent' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutState('full-agent')}
                    className="h-7 w-7 p-0"
                    title="Full Agent Mode"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <Button
                  variant={isSwapped ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setIsSwapped(!isSwapped)}
                  className="h-7 w-7 p-0"
                  title="Switch sides"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="h-full overflow-y-auto premium-scrollbar p-6">
            <div className="flex justify-center">
              {/* A4 Document Container - 210mm x 297mm (8.27" x 11.69") */}
              <div 
                className="bg-white shadow-lg rounded-lg border mx-auto transition-transform duration-200 ease-in-out" 
                style={{ 
                  width: '210mm', 
                  height: '297mm', 
                  maxWidth: '100%',
                  aspectRatio: '210/297',
                  padding: '20mm',
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <div className="h-full flex flex-col">
                  {/* Document Header */}
                  <div className="text-center border-b pb-4 mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Policy Document</h1>
                    <p className="text-xs text-gray-600 mt-1">GITAM Education Policy Framework</p>
                    <p className="text-xs text-gray-500 mt-1">Version 1.0 | Effective Date: 2024</p>
                  </div>
                  
                  {/* Document Content */}
                  <div className="flex-1 space-y-3 text-gray-800 text-sm leading-relaxed">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    
                    <div className="mt-6 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  
                  {/* Document Footer */}
                  <div className="mt-6 pt-4 border-t text-xs text-gray-500 text-center">
                    <p>Page 1 of 1 | Document ID: POL-2024-001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
