"use client"

import { useState } from 'react'
import { AvatarUpload } from '@/components/ui/avatar-upload'

interface SettingsFormProps {
  initialData: {
    name: string
    bio?: string | null
    imageUrl?: string | null
  }
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [name, setName] = useState(initialData.name)
  const [bio, setBio] = useState(initialData.bio || '')
  const [imageUrl, setImageUrl] = useState<string | null>(initialData.imageUrl || null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      await fetch('/api/author', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim() || undefined,
          imageUrl: imageUrl,
        }),
      })
      setSaveMsg(true)
      setTimeout(() => setSaveMsg(false), 2500)
    } catch (error) {
      console.error('Save failed:', error)
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <AvatarUpload
        initialImageUrl={initialData.imageUrl}
        name={name}
        onImageChange={setImageUrl}
      />

      <div className="form-group">
        <label className="form-label" htmlFor="author-name">Author name</label>
        <input
          type="text"
          className="form-input"
          id="author-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="author-bio">Short bio</label>
        <textarea
          className="form-textarea"
          id="author-bio"
          style={{ minHeight: '120px' }}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A few sentences about yourself."
        />
        <div className="form-hint">This appears on your public writings.</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
        <span
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--muted)',
            opacity: saveMsg ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        >
          Settings saved.
        </span>
      </div>
    </form>
  )
}
