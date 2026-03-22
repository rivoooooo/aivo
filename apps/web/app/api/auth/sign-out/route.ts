import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth.api.getSession()
    if (session) {
      await auth.api.signOut({
        headers: {
          cookie: session.session.token,
        },
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ success: false, error: 'sign out failed' })
  }
}
