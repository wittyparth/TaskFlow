'use client'

import { useFeatureFlag } from '@/hooks/use-feature-flags'
import { usePostHog } from '@/components/providers/posthog-provider'
import { useUser } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { AlertTriangle, Power, Shield } from 'lucide-react'

export function KillSwitchDemo() {
  const { user } = useUser()
  const posthog = usePostHog()
  
  // Real PostHog kill switch feature flags
  const paymentSystemEnabled = useFeatureFlag('payment_system_kill_switch')
  const aiFeaturesEnabled = useFeatureFlag('ai_features_kill_switch') 
  const socialFeaturesEnabled = useFeatureFlag('social_features_kill_switch')
  const dataExportEnabled = useFeatureFlag('data_export_kill_switch')

  if (!user) return null

  const killSwitches = [
    {
      name: 'Payment System',
      flagKey: 'payment_system_kill_switch',
      enabled: paymentSystemEnabled,
      description: 'Emergency disable payment processing',
      riskLevel: 'critical',
      affectedUsers: paymentSystemEnabled ? 0 : 12453,
    },
    {
      name: 'AI Features', 
      flagKey: 'ai_features_kill_switch',
      enabled: aiFeaturesEnabled,
      description: 'Disable AI-powered features',
      riskLevel: 'high',
      affectedUsers: aiFeaturesEnabled ? 0 : 8932,
    },
    {
      name: 'Social Features',
      flagKey: 'social_features_kill_switch', 
      enabled: socialFeaturesEnabled,
      description: 'Disable social sharing and collaboration',
      riskLevel: 'medium',
      affectedUsers: socialFeaturesEnabled ? 0 : 6745,
    },
    {
      name: 'Data Export',
      flagKey: 'data_export_kill_switch',
      enabled: dataExportEnabled, 
      description: 'Emergency disable data export functionality',
      riskLevel: 'high',
      affectedUsers: dataExportEnabled ? 0 : 3421,
    },
  ]

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive'
      case 'high': return 'secondary'
      case 'medium': return 'outline'
      default: return 'default'
    }
  }

  const toggleKillSwitch = (flagKey: string, currentState: boolean) => {
    if (posthog) {
      posthog.capture('kill_switch_toggled', {
        flag_key: flagKey,
        new_state: !currentState,
        user_id: user?.id,
      })
    }
    
    alert(`🚨 Kill switch "${flagKey}" would be ${!currentState ? 'ENABLED' : 'DISABLED'}!\n\nIn production, this would toggle the PostHog feature flag.`)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <CardTitle className="text-card-foreground">Emergency Kill Switches</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Instantly disable critical features during emergencies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {killSwitches.map((killSwitch) => (
          <div key={killSwitch.flagKey} className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-card-foreground">{killSwitch.name}</h4>
                <Badge variant={getRiskColor(killSwitch.riskLevel) as any}>
                  {killSwitch.riskLevel}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{killSwitch.description}</p>
              <div className="text-xs text-muted-foreground">
                Affected users: {killSwitch.affectedUsers.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-sm font-medium ${killSwitch.enabled ? 'text-green-600' : 'text-red-600'}`}>
                  {killSwitch.enabled ? 'OPERATIONAL' : 'DISABLED'}
                </div>
              </div>
              <Button
                variant={killSwitch.enabled ? "destructive" : "default"}
                size="sm"
                onClick={() => toggleKillSwitch(killSwitch.flagKey, killSwitch.enabled)}
              >
                {killSwitch.enabled ? (
                  <>
                    <Power className="w-4 h-4 mr-2" />
                    Disable
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Enable
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
