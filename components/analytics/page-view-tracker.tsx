'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAnalytics } from '@/hooks/use-analytics'

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    // Track page view when pathname or search params change
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    // Map pathnames to readable page names
    const getPageName = (path: string) => {
      const routes: Record<string, string> = {
        '/': 'Home',
        '/signin': 'Sign In',
        '/signup': 'Sign Up',
        '/forgot-password': 'Forgot Password',
        '/reset-password': 'Reset Password',
        '/verify-email': 'Verify Email',
        '/dashboard': 'Dashboard',
        '/analytics': 'Analytics',
        '/billing': 'Billing',
        '/billing/analytics': 'Billing Analytics',
        '/billing/subscription': 'Subscription',
        '/notifications': 'Notifications',
        '/pricing': 'Pricing',
        '/projects': 'Projects',
        '/search': 'Search',
        '/settings': 'Settings',
        '/settings/automation': 'Automation Settings',
        '/settings/workspace': 'Workspace Settings',
        '/tasks': 'Tasks',
        '/team': 'Team',
        '/team/members': 'Team Members',
        '/team/permissions': 'Team Permissions',
      }

      // Handle dynamic routes
      if (path.includes('/projects/') && path.includes('/timeline')) {
        return 'Project Timeline'
      }
      if (path.includes('/projects/') && path.match(/\/projects\/[^/]+$/)) {
        return 'Project Details'
      }

      return routes[path] || path
    }

    const pageName = getPageName(pathname || '')
    
    trackPageView(pageName, {
      path: pathname || '',
      search: searchParams?.toString() || '',
      full_url: url,
    })
  }, [pathname, searchParams, trackPageView])

  return null
}
