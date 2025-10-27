'use client'

import { LeaderboardUser } from '@/lib/leaderboard'
import LeaderboardRow from './LeaderboardRow'

interface LeaderboardTableProps {
  users: LeaderboardUser[]
  currentUserId: string | null
}

export default function LeaderboardTable({ users, currentUserId }: LeaderboardTableProps) {
  if (users.length === 0) {
    return (
      <div className="mc-panel text-center p-12">
        <p className="text-[var(--text-secondary)]">
          No users found. Start by signing up and adding your LeetCode username!
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="mc-table">
        <thead>
          <tr>
            <th className="w-20">Rank</th>
            <th className="min-w-[200px]">User Profile</th>
            <th className="min-w-[140px]">Solved (Weekly)</th>
            <th className="w-32">Points (Weekly)</th>
            <th className="w-32">Total Solved</th>
            <th className="w-32">Contest Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <LeaderboardRow
              key={user.id}
              user={user}
              isCurrentUser={user.id === currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
