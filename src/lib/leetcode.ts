// LeetCode API integration utilities

export interface LeetCodeUserStats {
  username: string
  realName: string | null
  avatar: string | null
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  contestRating: number
  ranking: number
}

export interface LeetCodeProfile {
  username: string
  realName: string | null
  avatar: string | null
  ranking: number
}

/**
 * Fetch user profile from LeetCode
 */
export async function fetchLeetCodeProfile(
  username: string
): Promise<LeetCodeProfile | null> {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                realName
                userAvatar
                ranking
              }
            }
          }
        `,
        variables: { username },
      }),
    })

    const data = await response.json()

    if (data.data?.matchedUser) {
      const user = data.data.matchedUser
      return {
        username: user.username,
        realName: user.profile?.realName || null,
        avatar: user.profile?.userAvatar || null,
        ranking: user.profile?.ranking || 0,
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching LeetCode profile:', error)
    return null
  }
}

/**
 * Fetch complete user statistics from LeetCode
 */
export async function fetchLeetCodeStats(
  username: string
): Promise<LeetCodeUserStats | null> {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                realName
                userAvatar
                ranking
              }
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            userContestRanking(username: $username) {
              rating
            }
          }
        `,
        variables: { username },
      }),
    })

    const data = await response.json()

    if (!data.data?.matchedUser) {
      return null
    }

    const user = data.data.matchedUser
    const submissions = user.submitStatsGlobal?.acSubmissionNum || []
    
    // Parse submission counts by difficulty
    const allSubmissions = submissions.find((s: any) => s.difficulty === 'All')
    const easySubmissions = submissions.find((s: any) => s.difficulty === 'Easy')
    const mediumSubmissions = submissions.find((s: any) => s.difficulty === 'Medium')
    const hardSubmissions = submissions.find((s: any) => s.difficulty === 'Hard')

    return {
      username: user.username,
      realName: user.profile?.realName || null,
      avatar: user.profile?.userAvatar || null,
      totalSolved: allSubmissions?.count || 0,
      easySolved: easySubmissions?.count || 0,
      mediumSolved: mediumSubmissions?.count || 0,
      hardSolved: hardSubmissions?.count || 0,
      contestRating: Math.round(data.data.userContestRanking?.rating || 0),
      ranking: user.profile?.ranking || 0,
    }
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error)
    return null
  }
}

/**
 * Calculate weekly stats based on current and baseline stats
 */
export function calculateWeeklyStats(
  currentStats: LeetCodeUserStats,
  baselineEasy: number,
  baselineMedium: number,
  baselineHard: number
) {
  const weeklyEasy = Math.max(0, currentStats.easySolved - baselineEasy)
  const weeklyMedium = Math.max(0, currentStats.mediumSolved - baselineMedium)
  const weeklyHard = Math.max(0, currentStats.hardSolved - baselineHard)
  
  const weeklySolved = weeklyEasy + weeklyMedium + weeklyHard
  
  // Calculate points: Easy = 1pt, Medium = 2pt, Hard = 3pt
  const weeklyPoints = (weeklyEasy * 1) + (weeklyMedium * 2) + (weeklyHard * 3)

  return {
    weeklySolved,
    weeklyEasy,
    weeklyMedium,
    weeklyHard,
    weeklyPoints,
  }
}

/**
 * Check if we need to start a new week
 * Weeks start on Monday at 00:00 UTC
 */
export function shouldResetWeek(lastWeekStart: Date): boolean {
  const now = new Date()
  const currentWeekStart = getWeekStart(now)
  const lastWeek = getWeekStart(lastWeekStart)
  
  return currentWeekStart.getTime() > lastWeek.getTime()
}

/**
 * Get the start of the week (Monday 00:00 UTC)
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
  const weekStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff, 0, 0, 0, 0))
  return weekStart
}
