# 🔧 ALTERNATIVE: DISABLE TRIGGER TEMPORARILY

If the trigger keeps failing, here's a quick workaround to get signup working immediately:

## STEP 1: Disable the Problematic Trigger

```sql
-- Temporarily disable the trigger to stop the 500 errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

## STEP 2: Enable Manual Profile Creation

I've already added fallback profile creation in your signup code. With the trigger disabled, the fallback will handle profile creation.

## STEP 3: Test Signup

1. Run the `DROP TRIGGER` command above
2. Try signing up again 
3. The signup should work without the 500 error
4. Check if the profile gets created by the fallback method

## STEP 4: Re-enable Trigger Later

Once signup is working, you can add back the improved trigger:

```sql
-- Add the improved trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple, minimal profile creation
  INSERT INTO profiles (id, email, full_name, role, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'member',
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never fail the signup, just log the error
    RAISE WARNING 'Profile creation failed for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

This approach ensures signup works immediately while you debug the trigger issues.