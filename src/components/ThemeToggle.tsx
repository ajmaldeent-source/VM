"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "@/content";
import type { Locale } from "@/i18n/config";

export default function ThemeToggle({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).ui;
  const [dark, setDark] = useState(true);

  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t.toLight : t.toDark}
      className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        )}
      </svg>
    </button>
  );
}
