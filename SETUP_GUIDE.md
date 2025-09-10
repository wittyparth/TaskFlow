# PostHog + Supabase Implementation Guide

## Quick Setup

### 1. Environment Configuration

Update your `.env.local` file with your actual credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PostHog Configuration  
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase Setup

#### Create Database Tables
Run this SQL in your Supabase SQL editor:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
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

-- Create teams table
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

-- Create projects table
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

-- Create tasks table
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

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 3. PostHog Setup

1. **Create PostHog Account**: Go to [PostHog Cloud](https://app.posthog.com) and create a free account
2. **Get API Key**: Copy your Project API Key from PostHog settings
3. **Configure Features**:
   - Enable Session Recording
   - Set up Feature Flags
   - Create Surveys

### 4. Using the Implementation

#### Basic Analytics Tracking
```typescript
import { useAnalytics } from '@/hooks/use-analytics'

function MyComponent() {
  const { track, trackClick } = useAnalytics()

  const handleButtonClick = () => {
    track('button_clicked', {
      button_name: 'create_project',
      location: 'dashboard'
    })
  }

  return <button onClick={handleButtonClick}>Create Project</button>
}
```

#### Feature Flags
```typescript
import { useFeatureFlags } from '@/hooks/use-feature-flags'

function Dashboard() {
  const { features } = useFeatureFlags()

  return (
    <div>
      {features.advancedAnalytics && (
        <AdvancedAnalyticsPanel />
      )}
      
      {features.aiAssistant && (
        <AIAssistantWidget />
      )}
    </div>
  )
}
```

#### Subscription Gates
```typescript
import { SubscriptionGate } from '@/components/feature-flags/feature-gate'
import { useUser } from '@/hooks/use-auth'

function PremiumFeatures() {
  const { profile } = useUser()

  return (
    <SubscriptionGate 
      tier="pro" 
      currentTier={profile?.subscription_tier || 'free'}
      fallback={<UpgradePrompt />}
    >
      <PremiumContent />
    </SubscriptionGate>
  )
}
```

#### Surveys
```typescript
import { useSurveys } from '@/hooks/use-surveys'

function UserFeedback() {
  const { surveys } = useSurveys()

  return (
    <div>
      <button onClick={surveys.showNPSSurvey}>
        Rate Your Experience
      </button>
      
      <button onClick={() => surveys.showFeatureFeedback('dashboard')}>
        Give Feedback
      </button>
    </div>
  )
}
```

### 5. Testing the Implementation

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Check PostHog Console**: In browser dev tools, you should see PostHog initialization logs

3. **Verify Event Tracking**: Events should appear in your PostHog dashboard

4. **Test Feature Flags**: Create flags in PostHog and test them in your app

## PostHog Dashboard Configuration

### Feature Flags to Create
1. `advanced-analytics` - Boolean flag for pro features
2. `ai-assistant` - Boolean flag for AI features  
3. `task-automation` - Boolean flag for automation
4. `team-management` - Boolean flag for admin features
5. `dashboard-layout-experiment` - Multivariate flag (control/variant_a/variant_b)

### Surveys to Create
1. **NPS Survey** - ID: `nps-quarterly`
2. **Feature Feedback** - ID: `feature-feedback`
3. **Onboarding Survey** - ID: `onboarding-feedback`
4. **Churn Prevention** - ID: `churn-prevention`

### Session Recording Settings
- Enable session recording
- Set appropriate sampling rate (10% recommended)
- Configure privacy settings for sensitive data

## Multi-User Considerations

✅ **Your setup automatically supports multiple users:**

- **Different browsers/devices** = Different users automatically
- **No additional backend needed** for user differentiation
- **Vercel deployment** works perfectly for this setup
- **PostHog handles** user identification and tracking
- **Supabase provides** authentication and user data

Each person accessing your app from different systems will be tracked as separate users, and when they authenticate, PostHog will identify them properly with Supabase user data.

## Next Steps

1. Set up your Supabase project and database
2. Create PostHog account and configure features
3. Add your environment variables
4. Test the implementation with the example components
5. Start tracking real user events in your app
6. Monitor analytics in PostHog dashboard

Your TaskFlow app now has comprehensive analytics, feature flags, session recording, and user feedback capabilities!
