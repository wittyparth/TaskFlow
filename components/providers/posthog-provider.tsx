'use client'

import { useEffect, createContext, useContext } from 'react'
import { useUser } from '@/hooks/use-auth'
import { initPostHog } from '@/lib/posthog'
import posthog from 'posthog-js'

const PostHogContext = createContext<typeof posthog | null>(null)

export const usePostHog = () => {
  const context = useContext(PostHogContext)
  return context
}

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const { user, profile } = useUser()

  useEffect(() => {
    // Initialize PostHog
    initPostHog()

    // Identify user when authenticated
    if (user) {
      // Always identify with email, even if profile isn't loaded yet
      const userProperties = {
        email: user.email,
        user_id: user.id,
        created_at: user.created_at,
        // Add profile data if available
        ...(profile && {
          name: profile.full_name,
          subscription_tier: profile.subscription_tier,
          role: profile.role,
          team_id: profile.team_id,
        })
      }

      posthog.identify(user.email || user.id, userProperties)

      // Set user properties for analytics
      posthog.setPersonProperties({
        email: user.email,
        user_id: user.id,
        subscription_tier: profile?.subscription_tier || 'free',
        role: profile?.role || 'member',
        team_id: profile?.team_id || null,
        user_type: profile?.team_id ? 'team_member' : 'individual',
      })

      console.log('PostHog user identified:', user.email)
    } else {
      // Reset user when logged out
      posthog.reset()
      console.log('PostHog user reset (logged out)')
    }

    return () => {
      // Cleanup on unmount
      if (typeof window !== 'undefined') {
        posthog.reset()
      }
    }
  }, [user, profile])

  return (
    <PostHogContext.Provider value={posthog}>
      {children}
    </PostHogContext.Provider>
  )
}
