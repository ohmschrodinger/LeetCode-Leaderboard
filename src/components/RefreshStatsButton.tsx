'use client'

import { useState } from 'react'

export default function RefreshStatsButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [message, setMessage] = useState('')

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setMessage('')

    try {
      const response = await fetch('/api/update-stats', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✓ Stats updated successfully!')
        // Optionally trigger a page refresh or state update
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setMessage(`✗ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage('✗ Failed to update stats')
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="mc-button mc-button-green text-xs md:text-sm py-2 px-3 md:px-4 whitespace-nowrap"
      >
        {isRefreshing ? 'Updating...' : 'Refresh My Stats'}
      </button>
      
      {message && (
        <div className={`text-xs ${message.startsWith('✓') ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
          {message}
        </div>
      )}
    </div>
  )
}
