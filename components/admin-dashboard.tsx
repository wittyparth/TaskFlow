'use client'

import { useUser } from '@/hooks/use-auth'
import { useAnalytics } from '@/hooks/use-analytics'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3,
  Flag,
  Zap,
  Target,
  Video,
  MessageSquare,
  Shield,
  TrendingUp,
  Users,
  Activity,
  Settings,
  Crown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb
} from 'lucide-react'

// Import our dashboard components
import { KillSwitchDashboard } from './feature-flags/kill-switch'
import { GradualRolloutDashboard } from './feature-flags/gradual-rollout'
import { ABTestingDashboard } from './feature-flags/ab-testing'
import { PersonalizationDashboard } from './feature-flags/personalization'
import { SessionRecordingDashboard } from './feature-flags/session-recording'
import { SurveysDashboard } from './feature-flags/surveys'

export default function ProductManagerDashboard() {
  const { user, profile } = useUser()
  const { track } = useAnalytics()

  // Only show to product managers, admins, and owners
  if (!profile || !['admin', 'owner', 'product_manager'].includes(profile.role)) {
    return (
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <CardTitle>Product Manager Dashboard</CardTitle>
          </div>
          <CardDescription>
            Access restricted to product managers and administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Insufficient Permissions</h3>
            <p className="text-muted-foreground">
              You need Product Manager, Admin, or Owner permissions to access this dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Quick stats for overview
  const quickStats = {
    activeFlags: 12,
    activeExperiments: 3,
    killSwitchesArmed: 2,
    todaySessions: 1247,
    activeSurveys: 4,
    criticalAlerts: 1
  }

  const handleQuickAction = (action: string, data?: any) => {
    track('product_manager_quick_action', {
      action,
      data,
      user_id: user?.id,
      timestamp: new Date().toISOString(),
    })

    switch (action) {
      case 'emergency_stop':
        alert('🚨 EMERGENCY STOP activated!\nAll non-critical features disabled.')
        break
      case 'create_experiment':
        alert('🧪 Creating new A/B test experiment...')
        break
      case 'view_sessions':
        alert('📹 Opening session recordings dashboard...')
        break
      default:
        alert(`Action: ${action}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Product Manager Dashboard</CardTitle>
                <CardDescription>
                  Advanced PostHog analytics, feature flags, and experimentation controls
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{quickStats.activeFlags}</div>
                <div className="text-xs text-muted-foreground">Active Flags</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{quickStats.activeExperiments}</div>
                <div className="text-xs text-muted-foreground">Live Tests</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{quickStats.killSwitchesArmed}</div>
                <div className="text-xs text-muted-foreground">Kill Switches</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{quickStats.todaySessions}</div>
                <div className="text-xs text-muted-foreground">Today's Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => handleQuickAction('emergency_stop')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Emergency Stop All
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleQuickAction('create_experiment')}
            >
              <Zap className="w-4 h-4 mr-2" />
              New A/B Test
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleQuickAction('view_sessions')}
            >
              <Video className="w-4 h-4 mr-2" />
              View Sessions
            </Button>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Feature Flags</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Analytics</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Experiments</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                1 Alert
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Recordings</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Healthy
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="kill-switch" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="kill-switch" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Kill Switch</span>
          </TabsTrigger>
          <TabsTrigger value="rollout" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Rollouts</span>
          </TabsTrigger>
          <TabsTrigger value="experiments" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">A/B Tests</span>
          </TabsTrigger>
          <TabsTrigger value="targeting" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Targeting</span>
          </TabsTrigger>
          <TabsTrigger value="recordings" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="surveys" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Surveys</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kill-switch" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold">Emergency Kill Switches</h2>
            <Badge className="bg-red-100 text-red-800">
              Critical Safety Feature
            </Badge>
          </div>
          <KillSwitchDashboard />
        </TabsContent>

        <TabsContent value="rollout" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Gradual Feature Rollouts</h2>
            <Badge className="bg-blue-100 text-blue-800">
              Safe Deployment
            </Badge>
          </div>
          <GradualRolloutDashboard />
        </TabsContent>

        <TabsContent value="experiments" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold">A/B Testing & Experiments</h2>
            <Badge className="bg-purple-100 text-purple-800">
              Data-Driven Decisions
            </Badge>
          </div>
          <ABTestingDashboard />
        </TabsContent>

        <TabsContent value="targeting" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold">User Targeting & Personalization</h2>
            <Badge className="bg-green-100 text-green-800">
              Personalized Experience
            </Badge>
          </div>
          <PersonalizationDashboard />
        </TabsContent>

        <TabsContent value="recordings" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold">Session Recordings & Behavior</h2>
            <Badge className="bg-orange-100 text-orange-800">
              User Insights
            </Badge>
          </div>
          <SessionRecordingDashboard />
        </TabsContent>

        <TabsContent value="surveys" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-semibold">User Surveys & Feedback</h2>
            <Badge className="bg-teal-100 text-teal-800">
              Voice of Customer
            </Badge>
          </div>
          <SurveysDashboard />
        </TabsContent>
      </Tabs>

      {/* Best Practices Tips */}
      <Card className="border-border bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <CardTitle>Product Manager Best Practices</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🚨 Emergency Preparedness</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Always have kill switches for major features</li>
                <li>• Monitor rollout metrics in real-time</li>
                <li>• Set up automated safety rules</li>
                <li>• Have rollback procedures ready</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🧪 Experimentation Strategy</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start with small user percentages</li>
                <li>• Define success metrics upfront</li>
                <li>• Run statistical significance tests</li>
                <li>• Document experiment learnings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎯 User Targeting</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Segment users by behavior and value</li>
                <li>• Personalize based on usage patterns</li>
                <li>• Test targeting rules carefully</li>
                <li>• Respect user privacy preferences</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Data-Driven Decisions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Review session recordings for UX issues</li>
                <li>• Collect qualitative feedback via surveys</li>
                <li>• Track behavioral funnels and drop-offs</li>
                <li>• Measure both leading and lagging indicators</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
