# EcomStore - E-Commerce Application with Modern Next.js Rendering Strategies

## 📋 Project Overview

EcomStore is a full-stack e-commerce web application built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. It demonstrates multiple rendering strategies in Next.js 13+ App Router, showcasing when and why to use SSG, ISR, SSR, and client-side rendering.

### Key Features
- ✅ Multiple rendering strategies (SSG, ISR, SSR, Client)
- ✅ Full RESTful API with authentication
- ✅ Real-time inventory dashboard
- ✅ Admin product management panel
- ✅ Product search and filtering
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Server Components with hybrid architecture

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (installed on your machine)
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd ecomerce-web

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.example .env.local
# Edit .env.local if needed (API keys, database URL, etc.)

# Run the development server
npm run dev

# Open in browser
# Navigate to http://localhost:3000
```

### Build and Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📄 Rendering Strategies Explained

### 1. **Home Page (`/`) - Static Site Generation (SSG)**

**File:** `app/page.tsx`

**Rendering Strategy:**
- Data is fetched at **build time** using `getAllProducts()`
- Page is pre-rendered as static HTML
- Served as cached HTML to all users
- Optional: Revalidate every 3600 seconds (1 hour) for periodic updates

**Why SSG?**
- ✅ Fastest load times (pre-rendered HTML)
- ✅ No server processing needed
- ✅ Great for SEO
- ✅ Perfect for frequently viewed, infrequently changing content

**Client-Side Features:**
- Real-time filtering by search term, category, and price
- No server round-trips needed for filter changes

**Benefits:**
```
Pre-render @ Build Time
      ↓
Serve Static HTML
      ↓
CDN Caching
      ↓
Ultra-fast delivery
```

---

### 2. **Product Detail Page (`/products/[slug]`) - Incremental Static Regeneration (ISR)**

**File:** `app/products/[slug]/page.tsx`

**Rendering Strategy:**
- All product pages are **pre-generated at build time** using `generateStaticParams()`
- Pages are **automatically regenerated** every 60 seconds (`revalidate: 60`)
- Stale pages are served while regeneration happens in the background
- On-demand revalidation is supported (can trigger manual updates)

**Why ISR?**
- ✅ Fast initial load (pre-rendered)
- ✅ Fresh data without full rebuild
- ✅ Scales to thousands of products
- ✅ Perfect for e-commerce (prices, inventory change)

**Data Flow:**
```
Build Time:
  generateStaticParams() → Generate pages for all products
  Store static HTML + data

Request Time (after 60s):
  1. Serve cached static page immediately
  2. In background: regenerate with fresh data
  3. Replace cache with new version

Admin Update:
  Call revalidatePath() to trigger immediate regeneration
```

**Trade-offs:**
- Slight delay in showing latest price/inventory
- 60-second window before automatic refresh
- On-demand revalidation can force immediate update

---

### 3. **Inventory Dashboard (`/dashboard`) - Server-Side Rendering (SSR)**

**File:** `app\dashboard/page.tsx`

**Rendering Strategy:**
- `export const dynamic = 'force-dynamic'` forces dynamic rendering
- Data fetched **on every request** from `getInventoryStats()`
- HTML generated server-side for each visitor
- No caching - always fresh data

**Why SSR?**
- ✅ Always current information
- ✅ Real-time statistics and inventory
- ✅ Perfect for admin dashboards
- ✅ Sensitive data can be protected
- ✅ User-specific content

**Real-Time Data:**
```
User Request
    ↓
Server fetches latest inventory
    ↓
Generate fresh HTML
    ↓
Send to browser
```

**Use Cases:**
- Admin dashboards
- Personalized content
- Protected/authenticated routes
- Rapidly changing data

---

### 4. **Admin Panel (`/admin`) - Client-Side Data Fetching**

**File:** `app/admin/page.tsx` + `components/AdminClient.tsx`

**Rendering Strategy:**
- Page is **rendered server-side** initially
- Data loading happens on the **client via API calls**
- Forms use **client-side state management**
- Supports interactivity and real-time feedback

**Why Client-Side Fetching?**
- ✅ Interactive, responsive interface
- ✅ Instant user feedback
- ✅ Optimistic updates possible
- ✅ No server-side processing overhead
- ✅ Better for forms and dynamic interactions

**Data Flow:**
```
Page Load (SSR)
    ↓
