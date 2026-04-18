"use client";

import { BookOpen, Users, Wallet, Landmark, Activity, Package, BookMarked, Mail, FileText, ClipboardList } from "lucide-react";

const books = [
  {
    no: 1,
    title: "Buku Daftar Anggota",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    description:
      "Memuat daftar lengkap seluruh anggota koperasi termasuk nama, NIK, alamat, tanggal bergabung, dan status keanggotaan.",
    ketentuan: "Wajib ada & mutakhir (UU No. 25/1992 Pasal 19)",
    status: "Aktif",
  },
  {
    no: 2,
    title: "Buku Simpanan Anggota",
    icon: Wallet,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    description:
      "Mencatat seluruh transaksi simpanan anggota: simpanan pokok, simpanan wajib, dan simpanan sukarela beserta saldo terakhir.",
    ketentuan: "Wajib ada sebagai bukti simpanan anggota",
    status: "Aktif",
  },
  {
    no: 3,
    title: "Buku Pinjaman Anggota",
    icon: Landmark,
    color: "from-red-500 to-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    description:
      "Mencatat semua transaksi pinjaman anggota mulai dari pengajuan, pencairan, jadwal angsuran, hingga pelunasan.",
    ketentuan: "Wajib ada sebagai bukti peminjaman",
    status: "Aktif",
  },
  {
    no: 4,
    title: "Buku Kas Harian",
    icon: Activity,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    description:
      "Catatan harian arus kas masuk dan keluar koperasi termasuk penerimaan simpanan, pembayaran angsuran, dan pengeluaran operasional.",
    ketentuan: "Wajib ada sebagai laporan keuangan harian",
    status: "Aktif",
  },
  {
    no: 5,
    title: "Buku Inventaris",
    icon: Package,
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-600 dark:text-rose-400",
    description:
      "Daftar aset/barang inventaris milik koperasi: perabot, peralatan kantor, kendaraan, dan aset tetap lainnya beserta nilai penyusutannya.",
    ketentuan: "Wajib ada untuk laporan neraca koperasi",
    status: "Aktif",
  },
  {
    no: 6,
    title: "Buku Tamu",
    icon: BookOpen,
    color: "from-cyan-500 to-sky-600",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    text: "text-cyan-600 dark:text-cyan-400",
    description:
      "Buku kunjungan tamu resmi yang datang ke koperasi termasuk tujuan kunjungan, nama instansi, dan hasil kunjungan.",
    ketentuan: "Diperlukan untuk tertib administrasi kantor",
    status: "Aktif",
  },
  {
    no: 7,
    title: "Buku Surat Masuk & Keluar",
    icon: Mail,
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    description:
      "Pencatatan seluruh surat resmi yang diterima (masuk) dan dikirim (keluar) oleh koperasi kepada instansi, lembaga, atau anggota.",
    ketentuan: "Wajib ada untuk kelancaran korespondensi",
    status: "Aktif",
  },
  {
    no: 8,
    title: "Buku Risalah Rapat",
    icon: FileText,
    color: "from-slate-600 to-slate-700",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    description:
      "Notulen/catatan resmi setiap rapat koperasi: Rapat Anggota Tahunan (RAT), rapat pengurus, dan rapat pengawas beserta keputusannya.",
    ketentuan: "Wajib ada — RAT diatur UU No. 25/1992 Pasal 26",
    status: "Aktif",
  },
  {
    no: 9,
    title: "Buku Daftar Pengurus & Pengawas",
    icon: ClipboardList,
    color: "from-teal-500 to-emerald-600",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-600 dark:text-teal-400",
    description:
      "Daftar lengkap pengurus dan pengawas koperasi yang terpilih, masa jabatan, dan sejarah kepengurusan dari waktu ke waktu.",
    ketentuan: "Wajib ada sesuai AD/ART dan UU Perkoperasian",
    status: "Aktif",
  },
];

export default function BooksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="px-5 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
              <BookMarked size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">9 Buku Koperasi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Administrasi Wajib Koperasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-5 mt-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-4">
        <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-1">📋 Tentang 9 Buku Koperasi</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Berdasarkan ketentuan Undang-Undang No. 25 Tahun 1992 tentang Perkoperasian,
          setiap koperasi wajib menyelenggarakan administrasi dengan tertib menggunakan 9 buku utama berikut.
        </p>
      </div>

      {/* Daftar Buku */}
      <div className="p-5 space-y-3">
        {books.map((book) => {
          const Icon = book.icon;
          return (
            <div
              key={book.no}
              className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${book.color} flex items-center justify-center shadow-sm`}>
                      <Icon size={22} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        Buku #{book.no}
                      </span>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                        ✓ {book.status}
                      </span>
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm leading-tight mb-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                      {book.description}
                    </p>
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${book.bg}`}>
                      <span className={`text-[10px] font-bold ${book.text}`}>⚖️ {book.ketentuan}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mx-5 mb-5 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-center">
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          📌 Untuk melihat data buku koperasi secara lengkap, hubungi pengurus atau datang langsung ke kantor koperasi.
        </p>
      </div>
    </div>
  );
}
