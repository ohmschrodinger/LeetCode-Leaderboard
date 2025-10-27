import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchLeetCodeStats,
  calculateWeeklyStats,
  shouldResetWeek,
  getWeekStart,
} from '@/lib/leetcode'

/**
 * API Route: Update stats for a specific user or current authenticated user
 * POST /api/update-stats?username=leetcode_username (admin only)
 * POST /api/update-stats (updates current user)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get target username from query params or use current user
    const { searchParams } = new URL(request.url)
    const targetLeetCodeUsername = searchParams.get('username')

    let targetUserId = user.id
    let leetcodeUsername = ''

    if (targetLeetCodeUsername) {
      // Admin trying to update another user's stats
      const { data: adminUser } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!adminUser?.is_admin) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      // Get target user
      const { data: targetUser } = await supabase
        .from('users')
        .select('id, leetcode_username')
        .eq('leetcode_username', targetLeetCodeUsername)
        .single()

      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      targetUserId = targetUser.id
      leetcodeUsername = targetUser.leetcode_username
    } else {
      // User updating their own stats
      const { data: currentUser } = await supabase
        .from('users')
        .select('leetcode_username')
        .eq('id', user.id)
        .single()

      if (!currentUser) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      leetcodeUsername = currentUser.leetcode_username
    }

    // Fetch stats from LeetCode
    const leetcodeStats = await fetchLeetCodeStats(leetcodeUsername)

    if (!leetcodeStats) {
      return NextResponse.json(
        { error: 'Failed to fetch LeetCode stats' },
        { status: 500 }
      )
    }

    console.log('Fetched LeetCode stats for', leetcodeUsername, ':', leetcodeStats)

    // Get or create user stats record
    const { data: existingStats } = await supabase
      .from('leetcode_stats')
      .select('*')
      .eq('user_id', targetUserId)
      .single()

    const now = new Date()
    let weeklyStats

    if (!existingStats) {
      // First time - create new record with current stats as baseline
      console.log('No existing stats found, creating new record for user:', targetUserId)
      weeklyStats = {
        weeklySolved: 0,
        weeklyEasy: 0,
        weeklyMedium: 0,
        weeklyHard: 0,
        weeklyPoints: 0,
      }

      const { error: insertError } = await supabase
        .from('leetcode_stats')
        .insert({
          user_id: targetUserId,
          total_solved: leetcodeStats.totalSolved,
          total_easy: leetcodeStats.easySolved,
          total_medium: leetcodeStats.mediumSolved,
          total_hard: leetcodeStats.hardSolved,
          contest_rating: leetcodeStats.contestRating,
          baseline_easy: leetcodeStats.easySolved,
          baseline_medium: leetcodeStats.mediumSolved,
          baseline_hard: leetcodeStats.hardSolved,
          weekly_solved: 0,
          weekly_easy: 0,
          weekly_medium: 0,
          weekly_hard: 0,
          weekly_points: 0,
          week_start: getWeekStart(now),
          last_updated: now,
        })

      if (insertError) {
        console.error('Error inserting stats:', insertError)
        return NextResponse.json(
          { error: 'Failed to save stats', details: insertError },
          { status: 500 }
        )
      }

      console.log('Successfully created stats record for user:', targetUserId)
    } else {
      // Check if we need to reset for a new week
      console.log('Existing stats found, updating for user:', targetUserId)
      const needsReset = shouldResetWeek(new Date(existingStats.week_start))

      let baselineEasy = existingStats.baseline_easy || existingStats.total_easy
      let baselineMedium = existingStats.baseline_medium || existingStats.total_medium
      let baselineHard = existingStats.baseline_hard || existingStats.total_hard

      if (needsReset) {
        // New week - reset baseline to current total stats
        baselineEasy = leetcodeStats.easySolved
        baselineMedium = leetcodeStats.mediumSolved
        baselineHard = leetcodeStats.hardSolved
      }

      // Calculate weekly progress
      weeklyStats = calculateWeeklyStats(
        leetcodeStats,
        baselineEasy,
        baselineMedium,
        baselineHard
      )

      // Update existing record
      const { error: updateError } = await supabase
        .from('leetcode_stats')
        .update({
          total_solved: leetcodeStats.totalSolved,
          total_easy: leetcodeStats.easySolved,
          total_medium: leetcodeStats.mediumSolved,
          total_hard: leetcodeStats.hardSolved,
          contest_rating: leetcodeStats.contestRating,
          baseline_easy: baselineEasy,
          baseline_medium: baselineMedium,
          baseline_hard: baselineHard,
          weekly_solved: weeklyStats.weeklySolved,
          weekly_easy: weeklyStats.weeklyEasy,
          weekly_medium: weeklyStats.weeklyMedium,
          weekly_hard: weeklyStats.weeklyHard,
          weekly_points: weeklyStats.weeklyPoints,
          week_start: needsReset ? getWeekStart(now) : existingStats.week_start,
          last_updated: now,
        })
        .eq('user_id', targetUserId)

      if (updateError) {
        console.error('Error updating stats:', updateError)
        return NextResponse.json(
          { error: 'Failed to update stats', details: updateError },
          { status: 500 }
        )
      }

      console.log('Successfully updated stats for user:', targetUserId)
    }

    return NextResponse.json({
      success: true,
      stats: {
        ...leetcodeStats,
        ...weeklyStats,
      },
    })
  } catch (error) {
    console.error('Error in update-stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
