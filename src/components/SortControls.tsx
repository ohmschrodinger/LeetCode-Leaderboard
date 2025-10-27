'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SortOption } from '@/lib/leaderboard'

export default function SortControls() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = (searchParams.get('sort') as SortOption) || 'weekly_points'

  const handleSortChange = (sortBy: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortBy)
    router.push(`/?${params.toString()}`)
  }

  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'weekly_points', label: 'Weekly Points', icon: '🏆' },
    { value: 'total_solved', label: 'Total Solved', icon: '📊' },
    { value: 'contest_rating', label: 'Contest Rating', icon: '⭐' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-xs text-(--text-secondary) flex items-center">
        Sort by:
      </span>
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSortChange(option.value)}
          className={`mc-button text-xs py-2 px-4 ${
            currentSort === option.value ? 'mc-button-green' : ''
          }`}
        >
          {option.icon} {option.label}
        </button>
      ))}
    </div>
  )
}
