import { supabase } from './supabase'
import posthog from 'posthog-js'

export interface UpgradeResult {
  success: boolean
  data?: any
  error?: any
}

export async function upgradeUserSubscription(
  userId: string, 
  newTier: 'pro' | 'enterprise'
): Promise<UpgradeResult> {
  try {
    // Get current user data
    const { data: currentUser, error: fetchError } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const previousTier = currentUser?.subscription_tier || 'free'

    // Update user in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        subscription_tier: newTier,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    // Update PostHog user properties immediately
    posthog.identify(userId, {
      subscription_tier: newTier,
      upgrade_date: new Date().toISOString(),
      previous_tier: previousTier
    })

    // Track upgrade event in PostHog
    posthog.capture('subscription_upgraded', {
      from_tier: previousTier,
      to_tier: newTier,
      upgrade_date: new Date().toISOString(),
      user_id: userId,
      upgrade_method: 'demo_button' // In real app, this would be 'stripe', 'paypal', etc.
    })

    // Force PostHog to reload feature flags with new user properties
    posthog.reloadFeatureFlags()

    return { success: true, data }
  } catch (error) {
    console.error('Upgrade failed:', error)
    posthog.capture('upgrade_failed', {
      user_id: userId,
      target_tier: newTier,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error }
  }
}

export async function downgradeUser(userId: string): Promise<UpgradeResult> {
  try {
    // Get current user data
    const { data: currentUser, error: fetchError } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const previousTier = currentUser?.subscription_tier || 'free'

    // Update user in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        subscription_tier: 'free',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    // Update PostHog user properties
    posthog.identify(userId, {
      subscription_tier: 'free',
      downgrade_date: new Date().toISOString(),
      previous_tier: previousTier
    })

    // Track downgrade event
    posthog.capture('subscription_downgraded', {
      from_tier: previousTier,
      to_tier: 'free',
      downgrade_date: new Date().toISOString(),
      user_id: userId,
      downgrade_reason: 'user_request' // Could be 'payment_failed', 'user_request', etc.
    })

    // Force PostHog to reload feature flags
    posthog.reloadFeatureFlags()

    return { success: true, data }
  } catch (error) {
    console.error('Downgrade failed:', error)
    posthog.capture('downgrade_failed', {
      user_id: userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error }
  }
}

export function trackUpgradePromptView(location: string, currentTier: string) {
  posthog.capture('upgrade_prompt_viewed', {
    current_tier: currentTier,
    prompt_location: location,
    timestamp: new Date().toISOString()
  })
}

export function trackFeatureUsageAttempt(
  featureName: string, 
  userTier: string, 
  hasAccess: boolean
) {
  posthog.capture('feature_usage_attempted', {
    feature_name: featureName,
    user_tier: userTier,
    has_access: hasAccess,
    blocked: !hasAccess,
    timestamp: new Date().toISOString()
  })
}

// Helper function to check if upgrade is available
export function canUpgradeTo(currentTier: string, targetTier: 'pro' | 'enterprise'): boolean {
  const tierHierarchy = { free: 0, pro: 1, enterprise: 2 }
  const current = tierHierarchy[currentTier as keyof typeof tierHierarchy] || 0
  const target = tierHierarchy[targetTier]
  return current < target
}

// Helper to get tier benefits
export function getTierBenefits(tier: 'free' | 'pro' | 'enterprise') {
  const benefits = {
    free: [
      'Basic dashboard access',
      'Up to 3 projects',
      'Community support',
      'Basic analytics'
    ],
    pro: [
      'Everything in Free',
      'Advanced analytics',
      'Team collaboration',
      'Priority support',
      'API access',
      'Up to 10 team members',
      'Custom integrations'
    ],
    enterprise: [
      'Everything in Pro',
      'Unlimited team members',
      'SSO integration',
      'Advanced security',
      'Custom analytics',
      'Dedicated support',
      'Custom contracts',
      'On-premise deployment'
    ]
  }
  return benefits[tier] || benefits.free
}
