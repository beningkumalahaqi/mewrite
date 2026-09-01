# MeWrite — Implementation Plan

## Overall Strategy

MeWrite is a minimal personal writing website: one author, a private writing desk, and a public editorial archive. The implementation follows a bottom-up approach — foundational infrastructure first, domain logic next, then UI layer by layer.

The app lives at `./me-write-app/` within this repository.

**Design principle:** Every phase delivers something visually verifiable against the exported design files in `./documents/MeWrite-Design/`. The design handoff is the visual source of truth — not generic SaaS UI patterns.

## Phase Order

| Phase | Name | Delivers |
|-------|------|----------|
| 01 | Foundation | Next.js 16 project, Tailwind config with design tokens, global layout, routing skeleton |
| 02 | Database & Auth | Prisma schema, PostgreSQL, session-based auth, login page |
| 03 | Writing Domain | CRUD server actions, slug generation, Zod validation |
| 04 | Public Experience | Homepage archive, individual writing page, author card, SEO |
| 05 | Desk | Writing list, publish/unpublish, delete, new writing flow |
| 06 | Editor | Tiptap rich-text editor, save state, keyboard shortcuts |
| 07 | Author Settings | Settings form, profile image upload, global author updates |
| 08 | Polish & Responsive | Responsive testing, empty states, error pages, visual refinement |
| 09 | Testing & Production | Unit, integration, and E2E tests; production build; deployment config |

## Dependency Graph

```
01 Foundation
    └──► 02 Database & Auth
              ├──► 03 Writing Domain ──► 04 Public Experience
              │                          └──► 05 Desk ──► 06 Editor
              └──► 07 Author Settings ──────────────────────►
                                                          │
                                              08 Polish & Responsive
                                                          │
                                              09 Testing & Production
```

**Critical path:** 01 → 02 → 03 → 04/05 (parallel) → 06 → 08 → 09

- Phases 04 and 05 can overlap once 03 is done (public pages and desk pages are independent routes).
- Phase 07 (Author Settings) only depends on 02 (auth) and can start as soon as auth works.
- Phase 08 (Polish) runs after all UI pages exist.
- Phase 09 (Testing) runs last, after all features are complete.

## What Each Phase Delivers

### Phase 01 — Foundation
A working Next.js 16 app with Tailwind CSS configured to match the Editorial Monocle design system. Global layout, navigation shell, and route placeholders. No database, no auth yet.

### Phase 02 — Database & Auth
Prisma 7 with PostgreSQL. User, Author, Writing models. Email/password login with secure session cookies. Protected Desk layout. Login page matching `login.html` design.

### Phase 03 — Writing Domain
Server actions for create, update, delete, publish, unpublish. Slug generation (title + date). Zod validation schemas. No UI — just the action layer.

### Phase 04 — Public Experience
Homepage showing published writings sorted by date (newest first). Individual writing pages with rich-text rendering, author card, back link. SEO metadata, sitemap.xml, robots.txt.

### Phase 05 — Desk
Writing list with title, date, status, edit/publish/delete actions. New writing page. Auth-protected desk layout matching `desk.html` design.

### Phase 06 — Editor
Tiptap-based rich-text editor with toolbar (bold, italic, H2, blockquote, link, lists). Date selector, optional title, save state indicator, Cmd+S shortcut. Matches `editor.html` design.

### Phase 07 — Author Settings
Settings form for name, bio, profile image. Image upload preview. Saves to singleton Author record. Matches `settings.html` design.

### Phase 08 — Polish & Responsive
Responsive verification across viewport matrix. Empty state screens. Error pages (404, 500). Loading states. Visual fidelity pass against design exports.

### Phase 09 — Testing & Production
Unit tests (slug gen, validation, auth helpers). Integration tests (CRUD actions, auth). E2E tests (full user flows). Production build verification. Vercel deployment config.

## Architectural Decisions

1. **Next.js App Router with Server Components by default.** Client Components only where interactivity demands it (editor, forms, publish toggle).

2. **Server Actions over Route Handlers** for all mutations. Simpler, type-safe, revalidation built in.

3. **Prisma 7 with PostgreSQL.** Content stored as JSON (editor document structure). Single database for all models.

4. **Session-based auth with cookies.** No JWT complexity. Server-side session validation on every mutation.

5. **Tiptap for rich text.** Stores structured JSON in PostgreSQL. Renders via a shared prose renderer on public pages.

6. **Zod for validation.** Both client-side (form feedback) and server-side (action validation).

7. **No client state management libraries.** React state + Server Components cover all needs.

8. **Design tokens from CSS custom properties → Tailwind config.** The Editorial Monocle palette, type scale, spacing, and layout widths are extracted from `css/style.css` and mapped to Tailwind theme extensions.

## Design Implementation Principles

1. **Match exported pixels first, refactor internals second.** The design files are the visual contract.

2. **Editorial Monocle design system is non-negotiable.** Warm paper background (`oklch(98% 0.004 95)`), dark ink foreground (`oklch(20% 0.018 70)`), terracotta accent (`oklch(52% 0.10 28)`). No substitutions.

3. **Typography is editorial, not SaaS.** Serif display font (Iowan Old Style / Charter / Georgia) for headings and titles. System sans-serif for body. Mono for meta/status.

4. **Content width is sacred.** `640px` for reading content. `960px` for desk lists. `1120px` for page containers.

5. **Mobile reading experience is prioritized.** The PRD explicitly states mobile reading is particularly important.

6. **No card-grid blog layouts.** The design uses editorial list items with date/title/preview, not blog card grids.

## Risks & Decisions to Resolve

1. **Profile image storage.** The design shows avatar upload but doesn't specify storage. Options: Vercel Blob, S3, or base64 in DB (not recommended for production). Recommendation: Use Vercel Blob or a simple file upload to a `/public/avatars` directory for MVP, with a clear upgrade path.

2. **Rich-text content sanitization.** Tiptap produces structured JSON, but links need sanitization. Need to define allowed HTML tags if any raw HTML rendering is needed.

3. **Slug collision handling for untitled writings.** The TDD specifies `untitled-2026-09-01-a1b2` format. Need to confirm random suffix length and uniqueness guarantee.

4. **Seed data.** The design prototype includes 22 sample writings and seed author data. Should the production app seed the database on first run, or start empty? Recommendation: Include a seed script but don't auto-run it.

5. **Password for initial author account.** The design uses a hardcoded password hint. Production needs a secure way to set the initial password (env variable or seed script).

## Recommended Execution Sequence

1. Start Phase 01 immediately — it's pure scaffolding with no dependencies.
2. Phase 02 begins as soon as 01 compiles. Database setup and auth are the foundation everything else depends on.
3. Phase 03 (writing domain) runs after 02. It's purely backend logic.
4. Phases 04 and 05 can start in parallel after 03 — they build different routes (public vs desk).
5. Phase 06 (editor) depends on 05 (desk needs to exist to link to editor).
6. Phase 07 (settings) can start after 02, runs independently.
7. Phase 08 runs after all pages exist.
8. Phase 09 runs last.

**Estimated total effort:** Medium. The scope is intentionally small. Each phase should be completable in a focused session.
