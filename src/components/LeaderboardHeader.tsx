export default function LeaderboardHeader() {
  return (
    <div className="mc-panel">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#55ff55' }}>
            ⛏️ LEETBOARD
          </h1>
          <p className="text-sm text-(--text-secondary)">
            The Ultimate LeetCode Leaderboard Competition
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
          <span>Updates daily</span>
        </div>
      </div>
    </div>
  )
}
