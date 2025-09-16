'use client'

import { useFeatureFlags } from "@/hooks/use-feature-flags"
import { ReactNode } from "react"

interface KillSwitchProps {
  children: ReactNode
  featureFlag: string
  fallback?: ReactNode
  debugMode?: boolean
}

export function KillSwitch({ 
  children, 
  featureFlag, 
  fallback, 
  debugMode = false 
}: KillSwitchProps) {
  const { isFeatureEnabled } = useFeatureFlags()
  
  // Be permissive by default - only block if explicitly disabled
  // This means undefined/null feature flags won't block access
  const isEnabled = isFeatureEnabled(featureFlag)
  
  // Show debug info in development
  if (debugMode && process.env.NODE_ENV === 'development') {
    return (
      <div className="relative">
        <div className="absolute top-0 right-0 z-50 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
          {featureFlag}: {isEnabled ? 'ON' : 'OFF'}
        </div>
        {isEnabled ? children : fallback}
      </div>
    )
  }
  
  // Only block if feature is explicitly disabled (false)
  // Allow access if feature flag is undefined/null (feature not configured)
  return isEnabled !== false ? <>{children}</> : <>{fallback}</>
}

// Convenience component for navigation items
interface NavigationKillSwitchProps {
  children: ReactNode
  featureFlag: string
}

export function NavigationKillSwitch({ children, featureFlag }: NavigationKillSwitchProps) {
  return (
    <KillSwitch featureFlag={featureFlag} fallback={null}>
      {children}
    </KillSwitch>
  )
}