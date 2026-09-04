import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writings = await db.writing.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const writingUrls = writings.map((w) => ({
    url: `${BASE_URL}/writings/${w.slug}`,
    lastModified: w.updatedAt,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    ...writingUrls,
  ]
}
