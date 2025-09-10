# TaskFlow - PostHog + Supabase Analytics Architecture

## Overview

This document outlines the implementation of PostHog analytics with Supabase authentication in the TaskFlow application, providing comprehensive user tracking, feature flags, session recording, and user feedback capabilities.

## Architecture Components

### 1. **Authentication & User Management (Supabase)**

#### Database Schema
```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'owner')),
  team_id UUID REFERENCES teams(id)
);

-- Teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id),
  subscription_tier TEXT DEFAULT 'free',
  member_count INTEGER DEFAULT 1
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  team_id UUID REFERENCES teams(id),
  owner_id UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  project_id UUID REFERENCES projects(id),
  assignee_id UUID REFERENCES auth.users(id),
  creator_id UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE
);
```

#### Client Configuration
- **File**: `lib/supabase.ts`
- **Purpose**: Supabase client setup with TypeScript types
- **Features**: Auth persistence, auto-refresh, session detection

### 2. **Analytics & Tracking (PostHog)**

#### Client Configuration
- **File**: `lib/posthog.ts`
- **Purpose**: PostHog initialization with privacy and performance settings
- **Features**: Session recording, event capture, feature flags

#### Key Settings:
```typescript
{
  capture_pageview: true,
  capture_pageleave: true,
  session_recording: {
    maskAllInputs: true,
    blockClass: 'ph-no-capture',
    collectFonts: true,
  },
  respect_dnt: true,
  secure_cookie: true,
  persistence: 'localStorage+cookie',
}
```

### 3. **Provider Architecture**

#### PostHog Provider
- **File**: `components/providers/posthog-provider.tsx`
- **Responsibilities**:
  - Initialize PostHog on app load
  - Identify users when authenticated
  - Set user properties from Supabase profile
  - Reset tracking on logout

#### Integration Flow:
1. User authenticates with Supabase
2. PostHog identifies user with Supabase user ID
3. User properties set from Supabase profile data
4. Analytics context available throughout app

### 4. **Hooks System**

#### Authentication Hook (`use-auth.ts`)
```typescript
const { user, profile, loading, signOut, refreshProfile } = useUser();
```
- Manages Supabase auth state
- Fetches user profile data
- Provides logout functionality
- Handles profile updates

#### Analytics Hook (`use-analytics.ts`)
```typescript
const {
  track,
  trackPageView,
  trackClick,
  trackFormSubmit,
  trackFeatureUsage,
  trackProjectAction,
  trackTaskAction,
} = useAnalytics();
```
- Centralized event tracking
- Automatic user context enrichment
- Predefined tracking methods
- Type-safe event properties

#### Feature Flags Hook (`use-feature-flags.ts`)
```typescript
const { isFeatureEnabled, features } = useFeatureFlags();
```
- Real-time feature flag evaluation
- Subscription-based feature gates
- Role-based access control
- Predefined feature checks

#### Surveys Hook (`use-surveys.ts`)
```typescript
const {
  showSurvey,
  surveys,
  trackSurveyResponse,
  shouldShowSurvey,
} = useSurveys();
```
- Survey display management
- Response tracking
- Targeting logic
- Predefined survey types

### 5. **Component System**

#### Feature Gates
- **FeatureFlag**: Show/hide based on PostHog flags
- **SubscriptionGate**: Control access by subscription tier
- **RoleGate**: Control access by user role

#### Analytics Components
- **PageViewTracker**: Automatic page view tracking
- **AnalyticsWrapper**: Event tracking wrapper
- **Analytics Examples**: Demo implementation

### 6. **Event Tracking Strategy**

#### Page Views
- Automatic tracking on route changes
- Mapped to readable page names
- Includes URL parameters and search queries

#### User Events
```typescript
// Project Management
trackProjectAction('create', projectId, { source: 'dashboard' })
trackProjectAction('complete', projectId, { duration_days: 30 })

// Task Management
trackTaskAction('assign', taskId, { assignee_role: 'developer' })
trackTaskAction('status_change', taskId, { from: 'todo', to: 'completed' })

// Feature Usage
trackFeatureUsage('advanced_analytics', { subscription_tier: 'pro' })
trackFeatureUsage('team_collaboration', { team_size: 5 })

// Navigation
trackNavigation('/dashboard', '/projects', { user_type: 'team_member' })
```

