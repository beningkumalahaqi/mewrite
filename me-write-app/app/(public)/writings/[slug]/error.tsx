"use client"

import Link from 'next/link'

export default function WritingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="empty-state" style={{ padding: 'var(--space-20) 0' }}>
      <div className="empty-state__title">Unable to load writing</div>
      <p className="empty-state__text">There was a problem loading this writing.</p>
      <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
        <button onClick={reset} className="btn btn--secondary">
          Try again
        </button>
        <Link href="/" className="btn btn--ghost">
          ← Back to writings
        </Link>
      </div>
    </div>
  )
}
