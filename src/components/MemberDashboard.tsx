"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { payloadFetch } from "@/lib/payload";
import { Card, CardContent } from "./ui/card";
import { Wallet, Landmark, ArrowUpRight, ArrowDownLeft, Bell, Search } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function MemberDashboard() {
  const { user } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [savings, setSavings] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // 1. Fetch Member details linked to user
        const memberData = await payloadFetch(`/members?where[user][equals]=${user.id}`);
        if (memberData.docs.length > 0) {
          const m = memberData.docs[0];
          setMember(m);

          // 2. Fetch Savings for this member
          const savingsData = await payloadFetch(`/savings?where[member][equals]=${m.id}&limit=5&sort=-createdAt`);
          setSavings(savingsData.docs);

          // 3. Fetch Loans for this member
          const loansData = await payloadFetch(`/loans?where[member][equals]=${m.id}&where[status][equals]=active`);
          setLoans(loansData.docs);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const totalSavings = savings.reduce((sum, item) => {
    if (item.transactionType === 'deposit') return sum + item.amount;
    if (item.transactionType === 'withdrawal') return sum - item.amount;
    return sum;
  }, 0);

  const totalLoans = loans.reduce((sum, item) => sum + (item.remainingBalance || 0), 0);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="p-6 pb-2 text-slate-900 dark:text-white flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back,</p>
          <h2 className="text-2xl font-bold tracking-tight">{member?.fullName || user?.name}</h2>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Balance Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary to-indigo-600 p-8 text-white shadow-xl shadow-primary/20">
          <div className="relative z-10">
            <p className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-wider mb-2">Total Savings Balance</p>
            <h3 className="text-4xl font-bold mb-8">
              Rp {totalSavings.toLocaleString('id-ID')}
            </h3>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-primary-foreground/60 text-xs font-medium mb-1">Member ID</p>
                <p className="font-mono text-sm tracking-widest">{member?.memberId || 'KMP-XXXX-XXXX'}</p>
              </div>
              <div className="h-12 w-12 bg-white/20 blur-[0.5px] rounded-full flex items-center justify-center">
                <Wallet className="text-white" size={24} />
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
              <ArrowDownLeft size={20} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Total Loans</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Rp {totalLoans.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
              <Landmark size={20} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Active Loans</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {loans.length} Loans
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h4>
            <button className="text-primary text-xs font-bold hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            {savings.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">No transactions found</p>
              </div>
            ) : (
              savings.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      item.transactionType === 'deposit' 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                    }`}>
                      {item.transactionType === 'deposit' ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm capitalize">
                        {item.type} {item.transactionType}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${item.transactionType === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {item.transactionType === 'deposit' ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">SUCCESS</p>
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
