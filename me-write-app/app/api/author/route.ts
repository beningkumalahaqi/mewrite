import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest) {
  try {
    const { name, bio, imageUrl } = await req.json()

    let author = await db.author.findFirst()

    if (!author) {
      author = await db.author.create({
        data: {
          name: name || 'Author',
          bio: bio || null,
          imageUrl: imageUrl || null,
        },
      })
    } else {
      author = await db.author.update({
        where: { id: author.id },
        data: {
          name: name || author.name,
          bio: bio !== undefined ? bio : author.bio,
          imageUrl: imageUrl !== undefined ? imageUrl : author.imageUrl,
        },
      })
    }

    return NextResponse.json({
      id: author.id,
      name: author.name,
      bio: author.bio,
      imageUrl: author.imageUrl,
    })
  } catch (error) {
    console.error('Update author error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
