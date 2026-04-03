"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface AppSettings {
  appName: string;
  primaryColor: string;
  accentColor: string;
  defaultLanguage: 'id' | 'en';
}

const defaultSettings: AppSettings = {
  appName: "Koperasi Desa Merah Putih",
  primaryColor: "#4f46e5",
  accentColor: "#10b981",
  defaultLanguage: "id",
};

interface SettingsContextType {
  settings: AppSettings;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${backendUrl}/globals/settings`);
        if (res.ok) {
          const data = await res.json();
          const newSettings: AppSettings = {
            appName: data?.appName || defaultSettings.appName,
            primaryColor: data?.primaryColor || defaultSettings.primaryColor,
            accentColor: data?.accentColor || defaultSettings.accentColor,
            defaultLanguage: data?.defaultLanguage || defaultSettings.defaultLanguage,
          };
          setSettings(newSettings);
          
          // Apply stored language or fallback to default
          const storedLang = localStorage.getItem('kdmp-lang');
          if (storedLang === 'id' || storedLang === 'en') {
            setLanguage(storedLang);
          } else {
            setLanguage(newSettings.defaultLanguage);
          }
        }
      } catch (err) {
        console.error("Failed to fetch global settings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Sync language to local storage
  const handleSetLanguage = (lang: 'id' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('kdmp-lang', lang);
  }

  // Inject CSS Variables for Tailwind to use
  // Tailwind v4 uses standard CSS vars. We can override --primary and --accent.
  // Tailwind defaults use OKLCH, but hex works if mapped properly, or we can just override the tailwind properties.
  // We will map --theme-primary to the custom color and update globals.css to use it.
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty('--theme-primary', settings.primaryColor);
      document.documentElement.style.setProperty('--theme-accent', settings.accentColor);
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, language, setLanguage: handleSetLanguage, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
