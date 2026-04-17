"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Wallet, Landmark, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSettings } from "./SettingsProvider";
import { useTranslation, TranslationKey } from "@/lib/i18n";

export function BottomNav() {
  const pathname = usePathname();
  const { language } = useSettings();
  const t = useTranslation(language);

  const links: { href: string; label: TranslationKey; icon: React.ElementType; activeMatch?: string }[] = [
    { href: "/", label: "home", icon: Home },
    { href: "/savings", label: "savings", icon: Wallet },
    { href: "/news", label: "news", icon: Newspaper },
    { href: "/loans", label: "loans", icon: Landmark, activeMatch: "/loans" },
    { href: "/profile", label: "profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 z-50 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50">
      <div className="flex justify-around items-center h-16 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.activeMatch
            ? pathname.startsWith(link.activeMatch)
            : pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-0.5 transition-all duration-200",
                isActive ? "text-primary" : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
              )}
            >
              <div
                className={cn(
                  "w-10 h-7 rounded-full flex items-center justify-center transition-all duration-200",
                  isActive && "bg-primary/10"
                )}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={cn(isActive && "fill-primary/10")}
                />
              </div>
              <span
                className={cn(
                  "text-[9.5px] font-bold uppercase tracking-wider transition-all",
                  isActive ? "text-primary" : "text-slate-400"
                )}
              >
                {t(link.label)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
