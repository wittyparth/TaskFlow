'use client'

import { useFeatureFlag } from '@/hooks/use-feature-flags'
import { usePostHog } from '@/components/providers/posthog-provider'
import { useUser } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Target } from 'lucide-react'

export function GradualRolloutDemo() {
  const { user } = useUser()
  const posthog = usePostHog()
  
  // Real PostHog feature flags
  const newCheckoutFlow = useFeatureFlag('new_checkout_flow') // 5% rollout
  const aiRecommendations = useFeatureFlag('ai_recommendations') // 10% Pro+ users
  const advancedSearch = useFeatureFlag('advanced-search') // 0% currently

  if (!user) return null

  const rollouts = [
    {
      name: 'New Checkout Flow',
      flagKey: 'new_checkout_flow',
      description: 'Streamlined checkout process with reduced steps',
      status: newCheckoutFlow ? 'active' : 'planning',
      currentPercentage: 5,
      targetPercentage: 100,
      affectedUsers: 784,
      totalUsers: 15678,
    },
    {
      name: 'AI Recommendations',
      flagKey: 'ai_recommendations', 
      description: 'AI-powered product recommendations for Pro+ users',
      status: aiRecommendations ? 'active' : 'planning',
      currentPercentage: 10,
      targetPercentage: 100,
      affectedUsers: 1568,
      totalUsers: 15678,
    },
    {
      name: 'Advanced Search',
      flagKey: 'advanced-search',
      description: 'Enhanced search with filters and smart suggestions',
      status: 'planning',
      currentPercentage: 0,
      targetPercentage: 100,
      affectedUsers: 0,
      totalUsers: 15678,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'planning': return 'secondary'
      case 'paused': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <CardTitle className="text-card-foreground">Gradual Feature Rollouts</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Progressive feature deployment with safety monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {rollouts.map((rollout) => (
          <div key={rollout.flagKey} className="border border-border rounded-lg p-4 bg-muted/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-card-foreground">{rollout.name}</h4>
                  <Badge variant={getStatusColor(rollout.status) as any}>
                    {rollout.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rollout.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {rollout.currentPercentage}% of {rollout.targetPercentage}%</span>
                <span>{rollout.affectedUsers.toLocaleString()} / {rollout.totalUsers.toLocaleString()} users</span>
              </div>
              <Progress value={rollout.currentPercentage} className="h-2" />
            </div>

            {rollout.status === 'active' && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                ✅ Feature is live for {rollout.currentPercentage}% of users
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
