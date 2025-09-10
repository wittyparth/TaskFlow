'use client'

import { useFeatureFlags } from '@/hooks/use-feature-flags'
import { useAnalytics } from '@/hooks/use-analytics'
import { useUser } from '@/hooks/use-auth'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { AlertTriangle, Power, Shield, Users, Zap, TrendingUp } from 'lucide-react'

interface KillSwitchConfig {
  name: string
  flagKey: string
  description: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  affectedUsers: number
  category: 'payment' | 'ai' | 'ui' | 'performance' | 'security'
  lastToggled?: string
  toggledBy?: string
}

export function KillSwitchDashboard() {
  const { isFeatureEnabled, getFeatureFlag } = useFeatureFlags()
  const { track } = useAnalytics()
  const { user, profile } = useUser()

  // Only show to admins/owners
  if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
    return null
  }

  const killSwitches: KillSwitchConfig[] = [
    {
      name: 'Payment System',
      flagKey: 'kill_switch_payments',
      description: 'Disable all payment processing and redirect to maintenance page',
      riskLevel: 'critical',
      affectedUsers: 12453,
      category: 'payment',
    },
    {
      name: 'AI Assistant',
      flagKey: 'kill_switch_ai_assistant', 
      description: 'Disable AI features if generating inappropriate responses',
      riskLevel: 'high',
      affectedUsers: 8932,
      category: 'ai',
    },
    {
      name: 'New Dashboard',
      flagKey: 'kill_switch_new_dashboard',
      description: 'Revert all users to legacy dashboard interface',
      riskLevel: 'medium',
      affectedUsers: 15678,
      category: 'ui',
    },
    {
      name: 'Real-time Sync',
      flagKey: 'kill_switch_realtime_sync',
      description: 'Disable real-time collaboration features',
      riskLevel: 'medium',
      affectedUsers: 5432,
      category: 'performance',
    },
    {
      name: 'Email Notifications',
      flagKey: 'kill_switch_email_notifications',
      description: 'Stop all outbound email notifications',
      riskLevel: 'low',
      affectedUsers: 18765,
      category: 'security',
    },
  ]

  const toggleKillSwitch = (killSwitch: KillSwitchConfig, enabled: boolean) => {
    // In real app, this would call PostHog API to toggle the feature flag
    track('kill_switch_toggled', {
      flag_key: killSwitch.flagKey,
      feature_name: killSwitch.name,
      enabled: enabled,
      risk_level: killSwitch.riskLevel,
      affected_users: killSwitch.affectedUsers,
      category: killSwitch.category,
      toggled_by: user?.email,
      timestamp: new Date().toISOString(),
    })

    // Show confirmation for critical switches
    if (killSwitch.riskLevel === 'critical') {
      const confirmed = window.confirm(
        `⚠️ CRITICAL KILL SWITCH\n\nThis will ${enabled ? 'DISABLE' : 'ENABLE'} ${killSwitch.name} affecting ${killSwitch.affectedUsers.toLocaleString()} users.\n\nAre you sure?`
      )
      if (!confirmed) return
    }

    // Simulate API call delay
    setTimeout(() => {
      alert(`Kill switch "${killSwitch.name}" ${enabled ? 'ACTIVATED' : 'DEACTIVATED'}`)
    }, 500)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-primary/10 text-primary border-primary/20'
      case 'medium': return 'bg-secondary/10 text-secondary-foreground border-secondary/20'
      case 'high': return 'bg-accent/10 text-accent-foreground border-accent/20'
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return <Power className="w-4 h-4" />
      case 'ai': return <Zap className="w-4 h-4" />
      case 'ui': return <Users className="w-4 h-4" />
      case 'performance': return <TrendingUp className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <CardTitle className="text-card-foreground">Kill Switch Dashboard</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Emergency controls to instantly disable features in production
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {killSwitches.map((killSwitch) => {
          const isEnabled = isFeatureEnabled(killSwitch.flagKey)
          
          return (
            <div
              key={killSwitch.flagKey}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  {getCategoryIcon(killSwitch.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{killSwitch.name}</h4>
                    <Badge className={getRiskColor(killSwitch.riskLevel)}>
                      {killSwitch.riskLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {killSwitch.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>👥 {killSwitch.affectedUsers.toLocaleString()} users</span>
                    <span>📂 {killSwitch.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {isEnabled ? (
                      <span className="text-red-600">🔴 DISABLED</span>
                    ) : (
                      <span className="text-green-600">🟢 ACTIVE</span>
                    )}
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => toggleKillSwitch(killSwitch, checked)}
                />
              </div>
            </div>
          )
        })}
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Safety Information</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Kill switches take effect immediately for new requests</li>
            <li>• Critical switches require confirmation before activation</li>
            <li>• All toggles are logged and tracked with user attribution</li>
            <li>• Active kill switches are monitored 24/7</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Individual Kill Switch Component
interface KillSwitchProps {
  flagKey: string
  children: React.ReactNode
  fallback?: React.ReactNode
  gracefulDegradation?: React.ReactNode
}

export function KillSwitch({ flagKey, children, fallback = null, gracefulDegradation }: KillSwitchProps) {
  const { isFeatureEnabled } = useFeatureFlags()
  const { track } = useAnalytics()

  const isKilled = isFeatureEnabled(flagKey)

  useEffect(() => {
    if (isKilled) {
      track('feature_killed', {
        kill_switch_key: flagKey,
        timestamp: new Date().toISOString(),
      })
    }
  }, [isKilled, flagKey])

  if (isKilled) {
    // Show graceful degradation if provided, otherwise fallback
    return <>{gracefulDegradation || fallback}</>
  }

  return <>{children}</>
}
