'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useFeatureFlags } from "@/hooks/use-feature-flags"
import { CheckCircle, XCircle, AlertCircle, User } from "lucide-react"

export function DebugPanel() {
  const { user, profile, loading, isAuthenticated } = useAuth()
  const { isFeatureEnabled } = useFeatureFlags()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-96 overflow-y-auto bg-background border rounded-lg shadow-lg z-50">
      <Card className="border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4" />
            Debug Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Auth Status */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">Auth Status</span>
              {isAuthenticated ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
            </div>
            <div className="space-y-1 text-muted-foreground">
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
              <div>User ID: {user?.id?.slice(0, 8)}...</div>
              <div>Email: {user?.email}</div>
              <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Profile Info */}
          {profile && (
            <div>
              <div className="font-medium mb-1">Profile</div>
              <div className="space-y-1 text-muted-foreground">
                <div>Tier: 
                  <Badge variant="outline" className="ml-1 text-xs">
                    {profile.subscription_tier || 'unknown'}
                  </Badge>
                </div>
                <div>Role: 
                  <Badge variant="outline" className="ml-1 text-xs">
                    {profile.role || 'unknown'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Feature Flags */}
          <div>
            <div className="font-medium mb-1">Feature Flags</div>
            <div className="space-y-1">
              {[
                'advanced-analytics',
                'team-management', 
                'advanced-search',
                'notifications',
                'ai-assistant'
              ].map(flag => {
                const enabled = isFeatureEnabled(flag)
                return (
                  <div key={flag} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{flag}</span>
                    {enabled ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Access Check */}
          <div>
            <div className="font-medium mb-1">Access Check</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Analytics (Pro)</span>
                {profile?.subscription_tier !== 'free' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Team (Pro)</span>
                {profile?.subscription_tier !== 'free' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Current tier: <strong>{profile?.subscription_tier || 'unknown'}</strong>
              <br />
              Should see Analytics: <strong>{profile?.subscription_tier !== 'free' ? 'YES' : 'NO'}</strong>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}