#### Form Tracking
```typescript
trackFormSubmit('project_creation', true, { 
  project_type: 'development',
  team_size: 3 
})
```

### 7. **Feature Flag Implementation**

#### Subscription-Based Features
```typescript
// Pro Features
advancedAnalytics: flag('advanced-analytics') && tier !== 'free'
unlimitedProjects: flag('unlimited-projects') && tier === 'enterprise'
customIntegrations: flag('custom-integrations') && tier !== 'free'

// Role-Based Features
teamManagement: flag('team-management') && (role === 'admin' || role === 'owner')
billingAccess: flag('billing-access') && (role === 'admin' || role === 'owner')
```

#### A/B Testing
```typescript
// UI Experiments
dashboardLayout: getFeatureFlag('dashboard-layout-experiment') // 'control' | 'variant_a' | 'variant_b'
onboardingFlow: getFeatureFlag('onboarding-flow-experiment') // 'current' | 'simplified'
```

### 8. **Session Recording & Privacy**

#### Privacy Controls
- Automatic input masking
- Sensitive data blocking with CSS classes
- GDPR compliance settings
- User consent management

#### Recording Strategy
- 10% sampling rate for performance
- Full recording for premium users
- Error-triggered recordings
- User journey analysis

### 9. **Survey Implementation**

#### Types of Surveys
1. **NPS (Net Promoter Score)**: Quarterly satisfaction
2. **Feature Feedback**: Post-feature usage
3. **Onboarding**: New user experience
4. **Churn Prevention**: Exit intent
5. **Product Satisfaction**: Regular check-ins

#### Targeting Logic
```typescript
shouldShowSurvey('nps-quarterly', {
  subscriptionTier: ['pro', 'enterprise'],
  daysSinceSignup: 30,
  lastSurveyDays: 90
})
```

## Implementation Guide

### 1. **Environment Setup**
```bash
# Install dependencies
npm install posthog-js @supabase/supabase-js

# Environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2. **Database Setup**
- Create Supabase project
- Run schema migrations
- Set up RLS policies
- Configure auth settings

### 3. **PostHog Setup**
- Create PostHog project (free tier)
- Configure feature flags
- Set up surveys
- Enable session recording

### 4. **Component Integration**
```typescript
// In your layout
<PostHogProvider>
  <PageViewTracker />
  {children}
</PostHogProvider>

// In components
const { track } = useAnalytics()
const { features } = useFeatureFlags()

// Track events
track('button_clicked', { location: 'header' })

// Use feature flags
{features.advancedAnalytics && <AdvancedChart />}
```

## Multi-User Considerations

### Automatic User Differentiation
- **Different Systems**: Each browser/device automatically gets unique PostHog ID
- **No Backend Required**: Client-side tracking handles multiple users
- **Vercel Deployment**: Static hosting sufficient for multi-user analytics

### User Identification Strategy
1. **Anonymous Users**: Automatic PostHog tracking
2. **Authenticated Users**: Link to Supabase user ID
3. **Cross-Device**: Maintain user identity across sessions
4. **Team Context**: Track team-level analytics

### Data Isolation
- User-specific analytics dashboards
- Team-level feature flags
- Privacy-compliant data handling
- GDPR/CCPA compliance ready

## Performance Considerations

### Client-Side Optimization
- Lazy loading of PostHog
- Event batching
- Local storage caching
- Minimal bundle impact

### Data Management
- Event sampling for high-volume actions
- Automatic data retention
- Privacy-first data collection
- GDPR compliance tools

## Monitoring & Analytics

### Key Metrics Tracked
1. **User Engagement**: Page views, session duration, feature usage
2. **Product Adoption**: Feature flags effectiveness, A/B test results
3. **User Journey**: Onboarding completion, conversion funnels
4. **Team Collaboration**: Project creation, task completion, team growth
5. **Subscription Metrics**: Upgrade conversion, churn prevention

### Dashboard Setup
- User behavior analysis
- Feature adoption rates
- A/B test performance
- Survey response analytics
- Session replay insights

This architecture provides a comprehensive, privacy-compliant, and scalable analytics solution for TaskFlow while maintaining excellent user experience and development productivity.