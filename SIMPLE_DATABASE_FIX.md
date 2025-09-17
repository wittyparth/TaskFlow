# 🚨 IMMEDIATE DATABASE FIX - STEP BY STEP

## The Issue
Your signup is failing with "Database error saving new user" because the database trigger function is missing.

## STEP 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your account
3. Select your TaskFlow project
4. Click on **"SQL Editor"** in the left sidebar

## STEP 2: Run This EXACT SQL Script

Copy and paste this ENTIRE script into the SQL Editor and click **"RUN"**:

```sql
-- STEP 1: Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  team_size TEXT,
  role TEXT DEFAULT 'member',
  subscription_tier TEXT DEFAULT 'free'
);

-- STEP 2: Remove any existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- STEP 3: Create the trigger function
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

-- STEP 4: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- STEP 5: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create basic policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## STEP 3: Verify It Worked
After running the script, you should see:
- ✅ "Success. No rows returned" or similar success message
- ✅ No error messages

## STEP 4: Test Signup
1. Go back to your app: http://localhost:3000/signup
2. Try signing up with a NEW email address
3. The 500 error should be gone!

## If You Still Get Errors
1. Check for typos in the SQL script
2. Make sure you selected the correct project in Supabase
3. Try refreshing the page and testing again

That's it! This should fix your signup issue immediately. 🚀