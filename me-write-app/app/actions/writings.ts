"use server"

import { revalidatePath, revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/middleware'
import { generateSlug } from '@/lib/slug'
import { isValidTiptapDocument, sanitizeTiptapContent } from '@/lib/sanitize'
import { createWritingSchema, updateWritingSchema, publishWritingSchema, deleteWritingSchema } from '@/lib/validations/writing'

export async function createWriting(data: { title?: string; date: string; content: object }) {
  await requireAuth()

  const validated = createWritingSchema.parse(data)

  if (!isValidTiptapDocument(validated.content)) {
    throw new Error('Invalid content format')
  }

  const slug = await generateSlug(validated.title || null, validated.date)
  const sanitizedContent = sanitizeTiptapContent(validated.content)

  const writing = await db.writing.create({
    data: {
      slug,
      title: validated.title || null,
      content: sanitizedContent as any,
      date: new Date(validated.date),
      published: false,
    },
  })

  return { id: writing.id, slug: writing.slug }
}

export async function updateWriting(data: { id: string; title?: string; date: string; content: object }) {
  await requireAuth()

  const validated = updateWritingSchema.parse(data)

  if (!isValidTiptapDocument(validated.content)) {
    throw new Error('Invalid content format')
  }

  const existing = await db.writing.findUnique({
    where: { id: validated.id },
  })

  if (!existing) {
    throw new Error('Writing not found')
  }

  const sanitizedContent = sanitizeTiptapContent(validated.content)

  const writing = await db.writing.update({
    where: { id: validated.id },
    data: {
      title: validated.title || null,
      content: sanitizedContent as any,
      date: new Date(validated.date),
    },
  })

  if (writing.published) {
    revalidatePath('/')
    revalidatePath(`/writings/${writing.slug}`)
    revalidateTag(`writing-${writing.slug}`, { expire: 0 })
    revalidateTag('home', { expire: 0 })
    revalidateTag('writings-list', { expire: 0 })
  }

  return { id: writing.id, slug: writing.slug }
}

export async function deleteWriting(data: { id: string }) {
  await requireAuth()

  const validated = deleteWritingSchema.parse(data)

  const existing = await db.writing.findUnique({
    where: { id: validated.id },
  })

  if (!existing) {
    throw new Error('Writing not found')
  }

  await db.writing.delete({
    where: { id: validated.id },
  })

  if (existing.published) {
    revalidatePath('/')
    revalidatePath(`/writings/${existing.slug}`)
    revalidateTag(`writing-${existing.slug}`, { expire: 0 })
    revalidateTag('home', { expire: 0 })
    revalidateTag('writings-list', { expire: 0 })
  }

  return { success: true }
}

export async function publishWriting(data: { id: string }) {
  await requireAuth()

  const validated = publishWritingSchema.parse(data)

  const existing = await db.writing.findUnique({
    where: { id: validated.id },
  })

  if (!existing) {
    throw new Error('Writing not found')
  }

  if (existing.published) {
    throw new Error('Writing is already published')
  }

  const writing = await db.writing.update({
    where: { id: validated.id },
    data: { published: true },
  })

  revalidatePath('/')
  revalidatePath(`/writings/${writing.slug}`)
  revalidateTag(`writing-${writing.slug}`, { expire: 0 })
  revalidateTag('home', { expire: 0 })
  revalidateTag('writings-list', { expire: 0 })

  return { success: true }
}

export async function unpublishWriting(data: { id: string }) {
  await requireAuth()

  const validated = publishWritingSchema.parse(data)

  const existing = await db.writing.findUnique({
    where: { id: validated.id },
  })

  if (!existing) {
    throw new Error('Writing not found')
  }

  if (!existing.published) {
    throw new Error('Writing is already unpublished')
  }

  const writing = await db.writing.update({
    where: { id: validated.id },
    data: { published: false },
  })

  revalidatePath('/')
  revalidatePath(`/writings/${writing.slug}`)
  revalidateTag(`writing-${writing.slug}`, { expire: 0 })
  revalidateTag('home', { expire: 0 })
  revalidateTag('writings-list', { expire: 0 })

  return { success: true }
}
