import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="empty-state" style={{ padding: 'var(--space-20) 0' }}>
      <div className="empty-state__title">Writing not found</div>
      <p className="empty-state__text">This piece may have been moved or unpublished.</p>
      <Link href="/" className="btn btn--secondary">← Back to writings</Link>
    </div>
  )
}
