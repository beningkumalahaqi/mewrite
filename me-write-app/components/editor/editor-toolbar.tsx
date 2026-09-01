"use client"

import { type Editor } from '@tiptap/react'
import { useRef, useState, useEffect, useCallback } from 'react'
import {
  Bold, Italic, Underline, Strikethrough, Code,
  List, ListOrdered, Quote, CodeSquare,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link2, Highlighter, Minus, Undo2, Redo2,
  RemoveFormatting, ChevronDown
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor | null
  onOpenLinkDialog?: () => void
}

/* ─── Format Dropdown (TinyMCE-style select) ─── */

function FormatDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  /* Current label */
  let label = 'Paragraph'
  if (editor.isActive('heading', { level: 1 })) label = 'Heading 1'
  else if (editor.isActive('heading', { level: 2 })) label = 'Heading 2'
  else if (editor.isActive('heading', { level: 3 })) label = 'Heading 3'

  const formats = [
    { label: 'Paragraph', active: !editor.isActive('heading'), action: () => editor.chain().focus().setParagraph().run() },
    { label: 'Heading 1', active: editor.isActive('heading', { level: 1 }), action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'Heading 2', active: editor.isActive('heading', { level: 2 }), action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Heading 3', active: editor.isActive('heading', { level: 3 }), action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  ]

  return (
    <div className="format-dropdown" ref={ref}>
      <button
        type="button"
        className={`format-dropdown__trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="format-dropdown__label">{label}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="format-dropdown__menu">
          {formats.map((fmt) => (
            <button
              key={fmt.label}
              type="button"
              className={`format-dropdown__item ${fmt.active ? 'is-active' : ''}`}
              onClick={() => { fmt.action(); close() }}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Toolbar ─── */

export function EditorToolbar({ editor, onOpenLinkDialog }: EditorToolbarProps) {
  if (!editor) return null

  return (
    <div className="editor-toolbar">
      {/* Undo / Redo */}
      <div className="editor-toolbar__group">
        <button
          type="button"
          className="editor-toolbar__btn"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (⌘Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          className="editor-toolbar__btn"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (⌘⇧Z)"
        >
          <Redo2 size={16} />
        </button>
      </div>

      <div className="editor-toolbar__divider" />

      {/* Format dropdown (TinyMCE blocks) */}
      <div className="editor-toolbar__group">
        <FormatDropdown editor={editor} />
      </div>

      <div className="editor-toolbar__divider" />

      {/* Inline formatting */}
      <div className="editor-toolbar__group">
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (⌘B)"
        >
          <Bold size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('italic') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (⌘I)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('underline') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (⌘U)"
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('strike') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough (⌘⇧X)"
        >
          <Strikethrough size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('code') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code (⌘E)"
        >
          <Code size={16} />
        </button>
      </div>

      <div className="editor-toolbar__divider" />

      {/* Alignment (TinyMCE-style buttons) */}
      <div className="editor-toolbar__group">
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align right"
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Align justify"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      <div className="editor-toolbar__divider" />

      {/* Lists & blocks */}
      <div className="editor-toolbar__group">
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered list"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code block"
        >
          <CodeSquare size={16} />
        </button>
      </div>

      <div className="editor-toolbar__divider" />

      {/* Extras */}
      <div className="editor-toolbar__group">
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('link') ? 'is-active' : ''}`}
          onClick={() => onOpenLinkDialog?.()}
          title="Insert link"
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          className={`editor-toolbar__btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Highlight"
        >
          <Highlighter size={16} />
        </button>
        <button
          type="button"
          className="editor-toolbar__btn"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus size={16} />
        </button>
      </div>

      <div className="editor-toolbar__divider" />

      {/* Clear */}
      <div className="editor-toolbar__group">
        <button
          type="button"
          className="editor-toolbar__btn"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Clear formatting"
        >
          <RemoveFormatting size={16} />
        </button>
      </div>
    </div>
  )
}
