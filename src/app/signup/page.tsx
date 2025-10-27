'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [step, setStep] = useState<'initial' | 'leetcode'>('initial')
  const [leetcodeUsername, setLeetcodeUsername] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError('Failed to sign in with Google')
      console.error(error)
    }
  }

  const validateLeetCodeUsername = async (username: string) => {
    if (!username.trim()) {
      setIsValid(false)
      setError('Please enter a username')
      return
    }

    setIsValidating(true)
    setError('')

    try {
      const response = await fetch('/api/validate-leetcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()

      if (data.valid) {
        setIsValid(true)
        setError('')
      } else {
        setIsValid(false)
        setError(data.message || 'Invalid LeetCode username')
      }
    } catch (err) {
      setIsValid(false)
      setError('Failed to validate username')
    } finally {
      setIsValidating(false)
    }
  }

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      await validateLeetCodeUsername(leetcodeUsername)
      return
    }

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Please sign in first')
        setStep('initial')
        return
      }

      // Update user profile with LeetCode username
      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          leetcode_username: leetcodeUsername,
          avatar_url: user.user_metadata.avatar_url,
          display_name: user.user_metadata.full_name,
        })

      if (updateError) {
        setError('Failed to save username: ' + updateError.message)
        return
      }

      // Redirect to home page
      router.push('/')
    } catch (err) {
      setError('An error occurred')
      console.error(err)
    }
  }

  // Check if user is already logged in
  useState(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if user has LeetCode username
        const { data: profile } = await supabase
          .from('users')
          .select('leetcode_username')
          .eq('id', user.id)
          .single()

        if (profile?.leetcode_username) {
          router.push('/')
        } else {
          setStep('leetcode')
        }
      }
    }
    checkUser()
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="mc-panel max-w-md w-full">
        <h1 className="text-2xl mb-8 text-center text-[var(--green)]">
          LEETBOARD
        </h1>

        {step === 'initial' && (
          <div className="space-y-6">
            <p className="text-center text-sm text-[var(--text-secondary)]">
              Join the ultimate LeetCode leaderboard!
            </p>

            <button
              onClick={handleGoogleSignIn}
              className="mc-button mc-button-green w-full"
            >
              Sign in with Google
            </button>

            {error && (
              <div className="p-4 bg-[#4d1a1a] border-2 border-[var(--red)] text-[var(--red)] text-xs">
                {error}
              </div>
            )}
          </div>
        )}

        {step === 'leetcode' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg mb-4 text-[var(--gold)]">
                Enter LeetCode Username
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mb-6">
                We need your LeetCode username to track your progress
              </p>
            </div>

            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => {
                    setLeetcodeUsername(e.target.value)
                    setIsValid(false)
                    setError('')
                  }}
                  onBlur={() => {
                    if (leetcodeUsername.trim()) {
                      validateLeetCodeUsername(leetcodeUsername)
                    }
                  }}
                  placeholder="Enter username..."
                  className="mc-input"
                  disabled={isValidating}
                />
                
                {isValidating && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <div className="mc-loading"></div>
                    Validating...
                  </div>
                )}
                
                {isValid && !isValidating && (
                  <div className="mt-2 text-xs text-[var(--green)]">
                    ✓ Username is valid!
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-[#4d1a1a] border-2 border-[var(--red)] text-[var(--red)] text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="mc-button mc-button-green w-full"
                disabled={isValidating}
              >
                {isValid ? 'Continue' : 'Validate'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
