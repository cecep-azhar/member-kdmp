# Upgrading Plan: Aplikasi Anggota KDMP

## Status Implementasi

### ✅ Sudah Diimplementasi (v1.1.0)
1. **Branding Merah-Putih** — Semua gradients, buttons, icons berubah dari indigo ke merah
2. **Route Middleware** — Auth protection + security headers (X-Frame-Options, CSP, etc.)
3. **ErrorBoundary Component** — Error handling dengan fallback UI
4. **TypeScript Types** — `src/types/index.ts` dengan semua interfaces
5. **Constants & Labels** — `src/constants/labels.ts` untuk semua labels
6. **Custom Hooks** — `useSavingsBalance` hook
7. **Format Utilities** — `formatDate`, `formatCurrency` utilities
8. **Toast Notifications** — Sonner integration dengan theme
9. **PWA Manifest** — `public/manifest.json` dengan theme-color merah
10. **Favicon** — `public/favicon.svg` dengan logo merah

### 🚧 Dalam Proses
- Refactoring pages dengan types dan constants (sebagian besar sudah)

### 📋 Remaining Items
- Pull-to-refresh implementation
- Offline indicator
- Full page-by-page type refactoring
- Image optimization dengan next/image
- Pagination untuk news/loans
- Loan calculator
- PDF statement download
- Push notifications

---

## PRIORITAS 1: Branding Merah-Putih

### Status: ✅ SELESAI
- Primary color berubah dari `oklch(0.488 0.243 264.376)` (indigo) ke `oklch(0.577 0.245 27.325)` (merah)
- Semua gradients telah diubah ke tema merah

### Current State
- Primary color: `oklch(0.488 0.243 264.376)` — **Indigo/blue**
- Gradients: `indigo-600 via-primary to-violet-700`, `blue-600 via-blue-500 to-indigo-600`
- **Masalah**: Nama "Merah Putih" tidak tercermin sama sekali dalam branding visual

### Target Branding
- **Merah Indonesia**: `#DC2626` (primary), `#B91C1C` (darker), `#FEE2E2` (light bg)
- **Putih**: `#FFFFFF` (background), `#F9FAFB` (subtle bg)
- Gradients: merah gradients untuk hero sections
- CSS variable `--primary` berubah dari indigo ke merah

### Files to Change
```
globals.css
  — :root { --primary: var(--theme-primary, #DC2626); --primary-foreground: #FFFFFF; }
  — hapus semua indigo/violet gradient classes di CSS variables
  — accent: #F9FAFB atau #FEE2E2

Login page (login/page.tsx)
  — Gradient header: from-red-600 via-red-500 to-red-700
  — Avatar/icon: bg-gradient-to-br from-red-600 to-red-700

Savings page (savings/page.tsx)
  — Header gradient: from-red-600 via-red-500 to-red-700
  — Balance cards: dari blue/emerald/violet → merah/orange/warm gradient

Loans page (loans/page.tsx)
  — Header gradient: dari indigo/violet → red gradient

MemberDashboard (MemberDashboard.tsx)
  — Hero card: dari indigo/violet → merah gradient
  — Shortcut icons: adjust colors untuk tema merah

Info page (info/page.tsx)
  — Hero banner: dari blue/indigo/violet → red gradient

Books page (books/page.tsx)
  — Header icon bg: dari purple/indigo → red gradient

BottomNav (BottomNav.tsx)
  — text-primary → warna merah aktif, bukan indigo
  — bg-primary/10 → bg-red-500/10

Button component (button.tsx)
  — .default variant: bg-primary text-primary-foreground (otomatis merah karena var primary)
```

---

## PRIORITAS 2: Keamanan Autentikasi

### Issue 2.1: JWT di localStorage (CRITICAL)
**Problem**: Token JWT disimpan di `localStorage` — rentan XSS. Jika attacker inject script, token bisa dicuri.

**Location**: `AuthProvider.tsx:47`, `payload.ts:5-8`

**Fix**:
1. Pindahkan token ke **httpOnly cookie** (set dari Payload API response)
2. `payloadFetch` baca token dari cookie, bukan localStorage
3. Tambahkan `CSRF token` protection
4. Atau minimal: encrypt token sebelum simpan di localStorage

**Files**: `AuthProvider.tsx`, `payload.ts`, perlu middleware di Payload CMS untuk set cookie

### Issue 2.2: No Route Middleware
**Problem**: Tidak ada `middleware.ts` — auth check hanya di client-side useEffect, menyebabkan flash unauthenticated content.

**Location**: Semua page

