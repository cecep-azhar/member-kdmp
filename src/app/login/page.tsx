import Image from "next/image";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12 justify-center bg-white dark:bg-slate-900 animate-in fade-in duration-500">
      <div className="mb-12 flex justify-center">
        <div className="relative w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center overflow-hidden">
          <Image
            src="/next.svg" // Replace with real logo if available
            alt="Logo"
            width={40}
            height={40}
            className="dark:invert"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <LoginForm />
      </div>

      <div className="mt-auto text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <span className="font-semibold text-primary cursor-pointer hover:underline">
            Contact Admin
          </span>
        </p>
      </div>
    </div>
  );
}
