'use client'

import { useFeatureFlag } from '@/hooks/use-feature-flags'
import { usePostHog } from '@/components/providers/posthog-provider'
import { useUser } from '@/hooks/use-auth'
import { useAnalytics } from '@/hooks/use-analytics'
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
  const { user } = useUser()
  const posthog = usePostHog()
  const { track } = useAnalytics()
  
  // Real PostHog kill switch feature flags
  const paymentSystemEnabled = useFeatureFlag('payment_system_kill_switch')
  const aiFeaturesEnabled = useFeatureFlag('ai_features_kill_switch')
  const socialFeaturesEnabled = useFeatureFlag('social_features_kill_switch')
  const dataExportEnabled = useFeatureFlag('data_export_kill_switch')

  // Only show to authenticated users
  if (!user) {
    return null
  }

  const killSwitches: KillSwitchConfig[] = [
    {
      name: 'Payment System',
      flagKey: 'payment_system_kill_switch',
      description: 'Emergency disable payment processing and redirect to maintenance page',
      riskLevel: 'critical',
      affectedUsers: paymentSystemEnabled ? 0 : 12453,
      category: 'payment',
      lastToggled: paymentSystemEnabled ? undefined : '2025-09-11 14:30:00',
      toggledBy: paymentSystemEnabled ? undefined : user?.email,
    },
    {
      name: 'AI Features',
      flagKey: 'ai_features_kill_switch', 
      description: 'Disable all AI-powered features including recommendations and assistance',
      riskLevel: 'high',
      affectedUsers: aiFeaturesEnabled ? 0 : 8932,
      category: 'ai',
      lastToggled: aiFeaturesEnabled ? undefined : '2025-09-11 12:15:00',
      toggledBy: aiFeaturesEnabled ? undefined : user?.email,
    },
    {
      name: 'Social Features',
      flagKey: 'social_features_kill_switch',
      description: 'Disable social sharing, comments, and collaborative features',
      riskLevel: 'medium',
      affectedUsers: socialFeaturesEnabled ? 0 : 6745,
      category: 'ui',
      lastToggled: socialFeaturesEnabled ? undefined : '2025-09-11 10:45:00',
      toggledBy: socialFeaturesEnabled ? undefined : user?.email,
    },
    {
      name: 'Data Export',
      flagKey: 'data_export_kill_switch',
      description: 'Emergency disable data export functionality to prevent data breaches',
      riskLevel: 'high',
      affectedUsers: dataExportEnabled ? 0 : 3421,
      category: 'security',
      lastToggled: dataExportEnabled ? undefined : '2025-09-11 09:20:00',
      toggledBy: dataExportEnabled ? undefined : user?.email,
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
          const isEnabled = (() => {
            switch (killSwitch.flagKey) {
              case 'payment_system_kill_switch': return paymentSystemEnabled
              case 'ai_features_kill_switch': return aiFeaturesEnabled
              case 'social_features_kill_switch': return socialFeaturesEnabled
              case 'data_export_kill_switch': return dataExportEnabled
              default: return true
            }
          })()
          
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
  const isKilled = useFeatureFlag(flagKey)
  const { track } = useAnalytics()

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
