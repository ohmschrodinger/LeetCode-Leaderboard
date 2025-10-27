import { getLeaderboardData, getCurrentUserId, SortOption } from '@/lib/leaderboard'
import LeaderboardTable from '@/components/LeaderboardTable'
import RefreshStatsButton from '@/components/RefreshStatsButton'
import LeaderboardHeader from '@/components/LeaderboardHeader'
import SortControls from '@/components/SortControls'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface HomeProps {
  searchParams: Promise<{ sort?: SortOption }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const sortBy = params.sort || 'weekly_points'
  const users = await getLeaderboardData(sortBy)
  const currentUserId = await getCurrentUserId()

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <LeaderboardHeader />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <SortControls />
          
          {currentUserId && (
            <RefreshStatsButton />
          )}
        </div>

        {/* Leaderboard */}
        <div className="mc-panel p-0 overflow-hidden">
          <div className="p-6 bg-(--bg-hover) border-b-4 border-(--border-dark)">
            <h2 className="text-lg text-(--gold)">
              🏆 Weekly Leaderboard
            </h2>
            <p className="text-xs text-(--text-secondary) mt-2">
              Compete with others! Resets every Monday.
            </p>
          </div>
          
          <div className="p-6">
            <LeaderboardTable users={users} currentUserId={currentUserId} />
          </div>
        </div>

        {/* Stats Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mc-panel">
            <h3 className="text-sm text-(--green) mb-2">🎯 Points System</h3>
            <div className="text-xs text-(--text-secondary) space-y-1">
              <div>Easy: <span className="text-easy">1 point</span></div>
              <div>Medium: <span className="text-medium">2 points</span></div>
              <div>Hard: <span className="text-hard">3 points</span></div>
            </div>
          </div>

          <div className="mc-panel">
            <h3 className="text-sm text-(--green) mb-2">📊 Total Users</h3>
            <div className="text-2xl font-bold text-(--gold)">
              {users.length}
            </div>
          </div>

          <div className="mc-panel">
            <h3 className="text-sm text-(--green) mb-2">⏰ Next Reset</h3>
            <div className="text-xs text-(--text-secondary)">
              Every Monday 00:00 UTC
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
