"use server"

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { comparePassword } from '@/lib/auth/password'
import { createSession, destroySession } from '@/lib/auth/session'
import { loginSchema } from '@/lib/validations/auth'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validated = loginSchema.parse({ email, password })

  const user = await db.user.findUnique({
    where: { email: validated.email },
  })

  if (!user) {
    return { error: 'Invalid email or password' }
  }

  const isValid = await comparePassword(validated.password, user.passwordHash)
  if (!isValid) {
    return { error: 'Invalid email or password' }
  }

  await createSession(user.id)
  redirect('/desk')
}

export async function logout() {
  await destroySession()
  redirect('/login')
}
