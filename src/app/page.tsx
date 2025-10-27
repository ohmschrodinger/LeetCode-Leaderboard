import RefreshStatsButton from '@/components/RefreshStatsButton'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mc-panel mb-8">
          <h1 className="text-3xl mb-4 text-(--green)">LEETBOARD</h1>
          <p className="text-sm text-(--text-secondary) mb-6">
            Phase 2 Complete! LeetCode stats integration is ready.
          </p>
          
          <RefreshStatsButton />
        </div>

        <div className="mc-panel">
          <h2 className="text-lg mb-4 text-(--gold)">What&apos;s Working:</h2>
          <ul className="text-xs text-(--text-secondary) space-y-2 list-none">
            <li>✓ LeetCode API integration</li>
            <li>✓ Weekly stats tracking</li>
            <li>✓ Automated hourly updates (when deployed)</li>
            <li>✓ Manual refresh button</li>
            <li>⏳ Leaderboard UI (Phase 3)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
