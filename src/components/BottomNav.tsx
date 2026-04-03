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

  const links: { href: string; label: TranslationKey; icon: React.ElementType }[] = [
    { href: "/", label: "home", icon: Home },
    { href: "/savings", label: "savings", icon: Wallet },
    { href: "/news", label: "news", icon: Newspaper },
    { href: "/loans", label: "loans", icon: Landmark },
    { href: "/profile", label: "profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 dark:text-slate-400 hover:text-primary transition-all active:scale-95",
                isActive && "text-primary dark:text-primary"
              )}
            >
              <div className={cn(
                "p-1 rounded-xl transition-colors",
                isActive && "bg-primary/10"
              )}>
                <Icon size={22} className={cn(isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{t(link.label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
