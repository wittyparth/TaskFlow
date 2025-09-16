'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Zap, Shield, Star, Check, X } from 'lucide-react'
import { upgradeUserSubscription, downgradeUser, trackUpgradePromptView, canUpgradeTo, getTierBenefits } from '@/lib/billing'
import { useUser } from '@/hooks/use-auth'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UpgradeButtonProps {
  showAllOptions?: boolean
  compact?: boolean
  location?: string
}

export function UpgradeButton({ showAllOptions = true, compact = false, location = 'dashboard' }: UpgradeButtonProps) {
  const { user, profile, refreshProfile } = useUser()
  const [loading, setLoading] = useState(false)
  const [currentTier, setCurrentTier] = useState<string>('free')

  useEffect(() => {
    if (profile?.subscription_tier) {
      setCurrentTier(profile.subscription_tier)
    }
  }, [profile])

  useEffect(() => {
    // Track that user saw upgrade options
    if (profile) {
      trackUpgradePromptView(location, profile.subscription_tier || 'free')
    }
  }, [profile, location])

  const handleUpgrade = async (tier: 'pro' | 'enterprise') => {
    if (!user) return
    
    setLoading(true)
    try {
      const result = await upgradeUserSubscription(user.id, tier)
      
      if (result.success) {
        // Refresh the auth state to get updated profile
        await refreshProfile()
        setCurrentTier(tier)
        
        // Show success message
        alert(`🎉 Successfully upgraded to ${tier.toUpperCase()}! New features are now available.`)
      } else {
        alert('❌ Upgrade failed. Please try again.')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('❌ Upgrade failed. Please try again.')
    }
    setLoading(false)
  }

  const handleDowngrade = async (targetTier: 'free' | 'pro' = 'free') => {
    if (!user) return
    
    const tierNames = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' }
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to switch to ${tierNames[targetTier]}? ${
        targetTier === 'free' 
          ? 'You\'ll lose access to all premium features immediately.' 
          : 'Some features may no longer be available.'
      }`
    )
    
    if (!confirmed) return
    
    setLoading(true)
    
    try {
      let result
      if (targetTier === 'free') {
        result = await downgradeUser(user.id)
      } else {
        // Downgrade to Pro from Enterprise
        result = await upgradeUserSubscription(user.id, targetTier)
      }
      
      if (result.success) {
        // Refresh the auth state to get updated profile
        await refreshProfile()
        setCurrentTier(targetTier)
        
        alert(`✅ Successfully switched to ${tierNames[targetTier]} tier.`)
      } else {
        alert('❌ Subscription change failed. Please try again.')
      }
    } catch (error) {
      console.error('Downgrade error:', error)
      alert('❌ Subscription change failed. Please try again.')
    }
    setLoading(false)
  }

  if (!profile) {
    return null
  }

  // Compact version for smaller spaces
  if (compact) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">Current Plan:</span>
              <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                {currentTier.toUpperCase()}
              </Badge>
            </div>
            <div className="flex gap-2">
              {currentTier === 'free' && (
                <Button 
                  onClick={() => handleUpgrade('pro')} 
                  disabled={loading}
                  size="sm"
                  className="text-xs"
                >
                  Upgrade to Pro
                </Button>
              )}
              <Button asChild variant="outline" size="sm" className="text-xs">
                <Link href="/subscription">
                  Manage
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl text-card-foreground">
              {currentTier === 'free' ? 'Upgrade Your Account' : 'Manage Subscription'}
            </CardTitle>
          </div>
          <Badge 
            variant={currentTier === 'free' ? 'secondary' : 'default'}
            className={`${
              currentTier === 'free' 
                ? 'bg-muted text-muted-foreground' 
                : 'bg-primary text-primary-foreground'
            }`}
          >
            Current: {currentTier.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Benefits */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-card-foreground">
            <Check className="w-4 h-4 text-primary" />
            Your Current Benefits ({currentTier.toUpperCase()})
          </h4>
          <ul className="text-sm space-y-1">
            {getTierBenefits(currentTier as 'free' | 'pro' | 'enterprise').map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-muted-foreground">
                <Check className="w-3 h-3 text-primary flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* All Subscription Options */}
        {showAllOptions && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Free Plan */}
            <div className={`p-4 border rounded-lg transition-colors ${
              currentTier === 'free' 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-card hover:bg-accent/5'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-lg text-card-foreground">Free</h4>
                  {currentTier === 'free' && (
                    <Badge variant="default" className="text-xs">Current</Badge>
                  )}
                </div>
                <Badge variant="secondary" className="text-sm">$0/month</Badge>
              </div>
              
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  Basic dashboard access
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  Up to 3 projects
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  Community support
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <X className="w-3 h-3 text-muted-foreground" />
                  <span className="line-through">Advanced analytics</span>
                </li>
              </ul>
              
              {currentTier !== 'free' && (
                <Button 
                  onClick={() => handleDowngrade('free')} 
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? 'Processing...' : 'Switch to Free'}
                </Button>
              )}
              {currentTier === 'free' && (
                <Button variant="secondary" disabled className="w-full">
                  Current Plan
                </Button>
              )}
            </div>

            {/* Pro Plan */}
            <div className={`p-4 border rounded-lg transition-colors ${
              currentTier === 'pro' 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-card hover:bg-accent/5'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-lg text-card-foreground">Pro</h4>
                  {currentTier === 'pro' && (
                    <Badge variant="default" className="text-xs">Current</Badge>
                  )}
                </div>
                <Badge variant="secondary" className="text-sm">$29/month</Badge>
              </div>
              
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  Everything in Free
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  Advanced Analytics
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  Team Collaboration
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  A/B Testing
                </li>
              </ul>
              
              {currentTier === 'free' && (
                <Button 
                  onClick={() => handleUpgrade('pro')} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Upgrading...' : 'Upgrade to Pro'}
                </Button>
              )}
              {currentTier === 'enterprise' && (
                <Button 
                  onClick={() => handleDowngrade('pro')} 
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? 'Processing...' : 'Downgrade to Pro'}
                </Button>
              )}
              {currentTier === 'pro' && (
                <Button variant="secondary" disabled className="w-full">
                  Current Plan
                </Button>
              )}
            </div>

            {/* Enterprise Plan */}
            <div className={`p-4 border rounded-lg transition-colors ${
              currentTier === 'enterprise' 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-card hover:bg-accent/5'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-lg text-card-foreground">Enterprise</h4>
                  {currentTier === 'enterprise' && (
                    <Badge variant="default" className="text-xs">Current</Badge>
                  )}
                </div>
                <Badge variant="secondary" className="text-sm">$99/month</Badge>
              </div>
              
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  SSO Integration
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  Advanced Security
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  Dedicated Support
                </li>
              </ul>
              
              {currentTier !== 'enterprise' && (
                <Button 
                  onClick={() => handleUpgrade('enterprise')} 
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? 'Upgrading...' : 'Upgrade to Enterprise'}
                </Button>
              )}
              {currentTier === 'enterprise' && (
                <Button variant="secondary" disabled className="w-full">
                  Current Plan
                </Button>
              )}
            </div>
          </div>
        )}



        {/* Success Message for Upgraded Users */}
        {currentTier !== 'free' && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-primary">
              <Check className="w-4 h-4" />
              <span className="font-medium">You're all set!</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All {currentTier} features are now active. Explore your enhanced dashboard!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
