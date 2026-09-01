"use client"

export default function DeskError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="empty-state" style={{ padding: 'var(--space-20) 0' }}>
      <div className="empty-state__title">Unable to load desk</div>
      <p className="empty-state__text">There was a problem loading your desk.</p>
      <button onClick={reset} className="btn btn--secondary">
        Try again
      </button>
    </div>
  )
}
