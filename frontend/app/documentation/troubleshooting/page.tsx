"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircleIcon } from "lucide-react"

export default function TroubleshootingPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 p-6">
          <div className="max-w-4xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HelpCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Troubleshooting</h1>
                <p className="text-gray-600">FAQ and solutions to common issues.</p>
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
                <p className="text-sm text-gray-700">Fix common startup issues, retrieval errors, and model failures.</p>
              </CardContent>
            </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Startup</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>API not reachable: confirm <code>uvicorn</code> running on port 8000.</li>
                      <li>Frontend 404s: ensure <code>npm run dev</code> is active on 3000.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Retrieval</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>No results: check vector DB connectivity and collection names.</li>
                      <li>Slow queries: enable caching and lower topK in configuration.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Models</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Ollama not found: start the Ollama service and pull required models.</li>
                      <li>API key errors: verify environment variables and scopes.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Getting Help</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>Attach logs from the API and frontend console. Include steps to reproduce and the endpoint called.</p>
                  </CardContent>
                </Card>
              </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


