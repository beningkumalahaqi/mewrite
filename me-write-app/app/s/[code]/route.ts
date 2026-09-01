import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface RedirectProps {
  params: Promise<{ code: string }>
}

export async function GET(req: NextRequest, { params }: RedirectProps) {
  const { code } = await params

  const shortUrl = await db.shortUrl.findUnique({
    where: { code },
  })

  if (!shortUrl) {
    redirect('/')
  }

  // Increment click count
  await db.shortUrl.update({
    where: { id: shortUrl.id },
    data: { clicks: { increment: 1 } },
  })

  redirect(shortUrl.targetUrl)
}
