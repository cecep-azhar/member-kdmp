"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { payloadFetch } from "@/lib/payload";
import { Skeleton } from "./ui/skeleton";
import { useSettings } from "./SettingsProvider";
import { useTranslation } from "@/lib/i18n";
import { useSavingsBalance } from "@/hooks/useSavingsBalance";
import { SAVING_TYPE_LABELS, TRANSACTION_TYPE_LABELS } from "@/constants/labels";
import { formatDate } from "@/lib/format";
import type { Member, Saving, Loan, InstallmentSchedule } from "@/types";
import Link from "next/link";
import {
  Wallet,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Bell,
  ChevronRight,
  BookOpen,
  Newspaper,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export function MemberDashboard() {
  const { user } = useAuth();
  const { settings, language } = useSettings();
  const t = useTranslation(language);
  const [member, setMember] = useState<Member | null>(null);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const { pokok, wajib, sukarela, total: totalSavings } = useSavingsBalance(savings);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const memberData = await payloadFetch(`/members?where[user][equals]=${user.id}&depth=1`);
        if (memberData.docs.length > 0) {
          const m = memberData.docs[0] as Member;
          setMember(m);

          const [savingsData, loansData] = await Promise.all([
            payloadFetch(`/savings?where[member][equals]=${m.id}&sort=-createdAt&limit=100`),
            payloadFetch(`/loans?where[member][equals]=${m.id}&sort=-createdAt`),
          ]);
          setSavings(savingsData.docs as Saving[]);
          setLoans(loansData.docs as Loan[]);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const activeLoans = loans.filter((l) => l.status === "active");
  const totalLoanBalance = activeLoans.reduce((sum, l) => sum + (l.remainingBalance || 0), 0);

  const nextInstallment: (InstallmentSchedule & { loanId: string }) | undefined = activeLoans
    .flatMap((loan) =>
      (loan.installmentSchedule || [])
        .filter((inst) => inst.status === "unpaid")
        .map((inst) => ({ ...inst, loanId: loan.loanId }))
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const recentSavings = savings.slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-44 w-full rounded-3xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-6 pt-10 pb-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            {t("welcome_back")}
          </p>
          <h2 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-[200px]">
            {member?.fullName || user?.name}
          </h2>
          <span className="inline-block mt-1 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-tighter">
            {member?.memberId || "–"}
          </span>
        </div>
        <button className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 relative">
          <Bell size={20} />
          {activeLoans.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Hero Balance Card */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-6 text-white shadow-2xl shadow-red-500/30">
          <div className="relative z-10">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
              Total Saldo Simpanan
            </p>
            <h3 className="text-4xl font-black mb-6 tracking-tight">
              Rp {totalSavings.toLocaleString("id-ID")}
            </h3>
            <div className="flex items-center gap-2">
              <Wallet size={14} className="text-white/60" />
              <span className="text-white/60 text-xs font-semibold">
                {settings.appName}
              </span>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-red-400/20 blur-2xl" />
          <div className="absolute top-4 right-4 opacity-20">
            <Wallet size={80} strokeWidth={1} />
          </div>
        </div>

        {/* 3 Saldo per Jenis Simpanan */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Pokok", value: pokok, color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400", border: "border-red-100 dark:border-red-800" },
            { label: "Wajib", value: wajib, color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400", border: "border-orange-100 dark:border-orange-800" },
            { label: "Sukarela", value: sukarela, color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400", border: "border-rose-100 dark:border-rose-800" },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-3 rounded-2xl bg-white dark:bg-slate-900 border ${item.border} shadow-sm flex flex-col gap-2`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                <Wallet size={16} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Sp. {item.label}</p>
                <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                  Rp {item.value.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Pinjaman Aktif */}
        {activeLoans.length > 0 ? (
          <Link href="/loans" className="block">
            <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Pinjaman Aktif</p>
                    <p className="text-base font-black text-slate-900 dark:text-white">
                      Rp {totalLoanBalance.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </div>

              {nextInstallment && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 flex items-center gap-3 border border-amber-100 dark:border-amber-800">
                  <Clock size={16} className="text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">Angsuran Berikutnya</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white">
                      Rp {(nextInstallment.total || 0).toLocaleString("id-ID")}
                      <span className="text-slate-400 font-medium ml-1">
                        · {formatDate(nextInstallment.dueDate, "short")}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-dashed border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tidak Ada Pinjaman Aktif</p>
              <p className="text-xs text-slate-400">Anda bebas dari tunggakan pinjaman</p>
            </div>
          </div>
        )}

        {/* Shortcut Menu */}
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
            Menu Utama
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {[
              { href: "/savings", icon: Wallet, label: "Simpanan", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
              { href: "/loans", icon: Landmark, label: "Pinjaman", color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400" },
              { href: "/news", icon: Newspaper, label: "Berita", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
              { href: "/books", icon: BookOpen, label: "Buku Koperasi", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color} shadow-sm`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Transaksi Terbaru */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-black text-slate-900 dark:text-white text-sm">{t("recent_transactions")}</h4>
            <Link href="/savings" className="text-primary text-xs font-bold hover:underline flex items-center gap-0.5">
              {t("view_all")} <ChevronRight size={12} />
            </Link>
          </div>

          <div className="space-y-2">
            {recentSavings.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" strokeWidth={1.5} />
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("no_transactions")}</p>
              </div>
            ) : (
              recentSavings.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.transactionType === "deposit"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}
                    >
                      {item.transactionType === "deposit" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                        {SAVING_TYPE_LABELS[item.type as keyof typeof SAVING_TYPE_LABELS] || item.type}
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        {formatDate(item.createdAt, "short")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${item.transactionType === "deposit" ? "text-emerald-600" : "text-rose-600"}`}>
                      {item.transactionType === "deposit" ? "+" : "-"} Rp {item.amount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">
                      {item.transactionType === "deposit" ? "Setor" : "Tarik"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
