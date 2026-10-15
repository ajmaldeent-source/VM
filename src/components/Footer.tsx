import Link from "next/link";
import { company, nav, services } from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-ink-900">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{company.name}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{company.intro}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Company</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-slate-600 hover:text-safety-600 dark:text-slate-400 dark:hover:text-safety-400">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Services</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-slate-600 hover:text-safety-600 dark:text-slate-400 dark:hover:text-safety-400">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <address className="mt-3 space-y-2 text-sm not-italic text-slate-600 dark:text-slate-400">
            <p>{company.contact.address}</p>
            <p>{company.contact.phone}</p>
            <p>{company.contact.email}</p>
            <p>{company.contact.hours}</p>
          </address>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-white/10">
        © {new Date().getFullYear()} {company.name}. POC build — placeholder content.
      </div>
    </footer>
  );
}
