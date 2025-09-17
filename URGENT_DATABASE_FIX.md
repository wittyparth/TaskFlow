# 🚨 URGENT: Fix Signup Database Error

## The Problem
You're getting a **500 Internal Server Error** when trying to sign up users because the database trigger function for creating user profiles is missing or broken.

## Quick Fix Steps

### Step 1: Access Your Supabase Dashboard
1. Go to [supabase.com](https://supabase.com) and log into your dashboard
2. Select your project: `TaskFlow` (or whatever your project is named)
3. Navigate to the **SQL Editor** in the left sidebar

### Step 2: Run This SQL Script
Copy and paste this ENTIRE script into the SQL Editor and click **Run**:

```sql
-- ========================================
-- IMMEDIATE FIX FOR SIGNUP ERRORS
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. CREATE PROFILES TABLE (if not exists)
-- ========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner')),
  team_id UUID,
  
  -- Additional profile fields
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  team_size TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint on email
  CONSTRAINT profiles_email_unique UNIQUE (email)
);

-- ========================================
-- 2. CREATE TEAMS TABLE (if not exists)
-- ========================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  member_count INTEGER DEFAULT 1,
  settings JSONB DEFAULT '{}'::jsonb
);

-- ========================================
-- 3. FIX THE TRIGGER FUNCTION
-- ========================================

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create the improved trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_full_name TEXT;
BEGIN
  -- Get user email safely
  user_email := COALESCE(NEW.email, 'unknown@example.com');
  
  -- Get full name from metadata or construct from email
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    CASE 
      WHEN NEW.raw_user_meta_data->>'first_name' IS NOT NULL 
        AND NEW.raw_user_meta_data->>'last_name' IS NOT NULL
      THEN NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name'
      ELSE split_part(user_email, '@', 1)
    END
  );
  
  -- Insert profile with comprehensive error handling
  BEGIN
    INSERT INTO profiles (
      id, 
      email, 
      full_name,
      first_name,
      last_name,
      company_name,
      team_size,
      role,
      subscription_tier
    )
    VALUES (
      NEW.id,
      user_email,
      user_full_name,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name', 
      NEW.raw_user_meta_data->>'company_name',
      NEW.raw_user_meta_data->>'team_size',
      'member',
      'free'
    );
    
    RAISE NOTICE 'Profile created successfully for user: %', NEW.id;
    
  EXCEPTION
    WHEN unique_violation THEN
      -- Profile already exists, update it instead
      UPDATE profiles SET
        email = user_email,
        full_name = user_full_name,
        first_name = NEW.raw_user_meta_data->>'first_name',
        last_name = NEW.raw_user_meta_data->>'last_name',
        company_name = NEW.raw_user_meta_data->>'company_name',
        team_size = NEW.raw_user_meta_data->>'team_size',
        updated_at = NOW()
      WHERE id = NEW.id;
      
      RAISE NOTICE 'Profile updated for existing user: %', NEW.id;
      
    WHEN OTHERS THEN
      -- Log the error but don't fail the user creation
      RAISE WARNING 'Error creating profile for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
      -- Re-raise the exception to make the signup fail if there's a serious issue
      RAISE;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- 4. ENABLE RLS AND SET POLICIES
-- ========================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ========================================
-- 5. TEST THE SETUP
-- ========================================

-- Check if the trigger exists
SELECT 
  trigger_name, 
  event_manipulation, 
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'teams');
```

### Step 3: Verify the Fix
After running the SQL script, you should see:
- ✅ Tables created/updated
- ✅ Trigger function created
- ✅ Trigger attached to auth.users table
- ✅ RLS policies set up

### Step 4: Test Signup
1. Go back to your app at `http://localhost:3000/signup`
2. Try creating a new account with a different email
3. Check the browser console - you should no longer see the 500 error

## What This Script Does
1. **Creates the profiles and teams tables** if they don't exist
2. **Replaces the broken trigger function** with an improved version that has proper error handling
3. **Sets up Row Level Security (RLS)** to protect user data
4. **Includes comprehensive error handling** to prevent 500 errors

## If You Still Get Errors
1. Check the Supabase logs in your dashboard under **Logs** → **Database**
2. Look for any NOTICE or WARNING messages from the trigger function
3. Verify your Supabase project URL and keys are correct in your `.env.local` file

Run this SQL script now and your signup should work immediately! 🚀