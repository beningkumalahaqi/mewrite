"use client"

import { useState } from 'react'

interface ShareButtonProps {
  url: string
  title: string
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleShare() {
    // If we already have a short URL, just copy it
    if (shortUrl) {
      await copyToClipboard(shortUrl)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) throw new Error('Failed to shorten URL')

      const data = await res.json()
      const baseUrl = window.location.origin
      const shortened = `${baseUrl}/s/${data.code}`
      setShortUrl(shortened)
      await copyToClipboard(shortened)
    } catch (error) {
      // Fallback to original URL
      await copyToClipboard(url)
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="btn btn--ghost btn--sm"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
      title="Copy shareable link"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      {loading ? 'Shortening...' : copied ? 'Copied!' : 'Share'}
    </button>
  )
}
