import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { TiptapRenderer } from '@/components/editor/tiptap-renderer'
import { AuthorCard } from '@/components/public/author-card'
import { extractPlainText } from '@/lib/sanitize'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface WritingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params
  const writing = await db.writing.findUnique({
    where: { slug },
  })

  if (!writing || !writing.published) {
    return { title: 'Not Found' }
  }

  const plainText = extractPlainText(writing.content as any)
  const description = plainText.slice(0, 160) + (plainText.length > 160 ? '...' : '')

  return {
    title: writing.title || 'Untitled',
    description,
    openGraph: {
      title: writing.title || 'Untitled',
      description,
      type: 'article',
      publishedTime: writing.date.toISOString(),
    },
    twitter: {
      card: 'summary',
      title: writing.title || 'Untitled',
      description,
    },
  }
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { slug } = await params
  
  const writing = await db.writing.findUnique({
    where: { slug },
  })

  if (!writing || !writing.published) {
    notFound()
  }

  const author = await db.author.findFirst()

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main>
      <div className="writing-header">
        <div className="writing-header__date">{formatDate(writing.date)}</div>
        <h1 className="writing-header__title">
          {writing.title || <em style={{ color: 'var(--muted)' }}>Untitled</em>}
        </h1>
        {author && (
          <div className="writing-header__author">by {author.name}</div>
        )}
      </div>
      
      <article className="writing-body">
        <TiptapRenderer content={writing.content as any} />
      </article>

      <AuthorCard />

      <div style={{ marginTop: 'var(--space-12)' }}>
        <Link href="/" className="link-underline" style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>
          ← Back to writings
        </Link>
      </div>
    </main>
  )
}
