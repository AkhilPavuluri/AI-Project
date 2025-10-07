"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  customRenderers,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isDropdown?: boolean
    dropdownItems?: {
      title: string
      url: string
      icon: LucideIcon
    }[]
  }[]
  customRenderers?: {
    [key: string]: (item: { 
      title: string
      url: string
      icon: LucideIcon
      isDropdown?: boolean
      dropdownItems?: {
        title: string
        url: string
        icon: LucideIcon
      }[]
    }) => React.ReactNode
  }
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {customRenderers?.[item.title] ? (
                customRenderers[item.title](item)
              ) : (
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
