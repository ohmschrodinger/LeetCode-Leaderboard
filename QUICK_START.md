# 🚀 Quick Start Guide

## First Time Setup (5 minutes)

### 1. Install Dependencies ✅
Already done! The packages are installed.

### 2. Set Up Supabase (3 minutes)

**A. Create Database Tables:**
1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Open `DATABASE_SCHEMA.md` in this project
5. Copy all SQL code
6. Paste into SQL Editor and click **Run**

**B. Enable Google OAuth:**
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and toggle it ON
3. You'll need Google OAuth credentials:
   - Go to https://console.cloud.google.com
   - Create a new project (or use existing)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

### 3. Configure Environment Variables (1 minute)

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_EMAIL=your-email@gmail.com
```

Get these values from: Supabase Dashboard → **Project Settings** → **API**

### 4. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 5. Sign Up & Become Admin

1. Click "Sign in with Google"
2. Enter your LeetCode username (e.g., "tourist", "jiangly", etc.)
3. After signup, go to Supabase **SQL Editor**
4. Run this to make yourself admin:
```sql
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'your-email@gmail.com';
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Can access http://localhost:3000
- [ ] Redirected to `/signup` page
- [ ] Minecraft-styled dark theme is visible
- [ ] Can click "Sign in with Google"
- [ ] Google OAuth popup appears
- [ ] After OAuth, prompted for LeetCode username
- [ ] Username validation works (try a real username like "tourist")
- [ ] After entering valid username, redirected to home page
- [ ] Check Supabase **Authentication** → **Users** - you should see your account
- [ ] Check Supabase **Table Editor** → **users** - your profile should be there

---

## 🐛 Common Issues

### "Invalid API key" error
**Fix:** Double-check `.env.local` has correct Supabase URL and anon key

### Can't sign in with Google
**Fix:** 
- Check Google OAuth is enabled in Supabase
- Verify redirect URI in Google Console matches Supabase
- Clear browser cache and try again

### Username validation fails
**Fix:**
- Test with a known LeetCode username like "tourist"
- Check browser console for errors
- Verify API route is working: http://localhost:3000/api/validate-leetcode

### Database errors
**Fix:**
- Ensure all SQL from `DATABASE_SCHEMA.md` was executed
- Check table exists: Supabase → **Table Editor**
- Verify RLS policies are created

---

## 📂 Important Files

- `PHASE1_SETUP.md` - Detailed Phase 1 instructions
- `PROJECT_ROADMAP.md` - Full project plan (all 4 phases)
- `DATABASE_SCHEMA.md` - SQL for database setup
- `.env.local.example` - Environment variables template

---

## 🎯 What's Next?

Once Phase 1 is working:
1. Test the signup flow thoroughly
2. Make yourself an admin
3. Let me know you're ready
4. We'll start **Phase 2** - LeetCode data fetching!

---

**Need help? Just ask! 🚀**
