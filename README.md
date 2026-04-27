# 🌱 GreenRoots Agrovet — Full-Stack E-Commerce

A complete Next.js 15 + Prisma + PostgreSQL e-commerce site for a Kenyan agrovet business.

## Tech Stack

| Layer | Tech | Cost |
|-------|------|------|
| Frontend + API | Next.js 15 (App Router) | Free (Vercel) |
| Database | PostgreSQL via Prisma | Free (Neon / Supabase) |
| Auth | JWT (httpOnly cookies) | Free |
| Payments | M-Pesa Daraja STK Push | Free API |
| State | Zustand (cart) | Free |
| Styling | Tailwind CSS | Free |

## Features

- 🛍️ Product catalogue with category filters & search
- 🛒 Persistent cart (Zustand + localStorage)
- 📱 M-Pesa STK Push checkout (Daraja API)
- 💬 WhatsApp order flow
- 🔐 JWT auth (register/login/logout)
- 👤 Customer order history
- 🧑‍💼 Admin dashboard: products CRUD, order management, stock alerts
- 🔒 Middleware route protection (admin + auth routes)

## Quick Start

### 1. Clone & install
```bash
git clone <your-repo>
cd greenroots-agrovet
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, MPESA_* values
```

### 3. Set up database
```bash
# Free PostgreSQL options:
# - https://neon.tech (recommended)
# - https://supabase.com

npx prisma db push      # push schema to DB
npm run db:seed         # seed categories + products
```

### 4. Run locally
```bash
npm run dev
# → http://localhost:3000
```

### 5. Admin access
- URL: http://localhost:3000/admin
- Email: `admin@greenroots.co.ke`
- Password: `admin123`
- **Change these before going live!**

## M-Pesa Setup

1. Register at https://developer.safaricom.co.ke
2. Create an app → get Consumer Key + Consumer Secret
3. For production, switch sandbox URLs in `lib/mpesa.ts` to production URLs
4. Set `MPESA_CALLBACK_URL` to your live domain

## Deployment (Vercel + Neon)

```bash
# 1. Push to GitHub
# 2. Import on vercel.com
# 3. Add environment variables in Vercel dashboard
# 4. Set DATABASE_URL from neon.tech (free tier)
# 5. Deploy → runs `prisma generate && next build` automatically
```

## Project Structure

```
greenroots-agrovet/
├── app/
│   ├── page.tsx              # Homepage (hero, categories, featured)
│   ├── shop/page.tsx         # Product listing with filters
│   ├── checkout/page.tsx     # M-Pesa + WhatsApp checkout
│   ├── orders/page.tsx       # Customer order history
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── admin/page.tsx        # Admin dashboard
│   └── api/
│       ├── auth/             # login, register, logout, me
│       ├── products/         # GET products, categories
│       ├── orders/           # POST/GET orders
│       ├── admin/            # Admin CRUD (products, orders)
│       └── mpesa/            # STK push + callback
├── components/
│   ├── layout/Navbar.tsx
│   ├── shop/ProductCard.tsx
│   ├── shop/CartDrawer.tsx
│   ├── shop/ShopClient.tsx
│   ├── shop/CheckoutClient.tsx
│   ├── admin/AdminDashboard.tsx
│   └── ui/AuthForm.tsx, Toaster.tsx
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── auth.ts               # JWT sign/verify/session
│   ├── mpesa.ts              # Daraja STK push
│   └── utils.ts              # formatKES, slugify, cn
├── store/cart.ts             # Zustand cart store
├── types/index.ts
├── middleware.ts             # Route protection
└── prisma/
    ├── schema.prisma
    └── seed.ts
```
