"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/desk')
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Connection error')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="login-card">
      <h1 className="login-card__title">Desk</h1>
      <p className="login-card__subtitle">Sign in to start writing.</p>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="email">Email</label>
        <input
          id="email"
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="author@mewrite.app"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">Password</label>
        <input
          id="password"
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          required
        />
      </div>

      <button
        className="btn btn--primary"
        type="submit"
        disabled={loading}
        style={{ width: '100%', marginTop: 'var(--space-4)' }}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
