# 🚀 Complete PostHog Feature Flags Setup

## 📝 **EXACT FLAGS TO CREATE IN POSTHOG DASHBOARD**

### **1. Basic Feature Flags (Create These First)**
Go to PostHog → Feature Flags → New Feature Flag

```
Flag Key: advanced_analytics
Name: Advanced Analytics
Description: Show advanced analytics to Pro+ users
Type: Boolean
Default: false
Release Condition: 100% of users (so you can control who sees it)
```

```
Flag Key: ai_assistant  
Name: AI Assistant
Description: Beta AI features for power users
Type: Boolean
Default: false
Release Condition: 50% of users
```

```
Flag Key: new_dashboard
Name: New Dashboard
Description: Updated dashboard design
Type: Boolean
Default: true
Release Condition: 100% of users
```

```
Flag Key: team_collaboration
Name: Team Collaboration
Description: Advanced team features
Type: Boolean
Default: false
Release Condition: 75% of users
```

### **2. Kill Switch Flags (Critical Safety)**

```
Flag Key: kill_payment_system
Name: Kill Payment System
Description: Emergency disable payment processing
Type: Boolean
Default: false (false = payment works, true = payment killed)
Release Condition: 100% of users
```

```
Flag Key: kill_ai_features
Name: Kill AI Features  
Description: Emergency disable AI assistant
Type: Boolean
Default: false (false = AI works, true = AI killed)
Release Condition: 100% of users
```

### **3. Gradual Rollout Flags**

```
Flag Key: new_checkout_flow
Name: New Checkout Flow
Description: Improved checkout experience
Type: Boolean
Default: false
Release Condition: Percentage rollout (start with 5%)
```

### **4. User Targeting Flags (Advanced)**

```
Flag Key: enterprise_features
Name: Enterprise Features
Description: Show enterprise tools to eligible users
Type: Boolean
Default: false
Release Condition: Custom property filters:
- subscription_tier equals pro OR enterprise
```

```
Flag Key: beta_program_access
Name: Beta Program Access
Description: Early access to new features
Type: Boolean
Default: false
Release Condition: Custom property filters:
- role equals admin OR owner
- AND subscription_tier not equals free
```

---

## 👤 **USER UPGRADE SYSTEM**

### **Step 1: Add Upgrade Functions to Your Code**

Create a new file: `lib/billing.ts`

```typescript
import { supabase } from './supabase'
import { useAnalytics } from '@/hooks/use-analytics'

export async function upgradeUserSubscription(
  userId: string, 
  newTier: 'pro' | 'enterprise'
) {
  const { track } = useAnalytics()
  
  try {
    // Update user in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        subscription_tier: newTier,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    // Update PostHog user properties
    posthog.identify(userId, {
      subscription_tier: newTier,
      upgrade_date: new Date().toISOString(),
      previous_tier: 'free' // track what they upgraded from
    })

    // Track upgrade event
    track('subscription_upgraded', {
      from_tier: 'free',
      to_tier: newTier,
      upgrade_date: new Date().toISOString(),
      user_id: userId
    })

    return { success: true, data }
  } catch (error) {
    console.error('Upgrade failed:', error)
    return { success: false, error }
  }
}

export async function downgradeUser(userId: string) {
  const { track } = useAnalytics()
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        subscription_tier: 'free',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error

    // Update PostHog
    posthog.identify(userId, {
      subscription_tier: 'free',
      downgrade_date: new Date().toISOString()
    })

    // Track downgrade
    track('subscription_downgraded', {
      to_tier: 'free',
      downgrade_date: new Date().toISOString(),
      user_id: userId
    })

    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}
```

### **Step 2: Create Upgrade Components**

Create: `components/upgrade-button.tsx`

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Zap, Shield } from 'lucide-react'
import { upgradeUserSubscription } from '@/lib/billing'
import { useUser } from '@/hooks/use-auth'
import { useState } from 'react'

