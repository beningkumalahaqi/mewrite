# TDD — Personal Writing Website

## 1. Technical Overview

A minimal full-stack personal writing application.
Name: MeWrite
### Stack

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Prisma 7
* PostgreSQL
* Server-side authentication
* Rich-text editor
* Vercel-compatible deployment

The application should favor Next.js server components and server-side operations wherever possible.

## 2. Architecture

Use a single Next.js application containing:

```text
Browser
   │
   ▼
Next.js App Router
   │
   ├── Public Pages
   │
   ├── Desk Pages
   │
   ├── Server Actions / Route Handlers
   │
   └── Authentication
          │
          ▼
       Prisma 7
          │
          ▼
      PostgreSQL
```

Keep the architecture deliberately small.

Avoid introducing:

* Separate backend services.
* Microservices.
* REST APIs for internal operations unless necessary.
* Client-side state management libraries.
* Unnecessary abstraction layers.

## 3. Project Structure

Recommended structure:

```text
app/
├── (public)/
│   ├── page.tsx
│   └── writings/
│       └── [slug]/
│           └── page.tsx
│
├── (auth)/
│   └── login/
│       └── page.tsx
│
├── desk/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── writings/
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── actions/
│   ├── writings.ts
│   ├── author.ts
│   └── auth.ts
│
└── api/
    └── ...
    
components/
├── public/
├── desk/
├── editor/
└── ui/

lib/
├── auth/
├── db/
├── validations/
└── utils/

prisma/
└── schema.prisma
```

The exact structure can be adjusted if the implementation benefits from simpler organization.

## 4. Database Design

### Writing

```prisma
model Writing {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String?
  content     Json
  date        DateTime
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([published, date])
}
```

`content` stores the structured rich-text document produced by the selected editor.

### Author

There is only one author configuration.

```prisma
model Author {
  id          String   @id @default(cuid())
  name        String
  bio         String?
  imageUrl    String?
  updatedAt   DateTime @updatedAt
}
```

Only one Author record should exist.

### User

Authentication can use a single application user.

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

No public user registration is required.

## 5. Slugs

Each writing requires a unique public slug when published.

Preferred generation:

```text
title + date
```

Examples:

```text
the-things-i-never-said-2026-09-01
untitled-2026-09-01-a1b2
```

Because titles are optional, untitled writings require a collision-safe fallback.

Slug generation must happen server-side.

If an existing published writing is edited, avoid automatically changing its slug unless explicitly required.

## 6. Rich Text

Use a lightweight, React-compatible rich-text editor with a structured JSON output.

Recommended approach:

* Tiptap or equivalent.
* Store editor JSON directly in PostgreSQL through Prisma's `Json` type.
* Render the same structured content on the public page.
* Sanitize/validate links and embedded content.
* Do not store raw unsanitized HTML if avoidable.

The editor should expose only the formatting defined in the PRD.

## 7. Authentication

Authentication should be intentionally simple.

Requirements:

* Email/password login.
* Secure password hashing.
* Secure session cookie.
* Server-side session validation.
* Protected Desk layout/routes.
* Logout functionality.

Authorization must happen on the server for every mutation.

A client hiding a button is not considered authorization.

## 8. Server Actions

Use Server Actions for internal mutations where appropriate.

### Writing Actions

```text
createWriting()
updateWriting()
deleteWriting()
publishWriting()
unpublishWriting()
```

Each action must:

1. Verify authentication.
2. Validate input.
3. Perform database operation.
4. Revalidate affected paths.
5. Return a useful result/error.

### Author Actions

```text
updateAuthor()
```

Must:

1. Verify authentication.
2. Validate input.
3. Update the singleton Author record.
4. Revalidate public pages.

### Authentication Actions

```text
login()
logout()
```

## 9. Validation

Use a schema validation library such as Zod.

Example writing input:

```text
date: required valid date
title: optional string
content: required structured rich-text document
```

Server-side validation is mandatory even if the frontend already validates the form.

## 10. Rendering Strategy

### Public Pages

Prefer Server Components.

The public archive should query:

```text
published = true
```

and sort by:

```text
date DESC
```

Individual writing pages must query only published writings.

### Desk

Desk pages can use Client Components only where interactive behavior requires them, especially:

* Rich-text editor.
* Interactive publish controls.
* Form interactions.

Avoid turning the entire Desk into a client-side application.

## 11. Caching and Revalidation

Public content should be cache-friendly.

When a writing is:

* Created and published.
* Updated.
* Published.
* Unpublished.
* Deleted.

Revalidate:

```text
/
```

and the affected:

```text
/writings/[slug]
```

When Author settings change, revalidate public routes that display author information.

Use Next.js 16's current caching/revalidation APIs according to the final framework configuration.

## 12. Writing Editor

The editor should be visually integrated with the public typography.

