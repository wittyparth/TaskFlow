'use client'

import { useFeatureFlag } from '@/hooks/use-feature-flags'

interface FeatureFlagProps {
  flag: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureFlag({ flag, children, fallback = null }: FeatureFlagProps) {
  const isEnabled = useFeatureFlag(flag)

  if (isEnabled) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

interface SubscriptionGateProps {
  tier: 'free' | 'pro' | 'enterprise'
  currentTier: 'free' | 'pro' | 'enterprise'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SubscriptionGate({ 
  tier, 
  currentTier, 
  children, 
  fallback = null 
}: SubscriptionGateProps) {
  const tierHierarchy = { free: 0, pro: 1, enterprise: 2 }
  
  const hasAccess = tierHierarchy[currentTier] >= tierHierarchy[tier]

  if (hasAccess) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

interface RoleGateProps {
  roles: ('user' | 'admin' | 'owner')[]
  currentRole: 'user' | 'admin' | 'owner'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGate({ 
  roles, 
  currentRole, 
  children, 
  fallback = null 
}: RoleGateProps) {
  const hasAccess = roles.includes(currentRole)

  if (hasAccess) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
