# Phase 09 — Testing & Production

## Objective

Write automated tests for core functionality, verify the production build, configure deployment, and ensure the application is production-ready.

## Scope

- Unit tests (slug generation, validation, auth helpers)
- Integration tests (server actions, CRUD operations)
- E2E tests (full user flows)
- Production build verification
- Environment variable configuration
- Database migration in production
- Deployment configuration

## Dependencies

- **Phases 01–08** must be complete (all features implemented and polished)

## Files/Directories to Create/Modify

```
me-write-app/
├── __tests__/
│   ├── unit/
│   │   ├── slug.test.ts              # Slug generation tests
│   │   ├── validation.test.ts        # Zod schema tests
│   │   └── auth.test.ts             # Auth helper tests
│   ├── integration/
│   │   ├── writings.test.ts          # Writing CRUD tests
│   │   ├── author.test.ts           # Author update tests
│   │   └── auth.test.ts             # Login/logout tests
│   └── e2e/
│       ├── login.spec.ts             # Login flow
│       ├── writing-crud.spec.ts      # Create, edit, delete writing
│       ├── publish.spec.ts           # Publish/unpublish flow
│       ├── public.spec.ts            # Public archive and writing pages
│       ├── settings.spec.ts          # Author settings
│       └── full-flow.spec.ts         # Complete user journey
├── test/
│   ├── setup.ts                      # Test setup (Prisma test client, etc.)
│   └── fixtures/
│       └── seed.ts                   # Test seed data
├── vitest.config.ts                  # Unit/integration test config
├── playwright.config.ts              # E2E test config
├── package.json                      # Add test scripts
├── vercel.json                       # Vercel deployment config (if needed)
└── .github/
    └── workflows/
        └── ci.yml                    # CI/CD pipeline (optional)
```

## Implementation Tasks (Execution Order)

### 1. Set up testing infrastructure

**Unit/Integration tests — Vitest:**
```bash
npm install -D vitest @vitejs/plugin-react
```

Configure `vitest.config.ts`:
- Path aliases matching `tsconfig.json`
- Prisma test database setup
- Environment variables for test DB

**E2E tests — Playwright:**
```bash
npm install -D @playwright/test
npx playwright install
```

Configure `playwright.config.ts`:
- Base URL: `http://localhost:3000`
- Test directory: `__tests__/e2e`
- Web server: `npm run dev` (or `npm run build && npm start`)

### 2. Create test setup (`test/setup.ts`)

- Create a test database connection
- Seed test data before each test suite
- Clean up after tests
- Mock authentication for unit tests

### 3. Write unit tests

**`__tests__/unit/slug.test.ts`:**
```
- generateSlug with title → correct format
- generateSlug without title → untitled-YYYY-MM-DD-XXXX format
- slugify handles special characters
- slugify collapses multiple hyphens
- slugify truncates long titles
- Collision handling → suffix incremented
```

**`__tests__/unit/validation.test.ts`:**
```
- createWritingSchema validates date (required)
- createWritingSchema validates content (required, must be Tiptap doc)
- createWritingSchema allows optional title
- updateWritingSchema requires id
- publishWritingSchema requires id
- deleteWritingSchema requires id
- loginSchema validates email format
- loginSchema requires password
- updateAuthorSchema requires name
- updateAuthorSchema allows optional bio
```

**`__tests__/unit/auth.test.ts`:**
```
- hashPassword produces bcrypt hash
- comparePassword returns true for correct password
- comparePassword returns false for incorrect password
- createSession sets cookie
- getSession reads valid session
- getSession returns null for expired/invalid session
- destroySession clears cookie
```

### 4. Write integration tests

**`__tests__/integration/writings.test.ts`:**
```
- createWriting inserts record with correct slug
- createWriting without title generates untitled slug
- updateWriting modifies existing record
- updateWriting does not change slug
- deleteWriting removes record
- publishWriting sets published: true
- unpublishWriting sets published: false
- All actions require authentication
- Invalid input returns validation error
```

**`__tests__/integration/author.test.ts`:**
```
- updateAuthor modifies singleton record
- updateAuthor requires authentication
- updateAuthor validates name is required
- updateAuthor allows optional bio and imageUrl
```

**`__tests__/integration/auth.test.ts`:**
```
- login with valid credentials creates session
- login with invalid credentials fails
- logout destroys session
- unauthenticated request redirected
```

### 5. Write E2E tests

**`__tests__/e2e/login.spec.ts`:**
```
- Login page renders correctly
- Login with valid credentials → redirects to desk
- Login with invalid credentials → shows error
- Logout → redirects to login
- Desk inaccessible without login
```