**Fix**: Buat `middleware.ts` di root:
```
middleware.ts
  — Cek cookie 'member-token'
  — Redirect ke /login jika tidak ada dan pathname bukan /login
  — Header security: X-Frame-Options, CSP, etc.
```

### Issue 2.3: No Auth Route Protection per Page
**Problem**: Setiap page component manually cek `useAuth()` — inconsistently applied.

**Fix**: Middleware sudah handle ini, tapi tambahkan `AuthGuard` component sebagai backup layer.

---

## PRIORITAS 3: User Experience Mobile

### Issue 3.1: No Pull-to-Refresh
**Problem**: User tidak bisa refresh data dengan swipe down.

**Fix**: Implement `lihub/pull-to-refresh` atau custom hook dengan touch events + CSS overscroll-behavior.

### Issue 3.2: BottomNav Active State Incorrect on Direct URL
**Problem**: BottomNav `isActive` logic dengan `pathname.startsWith` dan `pathname ===` tidak mencakup semua case. User yang akses `/loans/abc123` secara langsung tidak melihat nav aktif.

**Location**: `BottomNav.tsx:29-31`

**Fix**:
```typescript
const isActive = pathname === link.href ||
  (link.activeMatch ? pathname.startsWith(link.activeMatch) : false) ||
  (link.href !== "/" && pathname.startsWith(link.href));
```

### Issue 3.3: No Offline Indicator
**Problem**: App tidak memberi feedback saat offline.

**Fix**: Buat `OfflineProvider` context + banner component yang muncul saat `navigator.onLine === false`.

### Issue 3.4: Toast/Notification System Missing
**Problem**: Tidak ada user feedback untuk action results (login success, error, etc.).

**Fix**: Implement toast library (sonner atau react-hot-toast) dengan custom red/white theme.

### Issue 3.5: Dark Mode Incomplete
**Problem**: Login page, beberapa header tidak punya dark mode design yang proper.

**Location**: `login/page.tsx`, gradient headers di savings/loans/info pages

**Fix**: Tambahkan dark mode gradient variants untuk setiap header.

---

## PRIORITAS 4: Data Fetching & Performance

### Issue 4.1: Client Components Terlalu Banyak
**Problem**: Hampir SEMUA page adalah `"use client"` — tidak bisa memanfaatkan Next.js Static Generation / RSC.

**Pages yang bisa jadi Server Components**:
- `news/page.tsx` — sudah server component, bagus
- `info/page.tsx` — client karena useState untuk accordion, bisa split: server fetch + client accordion
- `books/page.tsx` — data hardcoded, tidak perlu client

**Fix**: Refactor pages yang tidak perlu client state menjadi RSC.

### Issue 4.2: No Image Optimization
**Problem**: Menggunakan `<img src={...}>` di mana-mana, bukan Next.js `<Image>`.

**Location**: `news/page.tsx:98-101,143-147`, `news/[slug]/page.tsx`, `profile/page.tsx`

**Fix**: Ganti ke `next/image` dengan proper `sizes` dan `priority` attributes.

### Issue 4.3: No Data Caching Strategy
**Problem**: Setiap page fetch fresh data, tidak ada cache untuk data yang jarang berubah.

**Fix**:
- News: `next: { revalidate: 300 }` (5 menit)
- Global settings: cache permanen, re-fetch on mount
- Member/Savings/Loans: tetap no-cache karena data personal

### Issue 4.4: No Pagination
**Problem**: News & loans load semua dengan limit 50 — tidak scalable.

**Location**: `news/page.tsx:10`, `loans/page.tsx:41`

**Fix**: Implement infinite scroll atau traditional pagination dengan `page` param.

### Issue 4.5: API Waterfall di Profile
**Problem**: Profile page fetch member → lalu savings & loans — sequential.

**Location**: `profile/page.tsx:29-34`

**Fix**: Promise.all untuk parallel fetch:
```typescript
const [memberData, savingsData, loansData] = await Promise.all([
  payloadFetch(`/members?where[user][equals]=${user.id}`),
  payloadFetch(`/savings?where[member][equals]=${m.id}&limit=200`),
  payloadFetch(`/loans?where[member][equals]=${m.id}`),
]);
```

---

## PRIORITAS 5: Type Safety

### Issue 5.1: All `any` Types
**Problem**: `useState<any>`, `any[]`, `any` di seluruh page components.

