"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SettingsIcon } from "lucide-react"

export default function AdministrationPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 p-6">
          <div className="max-w-4xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SettingsIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
                <p className="text-gray-600">System administration and configuration.</p>
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
                <p className="text-sm text-gray-700">User roles, environment configuration, backups, updates, and observability.</p>
              </CardContent>
            </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Roles & Access</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Admin: system configuration and ingestion controls.</li>
                      <li>Editor: create drafts, approve exports.</li>
                      <li>Viewer: query and read-only access.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Environment Variables</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Model endpoints (OLLAMA_HOST, OPENAI_API_KEY, etc.).</li>
                      <li>Retrievers (QDRANT_URL/KEY, ELASTIC_URL, NEO4J_URI/NEO4J_AUTH).</li>
                      <li>Feature flags: citationBinding, kgTraversal, tracing.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Backup & Restore</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Vector store snapshots and KG export to JSONL.</li>
                      <li>Application configs stored under secure secrets manager.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Observability</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Enable request tracing and latency histograms.</li>
                      <li>Collect feedback metrics for model evaluation.</li>
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


