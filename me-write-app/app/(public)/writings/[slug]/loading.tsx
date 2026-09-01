export default function WritingLoading() {
  return (
    <main>
      <div className="writing-header">
        <div className="writing-header__date">Loading...</div>
        <h1 className="writing-header__title" style={{ color: 'var(--muted)' }}>Untitled</h1>
        <div className="writing-header__author">by...</div>
      </div>
      <div className="writing-body" style={{ color: 'var(--muted)' }}>
        <p>Loading content...</p>
      </div>
    </main>
  )
}
