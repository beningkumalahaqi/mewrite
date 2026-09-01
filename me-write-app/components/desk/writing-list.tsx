"use client"

import Link from 'next/link'
import { useState } from 'react'
import type { Writing } from '@prisma/client'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function DeskWritingList({ initialWritings }: { initialWritings: Writing[] }) {
  const [writings, setWritings] = useState(initialWritings)
  const [loading, setLoading] = useState<string | null>(null)

  async function handlePublish(id: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/writings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: true }),
      })
      if (res.ok) {
        setWritings(prev => prev.map(w => 
          w.id === id ? { ...w, published: true } : w
        ))
      }
    } catch (error) {
      console.error('Publish failed:', error)
    }
    setLoading(null)
  }

  async function handleUnpublish(id: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/writings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: false }),
      })
      if (res.ok) {
        setWritings(prev => prev.map(w => 
          w.id === id ? { ...w, published: false } : w
        ))
      }
    } catch (error) {
      console.error('Unpublish failed:', error)
    }
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this writing? This cannot be undone.')) return
    
    setLoading(id)
    try {
      const res = await fetch(`/api/writings/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setWritings(prev => prev.filter(w => w.id !== id))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
    setLoading(null)
  }

  if (writings.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Your desk is empty.</div>
        <p className="empty-state__text">Start writing — put something into the world.</p>
        <Link href="/desk/writings/new" className="btn btn--primary">New writing →</Link>
      </div>
    )
  }

  return (
    <div className="desk-list">
      {writings.map((writing) => (
        <div key={writing.id} className="desk-item">
          <div className="desk-item__main">
            <div className={`desk-item__title ${!writing.title ? 'desk-item__title--untitled' : ''}`}>
              {writing.title || 'Untitled'}
            </div>
            <div className="desk-item__meta">
              <span>{formatDate(writing.date)}</span>
              <span className={`status ${writing.published ? 'status--published' : 'status--draft'}`}>
                {writing.published ? 'Published' : 'Draft'}
              </span>
              <span>Updated {formatDateShort(writing.updatedAt)}</span>
            </div>
          </div>
          <div className="desk-item__actions">
            <Link href={`/desk/writings/${writing.id}`} className="btn btn--ghost btn--sm">
              Edit
            </Link>
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => writing.published ? handleUnpublish(writing.id) : handlePublish(writing.id)}
              disabled={loading === writing.id}
            >
              {writing.published ? 'Unpublish' : 'Publish'}
            </button>
            <button
              className="btn btn--danger btn--sm"
              onClick={() => handleDelete(writing.id)}
              disabled={loading === writing.id}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
