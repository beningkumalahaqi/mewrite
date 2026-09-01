import Link from 'next/link'
import { LogoutButton } from './logout-button'

export function DeskNav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav__brand">MeWrite</Link>
      <div className="nav__links">
        <Link href="/">Public site</Link>
        <Link href="/desk/settings">Settings</Link>
        <LogoutButton />
      </div>
    </nav>
  )
}
