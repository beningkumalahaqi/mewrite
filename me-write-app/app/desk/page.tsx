import Link from 'next/link'
import { db } from '@/lib/db'
import { DeskWritingList } from '@/components/desk/writing-list'

export const dynamic = 'force-dynamic'

export default async function DeskPage() {
  const writings = await db.writing.findMany({
    orderBy: { date: 'desc' },
  })

  return (
    <main>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 400 }}>Desk</h1>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>Your writings</p>
        </div>
        <Link href="/desk/writings/new" className="btn btn--primary">New writing →</Link>
      </header>
      <DeskWritingList initialWritings={writings} />
    </main>
  )
}
