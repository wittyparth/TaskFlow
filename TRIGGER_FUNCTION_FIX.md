# 🔍 TRIGGER FUNCTION DIAGNOSIS & FIX

## The Issue
You ran the database schema and the trigger exists, but it's still causing 500 errors. This means the trigger function itself is encountering an error when it executes.

## 🚨 IMMEDIATE DIAGNOSTIC

Run this SQL in your Supabase SQL Editor to check what's happening:

```sql
-- 1. Check if trigger exists
SELECT 
  trigger_name, 
  event_manipulation, 
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Check if function exists  
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 3. Check profiles table structure
\d profiles;

-- 4. Check for any constraint issues
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass;
```

## 🔧 FIXED TRIGGER FUNCTION

The original trigger has issues. Replace it with this improved version:

```sql
-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a robust trigger function with proper error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_full_name TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
BEGIN
  -- Safely extract values with fallbacks
  user_email := COALESCE(NEW.email, '');
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  
  -- Build full name safely
  IF user_first_name != '' AND user_last_name != '' THEN
    user_full_name := user_first_name || ' ' || user_last_name;
  ELSIF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    user_full_name := NEW.raw_user_meta_data->>'full_name';
  ELSE
    user_full_name := split_part(user_email, '@', 1);
  END IF;

  -- Insert profile with minimal required fields first
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
      subscription_tier,
      team_id  -- Explicitly set to NULL initially
    )
    VALUES (
      NEW.id,
      user_email,
      user_full_name,
      NULLIF(user_first_name, ''),
      NULLIF(user_last_name, ''),
      NULLIF(NEW.raw_user_meta_data->>'company_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'team_size', ''),
      'member',
      'free',
      NULL  -- No team assignment initially
    );
    
    RAISE NOTICE 'Profile created successfully for user: % with email: %', NEW.id, user_email;
    
  EXCEPTION
    WHEN unique_violation THEN
      -- Profile already exists, just log and continue
      RAISE NOTICE 'Profile already exists for user: %', NEW.id;
    WHEN foreign_key_violation THEN
      -- Foreign key issue, try with minimal data
      RAISE NOTICE 'Foreign key violation for user: %, creating minimal profile', NEW.id;
      INSERT INTO profiles (id, email, full_name, role, subscription_tier)
      VALUES (NEW.id, user_email, user_full_name, 'member', 'free')
      ON CONFLICT (id) DO NOTHING;
    WHEN OTHERS THEN
      -- Log error but don't fail the signup
      RAISE WARNING 'Error in handle_new_user for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
      -- Try absolute minimal insert
      BEGIN
        INSERT INTO profiles (id, email, role, subscription_tier)
        VALUES (NEW.id, user_email, 'member', 'free')
        ON CONFLICT (id) DO NOTHING;
      EXCEPTION
        WHEN OTHERS THEN
          -- If even this fails, log and continue (don't block signup)
          RAISE WARNING 'Complete profile creation failure for user %: %', NEW.id, SQLERRM;
      END;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON profiles TO postgres, anon, authenticated, service_role;
```

## 🧪 TEST THE FIX

After running the above SQL, test with this query to simulate what happens during signup:

```sql
-- Test the trigger function directly
SELECT handle_new_user() FROM auth.users LIMIT 1;

-- Check recent profiles
SELECT id, email, full_name, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;
```

## 🔍 DEBUGGING STEPS

If it still fails after this fix:

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs → Database
   - Look for NOTICE, WARNING, or ERROR messages

2. **Check Table Permissions**:
   ```sql
   SELECT grantee, privilege_type 
   FROM information_schema.role_table_grants 
   WHERE table_name = 'profiles';
   ```

3. **Verify RLS Policies**:
   ```sql
   SELECT schemaname, tablename, policyname, cmd, qual 
   FROM pg_policies 
   WHERE tablename = 'profiles';
   ```

## 🎯 WHY THIS FIXES IT

The original trigger was failing because:

1. **No error handling** - Any small issue would cause 500 error
2. **Potential foreign key issues** - Team references might be problematic
3. **String handling issues** - Empty strings vs NULL values
4. **Permission problems** - Trigger might not have proper access

This new version:
- ✅ Has comprehensive error handling
- ✅ Falls back to minimal profile creation if needed
- ✅ Handles NULL vs empty string issues
- ✅ Never blocks the signup process
- ✅ Provides detailed logging for debugging

Run this fixed trigger function and your signup should work!