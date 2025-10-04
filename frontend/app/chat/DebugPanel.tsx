'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, Copy, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { QueryResponse } from '@/lib/api'

interface DebugPanelProps {
  lastResponse?: QueryResponse
}

export function DebugPanel({ lastResponse }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  const copyTraceToClipboard = async () => {
    if (!lastResponse) return
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(lastResponse, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy trace:', error)
    }
  }

  const getStatusIcon = (value: any) => {
    if (value === 'N/A' || value === 'Coming soon') {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    }
    if (Array.isArray(value) && value.length === 0) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getStatusText = (value: any) => {
    if (value === 'N/A' || value === 'Coming soon') {
      return 'placeholder-value'
    }
    if (Array.isArray(value) && value.length === 0) {
      return 'placeholder-value'
    }
    return 'status-success'
  }

  if (!lastResponse) {
    return (
      <div className="debug-panel">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Developer Debug Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Submit a query to see the processing trace and system status.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="debug-panel">
      <Card>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  Developer Debug Panel
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyTraceToClipboard()
                  }}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Trace'}
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Processing Steps */}
              <div>
                <h3 className="font-semibold mb-3">Processing Steps</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">1</span>
                    <span>Language Detection</span>
                    {getStatusIcon(lastResponse.processing_trace.language)}
                    <span className={getStatusText(lastResponse.processing_trace.language)}>
                      {lastResponse.processing_trace.language}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">2</span>
                    <span>Dense Retrieval</span>
                    {getStatusIcon(lastResponse.processing_trace.retrieval.dense)}
                    <span className={getStatusText(lastResponse.processing_trace.retrieval.dense)}>
                      {lastResponse.processing_trace.retrieval.dense.length} candidates
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">3</span>
                    <span>Sparse Retrieval</span>
                    {getStatusIcon(lastResponse.processing_trace.retrieval.sparse)}
                    <span className={getStatusText(lastResponse.processing_trace.retrieval.sparse)}>
                      {lastResponse.processing_trace.retrieval.sparse.length} candidates
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">4</span>
                    <span>Knowledge Graph Traversal</span>
                    {getStatusIcon(lastResponse.processing_trace.kg_traversal)}
                    <span className={getStatusText(lastResponse.processing_trace.kg_traversal)}>
                      {lastResponse.processing_trace.kg_traversal}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">5</span>
                    <span>LLM Controller Iterations</span>
                    {getStatusIcon(lastResponse.processing_trace.controller_iterations)}
                    <span className={getStatusText(lastResponse.processing_trace.controller_iterations)}>
                      {lastResponse.processing_trace.controller_iterations} iterations
                    </span>
                  </div>
                </div>
              </div>

              {/* Citations */}
              <div>
                <h3 className="font-semibold mb-3">Citations</h3>
                {lastResponse.citations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No citations available</p>
                ) : (
                  <div className="space-y-2">
                    {lastResponse.citations.map((citation, index) => (
                      <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                        <div className="font-medium">Document {citation.docId}</div>
                        <div className="text-muted-foreground">
                          Page {citation.page}, Span: {citation.span}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Risk Assessment */}
              <div>
                <h3 className="font-semibold mb-3">Risk Assessment</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(lastResponse.risk_assessment)}
                  <span className={getStatusText(lastResponse.risk_assessment)}>
                    {lastResponse.risk_assessment}
                  </span>
                </div>
              </div>

              {/* System Status */}
              <div>
                <h3 className="font-semibold mb-3">System Status</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Vector DB</span>
                    <span className="placeholder-value">Not Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Knowledge Graph</span>
                    <span className="placeholder-value">Not Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>LLM Service</span>
                    <span className="placeholder-value">Not Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>API Server</span>
                    <span className="status-success">Running</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}
