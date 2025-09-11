'use client'

import { useFeatureFlag } from '@/hooks/use-feature-flags'
import { usePostHog } from '@/components/providers/posthog-provider'
import { useUser } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Flag,
  TrendingUp,
  Users,
  Zap,
  Crown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Beaker,
  BarChart3
} from 'lucide-react'

export function RealFeatureFlagsDemo() {
  const { user } = useUser()
  const posthog = usePostHog()
  
  // Your actual PostHog feature flags
  const advancedAnalytics = useFeatureFlag('advanced_analytics')
  const aiRecommendations = useFeatureFlag('ai_recommendations')
  const newCheckoutFlow = useFeatureFlag('new_checkout_flow')
  const advancedSearch = useFeatureFlag('advanced-search')
  
  // A/B test variants
  const pricingLayoutVariant = posthog?.getFeatureFlag('pricing_layout_experiment') || 'control'
  const pricingPageTest = posthog?.getFeatureFlag('pricing_page_test') || 'control'
  
  // Kill switches
  const paymentSystemEnabled = useFeatureFlag('payment_system_kill_switch')
  const aiFeaturesEnabled = useFeatureFlag('ai_features_kill_switch')
  const socialFeaturesEnabled = useFeatureFlag('social_features_kill_switch')
  const dataExportEnabled = useFeatureFlag('data_export_kill_switch')

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            <CardTitle className="text-card-foreground">Live PostHog Feature Flags</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Real feature flags from your PostHog dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Feature Rollouts */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Gradual Rollouts
            </h4>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">New Checkout Flow</span>
                    <Badge variant={newCheckoutFlow ? "default" : "secondary"}>
                      {newCheckoutFlow ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">5% of all users</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">5%</div>
                  <Progress value={5} className="w-20 h-2" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">AI Recommendations</span>
                    <Badge variant={aiRecommendations ? "default" : "secondary"}>
                      {aiRecommendations ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">10% of Pro+ users</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">10%</div>
                  <Progress value={10} className="w-20 h-2" />
                </div>
              </div>
            </div>
          </div>

          {/* A/B Testing */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Beaker className="w-4 h-4" />
              A/B Testing
            </h4>
            <div className="grid gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Pricing Layout Experiment</span>
                  <Badge variant="outline">Running</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Your variant: <strong>{pricingLayoutVariant}</strong></span>
                  <span>3 variants active</span>
                </div>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Pricing Page Test</span>
                  <Badge variant="outline">Running</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Your variant: <strong>{pricingPageTest}</strong></span>
                  <span>CTA optimization</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Gates */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Feature Gates
            </h4>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Advanced Analytics</span>
                    <Badge variant={advancedAnalytics ? "default" : "secondary"}>
                      {advancedAnalytics ? "Enabled" : "Pro+ Only"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Pro+ subscription required</p>
                </div>
                {advancedAnalytics ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Shield className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Advanced Search</span>
                    <Badge variant={advancedSearch ? "default" : "secondary"}>
                      {advancedSearch ? "Enabled" : "Coming Soon"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Enhanced search capabilities</p>
                </div>
                {advancedSearch ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Shield className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Kill Switches */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              System Status (Kill Switches)
            </h4>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <span className="font-medium">Payment System</span>
                  <p className="text-sm text-muted-foreground">Critical payment processing</p>
                </div>
                <Badge variant={paymentSystemEnabled ? "default" : "destructive"}>
                  {paymentSystemEnabled ? "Operational" : "Disabled"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <span className="font-medium">AI Features</span>
                  <p className="text-sm text-muted-foreground">AI-powered functionality</p>
                </div>
                <Badge variant={aiFeaturesEnabled ? "default" : "destructive"}>
                  {aiFeaturesEnabled ? "Operational" : "Disabled"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <span className="font-medium">Social Features</span>
                  <p className="text-sm text-muted-foreground">Sharing and collaboration</p>
                </div>
                <Badge variant={socialFeaturesEnabled ? "default" : "destructive"}>
                  {socialFeaturesEnabled ? "Operational" : "Disabled"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <span className="font-medium">Data Export</span>
                  <p className="text-sm text-muted-foreground">Data export functionality</p>
                </div>
                <Badge variant={dataExportEnabled ? "default" : "destructive"}>
                  {dataExportEnabled ? "Operational" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Live Demo Actions */}
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium mb-3">Experience the Features</h4>
            <div className="grid grid-cols-2 gap-3">
              {advancedAnalytics && (
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/analytics">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Advanced Analytics
                  </a>
                </Button>
              )}
              
              <Button variant="outline" className="justify-start" asChild>
                <a href="/admin">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Controls
                </a>
              </Button>
              
              {aiRecommendations && (
                <Button variant="outline" className="justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  AI Recommendations
                </Button>
              )}
              
              <Button variant="outline" className="justify-start" asChild>
                <a href="/pricing">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  A/B Test Pricing
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Current Experience */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Your Personalized Experience</CardTitle>
          <CardDescription className="text-muted-foreground">
            Based on your user properties and feature flag assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-900">Pricing Layout Test</h5>
            <p className="text-sm text-blue-700">
              You're seeing the <strong>{pricingLayoutVariant}</strong> variant of our pricing page. 
              This helps us optimize conversion rates.
            </p>
          </div>
          
          {newCheckoutFlow && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h5 className="font-medium text-green-900">New Checkout Flow</h5>
              <p className="text-sm text-green-700">
                You're experiencing our streamlined checkout process! 
                This is being tested with 5% of users.
              </p>
            </div>
          )}
          
          {aiRecommendations && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <h5 className="font-medium text-purple-900">AI Recommendations</h5>
              <p className="text-sm text-purple-700">
                As a Pro+ user, you have access to AI-powered recommendations 
                (rolling out to 10% of Pro+ users).
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
