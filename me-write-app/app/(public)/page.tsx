import { cacheLife, cacheTag } from 'next/cache'
import { db } from '@/lib/db'
import { WritingList } from '@/components/public/writing-list'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeWrite — Writings',
  description: 'A collection of writings and thoughts. Explore published works on various topics.',
  openGraph: {
    title: 'MeWrite — Writings',
    description: 'A collection of writings and thoughts.',
    type: 'website',
  },
}

export default async function HomePage() {
  'use cache'
  cacheLife('max')
  cacheTag('home')

  const author = await db.author.findFirst()

  return (
    <main>
      <header style={{ marginBottom: 'var(--space-12)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 400, marginBottom: 'var(--space-3)' }}>
          {author?.name || 'HaqiZ'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--text-base)', maxWidth: '480px' }}>
          {author?.bio || 'Writer. Reader. Occasionally both at the same time.'}
        </p>
      </header>
      <WritingList />
    </main>
  )
}
