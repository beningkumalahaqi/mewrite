# Phase 04 — Public Experience

## Objective

Build the public-facing pages: the writing archive homepage and individual writing pages. Implement the Tiptap JSON renderer, author card, SEO metadata, and sitemap/robots.txt.

## Scope

- Homepage with published writings sorted by date (newest first)
- Individual writing page with rich-text rendering
- Author card component
- Tiptap JSON → HTML/React renderer
- SEO metadata (title, description, Open Graph, Twitter)
- sitemap.xml generation
- robots.txt
- Not-found handling for unpublished writings

## Dependencies

- **Phase 01** (layout, design tokens, Tailwind)
- **Phase 03** (writing domain — need data to display)

## Files/Directories to Create/Modify

```
me-write-app/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Homepage (replace placeholder)
│   │   └── writings/
│   │       └── [slug]/
│   │           └── page.tsx          # Writing page (replace placeholder)
│   ├── sitemap.ts                    # Dynamic sitemap
│   ├── robots.ts                     # Robots.txt
│   └── not-found.tsx                 # Global 404 page
├── components/
│   ├── public/
│   │   ├── writing-list.tsx          # Archive list (Server Component)
│   │   ├── writing-item.tsx          # Single archive item
│   │   ├── writing-header.tsx        # Writing page header (date, title, author)
│   │   ├── writing-body.tsx          # Rich-text renderer
│   │   └── author-card.tsx           # Author info card
│   └── editor/
│       └── tiptap-renderer.tsx       # Tiptap JSON → rendered content
├── lib/
│   └── db.ts                        # (already exists) — add query helpers
```

## Implementation Tasks (Execution Order)

### 1. Create Tiptap renderer component (`components/editor/tiptap-renderer.tsx`)

This is the core component that converts Tiptap JSON to rendered React elements.

**Approach:** Create a recursive renderer that walks the Tiptap document tree and renders appropriate HTML elements.

Supported node types (from Tiptap default schema + PRD requirements):
- `doc` → container
- `paragraph` → `<p>`
- `heading` → `<h1>`, `<h2>`, `<h3>` (based on level)
- `blockquote` → `<blockquote>`
- `bulletList` → `<ul>`
- `orderedList` → `<ol>`
- `listItem` → `<li>`
- `codeBlock` → `<pre><code>`
- `horizontalRule` → `<hr>`
- `hardBreak` → `<br>`
- `text` → text node with marks
- `mention` → (not used, skip)

Supported marks (formatting):
- `bold` → `<strong>`
- `italic` → `<em>`
- `strike` → `<s>`
- `code` → `<code>`
- `link` → `<a href="...">`

**Implementation:**
```typescript
// Server Component — no client JS needed for rendering
// Uses the .prose class from the design system for styling
// Walks the Tiptap JSON tree recursively
// Renders semantic HTML elements
```

Key decisions:
- This is a Server Component — no JavaScript sent to the client for rendering
- Use the `.prose` class from the design system for all typography
- Links open in new tab with `rel="noopener noreferrer"`
- Code blocks use the monospace font from the design system

### 2. Create writing list component (`components/public/writing-list.tsx`)

Server Component that renders the archive list.

```typescript
// Fetches published writings from database
// Sorts by date DESC
// Renders each as a writing-item
// Handles empty state ("The desk is quiet.")
```

Matches `index.html` structure:
- Each item shows: date (mono, uppercase), title (display font), preview (truncated, muted)
- Items link to `/writings/[slug]`
- Empty state matches design: "The desk is quiet." / "Writings will appear here once published."

### 3. Create writing item component (`components/public/writing-item.tsx`)

Renders a single archive entry:
- Date in mono font, uppercase, muted
- Title in display font (or "Untitled" in italic muted if no title)
- Preview text (first ~140 chars of plain-text content)
- Link wrapper to `/writings/[slug]`

### 4. Create writing header component (`components/public/writing-header.tsx`)

Renders the centered header on individual writing pages:
- Date (mono, uppercase, muted)
- Title (display font, text-5xl, or "Untitled" in italic muted)
- "by [Author Name]" (small, muted)

Matches `writing.html` header structure exactly.

### 5. Create author card component (`components/public/author-card.tsx`)

Renders the author info at the bottom of writing pages:
- Avatar (circular, 48px) — show image if `imageUrl` exists, otherwise show first initial
- Author name (display font)
- Bio (small, muted)
- Border-top separator

Matches `writing.html` author card structure exactly.

### 6. Implement homepage (`app/(public)/page.tsx`)

Server Component:
1. Query published writings: `db.writing.findMany({ where: { published: true }, orderBy: { date: 'desc' } })`
2. Fetch author info: `db.author.findFirst()` (or use a layout-level query)
3. Render:
   - Author name as page heading (display font, text-4xl)
   - Author bio (muted, text-base)
   - Writing list component
