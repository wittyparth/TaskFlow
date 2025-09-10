'use client'

import { useCallback } from 'react'
import { usePostHog } from '@/components/providers/posthog-provider'
import { useUser } from './use-auth'

export interface TrackingEvent {
  event: string
  properties?: Record<string, any>
}

export interface PageViewEvent {
  page: string
  properties?: Record<string, any>
}

export function useAnalytics() {
  const posthog = usePostHog()
  const { user, profile } = useUser()

  // Track custom events
  const track = useCallback((event: string, properties: Record<string, any> = {}) => {
    if (!posthog) return

    const enrichedProperties = {
      ...properties,
      // Add user context
      user_id: user?.id,
      subscription_tier: profile?.subscription_tier,
      team_id: profile?.team_id,
      user_role: profile?.role,
      // Add app context
      timestamp: new Date().toISOString(),
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
    }

    posthog.capture(event, enrichedProperties)
  }, [posthog, user, profile])

  // Track page views
  const trackPageView = useCallback((page: string, properties: Record<string, any> = {}) => {
    if (!posthog) return

    track('$pageview', {
      $current_url: typeof window !== 'undefined' ? window.location.href : undefined,
      page_name: page,
      ...properties,
    })
  }, [track, posthog])

  // Track user interactions
  const trackClick = useCallback((element: string, properties: Record<string, any> = {}) => {
    track('click', {
      element,
      ...properties,
    })
  }, [track])

  // Track form submissions
  const trackFormSubmit = useCallback((form: string, success: boolean, properties: Record<string, any> = {}) => {
    track('form_submit', {
      form_name: form,
      success,
      ...properties,
    })
  }, [track])

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: string, properties: Record<string, any> = {}) => {
    track('feature_used', {
      feature_name: feature,
      ...properties,
    })
  }, [track])

  // Track navigation
  const trackNavigation = useCallback((from: string, to: string, properties: Record<string, any> = {}) => {
    track('navigation', {
      from_page: from,
      to_page: to,
      ...properties,
    })
  }, [track])

  // Track project/task actions
  const trackProjectAction = useCallback((action: string, projectId: string, properties: Record<string, any> = {}) => {
    track('project_action', {
      action,
      project_id: projectId,
      ...properties,
    })
  }, [track])

  const trackTaskAction = useCallback((action: string, taskId: string, properties: Record<string, any> = {}) => {
    track('task_action', {
      action,
      task_id: taskId,
      ...properties,
    })
  }, [track])

  // Track subscription events
  const trackSubscriptionEvent = useCallback((event: string, properties: Record<string, any> = {}) => {
    track('subscription_event', {
      event_type: event,
      ...properties,
    })
  }, [track])

  // Track team events
  const trackTeamEvent = useCallback((event: string, properties: Record<string, any> = {}) => {
    track('team_event', {
      event_type: event,
      ...properties,
    })
  }, [track])

  // Identify user (useful for profile updates)
  const identifyUser = useCallback((userId: string, properties: Record<string, any> = {}) => {
    if (!posthog) return

    posthog.identify(userId, properties)
  }, [posthog])

  // Set user properties
  const setUserProperties = useCallback((properties: Record<string, any>) => {
    if (!posthog) return

    posthog.setPersonProperties(properties)
  }, [posthog])

  return {
    track,
    trackPageView,
    trackClick,
    trackFormSubmit,
    trackFeatureUsage,
    trackNavigation,
    trackProjectAction,
    trackTaskAction,
    trackSubscriptionEvent,
    trackTeamEvent,
    identifyUser,
    setUserProperties,
  }
}
