# 🔧 Troubleshooting Guide

## Issue: New Users Show 0 0 0 Stats

### Root Cause
When users sign up, their LeetCode stats weren't being automatically fetched. They needed to manually click "Refresh My Stats" which might not be obvious.

### ✅ Fix Applied
Updated `src/app/signup/page.tsx` to automatically fetch stats after signup completion.

### How to Fix for Existing Users

**Option 1: Have them click "Refresh My Stats" button**
1. User logs in
2. Clicks "Refresh My Stats" button in top right
3. Stats will be fetched and displayed

**Option 2: Manually trigger stats fetch (Admin)**
1. Go to your production URL: `https://your-app.vercel.app/api/update-stats?username=their-leetcode-username`
2. This will fetch and save their stats
3. Refresh the leaderboard

**Option 3: Run the daily cron manually**
1. In Vercel Dashboard → Deployments → Click your deployment
2. Go to Functions → Find `/api/cron/update-all-stats`
3. Click "Invoke" to run the cron job manually
4. This will update all users' stats

---

## Issue: Stats Still Showing 0 After Refresh

### Possible Causes & Solutions

#### 1. RLS Policy Not Applied
**Check**: Did you run `supabase-rls-fix.sql` in Supabase?

**Fix**:
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase-rls-fix.sql`
3. Paste and click "Run"
4. Should see "Success" message

**Verify RLS Policies**:
```sql
-- Run this in Supabase SQL Editor to check policies
SELECT * FROM pg_policies WHERE tablename = 'leetcode_stats';
```

You should see 3 policies:
- `Users can insert own stats`
- `Users can update own stats`  
- `Admins can manage all stats`

#### 2. Invalid LeetCode Username
**Check**: Is the LeetCode username correct?

**Fix**:
1. Go to LeetCode and verify the username exists: `https://leetcode.com/USERNAME`
2. If invalid, update in Supabase:
   ```sql
   UPDATE users 
   SET leetcode_username = 'correct-username' 
   WHERE email = 'user@example.com';
   ```
3. Have user click "Refresh My Stats"

#### 3. LeetCode API Rate Limiting
**Check**: Are you making too many requests?

**Fix**:
- Wait 5-10 minutes before trying again
- The LeetCode API has rate limits
- Daily cron runs once per day to avoid this

#### 4. Network/CORS Issues
**Check**: Are API calls being blocked?

**Fix**:
1. Open browser DevTools (F12) → Network tab
2. Click "Refresh My Stats"
3. Look for `/api/update-stats` request
4. Check if it returns 200 or an error

---

## Issue: Localhost Redirect After Login

### Cause
Supabase redirect URLs not configured for production.

### Fix
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. **Site URL**: `https://your-vercel-app.vercel.app`
3. **Redirect URLs** (add both):
   ```
   https://your-vercel-app.vercel.app/auth/callback
   https://your-vercel-app.vercel.app/**
   ```
4. Remove or keep localhost for local dev:
   ```
   http://localhost:3000/auth/callback
   ```

---

## Issue: Cron Job Not Running

### Check Cron Status
1. Vercel Dashboard → Your Project → Cron Jobs
2. Should see: `0 0 * * *` - `/api/cron/update-all-stats`
3. Check "Last Run" timestamp

### Common Issues

#### Cron Secret Mismatch
**Fix**:
1. Vercel Dashboard → Settings → Environment Variables
2. Verify `CRON_SECRET` is set
3. Must match the secret in your `.env.local` (for local testing)

#### Cron Only Runs in Production
- Cron jobs don't run on localhost
- Only work on deployed Vercel apps
- To test locally: call `/api/cron/update-all-stats` manually with `Authorization: Bearer YOUR_CRON_SECRET` header

---

## Issue: "Unable to Acquire Lock" Error

### Cause
Multiple Next.js dev servers running at once.

### Fix (Windows)
```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Restart dev server
npm run dev
```

### Fix (Mac/Linux)
```bash
# Find and kill Next.js processes
lsof -ti:3000 | xargs kill -9

# Restart dev server
npm run dev
```

---

## Debugging Checklist

When a user reports stats not working:

- [ ] Did they complete signup with a valid LeetCode username?
- [ ] Did they try clicking "Refresh My Stats"?
- [ ] Is their LeetCode username spelled correctly?
- [ ] Have you run `supabase-rls-fix.sql` in Supabase?
- [ ] Are there any errors in Vercel logs? (Dashboard → Deployments → View Function Logs)
- [ ] Check Supabase logs: Dashboard → Logs → API
- [ ] Verify environment variables are set in Vercel (SUPABASE_URL, SUPABASE_ANON_KEY)

---

## Quick Database Checks

### Check if user exists
```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

### Check if stats exist
```sql
SELECT u.email, u.leetcode_username, s.* 
FROM users u 
LEFT JOIN leetcode_stats s ON s.user_id = u.id
WHERE u.email = 'user@example.com';
```

### Manually insert stats (emergency)
```sql
INSERT INTO leetcode_stats (
  user_id, 
  total_solved, 
  total_easy, 
  total_medium, 
  total_hard,
  weekly_solved,
  weekly_easy,
  weekly_medium,
  weekly_hard,
  weekly_points,
  contest_rating
) VALUES (
  (SELECT id FROM users WHERE email = 'user@example.com'),
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
);
```

Then have them click "Refresh My Stats" to fetch real data.

---

## Still Having Issues?

1. **Check Vercel Function Logs**:
   - Vercel Dashboard → Deployments → View Function Logs
   - Look for errors in `/api/update-stats`

2. **Check Supabase Logs**:
   - Supabase Dashboard → Logs
   - Filter by "API" to see database queries
   - Look for failed INSERT/UPDATE queries

3. **Test the API directly**:
   ```bash
   # From your browser console on the deployed site
   fetch('/api/update-stats', { method: 'POST' })
     .then(r => r.json())
     .then(console.log)
   ```

4. **Verify RLS is working**:
   ```sql
   -- Run as the authenticated user in Supabase SQL Editor
   SELECT current_user, auth.uid();
   ```

---

## Prevention Tips

1. **Always run RLS fix** after setting up database
2. **Test signup flow** with a test account before inviting users
3. **Monitor Vercel logs** for the first few signups
4. **Set up Vercel notifications** for failed function calls
5. **Document your Supabase URL** and cron secret in a secure place
