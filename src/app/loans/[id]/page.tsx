"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { payloadFetch } from "@/lib/payload";
import { ArrowLeft, Landmark, CheckCircle2, Clock, AlertTriangle, TrendingDown, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useParams } from "next/navigation";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Aktif", color: "text-emerald-700", bg: "bg-emerald-100 text-emerald-700" },
  completed: { label: "Lunas", color: "text-blue-700", bg: "bg-blue-100 text-blue-700" },
  pending: { label: "Menunggu", color: "text-amber-700", bg: "bg-amber-100 text-amber-700" },
  approved: { label: "Disetujui", color: "text-teal-700", bg: "bg-teal-100 text-teal-700" },
  rejected: { label: "Ditolak", color: "text-red-700", bg: "bg-red-100 text-red-700" },
  defaulted: { label: "Macet", color: "text-slate-700", bg: "bg-slate-200 text-slate-700" },
};

const installmentStatusConfig: Record<string, { label: string; color: string; icon: any }> = {
  paid: { label: "Lunas", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle2 },
  unpaid: { label: "Belum Bayar", color: "text-amber-600 bg-amber-50", icon: Clock },
  overdue: { label: "Terlambat", color: "text-rose-600 bg-rose-50", icon: AlertTriangle },
};

const purposeLabel: Record<string, string> = {
  productive: "Produktif",
  consumptive: "Konsumtif",
  education: "Pendidikan",
  health: "Kesehatan",
  other: "Lainnya",
};

export default function LoanDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const loanId = params?.id as string;
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchLoan() {
      if (!user || !loanId) return;
      try {
        const data = await payloadFetch(`/loans/${loanId}`);
        setLoan(data);
      } catch (err) {
        console.error("Failed to fetch loan detail", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchLoan();
  }, [user, loanId]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (notFound || !loan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <Landmark size={56} className="text-slate-300 mb-4" strokeWidth={1.5} />
        <h2 className="text-lg font-bold text-slate-700">Data Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400 mt-1 mb-6">Pinjaman tidak ditemukan atau Anda tidak memiliki akses</p>
        <Link href="/loans" className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm">
          Kembali ke Pinjaman
        </Link>
      </div>
    );
  }

  const st = statusConfig[loan.status] || statusConfig.pending;
  const schedule = loan.installmentSchedule || [];
  const paidCount = schedule.filter((i: any) => i.status === "paid").length;
  const overdueCount = schedule.filter((i: any) => i.status === "overdue").length;
  const progressPct = schedule.length > 0 ? Math.round((paidCount / schedule.length) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-4 flex items-center gap-3">
        <Link href="/loans" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-black text-slate-900 dark:text-white text-sm">Detail Pinjaman</h1>
          <p className="text-[11px] text-slate-400 font-medium">{loan.loanId}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${st.bg}`}>
          {st.label}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20">
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Sisa Pinjaman</p>
          <h2 className="text-3xl font-black mb-4">
            Rp {(loan.remainingBalance || 0).toLocaleString("id-ID")}
          </h2>
          {loan.status === "active" && schedule.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Progres pembayaran</span>
                <span className="font-black">{paidCount}/{schedule.length} angsuran ({progressPct}%)</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Info Detail */}
        <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-slate-900 dark:text-white text-sm">Informasi Pinjaman</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { label: "No. Pinjaman", value: loan.loanId },
              { label: "Pokok Pinjaman", value: `Rp ${loan.amount?.toLocaleString("id-ID")}` },
              { label: "Suku Bunga", value: `${loan.interestRate}% / tahun` },
              { label: "Tenor", value: `${loan.tenor} bulan` },
              { label: "Tujuan", value: purposeLabel[loan.purpose] || loan.purpose || "–" },
              { label: "Total Sudah Dibayar", value: `Rp ${(loan.totalPaid || 0).toLocaleString("id-ID")}` },
              {
                label: "Tgl. Pencairan",
                value: loan.disbursementDate
                  ? new Date(loan.disbursementDate).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })
                  : "–",
              },
            ].map((row, idx) => (
              <div key={idx} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-xs font-semibold text-slate-500">{row.label}</span>
                <span className="text-xs font-black text-slate-900 dark:text-white text-right max-w-[60%]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peringatan Menunggak */}
        {overdueCount > 0 && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-rose-700 dark:text-rose-400 text-sm">{overdueCount} Angsuran Terlambat</p>
              <p className="text-xs text-rose-600/80 mt-0.5">Segera hubungi petugas koperasi untuk menghindari denda</p>
            </div>
          </div>
        )}

        {/* Jadwal Angsuran */}
        {schedule.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white text-sm">Jadwal Angsuran</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                {schedule.length} kali
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {schedule.map((inst: any, idx: number) => {
                const instSt = installmentStatusConfig[inst.status] || installmentStatusConfig.unpaid;
                const Icon = instSt.icon;
                const isOverdue = inst.status === "overdue" || (inst.status === "unpaid" && new Date(inst.dueDate) < new Date());
                return (
                  <div
                    key={idx}
                    className={`px-5 py-4 ${inst.status === "paid" ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${instSt.color}`}>
                          <Icon size={12} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white">
                            Angsuran Ke-{inst.installmentNo}
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar size={10} />
                            Jatuh tempo: {new Date(inst.dueDate).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${instSt.color}`}>
                        {instSt.label}
                      </span>
                    </div>
                    <div className="ml-8 grid grid-cols-3 gap-2">
                      {[
                        { label: "Pokok", value: inst.principal },
                        { label: "Bunga", value: inst.interest },
                        { label: "Total", value: inst.total },
                      ].map((detail) => (
                        <div key={detail.label}>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{detail.label}</p>
                          <p className="text-[11px] font-black text-slate-900 dark:text-white">
                            Rp {(detail.value || 0).toLocaleString("id-ID")}
                          </p>
                        </div>
                      ))}
                    </div>
                    {inst.status === "paid" && inst.paidDate && (
                      <p className="ml-8 mt-1.5 text-[10px] text-emerald-600 font-semibold">
                        ✓ Dibayar: {new Date(inst.paidDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
