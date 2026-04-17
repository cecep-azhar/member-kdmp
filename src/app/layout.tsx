import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { SettingsProvider } from "@/components/SettingsProvider";
import { ClientWrapper } from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aplikasi Anggota Koperasi",
  description: "Portal anggota Koperasi Desa Merah Putih",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-50`}>
        <SettingsProvider>
          <AuthProvider>
            <ClientWrapper>
              {children}
            </ClientWrapper>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

