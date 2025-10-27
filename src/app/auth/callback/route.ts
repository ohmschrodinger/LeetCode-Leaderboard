import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if user has LeetCode username
      const { data: { user } } = await supabase.auth.getUser()
      
      // Determine the base URL for redirects
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const baseUrl = isLocalEnv 
        ? origin 
        : forwardedHost 
          ? `https://${forwardedHost}` 
          : origin

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('leetcode_username')
          .eq('id', user.id)
          .single()

        if (profile?.leetcode_username) {
          // User already has username, go to home
          return NextResponse.redirect(`${baseUrl}${next}`)
        } else {
          // User needs to enter LeetCode username
          return NextResponse.redirect(`${baseUrl}/signup`)
        }
      }
      
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
