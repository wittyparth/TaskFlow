'use client'

import { useUser } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UpgradeButton } from '@/components/upgrade-button'
import { 
  Crown, 
  CheckCircle, 
  Clock,
  Users,
  Zap,
  Shield,
  ArrowLeft,
  Calendar,
  CreditCard,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionPage() {
  const { user, profile } = useUser()

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please sign in to manage your subscription</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentTier = profile.subscription_tier || 'free'

  // Mock subscription data
  const subscriptionData = {
    free: {
      name: 'Free Plan',
      price: '$0',
      period: 'forever',
      nextBilling: null,
      usage: {
        projects: { current: 2, limit: 3 },
        teamMembers: { current: 1, limit: 1 },
        storage: { current: 0.5, limit: 1 }
      }
    },
    pro: {
      name: 'Pro Plan',
      price: '$29',
      period: 'month',
      nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      usage: {
        projects: { current: 8, limit: 50 },
        teamMembers: { current: 5, limit: 10 },
        storage: { current: 12.3, limit: 50 }
      }
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: '$99',
      period: 'month',
      nextBilling: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
      usage: {
        projects: { current: 23, limit: 500 },
        teamMembers: { current: 15, limit: 100 },
        storage: { current: 156.7, limit: 1000 }
      }
    }
  }

  const currentSubscription = subscriptionData[currentTier as keyof typeof subscriptionData]

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-destructive'
    if (percentage >= 75) return 'text-secondary-foreground'
    return 'text-primary'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">Subscription Management</h1>
          <p className="text-muted-foreground">Manage your subscription and billing settings</p>
        </div>
        <Badge variant="default" className="bg-primary text-primary-foreground">
          <Crown className="w-3 h-3 mr-1" />
          {currentTier.toUpperCase()}
        </Badge>
      </div>

      {/* Current Subscription Overview */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Current Subscription
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your current plan and billing information
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-card-foreground">
                {currentSubscription.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /{currentSubscription.period}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">{currentSubscription.name}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSubscription.nextBilling && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Next billing date: {formatDate(currentSubscription.nextBilling)}</span>
            </div>
          )}

          {/* Usage Statistics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-card-foreground">Usage & Limits</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Projects Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">Projects</span>
                  <span className="text-sm text-muted-foreground">
                    {currentSubscription.usage.projects.current} / {currentSubscription.usage.projects.limit}
                  </span>
                </div>
                <Progress 
                  value={(currentSubscription.usage.projects.current / currentSubscription.usage.projects.limit) * 100} 
                  className="h-2"
                />
              </div>

              {/* Team Members Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">Team Members</span>
                  <span className="text-sm text-muted-foreground">
                    {currentSubscription.usage.teamMembers.current} / {currentSubscription.usage.teamMembers.limit}
                  </span>
                </div>
                <Progress 
                  value={(currentSubscription.usage.teamMembers.current / currentSubscription.usage.teamMembers.limit) * 100} 
                  className="h-2"
                />
              </div>

              {/* Storage Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">Storage (GB)</span>
                  <span className="text-sm text-muted-foreground">
                    {currentSubscription.usage.storage.current} / {currentSubscription.usage.storage.limit}
                  </span>
                </div>
                <Progress 
                  value={(currentSubscription.usage.storage.current / currentSubscription.usage.storage.limit) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Options */}
      <UpgradeButton showAllOptions={true} location="subscription_page" />

      {/* Billing History */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Billing History
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your recent billing transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentTier !== 'free' ? (
              <>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                  <div>
                    <div className="font-medium text-card-foreground">{currentSubscription.name}</div>
                    <div className="text-sm text-muted-foreground">September 10, 2025</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-card-foreground">{currentSubscription.price}</div>
                    <Badge variant="default" className="text-xs bg-primary/10 text-primary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Paid
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                  <div>
                    <div className="font-medium text-card-foreground">{currentSubscription.name}</div>
                    <div className="text-sm text-muted-foreground">August 10, 2025</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-card-foreground">{currentSubscription.price}</div>
                    <Badge variant="default" className="text-xs bg-primary/10 text-primary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Paid
                    </Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">No billing history available</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Upgrade to a paid plan to see billing transactions
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Account Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your account and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Account Settings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Management
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
