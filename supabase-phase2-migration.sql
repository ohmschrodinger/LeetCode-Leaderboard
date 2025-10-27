-- Phase 2: Add baseline stats columns for weekly tracking
-- Run this in Supabase SQL Editor

-- Add baseline columns to track week start stats
ALTER TABLE public.leetcode_stats 
ADD COLUMN IF NOT EXISTS baseline_easy INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS baseline_medium INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS baseline_hard INTEGER DEFAULT 0;

-- Update existing records to set baseline from current total
UPDATE public.leetcode_stats
SET 
  baseline_easy = total_easy,
  baseline_medium = total_medium,
  baseline_hard = total_hard
WHERE baseline_easy IS NULL OR baseline_easy = 0;

-- Done! The baseline columns are now ready for weekly tracking
