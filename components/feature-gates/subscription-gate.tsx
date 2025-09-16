'use client'

import { useAuth } from "@/hooks/use-auth"
import { useFeatureFlags } from "@/hooks/use-feature-flags"
import { ReactNode } from "react"

interface SubscriptionGateProps {
  children: ReactNode
  requiredTier?: 'free' | 'pro' | 'enterprise'
  requiredFeatureFlag?: string
  requiredRole?: 'member' | 'admin' | 'owner'
  fallback?: ReactNode
  showUpgradePrompt?: boolean
}

export function SubscriptionGate({
  children,
  requiredTier,
  requiredFeatureFlag,
  requiredRole,
  fallback,
  showUpgradePrompt = false
}: SubscriptionGateProps) {
  const { profile } = useAuth()
  const { isFeatureEnabled } = useFeatureFlags()

  // Check subscription tier requirement
  if (requiredTier) {
    const tierHierarchy = { free: 0, pro: 1, enterprise: 2 }
    const userTier = tierHierarchy[profile?.subscription_tier as keyof typeof tierHierarchy] ?? 0
    const requiredTierLevel = tierHierarchy[requiredTier]
    
    if (userTier < requiredTierLevel) {
      if (showUpgradePrompt) {
        return (
          <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              This feature requires {requiredTier} plan or higher
            </p>
            <button className="text-primary text-sm hover:underline">
              Upgrade to {requiredTier}
            </button>
          </div>
        )
      }
      return fallback || null
    }
  }

  // Check role requirement
  if (requiredRole) {
    const userRole = profile?.role || 'member'
    const roleHierarchy = { member: 0, admin: 1, owner: 2 }
    const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] ?? 0
    const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 0
    
    if (userRoleLevel < requiredRoleLevel) {
      return fallback || null
    }
  }

  // Check feature flag requirement (kill switch)
  if (requiredFeatureFlag) {
    if (!isFeatureEnabled(requiredFeatureFlag)) {
      return fallback || null
    }
  }

  return <>{children}</>
}