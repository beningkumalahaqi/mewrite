# Phase 01 — Foundation

## Objective

Set up the Next.js 16 project with TypeScript, Tailwind CSS, and the Editorial Monocle design system. Establish the global layout, navigation shell, and route placeholders for all pages.

## Scope

- Next.js 16 project initialization (App Router)
- TypeScript configuration
- Tailwind CSS with design tokens extracted from `./documents/MeWrite-Design/css/style.css`
- Global layout with navigation and footer
- Route placeholders for all public and desk pages
- No database, no auth, no dynamic content yet

## Dependencies

None — this is the starting point.

## Files/Directories to Create

```
me-write-app/
├── app/
│   ├── layout.tsx                    # Root layout (html, body, fonts)
│   ├── (public)/
│   │   ├── layout.tsx                # Public layout (nav, footer, container)
│   │   ├── page.tsx                  # Homepage placeholder
│   │   └── writings/
│   │       └── [slug]/
│   │           └── page.tsx          # Writing page placeholder
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page placeholder
│   ├── desk/
│   │   ├── layout.tsx                # Desk layout (nav, footer, auth guard placeholder)
│   │   ├── page.tsx                  # Desk list placeholder
│   │   ├── writings/
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # New writing placeholder
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Edit writing placeholder
│   │   └── settings/
│   │       └── page.tsx              # Settings placeholder
│   └── globals.css                   # Tailwind directives + custom properties
├── components/
│   ├── public/
│   │   ├── nav.tsx                   # Navigation bar
│   │   └── footer.tsx                # Footer
│   ├── desk/
│   │   └── nav.tsx                   # Desk navigation bar
│   └── ui/
│       └── container.tsx             # Layout container
├── lib/
│   └── utils.ts                      # cn() helper or similar
├── tailwind.config.ts                # Extended with design tokens
├── tsconfig.json
├── next.config.ts
├── package.json
└── .env.example                      # DATABASE_URL, AUTH_SECRET
```

## Implementation Tasks (Execution Order)

### 1. Initialize Next.js project
```bash
npx create-next-app@latest me-write-app --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```
- Use App Router (default in Next.js 16)
- TypeScript enabled
- Tailwind CSS enabled
- ESLint enabled

### 2. Extract design tokens into Tailwind config

Map from `css/style.css` custom properties to Tailwind theme extensions:

**Colors:**
| Token | CSS Value | Tailwind |
|-------|-----------|----------|
| `--bg` | `oklch(98% 0.004 95)` | `background.bg` |
| `--surface` | `oklch(100% 0.002 95)` | `background.surface` |
| `--fg` | `oklch(20% 0.018 70)` | `foreground.DEFAULT` |
| `--muted` | `oklch(48% 0.012 70)` | `foreground.muted` |
| `--border` | `oklch(90% 0.006 95)` | `border.DEFAULT` |
| `--accent` | `oklch(52% 0.10 28)` | `accent.DEFAULT` |

