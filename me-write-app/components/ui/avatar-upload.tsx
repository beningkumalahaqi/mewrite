"use client"

import { useState, useRef } from 'react'

interface AvatarUploadProps {
  initialImageUrl?: string | null
  name: string
  onImageChange: (imageUrl: string | null) => void
}

export function AvatarUpload({ initialImageUrl, name, onImageChange }: AvatarUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setImageUrl(result)
      onImageChange(result)
    }
    reader.readAsDataURL(file)
  }

  function handleRemove() {
    setImageUrl(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="settings-avatar">
      <div className="settings-avatar__preview">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Avatar"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          (name || 'H').charAt(0).toUpperCase()
        )}
      </div>
      <div className="settings-avatar__actions">
        <label
          className="btn btn--secondary btn--sm"
          htmlFor="avatar-upload"
          style={{ cursor: 'pointer' }}
        >
          Upload photo
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="avatar-upload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        {imageUrl && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={handleRemove}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
