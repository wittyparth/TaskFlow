'use client'

import { useFeatureFlags } from '@/hooks/use-feature-flags'
import { useAnalytics } from '@/hooks/use-analytics'
import { useUser } from '@/hooks/use-auth'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Users,
  Activity,
  Target
} from 'lucide-react'

interface RolloutConfig {
  name: string
  flagKey: string
  description: string
  status: 'planning' | 'active' | 'paused' | 'completed' | 'failed'
  currentPercentage: number
  targetPercentage: number
  stages: RolloutStage[]
  metrics: RolloutMetrics
  safetyRules: SafetyRule[]
}

interface RolloutStage {
  percentage: number
  duration: string
  criteria?: string
  completed: boolean
  startedAt?: string
  completedAt?: string
}

interface RolloutMetrics {
  totalUsers: number
  affectedUsers: number
  successRate: number
  errorRate: number
  conversionRate: number
  userFeedback: number
}

interface SafetyRule {
  metric: 'error_rate' | 'conversion_rate' | 'user_feedback' | 'performance'
  threshold: number
  action: 'pause' | 'rollback' | 'alert'
  description: string
}

export function GradualRolloutDashboard() {
  const { user, profile } = useUser()
  const { track } = useAnalytics()

  // Only show to admins/owners
  if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
    return null
  }

  const rollouts: RolloutConfig[] = [
    {
      name: 'New Project Timeline View',
      flagKey: 'new_timeline_view',
      description: 'Enhanced project timeline with drag-and-drop scheduling',
      status: 'active',
      currentPercentage: 25,
      targetPercentage: 100,
      stages: [
        { percentage: 5, duration: '2 days', criteria: 'Internal team only', completed: true, startedAt: '2025-01-08', completedAt: '2025-01-10' },
        { percentage: 15, duration: '3 days', criteria: 'Power users (>10 projects)', completed: true, startedAt: '2025-01-10', completedAt: '2025-01-13' },
        { percentage: 25, duration: '5 days', criteria: 'Pro subscribers', completed: false, startedAt: '2025-01-13' },
        { percentage: 50, duration: '7 days', criteria: 'Active users (last 30 days)', completed: false },
        { percentage: 100, duration: '7 days', criteria: 'All users', completed: false },
      ],
      metrics: {
        totalUsers: 15678,
        affectedUsers: 3920,
        successRate: 94.2,
        errorRate: 1.3,
        conversionRate: 87.5,
        userFeedback: 4.6,
      },
      safetyRules: [
        { metric: 'error_rate', threshold: 3, action: 'pause', description: 'Pause if error rate exceeds 3%' },
        { metric: 'user_feedback', threshold: 3.5, action: 'alert', description: 'Alert if user feedback drops below 3.5/5' },
        { metric: 'conversion_rate', threshold: 75, action: 'alert', description: 'Alert if conversion rate drops below 75%' },
      ],
    },
    {
      name: 'Dark Mode Theme',
      flagKey: 'dark_mode_theme',
      description: 'Dark theme option for improved user experience',
      status: 'completed',
      currentPercentage: 100,
      targetPercentage: 100,
      stages: [
        { percentage: 10, duration: '1 day', criteria: 'Beta testers', completed: true, startedAt: '2025-01-05', completedAt: '2025-01-06' },
        { percentage: 50, duration: '3 days', criteria: 'Pro users', completed: true, startedAt: '2025-01-06', completedAt: '2025-01-09' },
        { percentage: 100, duration: '2 days', criteria: 'All users', completed: true, startedAt: '2025-01-09', completedAt: '2025-01-11' },
      ],
      metrics: {
        totalUsers: 15678,
        affectedUsers: 15678,
        successRate: 98.7,
        errorRate: 0.2,
        conversionRate: 92.1,
        userFeedback: 4.8,
      },
      safetyRules: [],
    },
    {
      name: 'AI Task Suggestions',
      flagKey: 'ai_task_suggestions',
      description: 'AI-powered task recommendations and auto-completion',
      status: 'paused',
      currentPercentage: 15,
      targetPercentage: 100,
      stages: [
        { percentage: 5, duration: '2 days', criteria: 'Internal team', completed: true, startedAt: '2025-01-07', completedAt: '2025-01-09' },
        { percentage: 15, duration: '3 days', criteria: 'Power users', completed: false, startedAt: '2025-01-09' },
        { percentage: 35, duration: '5 days', criteria: 'Pro subscribers', completed: false },
        { percentage: 70, duration: '7 days', criteria: 'Active users', completed: false },
        { percentage: 100, duration: '7 days', criteria: 'All users', completed: false },
      ],
      metrics: {
        totalUsers: 15678,
        affectedUsers: 2351,
        successRate: 89.4,
        errorRate: 4.7,
        conversionRate: 68.3,
        userFeedback: 3.2,
      },
      safetyRules: [
        { metric: 'error_rate', threshold: 2, action: 'pause', description: 'Pause if error rate exceeds 2%' },
        { metric: 'user_feedback', threshold: 4.0, action: 'pause', description: 'Pause if user feedback drops below 4.0/5' },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-muted text-muted-foreground'
      case 'active': return 'bg-primary/10 text-primary'
      case 'paused': return 'bg-secondary/10 text-secondary-foreground'
      case 'completed': return 'bg-primary/20 text-primary'
      case 'failed': return 'bg-destructive/10 text-destructive'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <Target className="w-4 h-4" />
      case 'active': return <Play className="w-4 h-4" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <AlertCircle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const controlRollout = (rollout: RolloutConfig, action: 'pause' | 'resume' | 'rollback' | 'advance') => {
    track('rollout_control_action', {
      rollout_name: rollout.name,
      flag_key: rollout.flagKey,
      action: action,
      current_percentage: rollout.currentPercentage,
      controlled_by: user?.email,
      timestamp: new Date().toISOString(),
    })

    switch (action) {
      case 'pause':
        alert(`Rollout "${rollout.name}" has been PAUSED at ${rollout.currentPercentage}%`)
        break
      case 'resume':
        alert(`Rollout "${rollout.name}" has been RESUMED from ${rollout.currentPercentage}%`)
        break
      case 'rollback':
        const confirmed = window.confirm(`⚠️ ROLLBACK CONFIRMATION\n\nThis will rollback "${rollout.name}" and disable the feature for all ${rollout.metrics.affectedUsers.toLocaleString()} currently affected users.\n\nAre you sure?`)
        if (confirmed) {
          alert(`Rollout "${rollout.name}" has been ROLLED BACK to 0%`)
        }
        break
      case 'advance':
        alert(`Rollout "${rollout.name}" has been ADVANCED to the next stage`)
        break
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="text-card-foreground">Gradual Rollout Dashboard</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Monitor and control progressive feature deployments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {rollouts.map((rollout) => (
            <div key={rollout.flagKey} className="border border-border rounded-lg p-6 bg-card">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-card-foreground">{rollout.name}</h3>
                    <Badge className={getStatusColor(rollout.status)}>
                      {getStatusIcon(rollout.status)}
                      <span className="ml-1 capitalize">{rollout.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rollout.description}</p>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress: {rollout.currentPercentage}% of {rollout.targetPercentage}%</span>
                      <span>{rollout.metrics.affectedUsers.toLocaleString()} / {rollout.metrics.totalUsers.toLocaleString()} users</span>
                    </div>
                    <Progress value={rollout.currentPercentage} className="h-2" />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-2 ml-4">
                  {rollout.status === 'active' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => controlRollout(rollout, 'pause')}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => controlRollout(rollout, 'advance')}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {rollout.status === 'paused' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => controlRollout(rollout, 'resume')}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  {(rollout.status === 'active' || rollout.status === 'paused') && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => controlRollout(rollout, 'rollback')}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">{rollout.metrics.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-red-600">{rollout.metrics.errorRate}%</div>
                  <div className="text-xs text-muted-foreground">Error Rate</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">{rollout.metrics.conversionRate}%</div>
                  <div className="text-xs text-muted-foreground">Conversion</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-purple-600">{rollout.metrics.userFeedback}/5</div>
                  <div className="text-xs text-muted-foreground">User Feedback</div>
                </div>
              </div>

              {/* Stages */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Rollout Stages</h4>
                <div className="space-y-2">
                  {rollout.stages.map((stage, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded border ${
                        stage.completed 
                          ? 'bg-green-50 border-green-200' 
                          : rollout.currentPercentage >= stage.percentage
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {stage.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : rollout.currentPercentage >= stage.percentage ? (
                          <Activity className="w-4 h-4 text-blue-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className="text-sm font-medium">{stage.percentage}%</span>
                        <span className="text-sm text-muted-foreground">{stage.criteria}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stage.duration} • {stage.completedAt ? `Completed ${stage.completedAt}` : stage.startedAt ? `Started ${stage.startedAt}` : 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Rules */}
              {rollout.safetyRules.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Safety Rules</h4>
                  <div className="space-y-1">
                    {rollout.safetyRules.map((rule, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" />
                        {rule.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
