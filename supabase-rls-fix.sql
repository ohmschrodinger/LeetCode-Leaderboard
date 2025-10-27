-- =====================================================
-- Fix RLS Policies for leetcode_stats
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop the overly restrictive admin-only policy
DROP POLICY IF EXISTS "Admins can manage stats" ON public.leetcode_stats;

-- Allow users to insert their own stats
DROP POLICY IF EXISTS "Users can insert own stats" ON public.leetcode_stats;
CREATE POLICY "Users can insert own stats"
  ON public.leetcode_stats
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.id = user_id
    )
  );

-- Allow users to update their own stats
DROP POLICY IF EXISTS "Users can update own stats" ON public.leetcode_stats;
CREATE POLICY "Users can update own stats"
  ON public.leetcode_stats
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.id = user_id
    )
  );

-- Allow admins to manage all stats
DROP POLICY IF EXISTS "Admins can manage all stats" ON public.leetcode_stats;
CREATE POLICY "Admins can manage all stats"
  ON public.leetcode_stats
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- =====================================================
-- RLS Fix Complete! 
-- =====================================================
