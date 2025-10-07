"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileTextIcon } from "lucide-react"

export default function UserGuidePage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 p-6">
          <div className="max-w-4xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Guide</h1>
                <p className="text-gray-600">Step-by-step guides for common tasks.</p>
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
                <p className="text-sm text-gray-700">Walkthroughs for querying, crafting drafts, citing sources, and exporting outputs.</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ask and Cite</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Open Chat and enter a question in English or HI/TE.</li>
                    <li>Review the answer with inline citations; hover to preview sources.</li>
                    <li>Click a citation to open the underlying document.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>PolicyCrafter</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p>Generate structured drafts (briefs, SOPs, circulars) with section templates.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Insert evidence snippets from the retrieval panel.</li>
                    <li>Toggle translation to HI/TE where needed.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export & Review</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Copy to clipboard, download Markdown, or export PDF.</li>
                    <li>Attach trace and citations for audit.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feedback Loop</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p>Rate answers and flag incorrect citations; this is sent to <code>POST /feedback</code>.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