**`__tests__/e2e/writing-crud.spec.ts`:**
```
- Create new writing from desk
- Enter title and content
- Save writing
- Writing appears in desk list
- Edit existing writing
- Change title and content
- Save changes
- Delete writing with confirmation
- Writing removed from list
```

**`__tests__/e2e/publish.spec.ts`:**
```
- Create new writing
- Publish writing → status changes to "Published"
- Verify writing appears on homepage
- Verify writing page is accessible
- Unpublish writing → status changes to "Draft"
- Verify writing disappears from homepage
- Verify writing page returns 404
```

**`__tests__/e2e/public.spec.ts`:**
```
- Homepage shows published writings sorted by date
- Homepage shows empty state when no writings
- Writing page renders content correctly
- Writing page shows author info
- Unpublished writing URL → 404
- Non-existent URL → 404
- SEO metadata present in page head
```

**`__tests__/e2e/settings.spec.ts`:**
```
- Settings page loads with current author data
- Update author name → saves successfully
- Update author bio → saves successfully
- Upload profile image → preview shows
- Remove profile image → preview clears
- Public pages reflect updated author info
```

**`__tests__/e2e/full-flow.spec.ts`:**
```
Complete user journey:
1. Login
2. Create a writing
3. Add title and content
4. Save
5. Publish
6. Verify on homepage
7. View writing page
8. Update author settings
9. Verify author info updated on writing page
10. Unpublish writing
11. Verify removed from homepage
12. Delete writing
13. Logout
14. Verify desk inaccessible
```

### 6. Add test scripts to `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run __tests__/unit",
    "test:integration": "vitest run __tests__/integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 7. Verify production build

```bash
npm run build
npm start
```

Check:
- No build errors
- No TypeScript errors
- All pages render correctly
- Static pages generated where expected
- Server components render correctly
- Database connection works in production mode

### 8. Configure environment variables

**Production environment:**
```
DATABASE_URL=postgresql://...
AUTH_SECRET=<strong-random-secret>
```

**Verify:**
- `.env.local` is in `.gitignore`
- `.env.example` documents required variables
- No secrets committed to repository

### 9. Database migration for production

```bash
npx prisma migrate deploy
npx prisma db seed  # If seed data is desired
```

Verify:
- Migration runs without errors
- Tables created correctly
- Indexes exist on `Writing(published, date)`
- Seed data (if any) inserted correctly

### 10. Configure Vercel deployment

**`vercel.json` (if needed):**
```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs"
}
```

Or configure in Vercel dashboard:
- Build command: `prisma generate && next build`
- Install command: `npm install`
- Environment variables set in dashboard

**Vercel-specific considerations:**
- Prisma with PostgreSQL works on Vercel (use connection pooling)
- Consider using `@prisma/adapter-pg` for serverless compatibility
- Set `DATABASE_URL` with connection pooling parameters

### 11. Optional: CI/CD pipeline

**`.github/workflows/ci.yml`:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run build
```

## Database/Schema Changes

None — schema is finalized. This phase only verifies migrations work.

## UI/Components Involved

None — this is a testing and deployment phase.

## Server/Client Boundaries

- Tests run both server-side (unit/integration) and browser-side (E2E)
- E2E tests use Playwright to simulate real user interactions
- Unit tests mock server-side dependencies

## Validation/Security Considerations

- Verify no secrets in repository
- Verify environment variables are documented
- Verify database connection pooling works in production
- Verify auth works in production environment

## Testing Requirements

- All unit tests pass
- All integration tests pass
- All E2E tests pass
- Production build succeeds
- No TypeScript errors
- No runtime errors in production

## Definition of Done

- [ ] Unit tests cover slug generation, validation, auth helpers
- [ ] Integration tests cover CRUD operations, auth
- [ ] E2E tests cover full user flows
- [ ] All tests pass
- [ ] Production build succeeds without errors
- [ ] Environment variables documented in `.env.example`
- [ ] Database migration runs successfully
- [ ] Application works in production mode
- [ ] No secrets committed to repository
- [ ] Deployment configuration ready (Vercel or equivalent)

## Notes

- For the single-author app, extensive testing may feel like overkill. However, the TDD explicitly requires unit, integration, and E2E tests. Follow the TDD requirements.
- The test seed data should include a few writings (published and unpublished) and an author record.
- E2E tests should use a test database, not the development database.
- Consider using `vitest` for both unit and integration tests (same test runner).
- Playwright tests should cover the responsive viewports specified in the design handoff.
- The CI pipeline is optional but recommended for catching regressions.
