import Link from "next/link";
import { getDictionary } from "@/content";
import { href, type Locale } from "@/i18n/config";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const nav = (["home", "about", "services", "insights", "contact"] as const).map((k) => ({
    href: href(locale, k === "home" ? "/" : `/${k}`),
    label: t.nav[k],
  }));
  const linkCls = "text-slate-600 hover:text-safety-600 dark:text-slate-400 dark:hover:text-safety-400";

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-ink-900">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{t.company.name}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t.company.intro}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{t.ui.footer.company}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className={linkCls}>{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{t.ui.footer.services}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {t.services.map((s) => (
              <li key={s.slug}><Link href={href(locale, `/services/${s.slug}`)} className={linkCls}>{s.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{t.ui.footer.contact}</h2>
          <address className="mt-3 space-y-2 text-sm not-italic text-slate-600 dark:text-slate-400">
            <p>{t.company.contact.address}</p>
            <p dir="ltr" className="text-start rtl:text-end">{t.company.contact.phone}</p>
            <p>{t.company.contact.email}</p>
            <p>{t.company.contact.hours}</p>
          </address>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-white/10">
        © {new Date().getFullYear()} {t.company.name}. {t.ui.footer.note}
      </div>
    </footer>
  );
}
