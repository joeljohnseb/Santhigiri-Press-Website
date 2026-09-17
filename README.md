# Santhigiri College Press

Online ordering platform for a college print shop. Students and staff can browse print services, upload files, get price quotes, place orders, and track status. Staff manage orders through an admin dashboard.

## Features

**Customer**
- Browse products by category (Academic, Events & Fests, Posters, Certificates, Other)
- Configure quantity, paper type/size, and colour
- Upload print files (PDF, JPG, PNG)
- Instant price quotes with manual-quote fallback for custom jobs
- Campus pickup or limited delivery
- Pay at counter or online (Razorpay-ready)
- Track order status

**Admin**
- Dashboard with order stats
- View and update order status
- Product catalog overview
- Customer list
- Business settings

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin login:** [http://localhost:3000/admin](http://localhost:3000/admin)  
Default password: `admin123` (set `ADMIN_PASSWORD` in `.env.local`)

## Project structure

```
src/
  app/              # Pages and API routes
  components/       # UI and shop/admin components
  lib/              # Data, pricing, orders, Supabase clients
data/
  orders.json       # Local order storage (demo/dev)
public/uploads/     # Uploaded print files
supabase/
  schema.sql        # Production database schema
```

## Configuration

| Variable | Purpose |
|----------|---------|
| `ADMIN_PASSWORD` | Admin panel login (default: `admin123`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (optional) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (optional) |
| `RAZORPAY_KEY_ID` | Online payments (optional) |
| `RAZORPAY_KEY_SECRET` | Online payments (optional) |

## Customization

Edit `src/lib/data.ts` to update:
- Product catalog and categories
- Paper types and sizes
- Pricing rules
- Pickup locations and delivery zones
- Business contact details

## Production deployment

1. Deploy to [Vercel](https://vercel.com)
2. Create a [Supabase](https://supabase.com) project and run `supabase/schema.sql`
3. Set environment variables in Vercel
4. Configure [Razorpay](https://razorpay.com) for online payments
5. Replace local file storage with Supabase Storage for uploads

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (auth, DB, storage — optional)
- Razorpay (payments — optional)
