# Plan: Konversi Aplikasi Member KDMP menjadi PWA

## Overview
Mengubah aplikasi Next.js 16 menjadi Progressive Web App (PWA) dengan offline support, install prompt, dan native-like experience.

---

## Langkah 1: Setup Dependencies

### Install package
```bash
npm install @ducanh2912/next-pwa
```

**Kenapa @ducanh2912/next-pwa:**
- Aktif维护 dan compatible dengan Next.js 14+
- Mendukung App Router
- Tidak perlu custom server config

---

## Langkah 2: Konfigurasi next.config.ts

Tambahkan konfigurasi PWA:

```ts
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
```

---

## Langkah 3: Buat Service Worker Custom (Opsional)

Jika butuh custom caching strategy, buat file:
- `public/sw.js` - Custom service worker
- `public/workbox-*.js` - Workbox generated files (auto-generated)

### Caching Strategy untuk KDMP:
- **Static assets** (JS, CSS, images): CacheFirst, max 1 year
- **API calls**: NetworkFirst dengan fallback ke cache
- **Pages**: StaleWhileRevalidate
- **Auth-related**: NetworkOnly

---

## Langkah 4: Update manifest.json

File sudah ada di `public/manifest.json`. Pastikan lengkap:

```json
{
  "name": "Aplikasi Anggota KDMP",
  "short_name": "KDMP",
  "description": "Portal anggota Cooperativa Desa Merah Putih",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFFFFF",
  "theme_color": "#DC2626",
  "categories": ["finance", "productivity"],
  "lang": "id",
  "dir": "ltr",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot-wide.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Simpanan",
      "short_name": "Simpanan",
      "url": "/savings",
      "icons": [{ "src": "/icon-savings.png", "sizes": "96x96" }]
    },
    {
      "name": "Pinjaman",
      "short_name": "Pinjaman",
      "url": "/loans",
      "icons": [{ "src": "/icon-loans.png", "sizes": "96x96" }]
    }
  ]
}
```

---

## Langkah 5: Buat PWA Icons

Buat image assets berikut di `public/`:

| File | Size | Purpose |
|------|------|---------|
| `icon-192.png` | 192x192 | Regular icon |
| `icon-512.png` | 512x512 | Large icon |
| `icon-maskable.png` | 512x512 | Safe area for maskable icon |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `screenshot-wide.png` | 1280x720 | Play Store screenshot |

### Tool yang bisa dipakai:
- [PWA Manifest Generator](https://www.pwabuilder.com/)
- [Favicon.io](https://favicon.io/)
- [App Icon Generator](https://appiconmaker.co/)

---

## Langkah 6: Update Layout untuk iOS Support

Tambahkan meta tags untuk iOS di `src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  // ... existing
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KDMP",
  },
  formatDetection: {
    telephone: false,
  },
};
```

---

## Langkah 7: Buat Install Prompt Component

Buat komponen `InstallPrompt` di `src/components/`:

```tsx
// src/components/InstallPrompt.tsx
"use client";

import { useState, useEffect } from "react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-lg z-50">
      <p className="text-sm mb-2">Pasang aplikasi untuk pengalaman terbaik?</p>
      <div className="flex gap-2">
        <button onClick={() => setShowPrompt(false)} className="flex-1 px-4 py-2 text-sm">
          Nanti
        </button>
        <button onClick={handleInstall} className="flex-1 px-4 py-2 bg-red-600 text-white rounded text-sm">
          Pasang
        </button>
      </div>
    </div>
  );
}
```

---

## Langkah 8: Update ClientWrapper

Tambahkan `InstallPrompt` ke `src/components/ClientWrapper.tsx`.

---

## Langkah 9: Handle Offline Page

Buat offline page untuk user saat offline:

```tsx
// src/app/offline/page.tsx
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Offline</h1>
        <p className="text-slate-600">Cek koneksi internet Anda</p>
        <a href="/" className="mt-4 inline-block text-red-600">
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
```

---

## Langkah 10: Testing

### Test PWA functionality:
1. Buka Chrome DevTools > Application tab
2. Cek Service Worker registered
3. Test offline mode: Network tab > Offline
4. Test install prompt muncul
5. Test "Add to Home Screen"

### Lighthouse Audit:
```bash
npm run build
npm start
# Buka http://localhost:3000
# Lighthouse > Progressive Web App
```

---

## File yang Perlu Dibuat/Update

| File | Action |
|------|--------|
| `public/icon-192.png` | Buat |
| `public/icon-512.png` | Buat |
| `public/icon-maskable.png` | Buat |
| `public/apple-touch-icon.png` | Buat |
| `public/screenshot-wide.png` | Buat (opsional) |
| `next.config.ts` | Update |
| `src/components/InstallPrompt.tsx` | Buat |
| `src/components/ClientWrapper.tsx` | Update |
| `src/app/offline/page.tsx` | Buat |
| `package.json` | Update dependencies |

---

## Estimasi Waktu

- Setup & Config: 15 menit
- Icons creation: 20 menit
- Components: 30 menit
- Testing: 15 menit
- **Total: ~80 menit**

---

## Checklist Sebelum Deploy

- [ ] Semua icons ter-generate dan ada di `/public`
- [ ] Service Worker registered tanpa error
- [ ] Offline page berfungsi
- [ ] Install prompt muncul di mobile
- [ ] Lighthouse PWA score > 90
- [ ] Test di Chrome, Safari, Firefox
- [ ] Test di Android dan iOS devices
