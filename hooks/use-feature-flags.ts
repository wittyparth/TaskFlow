'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePostHog } from '@/components/providers/posthog-provider'
import { useUser } from './use-auth'

export function useFeatureFlag(flagKey: string): boolean {
  const posthog = usePostHog()
  const { user } = useUser()
  const [flagValue, setFlagValue] = useState<boolean>(false)

  useEffect(() => {
    if (!posthog || !user) {
      setFlagValue(false)
      return
    }

    // Get initial flag value
    const initialValue = posthog.isFeatureEnabled(flagKey)
    setFlagValue(initialValue ?? false)

    // Listen for flag changes
    const unsubscribe = posthog.onFeatureFlags(() => {
      const newValue = posthog.isFeatureEnabled(flagKey)
      setFlagValue(newValue ?? false)
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
    if (!posthog || !user) return false
    return posthog.isFeatureEnabled(flagKey) ?? false
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

    // Role-based features
    teamManagement: isFeatureEnabled('team-management') && (profile?.role === 'admin' || profile?.role === 'owner'),
    billingAccess: isFeatureEnabled('billing-access') && (profile?.role === 'admin' || profile?.role === 'owner'),
    workspaceSettings: isFeatureEnabled('workspace-settings') && profile?.role === 'owner',

    // Beta/experimental features
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
