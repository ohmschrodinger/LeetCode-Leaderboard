interface RankBadgeProps {
  rank: number
}

export default function RankBadge({ rank }: RankBadgeProps) {
  if (rank === 1) {
    return (
      <div className="rank-badge rank-1">
        #{rank}
      </div>
    )
  }
  
  if (rank === 2) {
    return (
      <div className="rank-badge rank-2">
        #{rank}
      </div>
    )
  }
  
  if (rank === 3) {
    return (
      <div className="rank-badge rank-3">
        #{rank}
      </div>
    )
  }
  
  return (
    <div className="font-bold text-[var(--text-secondary)]">
      #{rank}
    </div>
  )
}