Requirements:

* Large comfortable writing area.
* Minimal toolbar.
* Keyboard-friendly.
* Clear save state.
* Publish/unpublish action separated from editing.
* Optional title.
* Date selector.
* Avoid excessive borders and UI chrome.

The editor should feel closer to a writing desk than a traditional CMS form.

## 13. Desk UI

The Desk consists of:

### Writing List

Display:

```text
Title
Date
Status
Updated
Actions
```

Statuses:

```text
Published
Unpublished
```

### Writing Editor

Layout:

```text
Back to Desk

[Date]

[Optional Title]

[Rich Text Editor]

                         [Save] [Publish]
```

For an already published writing:

```text
[Save] [Unpublish]
```

The exact visual implementation follows the OpenDesign design system.

## 14. Public UI

The public interface should prioritize typography.

Core principles:

* Large editorial headings.
* Comfortable line length.
* Generous vertical spacing.
* Strong date/title hierarchy.
* Minimal navigation.
* Subtle interactions.
* No generic card-grid blog layout unless explicitly supported by the design.
* Author identity should feel integrated into the publication rather than appearing as a generic profile card.

## 15. SEO

Each published writing should have:

* Unique title metadata.
* Description derived from content where appropriate.
* Canonical URL.
* Open Graph metadata.
* Twitter/X metadata.

Unpublished writings must not be indexed.

The application should generate:

* `sitemap.xml`
* `robots.txt`

Only published writings should be included in the sitemap.

## 16. Error Handling

Provide clear handling for:

* Invalid login.
* Unauthorized Desk access.
* Writing not found.
* Attempt to access unpublished writing publicly.
* Invalid form input.
* Database errors.
* Failed publishing/unpublishing.

Public users should receive a clean not-found page rather than information about unpublished content.

## 17. Security

### Authentication

* Hash passwords using a modern password hashing algorithm.
* Never store plaintext passwords.
* Use secure, HTTP-only session cookies.
* Configure appropriate SameSite behavior.
* Use secure cookies in production.

### Authorization

Every mutation verifies the authenticated user server-side.

### Content

* Validate rich-text structure.
* Sanitize external links.
* Do not execute arbitrary HTML/scripts from writing content.

### Database

* Use Prisma parameterized queries.
* Never construct SQL using raw user input unless properly parameterized.

## 18. Performance

Prioritize:

* Server Components.
* Minimal client JavaScript.
* Optimized images.
* Database indexes.
* Efficient Prisma queries.
* Cached public pages where appropriate.

The public writing experience should remain extremely lightweight.

## 19. Testing

### Unit Tests

Test:

* Slug generation.
* Input validation.
* Publication state transitions.
* Content validation.
* Authentication helpers.

### Integration Tests

Test:

* Create writing.
* Update writing.
* Delete writing.
* Publish writing.
* Unpublish writing.
* Update author.
* Unauthorized mutations.

### E2E Tests

Critical flows:

1. Login.
2. Create writing.
3. Save unpublished writing.
4. Publish writing.
5. Verify it appears publicly.
6. Unpublish writing.
7. Verify it disappears publicly.
8. Edit writing.
9. Update author settings.
10. Verify author information changes publicly.
11. Logout.
12. Verify Desk is inaccessible.

## 20. Environment Variables

Expected environment variables:

```env
DATABASE_URL=
AUTH_SECRET=
```

Additional variables should only be introduced if required by the selected authentication, storage, or deployment implementation.

## 21. Deployment

Target:

* Vercel for application hosting.
* PostgreSQL-compatible production database.

Production requirements:

* Configure environment variables.
* Run Prisma migrations during deployment.
* Generate Prisma Client as part of the build.
* Ensure database connection handling is compatible with serverless deployment.

## 22. Implementation Principles

1. **Keep the codebase small.**
2. **Prefer platform primitives over libraries.**
3. **Use Server Components by default.**
4. **Use Server Actions for simple mutations.**
5. **Keep the database model minimal.**
6. **Do not build CMS features that are not required.**
7. **The public website is the primary product experience.**
8. **The Desk should optimize for writing, not administration.**
9. **Design quality is important even though functionality is simple.**
10. **Do not sacrifice maintainability for abstraction.**

## 23. Definition of Done

The implementation is complete when:

* PostgreSQL and Prisma are configured.
* Authentication works.
* The singleton Author configuration works.
* Writing CRUD works.
* Rich-text editing works.
* Publishing/unpublishing works.
* Public archive works.
* Public writing pages work.
* Unpublished writings are inaccessible publicly.
* Desk is protected.
* Author information is globally rendered.
* SEO metadata works for published writings.
* Responsive layouts are implemented.
* The implementation follows the OpenDesign design system.
* Core functionality has automated test coverage.
* Production build succeeds.
