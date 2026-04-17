"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "border border-slate-200 dark:border-slate-800",
          title: "text-sm font-semibold text-slate-900 dark:text-white",
          description: "text-xs text-slate-500 dark:text-slate-400",
          success: "bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800",
          error: "bg-white dark:bg-slate-900 border-red-200 dark:border-red-800",
          warning: "bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800",
          info: "bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800",
        },
      }}
      theme="light"
      richColors={false}
        expand={false}
        visibleToasts={3}
    />
  );
}
