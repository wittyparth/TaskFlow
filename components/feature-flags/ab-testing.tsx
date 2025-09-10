'use client'

import { useFeatureFlags } from '@/hooks/use-feature-flags'
import { useAnalytics } from '@/hooks/use-analytics'
import { useUser } from '@/hooks/use-auth'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Beaker,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  CheckCircle,
  AlertTriangle,
  Users,
  Zap,
  Trophy
} from 'lucide-react'

interface ABTestConfig {
  name: string
  testKey: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed' | 'winner_declared'
  hypothesis: string
  variants: ABTestVariant[]
  metrics: ABTestMetrics
  startDate: string
  endDate?: string
  trafficAllocation: number
  significance: number
  minimumSampleSize: number
}

interface ABTestVariant {
  name: string
  key: string
  description: string
  traffic: number
  conversions: number
  visitors: number
  conversionRate: number
  isWinner?: boolean
  lift?: number
}

interface ABTestMetrics {
  primaryMetric: string
  secondaryMetrics: string[]
  totalVisitors: number
  totalConversions: number
  statisticalSignificance: number
  confidence: number
  expectedRuntime: string
}

export function ABTestingDashboard() {
  const { user, profile } = useUser()
  const { track } = useAnalytics()

  // Only show to admins/owners
  if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
    return null
  }

  const abTests: ABTestConfig[] = [
    {
      name: 'Pricing Page Conversion',
      testKey: 'pricing_page_test',
      description: 'Testing different pricing layouts to improve subscription conversions',
      status: 'running',
      hypothesis: 'Highlighting annual savings will increase Pro subscription conversions by 15%',
      variants: [
        {
          name: 'Control - Monthly Focus',
          key: 'pricing_control',
          description: 'Current pricing page with monthly pricing prominent',
          traffic: 50,
          visitors: 2847,
          conversions: 142,
          conversionRate: 4.99,
        },
        {
          name: 'Treatment - Annual Focus',
          key: 'pricing_annual',
          description: 'Annual pricing highlighted with savings badge',
          traffic: 50,
          visitors: 2931,
          conversions: 167,
          conversionRate: 5.70,
          lift: 14.2,
        },
      ],
      metrics: {
        primaryMetric: 'Pro Subscription Conversions',
        secondaryMetrics: ['Page Engagement Time', 'CTA Click Rate', 'Pricing Calculator Usage'],
        totalVisitors: 5778,
        totalConversions: 309,
        statisticalSignificance: 87.4,
        confidence: 95,
        expectedRuntime: '3 more days',
      },
      startDate: '2025-01-08',
      trafficAllocation: 80,
      significance: 95,
      minimumSampleSize: 6000,
    },
    {
      name: 'Dashboard Layout Test',
      testKey: 'dashboard_layout_test',
      description: 'Comparing sidebar vs top navigation for task completion rates',
      status: 'completed',
      hypothesis: 'Top navigation will improve task creation rate by 10%',
      variants: [
        {
          name: 'Control - Sidebar Nav',
          key: 'dashboard_sidebar',
          description: 'Current sidebar navigation layout',
          traffic: 50,
          visitors: 8432,
          conversions: 3247,
          conversionRate: 38.5,
        },
        {
          name: 'Treatment - Top Nav',
          key: 'dashboard_topnav',
          description: 'Top horizontal navigation layout',
          traffic: 50,
          visitors: 8221,
          conversions: 3456,
          conversionRate: 42.1,
          lift: 9.3,
          isWinner: true,
        },
      ],
      metrics: {
        primaryMetric: 'Task Creation Rate',
        secondaryMetrics: ['Navigation Usage', 'Time to First Task', 'User Session Length'],
        totalVisitors: 16653,
        totalConversions: 6703,
        statisticalSignificance: 99.2,
        confidence: 99,
        expectedRuntime: 'Completed',
      },
      startDate: '2024-12-15',
      endDate: '2025-01-05',
      trafficAllocation: 100,
      significance: 99,
      minimumSampleSize: 15000,
    },
    {
      name: 'Onboarding Flow Optimization',
      testKey: 'onboarding_flow_test',
      description: 'Testing guided tutorial vs. self-exploration for user activation',
      status: 'winner_declared',
      hypothesis: 'Guided tutorial will increase user activation by 25%',
      variants: [
        {
          name: 'Control - Self Exploration',
          key: 'onboarding_self',
          description: 'Let users explore the app freely',
          traffic: 33,
          visitors: 1247,
          conversions: 423,
          conversionRate: 33.9,
        },
        {
          name: 'Treatment A - Guided Tutorial',
          key: 'onboarding_guided',
          description: 'Step-by-step tutorial walkthrough',
          traffic: 33,
          visitors: 1198,
          conversions: 587,
          conversionRate: 49.0,
          lift: 44.5,
          isWinner: true,
        },
        {
          name: 'Treatment B - Video Walkthrough',
          key: 'onboarding_video',
          description: 'Short video explaining key features',
          traffic: 34,
          visitors: 1331,
          conversions: 479,
          conversionRate: 36.0,
          lift: 6.2,
        },
      ],
      metrics: {
        primaryMetric: 'User Activation (First Project Created)',
        secondaryMetrics: ['Time to Activation', 'Feature Discovery Rate', 'Support Ticket Rate'],
        totalVisitors: 3776,
        totalConversions: 1489,
        statisticalSignificance: 99.9,
        confidence: 99,
        expectedRuntime: 'Completed',
      },
      startDate: '2024-12-01',
      endDate: '2024-12-20',
      trafficAllocation: 50,
      significance: 99,
      minimumSampleSize: 3000,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground'
      case 'running': return 'bg-primary/10 text-primary'
      case 'paused': return 'bg-secondary/10 text-secondary-foreground'
      case 'completed': return 'bg-primary/20 text-primary'
      case 'winner_declared': return 'bg-accent/10 text-accent-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Target className="w-4 h-4" />
      case 'running': return <Beaker className="w-4 h-4" />
      case 'paused': return <AlertTriangle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'winner_declared': return <Trophy className="w-4 h-4" />
      default: return <Beaker className="w-4 h-4" />
    }
  }

  const controlTest = (test: ABTestConfig, action: 'pause' | 'resume' | 'stop' | 'declare_winner') => {
    track('ab_test_control_action', {
      test_name: test.name,
      test_key: test.testKey,
      action: action,
      current_significance: test.metrics.statisticalSignificance,
      controlled_by: user?.email,
      timestamp: new Date().toISOString(),
    })

    switch (action) {
      case 'pause':
        alert(`A/B Test "${test.name}" has been PAUSED`)
        break
      case 'resume':
        alert(`A/B Test "${test.name}" has been RESUMED`)
        break
      case 'stop':
        const confirmed = window.confirm(`Stop A/B Test "${test.name}"? This will end the test without declaring a winner.`)
        if (confirmed) {
          alert(`A/B Test "${test.name}" has been STOPPED`)
        }
        break
      case 'declare_winner':
        const winner = test.variants.find(v => v.isWinner || v.lift && v.lift > 0)
        if (winner) {
          alert(`Winner declared for "${test.name}": ${winner.name} with ${winner.lift}% lift!`)
        }
        break
    }
  }

  const getSignificanceColor = (significance: number) => {
    if (significance >= 95) return 'text-primary'
    if (significance >= 80) return 'text-secondary-foreground'
    return 'text-destructive'
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-primary" />
            <CardTitle className="text-card-foreground">A/B Testing Dashboard</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Monitor and control experiments to optimize user experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {abTests.map((test) => (
            <div key={test.testKey} className="border border-border rounded-lg p-6 bg-card">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-card-foreground">{test.name}</h3>
                    <Badge className={getStatusColor(test.status)}>
                      {getStatusIcon(test.status)}
                      <span className="ml-1 capitalize">{test.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-card-foreground">Hypothesis:</strong> {test.hypothesis}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-2 ml-4">
                  {test.status === 'running' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => controlTest(test, 'pause')}
                      >
                        Pause
                      </Button>
                      {test.metrics.statisticalSignificance >= 95 && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => controlTest(test, 'declare_winner')}
                        >
                          <Trophy className="w-4 h-4 mr-1" />
                          Declare Winner
                        </Button>
                      )}
                    </>
                  )}
                  {test.status === 'paused' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => controlTest(test, 'resume')}
                    >
                      Resume
                    </Button>
                  )}
                </div>
              </div>

              {/* Test Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{test.metrics.totalVisitors.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Visitors</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{test.metrics.totalConversions.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Conversions</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className={`text-lg font-semibold ${getSignificanceColor(test.metrics.statisticalSignificance)}`}>
                    {test.metrics.statisticalSignificance}%
                  </div>
                  <div className="text-xs text-muted-foreground">Statistical Significance</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{test.metrics.expectedRuntime}</div>
                  <div className="text-xs text-muted-foreground">Expected Runtime</div>
                </div>
              </div>

              {/* Significance Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Statistical Significance</span>
                  <span className={getSignificanceColor(test.metrics.statisticalSignificance)}>
                    {test.metrics.statisticalSignificance}% (Target: {test.significance}%)
                  </span>
                </div>
                <Progress value={test.metrics.statisticalSignificance} className="h-2" />
              </div>

              {/* Variants */}
              <div className="mb-4">
                <h4 className="font-medium mb-3">Variants Performance</h4>
                <div className="space-y-3">
                  {test.variants.map((variant, index) => (
                    <div
                      key={variant.key}
                      className={`p-4 rounded-lg border ${
                        variant.isWinner 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium">{variant.name}</h5>
                            {variant.isWinner && (
                              <Badge className="bg-green-100 text-green-800">
                                <Trophy className="w-3 h-3 mr-1" />
                                Winner
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{variant.description}</p>
                        </div>
                        {variant.lift !== undefined && (
                          <div className="text-right">
                            <div className={`text-lg font-semibold ${variant.lift > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {variant.lift > 0 ? '+' : ''}{variant.lift}%
                            </div>
                            <div className="text-xs text-muted-foreground">Lift</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium">{variant.traffic}%</div>
                          <div className="text-muted-foreground">Traffic</div>
                        </div>
                        <div>
                          <div className="font-medium">{variant.visitors.toLocaleString()}</div>
                          <div className="text-muted-foreground">Visitors</div>
                        </div>
                        <div>
                          <div className="font-medium">{variant.conversions.toLocaleString()}</div>
                          <div className="text-muted-foreground">Conversions</div>
                        </div>
                        <div>
                          <div className="font-medium">{variant.conversionRate}%</div>
                          <div className="text-muted-foreground">Conv. Rate</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Being Tracked */}
              <div>
                <h4 className="font-medium mb-2">Metrics Being Tracked</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {test.metrics.primaryMetric}
                  </Badge>
                  {test.metrics.secondaryMetrics.map((metric, index) => (
                    <Badge key={index} variant="outline">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Component for running A/B tests
interface ABTestProps {
  testKey: string
  variants: {
    name: string
    component: React.ReactNode
    weight?: number
  }[]
  fallback?: React.ReactNode
  conversionGoal?: string
}

export function ABTestRunner({ testKey, variants, fallback = null, conversionGoal }: ABTestProps) {
  const { getFeatureFlag } = useFeatureFlags()
  const { track } = useAnalytics()
  const { user } = useUser()

  // Get variant assignment from PostHog (or simulate for demo)
  const assignedVariant = getFeatureFlag(`${testKey}_variant`) as string || variants[0]?.name

  // Find the assigned variant
  const selectedVariant = variants.find(v => v.name === assignedVariant) || variants[0]

  // Track A/B test exposure
  useEffect(() => {
    if (user && selectedVariant) {
      track('ab_test_exposure', {
        test_key: testKey,
        variant: selectedVariant.name,
        user_id: user.id,
        conversion_goal: conversionGoal,
        timestamp: new Date().toISOString(),
      })
    }
  }, [testKey, selectedVariant, user, conversionGoal])

  // Helper function to track conversions
  const trackConversion = () => {
    if (user && selectedVariant && conversionGoal) {
      track('ab_test_conversion', {
        test_key: testKey,
        variant: selectedVariant.name,
        conversion_goal: conversionGoal,
        user_id: user.id,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Expose conversion tracker to child components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackABTestConversion = trackConversion
    }
  }, [trackConversion])

  if (selectedVariant) {
    return <>{selectedVariant.component}</>
  }

  return <>{fallback}</>
}