**Fix**: Buat typed interfaces di `src/types/`:
```typescript
// src/types/user.ts
interface User {
  id: string;
  email: string;
  name: string;
  roles?: string[];
}

// src/types/member.ts
interface Member {
  id: string;
  user: string;
  fullName: string;
  memberId: string;
  phone?: string;
  address?: string;
  occupation?: string;
  joinDate?: string;
  membershipStatus: 'active' | 'inactive' | 'pending';
}

// src/types/savings.ts
type SavingType = 'pokok' | 'wajib' | 'sukarela';
type TransactionType = 'deposit' | 'withdrawal';
type SavingStatus = 'pending' | 'completed' | 'failed';

interface Saving {
  id: string;
  type: SavingType;
  transactionType: TransactionType;
  amount: number;
  status: SavingStatus;
  createdAt: string;
  member: string;
}

// src/types/loan.ts
type LoanStatus = 'active' | 'completed' | 'pending' | 'approved' | 'rejected' | 'defaulted';
type LoanPurpose = 'productive' | 'consumptive' | 'education' | 'health' | 'other';

interface InstallmentSchedule {
  installmentNo: number;
  dueDate: string;
  principal: number;
  interest: number;
  total: number;
  status: 'paid' | 'unpaid' | 'overdue';
  paidDate?: string;
}

interface Loan {
  id: string;
  loanId: string;
  amount: number;
  remainingBalance: number;
  totalPaid: number;
  interestRate: number;
  tenor: number;
  purpose: LoanPurpose;
  status: LoanStatus;
  disbursementDate?: string;
  installmentSchedule: InstallmentSchedule[];
  member: string;
}

// src/types/news.ts
type NewsCategory = 'news' | 'announcement' | 'education';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  content: any; // Payload's rich text
  category: NewsCategory;
  image?: { url: string };
  publishedAt: string;
  status: 'draft' | 'published';
}
```

**Files to Create**: `src/types/index.ts` yang export semua interface

---

## PRIORITAS 6: Code Quality

### Issue 6.1: Duplicate Calculation Logic
**Problem**: Fungsi `calcBalance()` duplikat di `MemberDashboard.tsx:60-67` dan `savings/page.tsx:46-53`.

**Fix**: Extract ke custom hook `useSavingsBalance(memberId)` di `src/hooks/`.

### Issue 6.2: Magic Strings Everywhere
**Problem**: Labels, status, types hardcoded sebagai string literal di banyak file.

**Fix**: Buat `src/constants/` dengan:
```typescript
// src/constants/labels.ts
export const SAVING_TYPE_LABELS = {
  pokok: 'Simpanan Pokok',
  wajib: 'Simpanan Wajib',
  sukarela: 'Simpanan Sukarela',
} as const;

export const LOAN_STATUS_LABELS = {
  active: 'Aktif',
  completed: 'Lunas',
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  defaulted: 'Macet',
} as const;

export const NEWS_CATEGORY_LABELS = {
  news: 'Berita',
  announcement: 'Pengumuman',
  education: 'Edukasi',
} as const;
```

### Issue 6.3: Inconsistent Date Formatting
**Problem**: Setiap page format tanggal manual dengan `toLocaleDateString`.

**Fix**: Buat `src/lib/format.ts`:
```typescript
export function formatDate(date: string | Date, format: 'short' | 'long' | 'numeric' = 'long'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    numeric: { day: 'numeric', month: 'numeric', year: 'numeric' },
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
  }[format];
  return d.toLocaleDateString('id-ID', options);
}
```

### Issue 6.4: No Error Boundaries
**Problem**: App crash total kalau satu component gagal render.

**Fix**: Buat `src/components/ErrorBoundary.tsx` dengan fallback UI dan error reporting.

### Issue 6.5: No Loading.tsx Files
**Problem**: Tidak ada Next.js `loading.tsx` untuk route-based loading states.

**Fix**: Tambahkan `loading.tsx` files untuk setiap route segment.

---

## PRIORITAS 7: Accessibility (WCAG AA)

### Issue 7.1: Missing ARIA Labels
**Problem**: Icon buttons tanpa `aria-label`.

**Location**: BottomNav icons, header buttons, loan card actions.

**Fix**: Tambah `aria-label` di setiap icon-only button.

### Issue 7.2: Color Contrast Issues
**Problem**: Beberapa text colors mungkin tidak meet 4.5:1 contrast ratio.

**Examples**:
- `text-white/70` pada background — ratio mungkin < 4.5:1
- `text-slate-400` pada white background — ratio ~2.5:1

**Fix**: Audit semua text/background combinations dengan axe-core atau manual check.

### Issue 7.3: No Focus Management
**Problem**: Setelah login, focus tidak dipindahkan dengan benar.

