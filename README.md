# Daily Viral MMS

A complete, production-ready 18+ adult media directory built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## Stack

- **Next.js 16** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS v4**
- **PostgreSQL** (database)
- **Prisma ORM** (schema + migrations)
- **bcryptjs** (password hashing)
- **jose** (JWT session tokens)
- **Zod** (schema validation)
- **Lucide React** (icons)

---

## Quick Start

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 15+ running locally or remote

### 2. Clone and install

```bash
cd daily-viral-mms
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/daily_viral_mms?schema=public"
SESSION_SECRET="generate-a-long-random-secret-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Create the database

```sql
CREATE DATABASE daily_viral_mms;
```

### 5. Run migrations

```bash
npx prisma migrate dev --name init
```

### 6. Seed the database

This creates the admin account and default categories.

```bash
npx ts-node --project tsconfig.seed.json prisma/seed.ts
```

Default credentials (change immediately):
- Email: `admin@dailyviralmms.com`
- Password: `Admin@123456`

To use custom credentials:
```bash
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=YourPassword123 npx ts-node --project tsconfig.seed.json prisma/seed.ts
```

### 7. Run development server

```bash
npm run dev
```

Visit:
- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

---

## Project Structure

```
src/
  app/
    (public)/          Public pages with Header/Footer layout
      page.tsx           Homepage
      post/[slug]/       Individual post page
      category/[slug]/   Category listing
      search/            Search results
      trending/          Trending posts
      latest/            Latest posts
      about/             About page
      contact/           Contact page
      privacy/           Privacy policy
      terms/             Terms of service
      dmca/              DMCA page
    admin/               Admin panel (auth-protected)
      login/             Login page
      dashboard/         Dashboard overview
      posts/             Posts management
      categories/        Categories management
      reports/           Content reports
      analytics/         View/click analytics
      settings/          Settings
    api/                 API routes
  components/            Reusable components
  lib/                   Utilities (auth, db, validation, security)
  types/                 TypeScript types
prisma/
  schema.prisma          Database schema
  seed.ts                Database seeder
```

---

## Admin Workflow – Adding a Post

1. Log in at `/admin/login`
2. Navigate to **Add New Post**
3. Enter a title (slug auto-generates)
4. Paste a thumbnail image URL – live preview appears instantly
5. Paste the external content URL (must be HTTPS)
6. Select a category
7. Add optional tags (comma-separated)
8. Click **Publish Now** or **Save as Draft**

The post immediately appears on the public homepage when published.

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
```

Set environment variables in the Vercel dashboard:
- `DATABASE_URL`
- `SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL`

### Docker / VPS

```bash
npm run build
npm start
```

Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start npm --name "daily-viral-mms" -- start
```

---

## Database Migrations

After schema changes:

```bash
npx prisma migrate dev --name describe_your_change
npx prisma generate
```

Production:
```bash
npx prisma migrate deploy
```

---

## Security Notes

- Passwords are hashed with bcryptjs (12 rounds)
- Sessions use HS256 JWT stored in HTTP-only cookies
- Login is rate-limited to 5 attempts per 15 minutes per IP
- All admin routes are protected by the proxy (middleware)
- External URLs are validated against SSRF blocklist
- Input validated server-side with Zod on every endpoint
- SQL injection impossible via Prisma's parameterized queries

---

## Legal

This platform is strictly for adult content (18+). An age gate is shown to all visitors. The platform:
- Does not host media files
- Links to external content only
- Prohibits non-consensual, minor-related, or illegal content
- Provides DMCA takedown procedures at `/dmca`
- Provides a report button on every post
