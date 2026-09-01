import { redirect } from 'next/navigation'
import { getSession } from './session'

export async function requireAuth(): Promise<{ userId: string }> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}