Client-side component mounts
    ↓
useEffect → Fetch /api/products
    ↓
State update → Re-render
    ↓
User interactions → API calls
```

**Protected Routes:**
- Admin endpoints require `x-api-key` header
- Default key: `admin-secret-key-2024` (set via `ADMIN_API_KEY` env var)

---

### 5. **Recommendations Page (`/recommendations`) - React Server Components**

**File:** `app/recommendations/page.tsx`

**Rendering Strategy:**
- **Server Component** fetches product data
- **Client Component** (`WishlistClient`) handles interactivity
- Hybrid architecture combines both approaches

**Why Server Components?**
- ✅ Server-side data fetching (security)
- ✅ Keep secrets on server
- ✅ Reduced JavaScript on client
- ✅ Better performance overall
- ✅ Client interaction where needed

**Architecture:**
```
Server Component (page.tsx)
    ↓
Fetch data securely
    ↓
Server-render structure
    ↓
Embed Client Component (WishlistClient)
    ↓
Send to browser (minimal JS)
```

---

## 🔌 API Endpoints

All endpoints are located in `app/api/` directory.

### Public Endpoints

#### GET `/api/products`
Fetch all products.

```bash
curl http://localhost:3000/api/products
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "Premium noise-canceling wireless headphones...",
    "price": 199.99,
    "category": "Electronics",
    "inventory": 45,
    "lastUpdated": "2024-10-28T10:00:00Z"
  },
  ...
]
```

#### GET `/api/products/[slug]`
Fetch a single product by slug.

```bash
curl http://localhost:3000/api/products/wireless-headphones
```

#### GET `/api/health`
Health check endpoint.

```bash
curl http://localhost:3000/api/health
```

---

### Protected Endpoints (Require API Key)

#### POST `/api/products`
Create a new product.

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: admin-secret-key-2024" \
  -d '{
    "name": "New Product",
    "slug": "new-product",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "inventory": 50
  }'
```

#### PUT `/api/products/[id]`
Update an existing product.

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: admin-secret-key-2024" \
  -d '{
    "price": 189.99,
    "inventory": 40
  }'
```

---

## 📁 Project Structure

```
ecomerce-web/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (SSG)
│   ├── globals.css             # Global styles
│   ├── error.tsx               # Error boundary
│   ├── not-found.tsx           # 404 page
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx        # Product detail (ISR)
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard (SSR)
│   ├── admin/
│   │   └── page.tsx            # Admin panel (Client)
│   ├── recommendations/
│   │   └── page.tsx            # Recommendations (Server Components)
│   └── api/
│       ├── products/
│       │   ├── route.ts        # GET/POST /api/products
│       │   ├── [slug]/
│       │   │   └── route.ts    # GET /api/products/[slug]
│       │   └── [id]/
│       │       └── route.ts    # PUT /api/products/[id]
│       └── health/
│           └── route.ts        # GET /api/health
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Footer
│   ├── ProductCard.tsx         # Product card component
│   ├── HomeClient.tsx          # Home filtering logic
│   ├── ProductDetailClient.tsx # Product detail interactions
│   ├── AdminClient.tsx         # Admin form logic
│   └── WishlistClient.tsx      # Wishlist button
├── lib/
│   ├── db.ts                   # Database functions
│   └── auth.ts                 # Authentication utilities
├── data/
│   └── products.json           # Mock product database
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🗄️ Data Model

Each product follows this structure:

```typescript
interface Product {
  id: string;                    // Unique identifier
  name: string;                  // Product name
  slug: string;                  // URL-friendly slug
  description: string;           // Product description
  price: number;                 // Price in dollars
  category: string;              // Product category
  inventory: number;             // Stock count
  lastUpdated: string;           // ISO datetime string
}
```

