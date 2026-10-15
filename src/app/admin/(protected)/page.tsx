import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { locales } from "@/i18n/config";
import { adminEmails } from "@/lib/auth";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const publicPages = ["/", "/about", "/services", "/insights", "/contact"];

export default function AdminDashboard() {
  const en = getDictionary("en");
  const ar = getDictionary("ar");
  const pageCount = (publicPages.length + en.services.length) * locales.length;

  const cards = [
    { label: "Public pages", value: pageCount, note: `${locales.length} languages` },
    { label: "Services", value: en.services.length, note: "EN + AR" },
    { label: "Insights", value: en.insights.length, note: "EN + AR" },
    { label: "Admin accounts", value: adminEmails.length, note: "Google allowlist" },
  ];

  const config = [
    { name: "Google sign-in", ok: true, detail: "Active" },
    {
      name: "Enquiry forwarding",
      ok: Boolean(process.env.ENQUIRY_WEBHOOK_URL),
      detail: process.env.ENQUIRY_WEBHOOK_URL ? "Webhook configured" : "Not set — enquiries are only logged",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold">Website overview</h1>
      </div>

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass p-6">
            <dt className="text-sm text-slate-500 dark:text-slate-400">{c.label}</dt>
            <dd className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{c.value}</dd>
            <dd className="mt-1 text-xs text-slate-500">{c.note}</dd>
          </div>
        ))}
      </dl>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Services — translation check</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-start text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 text-start font-medium">English</th>
                  <th className="py-2 text-start font-medium">Arabic</th>
                  <th className="py-2 text-start font-medium">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {en.services.map((s, i) => (
                  <tr key={s.slug}>
                    <td className="py-3">{s.title}</td>
                    <td className="py-3" dir="rtl" lang="ar">{ar.services[i]?.title ?? <span className="text-red-500">Missing</span>}</td>
                    <td className="py-3">
                      <a href={`/en/services/${s.slug}`} className="text-safety-600 hover:underline dark:text-safety-400">EN</a>
                      {" · "}
                      <a href={`/ar/services/${s.slug}`} className="text-safety-600 hover:underline dark:text-safety-400">AR</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="text-lg font-semibold">Configuration</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {config.map((c) => (
              <li key={c.name} className="flex items-start gap-3">
                <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${c.ok ? "bg-emerald-500" : "bg-amber-500"}`} />
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-slate-500">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            <a href="/en" className="btn-ghost !px-4 !py-2">Open EN site</a>
            <a href="/ar" className="btn-ghost !px-4 !py-2">Open AR site</a>
          </div>
        </div>
      </section>

      <section className="glass p-6">
        <h2 className="text-lg font-semibold">Insights</h2>
        <ul className="mt-4 divide-y divide-slate-200 text-sm dark:divide-white/10">
          {en.insights.map((p, i) => (
            <li key={p.slug} className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr_1fr] sm:gap-4">
              <time className="text-slate-500" dateTime={p.date}>{p.date}</time>
              <span>{p.title}</span>
              <span dir="rtl" lang="ar">{ar.insights[i]?.title}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          Content is read-only in the POC (stored in <code>src/content/en.ts</code> and <code>ar.ts</code>). Editing from
          this dashboard needs a CMS or database — planned for the next phase.
        </p>
      </section>
    </div>
  );
}
