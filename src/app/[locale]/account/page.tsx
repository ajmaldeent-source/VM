import type { Metadata } from "next";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { getDictionary } from "@/content";
import { dateLocale, href, isLocale } from "@/i18n/config";
import { pageLocale, type LocaleParams } from "@/i18n/server";
import { listEnquiriesFor, type EnquiryRecord } from "@/lib/enquiryStore";
import { requireAccount } from "@/lib/guards";
import { isStaff } from "@/lib/roles";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).ui.account.title, robots: { index: false } } : {};
}

// Consumer area: only the signed-in person's own data. No staff tools here.
export default async function AccountPage({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const t = getDictionary(locale);
  const a = t.ui.account;
  const user = await requireAccount(locale);

  // Only this person's own enquiries (matched on their verified Google email).
  let enquiries: EnquiryRecord[] | null = null;
  try {
    enquiries = await listEnquiriesFor(user.email);
  } catch (err) {
    console.error("[account] enquiries unavailable", err);
  }

  return (
    <section className="container-x pb-24 pt-32 sm:pt-40">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" width={56} height={56} referrerPolicy="no-referrer" className="h-14 w-14 rounded-full" />
          )}
          <div>
            <p className="eyebrow">{a.title}</p>
            <h1 className="mt-1 text-3xl font-bold">{a.welcome(user.name.split(" ")[0])}</h1>
          </div>
        </div>
        <SignOutButton callbackUrl={href(locale, "/")} label={a.signOut} />
      </div>

      {isStaff(user.role) && (
        <p className="mt-6 rounded-xl bg-volt-500/10 px-4 py-3 text-sm">
          {a.staffNote} <a href="/admin" className="font-semibold text-volt-500 hover:underline">{a.staffLink}</a>
        </p>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="glass p-6">
          <h2 className="text-lg font-semibold">{a.profile}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-slate-500">{a.name}</dt><dd>{user.name}</dd></div>
            <div><dt className="text-slate-500">{a.email}</dt><dd dir="ltr" className="text-start rtl:text-end">{user.email}</dd></div>
          </dl>
        </div>
        <div className="glass p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">{a.enquiries}</h2>
          {enquiries === null ? (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{a.enquiriesUnavailable}</p>
          ) : enquiries.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{a.enquiriesEmpty}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    <th className="py-2 text-start font-medium">{a.colDate}</th>
                    <th className="py-2 text-start font-medium">{a.colType}</th>
                    <th className="py-2 text-start font-medium">{a.colStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {enquiries.map((e) => (
                    <tr key={e.id}>
                      <td className="py-3">
                        {e.createdAt.toLocaleDateString(dateLocale(locale), { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kuwait" })}
                      </td>
                      <td className="py-3">
                        {t.ui.form.types[e.type] ?? e.type}
                        {e.service && <span className="text-slate-500"> · {t.services.find((s) => s.slug === e.service)?.title ?? e.service}</span>}
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-safety-500/10 px-3 py-1 text-xs font-semibold text-safety-600 dark:text-safety-400">
                          {a.statuses[e.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link href={href(locale, "/contact")} className="btn-primary mt-6">{a.newEnquiry}</Link>
        </div>
      </div>
    </section>
  );
}
