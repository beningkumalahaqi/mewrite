"use server"

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/middleware'
import { updateAuthorSchema } from '@/lib/validations/auth'

export async function updateAuthor(data: { name: string; bio?: string; imageUrl?: string | null }) {
  await requireAuth()

  const validated = updateAuthorSchema.parse(data)

  // Get the single author record
  let author = await db.author.findFirst()
  
  if (!author) {
    // Create if doesn't exist
    author = await db.author.create({
      data: {
        name: validated.name,
        bio: validated.bio || null,
        imageUrl: validated.imageUrl || null,
      },
    })
  } else {
    await db.author.update({
      where: { id: author.id },
      data: {
        name: validated.name,
        bio: validated.bio || null,
        imageUrl: validated.imageUrl || null,
      },
    })
  }

  revalidatePath('/')
  revalidatePath('/', 'layout')

  return { success: true }
}
