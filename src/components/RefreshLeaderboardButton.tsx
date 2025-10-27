'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RefreshLeaderboardButton() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="mc-button text-xs py-2 px-4"
      title="Reload leaderboard data"
    >
      {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
    </button>
  )
}
