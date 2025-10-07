"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CodeIcon } from "lucide-react"

export default function ApiReferencePage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 p-6">
          <div className="max-w-4xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CodeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">API Reference</h1>
                <p className="text-gray-600">Endpoints, authentication, request/response examples.</p>
              </div>
            </div>

            <div className="mb-4 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <a href="/chat">Back to Chat</a>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Base URL & Auth</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-2">
                <p>Base URL: <code>http://localhost:8000/api/v1</code></p>
                <p>Authentication: none in prototype; add API key header <code>X-API-Key</code> in production.</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>POST /query</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p>Submit a natural language policy question.</p>
                  <pre className="bg-muted p-3 rounded text-xs overflow-auto">{`{
  "query": "What are the UGC guidelines for PhD supervision?",
  "model": "deepseek-r1:7b",
  "thinking_mode": "smart",
  "simulate_failure": false
}`}</pre>
                  <p className="text-xs text-muted-foreground">Response includes <code>answer</code>, <code>citations</code>, and <code>processing_trace</code>.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GET /document/{"{document_id}"}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p>Retrieve a document by ID with metadata.</p>
                  <p className="text-xs text-muted-foreground">Returns 404-style error if not found (prototype values).</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>POST /ingest</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p>Submit content/metadata for ingestion. Returns a <code>jobId</code>.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>POST /feedback</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p>Store user feedback with rating and comments for later evaluation.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GET /status</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p>Returns current service states for vector DB, KG, LLM, and others.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scraping Endpoints</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>POST <code>/scrape</code>: scrape a single URL using auto/selenium/playwright/requests/pdf.</li>
                    <li>POST <code>/scrape/batch</code>: scrape up to 50 URLs concurrently.</li>
                    <li>GET <code>/scrape/health</code>: health and dependency check.</li>
                    <li>POST <code>/scrape/government</code>: tuned for UGC/AICTE/India Code sites with legal reference extraction.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


