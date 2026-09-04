import { db } from '@/lib/db'
import { SettingsForm } from '@/components/desk/settings-form'

export const instant = false

export default async function SettingsPage() {
  let author = await db.author.findFirst()

  if (!author) {
    author = await db.author.create({
      data: {
        name: 'HaqiZ',
        bio: 'Writer. Reader. Occasionally both at the same time.',
      },
    })
  }

  return (
    <main>
      <div className="settings-page">
        <h1 className="settings-page__title">Author Settings</h1>
        <SettingsForm
          initialData={{
            name: author.name,
            bio: author.bio,
            imageUrl: author.imageUrl,
          }}
        />
      </div>
    </main>
  )
}
