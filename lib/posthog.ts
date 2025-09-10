import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (posthogKey && posthogHost) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        // Client-side only configuration
        capture_pageview: true,
        capture_pageleave: true,
        
        // Session Recording Configuration
        session_recording: {
          maskAllInputs: true, // Privacy: mask all inputs by default
          blockClass: 'ph-no-capture', // Class to block elements from recording
          blockSelector: '[data-ph-capture-attribute-name]',
          collectFonts: true,
        },

        // Privacy and Performance
        respect_dnt: true,
        opt_out_capturing_by_default: false,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog loaded successfully')
          }
        },

        // Advanced settings
        cross_subdomain_cookie: false,
        secure_cookie: true,
        persistence: 'localStorage+cookie',
      })
    }
  }
}

export default posthog
