"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpenIcon } from "lucide-react"

export default function GettingStartedPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 p-6">
          <div className="max-w-4xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Getting Started</h1>
                <p className="text-gray-600">Install, configure, and launch the application.</p>
              </div>
            </div>

            <div className="mb-4 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <a href="/chat">Back to Chat</a>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">This guide covers prerequisites, installation, configuration, and first run for both local and Docker deployments.</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Node.js 18+ and pnpm/npm</li>
                    <li>Python 3.11 with virtualenv</li>
                    <li>Docker (optional, for containerized run)</li>
                    <li>Ollama or access to hosted LLM APIs (configurable)</li>
                  </ul>
                  <p className="text-xs text-muted-foreground">Windows users can use the provided <code>setup.bat</code>; Linux/macOS use <code>setup.sh</code>.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Start (Local)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Backend: create venv, install from <code>backend/pyproject.toml</code>, run <code>uvicorn backend_app.main:app --reload</code>.</li>
                    <li>Frontend: <code>cd frontend</code>, <code>npm install</code>, then <code>npm run dev</code>.</li>
                    <li>Open the app at <code>http://localhost:3000</code>; API at <code>http://localhost:8000</code>.</li>
                  </ol>
                  <p className="text-xs text-muted-foreground">See <code>RUNNING.md</code> for end-to-end steps.</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-2">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Set model endpoints in <code>frontend/lib/modelService.ts</code> and backend <code>.env</code> variables.</li>
                  <li>Enable/disable retrieval providers in <code>backend/backend_app/services/retrieval.py</code>.</li>
                  <li>Adjust chunking, OCR, and citation parsing in ingestion scripts.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Docker Compose</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-2">
                <p>Use the root <code>docker-compose.yml</code> to boot both services:</p>
                <pre className="bg-muted p-3 rounded text-xs overflow-auto">docker compose up -d --build</pre>
                <p className="text-xs text-muted-foreground">Customize resources and ports as needed for labs or production.</p>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>First Run Checklist</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-2">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Open <code>/architecture</code> and play the animation to validate the UI.</li>
                  <li>Call <code>GET /status</code> to confirm the API is reachable.</li>
                  <li>Run <code>POST /query</code> with a sample question and inspect the trace.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


