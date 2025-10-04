"use client"

import {
  BarChartIcon,
  BellIcon,
  Bug,
  CreditCardIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  LogOutIcon,
  MoreVerticalIcon,
  SearchIcon,
  SettingsIcon,
  UserCircleIcon,
  UsersIcon,
  Globe,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
  showDebugPanel,
  onToggleDebugPanel,
  simulateFailure,
  onToggleSimulateFailure,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  showDebugPanel?: boolean
  onToggleDebugPanel?: () => void
  simulateFailure?: boolean
  onToggleSimulateFailure?: () => void
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg premium-scrollbar"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Developer Tools</DropdownMenuLabel>
              {onToggleDebugPanel && (
                <DropdownMenuItem onClick={onToggleDebugPanel}>
                  <Bug />
                  {showDebugPanel ? 'Hide Debug Panel' : 'Show Debug Panel'}
                </DropdownMenuItem>
              )}
              {onToggleSimulateFailure && (
                <DropdownMenuItem onClick={onToggleSimulateFailure}>
                  <Bug />
                  {simulateFailure ? 'Disable Failure Simulation' : 'Enable Failure Simulation'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => window.open('/web-scraper', '_blank')}>
                <Globe />
                Web Scraper
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Manage</DropdownMenuLabel>
              <DropdownMenuItem>
                <SearchIcon />
                Policy Search
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChartIcon />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderIcon />
                Documents
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UsersIcon />
                Team
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileTextIcon />
                Education Policies
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileIcon />
                Administrative
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileCodeIcon />
                AI Prompts
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DatabaseIcon />
                Policy Database
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
