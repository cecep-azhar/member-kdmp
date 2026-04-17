"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { payloadFetch } from "@/lib/payload";
import {
  User, Mail, Smartphone, MapPin, Briefcase, Calendar,
  ChevronRight, LogOut, Shield, Settings, Info, BookOpen,
  Wallet, Landmark, TrendingUp
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [savings, setSavings] = useState<any[]>([]);
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
          const [savingsData, loansData] = await Promise.all([
            payloadFetch(`/savings?where[member][equals]=${m.id}&limit=200`),
            payloadFetch(`/loans?where[member][equals]=${m.id}`),
          ]);
          setSavings(savingsData.docs);
          setLoans(loansData.docs);
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const totalSavings = savings
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => {
      if (s.transactionType === "deposit") return sum + s.amount;
      if (s.transactionType === "withdrawal") return sum - s.amount;
      return sum;
    }, 0);

  const activeLoans = loans.filter((l) => l.status === "active");
  const totalLoanBalance = activeLoans.reduce((sum, l) => sum + (l.remainingBalance || 0), 0);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const profileItems = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Smartphone, label: "No. Telepon", value: member?.phone || "–" },
    { icon: MapPin, label: "Alamat", value: member?.address || "–" },
    { icon: Briefcase, label: "Pekerjaan", value: member?.occupation || "–" },
    {
      icon: Calendar,
      label: "Bergabung Sejak",
      value: member?.joinDate
        ? new Date(member.joinDate).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "–",
    },
  ];

  const menuItems: Array<{ icon: any; label: string; href: string; color: string }> = [
    { icon: Info, label: "Info Koperasi", href: "/info", color: "text-blue-500" },
    { icon: BookOpen, label: "9 Buku Koperasi", href: "/books", color: "text-purple-500" },
    { icon: Settings, label: "Pengaturan Akun", href: "#", color: "text-slate-500" },
    { icon: Shield, label: "Privasi & Keamanan", href: "#", color: "text-emerald-500" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header Profil */}
      <div className="bg-white dark:bg-slate-900 px-6 pt-10 pb-8 border-b border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-3xl font-black uppercase ring-8 ring-primary/10 shadow-xl">
            {(member?.fullName || user?.name)?.charAt(0) || "A"}
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-700">
            <User size={16} className="text-primary" />
          </div>
        </div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white mb-2 text-center">
          {member?.fullName || user?.name}
        </h1>
        <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-tighter">
          {member?.memberId || "MEMBER ID TIDAK DITEMUKAN"}
        </div>
        <span className={`mt-2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${
          member?.membershipStatus === "active"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-600"
        }`}>
          {member?.membershipStatus === "active" ? "✓ Anggota Aktif" : member?.membershipStatus || "–"}
        </span>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Ringkasan Keuangan */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} className="text-blue-600" />
              <p className="text-[10px] font-bold text-blue-600/80 uppercase tracking-wide">Total Simpanan</p>
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              Rp {totalSavings.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-800">
            <div className="flex items-center gap-2 mb-2">
              <Landmark size={16} className="text-rose-600" />
              <p className="text-[10px] font-bold text-rose-600/80 uppercase tracking-wide">Sisa Pinjaman</p>
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              Rp {totalLoanBalance.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Data Pribadi */}
        <div className="space-y-2">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Data Pribadi
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {profileItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0">
                  <item.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-2">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Layanan
          </h2>
          <div className="space-y-2">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-primary/30 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <item.icon size={20} className={item.color} />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-between p-4 bg-rose-50/60 hover:bg-rose-50 dark:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 shadow-sm group transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 dark:border-rose-500/20">
                  <LogOut size={18} />
                </div>
                <span className="font-bold text-rose-600 text-sm">Keluar dari Akun</span>
              </div>
            </button>
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em]">
            Aplikasi Anggota · v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
