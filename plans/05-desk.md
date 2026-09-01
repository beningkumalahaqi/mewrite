# Phase 05 — Desk

## Objective

Build the private Desk interface: writing list with management actions, new writing flow, and the desk layout with auth-protected navigation.

## Scope

- Writing list page with title, date, status, actions
- Publish/unpublish toggle
- Delete with confirmation
- "New writing" button and page
- Desk layout with proper navigation
- Loading states for actions
- Empty state for no writings

## Dependencies

- **Phase 02** (auth, layout)
- **Phase 03** (writing server actions)

## Files/Directories to Create/Modify

```
me-write-app/
├── app/
│   ├── desk/
│   │   ├── page.tsx                  # Writing list (replace placeholder)
│   │   ├── layout.tsx                # Update with proper nav and auth
│   │   ├── writings/
│   │   │   └── new/
│   │   │       └── page.tsx          # New writing page (replace placeholder)
│   │   └── settings/
│   │       └── page.tsx              # Settings placeholder (unchanged)
│   └── actions/
│       └── writings.ts               # (already exists from Phase 03)
├── components/
│   ├── desk/
│   │   ├── writing-list.tsx          # Desk writing list
│   │   ├── writing-row.tsx           # Single writing row with actions
│   │   ├── empty-state.tsx           # Empty desk state
│   │   └── delete-confirm.tsx        # Delete confirmation dialog
│   └── ui/
│       ├── button.tsx                # Reusable button component
│       ├── status-badge.tsx          # Published/Draft status pill
│       └── confirm-dialog.tsx        # Confirmation dialog component
```

## Implementation Tasks (Execution Order)

### 1. Create reusable UI components

**`components/ui/button.tsx`**
- Variants: `primary`, `secondary`, `ghost`, `danger`
- Sizes: `default`, `sm`
- Matches button styles from design system exactly
- Uses Tailwind classes mapped from CSS

**`components/ui/status-badge.tsx`**
- Shows "Published" (green) or "Draft" (muted) status
- Matches `.status`, `.status--published`, `.status--draft` from design
- Mono font, uppercase, small

**`components/ui/confirm-dialog.tsx`**
- Simple confirmation dialog for delete action
- "Delete this writing? This cannot be undone." message
- Cancel and Confirm buttons
- Uses native `confirm()` for simplicity (matches design prototype behavior)

### 2. Create desk writing list component (`components/desk/writing-list.tsx`)

Client Component (needs interactive state for actions):

```typescript
"use client"

// Fetches all writings (published + unpublished)
// Renders as desk-item rows
// Handles publish/unpublish toggle
// Handles delete with confirmation
// Optimistic updates after actions
```

Matches `desk.html` list structure:
- Each row: title (or "Untitled" in italic), date, status badge, actions
- Actions: Edit (link), Publish/Unpublish (button), Delete (button)
- Sorted by date DESC

### 3. Create writing row component (`components/desk/writing-row.tsx`)

Client Component for a single desk item:
- Title or "Untitled" (italic, muted)
- Date and status badge
- Edit button → links to `/desk/writings/[id]`
- Publish/Unpublish toggle button
- Delete button

Matches `.desk-item` grid layout from design.

### 4. Create empty state component (`components/desk/empty-state.tsx`)

Shown when no writings exist:
- "Your desk is empty." heading
- "Start writing — put something into the world." message
- "New writing →" button

Matches `desk.html` empty state exactly.

### 5. Implement desk writing list page (`app/desk/page.tsx`)

Server Component wrapper:
1. Fetch all writings from database
2. Pass to desk writing list client component
3. Set page title: "HaqiZ — Desk"

### 6. Implement new writing page (`app/desk/writings/new/page.tsx`)

This is a thin wrapper — the actual editor will be built in Phase 06. For now:
- Redirect to `/desk/writings/[new-id]` after creating a blank writing
- Or: show a simple form to set date and title before entering the editor

