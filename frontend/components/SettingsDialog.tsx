'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Settings, Save, X, Eye, EyeOff, Key, Cloud, Server, Sun, Moon, Monitor } from 'lucide-react'
import { CLOUD_MODELS } from '@/lib/models'
import { useTheme } from '@/lib/theme-context'

interface SettingsDialogProps {
  children: React.ReactNode
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    // General Settings
    language: 'en',
    autoSave: true,
    notifications: true,
    
    // Chat Settings
    maxTokens: '4000',
    temperature: '0.7',
    model: 'gemini-2.5-flash',
    systemPrompt: 'You are a helpful AI assistant.',
    
    // Privacy Settings
    dataCollection: false,
    analytics: false,
    
    // Advanced Settings
    apiEndpoint: 'https://api.openai.com/v1',
    timeout: '30',
    retryAttempts: '3',
    
    // Cloud API Keys
    geminiApiKey: '',
    openaiApiKey: '',
    anthropicApiKey: '',
    
    // Ollama Settings
    ollamaUrl: 'http://localhost:11434',
  })

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('app-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('app-settings', JSON.stringify(settings))
    
    // Update environment variables for API keys (in a real app, you'd send these to backend)
    if (settings.geminiApiKey) {
      process.env.NEXT_PUBLIC_GEMINI_API_KEY = settings.geminiApiKey
    }
    if (settings.openaiApiKey) {
      process.env.NEXT_PUBLIC_OPENAI_API_KEY = settings.openaiApiKey
    }
    if (settings.anthropicApiKey) {
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY = settings.anthropicApiKey
    }
    if (settings.ollamaUrl) {
      process.env.NEXT_PUBLIC_OLLAMA_URL = settings.ollamaUrl
    }
    
    console.log('Settings saved:', settings)
    setOpen(false)
  }

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      language: 'en',
      autoSave: true,
      notifications: true,
      maxTokens: '4000',
      temperature: '0.7',
      model: 'gemini-2.5-flash',
      systemPrompt: 'You are a helpful AI assistant.',
      dataCollection: false,
      analytics: false,
      apiEndpoint: 'https://api.openai.com/v1',
      timeout: '30',
      retryAttempts: '3',
      geminiApiKey: '',
      openaiApiKey: '',
      anthropicApiKey: '',
      ollamaUrl: 'http://localhost:11434',
    })
    setTheme('system')
  }

  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getApiKeyDisplay = (key: string) => {
    if (!key) return ''
    if (showApiKeys[key]) return key
    return '•'.repeat(Math.min(key.length, 20))
  }

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your application preferences and behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">General</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave">Auto-save conversations</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save your chat history
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={settings.autoSave}
                onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new messages
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
              />
            </div>
          </div>

          <Separator />

          {/* Chat Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Chat</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select value={settings.model} onValueChange={(value) => setSettings({...settings, model: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={settings.maxTokens}
                  onChange={(e) => setSettings({...settings, maxTokens: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({...settings, temperature: e.target.value})}
              />
              <p className="text-sm text-muted-foreground">
                Controls randomness. Lower values make responses more focused and deterministic.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={settings.systemPrompt}
                onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                placeholder="Enter the system prompt for the AI..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Cloud API Keys */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Cloud API Keys
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure API keys for cloud-based AI models. These keys are stored locally in your browser.
            </p>
            
            {/* Google Gemini */}
            <div className="space-y-2">
              <Label htmlFor="geminiApiKey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Google Gemini API Key
              </Label>
              <div className="flex gap-2">
                <Input
                  id="geminiApiKey"
                  type={showApiKeys.gemini ? 'text' : 'password'}
                  value={settings.geminiApiKey}
                  onChange={(e) => setSettings({...settings, geminiApiKey: e.target.value})}
                  placeholder="Enter your Gemini API key..."
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleApiKeyVisibility('gemini')}
                >
                  {showApiKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>
              </p>
            </div>

            {/* OpenAI */}
            <div className="space-y-2">
              <Label htmlFor="openaiApiKey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                OpenAI API Key
              </Label>
              <div className="flex gap-2">
                <Input
                  id="openaiApiKey"
                  type={showApiKeys.openai ? 'text' : 'password'}
                  value={settings.openaiApiKey}
                  onChange={(e) => setSettings({...settings, openaiApiKey: e.target.value})}
                  placeholder="Enter your OpenAI API key..."
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleApiKeyVisibility('openai')}
                >
                  {showApiKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI Platform</a>
              </p>
            </div>

            {/* Anthropic */}
            <div className="space-y-2">
              <Label htmlFor="anthropicApiKey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Anthropic API Key
              </Label>
              <div className="flex gap-2">
                <Input
                  id="anthropicApiKey"
                  type={showApiKeys.anthropic ? 'text' : 'password'}
                  value={settings.anthropicApiKey}
                  onChange={(e) => setSettings({...settings, anthropicApiKey: e.target.value})}
                  placeholder="Enter your Anthropic API key..."
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleApiKeyVisibility('anthropic')}
                >
                  {showApiKeys.anthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Anthropic Console</a>
              </p>
            </div>
          </div>

          <Separator />

          {/* Ollama Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Server className="h-5 w-5" />
              Ollama Settings
            </h3>
            <div className="space-y-2">
              <Label htmlFor="ollamaUrl">Ollama Server URL</Label>
              <Input
                id="ollamaUrl"
                value={settings.ollamaUrl}
                onChange={(e) => setSettings({...settings, ollamaUrl: e.target.value})}
                placeholder="http://localhost:11434"
              />
              <p className="text-xs text-muted-foreground">
                URL where your Ollama server is running. Default is localhost:11434
              </p>
            </div>
          </div>

          <Separator />

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Privacy</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dataCollection">Data Collection</Label>
                <p className="text-sm text-muted-foreground">
                  Allow collection of usage data to improve the service
                </p>
              </div>
              <Switch
                id="dataCollection"
                checked={settings.dataCollection}
                onCheckedChange={(checked) => setSettings({...settings, dataCollection: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics">Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Share anonymous usage analytics
                </p>
              </div>
              <Switch
                id="analytics"
                checked={settings.analytics}
                onCheckedChange={(checked) => setSettings({...settings, analytics: checked})}
              />
            </div>
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Advanced</h3>
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                value={settings.apiEndpoint}
                onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={settings.timeout}
                  onChange={(e) => setSettings({...settings, timeout: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retryAttempts">Retry Attempts</Label>
                <Input
                  id="retryAttempts"
                  type="number"
                  value={settings.retryAttempts}
                  onChange={(e) => setSettings({...settings, retryAttempts: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


