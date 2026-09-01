"use client"

interface EditorMetaProps {
  date: string
  title: string
  onDateChange: (date: string) => void
  onTitleChange: (title: string) => void
}

export function EditorMeta({ date, title, onDateChange, onTitleChange }: EditorMetaProps) {
  return (
    <div className="editor-meta">
      <input
        type="date"
        className="form-input"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        style={{ marginBottom: 'var(--space-4)' }}
      />
      <input
        type="text"
        className="form-input form-input--display"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Untitled"
      />
    </div>
  )
}
