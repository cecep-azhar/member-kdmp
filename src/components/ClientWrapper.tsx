"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { InstallPrompt } from "@/components/InstallPrompt";

/**
 * ClientWrapper - Komponen client-side untuk layout.
 * Memisahkan logika client (usePathname) dari root layout (server component).
 * Root layout di Next.js App Router harus server component.
 */
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="mx-auto max-w-md min-h-screen bg-white dark:bg-slate-900 shadow-2xl relative overflow-hidden flex flex-col pb-16">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      {!isLoginPage && <BottomNav />}
      {!isLoginPage && <InstallPrompt />}
    </div>
  );
}
