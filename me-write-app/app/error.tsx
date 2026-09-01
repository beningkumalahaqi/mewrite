"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="empty-state" style={{ padding: 'var(--space-20) 0' }}>
      <div className="empty-state__title">Something went wrong</div>
      <p className="empty-state__text">An unexpected error occurred.</p>
      <button onClick={reset} className="btn btn--secondary">
        Try again
      </button>
    </div>
  )
}
