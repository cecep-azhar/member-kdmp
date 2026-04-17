import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-br from-indigo-600 via-primary to-violet-700 rounded-b-[60px]">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute top-12 -left-8 h-32 w-32 rounded-full bg-violet-400/20 blur-xl" />
        <div className="absolute bottom-8 right-12 h-24 w-24 rounded-full bg-indigo-400/30 blur-lg" />
      </div>

      {/* Konten */}
      <div className="relative flex flex-col min-h-screen px-6 pt-20 pb-10 justify-between">
        {/* Judul atas */}
        <div className="text-center text-white mb-8">
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">
            Aplikasi Anggota
          </p>
          <h1 className="text-2xl font-black leading-tight">
            Koperasi Desa Merah Putih
          </h1>
        </div>

        {/* Card Login */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl shadow-slate-200/80 dark:shadow-slate-900 p-7 mx-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-xs text-slate-400 dark:text-slate-600">
            Belum punya akun?{" "}
            <span className="font-bold text-primary cursor-pointer hover:underline">
              Hubungi Pengurus
            </span>
          </p>
          <p className="text-[10px] text-slate-300 dark:text-slate-700 mt-3 font-black uppercase tracking-[0.15em]">
            KDMP © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