**Fix**: Gunakan `useEffect` untuk pindahkan focus ke heading utama setelah navigation.

### Issue 7.4: No Keyboard Navigation for Filters
**Problem**: Tab filter di savings page tidak accessible via keyboard.

**Fix**: Pastikan semua interactive elements reachable via Tab dan activate via Enter/Space.

---

## PRIORITAS 8: UI Component Deficiencies

### Issue 8.1: Profile Page Placeholder Menu Items
**Problem**: "Pengaturan Akun" dan "Privasi & Keamanan" di profile page adalah `#` links — tidak berfungsi.

**Location**: `profile/page.tsx:87-88`

**Fix**: Either implement settings page atau hapus menu items sampai diimplement.

### Issue 8.2: No Language Switcher UI
**Problem**: `SettingsProvider` punya `setLanguage` tapi tidak ada UI untuk switch language di app.

**Fix**: Tambahkan language toggle di profile dropdown atau settings page.

### Issue 8.3: Savings Filter UI Inconsistency
**Problem**: Tab filter menggunakan `bg-primary` untuk active, sedangkan transaction type filter menggunakan `bg-slate-900`.

**Location**: `savings/page.tsx:146-155 vs 167-171`

**Fix**: Standardize active state styling —一致iate dari primary color scheme.

### Issue 8.4: Inconsistent Card Radius
**Problem**: Cards menggunakan `rounded-[28px]`, `rounded-[24px]`, `rounded-3xl`, `rounded-2xl` — tidak konsisten.

**Fix**: Buat design token untuk card radius: `--radius-card: 1.5rem` dan pakai consistently.

### Issue 8.5: No Empty State Illustration
**Problem**: Empty states hanya text + icon, tidak ada ilustrasi.

**Fix**: Tambahkan simple SVG illustrations untuk setiap empty state (no savings, no loans, no news).

---

## PRIORITAS 9: Missing Features

### Issue 9.1: No Transaction Detail View
**Problem**: User tidak bisa tap transaksi individual untuk lihat detail.

**Fix**: Buat `/savings/[id]/page.tsx` dengan detail transaksi.

### Issue 9.2: No Loan Calculator
**Problem**: Tidak ada simulator untuk estimasi cicilan.

**Fix**: Buat `/tools/loan-calculator/page.tsx` dengan formula:
```
Angsuran = P × [r(1+r)^n] / [(1+r)^n – 1]
```

### Issue 9.3: No PDF/Statement Download
**Problem**: User tidak bisa download account statement.

**Fix**: Generate PDF server-side dengan `@react-pdf/renderer` atau纱 `jspdf`.

### Issue 9.4: No Push Notifications
**Problem**: User tidak dapat notifikasi untuk angsuran jatuh tempo, news baru.

**Fix**: Integrate Firebase Cloud Messaging atau OneSignal.

### Issue 9.5: No Change Password
**Problem**: User tidak bisa ubah password sendiri.

**Fix**: Buat `/profile/change-password/page.tsx` dengan form + API call.

### Issue 9.6: No Announcement Banner
**Problem**: Admin tidak bisa broadcast announcement ke semua member.

**Fix**: Tambahkan banner component di `MemberDashboard` yang fetch dari `/announcements` endpoint.

---

## PRIORITAS 10: SEO & Metadata

### Issue 10.1: Incomplete Metadata
**Problem**: Hanya `layout.tsx` yang punya Metadata export, individual pages tidak ada.

**Fix**: Tambah `export const metadata` di setiap page:
```typescript
export const metadata: Metadata = {
  title: 'Simpanan | KDMP',
  description: 'Lihat saldo dan histori simpanan Anda',
};
```

### Issue 10.2: No Open Graph / Twitter Cards
**Problem**: Sharing ke social media tidak ada rich preview.

**Fix**: Tambah OG tags di `layout.tsx` dan page-specific di masing-masing page.

### Issue 10.3: No Favicon / App Icons
**Problem**: Tidak ada `favicon.ico`, `apple-touch-icon.png`, `manifest.json`.

**Fix**: Buat `public/favicon.ico` dengan logo merah-putih sederhana + `manifest.json` untuk PWA.

---

## PRIORITAS 11: Environment & Build

### Issue 11.1: No Environment Validation
**Problem**: App tidak validate env vars sebelum start.

**Fix**: Buat `src/lib/env.ts` yang throw error jika `NEXT_PUBLIC_PAYLOAD_API_URL` tidak diset.

### Issue 11.2: No Build Validation for Backend
**Problem**: App build success meskipun Payload CMS backend tidak reachable.

