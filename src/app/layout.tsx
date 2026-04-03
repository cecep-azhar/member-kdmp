"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { AuthProvider } from "@/components/AuthProvider";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-50`}>
        <AuthProvider>
          {/* Mobile Wrapper */}
          <div className="mx-auto max-w-md min-h-screen bg-white dark:bg-slate-900 shadow-2xl relative overflow-hidden flex flex-col pb-16">
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
            {!isLoginPage && <BottomNav />}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
