export default function DeskLoading() {
  return (
    <main>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 400 }}>Desk</h1>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>Your writings</p>
        </div>
      </header>
      <div style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>Loading writings...</div>
    </main>
  )
}
