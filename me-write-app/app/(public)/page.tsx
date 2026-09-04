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
      <header className="home-header" style={{ paddingTop: 'var(--space-4)', marginBottom: 'var(--space-20)', display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 'var(--space-6)' }}>
        {author?.imageUrl && (
          <img
            src={author.imageUrl}
            alt={author.name || 'Author'}
            style={{ width: 96, height: 96, borderRadius: 10, objectFit: 'cover' }}
          />
        )}
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 'var(--space-1)' }}>
            {author?.name || 'HaqiZ'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {author?.bio || 'Writer. Reader. Occasionally both at the same time.'}
          </p>
        </div>
      </header>
      <WritingList />
    </main>
  )
}
