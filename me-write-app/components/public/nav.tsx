import Link from 'next/link'

export function PublicNav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav__brand">HaqiZ</Link>
      <div className="nav__links">
        <Link href="/" className="active">Writings</Link>
        <Link href="/desk">Desk</Link>
      </div>
    </nav>
  )
}
