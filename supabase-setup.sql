-- =====================================================
-- LeetBoard Database Setup Script
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- 1. Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  avatar_url TEXT,
  leetcode_username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create leetcode_stats table
CREATE TABLE IF NOT EXISTS public.leetcode_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Total stats
  total_solved INTEGER DEFAULT 0,
  total_easy INTEGER DEFAULT 0,
  total_medium INTEGER DEFAULT 0,
  total_hard INTEGER DEFAULT 0,
  contest_rating INTEGER DEFAULT 0,
  
  -- Weekly stats (resets every week)
  weekly_solved INTEGER DEFAULT 0,
  weekly_easy INTEGER DEFAULT 0,
  weekly_medium INTEGER DEFAULT 0,
  weekly_hard INTEGER DEFAULT 0,
  weekly_points INTEGER DEFAULT 0,
  
  -- Timestamps
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  week_start TIMESTAMP WITH TIME ZONE DEFAULT DATE_TRUNC('week', NOW()),
  
  UNIQUE(user_id)
);

-- 3. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leetcode_stats ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for users table
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles"
  ON public.users
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5. Create RLS Policies for leetcode_stats table
DROP POLICY IF EXISTS "Users can view all stats" ON public.leetcode_stats;
CREATE POLICY "Users can view all stats"
  ON public.leetcode_stats
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Admins can manage stats" ON public.leetcode_stats;
CREATE POLICY "Admins can manage stats"
  ON public.leetcode_stats
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_leetcode_username ON public.users(leetcode_username);
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON public.leetcode_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_weekly_points ON public.leetcode_stats(weekly_points DESC);
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_total_solved ON public.leetcode_stats(total_solved DESC);

-- 7. Create function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Setup Complete! 
-- =====================================================
-- Next steps:
-- 1. After you sign up with Google, run this to become admin:
--    UPDATE public.users SET is_admin = TRUE WHERE email = 'your-email@gmail.com';
-- =====================================================
