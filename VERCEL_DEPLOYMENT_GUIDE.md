# Vercel Deployment Guide for TaskFlow

## 🚀 Step 1: Fix Build Issues (✅ COMPLETED)

The TypeScript build error has been resolved by removing the conflicting `use-auth-fixed.ts` file.

## 🔧 Step 2: Prepare for Vercel Deployment

### A. Create Production Environment File

Create `.env.production` for production-specific settings:

```env
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://ktivgbffdkxfinukuycv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aXZnYmZmZGt4ZmludWt1eWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTY4MjUsImV4cCI6MjA3Mjk5MjgyNX0.3wvXbLR-1_afdMF5sCmDTvFCHYXDn8nbJ0vHf55D3kM

# PostHog Configuration (Production)
NEXT_PUBLIC_POSTHOG_KEY=phc_x6cJXhBSPij48LCw9A1BNQIk40KkAfeovbcnTjPc91Y
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# App Configuration (Will be updated after Vercel deployment)
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

## 🌐 Step 3: Deploy to Vercel

### A. Connect to Vercel

1. **Visit**: https://vercel.com
2. **Import your GitHub repository**
3. **Configure deployment settings**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (keep default)
   - Build Command: `pnpm build`
   - Output Directory: `.next` (auto-detected)

### B. Set Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://ktivgbffdkxfinukuycv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aXZnYmZmZGt4ZmludWt1eWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTY4MjUsImV4cCI6MjA3Mjk5MjgyNX0.3wvXbLR-1_afdMF5sCmDTvFCHYXDn8nbJ0vHf55D3kM
NEXT_PUBLIC_POSTHOG_KEY = phc_x6cJXhBSPij48LCw9A1BNQIk40KkAfeovbcnTjPc91Y
NEXT_PUBLIC_POSTHOG_HOST = https://us.i.posthog.com
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
```

## 🔐 Step 4: Configure Supabase for Production

### A. Update Supabase Auth Settings

1. **Go to**: https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to**: Authentication → Settings → URL Configuration

### B. Add Vercel Domain to Site URL

```
Site URL: https://your-app-name.vercel.app
```

### C. Add Redirect URLs

Add these to **Redirect URLs**:
```
https://your-app-name.vercel.app/dashboard
https://your-app-name.vercel.app/auth/callback
https://your-app-name.vercel.app/
```

## 🐛 Step 5: Fix Common Signin Issues

### A. Update OAuth Redirect URLs

If using Google/GitHub OAuth, update their redirect URLs:

**Google OAuth Console**:
```
Authorized redirect URIs:
- https://ktivgbffdkxfinukuycv.supabase.co/auth/v1/callback
- https://your-app-name.vercel.app/auth/callback
```

**GitHub OAuth App**:
```
Authorization callback URL:
- https://ktivgbffdkxfinukuycv.supabase.co/auth/v1/callback
```

### B. Test Authentication Flow

1. **Deploy to Vercel** first
2. **Get your Vercel URL**: `https://your-app-name.vercel.app`
3. **Update** `NEXT_PUBLIC_APP_URL` in Vercel environment variables
4. **Redeploy** the application
5. **Test signin** on production

## 🚨 Common Production Issues & Fixes

### Issue 1: "Invalid login credentials"
**Cause**: User doesn't exist in production database
**Fix**: Create a test user account via signup

### Issue 2: OAuth redirect errors
**Cause**: Redirect URLs not configured properly
**Fix**: Update OAuth provider settings with production URLs

### Issue 3: Environment variables not loaded
**Cause**: Variables not set in Vercel dashboard
**Fix**: Double-check all environment variables in Vercel

### Issue 4: CORS errors
**Cause**: Domain not whitelisted in Supabase
**Fix**: Add Vercel domain to Supabase allowed origins

## 📝 Deployment Checklist

- [ ] ✅ Build passes locally (`pnpm build`)
- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ Supabase Site URL updated
- [ ] ✅ Supabase redirect URLs added
- [ ] ✅ OAuth providers configured (if using)
- [ ] ✅ Test user account created
- [ ] ✅ Production URL works
- [ ] ✅ Signin/signup flows tested

## 🔍 Debug Production Issues

### Check Browser Console
Look for these errors:
- Network errors (401, 403, 500)
- CORS errors
- Environment variable issues

### Check Vercel Function Logs
1. Go to Vercel dashboard
2. Click on deployment
3. Check "Functions" tab for server errors

### Check Supabase Logs
1. Go to Supabase dashboard
2. Check "Logs" section
3. Look for authentication errors

## 🎯 Quick Start Commands

```bash
# 1. Build locally to verify
pnpm build

# 2. Deploy to Vercel (if using Vercel CLI)
npx vercel

# 3. Set environment variables
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add NEXT_PUBLIC_POSTHOG_KEY
npx vercel env add NEXT_PUBLIC_POSTHOG_HOST

# 4. Redeploy with new environment variables
npx vercel --prod
```

Your app should now work on Vercel! 🎉