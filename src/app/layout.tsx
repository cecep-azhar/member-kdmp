import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { SettingsProvider } from "@/components/SettingsProvider";
import { ClientWrapper } from "@/components/ClientWrapper";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Aplikasi Anggota KDMP",
    template: "%s | KDMP",
  },
  description: "Portal anggota Cooperativa Desa Merah Putih",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KDMP",
  },
  openGraph: {
    type: "website",
    siteName: "Aplikasi Anggota KDMP",
    title: "Aplikasi Anggota KDMP",
    description: "Portal anggota Cooperativa Desa Merah Putih",
  },
  twitter: {
    card: "summary",
    title: "Aplikasi Anggota KDMP",
    description: "Portal anggota Cooperativa Desa Merah Putih",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#DC2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
              <ToastProvider />
              {children}
            </ClientWrapper>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
