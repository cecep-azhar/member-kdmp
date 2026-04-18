"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { payloadFetch } from "@/lib/payload";
import { useSavingsBalance } from "@/hooks/useSavingsBalance";
import { SAVING_TYPE_LABELS, TRANSACTION_TYPE_LABELS, SAVING_STATUS_LABELS } from "@/constants/labels";
import { formatDate } from "@/lib/format";
import type { Member, Saving, SavingType, TransactionType } from "@/types";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type FilterType = "all" | SavingType;
type TxFilterType = "all" | TransactionType;

export default function SavingsPage() {
  const { user } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<FilterType>("all");
  const [activeTx, setActiveTx] = useState<TxFilterType>("all");

  const { pokok, wajib, sukarela, total: totalSavings } = useSavingsBalance(savings);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const memberData = await payloadFetch(`/members?where[user][equals]=${user.id}`);
        if (memberData.docs.length > 0) {
          const m = memberData.docs[0] as Member;
          setMember(m);
          const savingsData = await payloadFetch(`/savings?where[member][equals]=${m.id}&sort=-createdAt&limit=200`);
          setSavings(savingsData.docs as Saving[]);
        }
      } catch (err) {
        console.error("Failed to fetch savings data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const filtered = savings.filter((s) => {
    const typeMatch = activeType === "all" || s.type === activeType;
    const txMatch = activeTx === "all" || s.transactionType === activeTx;
    return typeMatch && txMatch;
  });

  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "pokok", label: "Pokok" },
    { key: "wajib", label: "Wajib" },
    { key: "sukarela", label: "Sukarela" },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-44 w-full rounded-3xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-red-700 px-6 pt-12 pb-24 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Wallet size={20} className="text-white/70" />
            <h1 className="text-lg font-black">Simpanan Saya</h1>
          </div>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
            Total Saldo Keseluruhan
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            Rp {totalSavings.toLocaleString("id-ID")}
          </h2>
          <p className="text-white/60 text-sm mt-2">
            {member?.fullName} · {member?.memberId}
          </p>
        </div>
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 left-8 h-32 w-32 rounded-full bg-red-400/20 blur-xl" />
      </div>

      {/* 3 Kartu Saldo */}
      <div className="px-5 -mt-14 z-10 relative grid grid-cols-3 gap-3 mb-2">
        {[
          { type: "pokok", label: "Pokok", value: pokok, color: "from-red-500 to-red-600", light: "bg-red-50 text-red-700" },
          { type: "wajib", label: "Wajib", value: wajib, color: "from-orange-500 to-orange-600", light: "bg-orange-50 text-orange-700" },
          { type: "sukarela", label: "Sukarela", value: sukarela, color: "from-rose-500 to-rose-600", light: "bg-rose-50 text-rose-700" },
        ].map((item) => (
          <button
            key={item.type}
            onClick={() => setActiveType(activeType === item.type ? "all" : item.type as SavingType)}
            className={`relative overflow-hidden rounded-2xl shadow-lg p-3 text-left transition-all active:scale-95 ${
              activeType === item.type
                ? `bg-gradient-to-br ${item.color} text-white`
                : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            }`}
          >
            <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${activeType === item.type ? "text-white/70" : "text-slate-400"}`}>
              Sp. {item.label}
            </p>
            <p className={`text-[11px] font-black leading-tight ${activeType === item.type ? "text-white" : "text-slate-900 dark:text-white"}`}>
              Rp {item.value.toLocaleString("id-ID")}
            </p>
            {activeType === item.type && (
              <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-white/20" />
            )}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-4 pt-4">
        {/* Filter Jenis & Transaksi */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-1.5 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveType(tab.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeType === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Setoran/Penarikan */}
        <div className="flex gap-2">
          {[
            { key: "all" as TxFilterType, label: "Semua Transaksi" },
            { key: "deposit" as TxFilterType, label: "Setoran" },
            { key: "withdrawal" as TxFilterType, label: "Penarikan" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveTx(btn.key)}
              className={`py-1.5 px-3 rounded-full text-xs font-bold border transition-all ${
                activeTx === btn.key
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent"
                  : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Daftar Transaksi */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Wallet size={40} className="mx-auto mb-3 text-slate-300" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-slate-500">Belum ada transaksi</p>
              <p className="text-xs text-slate-400 mt-1">Coba ganti filter di atas</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      item.transactionType === "deposit"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                    }`}
                  >
                    {item.transactionType === "deposit" ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {(SAVING_TYPE_LABELS as Record<string, string>)[item.type] || item.type}
                    </p>
                    <p className="text-slate-400 text-[11px] font-medium">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-black text-sm ${
                      item.transactionType === "deposit"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {item.transactionType === "deposit" ? "+" : "-"} Rp{" "}
                    {item.amount.toLocaleString("id-ID")}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "completed" ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                    />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {SAVING_STATUS_LABELS[item.status as keyof typeof SAVING_STATUS_LABELS] || item.status}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
