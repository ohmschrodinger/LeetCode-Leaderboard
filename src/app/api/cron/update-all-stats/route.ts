import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchLeetCodeStats,
  calculateWeeklyStats,
  shouldResetWeek,
  getWeekStart,
} from '@/lib/leetcode'

/**
 * Cron Job API Route: Update stats for all users
 * GET /api/cron/update-all-stats
 * 
 * This endpoint should be called hourly by Vercel Cron Jobs
 * Secured with Authorization header matching CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with service role for admin access
    const supabase = await createClient()

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, leetcode_username')

    if (usersError || !users) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    const results = {
      total: users.length,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Update each user's stats
    for (const user of users) {
      try {
        const leetcodeStats = await fetchLeetCodeStats(user.leetcode_username)

        if (!leetcodeStats) {
          results.failed++
          results.errors.push(`Failed to fetch stats for ${user.leetcode_username}`)
          continue
        }

        // Get existing stats
        const { data: existingStats } = await supabase
          .from('leetcode_stats')
          .select('*')
          .eq('user_id', user.id)
          .single()

        const now = new Date()

        if (!existingStats) {
          // Create new stats record
          const { error: insertError } = await supabase
            .from('leetcode_stats')
            .insert({
              user_id: user.id,
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
            results.failed++
            results.errors.push(`Insert error for ${user.leetcode_username}: ${insertError.message}`)
            continue
          }
        } else {
          // Update existing stats
          const needsReset = shouldResetWeek(new Date(existingStats.week_start))

          let baselineEasy = existingStats.baseline_easy || existingStats.total_easy
          let baselineMedium = existingStats.baseline_medium || existingStats.total_medium
          let baselineHard = existingStats.baseline_hard || existingStats.total_hard

          if (needsReset) {
            baselineEasy = leetcodeStats.easySolved
            baselineMedium = leetcodeStats.mediumSolved
            baselineHard = leetcodeStats.hardSolved
          }

          const weeklyStats = calculateWeeklyStats(
            leetcodeStats,
            baselineEasy,
            baselineMedium,
            baselineHard
          )

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
            .eq('user_id', user.id)

          if (updateError) {
            results.failed++
            results.errors.push(`Update error for ${user.leetcode_username}: ${updateError.message}`)
            continue
          }
        }

        results.updated++

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        results.failed++
        results.errors.push(`Exception for ${user.leetcode_username}: ${error}`)
      }
    }

    console.log('Cron job completed:', results)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
