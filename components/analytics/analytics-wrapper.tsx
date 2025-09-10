'use client'

import React from 'react'
import { useAnalytics } from '@/hooks/use-analytics'

interface AnalyticsWrapperProps {
  children: React.ReactNode
  event?: string
  properties?: Record<string, any>
  trackOnMount?: boolean
  trackOnClick?: boolean
  trackOnHover?: boolean
}

export function AnalyticsWrapper({
  children,
  event,
  properties = {},
  trackOnMount = false,
  trackOnClick = false,
  trackOnHover = false,
}: AnalyticsWrapperProps) {
  const { track } = useAnalytics()

  const handleClick = () => {
    if (trackOnClick && event) {
      track(event, { trigger: 'click', ...properties })
    }
  }

  const handleHover = () => {
    if (trackOnHover && event) {
      track(event, { trigger: 'hover', ...properties })
    }
  }

  // Track on mount
  React.useEffect(() => {
    if (trackOnMount && event) {
      track(event, { trigger: 'mount', ...properties })
    }
  }, [trackOnMount, event, properties, track])

  if (trackOnClick || trackOnHover) {
    return (
      <div onClick={handleClick} onMouseEnter={handleHover} className="contents">
        {children}
      </div>
    )
  }

  return <>{children}</>
}
