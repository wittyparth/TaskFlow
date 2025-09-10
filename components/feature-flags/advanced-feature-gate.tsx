'use client'

import { useFeatureFlags } from '@/hooks/use-feature-flags'
import { useUser } from '@/hooks/use-auth'
import { useAnalytics } from '@/hooks/use-analytics'
import { useEffect } from 'react'

interface AdvancedFeatureGateProps {
  children: React.ReactNode
  flagKey: string
  fallback?: React.ReactNode
  
  // Kill switch functionality
  killSwitchKey?: string
  
  // Gradual rollout
  rolloutPercentage?: number
  rolloutGroup?: 'beta' | 'internal' | 'power_users' | 'all'
  
  // User targeting
  targetBySubscription?: ('free' | 'pro' | 'enterprise')[]
  targetByRole?: ('member' | 'admin' | 'owner')[]
  targetByTeamSize?: { min?: number; max?: number }
  targetByUsage?: 'low' | 'medium' | 'high'
  
  // Safety controls
  maxErrorRate?: number
  maxLoadTime?: number
  requirePositiveFeedback?: boolean
  
  // Analytics
  trackExposure?: boolean
  experimentName?: string,

}

export function AdvancedFeatureGate({
  children,
  flagKey,
  fallback = null,
  killSwitchKey,
  rolloutPercentage = 100,
  rolloutGroup = 'all',
  targetBySubscription,
  targetByRole,
  targetByTeamSize,
  targetByUsage,
  maxErrorRate = 5,
  maxLoadTime = 3000,
  requirePositiveFeedback = false,
  trackExposure = true,
  experimentName,

}: AdvancedFeatureGateProps) {
  const { isFeatureEnabled, getFeatureFlag } = useFeatureFlags()
  const { user, profile } = useUser()
  const { track } = useAnalytics()

  // Check kill switch first
  const isKillSwitchActive = killSwitchKey ? isFeatureEnabled(killSwitchKey) : false
  
  // Get base feature flag
  const isBaseFeatureEnabled = isFeatureEnabled(flagKey)
  
  // Get rollout configuration from PostHog
  const rolloutConfig = getFeatureFlag(`${flagKey}_rollout_config`)
  const safetyConfig = getFeatureFlag(`${flagKey}_safety_config`)

  // User targeting logic
  const isUserTargeted = () => {
    if (!user || !profile) return false

    // Subscription targeting
    if (targetBySubscription && !targetBySubscription.includes(profile.subscription_tier as any)) {
      return false
    }

    // Role targeting
    if (targetByRole && !targetByRole.includes(profile.role as any)) {
      return false
    }

    // Team size targeting (based on team_id existence for now)
    if (targetByTeamSize) {
      const hasTeam = profile.team_id !== null
      const estimatedTeamSize = hasTeam ? 5 : 1 // Simplified for demo
      if (targetByTeamSize.min && estimatedTeamSize < targetByTeamSize.min) return false
      if (targetByTeamSize.max && estimatedTeamSize > targetByTeamSize.max) return false
    }

    // Usage pattern targeting (simplified for demo)
    if (targetByUsage) {
      const userUsage = profile.role === 'admin' ? 'high' : profile.role === 'owner' ? 'high' : 'medium'
      if (userUsage !== targetByUsage) return false
    }

    return true
  }

  // Rollout group logic
  const isInRolloutGroup = () => {
    if (!user || !profile) return false

    switch (rolloutGroup) {
      case 'internal':
        return profile.email?.endsWith('@taskflow.com') || profile.role === 'owner'
      case 'beta':
        return profile.role === 'owner' || profile.email?.includes('beta')
      case 'power_users':
        return profile.role === 'admin' || profile.role === 'owner'
      case 'all':
        return true
      default:
        return true
    }
  }

  // Gradual rollout logic (deterministic based on user ID)
  const isInRolloutPercentage = () => {
    if (!user) return false
    
    // Use user ID for consistent assignment
    const hash = user.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const userPercentage = Math.abs(hash % 100)
    return userPercentage < rolloutPercentage
  }

  // Safety checks
  const passesSafetyChecks = () => {
    // These would be populated by PostHog properties or monitoring
    // For demo purposes, we'll simulate safe values
    const currentErrorRate = typeof safetyConfig === 'object' ? 0 : 0
    const currentLoadTime = typeof safetyConfig === 'object' ? 1000 : 1000
    const currentFeedbackScore = typeof safetyConfig === 'object' ? 85 : 85

    if (currentErrorRate > maxErrorRate) return false
    if (currentLoadTime > maxLoadTime) return false
    if (requirePositiveFeedback && currentFeedbackScore < 70) return false

    return true
  }

  // Final feature availability decision
  const shouldShowFeature = () => {
    // Kill switch overrides everything
    if (isKillSwitchActive) return false

    // Base feature must be enabled
    if (!isBaseFeatureEnabled) return false

    // User must be targeted
    if (!isUserTargeted()) return false

    // User must be in rollout group
    if (!isInRolloutGroup()) return false

    // User must be in rollout percentage
    if (!isInRolloutPercentage()) return false

    // Must pass safety checks
    if (!passesSafetyChecks()) return false

    return true
  }

  const featureEnabled = shouldShowFeature()

  // Track feature exposure
  useEffect(() => {
    if (trackExposure && user) {
      track('feature_flag_exposure', {
        flag_key: flagKey,
        experiment_name: experimentName,
        feature_enabled: featureEnabled,
        kill_switch_active: isKillSwitchActive,
        rollout_percentage: rolloutPercentage,
        rollout_group: rolloutGroup,
        user_targeted: isUserTargeted(),
        in_rollout_group: isInRolloutGroup(),
        in_rollout_percentage: isInRolloutPercentage(),
        passes_safety_checks: passesSafetyChecks(),
        subscription_tier: profile?.subscription_tier,
        user_role: profile?.role,
        has_team: profile?.team_id !== null,
      })
    }
  }, [featureEnabled, user, flagKey])

  // Track feature usage when shown
  useEffect(() => {
    if (featureEnabled && trackExposure && user) {
      track('feature_used', {
        flag_key: flagKey,
        experiment_name: experimentName,
      })
    }
  }, [featureEnabled])

  if (featureEnabled) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

// Helper component for A/B testing
interface ABTestProps {
  testName: string
  variants: {
    name: string
    component: React.ReactNode
    weight?: number
  }[]
  fallback?: React.ReactNode
  trackExposure?: boolean
}

export function ABTest({ testName, variants, fallback = null, trackExposure = true }: ABTestProps) {
  const { getFeatureFlag } = useFeatureFlags()
  const { user } = useUser()
  const { track } = useAnalytics()

  // Get variant assignment from PostHog
  const assignedVariant = getFeatureFlag(`${testName}_variant`)

  // Find the assigned variant or use fallback
  const selectedVariant = variants.find(v => v.name === assignedVariant) || variants[0]

  // Track A/B test exposure
  useEffect(() => {
    if (trackExposure && user && selectedVariant) {
      track('ab_test_exposure', {
        test_name: testName,
        variant: selectedVariant.name,
        user_id: user.id,
      })
    }
  }, [testName, selectedVariant, user])

  if (selectedVariant) {
    return <>{selectedVariant.component}</>
  }

  return <>{fallback}</>
}
