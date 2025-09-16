'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePostHog } from '@/components/providers/posthog-provider'
import { useUser } from './use-auth'

export function useFeatureFlag(flagKey: string): boolean {
  const posthog = usePostHog()
  const { user } = useUser()
  const [flagValue, setFlagValue] = useState<boolean>(true) // Default to true

  useEffect(() => {
    if (!posthog || !user) {
      setFlagValue(true) // Be permissive by default
      return
    }

    // Get initial flag value
    const initialValue = posthog.isFeatureEnabled(flagKey)
    setFlagValue(initialValue !== false) // Allow unless explicitly disabled

    // Listen for flag changes
    const unsubscribe = posthog.onFeatureFlags(() => {
      const newValue = posthog.isFeatureEnabled(flagKey)
      setFlagValue(newValue !== false) // Allow unless explicitly disabled
    })

    return unsubscribe
  }, [posthog, flagKey, user])

  return flagValue
}

export function useFeatureFlagVariant(flagKey: string): string | boolean {
  const posthog = usePostHog()
  const { user } = useUser()
  const [flagVariant, setFlagVariant] = useState<string | boolean>(false)

  useEffect(() => {
    if (!posthog || !user) {
      setFlagVariant(false)
      return
    }

    // Get initial flag variant
    const initialVariant = posthog.getFeatureFlag(flagKey)
    setFlagVariant(initialVariant ?? false)

    // Listen for flag changes
    const unsubscribe = posthog.onFeatureFlags(() => {
      const newVariant = posthog.getFeatureFlag(flagKey)
      setFlagVariant(newVariant ?? false)
    })

    return unsubscribe
  }, [posthog, flagKey, user])

  return flagVariant
}

export function useFeatureFlags() {
  const posthog = usePostHog()
  const { user, profile } = useUser()

  const isFeatureEnabled = useCallback((flagKey: string): boolean => {
    if (!posthog || !user) {
      // Be permissive by default - allow access if PostHog not loaded yet
      return true
    }
    const flagValue = posthog.isFeatureEnabled(flagKey)
    // Return true if flag is undefined/null (not configured), false only if explicitly disabled
    return flagValue !== false
  }, [posthog, user])

  const getFeatureFlag = useCallback((flagKey: string): string | boolean => {
    if (!posthog || !user) return false
    return posthog.getFeatureFlag(flagKey) ?? false
  }, [posthog, user])

  // Predefined feature flags for your app
  const features = {
    // Subscription-based features
    advancedAnalytics: isFeatureEnabled('advanced-analytics') && profile?.subscription_tier !== 'free',
    unlimitedProjects: isFeatureEnabled('unlimited-projects') && profile?.subscription_tier === 'enterprise',
    customIntegrations: isFeatureEnabled('custom-integrations') && profile?.subscription_tier !== 'free',
    prioritySupport: isFeatureEnabled('priority-support') && profile?.subscription_tier === 'enterprise',
    
    // Navigation-specific features (can be killed via feature flags)
    teamManagement: isFeatureEnabled('team-management') && profile?.subscription_tier !== 'free',
    advancedSearch: isFeatureEnabled('advanced-search') && profile?.subscription_tier !== 'free',
    notifications: isFeatureEnabled('notifications'), // Can be killed for all users
    
    // Role-based features
    billingAccess: isFeatureEnabled('billing-access') && (profile?.role === 'admin' || profile?.role === 'owner'),
    workspaceSettings: isFeatureEnabled('workspace-settings') && profile?.role === 'owner',

    // Beta/experimental features (can be killed instantly)
    aiAssistant: isFeatureEnabled('ai-assistant'),
    taskAutomation: isFeatureEnabled('task-automation'),
    advancedReporting: isFeatureEnabled('advanced-reporting'),
    mobileApp: isFeatureEnabled('mobile-app'),
    apiAccess: isFeatureEnabled('api-access'),

    // UI/UX experiments
    newDashboardLayout: getFeatureFlag('dashboard-layout-experiment'),
    onboardingFlow: getFeatureFlag('onboarding-flow-experiment'),
    navigationStyle: getFeatureFlag('navigation-style-experiment'),
  }

  const reloadFeatureFlags = useCallback(() => {
    if (posthog && user) {
      posthog.reloadFeatureFlags()
    }
  }, [posthog, user])

  return {
    isFeatureEnabled,
    getFeatureFlag,
    reloadFeatureFlags,
    features,
  }
}
