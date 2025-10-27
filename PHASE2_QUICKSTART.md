# ⚡ Phase 2 Quick Setup - Do These 4 Things

## 1️⃣ Update Database (1 min)
```sql
-- Go to Supabase SQL Editor, paste and run:

ALTER TABLE public.leetcode_stats 
ADD COLUMN IF NOT EXISTS baseline_easy INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS baseline_medium INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS baseline_hard INTEGER DEFAULT 0;

UPDATE public.leetcode_stats
SET 
  baseline_easy = total_easy,
  baseline_medium = total_medium,
  baseline_hard = total_hard
WHERE baseline_easy IS NULL OR baseline_easy = 0;
```

## 2️⃣ Add Cron Secret to `.env.local` (1 min)
```env
# Add this line to your .env.local file:
CRON_SECRET=any-random-secret-string-you-want-123456
```

## 3️⃣ Test Locally (1 min)
```bash
npm run dev

# Then in browser console:
fetch('/api/update-stats', { method: 'POST' }).then(r => r.json()).then(console.log)

# You should see your LeetCode stats!
```

## 4️⃣ Deploy to Vercel (2 min)
```bash
git add .
git commit -m "Phase 2: LeetCode integration"
git push
```

**After deploy:**
- Go to Vercel project → Settings → Environment Variables
- Add: `CRON_SECRET` = `same-secret-from-env-local`
- Redeploy if needed

---

## ✅ Done!
Stats will now update **every hour automatically** via Vercel Cron!

Check `PHASE2_SETUP.md` for detailed explanation.
