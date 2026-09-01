# Phase 07 — Author Settings

## Objective

Build the author settings page where the single author can update their profile information (name, bio, profile image). Changes propagate to all public pages automatically.

## Scope

- Settings form (name, bio, profile image)
- Image upload with preview
- Server action for updating author
- Visual feedback on save
- Revalidation of public pages after save
- Layout matching `settings.html` design

## Dependencies

- **Phase 02** (auth, database)
- **Phase 04** (public pages — need to verify author info propagates)

## Files/Directories to Create/Modify

```
me-write-app/
├── app/
│   ├── desk/
│   │   └── settings/
│   │       └── page.tsx              # Settings page (replace placeholder)
│   └── actions/
│       └── author.ts                 # updateAuthor() server action
├── components/
│   ├── desk/
│   │   └── settings-form.tsx         # Settings form component
│   └── ui/
│       └── avatar-upload.tsx         # Image upload with preview
├── lib/
│   └── validations/
│       └── author.ts                 # Zod schema for author input
└── public/
    └── uploads/                      # Uploaded profile images (or use Vercel Blob)
```

## Implementation Tasks (Execution Order)

### 1. Create Zod validation schema (`lib/validations/author.ts`)

```typescript
import { z } from 'zod'

export const updateAuthorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  bio: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional().nullable(),
})
```

### 2. Create author server action (`app/actions/author.ts`)

**`updateAuthor(data: { name: string; bio?: string; imageUrl?: string | null })`**
1. Verify authentication
2. Validate with Zod
3. Update the singleton Author record
4. Revalidate public pages (homepage, all writing pages)
5. Return success/error

```typescript
"use server"

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/middleware'
import { updateAuthorSchema } from '@/lib/validations/author'

export async function updateAuthor(data: { name: string; bio?: string; imageUrl?: string | null }) {
  await requireAuth()
  
  const validated = updateAuthorSchema.parse(data)
  
  // Get the single author record
  const author = await db.author.findFirst()
  if (!author) throw new Error('Author not found')
  
  await db.author.update({
    where: { id: author.id },
    data: validated,
  })
  
  revalidatePath('/')
  // Revalidate all writing pages too (they show author info)
  // For simplicity, revalidate the root layout which cascades
  revalidatePath('/', 'layout')
}
```

### 3. Create avatar upload component (`components/ui/avatar-upload.tsx`)

Client Component matching `settings.html` avatar section:
- Circular preview (80px) showing image or first initial
- "Upload photo" button (file input hidden)
- "Remove" button (shown when image exists)
- File input accepts `image/*`
- Preview updates immediately on selection
- Returns the image data (base64 or URL) to parent form

**Image storage decision:**
- For MVP: Store as base64 in the database (simple, no external service)
- For production: Use Vercel Blob or similar
- The design prototype stores base64 in localStorage — the production app should use a proper storage solution
- Recommendation: Use base64 for MVP, with a clear upgrade path. The Author `imageUrl` field stores the URL/base64 string.

### 4. Create settings form component (`components/desk/settings-form.tsx`)

Client Component matching `settings.html` form:
- Avatar upload section
- Author name input (required)
- Short bio textarea (optional, min-height 120px)
- Hint text: "This appears on your public writings."
- "Save settings" button
- Success message: "Settings saved." (fades in/out)

### 5. Implement settings page (`app/desk/settings/page.tsx`)

Server Component:
1. Fetch current author data from database
2. Pass to settings form component
3. Set page title: "HaqiZ — Author Settings"
4. Layout matches `settings.html`: nav with "← Desk" and "Log out"

### 6. Handle save flow

1. User modifies form fields
2. User clicks "Save settings"
3. Client-side validation (Zod or basic checks)
4. Call `updateAuthor({ name, bio, imageUrl })`
5. Show success message: "Settings saved." (opacity transition)
6. Public pages now show updated author info (revalidated)

### 7. Update author name in nav/brand

The nav shows "HaqiZ" as the brand. After Phase 07, this should dynamically come from the Author record.

Update:
- `components/public/nav.tsx` — fetch author name, use as brand
- `components/desk/nav.tsx` — fetch author name, use as brand
- Footer — fetch author name and copyright year

This requires making the nav components async Server Components that fetch data.

## Database/Schema Changes

None — updates to existing Author table.

## UI/Components Involved

- Settings page layout
- Avatar upload with preview
- Name input
- Bio textarea
- Save button
- Success message
- Navigation updates (dynamic author name)

## Server/Client Boundaries

- Settings page: Server Component (data fetching)
- Settings form: Client Component (interactive form)
- Avatar upload: Client Component (file handling, preview)
- Author action: Server Action
- Nav components: Updated to async Server Components

## Validation/Security Considerations

- Name is required (validated server-side)
- Bio max 1000 chars
- Image URL validated as URL format
- Authentication verified on save
- Only one Author record exists — update, don't create
- Image upload: validate file type and size (max 2MB recommended)

## Testing Requirements

- Settings form loads with current author data
- Name field is required
- Bio field is optional
- Avatar preview shows current image or initial
- Upload replaces preview
- Remove clears preview
- Save updates author record in database
- Success message appears and fades
- Public pages reflect updated author name/bio
- Nav brand updates with new author name

## Definition of Done

- [ ] Settings page loads with current author data
- [ ] Name input pre-filled and required
- [ ] Bio input pre-filled and optional
- [ ] Avatar upload shows preview
- [ ] Avatar remove clears image
- [ ] Save button updates author record
- [ ] Success message displays and fades
- [ ] Public pages show updated author info
- [ ] Nav brand shows dynamic author name
- [ ] Settings layout matches `settings.html` design
- [ ] All inputs validated server-side
- [ ] Authentication required for save

## Notes

- The design prototype stores the avatar as base64 in localStorage. The production app should store it properly (database, blob storage, or filesystem). For MVP, base64 in the database is acceptable for a single author with one image.
- The "Author Settings" page is in the Desk route group, so it's automatically protected by the auth guard from Phase 02.
- The Author record is a singleton — the action always updates the first (and only) record. If no record exists, create one.
- Image upload could be handled via a separate API route for file uploads, or inline via base64. The base64 approach is simpler for MVP.
