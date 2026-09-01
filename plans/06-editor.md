# Phase 06 — Editor

## Objective

Build the rich-text writing editor using Tiptap. Implement the editor UI with toolbar, save state, keyboard shortcuts, and integration with the writing server actions.

## Scope

- Tiptap editor integration with custom extensions
- Toolbar with formatting buttons (bold, italic, H2, blockquote, link, lists)
- Date selector and optional title input
- Save state indicator (Saved/Unsaved)
- Cmd+S keyboard shortcut
- Auto-save or manual save
- Editor page layout matching `editor.html` design
- Both "new writing" and "edit writing" modes

## Dependencies

- **Phase 01** (design tokens, editor CSS)
- **Phase 03** (writing server actions)
- **Phase 05** (desk — links to editor)

## Files/Directories to Create/Modify

```
me-write-app/
├── app/
│   └── desk/
│       └── writings/
│           ├── new/
│           │   └── page.tsx          # New writing (replace placeholder with editor)
│           └── [id]/
│               └── page.tsx          # Edit writing (replace placeholder with editor)
├── components/
│   └── editor/
│       ├── editor.tsx               # Main editor component (Client Component)
│       ├── editor-toolbar.tsx        # Toolbar with formatting buttons
│       ├── editor-topbar.tsx         # Top bar (back link, label, save status, save button)
│       └── editor-meta.tsx           # Date and title inputs
├── lib/
│   └── editor/
│       └── extensions.ts            # Tiptap extension configuration
├── package.json                      # Add @tiptap/* dependencies
```

## Implementation Tasks (Execution Order)

