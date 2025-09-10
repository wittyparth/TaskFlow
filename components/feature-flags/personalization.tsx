'use client'

import { useFeatureFlags } from '@/hooks/use-feature-flags'
import { useAnalytics } from '@/hooks/use-analytics'
import { useUser } from '@/hooks/use-auth'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Target,
  Users,
  Crown,
  Briefcase,
  Globe,
  TrendingUp,
  Clock,
  Star,
  Zap,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react'

interface PersonalizationRule {
  id: string
  name: string
  description: string
  active: boolean
  conditions: TargetingCondition[]
  actions: PersonalizationAction[]
  priority: number
  category: 'subscription' | 'engagement' | 'geographic' | 'behavioral' | 'temporal'
  metrics: {
    matchedUsers: number
    conversionLift: number
    engagementImprovement: number
  }
}

interface TargetingCondition {
  type: 'subscription_tier' | 'user_role' | 'team_size' | 'signup_date' | 'last_active' | 'location' | 'usage_pattern' | 'feature_usage'
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in'
  value: any
  description: string
}

interface PersonalizationAction {
  type: 'show_feature' | 'hide_feature' | 'show_banner' | 'customize_ui' | 'send_notification' | 'redirect'
  config: any
  description: string
}

export function PersonalizationDashboard() {
  const { user, profile } = useUser()
  const { track } = useAnalytics()

  // Only show to admins/owners
  if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
    return null
  }

  const personalizationRules: PersonalizationRule[] = [
    {
      id: 'enterprise_features',
      name: 'Enterprise Features Visibility',
      description: 'Show advanced features only to large teams and enterprise users',
      active: true,
      priority: 1,
      category: 'subscription',
      conditions: [
        {
          type: 'subscription_tier',
          operator: 'in',
          value: ['pro', 'enterprise'],
          description: 'User has Pro or Enterprise subscription'
        },
        {
          type: 'team_size',
          operator: 'greater_than',
          value: 10,
          description: 'Team has more than 10 members'
        }
      ],
      actions: [
        {
          type: 'show_feature',
          config: { features: ['advanced_analytics', 'sso_integration', 'audit_logs'] },
          description: 'Show enterprise features in navigation'
        },
        {
          type: 'show_banner',
          config: { message: '🚀 Unlock advanced team collaboration tools!', cta: 'Explore Features' },
          description: 'Show enterprise features banner'
        }
      ],
      metrics: {
        matchedUsers: 1247,
        conversionLift: 34.2,
        engagementImprovement: 28.7
      }
    },
    {
      id: 'new_user_onboarding',
      name: 'New User Personalized Onboarding',
      description: 'Customize onboarding flow based on user type and team size',
      active: true,
      priority: 2,
      category: 'behavioral',
      conditions: [
        {
          type: 'signup_date',
          operator: 'less_than',
          value: 7,
          description: 'User signed up within last 7 days'
        },
        {
          type: 'feature_usage',
          operator: 'less_than',
          value: 3,
          description: 'User has used fewer than 3 core features'
        }
      ],
      actions: [
        {
          type: 'show_feature',
          config: { component: 'guided_tutorial', priority: 'high' },
          description: 'Show interactive tutorial overlay'
        },
        {
          type: 'customize_ui',
          config: { highlight_features: ['create_project', 'invite_team', 'task_creation'] },
          description: 'Highlight key features with tooltips'
        }
      ],
      metrics: {
        matchedUsers: 892,
        conversionLift: 67.3,
        engagementImprovement: 45.8
      }
    },
    {
      id: 'power_user_features',
      name: 'Power User Beta Access',
      description: 'Give high-engagement users early access to beta features',
      active: true,
      priority: 3,
      category: 'engagement',
      conditions: [
        {
          type: 'usage_pattern',
          operator: 'equals',
          value: 'high',
          description: 'User classified as high-usage'
        },
        {
          type: 'last_active',
          operator: 'less_than',
          value: 1,
          description: 'User was active within last 24 hours'
        }
      ],
      actions: [
        {
          type: 'show_feature',
          config: { features: ['ai_assistant_beta', 'advanced_reporting', 'api_access'] },
          description: 'Enable beta features for power users'
        },
        {
          type: 'show_banner',
          config: { message: '⚡ Try our new AI features!', type: 'beta_invite' },
          description: 'Show beta feature invitation'
        }
      ],
      metrics: {
        matchedUsers: 456,
        conversionLift: 23.1,
        engagementImprovement: 52.4
      }
    },
    {
      id: 'geographic_compliance',
      name: 'Geographic Compliance Features',
      description: 'Show region-specific features and compliance tools',
      active: true,
      priority: 4,
      category: 'geographic',
      conditions: [
        {
          type: 'location',
          operator: 'in',
          value: ['EU', 'UK', 'CA'],
          description: 'User located in regions with specific compliance requirements'
        }
      ],
      actions: [
        {
          type: 'show_feature',
          config: { features: ['gdpr_tools', 'data_export', 'privacy_controls'] },
          description: 'Show GDPR and privacy compliance features'
        },
        {
          type: 'show_banner',
          config: { message: '🔒 Enhanced privacy controls available', type: 'compliance' },
          description: 'Show privacy compliance banner'
        }
      ],
      metrics: {
        matchedUsers: 3421,
        conversionLift: 12.7,
        engagementImprovement: 18.3
      }
    },
    {
      id: 'churn_prevention',
      name: 'Churn Prevention Intervention',
      description: 'Target at-risk users with retention campaigns',
      active: true,
      priority: 5,
      category: 'behavioral',
      conditions: [
        {
          type: 'last_active',
          operator: 'greater_than',
          value: 7,
          description: 'User inactive for more than 7 days'
        },
        {
          type: 'subscription_tier',
          operator: 'not_equals',
          value: 'free',
          description: 'User has paid subscription'
        }
      ],
      actions: [
        {
          type: 'show_banner',
          config: { message: '👋 We miss you! Here\'s what\'s new...', type: 'return_encouragement' },
          description: 'Show re-engagement banner'
        },
        {
          type: 'send_notification',
          config: { type: 'email', template: 'we_miss_you', delay: '1_day' },
          description: 'Send re-engagement email campaign'
        }
      ],
      metrics: {
        matchedUsers: 234,
        conversionLift: 41.8,
        engagementImprovement: 73.2
      }
    }
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subscription': return <Crown className="w-4 h-4" />
      case 'engagement': return <TrendingUp className="w-4 h-4" />
      case 'geographic': return <Globe className="w-4 h-4" />
      case 'behavioral': return <Target className="w-4 h-4" />
      case 'temporal': return <Clock className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'subscription': return 'bg-primary/10 text-primary'
      case 'engagement': return 'bg-primary/20 text-primary'
      case 'geographic': return 'bg-secondary/10 text-secondary-foreground'
      case 'behavioral': return 'bg-accent/10 text-accent-foreground'
      case 'temporal': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const toggleRule = (rule: PersonalizationRule) => {
    track('personalization_rule_toggled', {
      rule_id: rule.id,
      rule_name: rule.name,
      enabled: !rule.active,
      category: rule.category,
      matched_users: rule.metrics.matchedUsers,
      toggled_by: user?.email,
      timestamp: new Date().toISOString(),
    })

    alert(`Personalization rule "${rule.name}" ${rule.active ? 'DISABLED' : 'ENABLED'}`)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-card-foreground">User Targeting & Personalization</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Customize user experience based on behavior, subscription, and demographics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{personalizationRules.filter(r => r.active).length}</div>
              <div className="text-sm text-muted-foreground">Active Rules</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {personalizationRules.reduce((sum, rule) => sum + rule.metrics.matchedUsers, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Users Targeted</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(personalizationRules.reduce((sum, rule) => sum + rule.metrics.conversionLift, 0) / personalizationRules.length).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg. Conversion Lift</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(personalizationRules.reduce((sum, rule) => sum + rule.metrics.engagementImprovement, 0) / personalizationRules.length).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg. Engagement Lift</div>
            </div>
          </div>

          {/* Personalization Rules */}
          {personalizationRules
            .sort((a, b) => a.priority - b.priority)
            .map((rule) => (
              <div key={rule.id} className="border border-border rounded-lg p-6">
                {/* Rule Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{rule.name}</h3>
                      <Badge className={getCategoryColor(rule.category)}>
                        {getCategoryIcon(rule.category)}
                        <span className="ml-1 capitalize">{rule.category}</span>
                      </Badge>
                      <Badge variant={rule.active ? 'default' : 'secondary'}>
                        {rule.active ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline">
                        Priority {rule.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={rule.active ? "destructive" : "default"}
                    onClick={() => toggleRule(rule)}
                  >
                    {rule.active ? 'Disable' : 'Enable'}
                  </Button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <div className="text-lg font-semibold">{rule.metrics.matchedUsers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Matched Users</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <div className="text-lg font-semibold text-green-600">+{rule.metrics.conversionLift}%</div>
                    <div className="text-xs text-muted-foreground">Conversion Lift</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <div className="text-lg font-semibold text-blue-600">+{rule.metrics.engagementImprovement}%</div>
                    <div className="text-xs text-muted-foreground">Engagement Lift</div>
                  </div>
                </div>

                {/* Targeting Conditions */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Targeting Conditions
                  </h4>
                  <div className="space-y-2">
                    {rule.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/20 rounded">
                        <Badge variant="outline" className="text-xs">
                          {condition.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-muted-foreground">{condition.operator.replace('_', ' ')}</span>
                        <span className="font-medium">
                          {Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{condition.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personalization Actions */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Personalization Actions
                  </h4>
                  <div className="space-y-2">
                    {rule.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded">
                        <Badge variant="outline" className="text-xs bg-blue-100">
                          {action.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-muted-foreground">{action.description}</span>
                      </div>
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

// Component for applying personalization rules
interface PersonalizationProps {
  children: React.ReactNode
  ruleId: string
  fallback?: React.ReactNode
}

export function PersonalizedContent({ children, ruleId, fallback = null }: PersonalizationProps) {
  const { user, profile } = useUser()
  const { track } = useAnalytics()
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (!user || !profile) return

    // Simulate personalization logic (in real app, this would call PostHog)
    const evaluatePersonalizationRule = () => {
      // This would contain the actual logic from PostHog feature flags and user properties
      // For demo purposes, we'll simulate some basic rules
      
      let matches = false

      switch (ruleId) {
        case 'enterprise_features':
          matches = profile.subscription_tier !== 'free' || profile.role === 'owner'
          break
        case 'new_user_onboarding':
          const signupDate = new Date(profile.created_at)
          const daysSinceSignup = (Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
          matches = daysSinceSignup <= 7
          break
        case 'power_user_features':
          matches = profile.role === 'admin' || profile.role === 'owner'
          break
        case 'geographic_compliance':
          // Simulated geographic check
          matches = Math.random() > 0.7 // 30% of users get this
          break
        case 'churn_prevention':
          const lastSeen = new Date(profile.updated_at || profile.created_at)
          const daysSinceLastSeen = (Date.now() - lastSeen.getTime()) / (1000 * 60 * 60 * 24)
          matches = daysSinceLastSeen > 7 && profile.subscription_tier !== 'free'
          break
        default:
          matches = false
      }

      setShouldShow(matches)

      // Track personalization exposure
      if (matches) {
        track('personalization_rule_applied', {
          rule_id: ruleId,
          user_id: user.id,
          subscription_tier: profile.subscription_tier,
          user_role: profile.role,
          timestamp: new Date().toISOString(),
        })
      }
    }

    evaluatePersonalizationRule()
  }, [user, profile, ruleId, track])

  if (shouldShow) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
