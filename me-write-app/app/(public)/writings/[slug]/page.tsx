import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { TiptapRenderer } from '@/components/editor/tiptap-renderer'
import { AuthorCard } from '@/components/public/author-card'
import { ShareButton } from '@/components/public/share-button'
import { extractPlainText } from '@/lib/sanitize'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface WritingPageProps {
  params: Promise<{ slug: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mewrite.vercel.app'

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
  const author = await db.author.findFirst()
  const url = `${baseUrl}/writings/${slug}`

  return {
    title: writing.title || 'Untitled',
    description,
    openGraph: {
      title: writing.title || 'Untitled',
      description,
      type: 'article',
      publishedTime: writing.date.toISOString(),
      url,
      siteName: 'MeWrite',
    },
    twitter: {
      card: 'summary_large_image',
      title: writing.title || 'Untitled',
      description,
      creator: author?.name ? `@${author.name.toLowerCase().replace(/\s+/g, '')}` : undefined,
    },
    alternates: {
      canonical: url,
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
  const plainText = extractPlainText(writing.content as any)
  const description = plainText.slice(0, 160) + (plainText.length > 160 ? '...' : '')
  const url = `${baseUrl}/writings/${slug}`

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: writing.title || 'Untitled',
    description,
    datePublished: writing.date.toISOString(),
    author: author ? {
      '@type': 'Person',
      name: author.name,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'MeWrite',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <div className="writing-header">
          <div className="writing-header__date">{formatDate(writing.date)}</div>
          <h1 className="writing-header__title">
            {writing.title || <em style={{ color: 'var(--muted)' }}>Untitled</em>}
          </h1>
          <div className="writing-header__meta">
            {author && (
              <span className="writing-header__author">by {author.name}</span>
            )}
            <ShareButton url={url} title={writing.title || 'Untitled'} />
          </div>
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
    </>
  )
}
