"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Activity, CheckCircle2, Users, TrendingUp, Settings, CreditCard, FolderOpen, List, Bell, Search } from "lucide-react"
import { useFeatureFlags } from "@/hooks/use-feature-flags"
import { useAuth } from "@/hooks/use-auth"

interface NavigationItem {
  title: string
  href: string
  icon: any
  badge?: string
  requiredTier?: 'free' | 'pro' | 'enterprise'
  requiredFeatureFlag?: string
  requiredRole?: 'member' | 'admin' | 'owner'
}

const navigationItems: NavigationItem[] = [
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
    requiredTier: 'pro', // Team features require pro or enterprise
    requiredFeatureFlag: 'team-management',
  },
  {
    title: "Analytics", 
    href: "/analytics",
    icon: TrendingUp,
    requiredTier: 'pro', // Analytics require pro or enterprise
    requiredFeatureFlag: 'advanced-analytics',
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    requiredFeatureFlag: 'notifications', // Can be killed via feature flag
  },
  {
    title: "Search",
    href: "/search", 
    icon: Search,
    requiredTier: 'pro',
    requiredFeatureFlag: 'advanced-search',
  },
]

// Development/Testing navigation items (only shown in development)
const devNavigationItems: NavigationItem[] = [
  {
    title: "Feature Status",
    href: "/feature-status",
    icon: Activity,
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

const settingsItems: NavigationItem[] = [
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

// Helper function to check if user has access to a navigation item
function hasAccessToItem(
  item: NavigationItem, 
  profile: any, 
  isFeatureEnabled: (flag: string) => boolean
): boolean {
  // Check subscription tier requirement
  if (item.requiredTier) {
    const tierHierarchy = { free: 0, pro: 1, enterprise: 2 }
    const userTier = tierHierarchy[profile?.subscription_tier as keyof typeof tierHierarchy] ?? 0
    const requiredTier = tierHierarchy[item.requiredTier]
    
    if (userTier < requiredTier) {
      return false
    }
  }

  // Check role requirement
  if (item.requiredRole) {
    const userRole = profile?.role || 'member'
    const roleHierarchy = { member: 0, admin: 1, owner: 2 }
    const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] ?? 0
    const requiredRoleLevel = roleHierarchy[item.requiredRole as keyof typeof roleHierarchy] ?? 0
    
    if (userRoleLevel < requiredRoleLevel) {
      return false
    }
  }

  // Check feature flag requirement (kill switch)
  if (item.requiredFeatureFlag) {
    if (!isFeatureEnabled(item.requiredFeatureFlag)) {
      return false
    }
  }

  return true
}

export function Navigation({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()
  const { profile } = useAuth()
  const { isFeatureEnabled } = useFeatureFlags()

  // Filter navigation items based on access control
  const filteredNavigationItems = navigationItems.filter(item => 
    hasAccessToItem(item, profile, isFeatureEnabled)
  )
  
  // Add dev items in development
  const allNavigationItems = process.env.NODE_ENV === 'development' 
    ? [...filteredNavigationItems, ...devNavigationItems]
    : filteredNavigationItems
  
  const filteredSettingsItems = settingsItems.filter(item => 
    hasAccessToItem(item, profile, isFeatureEnabled)
  )

  return (
    <nav className="space-y-6">
      <div className="space-y-2">
        {allNavigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname ? (pathname === item.href || pathname.startsWith(item.href + "/")) : false

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
              const isActive = pathname ? pathname === item.href : false

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
        {filteredSettingsItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname ? (pathname === item.href || pathname.startsWith(item.href + "/")) : false

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
