interface TiptapNode {
  type: string
  content?: TiptapNode[]
  attrs?: Record<string, unknown>
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
  text?: string
}

export function isValidTiptapDocument(content: unknown): content is TiptapNode {
  if (!content || typeof content !== 'object') return false
  const doc = content as TiptapNode
  return doc.type === 'doc' && Array.isArray(doc.content)
}

export function sanitizeTiptapContent(content: TiptapNode): TiptapNode {
  function sanitizeNode(node: TiptapNode): TiptapNode {
    const sanitized: TiptapNode = { ...node }

    // Sanitize marks (links)
    if (sanitized.marks) {
      sanitized.marks = sanitized.marks.map((mark) => {
        if (mark.type === 'link' && mark.attrs?.href) {
          const href = mark.attrs.href as string
          if (!href.startsWith('http://') && !href.startsWith('https://')) {
            return { ...mark, attrs: { ...mark.attrs, href: '#' } }
          }
        }
        return mark
      })
    }

    // Recursively sanitize children
    if (sanitized.content) {
      sanitized.content = sanitized.content.map(sanitizeNode)
    }

    return sanitized
  }

  return sanitizeNode(content)
}

export function extractPlainText(content: TiptapNode): string {
  const parts: string[] = []

  function walk(node: TiptapNode) {
    if (node.text) {
      parts.push(node.text)
    }
    if (node.content) {
      for (const child of node.content) {
        walk(child)
      }
    }
  }

  walk(content)
  return parts.join(' ')
}

export function truncate(text: string, len: number): string {
  if (text.length <= len) return text
  return text.slice(0, len).replace(/\s+\S*$/, '') + '…'
}
