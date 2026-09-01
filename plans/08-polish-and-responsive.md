# Phase 08 — Polish & Responsive

## Objective

Perform a comprehensive visual polish pass, verify responsive behavior across the viewport matrix, implement missing empty states and error pages, and ensure pixel-perfect fidelity against the design exports.

## Scope

- Responsive testing and fixes across all viewports
- Empty state screens (all contexts)
- Error pages (404, 500)
- Loading states
- Visual fidelity pass against design files
- Accessibility audit
- Cross-browser testing
- Print stylesheet (optional)

## Dependencies

- **Phases 01–07** must be complete (all pages and features exist)

## Files/Directories to Create/Modify

```
me-write-app/
├── app/
│   ├── not-found.tsx                 # Global 404 (may already exist)
│   ├── error.tsx                     # Global error boundary
│   ├── loading.tsx                   # Global loading state
│   ├── (public)/
│   │   ├── loading.tsx               # Public pages loading
│   │   └── writings/
│   │       └── [slug]/
│   │           ├── loading.tsx       # Writing page loading
│   │           └── error.tsx         # Writing page error
│   └── desk/
│       ├── loading.tsx               # Desk loading
│       └── error.tsx                 # Desk error
├── components/
│   └── ui/
│       ├── loading-spinner.tsx       # Reusable loading indicator
│       └── error-boundary.tsx        # Error boundary component
├── styles/
│   └── print.css                     # Optional print stylesheet
```

## Implementation Tasks (Execution Order)

### 1. Responsive verification — Mobile (360–430px)

Test and fix at these viewports:
- 360×800 (mobile compact)
- 390×844 (mobile standard)
- 430×932 (mobile large)

Check:
- Navigation doesn't overflow
- Writing list items stack correctly
- Editor toolbar wraps gracefully
- Form inputs are full-width
- Login card is full-width
- Settings form is properly padded
- Footer stacks vertically
- No horizontal scrolling

### 2. Responsive verification — Tablet (600–1024px)

Test and fix at these viewports:
- 600×960 (foldable/small tablet)
- 820×1180 (tablet portrait)
- 1024×768 (tablet landscape)

Check:
- Writing list uses appropriate width
- Editor has proper margins
- Desk items maintain grid layout
- Settings form is centered
- Typography scales appropriately

### 3. Responsive verification — Desktop (1366–1920px)

Test and fix at these viewports:
- 1366×768 (laptop)
- 1440×900 (desktop)
- 1920×1080 (wide desktop)

Check:
- Content stays centered
- Max widths are respected
- Writing content stays at 640px
- Desk list stays at 960px
- Page container stays at 1120px
- No excessive whitespace

### 4. Implement empty states

All empty states should match the design system's `.empty-state` class.

**Homepage (no published writings):**
- "The desk is quiet."
- "Writings will appear here once published."

**Desk (no writings):**
- "Your desk is empty."
- "Start writing — put something into the world."
- "New writing →" button

**Writing page (not found):**
- "Writing not found"
- "This piece may have been moved or unpublished."
- "← Back to writings" button

### 5. Implement error pages

**Global 404 (`app/not-found.tsx`):**
- Clean not-found page
- "Page not found" heading
- "← Back to writings" link
- Matches design system styling

**Global error (`app/error.tsx`):**
- Client Component (error boundaries must be client-side)
- "Something went wrong" heading
- "Try again" button
- Minimal, matches design system

**Writing-specific error (`app/(public)/writings/[slug]/error.tsx`):**
- "Unable to load writing" message
- "← Back to writings" link

### 6. Implement loading states

**Global loading (`app/loading.tsx`):**
- Simple spinner or skeleton
- Minimal, matches design system

**Page-specific loading:**
- Writing list skeleton (placeholder items)
- Writing page skeleton (header + body placeholders)
- Desk list skeleton

### 7. Accessibility audit

Check and fix:
- All pages have proper heading hierarchy (h1 → h2 → h3)
- All form inputs have labels
- All buttons have accessible names
- Focus states are visible (check design system focus styles)
- Color contrast meets WCAG AA (check muted text against background)
- Skip-to-content link (optional but recommended)
- Alt text on images (avatar)
- Keyboard navigation works throughout
- Screen reader announces page changes

### 8. Visual fidelity pass

Compare each page against its design export:

**Homepage vs `index.html`:**
- Nav structure and spacing
- Author header (name, bio)
- Writing list items (date, title, preview)
- Empty state
- Footer

**Login vs `login.html`:**
- Centered card layout
- Title and subtitle
- Form inputs and button
- Error message styling

**Desk vs `desk.html`:**
- Nav structure
- Header with "New writing" button
- Writing list items (title, date, status, actions)
- Empty state
- Footer

**Editor vs `editor.html`:**
- Topbar (back link, label, save status, save button)
- Meta inputs (date, title)
- Toolbar buttons and layout
- Editor area styling

**Writing vs `writing.html`:**
- Writing header (date, title, author)
- Writing body (prose typography)
- Author card
- Back link

**Settings vs `settings.html`:**
- Nav structure
- Avatar section
- Form layout
- Save button and success message

### 9. Cross-browser testing

Test in:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome for Android

Check:
- Typography renders correctly
- Layout is consistent
- Forms work properly
- Editor functions correctly
- No JavaScript errors

### 10. Print stylesheet (optional)

Add basic print styles:
- Hide navigation and footer
- Full-width content
- Black text on white background
- Preserve typography hierarchy

## Database/Schema Changes

None.

## UI/Components Involved

- All pages (responsive fixes)
- Error boundaries
- Loading states
- Empty states
- Accessibility improvements

## Server/Client Boundaries

- Error boundaries are Client Components
- Loading states are Server Components (Next.js Suspense)
- All other fixes are CSS/structural

## Validation/Security Considerations

- Ensure error pages don't leak sensitive information
- Loading states don't expose data
- Accessibility compliance

## Testing Requirements

- Visual match at all viewports (360, 390, 430, 600, 820, 1024, 1366, 1440, 1920)
- No horizontal scrolling at any viewport
- All empty states display correctly
- Error pages render without errors
- Loading states appear during data fetching
- Keyboard navigation works throughout
- Focus states visible
- Color contrast passes WCAG AA

## Definition of Done

- [ ] All viewports tested (360px through 1920px)
- [ ] No horizontal scrolling at any viewport
- [ ] All empty states implemented and styled
- [ ] 404 page works and matches design
- [ ] Error boundary catches runtime errors
- [ ] Loading states show during data fetching
- [ ] Heading hierarchy is correct on all pages
- [ ] All form inputs have labels
- [ ] Focus states are visible
- [ ] Color contrast passes WCAG AA
- [ ] Visual fidelity matches design exports
- [ ] Cross-browser testing complete
- [ ] No JavaScript console errors

## Notes

- The design handoff specifies a 2025–2026 viewport matrix. Test at all specified sizes.
- The design uses `clamp()` for fluid typography in some places — verify these work correctly in Tailwind.
- The responsive breakpoints in `css/style.css` use `@media (max-width: 768px)` and `@media (max-width: 480px)`. Ensure Tailwind's responsive prefixes align with these.
- The mobile reading experience is "particularly important" per the PRD. Prioritize mobile fixes.
- The design uses OKLCH color values. Ensure the browser support matrix includes OKLCH (all modern browsers support it).
