import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest) {
  try {
    const { id, published } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const existing = await db.writing.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Writing not found' }, { status: 404 })
    }

    const writing = await db.writing.update({
      where: { id },
      data: { published },
    })

    return NextResponse.json({ id: writing.id, published: writing.published })
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const existing = await db.writing.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Writing not found' }, { status: 404 })
    }

    await db.writing.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
