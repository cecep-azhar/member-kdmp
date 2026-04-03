"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { payloadFetch } from "@/lib/payload";
import { Landmark, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const activeLoans = loans.filter((l) => l.status === 'active');
  const totalLoanBalance = activeLoans.reduce((sum, l) => sum + (l.remainingBalance || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Top Banner */}
      <div className="bg-linear-to-br from-indigo-700 to-primary px-6 pt-12 pb-20 text-white rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Loans</h1>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Landmark size={20} />
          </div>
        </div>
        <p className="text-primary-foreground/80 text-sm font-medium mb-1">Total Outstanding</p>
        <h2 className="text-4xl font-black">Rp {totalLoanBalance.toLocaleString('id-ID')}</h2>
      </div>

      {/* Loan List */}
      <div className="px-6 -mt-10 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white">Active Loans ({activeLoans.length})</h3>
          <button className="text-primary text-xs font-bold hover:underline">Apply New</button>
        </div>

        <div className="space-y-4">
          {loans.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <Landmark size={48} className="mx-auto mb-4 text-slate-300" strokeWidth={1} />
              <p className="text-sm text-slate-500 dark:text-slate-400">No loan records found</p>
            </div>
          ) : (
            loans.map((loan) => (
              <div key={loan.id} className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Landmark size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{loan.loanId}</h4>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{loan.purpose}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    loan.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                    loan.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {loan.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Principal</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Rp {loan.amount.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Remaining</p>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Rp {(loan.remainingBalance || 0).toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Tenor</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{loan.tenor} Months</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Interest</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{loan.interestRate}% APR</p>
                  </div>
                </div>

                {loan.status === 'active' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-slate-500">Repayment Progress</p>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {Math.floor(((loan.totalPaid || 0) / (loan.amount * (1 + loan.interestRate/100))) * 100)}%
                      </p>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, Math.floor(((loan.totalPaid || 0) / (loan.amount * (1 + loan.interestRate/100))) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center gap-2 group transition-all active:scale-[0.98]">
                  Loan Details <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
