# Vidyarth — real backend scaffold

This is a working Next.js project wired to your actual Supabase project
(`zwqzhmmfikicrmkswavf`). It replaces the earlier prototype's mock data with
real database queries and real auth — the pieces that weren't possible in the
chat sandbox.

## 1. Install and run

```bash
npm install
npm run dev
```

## 2. Set up the database

In the Supabase dashboard for your project, open **SQL Editor** and run the two
migration files in order:

1. `supabase/migrations/0001_init.sql` — creates all tables (`products`,
   `orders`, `downloads`, etc.) and the two storage buckets (`samples` public,
   `full-pdfs` private).
2. `supabase/migrations/0002_rls.sql` — turns on Row Level Security so the
   database itself enforces "users only see their own orders" and "reviews
   require a paid purchase," not just the app code.

(If you have the Supabase CLI installed, `supabase db push` runs both instead.)

## 3. Add a test product

Table Editor → `products` → insert a row, e.g.:

```
title: CBSE Class 10 Mathematics — Complete Revision Notes
slug: cbse-class-10-mathematics-complete-revision-notes
exam: CBSE
class: Class 10
subject: Mathematics
price: 249
discount_price: 179
pages: 86
is_published: true
is_featured: true
```

Reload `/` — it should now render from your real database instead of mock data.

## 4. What's wired up already
- `app/page.tsx` — home page, queries `products` live.
- `app/product/[slug]/page.tsx` — product detail, checks the `downloads` table
  to decide "Buy Now" vs "Download PDF" for the logged-in user.
- `app/login/page.tsx` — real Supabase auth (sign up / sign in), creates a
  matching `profiles` row on register.
- `middleware.ts` — keeps the Supabase session refreshed, and gate-keeps
  `/library` and `/checkout` to logged-in users.

## 5. What's still missing (in priority order)
1. **`app/api/orders/route.ts`** — creates a Razorpay order server-side, amount
   pulled from the DB (never trust a client-sent amount).
2. **`app/api/orders/verify/route.ts`** — verifies the Razorpay signature with
   your `RAZORPAY_KEY_SECRET`, then inserts the `downloads` entitlement row
   using the **service-role** client (bypasses RLS — this must never run in
   browser code).
3. **`app/api/downloads/[productId]/route.ts`** — checks the caller owns a
   `downloads` row for that product, then returns a short-lived signed URL via
   `supabase.storage.from('full-pdfs').createSignedUrl(path, 60 * 10)`.
4. **Cart / Checkout UI** — port these from the `Vidyarth.jsx` prototype,
   swapping the in-memory cart for a call to step 1 on submit.
5. **Admin dashboard** (`/admin/...`) — product CRUD, order list, basic
   analytics. Gate every route with the `is_admin()` check from the RLS
   migration.
6. Full page set from the prototype — Explore/filter pages, Cart, My Library,
   static legal pages — porting the JSX/Tailwind directly since the visual
   system is already decided.

I can build any of these next — the download-signing route (#3) and the
Razorpay verify route (#2) are the two genuinely security-critical pieces, so
those are worth doing before the rest of the pages.