**Mock Data Location:** `data/products.json`

---

## 🔐 Authentication

Admin endpoints are protected with a simple **API Key** mechanism.

### How It Works

1. Client includes `x-api-key` header in request
2. Server validates key against `ADMIN_API_KEY` environment variable
3. Default key: `admin-secret-key-2024`

### Environment Variables

Create `.env.local`:

```env
# API Authentication
ADMIN_API_KEY=your-secret-key-here

# Optional: Database connection (if using MongoDB)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
```

### Production Security

⚠️ **Important:** The current authentication is a simple demo. For production:

- Use **JWT tokens** instead of plain API keys
- Implement proper **session management**
- Use **OAuth2** or **OpenID Connect**
- Enforce **HTTPS** only
- Add **rate limiting**
- Implement **CORS** protection
- Store secrets in **secure vault** (AWS Secrets Manager, HashiCorp Vault)

---

## 🧪 Testing

### Run Tests

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Test Files

- `tests/api/products.test.ts` - API endpoint tests
- `tests/pages/home.test.tsx` - Home page tests
- `tests/components/ProductCard.test.tsx` - Component tests

---

## 📊 Rendering Decision Matrix

| Page | Strategy | Why | Cache | Update |
|------|----------|-----|-------|--------|
| Home | SSG | Frequently viewed, rarely changes | Yes | Build time |
| Product Detail | ISR | Dynamic pricing/inventory | Yes | Every 60s |
| Dashboard | SSR | Always needs fresh data | No | Per request |
| Admin | Client | Interactive forms | No | API calls |
| Recommendations | Server Comp | Hybrid approach | Yes | Per request |

---

## ⚡ Performance Tips

### 1. Enable Output Caching
```typescript
// Set appropriate cache headers
export const revalidate = 3600; // 1 hour
```

### 2. Use Image Optimization
```typescript
import Image from 'next/image';
<Image src={url} alt="..." width={200} height={200} />
```

### 3. Code Splitting
Next.js automatically code-splits routes.

### 4. Dynamic Imports
```typescript
const Component = dynamic(() => import('./Component'), {
  loading: () => <p>Loading...</p>,
});
```

### 5. Optimize Dependencies
```bash
npm audit
npm prune
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# ADMIN_API_KEY=your-key-here
```

### Deploy to Other Platforms

#### AWS Amplify
```bash
amplify init
amplify publish
```

#### Netlify
```bash
netlify init
netlify deploy
```

#### Docker (Self-hosted)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔍 Monitoring & Debugging

### Enable Debug Logging

```typescript
// In server components or API routes
console.log('Debug info:', variable);

// Access logs in terminal or deployment platform
```

### Performance Insights

- Use Next.js Analytics in Vercel dashboard
- Monitor Core Web Vitals
- Check API response times

### Error Tracking

Set up error reporting service (Sentry, LogRocket, etc.):

```typescript
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
}
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [ISR Explained](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🙋 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Cache Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading

```bash
# Ensure .env.local exists in root
# Verify variable name doesn't conflict
# Restart dev server
```

---

## 👤 Author

Built as an assignment project demonstrating modern Next.js rendering strategies.

**Date:** October 2024  
**Stack:** Next.js 15 • React 19 • TypeScript • Tailwind CSS

---

## 📄 License

Open source - feel free to use and modify for learning purposes.

---

## ✨ Bonus Features Implemented

- ✅ TypeScript for type safety
- ✅ Modern App Router with server components
- ✅ Comprehensive error handling
- ✅ Responsive design (mobile-first)
- ✅ Real-time inventory dashboard
- ✅ Admin panel with CRUD operations
- ✅ On-demand ISR revalidation capability
- ✅ Complete API documentation
- ✅ Middleware for authentication
- ✅ SEO optimization with metadata

---

**Happy coding! 🚀**