import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

document.documentElement.dataset.theme =
  localStorage.getItem("hotel_theme") === "light" ? "light" : "dark";

export type Language = "th" | "en";
export type Theme = "dark" | "light";

type PreferencesValue = {
  language: Language;
  theme: Theme;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() =>
    localStorage.getItem("hotel_language") === "en" ? "en" : "th",
  );
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem("hotel_theme") === "light" ? "light" : "dark",
  );

  useEffect(() => {
    localStorage.setItem("hotel_language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem("hotel_theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      language,
      theme,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === "th" ? "en" : "th")),
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [language, theme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences ต้องใช้ภายใน PreferencesProvider");
  return context;
}
