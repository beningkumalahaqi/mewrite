import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateCode(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Check if URL already has a short code
    const existing = await db.shortUrl.findFirst({
      where: { targetUrl: url },
    })

    if (existing) {
      return NextResponse.json({ code: existing.code })
    }

    // Generate unique code
    let code = generateCode()
    let attempts = 0
    while (attempts < 10) {
      const exists = await db.shortUrl.findUnique({ where: { code } })
      if (!exists) break
      code = generateCode()
      attempts++
    }

    const shortUrl = await db.shortUrl.create({
      data: {
        code,
        targetUrl: url,
      },
    })

    return NextResponse.json({ code: shortUrl.code })
  } catch (error) {
    console.error('Shorten URL error:', error)
    return NextResponse.json({ error: 'Failed to shorten URL' }, { status: 500 })
  }
}
