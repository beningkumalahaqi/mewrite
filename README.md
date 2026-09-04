# MeWrite

A minimal, fast personal writing platform built with Next.js. Write, manage, and publish long-form thoughts with a clean reading experience.

## What It Does

- **Writing Editor** — Tiptap-based rich text editor with formatting, links, highlights, and placeholders
- **Public Blog** — Clean, responsive reading experience for published writings
- **Desk** — Private dashboard to create, edit, publish, and unpublish writings
- **Author Profile** — Configurable author name and bio shown on every post
- **URL Shortener** — Built-in short link generator for sharing writings
- **SEO** — Automatic sitemap, Open Graph, and JSON-LD structured data
- **Caching** — Page-level caching with instant invalidation on content updates

## Tech Stack

- **Framework:** Next.js 16 (App Router, Cache Components)
- **Database:** PostgreSQL with Prisma 7
- **Auth:** JWT-based (jose + bcryptjs)
- **Editor:** Tiptap 3
- **Styling:** Tailwind CSS 4
- **Validation:** Zod 4
- **Testing:** Vitest

## Deploy on Vercel

1. **Fork or clone this repo**

2. **Create a PostgreSQL database**
   You can use [Neon](https://neon.tech), [Supabase](https://supabase.com), or any Postgres provider.

3. **Set environment variables on Vercel**

   Go to your Vercel project → Settings → Environment Variables and add:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/mewrite?sslmode=require
   AUTH_SECRET=your-secure-random-string
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   Vercel will auto-detect Next.js and run `prisma generate && next build`. After deployment, run the first DB migration:

   ```bash
   npx prisma db push
   ```

5. **Create your first user**
   Register at `/login` — the first user becomes the admin.

## Local Development

```bash
# Clone
git clone https://github.com/beningkumalahaqi/mewrite.git
cd mewrite

# Install dependencies
cd me-write-app && npm install

# Set up env
cp .env.example .env
# Edit .env with your DATABASE_URL and AUTH_SECRET

# Push schema to database
npx prisma db push

# Seed (optional)
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
me-write/
├── me-write-app/
│   ├── app/
│   │   ├── (public)/        # Public routes (home, writings, s/[code])
│   │   ├── desk/            # Private dashboard
│   │   ├── api/             # API routes
│   │   └── actions/         # Server actions
│   ├── components/
│   │   ├── editor/          # Tiptap editor + renderer
│   │   ├── desk/            # Dashboard UI
│   │   └── public/          # Public-facing components
│   ├── lib/                 # Utilities (auth, db, slug, validation)
│   ├── prisma/              # Schema and seed
│   └── next.config.ts
├── plans/                   # Planning docs
└── README.md
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run all tests |
| `npm run db:push` | Push schema changes |
| `npm run db:seed` | Seed database |

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m "feat: add my feature"`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

Keep commits focused and messages concise. Run `npm run test` before submitting.

## License

[MIT](LICENSE)
