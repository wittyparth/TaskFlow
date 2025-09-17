-- ========================================
-- TaskFlow Supabase Database Schema (IMPROVED)
-- Run this in your Supabase SQL Editor
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- ========================================
-- 1. TEAMS TABLE (Create first - no dependencies)
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
-- 2. PROFILES TABLE (Create after teams)
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
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  
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
-- IMPROVED PROFILE CREATION FUNCTION
-- ========================================

-- Function to handle new user registration with error handling
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
    NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name',
    split_part(user_email, '@', 1)
  );
  
  -- Insert profile with error handling
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
    WHEN OTHERS THEN
      -- Log the error but don't fail the user creation
      RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- RLS POLICIES
-- ========================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS on teams table
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view teams they belong to" ON teams
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.team_id = teams.id 
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Team owners can update their teams" ON teams
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- ========================================
-- FUNCTION TO UPDATE TIMESTAMPS
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;  
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- HELPFUL VIEWS
-- ========================================

-- Create a view for user profile with team information
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  p.*,
  t.name as team_name,
  t.subscription_tier as team_subscription_tier
FROM profiles p
LEFT JOIN teams t ON p.team_id = t.id;

-- Grant access to the view
GRANT SELECT ON user_profiles TO authenticated;