export function UpgradeButton() {
  const { user, profile } = useUser()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async (tier: 'pro' | 'enterprise') => {
    if (!user) return
    
    setLoading(true)
    const result = await upgradeUserSubscription(user.id, tier)
    
    if (result.success) {
      alert(`Successfully upgraded to ${tier.toUpperCase()}!`)
      window.location.reload() // Refresh to show new features
    } else {
      alert('Upgrade failed. Please try again.')
    }
    setLoading(false)
  }

  if (!profile || profile.subscription_tier !== 'free') {
    return null // Don't show if already upgraded
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-600" />
          <CardTitle>Upgrade Your Account</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pro Upgrade */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold">Pro Plan</h4>
              <Badge className="bg-blue-100 text-blue-800">$29/month</Badge>
            </div>
            <ul className="text-sm space-y-1 mb-3">
              <li>✅ Advanced Analytics</li>
              <li>✅ Team Collaboration</li>
              <li>✅ Priority Support</li>
              <li>✅ API Access</li>
            </ul>
            <Button 
              onClick={() => handleUpgrade('pro')} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Upgrading...' : 'Upgrade to Pro'}
            </Button>
          </div>

          {/* Enterprise Upgrade */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <h4 className="font-semibold">Enterprise Plan</h4>
              <Badge className="bg-purple-100 text-purple-800">$99/month</Badge>
            </div>
            <ul className="text-sm space-y-1 mb-3">
              <li>✅ Everything in Pro</li>
              <li>✅ SSO Integration</li>
              <li>✅ Advanced Security</li>
              <li>✅ Custom Analytics</li>
            </ul>
            <Button 
              onClick={() => handleUpgrade('enterprise')} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Upgrading...' : 'Upgrade to Enterprise'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### **Step 3: Add Upgrade Button to Dashboard**

Add this to your dashboard page:

```typescript
// In your dashboard page, add this import
import { UpgradeButton } from '@/components/upgrade-button'

// Add this component before your existing cards
{profile?.subscription_tier === 'free' && <UpgradeButton />}
```

---

## 🔧 **POSTHOG USER PROPERTIES SETUP**

### **Step 1: Set User Properties on Login**

In your auth system, after user logs in:

```javascript
// When user signs in (add to your login function)
posthog.identify(user.id, {
  email: user.email,
  subscription_tier: profile.subscription_tier, // 'free', 'pro', 'enterprise'
  role: profile.role, // 'user', 'admin', 'owner'
  team_id: profile.team_id,
  signup_date: profile.created_at,
  last_login: new Date().toISOString()
})
```

### **Step 2: Track Important Events**

```javascript
// Track when users view upgrade options
posthog.capture('upgrade_prompt_viewed', {
  current_tier: 'free',
  prompt_location: 'dashboard'
})

// Track successful upgrades
posthog.capture('subscription_upgraded', {
  from_tier: 'free',
  to_tier: 'pro',
  payment_method: 'credit_card'
})

// Track feature usage
posthog.capture('feature_used', {
  feature_name: 'advanced_analytics',
  subscription_tier: 'pro',
  usage_count: 1
})
```

---

## 📊 **FEATURE FLAG CONDITIONS IN POSTHOG**

### **For Subscription-Based Features:**

1. **Go to your flag** (e.g., `advanced_analytics`)
2. **Edit Release Conditions**
3. **Add property filter:**
   - Property: `subscription_tier`
   - Operator: `equals`
   - Value: `pro` OR add another condition for `enterprise`

### **For Role-Based Features:**

1. **Property:** `role`
2. **Operator:** `equals` 
3. **Value:** `admin` OR `owner`

### **For Team Size Features:**

1. **Property:** `team_size`
2. **Operator:** `greater than`
3. **Value:** `5`

---

## ✅ **QUICK SETUP CHECKLIST**

### **PostHog Dashboard (15 minutes):**
- [ ] Create 8 feature flags (copy exact names above)
- [ ] Set up user property conditions
- [ ] Test flags with different user properties

### **Code Integration (10 minutes):**
- [ ] Add upgrade functions (`lib/billing.ts`)
- [ ] Create upgrade button component
- [ ] Add upgrade button to dashboard
- [ ] Set user properties on login

### **Testing (5 minutes):**
- [ ] Test upgrade from free → pro
- [ ] Verify flags show/hide correctly
- [ ] Check PostHog events are tracked

---

## 🧪 **TEST YOUR SETUP**

### **1. Test Feature Flags:**
```bash
# In browser console
posthog.featureFlags.isFeatureEnabled('advanced_analytics')
```

### **2. Test User Properties:**
```bash
# Check current user properties
posthog.get_distinct_id()
posthog.get_property('subscription_tier')
```

### **3. Simulate Upgrade:**
```bash
# Manually set pro tier to test
posthog.identify('test-user', { subscription_tier: 'pro' })
# Refresh page - you should see pro features
```

This setup gives you complete control over who sees what features based on their subscription tier, role, and behavior!
