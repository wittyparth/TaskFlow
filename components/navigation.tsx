"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Activity, CheckCircle2, Users, TrendingUp, Settings, CreditCard, FolderOpen, List } from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Activity,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: CheckCircle2,
    badge: "12",
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: List,
    badge: "8",
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
  },
]

const workspaceItems = [
  {
    title: "Recent Projects",
    items: [
      { title: "Website Redesign", href: "/projects/1", icon: FolderOpen },
      { title: "Mobile App", href: "/projects/2", icon: FolderOpen },
      { title: "Marketing Campaign", href: "/projects/3", icon: FolderOpen },
    ],
  },
]

const settingsItems = [
  {
    title: "Subscription",
    href: "/subscription",
    icon: CreditCard,
  },
  {
    title: "Settings", 
    href: "/settings",
    icon: Settings,
  },
]

export function Navigation({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-6">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Button 
              key={item.href} 
              variant={isActive ? "secondary" : "ghost"} 
              className={`w-full ${collapsed ? 'justify-center px-0' : 'justify-start'}`} 
              asChild
            >
              <Link href={item.href} title={collapsed ? item.title : undefined}>
                <Icon className={`h-4 w-4 ${collapsed ? '' : 'mr-2'}`} />
                {!collapsed && (
                  <>
                    {item.title}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            </Button>
          )
        })}
      </div>

      {!collapsed && (
        <>
          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground px-2">Recent Projects</h4>
            {workspaceItems[0].items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-3 w-3" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </>
      )}

      <Separator />

      <div className="space-y-2">
        {settingsItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Button 
              key={item.href} 
              variant={isActive ? "secondary" : "ghost"} 
              className={`w-full ${collapsed ? 'justify-center px-0' : 'justify-start'}`} 
              asChild
            >
              <Link href={item.href} title={collapsed ? item.title : undefined}>
                <Icon className={`h-4 w-4 ${collapsed ? '' : 'mr-2'}`} />
                {!collapsed && item.title}
              </Link>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
