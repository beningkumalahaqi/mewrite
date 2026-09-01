"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [creatingDraft, setCreatingDraft] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const allMessages = [...messages, userMessage].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
      })

      const data = await res.json()

      if (data.error) {
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content }])

        // If AI wants to create a draft
        if (data.createDraft) {
          setCreatingDraft(true)
          try {
            const result = await fetch('/api/writings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: data.createDraft.title,
                date: new Date().toISOString().slice(0, 10),
                content: data.createDraft.content,
              }),
            })
            const resultData = await result.json()
            if (resultData.id) {
              setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `Draft created: "${data.createDraft.title}" — [Edit it here](/desk/writings/${resultData.id})` },
              ])
            } else {
              throw new Error('No id returned')
            }
          } catch {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: 'Failed to create draft. Try again.' },
            ])
          }
          setCreatingDraft(false)
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Is the AI service running?' }])
    }

    setLoading(false)
  }, [input, messages, loading])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )

  return (
    <>
      {/* Floating button */}
      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        title="AI Writing Assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chat-panel">
          <div className="chat-panel__header">
            <div className="chat-panel__title">
              <Sparkles size={16} />
              <span>Writing Assistant</span>
            </div>
            <button className="chat-panel__close" onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="chat-panel__messages">
            {messages.length === 0 && (
              <div className="chat-panel__empty">
                <Sparkles size={24} style={{ opacity: 0.3 }} />
                <p>Ask me to help with your writing.</p>
                <p style={{ fontSize: 'var(--text-xs)', opacity: 0.5 }}>
                  I can brainstorm, draft, and edit.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                <div className="chat-msg__content">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg chat-msg--assistant">
                <div className="chat-msg__content chat-msg__content--loading">
                  <Loader2 size={14} className="spin" />
                </div>
              </div>
            )}
            {creatingDraft && (
              <div className="chat-msg chat-msg--assistant">
                <div className="chat-msg__content chat-msg__content--loading">
                  Creating draft...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-panel__input">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about writing..."
              rows={1}
              disabled={loading}
            />
            <button
              className="chat-send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
