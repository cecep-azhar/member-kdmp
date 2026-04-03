import { MemberDashboard } from "@/components/MemberDashboard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-50">
      <MemberDashboard />
    </div>
  );
}
