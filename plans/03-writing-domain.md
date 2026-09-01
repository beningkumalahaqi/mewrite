# Phase 03 — Writing Domain

## Objective

Implement the server-side writing domain: CRUD operations, slug generation, and input validation. This phase delivers the action layer that Phases 04–06 will consume.

## Scope

- Server actions for writing CRUD (create, update, delete)
- Publish/unpublish actions
- Slug generation logic
- Zod validation schemas for writing input
- Content sanitization helpers
- Revalidation logic for public pages

## Dependencies

- **Phase 02** must be complete (Prisma, auth, session management)

## Files/Directories to Create/Modify

```
me-write-app/
├── lib/
│   ├── validations/
│   │   └── writing.ts               # Zod schemas for writing input
│   ├── slug.ts                       # Slug generation logic
│   └── sanitize.ts                   # Content sanitization (if needed)
├── app/
│   ├── actions/
│   │   └── writings.ts              # All writing server actions
│   └── (public)/
│       └── page.tsx                  # Add revalidation path (minor)
├── package.json                      # Add zod dependency
```

## Implementation Tasks (Execution Order)

### 1. Install Zod

```bash
npm install zod
```

### 2. Create Zod validation schemas (`lib/validations/writing.ts`)

```typescript
import { z } from 'zod'

export const createWritingSchema = z.object({
  title: z.string().max(500).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  content: z.object({
    type: z.literal('doc'),
    content: z.array(z.any()), // Tiptap JSON structure
  }),
})

export const updateWritingSchema = createWritingSchema.extend({
  id: z.string().min(1),
})

export const publishWritingSchema = z.object({
  id: z.string().min(1),
})

export const deleteWritingSchema = z.object({
  id: z.string().min(1),
})
```

Key decisions:
- `content` validates that it's a Tiptap document (has `type: 'doc'` and `content` array)
- `date` accepts ISO date strings (YYYY-MM-DD)
- `title` is optional (PRD requirement)
- Each action has its own schema for precise validation

### 3. Create slug generation logic (`lib/slug.ts`)

**`generateSlug(title: string | null, date: string): Promise<string>`**

Rules (from TDD):
- If title exists: `slugify(title) + '-' + formatDate(date)`
  - Example: `the-things-i-never-said-2026-09-01`
- If title is null/empty: `untitled-YYYY-MM-DD-XXXX` where XXXX is a random 4-char suffix
  - Example: `untitled-2026-09-01-a1b2`
- Must be collision-safe: check database for existing slugs, append incrementing suffix if needed
- Slug generation happens server-side only

**`slugify(text: string): string`**
- Lowercase
- Replace spaces with hyphens
- Remove non-alphanumeric characters (except hyphens)
- Collapse multiple hyphens
- Trim leading/trailing hyphens
- Truncate to 100 characters

### 4. Create content sanitization helper (`lib/sanitize.ts`)

Since Tiptap produces structured JSON (not raw HTML), sanitization is minimal:
- Validate that content is a valid Tiptap document structure
- Strip any unexpected node types
- Sanitize link URLs (only allow http/https, block javascript: protocol)

This is a lightweight validation, not a full HTML sanitizer.

### 5. Create writing server actions (`app/actions/writings.ts`)

All actions must:
1. Use `"use server"` directive
2. Verify authentication (call `requireAuth()`)
3. Validate input with Zod
4. Perform database operation
5. Revalidate affected paths
6. Return success/error result

**`createWriting(data: { title?: string; date: string; content: object })`**
1. Validate with `createWritingSchema`
2. Generate slug from title + date
3. Insert Writing record (published: false)
4. Return the created writing with its ID
5. Note: Don't revalidate yet — unpublished writing isn't public

**`updateWriting(data: { id: string; title?: string; date: string; content: object })`**
1. Validate with `updateWritingSchema`
2. Verify writing exists and user owns it (all writings belong to the single author)
3. If title changed and writing is published, regenerate slug (or keep old slug — see note below)
4. Update the writing record
5. If published, revalidate `/writings/[slug]` and `/`
6. Return the updated writing

**Slug stability decision:** If a published writing's title changes, should the slug change? The TDD says "avoid automatically changing its slug unless explicitly required." Recommendation: Keep the original slug when updating. Only generate a new slug on creation.

**`deleteWriting(data: { id: string })`**
1. Validate with `deleteWritingSchema`
2. Verify writing exists
3. Delete the writing record
4. If it was published, revalidate `/` and the old `/writings/[slug]`
5. Return success

**`publishWriting(data: { id: string })`**
1. Validate with `publishWritingSchema`
2. Verify writing exists and is currently unpublished
3. Set `published: true`
4. Revalidate `/` and `/writings/[slug]`
5. Return success

**`unpublishWriting(data: { id: string })`**
1. Validate with `publishWritingSchema`
2. Verify writing exists and is currently published
3. Set `published: false`
4. Revalidate `/` and `/writings/[slug]`
5. Return success

### 6. Add revalidation helpers

Each action that modifies published content must call:

```typescript
import { revalidatePath } from 'next/cache'

// After publish/unpublish/update/delete of published writing:
revalidatePath('/')
revalidatePath(`/writings/${slug}`)
```

For author settings changes (Phase 07), revalidate all public pages that display author info.

## Database/Schema Changes

None — schema was created in Phase 02. This phase only performs CRUD operations.

## UI/Components Involved

None — this is a pure backend phase. UI will consume these actions in Phases 04–06.

## Server/Client Boundaries

- All actions are Server Actions (run on the server)
- No Client Components involved
- Slug generation is server-side only
- Validation is server-side (with optional client-side pre-validation in later phases)

## Validation/Security Considerations

- Every action verifies authentication server-side
- Input validated with Zod before database operations
- Slug generation prevents injection (pure slugify, no raw user input in URLs)
- Content structure validated (must be Tiptap document format)
- Link URLs sanitized (no javascript: protocol)
- No raw SQL — Prisma parameterized queries only

## Testing Requirements

- Create writing with title → correct slug generated
- Create writing without title → "untitled-" slug with random suffix
- Slug collision → suffix incremented
- Update writing → slug unchanged
- Publish writing → becomes publicly queryable
- Unpublish writing → no longer publicly queryable
- Delete writing → removed from database
- Unauthenticated action → rejected
- Invalid input → validation error returned

## Definition of Done

- [ ] All five server actions implemented (create, update, delete, publish, unpublish)
- [ ] Slug generation works for titled and untitled writings
- [ ] Slug collisions handled safely
- [ ] Zod validation on all inputs
- [ ] Authentication verified on every action
- [ ] Revalidation called for published content changes
- [ ] No TypeScript errors
- [ ] Unit tests pass for slug generation and validation

## Notes

- The `content` field stores Tiptap JSON, not HTML. The public rendering (Phase 04) will need a component that converts Tiptap JSON to rendered HTML/React.
- The design prototype stores HTML strings in content. The production app should store Tiptap JSON and render it. This is a key difference from the prototype.
- For the single-author app, "ownership" is implicit — all writings belong to the one author. No need for authorId foreign key.
- The actions return results, not redirect. The calling components (forms) will handle success/error states.
