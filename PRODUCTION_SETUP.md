# Production Deployment Guide

## ✅ Code Changes Made

The app is now configured for production deployment. Key changes:
- Auth callback properly handles production URLs using `x-forwarded-host` header
- Signup redirects use `window.location.origin` (works in any environment)
- Cron job runs **daily at 00:00 UTC** instead of hourly

---

## 🚀 Vercel Deployment Steps

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `LeetCode-Leaderboard` repository
4. Vercel auto-detects Next.js settings ✅
5. **Add Environment Variables** (click dropdown before deploying):
   ```
   SUPABASE_URL=your-project-url.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   CRON_SECRET=your-random-secret-string
   ```
6. Click **"Deploy"**
7. Wait 2-3 minutes ⏳

### 3. Configure Supabase for Production

After your app deploys (you'll get a URL like `https://your-app.vercel.app`):

1. **Go to Supabase Dashboard** → Authentication → URL Configuration
2. **Add Production URLs**:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs** (add these):
     ```
     https://your-app.vercel.app/auth/callback
     https://your-app.vercel.app/**
     ```

3. **Run the RLS Fix** (if you haven't already):
   - Go to Supabase → SQL Editor
   - Run the script in `supabase-rls-fix.sql`
   - This allows users to insert/update their own stats

### 4. Verify Cron Job

1. Go to Vercel Dashboard → Your Project → **Cron Jobs** tab
2. You should see:
   - **Path**: `/api/cron/update-all-stats`
   - **Schedule**: `0 0 * * *` (daily at midnight UTC)
   - **Status**: Active ✅

---

## 🧪 Testing Your Production Deployment

1. **Visit your app**: `https://your-app.vercel.app`
2. **Test Google Sign-In**:
   - Click "Sign in with Google"
   - Should redirect properly (no localhost!)
   - Complete signup with LeetCode username
3. **Test Stats Refresh**:
   - Click "Refresh stats" button
   - Stats should update from LeetCode API
4. **Check Leaderboard**:
   - View your stats on the leaderboard
   - Sort controls should work

---

## 🔧 Troubleshooting

### Issue: "Redirect URL not allowed"
**Fix**: Make sure you added your Vercel URL to Supabase redirect URLs (step 3 above)

### Issue: "Stats not updating"
**Fix**: Check that you ran `supabase-rls-fix.sql` in Supabase SQL Editor

### Issue: Cron not running
**Fix**: 
- Verify `CRON_SECRET` env var is set in Vercel
- Check Vercel Dashboard → Cron Jobs for errors
- Cron only runs in production, not locally

### Issue: "Unable to acquire lock" when running dev locally
**Fix**: Kill the other Next.js process:
```bash
# Windows
taskkill /F /IM node.exe

# Then restart
npm run dev
```

---

## 📝 Environment Variables Reference

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | Public anonymous key | Supabase Dashboard → Settings → API |
| `CRON_SECRET` | Random secret for cron auth | Generate: `openssl rand -hex 32` |

---

## 🔄 Auto-Deployments

Vercel automatically redeploys your app on every `git push` to main branch.

To disable auto-deploy:
- Vercel Dashboard → Project Settings → Git → Disable

---

## 🎉 You're Live!

Your LeetCode Leaderboard is now running in production with:
- ✅ Material 3 design
- ✅ Montserrat font
- ✅ Daily stats updates (00:00 UTC)
- ✅ Google OAuth authentication
- ✅ Secure database with RLS policies

Share your leaderboard URL with friends and start competing! 🏆
