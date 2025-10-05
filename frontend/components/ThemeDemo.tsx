'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme, useThemeClasses } from '@/lib/theme-context'
import { Sun, Moon, Monitor, Palette, Sparkles } from 'lucide-react'

export function ThemeDemo() {
  const { theme, actualTheme } = useTheme()
  const themeClasses = useThemeClasses()

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Premium Theme System</h1>
        <p className="text-muted-foreground">
          Professional color palettes with seamless light/dark mode switching
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            Current: {theme}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Actual: {actualTheme}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Color Palette Card */}
        <Card className="premium-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Palette
            </CardTitle>
            <CardDescription>
              Professional colors inspired by modern enterprise applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <div className="h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-medium">
                  Primary
                </div>
                <div className="h-8 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-xs font-medium">
                  Secondary
                </div>
                <div className="h-8 bg-accent rounded flex items-center justify-center text-accent-foreground text-xs font-medium">
                  Accent
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-success rounded flex items-center justify-center text-success-foreground text-xs font-medium">
                  Success
                </div>
                <div className="h-8 bg-warning rounded flex items-center justify-center text-warning-foreground text-xs font-medium">
                  Warning
                </div>
                <div className="h-8 bg-destructive rounded flex items-center justify-center text-destructive-foreground text-xs font-medium">
                  Error
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Glass Morphism Card */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Glass Morphism
            </CardTitle>
            <CardDescription>
              Modern glass effect with backdrop blur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This card uses glass morphism effects with backdrop blur and transparency.
              Perfect for modern UI overlays and modals.
            </p>
          </CardContent>
        </Card>

        {/* Gradient Card */}
        <Card className="gradient-primary text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Gradient Background
            </CardTitle>
            <CardDescription className="text-white/80">
              Beautiful gradient backgrounds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/90">
              Dynamic gradients that adapt to the current theme. 
              Perfect for hero sections and call-to-action elements.
            </p>
          </CardContent>
        </Card>

        {/* Theme Classes Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Classes</CardTitle>
            <CardDescription>
              Utility classes for theme-aware styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded ${themeClasses.card}`}>
              <p className="text-sm">Card styling with theme classes</p>
            </div>
            <div className="flex gap-2">
              <Button className={themeClasses.buttonPrimary}>
                Primary Button
              </Button>
              <Button variant="outline" className={themeClasses.buttonSecondary}>
                Secondary Button
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
            <CardDescription>
              Theme-aware status colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="status-success text-sm">Success message</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="status-warning text-sm">Warning message</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="status-error text-sm">Error message</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-info rounded-full"></div>
              <span className="status-info text-sm">Info message</span>
            </div>
          </CardContent>
        </Card>

        {/* Theme Icons */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Icons</CardTitle>
            <CardDescription>
              Visual indicators for current theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Sun className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs">Light</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Moon className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs">Dark</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Monitor className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs">System</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Use the theme toggle in the header or settings to switch between themes
        </p>
      </div>
    </div>
  )
}
