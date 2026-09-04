import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { published } = await req.json()

    const existing = await db.writing.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Writing not found' }, { status: 404 })
    }

    const writing = await db.writing.update({
      where: { id },
      data: { published },
    })

    revalidatePath('/')
    revalidatePath(`/writings/${writing.slug}`)
    revalidateTag(`writing-${writing.slug}`, { expire: 0 })
    revalidateTag('home', { expire: 0 })
    revalidateTag('writings-list', { expire: 0 })

    return NextResponse.json({ id: writing.id, published: writing.published })
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const existing = await db.writing.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Writing not found' }, { status: 404 })
    }

    await db.writing.delete({ where: { id } })

    if (existing.published) {
      revalidatePath('/')
      revalidatePath(`/writings/${existing.slug}`)
      revalidateTag(`writing-${existing.slug}`, { expire: 0 })
      revalidateTag('home', { expire: 0 })
      revalidateTag('writings-list', { expire: 0 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
