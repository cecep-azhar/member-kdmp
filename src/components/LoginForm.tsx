"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { payloadFetch } from "@/lib/payload";
import { Loader2, Lock, Mail, Wallet } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await payloadFetch("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.token && data.user) {
        toast.success("Berhasil masuk!", {
          description: `Selamat datang, ${data.user.name || data.user.email}`,
        });
        login(data.user, data.token);
      } else {
        toast.error("Email atau password tidak valid");
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("credentials")) {
        toast.error("Email atau password salah");
      } else if (msg.toLowerCase().includes("fetch")) {
        toast.error("Tidak dapat terhubung ke server");
      } else {
        toast.error(msg || "Terjadi kesalahan");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-red-500/30">
          <Wallet size={30} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Selamat Datang</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Masuk ke akun anggota koperasi Anda
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
            htmlFor="login-email"
          >
            Email
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              id="login-email"
              type="email"
              placeholder="email@koperasi.id"
              required
              autoComplete="email"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
            htmlFor="login-password"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-sm shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sedang Masuk...
            </>
          ) : (
            "Masuk ke Akun"
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
        Butuh bantuan? Hubungi pengurus koperasi
      </p>
    </div>
  );
}
