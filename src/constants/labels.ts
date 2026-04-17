// Saving type labels
export const SAVING_TYPE_LABELS = {
  pokok: 'Simpanan Pokok',
  wajib: 'Simpanan Wajib',
  sukarela: 'Simpanan Sukarela',
  all: 'Semua',
} as const;

// Loan status labels
export const LOAN_STATUS_LABELS = {
  active: 'Aktif',
  completed: 'Lunas',
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  defaulted: 'Macet',
} as const;

// Installment status labels
export const INSTALLMENT_STATUS_LABELS = {
  paid: 'Lunas',
  unpaid: 'Belum Bayar',
  overdue: 'Terlambat',
} as const;

// Loan purpose labels
export const LOAN_PURPOSE_LABELS = {
  productive: 'Produktif',
  consumptive: 'Konsumtif',
  education: 'Pendidikan',
  health: 'Kesehatan',
  other: 'Lainnya',
} as const;

// News category labels
export const NEWS_CATEGORY_LABELS = {
  news: 'Berita',
  announcement: 'Pengumuman',
  education: 'Edukasi',
} as const;

// News category colors
export const NEWS_CATEGORY_COLORS = {
  news: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  announcement: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  education: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
} as const;

// Membership status labels
export const MEMBERSHIP_STATUS_LABELS = {
  active: 'Anggota Aktif',
  inactive: 'Tidak Aktif',
  pending: 'Menunggu',
  rejected: 'Ditolak',
} as const;

// Saving status labels
export const SAVING_STATUS_LABELS = {
  pending: 'Menunggu',
  completed: 'Selesai',
  failed: 'Gagal',
} as const;

// Transaction type labels
export const TRANSACTION_TYPE_LABELS = {
  deposit: 'Setoran',
  withdrawal: 'Penarikan',
  all: 'Semua Transaksi',
} as const;

// Days of week
export const DAYS_OF_WEEK = [
  { id: 'senin', label: 'Senin' },
  { id: 'selasa', label: 'Selasa' },
  { id: 'rabu', label: 'Rabu' },
  { id: 'kamis', label: 'Kamis' },
  { id: 'jumat', label: 'Jumat' },
  { id: 'sabtu', label: 'Sabtu' },
  { id: 'minggu', label: 'Minggu' },
] as const;

// Saving type colors for cards
export const SAVING_TYPE_COLORS = {
  pokok: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  },
  wajib: {
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  },
  sukarela: {
    gradient: 'from-rose-500 to-rose-600',
    light: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
  },
} as const;

// Loan status colors
export const LOAN_STATUS_COLORS = {
  active: {
    label: 'Aktif',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  completed: {
    label: 'Lunas',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  pending: {
    label: 'Menunggu',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  approved: {
    label: 'Disetujui',
    color: 'text-teal-700 dark:text-teal-400',
    bg: 'bg-teal-100 dark:bg-teal-900/30',
  },
  rejected: {
    label: 'Ditolak',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
  defaulted: {
    label: 'Macet',
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-700',
  },
} as const;
