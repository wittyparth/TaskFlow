'use client'

import React, { useEffect, useState, createContext, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, type Database } from '@/lib/supabase'
import posthog from 'posthog-js'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const fetchProfile = async (userId: string, userEmail?: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116' && userEmail) {
          console.log('Profile not found, creating new profile...')
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                email: userEmail,
                full_name: userEmail.split('@')[0],
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

  const updatePostHogUser = (user: User, profile: Profile | null) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.identify(user.id, {
        email: user.email,
        subscription_tier: profile?.subscription_tier || 'free',
        role: profile?.role || 'member',
        team_id: profile?.team_id,
        signup_date: profile?.created_at,
        last_login: new Date().toISOString(),
        full_name: profile?.full_name
      })
    }
  }

  const refreshProfile = async () => {
    if (user) {
      try {
        const profileData = await fetchProfile(user.id, user.email)
        setProfile(profileData)
        if (profileData) {
          updatePostHogUser(user, profileData)
        }
      } catch (error) {
        console.error('Error refreshing profile:', error)
      }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      
      if (typeof window !== 'undefined' && posthog) {
        posthog.reset()
      }
      
      // Force redirect to signin page
      window.location.href = '/signin'
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get initial session with retry logic
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          const profileData = await fetchProfile(session.user.id, session.user.email)
          
          if (!mounted) return
          
          setProfile(profileData)
          if (profileData) {
            updatePostHogUser(session.user, profileData)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes with improved error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state change:', event, session?.user?.email)

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log('User signed in, updating auth state...', session.user.email)
            setUser(session.user)
            
            try {
              const profileData = await fetchProfile(session.user.id, session.user.email)
              
              if (mounted) {
                setProfile(profileData)
                if (profileData) {
                  updatePostHogUser(session.user, profileData)
                }
                console.log('Profile loaded successfully for user:', session.user.email)
              }
            } catch (error) {
              console.error('Error fetching profile after auth change:', error)
              // Don't block authentication if profile fetch fails
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing auth state...')
          setUser(null)
          setProfile(null)
          if (typeof window !== 'undefined' && posthog) {
            posthog.reset()
          }
        }

        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    user,
    profile,
    loading: loading || !initialized,
    signOut,
    refreshProfile,
    isAuthenticated: !!user && !loading && initialized
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Backward compatibility
export const useUser = useAuth
