"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpenIcon, 
  FileTextIcon, 
  CodeIcon, 
  SettingsIcon,
  UsersIcon,
  ScaleIcon
} from "lucide-react"

export default function DocumentationPage() {
  const sections = [
    { title: "Getting Started", href: "/documentation/getting-started", icon: BookOpenIcon, description: "Install, configure, and launch." },
    { title: "API Reference", href: "/documentation/api-reference", icon: CodeIcon, description: "Endpoints, auth, and usage." },
    { title: "User Guide", href: "/documentation/user-guide", icon: FileTextIcon, description: "How to use the product." },
    { title: "Administration", href: "/documentation/administration", icon: SettingsIcon, description: "Admin settings and operations." },
    { title: "Approaches: Accuracy • Balance • Efficiency", href: "/documentation/approaches", icon: ScaleIcon, description: "Choose the right architecture trade‑offs." },
    { title: "Troubleshooting", href: "/documentation/troubleshooting", icon: UsersIcon, description: "FAQ and common issues." },
  ]

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="px-6 py-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpenIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
                  <p className="text-gray-600">Explore rich guides across exactly six core areas.</p>
                </div>
              </div>
            </div>

            <div className="mb-4 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <a href="/chat">Back to Chat</a>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((s) => (
                <Card key={s.title} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-md">
                        <s.icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{s.title}</CardTitle>
                        <p className="text-xs text-gray-500">{s.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild variant="outline" size="sm">
                      <a href={s.href}>Open {s.title}</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
