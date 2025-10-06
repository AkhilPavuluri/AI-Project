"use client"

import { ArrowLeftIcon, InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import InteractiveArchitecture from "@/components/InteractiveArchitecture"

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="absolute top-4 left-4 z-30">
        <div className="flex items-center gap-4">
          <Link href="/chat">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Chat
            </Button>
          </Link>
          <Badge variant="secondary" className="gap-1">
            <InfoIcon className="h-3 w-3" />
            Interactive Architecture
          </Badge>
        </div>
      </div>

      {/* Main Interactive Architecture Component */}
      <InteractiveArchitecture />

      {/* Info Panel */}
      <div className="absolute bottom-4 right-4 z-30 max-w-sm">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p>• Click <strong>Play Animation</strong> to see the data flow</p>
            <p>• Click any component to see detailed information</p>
            <p>• Use mouse wheel to zoom in/out</p>
            <p>• Drag to pan around the diagram</p>
            <p>• Click <strong>Reset</strong> to return to initial state</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
