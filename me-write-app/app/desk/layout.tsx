import { requireAuth } from '@/lib/auth/middleware'
import { DeskNav } from '@/components/desk/nav'
import { PublicFooter } from '@/components/public/footer'

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  
  return (
    <div className="container">
      <DeskNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}
