"use client"

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface LinkDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string) => void
  initialUrl?: string
}

export function LinkDialog({ isOpen, onClose, onSubmit, initialUrl }: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl || '')

  useEffect(() => {
    setUrl(initialUrl || '')
  }, [initialUrl, isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Insert link</h3>
          <button className="modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal__body">
          <label className="form-label" htmlFor="link-url">URL</label>
          <input
            id="link-url"
            className="form-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (url) onSubmit(url)
              }
            }}
          />
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost btn--sm" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => { if (url) onSubmit(url) }}
            disabled={!url}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