4. Set page metadata: title, description

Matches `index.html` structure:
- Header with author name and bio
- Writing archive list
- Footer

### 7. Implement writing page (`app/(public)/writings/[slug]/page.tsx`)

Server Component:
1. Extract slug from params
2. Query writing: `db.writing.findUnique({ where: { slug } })`
3. If not found or not published → call `notFound()`
4. Fetch author info
5. Render:
   - Writing header (date, title, author name)
   - Writing body (Tiptap renderer with `.prose` class)
   - Author card
   - Back link ("← Back to writings")
6. Set dynamic metadata (SEO)

Matches `writing.html` structure exactly.

### 8. Add SEO metadata

**Per-writing metadata (`generateMetadata`):**
```typescript
export async function generateMetadata({ params }) {
  const writing = await getWriting(params.slug)
  if (!writing) return { title: 'Not Found' }
  
  const plainText = extractPlainText(writing.content) // Strip Tiptap JSON to plain text
  const description = plainText.slice(0, 160) + (plainText.length > 160 ? '...' : '')
  
  return {
    title: writing.title || 'Untitled',
    description,
    openGraph: {
      title: writing.title || 'Untitled',
      description,
      type: 'article',
      publishedTime: writing.date.toISOString(),
    },
    twitter: {
      card: 'summary',
      title: writing.title || 'Untitled',
      description,
    },
  }
}
```

**Global metadata (`app/layout.tsx`):**
- Site title: "HaqiZ — Writings"
- Default description: from Author bio
- Canonical URL

### 9. Create sitemap (`app/sitemap.ts`)

```typescript
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writings = await db.writing.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })
  
  const writingUrls = writings.map(w => ({
    url: `${BASE_URL}/writings/${w.slug}`,
    lastModified: w.updatedAt,
  }))
  
  return [
    { url: BASE_URL, lastModified: new Date() },
    ...writingUrls,
  ]
}
```

Only published writings included. Unpublished writings must not appear.

### 10. Create robots.txt (`app/robots.ts`)

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
```

### 11. Create not-found page (`app/not-found.tsx`)

Global 404 page matching the design:
- "Writing not found" heading
- "This piece may have been moved or unpublished." message
- "← Back to writings" button

## Database/Schema Changes

None — read-only queries on existing tables.

## UI/Components Involved

- Homepage (archive list, author header)
- Writing page (header, body, author card, back link)
- Tiptap renderer
- Author card
- Not-found page
- Sitemap and robots.txt

## Server/Client Boundaries

- All pages are Server Components (no client JS for public pages)
- Tiptap renderer is a Server Component
- Writing list is a Server Component
- No Client Components needed — the public experience is fully server-rendered
- This maximizes performance and minimizes client-side JavaScript

## Validation/Security Considerations

- Only published writings are queried — unpublished writings are never exposed
- Slug lookup returns null for non-existent or unpublished writings → `notFound()`
- No user input on public pages — no validation needed
- SEO metadata is server-generated — no client-side manipulation

## Testing Requirements

- Homepage shows only published writings, sorted by date DESC
- Homepage shows empty state when no published writings exist
- Writing page renders Tiptap content correctly
- Writing page shows author card with correct info
- Unpublished writing URL → 404 page
- Non-existent slug → 404 page
- SEO metadata present on writing pages
- sitemap.xml includes only published writings
- robots.txt allows crawling

## Definition of Done

- [ ] Homepage displays published writings sorted by date (newest first)
- [ ] Homepage shows "Untitled" for writings without titles
- [ ] Homepage shows preview text for each writing
- [ ] Homepage empty state matches design ("The desk is quiet.")
- [ ] Writing page renders rich-text content from Tiptap JSON
- [ ] Writing page shows date, title, author name
- [ ] Author card displays at bottom of writing page
- [ ] Back link navigates to homepage
- [ ] Unpublished writings return 404
- [ ] Non-existent slugs return 404
- [ ] SEO metadata present (title, description, Open Graph)
- [ ] sitemap.xml generated with published writings only
- [ ] robots.txt present
- [ ] All public pages are Server Components (no client JS)
- [ ] Visual match against `index.html` and `writing.html` designs

## Notes

- The design prototype renders HTML strings. The production app renders Tiptap JSON. The visual output should be identical — the `.prose` class handles typography regardless of the source format.
- The preview text on the homepage is generated by stripping HTML/JSON from the content and truncating to ~140 characters. Create a helper function `extractPlainText(tiptapJson)` for this.
- Author info is fetched from the database on every page load. For a low-traffic personal site, this is fine. If needed later, consider caching.
- The sitemap uses `MetadataRoute.Sitemap` which is Next.js 14+ built-in. Verify it's available in Next.js 16.
