interface TiptapNode {
  type: string
  content?: TiptapNode[]
  attrs?: Record<string, unknown>
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
  text?: string
}

interface TiptapRendererProps {
  content: TiptapNode
}

function renderMarks(text: string, marks?: Array<{ type: string; attrs?: Record<string, unknown> }>): React.ReactNode {
  if (!marks || marks.length === 0) return text

  let result: React.ReactNode = text

  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        result = <strong>{result}</strong>
        break
      case 'italic':
        result = <em>{result}</em>
        break
      case 'underline':
        result = <u>{result}</u>
        break
      case 'strike':
        result = <s>{result}</s>
        break
      case 'code':
        result = <code className="editor-inline-code">{result}</code>
        break
      case 'link':
        const href = (mark.attrs?.href as string) || '#'
        result = (
          <a href={href} target="_blank" rel="noopener noreferrer" className="editor-link">
            {result}
          </a>
        )
        break
      case 'highlight':
        result = <mark>{result}</mark>
        break
    }
  }

  return result
}

function TiptapNodeRenderer({ node }: { node: TiptapNode }) {
  if (node.type === 'text' && node.text !== undefined) {
    return <>{renderMarks(node.text, node.marks)}</>
  }

  const children = node.content?.map((child, i) => (
    <TiptapNodeRenderer key={i} node={child} />
  ))

  switch (node.type) {
    case 'doc':
      return <>{children}</>
    case 'paragraph': {
      const textAlign = node.attrs?.textAlign as React.CSSProperties['textAlign'] | undefined
      return <p style={textAlign ? { textAlign } : undefined}>{children}</p>
    }
    case 'heading': {
      const level = (node.attrs?.level as number) || 2
      const textAlign = node.attrs?.textAlign as React.CSSProperties['textAlign'] | undefined
      const style = textAlign ? { textAlign } : undefined
      if (level === 1) return <h1 style={style}>{children}</h1>
      if (level === 2) return <h2 style={style}>{children}</h2>
      if (level === 3) return <h3 style={style}>{children}</h3>
      if (level === 4) return <h4 style={style}>{children}</h4>
      if (level === 5) return <h5 style={style}>{children}</h5>
      return <h6 style={style}>{children}</h6>
    }
    case 'blockquote':
      return <blockquote>{children}</blockquote>
    case 'bulletList':
      return <ul>{children}</ul>
    case 'orderedList':
      return <ol>{children}</ol>
    case 'listItem':
      return <li>{children}</li>
    case 'codeBlock':
      return (
        <pre>
          <code>{children}</code>
        </pre>
      )
    case 'horizontalRule':
      return <hr />
    case 'hardBreak':
      return <br />
    default:
      return <>{children}</>
  }
}

export function TiptapRenderer({ content }: TiptapRendererProps) {
  return <div className="prose"><TiptapNodeRenderer node={content} /></div>
}
