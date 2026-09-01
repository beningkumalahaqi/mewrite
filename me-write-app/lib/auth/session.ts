import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const SESSION_COOKIE_NAME = 'mewrite-session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

async function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET environment variable is required')
  return new TextEncoder().encode(secret)
}

export async function createSession(userId: string): Promise<void> {
  const secret = await getSecret()
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function getSession(): Promise<{ userId: string } | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!token) return null

    const secret = await getSecret()
    const { payload } = await jwtVerify(token, secret)
    
    if (typeof payload.userId === 'string') {
      return { userId: payload.userId }
    }
    return null
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
