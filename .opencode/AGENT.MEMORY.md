# AGENT MEMORY — me-write

## Project
- Next.js 16.3.3 (App Router, Prisma/PostgreSQL) — MeWrite personal blog
- `cacheComponents: true` in `next.config.ts`
- Deployed on Vercel

## Caching Implementation
- `'use cache'` + `cacheLife('max')` + `cacheTag` used on: writing page (`getWriting` helper), `generateMetadata`, home page, `WritingList`, `AuthorCard`, `PublicFooter`
- `export const instant = false` on all dynamic routes with DB/auth/params access:
  - `app/(public)/writings/[slug]/page.tsx` — `params` is per-request
  - `app/desk/layout.tsx` — `requireAuth()` reads cookies
  - `app/desk/page.tsx` — uncached DB call
  - `app/desk/settings/page.tsx` — uncached DB call
  - `app/desk/writings/[id]/page.tsx` — `params` + uncached DB call
- `revalidateTag` requires 2 args in Next.js 16: `(tag, { expire: 0 })` for immediate invalidation
- `revalidatePath` with literal paths (e.g. `'/'`, `'/writings/slug'`) — no `type` arg needed for literal paths
- `notFound()` called outside cached scope to avoid prerender breakage
- Loading skeletons removed (no `loading.tsx` files)

## Key Files
- `next.config.ts` — `cacheComponents: true`
- `app/(public)/writings/[slug]/page.tsx` — `getWriting` cached helper, `instant = false`
- `app/(public)/page.tsx` — home page: grid layout (photo left, name/bio right), `text-4xl` light serif name, uppercase bio, `paddingTop: space-4`
- `components/public/writing-list.tsx` — `WritingList` with `cacheTag('writings-list')`
- `components/public/author-card.tsx` — `AuthorCard` with `'use cache'`
- `components/public/footer.tsx` — async `PublicFooter` with `'use cache'`
- `app/actions/writings.ts` — mutations with `revalidatePath` + `revalidateTag` (2 args)
- `app/api/writings/route.ts` — API PUT with revalidation
- `app/api/writings/[id]/route.ts` — API PATCH/DELETE with revalidation

## Design System
- Serif display font, warm paper palette, terracotta accent
- Homepage: literary journal colophon feel — small photo (96px, rounded), name beside it, quiet uppercase bio
- Writing items: date (mono, xs, uppercase) → title (display, 3xl) → preview (base, muted, 2-line clamp)

## Gotchas
- `unstable_cache` has 2MB limit — cannot cache Tiptap content (~2.6MB) with it
- `export const dynamic = 'force-dynamic'` must be removed when `cacheComponents: true`
- Dev server at `localhost:3000`
- User does not want subagents
