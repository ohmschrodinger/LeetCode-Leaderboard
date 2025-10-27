# 🎮 LeetBoard - Minecraft-Styled LeetCode Leaderboard

A competitive LeetCode leaderboard with weekly rankings, built with Next.js and Supabase. Features a retro Minecraft-inspired dark theme!

![Status](https://img.shields.io/badge/Phase%202-Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Powered-green)

---

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google
- 🎯 **LeetCode Integration** - Validates and tracks real LeetCode usernames
- 📊 **Automated Stats Tracking** - Hourly updates from LeetCode API
- 🔄 **Weekly Stats** - Automatic weekly reset every Monday
- 🏆 **Points System** - Earn points based on difficulty (Easy: 1pt, Medium: 2pt, Hard: 3pt)
- ⚡ **Manual Refresh** - Users can trigger their own stats update
- 👑 **Admin Panel** - Manually manage users (admin-only feature) [Coming in Phase 4]
- 🎨 **Minecraft Theme** - Retro pixel art styling with dark mode

---

## 🚀 Quick Start

**For first-time setup, see:** [`QUICK_START.md`](QUICK_START.md)  
**For Phase 2 setup, see:** [`PHASE2_QUICKSTART.md`](PHASE2_QUICKSTART.md)

### Prerequisites
- Node.js 18+
- Supabase account
- Google OAuth credentials
- Vercel account (for cron jobs)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials + CRON_SECRET
# Then run the development server
npm run dev
```

Visit http://localhost:3000

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[PHASE1_SETUP.md](PHASE1_SETUP.md)** - Detailed Phase 1 instructions  
- **[PROJECT_ROADMAP.md](PROJECT_ROADMAP.md)** - Full project plan (all 4 phases)
- **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Database structure and SQL

---

## 🏗️ Project Status

### ✅ Phase 1: Authentication & Signup (COMPLETE)
- [x] Google OAuth integration
- [x] LeetCode username validation
- [x] Supabase database setup
- [x] Minecraft-styled UI theme
- [x] User profile management

### ✅ Phase 2: LeetCode Data Integration (COMPLETE)
- [x] Fetch user statistics from LeetCode
- [x] Weekly stats tracking with baseline
- [x] Automated hourly data refresh via Vercel Cron
- [x] Points calculation system (E:1, M:2, H:3)
- [x] Manual refresh button for users
- [x] Automatic weekly reset (Mondays)

### 📊 Phase 3: Leaderboard UI (NEXT)
- [ ] Main leaderboard table
- [ ] Ranking system with sorting
- [ ] Real-time updates
- [ ] User highlighting
- [ ] Difficulty breakdown display

### 👑 Phase 4: Admin Panel (FINAL)
- [ ] Admin dashboard
- [ ] Manual user management
- [ ] Bulk operations
- [ ] System logs

---

## 🎨 Design System

The project uses a **Minecraft-inspired dark theme** with:
- Pixel font (Press Start 2P)
- Blocky UI elements with depth/shadows
- Retro color palette
- Pixelated scrollbars and inputs

### Custom CSS Classes:
- `.mc-button` - Minecraft-styled buttons
- `.mc-input` - Pixelated input fields
- `.mc-panel` - Container panels
- `.mc-table` - Leaderboard table

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes, Supabase (PostgreSQL)
- **Auth:** Supabase Auth with Google OAuth
- **External:** LeetCode GraphQL API
- **Deployment:** Vercel (recommended)

---

## 📁 Project Structure

```
leetboard/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── auth/             # Auth callbacks
│   │   ├── signup/           # Signup page
│   │   └── ...
│   ├── lib/
│   │   └── supabase/         # Supabase utilities
│   └── middleware.ts         # Auth middleware
├── public/                   # Static assets
├── DATABASE_SCHEMA.md        # SQL schema
├── PHASE1_SETUP.md          # Setup guide
└── PROJECT_ROADMAP.md       # Full roadmap
```

---

## 🔒 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_EMAIL=your-admin-email@example.com
```

See [`.env.local.example`](.env.local.example) for details.

---

## 🧪 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

---

## 🤝 Contributing

This is a personal project, but feel free to fork and customize it for your own use!

---

## 📝 License

MIT License - feel free to use this project however you'd like!

---

## 🎯 Roadmap

See [`PROJECT_ROADMAP.md`](PROJECT_ROADMAP.md) for the complete 4-phase development plan.

**Current Phase:** Phase 1 Complete ✅  
**Next Up:** Phase 2 - LeetCode Data Integration 🔄

---

**Built with ❤️ and lots of pixel art**
