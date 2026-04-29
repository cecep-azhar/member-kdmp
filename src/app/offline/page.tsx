import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Anda Sedang Offline
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Sepertinya koneksi internet terputus. Silakan cek koneksi Anda dan coba lagi.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
        >
          Kembali ke Beranda
        </Link>
        <p className="mt-4 text-xs text-slate-400">
          Aplikasi akan otomatis memuat saat koneksi kembali.
        </p>
      </div>
    </div>
  );
}
