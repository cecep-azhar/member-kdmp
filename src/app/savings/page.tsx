"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { payloadFetch } from "@/lib/payload";
import { ArrowDownLeft, ArrowUpRight, Wallet, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavingsPage() {
  const { user } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const memberData = await payloadFetch(`/members?where[user][equals]=${user.id}`);
        if (memberData.docs.length > 0) {
          const m = memberData.docs[0];
          setMember(m);
          const savingsData = await payloadFetch(`/savings?where[member][equals]=${m.id}&sort=-createdAt`);
          setSavings(savingsData.docs);
        }
      } catch (err) {
        console.error("Failed to fetch savings data", err);
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Top Banner */}
      <div className="bg-primary px-6 pt-12 pb-20 text-white rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Savings</h1>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet size={20} />
          </div>
        </div>
        <p className="text-primary-foreground/80 text-sm font-medium mb-1">Available Balance</p>
        <h2 className="text-4xl font-black">Rp {totalSavings.toLocaleString('id-ID')}</h2>
      </div>

      {/* Transaction List */}
      <div className="px-6 -mt-10 space-y-4">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl flex border border-slate-100 dark:border-slate-800 shadow-sm">
          <button className="flex-1 py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm">All History</button>
          <button className="flex-1 py-3 text-slate-500 font-bold text-sm">Deposits</button>
          <button className="flex-1 py-3 text-slate-500 font-bold text-sm">Withdrawals</button>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <button className="p-2 text-slate-400 hover:text-primary"><Filter size={18} /></button>
        </div>

        <div className="space-y-3">
          {savings.map((item) => (
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
                    {new Date(item.createdAt).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${item.transactionType === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {item.transactionType === 'deposit' ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}
                </p>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Settled</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
