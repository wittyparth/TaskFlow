-- ========================================
-- TaskFlow Supabase Database Schema (FIXED)
-- Run this in your Supabase SQL Editor
-- ========================================

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
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. PROJECTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'on_hold')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  color TEXT DEFAULT '#3b82f6',
  tags TEXT[] DEFAULT '{}',
  settings JSONB DEFAULT '{}'::jsonb
);

-- ========================================
-- 4. TASKS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'blocked')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  tags TEXT[] DEFAULT '{}',
  position INTEGER DEFAULT 0
);

-- ========================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;  
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ========================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Teams policies
DROP POLICY IF EXISTS "Users can view own teams" ON teams;
CREATE POLICY "Users can view own teams" ON teams
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.team_id = teams.id 
      AND profiles.id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team owners can manage teams" ON teams;
CREATE POLICY "Team owners can manage teams" ON teams
  FOR ALL USING (owner_id = auth.uid());

-- Projects policies  
DROP POLICY IF EXISTS "Users can view team projects" ON projects;
CREATE POLICY "Users can view team projects" ON projects
  FOR SELECT USING (
    owner_id = auth.uid() OR
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage own projects" ON projects;  
CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (
    owner_id = auth.uid() OR
    team_id IN (
      SELECT teams.id FROM teams 
      JOIN profiles ON profiles.team_id = teams.id
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'owner')
    )
  );

-- Tasks policies
DROP POLICY IF EXISTS "Users can view project tasks" ON tasks;
CREATE POLICY "Users can view project tasks" ON tasks
  FOR SELECT USING (
    creator_id = auth.uid() OR 
    assignee_id = auth.uid() OR
    project_id IN (
      SELECT projects.id FROM projects
      WHERE projects.owner_id = auth.uid() OR
      projects.team_id IN (
        SELECT team_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can manage tasks" ON tasks;
CREATE POLICY "Users can manage tasks" ON tasks
  FOR ALL USING (
    creator_id = auth.uid() OR
    assignee_id = auth.uid() OR
    project_id IN (
      SELECT projects.id FROM projects  
      WHERE projects.owner_id = auth.uid() OR
      projects.team_id IN (
        SELECT teams.id FROM teams
        JOIN profiles ON profiles.team_id = teams.id
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'owner')
      )
    )
  );

-- ========================================
-- 7. FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    id, 
    email, 
    full_name,
    first_name,
    last_name,
    company_name,
    team_size
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name', 
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'team_size'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;  
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects  
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. INDEXES FOR PERFORMANCE  
-- ========================================
CREATE INDEX IF NOT EXISTS idx_profiles_team_id ON profiles(team_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);  
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_creator_id ON tasks(creator_id);

-- ========================================
-- SETUP COMPLETE!
-- ========================================

-- After running this:
-- ✅ All tables created in correct order
-- ✅ No circular dependency errors
-- ✅ Authentication will work properly
-- ✅ User profiles created automatically on signup  
-- ✅ All tables have proper security policies
-- ✅ Database ready for TaskFlow app!
