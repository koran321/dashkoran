"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Lang } from "@/lib/i18n";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  toggleLang: () => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("agencyLang") as Lang;
    if (savedLang) setLangState(savedLang);
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("agencyLang", newLang);
  };

  const toggleLang = () => {
    const newLang = lang === "en" ? "bn" : "en";
    setLang(newLang);
  };

  const t = (key: string) => {
    return (translations[lang] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
};
