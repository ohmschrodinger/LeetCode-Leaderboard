import Image from 'next/image'
import { LeaderboardUser } from '@/lib/leaderboard'
import RankBadge from './RankBadge'

interface LeaderboardRowProps {
  user: LeaderboardUser
  isCurrentUser: boolean
}

export default function LeaderboardRow({ user, isCurrentUser }: LeaderboardRowProps) {
  const stats = user.stats

  // Default avatar if none provided
  const avatarUrl = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.leetcode_username)}&background=2d2d2d&color=55ff55&size=128`

  return (
    <tr className={isCurrentUser ? 'highlight' : ''}>
      {/* Rank */}
      <td className="text-center">
        <RankBadge rank={user.rank} />
      </td>

      {/* User Profile */}
      <td>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={avatarUrl}
              alt={user.leetcode_username}
              width={40}
              height={40}
              className="border-2 border-[var(--border-dark)]"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--text-primary)]">
              {user.display_name || user.leetcode_username}
            </span>
            {user.display_name && (
              <span className="text-xs text-[var(--text-secondary)]">
                @{user.leetcode_username}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Total Solved */}
      <td>
        <div className="flex flex-col">
          <span className="font-bold">{stats?.total_solved || 0}</span>
          <span className="text-xs text-[var(--text-secondary)]">
            <span className="text-easy">E:{stats?.total_easy || 0}</span>
            {', '}
            <span className="text-medium">M:{stats?.total_medium || 0}</span>
            {', '}
            <span className="text-hard">H:{stats?.total_hard || 0}</span>
          </span>
        </div>
      </td>

      {/* Weekly Points */}
      <td className="text-center">
        <span className="font-bold text-lg text-[var(--gold)]">
          {stats?.weekly_points || 0}
        </span>
      </td>

      {/* Total Solved (overall) */}
      <td className="text-center">
        <span className="font-bold">{stats?.total_solved || 0}</span>
      </td>

      {/* Contest Rating */}
      <td className="text-center">
        <span className="font-bold text-[var(--blue)]">
          {stats?.contest_rating || 0}
        </span>
      </td>
    </tr>
  )
}
