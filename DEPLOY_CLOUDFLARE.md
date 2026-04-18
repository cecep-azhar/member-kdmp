# Deploy ke Cloudflare Pages

## Prerequisites
- Akun Cloudflare
- Wrangler CLI installed: `npm i -g wrangler`

## Environment Variables
Set environment variables di Cloudflare Pages dashboard:

```
NEXT_PUBLIC_PAYLOAD_API_URL=https://your-payload-api.com/api
NEXT_PUBLIC_SERVER_URL=https://your-payload-api.com
```

## Deployment Steps

### Option 1: Direct Deploy dengan Wrangler

```bash
# Login ke Cloudflare
wrangler login

# Build aplikasi
pnpm build

# Deploy ke Cloudflare Pages
npx wrangler pages deploy .next/standalone --project-name=kdmp-member
```

### Option 2: GitHub Integration (Recommended)

1. Push code ke GitHub repository
2. Buka Cloudflare Dashboard → Pages
3. Create a project → Connect to GitHub
4. Select repository
5. Configure build settings:
   - Build command: `pnpm build`
   - Build output directory: `.next`
   - Environment variables:
     - `NEXT_PUBLIC_PAYLOAD_API_URL`
     - `NEXT_PUBLIC_SERVER_URL`

### Option 3: Cloudflare Pages dengan Wrangler CLI

```bash
# Initialize Cloudflare Pages project
wrangler pages project create kdmp-member

# Deploy
wrangler pages deploy .next --project-name=kdmp-member
```

## Important Notes

### Middleware/Proxy
Next.js 16 menggunakan `proxy` sebagai pengganti `middleware`. File `src/middleware.ts` secara otomatis akan di-convert ke Cloudflare Worker format.

### Static Assets
File statis di `public/` harus di-serve terpisah:
```bash
# Setelah build, static assets ada di .next/static
# Copy ke Cloudflare Pages public directory
```

### API Backend
Pastikan Payload CMS API reachable dari Cloudflare Workers. Tambahkan CORS headers di Payload CMS config:

```typescript
// Payload CMS cors config
{
  origin: ['https://your-kdmp.pages.dev', 'https://kdmp-member.pages.dev'],
  credentials: true,
}
```

## Troubleshooting

### Error: "Worker size limit exceeded"
Kurangi bundle size dengan:
- Dynamic imports untuk komponen besar
- Pakai `next/dynamic` untuk pages yang tidak perlu SSR

### Error: "Cannot find module"
Pastikan `output: 'standalone'` sudah diset di `next.config.ts`

### CORS Issues
Tambahkan domain Cloudflare Pages ke Payload CMS CORS whitelist.
