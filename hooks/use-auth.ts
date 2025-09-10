'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, type Database } from '@/lib/supabase'
import posthog from 'posthog-js'

type Profile = Database['public']['Tables']['profiles']['Row']

interface UseUserReturn {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // If profile doesn't exist (404), create it
        if (error.code === 'PGRST116' && userEmail) {
          console.log('Profile not found, creating new profile...')
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                email: userEmail,
                full_name: userEmail.split('@')[0], // Use email prefix as default name
                role: 'member',
                subscription_tier: 'free',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single()

          if (createError) {
            console.error('Error creating profile:', createError)
            return null
          }

          console.log('Profile created successfully:', newProfile)
          return newProfile
        }
        
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id, user.email)
      setProfile(profileData)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id, session.user.email)
          setProfile(profileData)
          
          // Identify user in PostHog with profile data
          if (profileData) {
            posthog.identify(session.user.id, {
              email: session.user.email,
              subscription_tier: profileData.subscription_tier || 'free',
              role: profileData.role || 'member',
              team_id: profileData.team_id,
              signup_date: profileData.created_at,
              last_login: new Date().toISOString(),
              full_name: profileData.full_name
            })
          }
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id, session.user.email)
          setProfile(profileData)
          
          // Update PostHog identification on auth state changes
          if (profileData) {
            posthog.identify(session.user.id, {
              email: session.user.email,
              subscription_tier: profileData.subscription_tier || 'free',
              role: profileData.role || 'member',
              team_id: profileData.team_id,
              signup_date: profileData.created_at,
              last_login: new Date().toISOString(),
              full_name: profileData.full_name
            })
          }
        } else {
          setProfile(null)
          // Reset PostHog on logout
          posthog.reset()
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  }
}