**Decision:** Follow the design prototype flow — the "New writing" button on the desk links directly to the editor page. The editor handles both new and edit flows. So this page should either:
- Option A: Create a blank writing and redirect to its edit page
- Option B: Just redirect to the editor with no ID (editor handles new creation)

Recommendation: Option B — the editor page handles both creation and editing. The `/desk/writings/new` route renders the editor component in "new" mode.

### 7. Update desk layout (`app/desk/layout.tsx`)

Ensure the layout matches `desk.html`:
- Navigation: Brand ("HaqiZ"), "Public site" link, "Settings" link, "Log out" button
- Footer with brand and copyright
- Container wrapper (wide-width for desk)
- Auth guard (already from Phase 02)

The "Log out" button needs to call the `logout` server action. Since the nav is a Server Component, the logout button should be a small Client Component.

### 8. Create logout button component (`components/desk/logout-button.tsx`)

Client Component:
```typescript
"use client"

import { logout } from '@/app/actions/auth'

export function LogoutButton() {
  return (
    <button onClick={() => logout()} className="...">
      Log out
    </button>
  )
}
```

### 9. Implement publish/unpublish flow

In the writing list, clicking "Publish" or "Unpublish" calls the respective server action:
1. Call `publishWriting({ id })` or `unpublishWriting({ id })`
2. Update the local state (optimistic or re-fetch)
3. Show success feedback (status badge updates)

### 10. Implement delete flow

Clicking "Delete" shows confirmation dialog:
1. Show "Delete this writing? This cannot be undone."
2. On confirm: call `deleteWriting({ id })`
3. Remove from local state
4. On cancel: close dialog

## Database/Schema Changes

None — CRUD operations on existing tables.

## UI/Components Involved

- Desk writing list (with all rows)
- Status badges (Published/Draft)
- Action buttons (Edit, Publish/Unpublish, Delete)
- Empty state
- Logout button
- Confirmation dialog

## Server/Client Boundaries

- Desk page: Server Component (data fetching)
- Writing list: Client Component (interactive actions)
- Writing row: Client Component (button handlers)
- Empty state: Server Component (static)
- Logout button: Client Component (form action)
- Confirm dialog: Client Component (state management)
- Layout: Server Component with Client Component children

## Validation/Security Considerations

- All actions verify authentication server-side (already in Phase 03 actions)
- Delete confirmation prevents accidental deletion
- No client-side authorization — server rejects unauthorized actions
- Writing IDs validated server-side before any operation

## Testing Requirements

- Desk shows all writings (published and unpublished)
- Status badge correctly shows "Published" or "Draft"
- Publish action changes status and updates UI
- Unpublish action changes status and updates UI
- Delete action removes writing from list after confirmation
- Empty state shown when no writings exist
- "New writing" navigates to editor
- Logout returns to login page
- Unauthenticated desk access → redirect to login

## Definition of Done

- [ ] Desk page shows all writings sorted by date
- [ ] Each writing shows title (or "Untitled"), date, status, actions
- [ ] Status badge correctly displays Published/Draft
- [ ] Publish button works and updates status
- [ ] Unpublish button works and updates status
- [ ] Delete button shows confirmation and removes writing
- [ ] Empty state matches design when no writings exist
- [ ] "New writing →" button navigates to editor
- [ ] Logout button works and redirects to login
- [ ] Desk layout matches `desk.html` design
- [ ] All actions are authenticated server-side
- [ ] Visual match against `desk.html` design

## Notes

- The desk list in the design shows "Updated" timestamp. The TDD schema has `updatedAt` — include this in the list display.
- The design uses a grid layout for desk items (`grid-template-columns: 1fr auto`). On mobile, it stacks to single column.
- The "Edit" action links to `/desk/writings/[id]` which will render the editor (Phase 06). For now, the link can point to a placeholder.
- The new writing flow: Click "New writing" → editor opens in "new" mode → user writes → saves → writing appears in desk list.