**Fix**: Tambah CI step yang test API connectivity sebelum build.

### Issue 11.3: No ESLint Custom Rules
**Problem**: Default ESLint config tidak catch common issues.

**Fix**: Custom ESLint rules untuk:
- Warn jika `use client` tapi tidak ada hooks
- Error jika `console.error` tanpa user feedback
- Warn jika hardcoded Indonesian strings di non-i18n context

---

## PRIORITAS 12: i18n

### Issue 12.1: Hardcoded Indonesian Strings
**Problem**: Banyak UI labels hardcoded dalam Bahasa Indonesia.

**Location**: Semua page components.

**Fix**:
1. Pastikan SEMUA user-facing string ada di `src/lib/dictionaries/id.json`
2. Pakai `t()` function di SEMUA component
3. Translation keys harus descriptive: `savings.total_balance` bukan `total`

### Issue 12.2: Inconsistent Translation Usage
**Problem**: `MemberDashboard.tsx` pakai `t()` untuk beberapa, tapi tidak untuk semua.

**Fix**: Audit semua strings, pastikan 100% coverage.

---

## Deployment Checklist

Sebelum production deploy, pastikan:

1. [ ] Semua env vars ter-set: `NEXT_PUBLIC_PAYLOAD_API_URL`, `NEXT_PUBLIC_SERVER_URL`
2. [ ] Payload CMS CORS allow production domain
3. [ ] JWT token expiry diset reasonable (7 days vs indefinite)
4. [ ] Rate limiting aktif di Payload CMS untuk login endpoint
5. [ ] HTTPS only, HSTS header aktif
6. [ ] Analytics tracking (optional: Plausible/Umami untuk privacy-first)
7. [ ] Error tracking (Sentry)
8. [ ] Uptime monitoring

---

## Urutan Implementasi (Recommended)

```
Phase 1: Security & Branding (Week 1-2) ✅
  1. Branding merah-putih (CSS variables, gradients) ✅
  2. Route middleware untuk auth ✅
  3. Error boundary ✅

Phase 2: Type Safety & Code Quality (Week 2-3) ✅
  1. Buat src/types/ dengan semua interfaces ✅
  2. Buat src/constants/ untuk labels ✅
  3. Buat src/hooks/ untuk shared logic ✅
  4. Extract duplicate calcBalance ke hook ✅

Phase 3: UX Improvements (Week 3-4) 🚧
  1. Toast notification system ✅
  2. Pull-to-refresh ⬜
  3. Offline indicator ⬜
  4. Skeleton loading refinement ⬜
  5. Empty state illustrations ⬜

Phase 4: Performance (Week 4-5) ⬜
  1. Convert pages ke RSC dimana memungkinkan ⬜
  2. next/image replacement ⬜
  3. Data caching strategy ⬜
  4. Pagination untuk news/loans ⬜

Phase 5: Missing Features (Week 5-6) ⬜
  1. Loan calculator ⬜
  2. Transaction detail page ⬜
  3. Change password ⬜
  4. Announcement banner ⬜

Phase 6: Polish (Week 6-7) 🚧
  1. Accessibility audit & fixes ⬜
  2. SEO metadata ✅
  3. Dark mode refinement ⬜
  4. Favicon & manifest ✅
  5. Language switcher UI ⬜
```

---

## Catatan Teknis Penting

### Tailwind CSS v4
Konfigurasi TIDAK di `tailwind.config.ts` — semua ada di `globals.css` via `@theme inline`.刘
```css
/* globals.css adalah CONFIG, bukan hanya stylesheet */
@import "tailwindcss";
```

### Next.js 16 App Router
- Server Components: default, tidak ada `"use client"`
- Client Components: tambah `"use client"` di top of file
- `params` di page.tsx adalah Promise (Next.js 15+ behavior)
- Route groups: `(marketing)`, `(app)` etc untuk organize

### Payload CMS Integration
- Auth: `/api/users/login` return `{ token, user }`
- Semua API calls via `payloadFetch()` yang auto-add Authorization header
- Backend harus aktif di `NEXT_PUBLIC_PAYLOAD_API_URL`

### Base UI + CVA Pattern
Components pakai Base UI primitives + CVA untuk variants. Pattern:
```typescript
const MyComponent = ({ variant = 'default', size = 'md', ...props }) => (
  <BaseUIPrimitive className={cn(variants({ variant, size }))} {...props} />
);
```

---

*Document generated: 2026-04-17*
*Analyst: Claude Code*
*Version: 1.0.0*
