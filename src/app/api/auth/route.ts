import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) {
      // Still do a comparison to avoid leaking length info via timing
      crypto.timingSafeEqual(bufA, bufA)
      return false
    }
    return crypto.timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body as Record<string, unknown>

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid credentials format' },
        { status: 400 }
      )
    }

    if (username.length > 200 || password.length > 200) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // These are server-side only - not exposed to browser
    const validUsername = process.env.ADMIN_USERNAME
    const validPassword = process.env.ADMIN_PASSWORD

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (timingSafeCompare(username, validUsername) && timingSafeCompare(password, validPassword)) {
      // Cryptographically secure random token
      const token = crypto.randomBytes(32).toString('hex')

      const response = NextResponse.json({ success: true })

      // Set HTTP-only cookie (can't be read by JavaScript)
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')

  if (token?.value) {
    return NextResponse.json({ authenticated: true })
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_token')
  return response
}
