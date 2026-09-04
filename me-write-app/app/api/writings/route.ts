import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'
import { isValidTiptapDocument, sanitizeTiptapContent } from '@/lib/sanitize'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { title, date, content } = data

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    if (!isValidTiptapDocument(content)) {
      return NextResponse.json({ error: 'Invalid content format' }, { status: 400 })
    }

    const slug = await generateSlug(title || null, date)
    const sanitizedContent = sanitizeTiptapContent(content)

    const writing = await db.writing.create({
      data: {
        slug,
        title: title || null,
        content: sanitizedContent as any,
        date: new Date(date),
        published: false,
      },
    })

    return NextResponse.json({ id: writing.id, slug: writing.slug })
  } catch (error) {
    console.error('Create writing error:', error)
    return NextResponse.json({ error: 'Failed to create writing' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const { id, title, date, content } = data

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    if (!isValidTiptapDocument(content)) {
      return NextResponse.json({ error: 'Invalid content format' }, { status: 400 })
    }

    const existing = await db.writing.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Writing not found' }, { status: 404 })
    }

    const sanitizedContent = sanitizeTiptapContent(content)

    const writing = await db.writing.update({
      where: { id },
      data: {
        title: title || null,
        content: sanitizedContent as any,
        date: new Date(date),
      },
    })

    if (existing.published) {
      revalidatePath('/')
      revalidatePath(`/writings/${writing.slug}`)
      revalidateTag(`writing-${writing.slug}`, { expire: 0 })
      revalidateTag('home', { expire: 0 })
      revalidateTag('writings-list', { expire: 0 })
    }

    return NextResponse.json({ id: writing.id, slug: writing.slug })
  } catch (error) {
    console.error('Update writing error:', error)
    return NextResponse.json({ error: 'Failed to update writing' }, { status: 500 })
  }
}
