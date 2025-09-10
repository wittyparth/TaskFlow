'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnalytics } from '@/hooks/use-analytics'
import { useFeatureFlags } from '@/hooks/use-feature-flags'
import { useSurveys } from '@/hooks/use-surveys'
import { FeatureFlag, SubscriptionGate, RoleGate } from '@/components/feature-flags/feature-gate'
import { AnalyticsWrapper } from '@/components/analytics/analytics-wrapper'
import { useUser } from '@/hooks/use-auth'

export function AnalyticsExamples() {
  const { track, trackClick, trackFeatureUsage } = useAnalytics()
  const { features } = useFeatureFlags()
  const { surveys } = useSurveys()
  const { profile } = useUser()

  const handleCreateProject = () => {
    track('project_create_clicked', {
      source: 'dashboard',
      user_subscription: profile?.subscription_tier,
    })
  }

  const handleUpgradeClick = () => {
    trackClick('upgrade_button', {
      current_tier: profile?.subscription_tier,
      location: 'analytics_example',
    })
  }

  const handleFeatureUsage = () => {
    trackFeatureUsage('advanced_analytics', {
      feature_tier: 'pro',
    })
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>PostHog Analytics Examples</CardTitle>
          <CardDescription>
            Examples of how analytics are implemented in your TaskFlow app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Basic Event Tracking */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Event Tracking</h3>
            <div className="space-x-2">
              <Button onClick={handleCreateProject}>
                Create Project (Tracked)
              </Button>
              <Button onClick={handleUpgradeClick} variant="outline">
                Upgrade Account (Tracked)
              </Button>
            </div>
          </div>

          {/* Analytics Wrapper */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Analytics Wrapper</h3>
            <AnalyticsWrapper
              event="button_hovered"
              properties={{ button_type: 'feature_demo' }}
              trackOnHover
            >
              <Button variant="secondary">
                Hover to Track (Auto-tracked)
              </Button>
            </AnalyticsWrapper>
          </div>

          {/* Feature Flags */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Feature Flags</h3>
            <div className="space-y-2">
              
              <FeatureFlag flag="advanced-analytics" fallback={
                <p className="text-muted-foreground">Advanced analytics not enabled</p>
              }>
                <Button onClick={handleFeatureUsage} className="bg-blue-600">
                  ✨ Advanced Analytics (Feature Flag)
                </Button>
              </FeatureFlag>

              <FeatureFlag flag="ai-assistant" fallback={
                <p className="text-muted-foreground">AI Assistant coming soon</p>
              }>
                <Button variant="outline">
                  🤖 AI Assistant (Beta Feature)
                </Button>
              </FeatureFlag>
            </div>
          </div>

          {/* Subscription Gates */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Subscription-Based Features</h3>
            <div className="space-y-2">
              
              <SubscriptionGate 
                tier="pro" 
                currentTier={profile?.subscription_tier || 'free'}
                fallback={
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        Upgrade to Pro to access unlimited projects
                      </p>
                      <Button size="sm" className="mt-2">Upgrade Now</Button>
                    </CardContent>
                  </Card>
                }
              >
                <Button className="bg-green-600">
                  ∞ Unlimited Projects (Pro Feature)
                </Button>
              </SubscriptionGate>

              <SubscriptionGate 
                tier="enterprise" 
                currentTier={profile?.subscription_tier || 'free'}
                fallback={
                  <p className="text-sm text-muted-foreground">
                    Enterprise feature - contact sales
                  </p>
                }
              >
                <Button className="bg-purple-600">
                  🏢 Advanced Team Management (Enterprise)
                </Button>
              </SubscriptionGate>
            </div>
          </div>

          {/* Role-Based Features */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Role-Based Features</h3>
            
            <RoleGate 
              roles={['admin', 'owner']} 
              currentRole={profile?.role || 'user'}
              fallback={
                <p className="text-sm text-muted-foreground">
                  Admin access required
                </p>
              }
            >
              <Button className="bg-red-600">
                ⚙️ Admin Settings
              </Button>
            </RoleGate>
          </div>

          {/* Surveys */}
          <div>
            <h3 className="text-lg font-semibold mb-2">User Feedback</h3>
            <div className="space-x-2">
              <Button onClick={surveys.showNPSSurvey} variant="outline">
                📊 Show NPS Survey
              </Button>
              <Button 
                onClick={() => surveys.showFeatureFeedback('analytics_example')} 
                variant="outline"
              >
                💭 Feature Feedback
              </Button>
              <Button onClick={surveys.showOnboardingFeedback} variant="outline">
                🎯 Onboarding Survey
              </Button>
            </div>
          </div>

          {/* Current Feature Status */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Feature Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Advanced Analytics:</strong> {features.advancedAnalytics ? '✅' : '❌'}
              </div>
              <div>
                <strong>AI Assistant:</strong> {features.aiAssistant ? '✅' : '❌'}
              </div>
              <div>
                <strong>Task Automation:</strong> {features.taskAutomation ? '✅' : '❌'}
              </div>
              <div>
                <strong>Team Management:</strong> {features.teamManagement ? '✅' : '❌'}
              </div>
              <div>
                <strong>Unlimited Projects:</strong> {features.unlimitedProjects ? '✅' : '❌'}
              </div>
              <div>
                <strong>Priority Support:</strong> {features.prioritySupport ? '✅' : '❌'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
