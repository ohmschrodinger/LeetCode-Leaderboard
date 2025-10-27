# 🎮 LeetBoard - Project Roadmap

A Minecraft-styled LeetCode leaderboard with weekly competitions!

---

## 📋 Project Overview

### Features:
- 🔐 Google OAuth authentication
- 🎯 LeetCode username validation
- 📊 Weekly leaderboard with points system
- 🏆 Rankings based on problems solved
- 👑 Admin panel for manual user management
- 🎨 Minecraft-inspired dark theme UI

---

## 🚀 Project Phases

### ✅ Phase 1: Supabase Setup & Authentication (COMPLETED)
**Status:** Complete - Ready for testing

**What's Built:**
- [x] Supabase client/server utilities
- [x] Google OAuth integration
- [x] Signup flow with LeetCode username validation
- [x] Database schema (users & leetcode_stats tables)
- [x] Minecraft-styled dark theme
- [x] Authentication middleware
- [x] API route for LeetCode validation

**Your Tasks:**
- [ ] Create Supabase tables using `DATABASE_SCHEMA.md`
- [ ] Configure Google OAuth in Supabase
- [ ] Set up `.env.local` with credentials
- [ ] Test signup flow
- [ ] Make yourself admin

**Guide:** See `PHASE1_SETUP.md` for detailed instructions

---

### 🔄 Phase 2: LeetCode Data Integration (NEXT)
**Status:** Not Started

**What Will Be Built:**
- [ ] LeetCode API integration for fetching user stats
- [ ] Fetch total problems solved (easy/medium/hard)
- [ ] Fetch contest rating
- [ ] Weekly stats tracking system
- [ ] Calculate weekly points (E:1pt, M:2pt, H:3pt)
- [ ] API routes for data fetching
- [ ] Automated refresh mechanism
- [ ] Weekly reset functionality

**Technical Details:**
- Use LeetCode GraphQL API
- Store baseline stats to calculate weekly progress
- Implement cron job or scheduled function for updates
- Handle API rate limiting

---

### 📊 Phase 3: Leaderboard UI & Ranking System (FUTURE)
**Status:** Not Started

**What Will Be Built:**
- [ ] Main leaderboard page with all users
- [ ] Display columns: Rank, Avatar, Name, Weekly Solved, Weekly Points, Total Solved, Contest Rating
- [ ] Real-time ranking calculation
- [ ] Highlight current user's row
- [ ] Rank badges (gold/silver/bronze for top 3)
- [ ] Sorting options (weekly points, total solved, etc.)
- [ ] Search/filter functionality
- [ ] Responsive table design

**UI Components:**
- Minecraft-styled table
- User avatar display
- Difficulty breakdown (E:X, M:Y, H:Z)
- Animated rank changes
- Special styling for top 3

---

### 👑 Phase 4: Admin Panel & Manual User Management (FINAL)
**Status:** Not Started

**What Will Be Built:**
- [ ] Admin dashboard
- [ ] Admin-only routes protection
- [ ] Manually add users by LeetCode username
- [ ] Edit user information
- [ ] Remove users
- [ ] Force refresh user stats
- [ ] View system logs
- [ ] Bulk operations

**Security:**
- Admin check middleware
- RLS policies for admin operations
- Audit logging for admin actions

---

## 🎨 Design System

### Color Palette:
- Primary BG: `#1a1a1a`
- Secondary BG: `#2d2d2d`
- Hover BG: `#3d3d3d`
- Green (Easy): `#55ff55`
- Gold (Medium): `#ffaa00`
- Red (Hard): `#ff5555`
- Blue: `#5555ff`

### Typography:
- Font: Press Start 2P (pixel font)
- Sizes: 10px-12px base, 16px+ for headings

### Components:
- `.mc-button` - Blocky Minecraft buttons
- `.mc-input` - Pixelated input fields
- `.mc-panel` - Container with depth
- `.mc-table` - Leaderboard table

---

## 📊 Points System

**Weekly Points Calculation:**
- Easy problem: **1 point**
- Medium problem: **2 points**
- Hard problem: **3 points**

**Example:**
- User solves 5 Easy, 15 Medium, 5 Hard in a week
- Points = (5×1) + (15×2) + (5×3) = 5 + 30 + 15 = **50 points**

**Weekly Reset:**
- Resets every Monday at 00:00 UTC
- Stats stored in `leetcode_stats.week_start`

---

## 🗄️ Database Structure

### Tables:

**users:**
- id (UUID, FK to auth.users)
- email
- leetcode_username (unique)
- avatar_url
- display_name
- is_admin (boolean)
- timestamps

**leetcode_stats:**
- id (UUID)
- user_id (FK to users)
- total_solved, total_easy, total_medium, total_hard
- weekly_solved, weekly_easy, weekly_medium, weekly_hard
- weekly_points (calculated)
- contest_rating
- last_updated, week_start

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Minecraft-styled custom CSS

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Auth (Google OAuth)

**External APIs:**
- LeetCode GraphQL API

**Deployment:**
- Vercel (recommended)
- Supabase Cloud

---

## 📁 Project Structure

```
leetboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── validate-leetcode/route.ts
│   │   ├── auth/
│   │   │   └── callback/route.ts
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   └── middleware.ts
├── DATABASE_SCHEMA.md
├── PHASE1_SETUP.md
├── PROJECT_ROADMAP.md (this file)
├── .env.local.example
└── package.json
```

---

## 🎯 Current Status

**Phase 1:** ✅ COMPLETE - Ready for your setup
**Phase 2:** ⏳ Pending - Waiting for Phase 1 completion
**Phase 3:** ⏳ Pending
**Phase 4:** ⏳ Pending

---

## 📞 Next Steps

1. Complete Phase 1 setup using `PHASE1_SETUP.md`
2. Test authentication and signup flow
3. Report back when ready for Phase 2
4. We'll implement LeetCode data fetching next!

---

**Ready to dominate the leaderboard? Let's go! 🚀**
