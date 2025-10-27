# Phase 1 Setup Guide - Authentication & Signup

## ✅ What's Been Completed

Phase 1 is now complete! Here's what has been built:

### Files Created:
1. **Supabase Integration**
   - `src/lib/supabase/client.ts` - Client-side Supabase client
   - `src/lib/supabase/server.ts` - Server-side Supabase client
   - `src/lib/supabase/middleware.ts` - Authentication middleware
   - `src/middleware.ts` - Next.js middleware for route protection

2. **Authentication & Signup**
   - `src/app/signup/page.tsx` - Signup page with Google OAuth & LeetCode username validation
   - `src/app/auth/callback/route.ts` - OAuth callback handler
   - `src/app/api/validate-leetcode/route.ts` - API to validate LeetCode usernames

3. **Styling**
   - `src/app/globals.css` - Minecraft-styled dark theme with pixel fonts
   - Updated `src/app/layout.tsx` with proper metadata

4. **Documentation**
   - `DATABASE_SCHEMA.md` - Complete database schema for Supabase
   - `.env.local.example` - Environment variables template

---

## 🔧 Your Tasks to Complete Phase 1

### Step 1: Set Up Supabase Project

1. **Go to your Supabase Dashboard** (https://supabase.com/dashboard)

2. **Enable Google OAuth Provider:**
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID & Secret)
   - Set the redirect URL to: `http://localhost:3000/auth/callback` (for development)

3. **Create Database Tables:**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste ALL the SQL from `DATABASE_SCHEMA.md`
   - Run each section sequentially
   - This will create:
     - `public.users` table
     - `public.leetcode_stats` table
     - Indexes for performance
     - Row Level Security policies
     - Auto-update triggers

### Step 2: Configure Environment Variables

1. **Create `.env.local` file** in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your Supabase credentials:**
   - Get your project URL from Supabase Dashboard → Project Settings → API
   - Get your anon/public key from the same place
   - Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ADMIN_EMAIL=your-email@gmail.com
   ```

### Step 3: Test the Signup Flow

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the flow:**
   - Visit http://localhost:3000
   - You should be redirected to `/signup`
   - Click "Sign in with Google"
   - After Google auth, you'll be prompted to enter your LeetCode username
   - The app will validate your username using the LeetCode API
   - Once validated, you'll be redirected to the home page

3. **Make yourself an admin:**
   - After signing up, go to Supabase SQL Editor
   - Run:
   ```sql
   UPDATE public.users
   SET is_admin = TRUE
   WHERE email = 'your-email@gmail.com';
   ```

---

## 🎨 UI Features Implemented

### Minecraft-Styled Theme:
- ✅ Pixel font (Press Start 2P)
- ✅ Dark theme with blocky borders
- ✅ Retro button styles with depth/shadow effects
- ✅ Minecraft-inspired color palette
- ✅ Custom scrollbar styling
- ✅ Loading animations

### Responsive Components:
- ✅ Modern button styles (`.mc-button`)
- ✅ Input fields (`.mc-input`)
- ✅ Panels/containers (`.mc-panel`)
- ✅ Table styling (`.mc-table`)
- ✅ Rank badges with gold/silver/bronze

---

## 🔒 Security Features

1. **Row Level Security (RLS)** enabled on all tables
2. **Middleware protection** - unauthenticated users redirected to signup
3. **Server-side authentication** using Supabase SSR
4. **Username validation** before account creation
5. **Admin-only policies** for stats management

---

## 📝 Database Schema Overview

### Users Table:
- Extends `auth.users` with additional fields
- Stores LeetCode username, avatar, display name
- Has `is_admin` flag for admin access

### LeetCode Stats Table:
- Stores total and weekly problem stats
- Tracks easy/medium/hard breakdown
- Includes contest rating
- Auto-resets weekly stats (to be implemented in Phase 2)

---

## 🐛 Troubleshooting

### Issue: "Invalid API key"
**Solution:** Double-check your `.env.local` file has correct Supabase credentials

### Issue: Redirect loop after login
**Solution:** Ensure database tables are created and user profile is saved correctly

### Issue: LeetCode validation fails
**Solution:** Check if the LeetCode GraphQL API is accessible from your network

### Issue: Google OAuth not working
**Solution:** 
- Verify Google provider is enabled in Supabase
- Check redirect URL matches your local development URL
- Ensure Google OAuth credentials are correct

---

## ✨ Next Steps: Phase 2

Once Phase 1 is working, we'll move to Phase 2:
- Fetch LeetCode stats using their API
- Implement weekly stats tracking
- Create data refresh mechanism
- Set up cron jobs for automatic updates

---

## 📞 Ready for Phase 2?

Let me know once you've:
1. ✅ Created the database tables
2. ✅ Configured environment variables
3. ✅ Successfully signed up with Google
4. ✅ Validated a LeetCode username
5. ✅ Made yourself an admin

Then we'll proceed to Phase 2!
