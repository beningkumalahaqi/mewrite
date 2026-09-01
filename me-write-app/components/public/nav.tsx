import Link from 'next/link'
import Image from 'next/image'

export function PublicNav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav__brand">
        <Image src="/MeWriteLogo.png" alt="MeWrite" width={28} height={28} priority />
        MeWrite
      </Link>
      <div className="nav__links">
        <Link href="/" className="active">Writings</Link>
        <Link href="/desk">Desk</Link>
      </div>
    </nav>
  )
}
