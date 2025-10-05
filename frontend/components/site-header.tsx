import { useState, useEffect } from "react"
import { ChevronDown, Bot, MoreHorizontal, Settings, HelpCircle, Search, Download, Share, Archive, Cloud, Server, Wifi, WifiOff } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AIModel, OllamaModel, CloudModel } from "@/lib/models"
import { modelService } from "@/lib/modelService"
import { ThemeToggle } from "@/components/ThemeToggle"
import { SettingsDialog } from "@/components/SettingsDialog"

interface SiteHeaderProps {
  selectedModel?: string
  onModelChange?: (model: string) => void
}

export function SiteHeader({ selectedModel = "gemini-2.5-flash", onModelChange }: SiteHeaderProps) {
  const [models, setModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOllamaConnected, setIsOllamaConnected] = useState(false)

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true)
      try {
        const [allModels, ollamaConnected] = await Promise.all([
          modelService.getAllModels(),
          modelService.checkOllamaConnection()
        ])
        setModels(allModels)
        setIsOllamaConnected(ollamaConnected)
      } catch (error) {
        console.error('Error loading models:', error)
        // Fallback to cloud models only
        setModels(modelService.getCloudModels())
      } finally {
        setIsLoading(false)
      }
    }

    loadModels()
  }, [])

  const currentModel = models.find(model => model.id === selectedModel) || models.find(model => model.isAvailable) || models[0]

  return (
    <header className="site-header group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear relative z-30">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Left side - Sidebar trigger and model selector */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          
          {/* Model Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 px-2 gap-2">
                <Bot className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {isLoading ? 'Loading...' : currentModel?.name || 'Select Model'}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 premium-scrollbar max-h-96">
              {/* Ollama Models Section */}
              <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2">
                <Server className="h-4 w-4" />
                <span>Local Models (Ollama)</span>
                {isOllamaConnected ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-500" />
                )}
              </DropdownMenuLabel>
              {models
                .filter((model): model is OllamaModel => model.category === 'ollama')
                .map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => onModelChange?.(model.id)}
                    className="flex flex-col items-start gap-1 p-3"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Server className="h-4 w-4" />
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                        Downloaded
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{model.description}</span>
                      {model.size && <span>• {model.size}</span>}
                    </div>
                  </DropdownMenuItem>
                ))}

              {/* Cloud Models Section - Only show if any are available */}
              {models.filter(model => model.category === 'cloud').length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2">
                    <Cloud className="h-4 w-4" />
                    <span>Cloud Models</span>
                  </DropdownMenuLabel>
                  {models
                    .filter((model): model is CloudModel => model.category === 'cloud')
                    .map((model) => (
                      <DropdownMenuItem
                        key={model.id}
                        onClick={() => onModelChange?.(model.id)}
                        className="flex flex-col items-start gap-1 p-3"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Cloud className="h-4 w-4" />
                          <span className="font-medium">{model.name}</span>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                            Available
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{model.description}</span>
                          {model.pricing && <span>• {model.pricing.input}</span>}
                        </div>
                      </DropdownMenuItem>
                    ))}
                </>
              )}

              {/* No models available message */}
              {models.length === 0 && !isLoading && (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  <p>No models available</p>
                  <p className="text-xs mt-1">
                    Configure API keys in Settings or download Ollama models
                  </p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side - Policy Crafter pill, Theme toggle, and 3-dot menu */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-3 gap-2">
            <div className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
              Alpha
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Policy Crafter
            </span>
          </Button>
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <ThemeToggle />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 premium-scrollbar">
              <SettingsDialog>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </SettingsDialog>
              <DropdownMenuItem>
                <HelpCircle className="h-4 w-4 mr-2" />
                Get Help
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Search className="h-4 w-4 mr-2" />
                Search
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
