# Phase 02 — Database & Auth

## Objective

Set up PostgreSQL with Prisma 7, implement the database schema (User, Author, Writing), and build session-based email/password authentication. Deliver a working login page and protected Desk layout.

## Scope

- Prisma schema with all three models
- Database migration
- Seed script for initial author and user account
- Authentication actions (login, logout)
- Session management with secure cookies
- Login page UI matching `login.html` design
- Auth guard on Desk layout
- Redirect logic (unauthenticated → login, authenticated → desk)

## Dependencies

- **Phase 01** must be complete (Next.js project, layout, Tailwind config)

## Files/Directories to Create/Modify

```
me-write-app/
├── prisma/
│   ├── schema.prisma                 # All three models
│   └── seed.ts                       # Seed script
├── lib/
│   ├── auth/
│   │   ├── session.ts                # Session management (cookie read/write)
│   │   ├── password.ts               # Password hashing (bcrypt/argon2)
│   │   └── middleware.ts             # Auth guard helper
│   ├── db.ts                         # Prisma client singleton
│   └── validations/
│       └── auth.ts                   # Zod schema for login input
├── app/
│   ├── actions/
│   │   └── auth.ts                   # login(), logout() server actions
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page (replace placeholder)
│   └── desk/
│       └── layout.tsx                # Add auth guard
├── .env                              # DATABASE_URL, AUTH_SECRET
└── package.json                      # Add prisma, bcrypt/argon2 deps
```

## Implementation Tasks (Execution Order)

### 1. Install dependencies

```bash
npm install prisma @prisma/client bcryptjs
npm install -D @types/bcryptjs ts-node
```

Note: Use `bcryptjs` (pure JS, no native build issues on Vercel) or `argon2` if preferred. The TDD says "modern password hashing algorithm" — bcryptjs is acceptable for a single-author app.

### 2. Create Prisma schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Author {
  id        String   @id @default(cuid())
  name      String
  bio       String?
  imageUrl  String?
  updatedAt DateTime @updatedAt
}

model Writing {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String?
  content   Json
  date      DateTime
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([published, date])
}
```

Key decisions:
- `content` is `Json` — stores Tiptap's JSON document structure
- `slug` is unique — prevents duplicate public URLs
- `@@index([published, date])` — optimizes the public archive query
- Single Author record enforced at application level (not DB constraint)

### 3. Create Prisma client singleton (`lib/db.ts`)

Standard Next.js pattern: cache PrismaClient in development to avoid connection exhaustion.

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### 4. Create password hashing utilities (`lib/auth/password.ts`)

- `hashPassword(password: string): Promise<string>` — bcrypt hash
- `comparePassword(password: string, hash: string): Promise<boolean>` — bcrypt compare

### 5. Create session management (`lib/auth/session.ts`)

Use cookies directly (no external auth library for this simple case):

- `createSession(userId: string): Promise<void>` — sets HttpOnly cookie with signed session token
- `getSession(): Promise<{ userId: string } | null>` — reads and validates session cookie
- `destroySession(): Promise<void>` — clears session cookie
- Use `AUTH_SECRET` env var for signing
- Cookie settings: `HttpOnly: true`, `Secure: true` (in production), `SameSite: lax`, `path: /`

Implementation approach: Simple signed cookie containing the userId. No database session store needed for a single-author app.

### 6. Create auth guard helper (`lib/auth/middleware.ts`)

- `requireAuth(): Promise<{ userId: string }>` — throws redirect to `/login` if not authenticated
- Used in Desk layout and all server actions

### 7. Create Zod validation schema (`lib/validations/auth.ts`)

```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
```

### 8. Create auth server actions (`app/actions/auth.ts`)

**`login(formData: FormData)`**
1. Extract email and password from FormData
2. Validate with Zod
3. Find user by email
4. Compare password hash
5. Create session
6. Redirect to `/desk`
7. Return error on failure (don't reveal whether email or password was wrong)

**`logout()`**
1. Destroy session
2. Redirect to `/login`

Both actions must:
- Use `"use server"` directive
- Validate input server-side
- Not expose internal errors to the client

### 9. Create login page (`app/(auth)/login/page.tsx`)

Match `login.html` design exactly:
- Centered card layout (`.login-page`, `.login-card`)
- "HaqiZ" title in display font
- "Private desk" subtitle
- Password input (note: design shows password-only, but PRD says email+password — implement email+password per PRD)
- Error message display
- "Enter" submit button
- Form uses the `login` server action
- Redirect to `/desk` on success
- Show error message on failure

**Design note:** The prototype `login.html` only has a password field. The PRD requires email + password. Follow the PRD: implement email + password fields, but keep the visual design matching (centered card, same typography, same button style).

### 10. Add auth guard to Desk layout (`app/desk/layout.tsx`)

```typescript
// In desk layout (Server Component)
import { requireAuth } from '@/lib/auth/middleware'

export default async function DeskLayout({ children }) {
  await requireAuth() // Redirects to /login if not authenticated
  return (
    // ... existing desk layout with nav, footer, container
  )
}
```

### 11. Create seed script (`prisma/seed.ts`)

- Create a single User record with email and hashed password
- Create a single Author record with default name "HaqiZ" and bio
- Use environment variables for initial credentials
- Add `prisma.seed` config to `package.json`

### 12. Run migration and seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 13. Create .env file

```
DATABASE_URL="postgresql://user:password@localhost:5432/mewrite?schema=public"
AUTH_SECRET="a-secure-random-string"
```

## Database/Schema Changes

- `User` table created
- `Author` table created
- `Writing` table created (empty for now)
- Index on `Writing(published, date)`

## UI/Components Involved

- Login page (full implementation matching `login.html` design)
- Desk layout (auth guard added)

## Server/Client Boundaries

- Login page: Server Component wrapping a Client Component form (needs `useState` for error display, or use form action with server action)
- Auth actions: Server Actions only
- Session management: Server-side only (cookies)
- Desk layout: Server Component with async auth check

## Validation/Security Considerations

- Passwords hashed with bcrypt (cost factor 12)
- Session cookie: HttpOnly, Secure (prod), SameSite lax
- AUTH_SECRET must be a strong random string
- Never reveal whether email or password was incorrect (generic error message)
- Server-side validation on all auth inputs
- Auth guard runs on every Desk page load (not just client-side)

## Testing Requirements

- Login with correct credentials → redirects to /desk
- Login with wrong password → shows error message
- Accessing /desk without session → redirects to /login
- Logout → clears session, redirects to /login
- Session cookie is HttpOnly and Secure

## Definition of Done

- [ ] Prisma schema created and migrated
- [ ] User, Author, Writing tables exist in PostgreSQL
- [ ] Seed script creates initial user and author
- [ ] Login page matches `login.html` design (with email+password per PRD)
- [ ] Login action authenticates and creates session
- [ ] Logout action destroys session
- [ ] Desk layout rejects unauthenticated users
- [ ] Session cookies are secure (HttpOnly, Secure, SameSite)
- [ ] Passwords are hashed, never stored plaintext
- [ ] Error messages are generic (no email enumeration)
- [ ] `npm run dev` works with database connection

## Notes

- The login page design only shows a password field. The PRD requires email + password. Implement both fields while preserving the visual design (centered card, same typography, same spacing).
- For the single-author use case, the email is essentially a username. Consider using a fixed email (e.g., `author@mewrite.app`) in the seed script.
- The Author record is created empty in the seed — the author will fill in their details in Phase 07 (Settings).
- The Writing table is created but empty — no seed writings. The author creates their own content.
