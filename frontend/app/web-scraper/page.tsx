'use client'

import { useState, useEffect } from 'react'
import { useSuppressHydrationWarning } from '@/lib/suppress-hydration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Globe, 
  Download, 
  Play, 
  Square, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  FileText,
  Image,
  Link,
  Activity,
  Shield
} from 'lucide-react'
import { scrapeUrl, scrapeGovernmentSite, getScraperHealth, ScrapedData, ScraperHealthResponse } from '@/lib/api'

export default function WebScraperPage() {
  // Suppress hydration warnings for browser extension attributes
  useSuppressHydrationWarning()

  const [url, setUrl] = useState('')
  const [isScraping, setIsScraping] = useState(false)
  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([])
  const [currentData, setCurrentData] = useState<ScrapedData | null>(null)
  const [scrapingMethod, setScrapingMethod] = useState<'auto' | 'selenium' | 'playwright' | 'requests' | 'pdf'>('auto')
  const [isGovernmentSite, setIsGovernmentSite] = useState(false)
  const [scraperHealth, setScraperHealth] = useState<ScraperHealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load scraper health on component mount
  useEffect(() => {
    loadScraperHealth()
  }, [])

  const loadScraperHealth = async () => {
    try {
      const health = await getScraperHealth()
      setScraperHealth(health)
    } catch (error) {
      console.error('Failed to load scraper health:', error)
    }
  }

  const handleScrape = async () => {
    if (!url.trim()) return

    setIsScraping(true)
    setError(null)
    
    // Create initial processing entry
    const processingEntry: ScrapedData = {
      url: url.trim(),
      title: 'Processing...',
      content: '',
      images: [],
      links: [],
      pdfs: [],
      metadata: {},
      timestamp: new Date().toISOString(),
      status: 'processing',
      method_used: scrapingMethod,
      processing_time: 0
    }
    
    setCurrentData(processingEntry)

    try {
      let result: ScrapedData
      
      if (isGovernmentSite) {
        // Use government-specific scraping
        result = await scrapeGovernmentSite({
          url: url.trim(),
          site_type: detectGovernmentSiteType(url.trim()),
          extract_pdfs: true,
          extract_acts: true
        })
      } else {
        // Use regular scraping
        result = await scrapeUrl({
          url: url.trim(),
          method: scrapingMethod,
          max_retries: 3
        })
      }

      setCurrentData(result)
      setScrapedData(prev => [result, ...prev])
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)
      
      const errorData: ScrapedData = {
        url: url.trim(),
        title: 'Error',
        content: `Failed to scrape: ${errorMessage}`,
        images: [],
        links: [],
        pdfs: [],
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'error',
        method_used: scrapingMethod,
        processing_time: 0
      }
      
      setCurrentData(errorData)
      setScrapedData(prev => [errorData, ...prev])
    } finally {
      setIsScraping(false)
      setUrl('')
    }
  }

  const detectGovernmentSiteType = (url: string): string => {
    if (url.includes('indiacode.nic.in')) return 'indiacode'
    if (url.includes('ugc.gov.in')) return 'ugc'
    if (url.includes('aicte-india.org')) return 'aicte'
    if (url.includes('education.gov.in')) return 'education'
    if (url.includes('egazette.nic.in')) return 'egazette'
    return 'unknown'
  }

  const handleStop = () => {
    setIsScraping(false)
    setCurrentData(null)
  }

  const exportData = () => {
    if (!currentData) return
    
    const dataStr = JSON.stringify(currentData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `scraped-data-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'selenium':
        return 'bg-orange-100 text-orange-800'
      case 'playwright':
        return 'bg-purple-100 text-purple-800'
      case 'requests':
        return 'bg-blue-100 text-blue-800'
      case 'pdf':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advanced Web Scraper</h1>
            <p className="text-muted-foreground mt-2">
              Extract content, images, links, and PDFs from web pages using multiple strategies
            </p>
          </div>
          <div className="flex items-center gap-2">
            {scraperHealth && (
              <Badge variant={scraperHealth.selenium_available ? "default" : "destructive"} className="text-sm">
                <Activity className="h-4 w-4 mr-2" />
                {scraperHealth.selenium_available ? "Selenium Ready" : "Selenium Unavailable"}
              </Badge>
            )}
            <Badge variant="outline" className="text-sm">
              <Globe className="h-4 w-4 mr-2" />
              Advanced Tool
            </Badge>
          </div>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Scrape URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter URL to scrape (e.g., https://indiacode.nic.in)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isScraping && handleScrape()}
                disabled={isScraping}
                className="flex-1"
              />
              {isScraping ? (
                <Button onClick={handleStop} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button onClick={handleScrape} disabled={!url.trim()}>
                  <Play className="h-4 w-4 mr-2" />
                  Scrape
                </Button>
              )}
            </div>
            
            {/* Advanced Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Scraping Method</label>
                <Select value={scrapingMethod} onValueChange={(value: any) => setScrapingMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto Detect</SelectItem>
                    <SelectItem value="selenium">Selenium (Dynamic)</SelectItem>
                    <SelectItem value="playwright">Playwright (Modern)</SelectItem>
                    <SelectItem value="requests">Requests (Static)</SelectItem>
                    <SelectItem value="pdf">PDF Extract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Type</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="government-site"
                    checked={isGovernmentSite}
                    onChange={(e) => setIsGovernmentSite(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="government-site" className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Government Site
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Actions</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUrl('https://indiacode.nic.in')}
                    disabled={isScraping}
                  >
                    India Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUrl('https://ugc.gov.in')}
                    disabled={isScraping}
                  >
                    UGC
                  </Button>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            {isScraping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Scraping {url} using {scrapingMethod}...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Results */}
        {currentData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(currentData.status)}
                  Current Results
                  <Badge className={getMethodBadgeColor(currentData.method_used)}>
                    {currentData.method_used}
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  {currentData.processing_time > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {currentData.processing_time.toFixed(2)}s
                    </span>
                  )}
                  {currentData.status === 'success' && (
                    <Button onClick={exportData} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">URL</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={currentData.url} readOnly className="bg-muted" />
                  <Button size="sm" variant="outline" onClick={() => window.open(currentData.url, '_blank')}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <Input value={currentData.title} readOnly className="bg-muted mt-1" />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Content</label>
                <Textarea 
                  value={currentData.content} 
                  readOnly 
                  className="bg-muted mt-1 min-h-32" 
                  placeholder="Content will appear here..."
                />
              </div>

              {/* Images */}
              {currentData.images.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Images ({currentData.images.length})
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {currentData.images.map((img, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Image className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{img}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs */}
              {currentData.pdfs && currentData.pdfs.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDFs ({currentData.pdfs.length})
                  </label>
                  <div className="space-y-2 mt-2">
                    {currentData.pdfs.map((pdf, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <FileText className="h-4 w-4 text-red-500" />
                        <span className="text-sm truncate flex-1">{pdf}</span>
                        <Button size="sm" variant="ghost" onClick={() => window.open(pdf, '_blank')}>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {currentData.links.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Links ({currentData.links.length})
                  </label>
                  <div className="space-y-2 mt-2">
                    {currentData.links.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Link className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate flex-1">{link}</span>
                        <Button size="sm" variant="ghost" onClick={() => window.open(link, '_blank')}>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {currentData.metadata && Object.keys(currentData.metadata).length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Metadata</label>
                  <div className="mt-2 p-3 bg-muted rounded">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {JSON.stringify(currentData.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Scraped At</label>
                <Input 
                  value={new Date(currentData.timestamp).toLocaleString()} 
                  readOnly 
                  className="bg-muted mt-1" 
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* History */}
        {scrapedData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Scraping History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scrapedData.map((data, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                    onClick={() => setCurrentData(data)}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(data.status)}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {data.title}
                          <Badge className={`text-xs ${getMethodBadgeColor(data.method_used)}`}>
                            {data.method_used}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{data.url}</div>
                        <div className="text-xs text-muted-foreground">
                          {data.pdfs?.length || 0} PDFs • {data.links.length} links • {data.processing_time.toFixed(2)}s
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(data.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
