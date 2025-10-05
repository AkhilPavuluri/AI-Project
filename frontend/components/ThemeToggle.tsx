'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme-context'

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  const getIcon = () => {
    switch (theme) {
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

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
      default:
        return 'Light'
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        if (theme === 'light') {
          setTheme('dark')
        } else if (theme === 'dark') {
          setTheme('system')
        } else {
          setTheme('light')
        }
      }}
      className="relative"
      title={`Current theme: ${getLabel()}`}
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function ThemeSelect() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={theme === 'light' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('light')}
        className="flex items-center space-x-2"
      >
        <Sun className="h-4 w-4" />
        <span>Light</span>
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('dark')}
        className="flex items-center space-x-2"
      >
        <Moon className="h-4 w-4" />
        <span>Dark</span>
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('system')}
        className="flex items-center space-x-2"
      >
        <Monitor className="h-4 w-4" />
        <span>System</span>
      </Button>
    </div>
  )
}
