'use client'

import { useUser } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UpgradeButton } from '@/components/upgrade-button'
import Link from 'next/link'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  Flag,
  Zap,
  Target,
  Crown,
  ArrowUpRight,
  Shield,
  CheckCircle
} from 'lucide-react'

// Import feature components
import { AdvancedFeatureGate } from '@/components/feature-flags/advanced-feature-gate'
import { PersonalizedContent } from '@/components/feature-flags/personalization'
import { BehaviorTracker } from '@/components/feature-flags/session-recording'
import { RealFeatureFlagsDemo } from '@/components/feature-flags/real-feature-flags-demo'

export default function Dashboard() {
  const { user, profile } = useUser()

  // Demo analytics data
  const analytics = {
    totalUsers: 12847,
    activeUsers: 3421,
    sessionsToday: 1847,
    conversionRate: 3.2,
    bounceRate: 24.1,
    averageSessionDuration: 342
  }

  // Demo feature flags
  const featureFlags = [
    { name: 'new_dashboard', enabled: true, rollout: 100 },
    { name: 'ai_assistant', enabled: true, rollout: 45 },
    { name: 'advanced_analytics', enabled: false, rollout: 0 },
    { name: 'team_collaboration', enabled: true, rollout: 80 }
  ]

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please sign in to access the dashboard</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <BehaviorTracker>
      <div className="space-y-6">
        {/* Subscription Management */}
        {profile?.subscription_tier === 'free' ? (
          <UpgradeButton showAllOptions={true} location="dashboard" />
        ) : (
          <UpgradeButton showAllOptions={false} compact={true} location="dashboard" />
        )}

        {/* Welcome Header */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-card-foreground">
                  Welcome back, {profile.full_name || user.email?.split('@')[0]}!
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Here's what's happening with your product today
                </CardDescription>
              </div>
              <Badge variant="default" className="bg-primary text-primary-foreground">
                <CheckCircle className="w-3 h-3 mr-1" />
                {featureFlags.filter(f => f.enabled).length} features active
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Personalized Admin Access */}
        <PersonalizedContent ruleId="enterprise_features">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <CardTitle className="text-card-foreground">Product Manager Controls</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Advanced PostHog analytics, feature flags, and experimentation dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/dashboard/admin" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Access Admin Dashboard
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/analytics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    View Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </PersonalizedContent>

        {/* Analytics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-card-foreground">{analytics.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary">+12.3%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-card-foreground">{analytics.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Today</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary">+8.7%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-card-foreground">{analytics.sessionsToday.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary">+15.2%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-card-foreground">{analytics.conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Conversion</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary">+0.8%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-card-foreground">{analytics.bounceRate}%</div>
              <div className="text-sm text-muted-foreground">Bounce Rate</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-xs text-primary">-2.1%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-card-foreground">{Math.floor(analytics.averageSessionDuration / 60)}m</div>
              <div className="text-sm text-muted-foreground">Avg. Session</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary">+34s</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Flags Status */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary" />
              <CardTitle className="text-card-foreground">Feature Flags Status</CardTitle>
            </div>
            <CardDescription>
              Current feature rollout status and user targeting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featureFlags.map((flag) => (
                <div key={flag.name} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{flag.name.replace('_', ' ')}</h4>
                    <Badge className={flag.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {flag.enabled ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rollout</span>
                      <span className="font-medium">{flag.rollout}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${flag.rollout}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real PostHog Feature Flags Demo */}
        <RealFeatureFlagsDemo />

        {/* Personalized Features Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New User Onboarding */}
          <PersonalizedContent ruleId="new_user_onboarding">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <CardTitle>Welcome! Let's get you started</CardTitle>
                </div>
                <CardDescription>
                  Complete your setup to unlock the full potential of our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Account created</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-blue-300 rounded-full" />
                    <span>Create your first project</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    <span>Invite team members</span>
                  </div>
                  <Button className="w-full mt-4">
                    Continue Setup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PersonalizedContent>

          {/* Power User Features */}
          <PersonalizedContent ruleId="power_user_features">
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <CardTitle>Beta Features Available!</CardTitle>
                </div>
                <CardDescription>
                  You've been selected for early access to our latest features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Assistant</span>
                    <Badge className="bg-purple-100 text-purple-800">Beta</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Advanced Reporting</span>
                    <Badge className="bg-purple-100 text-purple-800">Beta</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Access</span>
                    <Badge className="bg-purple-100 text-purple-800">Beta</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Try Beta Features
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PersonalizedContent>

          {/* Churn Prevention */}
          <PersonalizedContent 
            ruleId="churn_prevention"
            fallback={
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Keep Up the Great Work!</h3>
                  <p className="text-muted-foreground">
                    You're actively using our platform. Check out what's new!
                  </p>
                </CardContent>
              </Card>
            }
          >
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  <CardTitle>We Miss You!</CardTitle>
                </div>
                <CardDescription>
                  See what's new since your last visit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>New this week:</strong>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Enhanced dashboard performance</li>
                      <li>• New collaboration features</li>
                      <li>• Improved mobile experience</li>
                    </ul>
                  </div>
                  <Button className="w-full">
                    Explore Updates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PersonalizedContent>

          {/* Feature Gate Demo */}
          <AdvancedFeatureGate 
            flagKey="advanced_analytics"
            fallback={
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Unlock detailed insights about your users and product performance
                  </p>
                  <Button>
                    Upgrade to Access
                  </Button>
                </CardContent>
              </Card>
            }
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <CardTitle>Advanced Analytics</CardTitle>
                  <Badge className="bg-green-100 text-green-800">Premium</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-white rounded">
                      <div className="text-lg font-bold text-green-600">94.2%</div>
                      <div className="text-xs text-muted-foreground">Feature Adoption</div>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <div className="text-lg font-bold text-blue-600">2.3x</div>
                      <div className="text-xs text-muted-foreground">Engagement Lift</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AdvancedFeatureGate>
        </div>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for your daily workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link href="/dashboard/projects">
                  <Flag className="w-6 h-6" />
                  <span>Create Project</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link href="/dashboard/team">
                  <Users className="w-6 h-6" />
                  <span>Invite Team</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link href="/dashboard/analytics">
                  <BarChart3 className="w-6 h-6" />
                  <span>View Analytics</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link href="/dashboard/settings">
                  <Activity className="w-6 h-6" />
                  <span>Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </BehaviorTracker>
  )
}
