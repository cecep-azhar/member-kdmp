"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { payloadFetch } from "@/lib/payload";
import { User, Mail, Smartphone, MapPin, Briefcase, Calendar, ChevronRight, LogOut, Shield, Settings, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const memberData = await payloadFetch(`/members?where[user][equals]=${user.id}`);
        if (memberData.docs.length > 0) {
          setMember(memberData.docs[0]);
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
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

  const profileItems = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Smartphone, label: "Phone", value: member?.phone || "-" },
    { icon: MapPin, label: "Address", value: member?.address || "-" },
    { icon: Briefcase, label: "Occupation", value: member?.occupation || "-" },
    { icon: Calendar, label: "Member Since", value: member?.joinDate ? new Date(member.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "-" },
  ];

  const menuItems = [
    { icon: Settings, label: "Account Settings", color: "blue" },
    { icon: Shield, label: "Privacy & Security", color: "emerald" },
    { icon: Info, label: "Help Center", color: "amber" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-[36px] bg-primary flex items-center justify-center text-white text-4xl font-black uppercase ring-8 ring-primary/5 shadow-2xl">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-700">
            <User size={18} className="text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{member?.fullName || user?.name}</h1>
        <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-tighter shadow-sm ring-1 ring-primary/20">
          {member?.memberId || "MEMBER ID - NOT FOUND"}
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Info Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Identity Details</h2>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            {profileItems.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
            </button>
          ))}
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-between p-5 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 shadow-sm group transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 dark:border-rose-500/20">
                <LogOut size={20} />
              </div>
              <span className="font-bold text-rose-600 text-sm tracking-tight">Log Out Session</span>
            </div>
          </button>
        </div>

        <div className="text-center pt-8">
          <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em]">Member KDMP App v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
