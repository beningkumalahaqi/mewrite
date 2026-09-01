import Link from 'next/link'
import { db } from '@/lib/db'
import { extractPlainText, truncate } from '@/lib/sanitize'
import type { Writing } from '@prisma/client'

function formatDate(dateStr: Date): string {
  return dateStr.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function WritingList() {
  const writings = await db.writing.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
  })

  if (writings.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">The desk is quiet.</div>
        <p className="empty-state__text">Writings will appear here once published.</p>
      </div>
    )
  }

  return (
    <div className="writing-list">
      {writings.map((writing) => (
        <WritingItem key={writing.id} writing={writing} />
      ))}
    </div>
  )
}

function WritingItem({ writing }: { writing: Writing }) {
  const plainText = extractPlainText(writing.content as any)
  const preview = truncate(plainText, 140)

  return (
    <Link href={`/writings/${writing.slug}`} className="writing-item" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
      <div className="writing-item__date">{formatDate(writing.date)}</div>
      <h2 className="writing-item__title">
        {writing.title || <em style={{ color: 'var(--muted)' }}>Untitled</em>}
      </h2>
      <p className="writing-item__preview">{preview}</p>
    </Link>
  )
}
