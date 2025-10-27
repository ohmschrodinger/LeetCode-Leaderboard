export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mc-panel mb-8">
          <h1 className="text-3xl mb-4 text-[var(--green)]">LEETBOARD</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Leaderboard coming soon in Phase 3...
          </p>
        </div>

        <div className="mc-panel">
          <h2 className="text-lg mb-4 text-[var(--gold)]">Phase 1 Complete!</h2>
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            Authentication and signup flow is ready. Check the PHASE1_SETUP.md file for next steps.
          </p>
        </div>
      </div>
    </div>
  );
}
