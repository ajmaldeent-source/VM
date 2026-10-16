"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDictionary } from "@/content";
import { href, type Locale } from "@/i18n/config";
import ThemeToggle from "./ThemeToggle";

export default function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const nav = [
    { href: href(locale, "/"), label: t.nav.home },
    { href: href(locale, "/about"), label: t.nav.about },
    { href: href(locale, "/services"), label: t.nav.services },
    { href: href(locale, "/insights"), label: t.nav.insights },
    { href: href(locale, "/contact"), label: t.nav.contact },
  ];
  const home = href(locale, "/");
  const isActive = (h: string) => (h === home ? pathname === home : pathname.startsWith(h));

  // Same page in the other language.
  const other: Locale = locale === "en" ? "ar" : "en";
  const switchHref = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) || `/${other}`;

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border pe-2 ps-5 backdrop-blur-xl transition-all duration-300 ${
          scrolled || open
            ? "border-slate-200/80 bg-white/80 shadow-lg shadow-slate-900/5 dark:border-white/10 dark:bg-ink-900/75 dark:shadow-black/30"
            : "border-white/10 bg-white/60 dark:bg-white/[0.04]"
        }`}
      >
        <Link href={home} className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-safety-500 text-white">
            {t.company.shortName.charAt(0)}
          </span>
          {t.company.shortName}
          <span className="sr-only"> — {t.ui.home}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-safety-500/10 text-safety-600 dark:text-safety-400"
                  : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={switchHref}
            hrefLang={other}
            lang={other}
            className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            {t.ui.switchLanguage}
          </Link>
          <ThemeToggle locale={locale} />
          <Link
            href={href(locale, "/account")}
            aria-label={t.ui.account.menu}
            title={t.ui.account.menu}
            className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0116 0" />
            </svg>
          </Link>
          <Link href={href(locale, "/contact")} className="btn-primary ms-1 hidden !py-2 sm:inline-flex">
            {t.ui.requestQuote}
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="mx-auto mt-2 max-w-5xl rounded-3xl border border-slate-200/80 bg-white/90 p-2 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/90 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
