import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { username } = await request.json()

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Username is required' },
        { status: 400 }
      )
    }

    // LeetCode GraphQL endpoint
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                realName
                userAvatar
              }
            }
          }
        `,
        variables: {
          username: username.trim(),
        },
      }),
    })

    const data = await response.json()

    if (data.data?.matchedUser) {
      return NextResponse.json({
        valid: true,
        username: data.data.matchedUser.username,
        avatar: data.data.matchedUser.profile?.userAvatar,
        realName: data.data.matchedUser.profile?.realName,
      })
    } else {
      return NextResponse.json({
        valid: false,
        message: 'LeetCode username not found',
      })
    }
  } catch (error) {
    console.error('Error validating LeetCode username:', error)
    return NextResponse.json(
      { valid: false, message: 'Failed to validate username' },
      { status: 500 }
    )
  }
}
