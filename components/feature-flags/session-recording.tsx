'use client'

import { useAnalytics } from '@/hooks/use-analytics'
import { useUser } from '@/hooks/use-auth'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Video,
  Play,
  Eye,
  Mouse,
  Smartphone,
  Monitor,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  Bug,
  Heart,
  Zap,
  Target,
  Activity,
  Map,
  Filter
} from 'lucide-react'

interface SessionRecording {
  id: string
  userId: string
  userEmail: string
  duration: number
  timestamp: Date
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  location: string
  pages: string[]
  events: SessionEvent[]
  flags: {
    hasErrors: boolean
    hasRageClicks: boolean
    isConverted: boolean
    isHighValue: boolean
    hasSlowPerformance: boolean
  }
  metrics: {
    clickCount: number
    scrollDepth: number
    timeToFirstInteraction: number
    bounced: boolean
    conversionValue?: number
  }
}

interface SessionEvent {
  type: 'click' | 'scroll' | 'pageview' | 'error' | 'conversion' | 'form_interaction' | 'rage_click'
  timestamp: number
  data: any
  severity?: 'low' | 'medium' | 'high'
}

interface BehaviorInsight {
  id: string
  type: 'drop_off' | 'friction' | 'engagement' | 'conversion' | 'performance'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  affectedSessions: number
  recommendedAction: string
  metric: number
  metricLabel: string
}

