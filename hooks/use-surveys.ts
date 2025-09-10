'use client'

import { useCallback } from 'react'
import { usePostHog } from '@/components/providers/posthog-provider'
import { useUser } from './use-auth'

export interface SurveyOptions {
  id: string
  questions: {
    type: 'single_choice' | 'multiple_choice' | 'open' | 'rating_scale' | 'nps'
    question: string
    choices?: string[]
    scale?: { min: number; max: number; minLabel?: string; maxLabel?: string }
  }[]
  appearance?: {
    backgroundColor?: string
    submitButtonColor?: string
    textColor?: string
    submitButtonText?: string
    descriptionTextColor?: string
    thankYouMessageHeader?: string
    thankYouMessageDescription?: string
  }
  targeting?: {
    urlMatching?: {
      selector: 'exact' | 'contains' | 'regex'
      url: string
    }
    selector?: string
  }
}

export function useSurveys() {
  const posthog = usePostHog()
  const { user, profile } = useUser()

  // Create and show survey
  const showSurvey = useCallback((surveyId: string) => {
    if (!posthog || !user) return

    // PostHog will handle survey display based on targeting rules
    posthog.capture('survey_shown', {
      survey_id: surveyId,
      user_id: user.id,
      subscription_tier: profile?.subscription_tier,
    })
  }, [posthog, user, profile])

  // Track survey interactions
  const trackSurveyResponse = useCallback((surveyId: string, response: any) => {
    if (!posthog || !user) return

    posthog.capture('survey_response', {
      survey_id: surveyId,
      response,
      user_id: user.id,
      subscription_tier: profile?.subscription_tier,
    })
  }, [posthog, user, profile])

  const trackSurveyDismissed = useCallback((surveyId: string, reason?: string) => {
    if (!posthog || !user) return

    posthog.capture('survey_dismissed', {
      survey_id: surveyId,
      reason: reason || 'user_dismissed',
      user_id: user.id,
      subscription_tier: profile?.subscription_tier,
    })
  }, [posthog, user, profile])

  // Predefined surveys for your app
  const surveys = {
    // Net Promoter Score
    showNPSSurvey: () => showSurvey('nps-quarterly'),
    
    // Feature feedback
    showFeatureFeedback: (featureName: string) => {
      if (!posthog || !user) return
      
      posthog.capture('survey_shown', {
        survey_id: 'feature-feedback',
        feature_name: featureName,
        user_id: user.id,
        subscription_tier: profile?.subscription_tier,
      })
    },

    // Onboarding feedback
    showOnboardingFeedback: () => showSurvey('onboarding-feedback'),

    // Churn prevention
    showChurnSurvey: () => showSurvey('churn-prevention'),

    // Product satisfaction
    showProductSatisfaction: () => showSurvey('product-satisfaction'),

    // Feature request
    showFeatureRequest: () => showSurvey('feature-request'),

    // Billing feedback
    showBillingFeedback: () => showSurvey('billing-feedback'),

    // Team collaboration feedback
    showTeamFeedback: () => showSurvey('team-collaboration'),
  }

  // Survey targeting helpers
  const shouldShowSurvey = useCallback((surveyId: string, conditions: {
    subscriptionTier?: string[]
    userRole?: string[]
    daysSinceSignup?: number
    pageViews?: number
    lastSurveyDays?: number
  } = {}) => {
    if (!user || !profile) return false

    // Check subscription tier
    if (conditions.subscriptionTier && !conditions.subscriptionTier.includes(profile.subscription_tier)) {
      return false
    }

    // Check user role
    if (conditions.userRole && !conditions.userRole.includes(profile.role)) {
      return false
    }

    // Additional conditions can be checked here
    return true
  }, [user, profile])

  return {
    showSurvey,
    trackSurveyResponse,
    trackSurveyDismissed,
    surveys,
    shouldShowSurvey,
  }
}
