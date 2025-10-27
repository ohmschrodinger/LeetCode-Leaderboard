# Database Schema for Supabase

Execute these SQL commands in your Supabase SQL Editor:

## 1. Users Table (Extended from auth.users)

```sql
-- Create a public users table that extends the auth.users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  avatar_url TEXT,
  leetcode_username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read all user data
CREATE POLICY "Users can view all profiles"
  ON public.users
  FOR SELECT
  USING (TRUE);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## 2. LeetCode Stats Table

```sql
-- Create table to store LeetCode statistics
CREATE TABLE public.leetcode_stats (
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

-- Enable Row Level Security
ALTER TABLE public.leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Allow users to read all stats
CREATE POLICY "Users can view all stats"
  ON public.leetcode_stats
  FOR SELECT
  USING (TRUE);

-- Only admins can insert/update stats (you'll handle this in your backend)
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
```

## 3. Create Indexes for Performance

```sql
-- Indexes for faster queries
CREATE INDEX idx_users_leetcode_username ON public.users(leetcode_username);
CREATE INDEX idx_leetcode_stats_user_id ON public.leetcode_stats(user_id);
CREATE INDEX idx_leetcode_stats_weekly_points ON public.leetcode_stats(weekly_points DESC);
CREATE INDEX idx_leetcode_stats_total_solved ON public.leetcode_stats(total_solved DESC);
```

## 4. Function to Auto-Update timestamps

```sql
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 5. Set up your admin user

After you sign up with Google OAuth, run this SQL to make yourself an admin:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE public.users
SET is_admin = TRUE
WHERE email = 'your-email@example.com';
```

## Points Calculation Logic

Weekly points are calculated as:
- Easy problem: 1 point
- Medium problem: 2 points  
- Hard problem: 3 points

This will be implemented in the backend code when fetching/updating stats.
