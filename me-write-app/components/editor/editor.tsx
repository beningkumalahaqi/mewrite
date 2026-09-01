"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { editorExtensions } from '@/lib/editor/extensions'
import { useAutosave } from '@/hooks/use-autosave'
import { EditorTopbar } from './editor-topbar'
import { EditorMeta } from './editor-meta'
import { EditorToolbar } from './editor-toolbar'
import { LinkDialog } from './link-dialog'

interface WritingEditorProps {
  writingId?: string | null
  initialData?: {
    title?: string
    date?: string
    content?: object
  }
}

export function WritingEditor({ writingId, initialData }: WritingEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().slice(0, 10)
  )
  const [dirty, setDirty] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [currentId, setCurrentId] = useState(writingId || null)
  const [label, setLabel] = useState(writingId ? 'Edit writing' : 'New writing')
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const editorRef = useRef<ReturnType<typeof useEditor>>(null)

  const save = useCallback(async () => {
    if (!editorRef.current || saving) return

    const editor = editorRef.current
    setSaving(true)
    try {
      const content = editor.getJSON()

      if (currentId) {
        const res = await fetch('/api/writings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentId,
            title: title.trim() || undefined,
            date,
            content,
          }),
        })
        if (!res.ok) throw new Error('Update failed')
      } else {
        const res = await fetch('/api/writings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim() || undefined,
            date,
            content,
          }),
        })
        const result = await res.json()
        if (!result.id) throw new Error('Create failed')
        setCurrentId(result.id)
        setLabel('Edit writing')
        window.history.replaceState(null, '', `/desk/writings/${result.id}`)
      }

      setDirty(false)
      setSaveStatus('Saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Save failed:', error)
      setSaveStatus('Error')
    }
    setSaving(false)
  }, [currentId, title, date, saving])

  const { scheduleSave } = useAutosave({
    onSave: save,
    delay: 2000,
    enabled: dirty,
  })

  const editor = useEditor({
    extensions: editorExtensions,
    content: (initialData?.content as any) || {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    },
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
    onUpdate: () => {
      setDirty(true)
      setSaveStatus('Unsaved')
      scheduleSave()
    },
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [save])

  const handleTitleChange = useCallback(
    (t: string) => {
      setTitle(t)
      setDirty(true)
      setSaveStatus('Unsaved')
      scheduleSave()
    },
    [scheduleSave]
  )

  const handleOpenLinkDialog = useCallback(() => {
    if (!editor) return
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }
    setLinkDialogOpen(true)
  }, [editor])

  const handleLinkSubmit = useCallback((url: string) => {
    if (!editor) return
    editor.chain().focus().setLink({ href: url }).run()
    setLinkDialogOpen(false)
  }, [editor])

  return (
    <div>
      <EditorTopbar
        label={label}
        onSave={save}
        saveStatus={saveStatus}
        saving={saving}
      />

      <EditorMeta
        date={date}
        title={title}
        onDateChange={setDate}
        onTitleChange={handleTitleChange}
      />

      <div style={{ marginTop: 'var(--space-6)' }}>
        <div className="editor-wrapper">
          <EditorToolbar editor={editor} onOpenLinkDialog={handleOpenLinkDialog} />
          <div className="editor-area">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      <LinkDialog
        isOpen={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onSubmit={handleLinkSubmit}
      />
    </div>
  )
}
