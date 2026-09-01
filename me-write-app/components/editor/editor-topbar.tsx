"use client"

import Link from 'next/link'

interface EditorTopbarProps {
  label: string
  onSave: () => void
  saveStatus: string
  saving: boolean
}

export function EditorTopbar({ label, onSave, saveStatus, saving }: EditorTopbarProps) {
  return (
    <div className="editor-topbar">
      <Link href="/desk" className="btn btn--ghost btn--sm">← Desk</Link>
      <span className="editor-topbar__label">{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span className="save-status">{saveStatus}</span>
        <button
          className="btn btn--primary btn--sm"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
