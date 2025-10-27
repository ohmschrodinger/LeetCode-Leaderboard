import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Debug endpoint to check database contents
 * GET /api/debug/stats
 */
export async function GET() {
  const supabase = await createClient()

  // Check users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')

  // Check leetcode_stats
  const { data: stats, error: statsError } = await supabase
    .from('leetcode_stats')
    .select('*')

  // Check joined data
  const { data: joined, error: joinedError } = await supabase
    .from('users')
    .select(`
      id,
      leetcode_username,
      leetcode_stats (*)
    `)

  return NextResponse.json({
    users: {
      count: users?.length || 0,
      data: users,
      error: usersError?.message,
    },
    leetcode_stats: {
      count: stats?.length || 0,
      data: stats,
      error: statsError?.message,
    },
    joined: {
      count: joined?.length || 0,
      data: joined,
      error: joinedError?.message,
    },
  })
}
