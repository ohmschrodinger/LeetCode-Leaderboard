import { createClient } from '@/lib/supabase/server'

export interface LeaderboardUser {
  id: string
  email: string
  leetcode_username: string
  display_name: string | null
  avatar_url: string | null
  stats: {
    total_solved: number
    total_easy: number
    total_medium: number
    total_hard: number
    weekly_solved: number
    weekly_easy: number
    weekly_medium: number
    weekly_hard: number
    weekly_points: number
    contest_rating: number
    last_updated: string
  } | null
  rank: number
}

export type SortOption = 'weekly_points' | 'total_solved' | 'contest_rating'

export async function getLeaderboardData(
  sortBy: SortOption = 'weekly_points'
): Promise<LeaderboardUser[]> {
  const supabase = await createClient()

  // Fetch all users with their stats
  const { data: users, error } = await supabase
    .from('users')
    .select(
      `
      id,
      email,
      leetcode_username,
      display_name,
      avatar_url,
      leetcode_stats (
        total_solved,
        total_easy,
        total_medium,
        total_hard,
        weekly_solved,
        weekly_easy,
        weekly_medium,
        weekly_hard,
        weekly_points,
        contest_rating,
        last_updated
      )
    `
    )

  if (error || !users) {
    console.error('Error fetching leaderboard:', error)
    return []
  }

  // Transform and add ranks
  const leaderboardUsers: LeaderboardUser[] = users.map((user: any) => {
    // Supabase returns the related data as an object, not an array
    const stats = user.leetcode_stats || null
    
    return {
      id: user.id,
      email: user.email,
      leetcode_username: user.leetcode_username,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      stats: stats,
      rank: 0, // Will be calculated after sorting
    }
  })

  // Sort based on selected criteria
  leaderboardUsers.sort((a, b) => {
    const aValue = a.stats?.[sortBy] || 0
    const bValue = b.stats?.[sortBy] || 0
    
    // Primary sort
    if (bValue !== aValue) {
      return bValue - aValue
    }
    
    // Tiebreaker 1: weekly points (if not already sorting by it)
    if (sortBy !== 'weekly_points') {
      const aWeekly = a.stats?.weekly_points || 0
      const bWeekly = b.stats?.weekly_points || 0
      if (bWeekly !== aWeekly) return bWeekly - aWeekly
    }
    
    // Tiebreaker 2: total solved (if not already sorting by it)
    if (sortBy !== 'total_solved') {
      const aTotal = a.stats?.total_solved || 0
      const bTotal = b.stats?.total_solved || 0
      if (bTotal !== aTotal) return bTotal - aTotal
    }
    
    // Tiebreaker 3: alphabetical by username
    return a.leetcode_username.localeCompare(b.leetcode_username)
  })

  // Assign ranks (handle ties)
  let currentRank = 1
  leaderboardUsers.forEach((user, index) => {
    if (index > 0) {
      const prev = leaderboardUsers[index - 1]
      const currentValue = user.stats?.[sortBy] || 0
      const prevValue = prev.stats?.[sortBy] || 0
      
      if (currentValue !== prevValue) {
        currentRank = index + 1
      }
    }
    user.rank = currentRank
  })

  return leaderboardUsers
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id || null
}