### 1. Install Tiptap dependencies

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder
npm install @tiptap/pm  # ProseMirror peer dependency
```

`@tiptap/starter-kit` includes: paragraphs, headings, bold, italic, strike, code, blockquote, bullet lists, ordered lists, code blocks, hard breaks, horizontal rules.

Additional extensions needed:
- `@tiptap/extension-link` — for hyperlinks
- `@tiptap/extension-placeholder` — for "Begin writing…" placeholder

### 2. Create Tiptap extension configuration (`lib/editor/extensions.ts`)

```typescript
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] }, // Only H2 and H3 per design toolbar
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
  }),
  Placeholder.configure({
    placeholder: 'Begin writing…',
  }),
]
```

Design toolbar only shows: Bold, Italic, H2, Blockquote, Link, Ordered List, Unordered List. Match this exactly.

### 3. Create editor top bar component (`components/editor/editor-topbar.tsx`)

Client Component matching `editor.html` topbar:
- Left: "← Desk" ghost button (link to `/desk`)
- Center: Label ("New writing" or "Edit writing")
- Right: Save status indicator + Save button

```typescript
// Shows "Unsaved" when content changed, "Saved" briefly after save
// Save button calls the appropriate server action
```

### 4. Create editor meta component (`components/editor/editor-meta.tsx`)

Client Component matching `editor.html` meta section:
- Date input (type="date", styled as muted/borderless)
- Title input (text, display font, large, placeholder "Untitled")

### 5. Create editor toolbar component (`components/editor/editor-toolbar.tsx`)

Client Component matching `editor.html` toolbar:
- Buttons: B (bold), I (italic), H2, " (blockquote), 🔗 (link), 1. (ordered list), • (unordered list)
- Separator between groups
- Active state styling (dark background when format is active)
- Click handler calls Tiptap chain commands

Toolbar layout from design:
```
[B] [I] | [H2] ["] [🔗] | [1.] [•]
```

### 6. Create main editor component (`components/editor/editor.tsx`)

Client Component — the core editor:

```typescript
"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { editorExtensions } from '@/lib/editor/extensions'

interface EditorProps {
  writingId?: string | null  // null = new, string = edit
  initialData?: {
    title?: string
    date?: string
    content?: object  // Tiptap JSON
  }
}
```

Features:
- Initialize Tiptap editor with extensions
- Load existing content if editing
- Track dirty state (content changed since last save)
- Save button calls `createWriting` or `updateWriting`
- Cmd+S / Ctrl+S keyboard shortcut for save
- Save status indicator: "" → "Unsaved" (on change) → "Saved" (after save, fades after 2s)
- After creating a new writing, update URL to `/desk/writings/[new-id]` (using `history.replaceState`)

### 7. Implement new writing page (`app/desk/writings/new/page.tsx`)

Server Component that wraps the editor:
1. Render editor top bar with "New writing" label
2. Render editor meta (date defaults to today, empty title)
3. Render editor component with `writingId={null}`

### 8. Implement edit writing page (`app/desk/writings/[id]/page.tsx`)

Server Component:
1. Fetch writing by ID from database
2. If not found → 404
3. Render editor top bar with "Edit writing" label
4. Render editor meta with existing date and title
5. Render editor component with `writingId={id}` and `initialData`

### 9. Handle save flow

**New writing (no ID):**
1. User clicks Save or presses Cmd+S
2. Call `createWriting({ title, date, content })`
3. Server returns new writing ID
4. Update URL: `history.replaceState(null, '', '/desk/writings/' + newId)`
5. Update label: "Edit writing"
6. Show "Saved" status

**Existing writing (has ID):**
1. User clicks Save or presses Cmd+S
2. Call `updateWriting({ id, title, date, content })`
3. Show "Saved" status
4. Clear dirty state

### 10. Handle Tiptap JSON ↔ initial data

When loading an existing writing:
- The writing's `content` is stored as Tiptap JSON in the database
- Pass it directly to the editor: `editor.commands.setContent(initialData.content)`
- The editor renders the existing content

When saving:
- Get editor JSON: `editor.getJSON()`
- Send to server action
- Server stores in PostgreSQL as JSON column

## Database/Schema Changes

None — writes to existing `content` JSON column.

## UI/Components Involved

- Editor page layout (topbar, meta, editor area)
- Toolbar with formatting buttons
- Save status indicator
- Date and title inputs
- Rich-text editing area

## Server/Client Boundaries

- Editor page: Server Component (data fetching, layout)
- Editor component: Client Component (interactive editing)
- Toolbar: Client Component (button handlers)
- Save actions: Server Actions
- All editing happens client-side; only save is server-side

## Validation/Security Considerations

- Content validated server-side (must be Tiptap document structure)
- Date validated server-side (must be valid date)
- Title optional, max 500 chars
- Authentication verified on save (server action)
- No raw HTML storage — Tiptap JSON only

## Testing Requirements

- Editor opens in "new" mode with empty content
- Editor opens in "edit" mode with existing content
- Bold/Italic/H2/Blockquote/Link/Lists formatting works
- Save creates new writing and updates URL
- Save updates existing writing
- Cmd+S triggers save
- Save status shows "Unsaved" then "Saved"
- Date picker works
- Title input works
- Back to Desk link works
- Placeholder text shown when editor is empty

## Definition of Done

- [ ] Tiptap editor renders and accepts input
- [ ] Toolbar buttons apply formatting (bold, italic, H2, blockquote, link, lists)
- [ ] Active formatting state reflected in toolbar
- [ ] Date input defaults to today for new writings
- [ ] Title input accepts optional text
- [ ] Save button creates new writing (with URL update)
- [ ] Save button updates existing writing
- [ ] Cmd+S keyboard shortcut works
- [ ] Save status indicator shows "Unsaved"/"Saved"
- [ ] Editor loads existing content correctly
- [ ] "← Desk" link navigates back to desk
- [ ] Editor layout matches `editor.html` design
- [ ] Toolbar matches design (button order, separators, styling)
- [ ] Editor area has correct typography (matches prose styles)

## Notes

- The design prototype uses `document.execCommand` for formatting. The production app uses Tiptap which is a proper ProseMirror-based editor. The visual result should be the same, but the underlying implementation is more robust.
- The editor area in the design has a border, rounded corners, and surface background. Match this with Tailwind classes.
- The save status uses a monospace font and fades out after 2 seconds. Implement with CSS transition.
- The editor should feel "closer to a writing desk than a traditional CMS form" (TDD). Keep the UI minimal — just the toolbar, meta inputs, and a large writing area.
- Content is stored as Tiptap JSON, not HTML. The renderer (Phase 04) converts JSON to HTML for display.