export function SessionRecordingDashboard() {
  const { user, profile } = useUser()
  const { track } = useAnalytics()
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedSession, setSelectedSession] = useState<SessionRecording | null>(null)

  // Only show to admins/owners
  if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
    return null
  }

  // Demo session recordings data
  const sessionRecordings: SessionRecording[] = [
    {
      id: 'rec_001',
      userId: 'user_001',
      userEmail: 'sarah@company.com',
      duration: 847,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      deviceType: 'desktop',
      browser: 'Chrome 120',
      location: 'San Francisco, CA',
      pages: ['/dashboard', '/projects/new', '/pricing', '/signup'],
      events: [
        { type: 'pageview', timestamp: 0, data: { page: '/dashboard' } },
        { type: 'click', timestamp: 45000, data: { element: 'new-project-btn' } },
        { type: 'rage_click', timestamp: 120000, data: { element: 'submit-btn', clicks: 7 }, severity: 'high' },
        { type: 'error', timestamp: 125000, data: { message: 'Network timeout' }, severity: 'high' },
        { type: 'conversion', timestamp: 720000, data: { value: 99, type: 'subscription' } }
      ],
      flags: {
        hasErrors: true,
        hasRageClicks: true,
        isConverted: true,
        isHighValue: true,
        hasSlowPerformance: false
      },
      metrics: {
        clickCount: 47,
        scrollDepth: 78,
        timeToFirstInteraction: 3400,
        bounced: false,
        conversionValue: 99
      }
    },
    {
      id: 'rec_002',
      userId: 'user_002',
      userEmail: 'mike@startup.io',
      duration: 234,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      deviceType: 'mobile',
      browser: 'Safari iOS',
      location: 'Austin, TX',
      pages: ['/landing', '/features', '/pricing'],
      events: [
        { type: 'pageview', timestamp: 0, data: { page: '/landing' } },
        { type: 'scroll', timestamp: 15000, data: { depth: 25 } },
        { type: 'click', timestamp: 89000, data: { element: 'pricing-link' } },
        { type: 'pageview', timestamp: 91000, data: { page: '/pricing' } }
      ],
      flags: {
        hasErrors: false,
        hasRageClicks: false,
        isConverted: false,
        isHighValue: false,
        hasSlowPerformance: true
      },
      metrics: {
        clickCount: 12,
        scrollDepth: 45,
        timeToFirstInteraction: 8200,
        bounced: true
      }
    },
    {
      id: 'rec_003',
      userId: 'user_003',
      userEmail: 'lisa@enterprise.com',
      duration: 1247,
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      deviceType: 'desktop',
      browser: 'Firefox 119',
      location: 'London, UK',
      pages: ['/dashboard', '/analytics', '/team/members', '/settings'],
      events: [
        { type: 'pageview', timestamp: 0, data: { page: '/dashboard' } },
        { type: 'click', timestamp: 34000, data: { element: 'analytics-nav' } },
        { type: 'form_interaction', timestamp: 456000, data: { form: 'team-invitation' } },
        { type: 'conversion', timestamp: 1100000, data: { value: 299, type: 'team_upgrade' } }
      ],
      flags: {
        hasErrors: false,
        hasRageClicks: false,
        isConverted: true,
        isHighValue: true,
        hasSlowPerformance: false
      },
      metrics: {
        clickCount: 89,
        scrollDepth: 92,
        timeToFirstInteraction: 2100,
        bounced: false,
        conversionValue: 299
      }
    }
  ]

  // Behavior insights
  const behaviorInsights: BehaviorInsight[] = [
    {
      id: 'insight_001',
      type: 'friction',
      title: 'High Rage Click Rate on Submit Button',
      description: 'Users are repeatedly clicking the submit button, indicating loading or error issues',
      impact: 'high',
      affectedSessions: 127,
      recommendedAction: 'Add loading states and better error handling to form submissions',
      metric: 23.4,
      metricLabel: '% of sessions with rage clicks'
    },
    {
      id: 'insight_002',
      type: 'drop_off',
      title: 'High Drop-off on Pricing Page',
      description: 'Many users leave immediately after viewing pricing information',
      impact: 'high',
      affectedSessions: 89,
      recommendedAction: 'A/B test pricing presentation and add social proof elements',
      metric: 67.8,
      metricLabel: '% bounce rate on pricing page'
    },
    {
      id: 'insight_003',
      type: 'performance',
      title: 'Slow Mobile Experience',
      description: 'Mobile users experience significantly longer load times',
      impact: 'medium',
      affectedSessions: 234,
      recommendedAction: 'Optimize mobile assets and implement lazy loading',
      metric: 4.7,
      metricLabel: 'seconds average mobile load time'
    },
    {
      id: 'insight_004',
      type: 'engagement',
      title: 'Low Scroll Depth on Feature Pages',
      description: 'Users are not scrolling to see key feature information',
      impact: 'medium',
      affectedSessions: 156,
      recommendedAction: 'Redesign feature pages with better visual hierarchy',
      metric: 34.2,
      metricLabel: '% average scroll depth'
    }
  ]

  const getFilteredSessions = () => {
    switch (selectedFilter) {
      case 'errors':
        return sessionRecordings.filter(s => s.flags.hasErrors)
      case 'rage_clicks':
        return sessionRecordings.filter(s => s.flags.hasRageClicks)
      case 'conversions':
        return sessionRecordings.filter(s => s.flags.isConverted)
      case 'mobile':
        return sessionRecordings.filter(s => s.deviceType === 'mobile')
      default:
        return sessionRecordings
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="w-4 h-4" />
      case 'tablet': return <Smartphone className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-destructive bg-destructive/10'
      case 'medium': return 'text-secondary-foreground bg-secondary/10'
      default: return 'text-primary bg-primary/10'
    }
  }

  const playSession = (session: SessionRecording) => {
    track('session_recording_played', {
      session_id: session.id,
      session_duration: session.duration,
      has_errors: session.flags.hasErrors,
      has_rage_clicks: session.flags.hasRageClicks,
      is_converted: session.flags.isConverted,
      played_by: user?.email,
      timestamp: new Date().toISOString(),
    })

    setSelectedSession(session)
    alert(`Playing session recording: ${session.id}\nUser: ${session.userEmail}\nDuration: ${formatDuration(session.duration)}`)
  }

  return (
    <div className="space-y-6">
      {/* Session Recording Dashboard */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <CardTitle className="text-card-foreground">Session Recordings</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Watch how users interact with your app and identify pain points
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{sessionRecordings.length}</div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {sessionRecordings.filter(s => s.flags.hasErrors).length}
              </div>
              <div className="text-sm text-muted-foreground">With Errors</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {sessionRecordings.filter(s => s.flags.isConverted).length}
              </div>
              <div className="text-sm text-muted-foreground">Conversions</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(sessionRecordings.reduce((sum, s) => sum + s.duration, 0) / sessionRecordings.length)}s
              </div>
              <div className="text-sm text-muted-foreground">Avg. Duration</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Sessions', icon: <Users className="w-3 h-3" /> },
              { key: 'errors', label: 'Has Errors', icon: <Bug className="w-3 h-3" /> },
              { key: 'rage_clicks', label: 'Rage Clicks', icon: <Mouse className="w-3 h-3" /> },
              { key: 'conversions', label: 'Conversions', icon: <Target className="w-3 h-3" /> },
              { key: 'mobile', label: 'Mobile', icon: <Smartphone className="w-3 h-3" /> }
            ].map((filter) => (
              <Button
                key={filter.key}
                size="sm"
                variant={selectedFilter === filter.key ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter.key)}
              >
                {filter.icon}
                <span className="ml-1">{filter.label}</span>
              </Button>
            ))}
          </div>

          {/* Session List */}
          <div className="space-y-4">
            {getFilteredSessions().map((session) => (
              <div key={session.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{session.userEmail}</h3>
                      {getDeviceIcon(session.deviceType)}
                      <Badge variant="outline" className="text-xs">
                        {session.browser}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {session.location}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(session.duration)}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {session.flags.hasErrors && (
                        <Badge className="bg-red-100 text-red-800">
                          <Bug className="w-3 h-3 mr-1" />
                          Errors
                        </Badge>
                      )}
                      {session.flags.hasRageClicks && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Mouse className="w-3 h-3 mr-1" />
                          Rage Clicks
                        </Badge>
                      )}
                      {session.flags.isConverted && (
                        <Badge className="bg-green-100 text-green-800">
                          <Target className="w-3 h-3 mr-1" />
                          Converted
                        </Badge>
                      )}
                      {session.flags.isHighValue && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Heart className="w-3 h-3 mr-1" />
                          High Value
                        </Badge>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Pages: {session.pages.join(' → ')}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-muted-foreground">
                      {new Intl.RelativeTimeFormat('en').format(
                        Math.floor((session.timestamp.getTime() - Date.now()) / (1000 * 60 * 60)),
                        'hours'
                      )}
                    </div>
                    <Button size="sm" onClick={() => playSession(session)}>
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                  </div>
                </div>

                {/* Session Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-border">
                  <div className="text-center">
                    <div className="font-semibold">{session.metrics.clickCount}</div>
                    <div className="text-xs text-muted-foreground">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{session.metrics.scrollDepth}%</div>
                    <div className="text-xs text-muted-foreground">Scroll Depth</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{(session.metrics.timeToFirstInteraction / 1000).toFixed(1)}s</div>
                    <div className="text-xs text-muted-foreground">First Interaction</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">
                      {session.metrics.conversionValue ? `$${session.metrics.conversionValue}` : '-'}
                    </div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Behavior Insights */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>Behavior Insights</CardTitle>
          </div>
          <CardDescription>
            AI-powered insights from session recordings to improve user experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {behaviorInsights.map((insight) => (
            <div key={insight.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{insight.title}</h3>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                  <div className="text-sm">
                    <span className="font-medium">Recommended Action:</span> {insight.recommendedAction}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{insight.metric}</div>
                  <div className="text-xs text-muted-foreground">{insight.metricLabel}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {insight.affectedSessions} sessions
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Component for tracking user behavior in real-time
export function BehaviorTracker({ children }: { children: React.ReactNode }) {
  const { track } = useAnalytics()

  useEffect(() => {
    // Track scroll behavior
    let maxScrollDepth = 0
    const trackScroll = () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        track('scroll_depth', { depth: scrollDepth, timestamp: Date.now() })
      }
    }

    // Track rage clicks
    let clickCount = 0
    let clickTimeout: NodeJS.Timeout
    const trackClicks = (event: MouseEvent) => {
      clickCount++
      
      clearTimeout(clickTimeout)
      clickTimeout = setTimeout(() => {
        if (clickCount >= 3) {
          track('rage_click_detected', {
            element: (event.target as Element)?.tagName || 'unknown',
            clicks: clickCount,
            timestamp: Date.now()
          })
        }
        clickCount = 0
      }, 1000)
    }

    // Track errors
    const trackErrors = (event: ErrorEvent) => {
      track('javascript_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now()
      })
    }

    // Add event listeners
    window.addEventListener('scroll', trackScroll, { passive: true })
    window.addEventListener('click', trackClicks)
    window.addEventListener('error', trackErrors)

    return () => {
      window.removeEventListener('scroll', trackScroll)
      window.removeEventListener('click', trackClicks)
      window.removeEventListener('error', trackErrors)
    }
  }, [track])

  return <>{children}</>
}