**Typography:**
| Token | Value | Tailwind |
|-------|-------|----------|
| `--font-display` | `'Iowan Old Style', 'Charter', Georgia, serif` | `fontFamily.display` |
| `--font-body` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif` | `fontFamily.body` |
| `--font-mono` | `'SF Mono', 'Menlo', 'Consolas', monospace` | `fontFamily.mono` |

**Type scale (modular, 1.25 ratio):**
| Token | Value | Tailwind |
|-------|-------|----------|
| `--text-xs` | `0.75rem` | `fontSize.xs` |
| `--text-sm` | `0.875rem` | `fontSize.sm` |
| `--text-base` | `1rem` | `fontSize.base` |
| `--text-lg` | `1.125rem` | `fontSize.lg` |
| `--text-xl` | `1.25rem` | `fontSize.xl` |
| `--text-2xl` | `1.5rem` | `fontSize.2xl` |
| `--text-3xl` | `2rem` | `fontSize.3xl` |
| `--text-4xl` | `2.75rem` | `fontSize.4xl` |
| `--text-5xl` | `3.75rem` | `fontSize.5xl` |

**Spacing:** Use Tailwind defaults (they align well enough). Keep CSS custom properties in `globals.css` for prose/editor use.

**Layout widths:**
| Token | Value | Tailwind |
|-------|-------|----------|
| `--content-width` | `640px` | `maxWidth.content` |
| `--wide-width` | `960px` | `maxWidth.wide` |
| `--page-width` | `1120px` | `maxWidth.page` |

**Transitions:**
| Token | Value | Tailwind |
|-------|-------|----------|
| `--ease` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | `transitionTimingFunction.DEFAULT` |
| `--duration` | `200ms` | `transitionDuration.DEFAULT` |

### 3. Set up globals.css

Include Tailwind directives and the CSS custom properties from the design system. Also include the prose classes, utility classes, and reset styles from `css/style.css`.

Key sections to port:
- CSS reset (box-sizing, margin/padding reset)
- Typography defaults (body font, heading styles)
- `.prose` class for rich-text rendering
- `.container` utility
- Button classes (`.btn`, `.btn--primary`, etc.)
- Form classes (`.form-group`, `.form-input`, etc.)
- Status pills (`.status`, `.status--published`, `.status--draft`)
- Writing list styles (`.writing-item`, etc.)
- Desk list styles (`.desk-item`, etc.)
- Empty state styles
- Login page styles
- Settings page styles
- Editor styles (toolbar, area)
- Responsive breakpoints

### 4. Create root layout (`app/layout.tsx`)

- Set `<html lang="en">`
- Apply body font family
- Apply background color
- Set min-height 100vh
- Include global CSS

### 5. Create public layout (`app/(public)/layout.tsx`)

- Navigation bar with brand link ("HaqiZ") and links ("Writings", "Desk")
- Footer with brand and copyright
- Container wrapper (max-width: 1120px)
- Match `index.html` nav/footer structure exactly

### 6. Create desk layout (`app/desk/layout.tsx`)

- Navigation bar with brand, "Public site", "Settings", "Log out" links
- Footer
- Container wrapper
- Auth guard placeholder (just a comment for now — will be implemented in Phase 02)
- Match `desk.html` nav structure exactly

### 7. Create route placeholders

Each page should render a simple heading and brief description. These will be replaced with real content in later phases.

- `app/(public)/page.tsx` — "Writing Archive — Homepage"
- `app/(public)/writings/[slug]/page.tsx` — "Writing Page — [slug]"
- `app/(auth)/login/page.tsx` — "Login Page"
- `app/desk/page.tsx` — "Desk — Writing List"
- `app/desk/writings/new/page.tsx` — "New Writing"
- `app/desk/writings/[id]/page.tsx` — "Edit Writing — [id]"
- `app/desk/settings/page.tsx` — "Author Settings"

### 8. Create shared components

- `components/public/nav.tsx` — Public navigation (Server Component)
- `components/public/footer.tsx` — Public footer (Server Component)
- `components/desk/nav.tsx` — Desk navigation (Server Component)
- `components/ui/container.tsx` — Layout container wrapper

### 9. Create utility file

- `lib/utils.ts` — `cn()` helper for conditional classnames (if using clsx/tailwind-merge)

### 10. Create .env.example

```
DATABASE_URL=
AUTH_SECRET=
```

## Database/Schema Changes

None in this phase.

## UI/Components Involved

- Root layout, public layout, desk layout
- Navigation bars (public and desk)
- Footer
- Container wrapper
- Route placeholder pages

## Server/Client Boundaries

- All layouts and placeholder pages are Server Components (default in Next.js 16)
- No Client Components needed yet

## Validation/Security Considerations

- None yet — this is scaffolding only

## Testing Requirements

- Verify `npm run dev` starts without errors
- Verify all routes render without errors
- Verify Tailwind styles compile correctly
- Verify responsive layout at mobile/tablet/desktop breakpoints
- Visual check against design files for nav, footer, container

## Definition of Done

- [ ] `npm run dev` starts successfully
- [ ] All routes render placeholder content
- [ ] Tailwind config includes all design tokens from `css/style.css`
- [ ] Global layout matches design system (background, typography, spacing)
- [ ] Public nav matches `index.html` nav structure
- [ ] Desk nav matches `desk.html` nav structure
- [ ] Footer matches design
- [ ] Container widths match design (`content-width`, `wide-width`, `page-width`)
- [ ] Responsive breakpoints work (mobile/tablet/desktop)
- [ ] No TypeScript errors
- [ ] `.env.example` created

## Notes

- The design uses CSS custom properties extensively. Keep them in `globals.css` alongside Tailwind — don't try to eliminate them entirely. The prose classes and editor styles reference them directly.
- The nav in the design shows "HaqiZ" as the brand. This should be dynamic later (from Author settings), but for now hardcode it.
- Font loading: The design specifies `'Iowan Old Style'` and `'Charter'` which are system serif fonts on macOS/iOS. For cross-platform consistency, consider loading a web font (e.g., Charter from a CDN, or use Georgia as the primary). The design handoff says to match exported behavior — the CSS already has the fallback chain.
