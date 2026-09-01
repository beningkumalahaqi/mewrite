import { NextRequest, NextResponse } from 'next/server'

const OPENCODE_BASE = process.env.AI_API_URL || 'https://opencode.ai/zen/v1'
const FREE_MODELS = [
  'mimo-v2.5-free',
  'big-pickle',
  'deepseek-v4-flash-free',
  'ling-3.0-flash-fin-free',
  'nemotron-3-ultra-free',
  'nemotron-3.5-lightning-free',
  'laguna-s-2.1-free',
  'muse-spark-1.2-contributor-free',
]

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `You are a writing assistant for MeWrite, a personal writing platform. You help users draft, edit, and refine their writings.

You can:
- Help brainstorm ideas
- Draft new writings
- Edit and improve existing text
- Answer writing questions

When the user asks you to write something, compose it as a Tiptap JSON document with this structure:
{
  "type": "doc",
  "content": [
    { "type": "paragraph", "content": [{ "type": "text", "text": "..." }] }
  ]
}

Use appropriate block types:
- paragraphs for body text
- headings (level 1, 2, 3) for section titles
- bulletList / orderedList for lists
- blockquote for quotes
- codeBlock for code
- marks: bold, italic, underline, strike, code, link, highlight

When you create a writing, wrap the title and content in a special marker so the system can save it:
<!--CREATE:title=Your Title Here-->
{the tiptap json content}

Keep responses concise and helpful. If the user just wants to chat, respond naturally.`

async function callModel(model: string, messages: ChatMessage[]): Promise<{ content: string; createDraft: any } | null> {
  try {
    const response = await fetch(`${OPENCODE_BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (response.status === 429) {
      console.log(`Model ${model} rate limited, trying next...`)
      return null
    }

    if (!response.ok) {
      const err = await response.text()
      console.error(`Model ${model} error ${response.status}:`, err)
      return null
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || 'No response'

    // Check if AI wants to create a writing
    const createMatch = content.match(/<!--CREATE:title=(.+?)-->\s*([\s\S]*)/)
    let createDraft = null

    if (createMatch) {
      const title = createMatch[1].trim()
      const jsonStr = createMatch[2].trim()
      try {
        const tiptapContent = JSON.parse(jsonStr)
        createDraft = { title, content: tiptapContent }
      } catch {
        // JSON parse failed, ignore
      }
    }

    return {
      content: content.replace(/<!--CREATE:title=.+?-->[\s\S]*/g, '').trim(),
      createDraft,
    }
  } catch (error) {
    console.error(`Model ${model} connection error:`, error)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] }

    const apiMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ]

    // Try each free model with fallback
    for (const model of FREE_MODELS) {
      const result = await callModel(model, apiMessages)
      if (result) {
        return NextResponse.json(result)
      }
    }

    return NextResponse.json(
      { error: 'All free models are rate limited. Please try again later.' },
      { status: 429 }
    )
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
