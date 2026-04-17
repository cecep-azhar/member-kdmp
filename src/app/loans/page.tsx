"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { payloadFetch } from "@/lib/payload";
import { Landmark, ChevronRight, CheckCircle2, Clock, AlertTriangle, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Aktif", color: "text-emerald-700", bg: "bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
  completed: { label: "Lunas", color: "text-blue-700", bg: "bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
  pending: { label: "Menunggu", color: "text-amber-700", bg: "bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" },
  approved: { label: "Disetujui", color: "text-teal-700", bg: "bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400" },
  rejected: { label: "Ditolak", color: "text-red-700", bg: "bg-red-100 dark:bg-red-900/30 dark:text-red-400" },
  defaulted: { label: "Macet", color: "text-slate-700", bg: "bg-slate-100 dark:bg-slate-700 dark:text-slate-300" },
};

const purposeLabel: Record<string, string> = {
  productive: "Produktif",
  consumptive: "Konsumtif",
  education: "Pendidikan",
  health: "Kesehatan",
  other: "Lainnya",
};

export default function LoansPage() {
  const { user } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const memberData = await payloadFetch(`/members?where[user][equals]=${user.id}`);
        if (memberData.docs.length > 0) {
          const m = memberData.docs[0];
          setMember(m);
          const loansData = await payloadFetch(`/loans?where[member][equals]=${m.id}&sort=-createdAt`);
          setLoans(loansData.docs);
        }
      } catch (err) {
        console.error("Failed to fetch loans data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const activeLoans = loans.filter((l) => l.status === "active");
  const totalLoanBalance = activeLoans.reduce((sum, l) => sum + (l.remainingBalance || 0), 0);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-44 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-primary to-violet-700 px-6 pt-12 pb-24 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Landmark size={20} className="text-white/70" />
            <h1 className="text-lg font-black">Pinjaman Saya</h1>
          </div>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
            Total Sisa Pinjaman
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            Rp {totalLoanBalance.toLocaleString("id-ID")}
          </h2>
          <p className="text-white/60 text-sm mt-2">
            {activeLoans.length} pinjaman aktif
          </p>
        </div>
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 left-8 h-32 w-32 rounded-full bg-violet-400/20 blur-xl" />
      </div>

      <div className="px-5 -mt-14 z-10 relative space-y-4">
        {loans.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
            <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-400" strokeWidth={1.5} />
            <p className="font-bold text-slate-700 dark:text-slate-300">Tidak Ada Data Pinjaman</p>
            <p className="text-xs text-slate-400 mt-1">Anda belum memiliki riwayat pinjaman</p>
          </div>
        ) : (
          loans.map((loan) => {
            const st = statusConfig[loan.status] || statusConfig.pending;
            const paidInstallments = (loan.installmentSchedule || []).filter((i: any) => i.status === "paid").length;
            const totalInstallments = (loan.installmentSchedule || []).length;
            const progressPct = totalInstallments > 0 ? Math.round((paidInstallments / totalInstallments) * 100) : 0;

            const nextUnpaid = (loan.installmentSchedule || []).find((i: any) => i.status === "unpaid");
            const overdueCount = (loan.installmentSchedule || []).filter((i: any) => i.status === "overdue").length;

            return (
              <Link key={loan.id} href={`/loans/${loan.id}`}>
                <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow active:scale-[0.99] cursor-pointer mb-4">
                  {/* Header pinjaman */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Landmark size={22} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm">{loan.loanId}</p>
                        <p className="text-slate-400 text-[11px] font-medium">
                          {purposeLabel[loan.purpose] || loan.purpose || "–"} · {loan.tenor} bulan
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${st.bg}`}>
                        {st.label}
                      </span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>

                  {/* Nominal */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pokok Pinjaman</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        Rp {loan.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sisa Pinjaman</p>
                      <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        Rp {(loan.remainingBalance || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {loan.status === "active" && totalInstallments > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Progres: {paidInstallments}/{totalInstallments} angsuran
                        </span>
                        <span className="font-black text-slate-900 dark:text-white">{progressPct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Alert: angsuran terlambat atau berikutnya */}
                  {overdueCount > 0 && (
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl p-3 flex items-center gap-2.5">
                      <AlertTriangle size={16} className="text-rose-600 flex-shrink-0" />
                      <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                        {overdueCount} angsuran terlambat · Segera bayar
                      </p>
                    </div>
                  )}

                  {!overdueCount && nextUnpaid && loan.status === "active" && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2.5">
                      <Clock size={16} className="text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">Angsuran Ke-{nextUnpaid.installmentNo}</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          Rp {(nextUnpaid.total || 0).toLocaleString("id-ID")} ·{" "}
                          {new Date(nextUnpaid.dueDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
