'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useFeatureFlags } from "@/hooks/use-feature-flags"
import { CheckCircle, XCircle, Lock, Zap, Flag } from "lucide-react"

export default function FeatureStatusPage() {
  const { profile } = useAuth()
  const { isFeatureEnabled } = useFeatureFlags()

  const features = [
    {
      name: "Analytics",
      flagKey: "advanced-analytics", 
      requiredTier: "pro",
      description: "Advanced analytics and reporting features"
    },
    {
      name: "Team Management",
      flagKey: "team-management",
      requiredTier: "pro", 
      description: "Invite team members and manage permissions"
    },
    {
      name: "Advanced Search",
      flagKey: "advanced-search",
      requiredTier: "pro",
      description: "Enhanced search functionality across projects"
    },
    {
      name: "Notifications",
      flagKey: "notifications",
      requiredTier: "free",
      description: "Real-time notifications and alerts"
    },
    {
      name: "AI Assistant", 
      flagKey: "ai-assistant",
      requiredTier: "enterprise",
      description: "AI-powered project assistance and automation"
    },
    {
      name: "API Access",
      flagKey: "api-access", 
      requiredTier: "pro",
      description: "Full API access for integrations"
    }
  ]

  const getFeatureStatus = (feature: any) => {
    const userTier = profile?.subscription_tier || 'free'
    const tierHierarchy = { free: 0, pro: 1, enterprise: 2 }
    const userLevel = tierHierarchy[userTier as keyof typeof tierHierarchy]
    const requiredLevel = tierHierarchy[feature.requiredTier as keyof typeof tierHierarchy]
    
    const hasRequiredTier = userLevel >= requiredLevel
    const flagEnabled = isFeatureEnabled(feature.flagKey)
    
    if (!flagEnabled) {
      return { status: 'killed', reason: 'Feature is disabled via kill switch' }
    }
    
    if (!hasRequiredTier) {
      return { status: 'blocked', reason: `Requires ${feature.requiredTier} plan or higher` }
    }
    
    return { status: 'available', reason: 'Feature is available' }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'blocked':
        return <Lock className="h-5 w-5 text-orange-500" />
      case 'killed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case 'blocked':
        return <Badge className="bg-orange-100 text-orange-800">Upgrade Required</Badge>
      case 'killed':
        return <Badge className="bg-red-100 text-red-800">Disabled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feature Status</h1>
          <p className="text-muted-foreground">
            See which features are available for your current subscription and feature flag settings
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Subscription:</span>
              <Badge variant="outline" className="capitalize">
                {profile?.subscription_tier || 'Free'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Role:</span>
              <Badge variant="outline" className="capitalize">
                {profile?.role || 'Member'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>User ID:</span>
              <code className="text-xs">{profile?.id?.slice(0, 8)}...</code>
            </div>
            <div className="flex justify-between">
              <span>Analytics Access:</span>
              <Badge variant={profile?.subscription_tier !== 'free' ? "default" : "destructive"}>
                {profile?.subscription_tier !== 'free' ? "Allowed" : "Blocked"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Tier Hierarchy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm space-y-1">
              <div>Free (0): Basic features only</div>
              <div>Pro (1): Analytics, Team, Search</div>
              <div>Enterprise (2): All features + AI</div>
            </div>
            <div className="pt-2 border-t">
              <span className="font-medium">Your Level: </span>
              <Badge>
                {profile?.subscription_tier || 'unknown'} 
                ({profile?.subscription_tier === 'free' ? '0' : 
                  profile?.subscription_tier === 'pro' ? '1' : 
                  profile?.subscription_tier === 'enterprise' ? '2' : '?'})
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const { status, reason } = getFeatureStatus(feature)
          
          return (
            <Card key={feature.name}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    {feature.name}
                  </span>
                  {getStatusBadge(status)}
                </CardTitle>
                <CardDescription>
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Required:</span>
                    <Badge variant="outline" className="capitalize">
                      {feature.requiredTier}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Flag:</span>
                    <code className="text-xs">{feature.flagKey}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Flag Status:</span>
                    <Badge variant={isFeatureEnabled(feature.flagKey) ? "default" : "destructive"}>
                      {isFeatureEnabled(feature.flagKey) ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-2">{reason}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Feature Gating in Action
          </CardTitle>
          <CardDescription>
            How feature gating affects your navigation and page access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Navigation Items</h4>
              <ul className="space-y-1 text-sm">
                <li>• Analytics: {getFeatureStatus({flagKey: "advanced-analytics", requiredTier: "pro"}).status === 'available' ? '✅ Visible' : '❌ Hidden'}</li>
                <li>• Team: {getFeatureStatus({flagKey: "team-management", requiredTier: "pro"}).status === 'available' ? '✅ Visible' : '❌ Hidden'}</li>
                <li>• Search: {getFeatureStatus({flagKey: "advanced-search", requiredTier: "pro"}).status === 'available' ? '✅ Visible' : '❌ Hidden'}</li>
                <li>• Notifications: {getFeatureStatus({flagKey: "notifications", requiredTier: "free"}).status === 'available' ? '✅ Visible' : '❌ Hidden'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Page Access</h4>
              <ul className="space-y-1 text-sm">
                <li>• Analytics Page: {getFeatureStatus({flagKey: "advanced-analytics", requiredTier: "pro"}).status === 'available' ? '✅ Accessible' : '🔒 Upgrade Required'}</li>
                <li>• Team Page: {getFeatureStatus({flagKey: "team-management", requiredTier: "pro"}).status === 'available' ? '✅ Accessible' : '🔒 Upgrade Required'}</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h5 className="font-medium mb-2">How to Test:</h5>
            <ol className="text-sm space-y-1">
              <li>1. Try upgrading/downgrading your subscription tier</li>
              <li>2. Toggle feature flags in PostHog dashboard</li>
              <li>3. Notice how navigation and page access changes instantly</li>
              <li>4. Kill switches hide features for ALL users regardless of tier</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}