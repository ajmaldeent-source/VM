import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/content";
import {
  countByStatus,
  enquiryStatuses,
  listEnquiries,
  type EnquiryRecord,
  type EnquiryStatus,
} from "@/lib/enquiryStore";
import { requireStaff } from "@/lib/guards";
import { updateEnquiryStatus } from "./actions";
import { statusLabel, statusStyle } from "./status";

export const metadata: Metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function EnquiriesPage({ searchParams }: Props) {
  await requireStaff("enquiries:view");
  const { status: raw } = await searchParams;
  const status = enquiryStatuses.find((s) => s === raw);
  const en = getDictionary("en");
  const serviceTitle = (slug: string) => en.services.find((s) => s.slug === slug)?.title ?? (slug || "—");

  let items: EnquiryRecord[] = [];
  let counts: Record<EnquiryStatus, number> = { new: 0, in_progress: 0, closed: 0 };
  let dbError = false;
  try {
    [items, counts] = await Promise.all([listEnquiries(status), countByStatus()]);
  } catch (err) {
    console.error("[admin] enquiries unavailable", err);
    dbError = true;
  }
  const total = counts.new + counts.in_progress + counts.closed;
  const tabs = [{ key: undefined, label: "All", n: total }, ...enquiryStatuses.map((s) => ({ key: s, label: statusLabel[s], n: counts[s] }))];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Admin only</p>
        <h1 className="mt-2 text-3xl font-bold">Enquiries</h1>
        <p className="mt-1 text-sm text-slate-500">Every contact-form submission, newest first.</p>
      </div>

      {dbError && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          The database is not reachable. Enquiries can&apos;t be shown right now.
        </p>
      )}

      <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.key ? `/admin/enquiries?status=${t.key}` : "/admin/enquiries"}
            aria-current={status === t.key ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              status === t.key ? "bg-safety-500 text-white" : "border border-slate-300 dark:border-white/15"
            }`}
          >
            {t.label} <span className="opacity-70">({t.n})</span>
          </Link>
        ))}
      </nav>

      {!dbError && items.length === 0 && <p className="glass p-6 text-sm text-slate-500">No enquiries yet.</p>}

      <ul className="space-y-3">
        {items.map((e) => (
          <li key={e.id}>
            <details className="glass group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="grid cursor-pointer list-none gap-2 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:gap-4">
                <time dateTime={e.createdAt.toISOString()} className="text-sm text-slate-500">
                  {e.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kuwait" })}
                </time>
                <span>
                  <span className="font-semibold">{e.name}</span>
                  {e.company && <span className="text-slate-500"> · {e.company}</span>}
                  <span className="block text-sm text-slate-500">
                    {en.ui.form.types[e.type] ?? e.type} · {serviceTitle(e.service)} · {e.locale.toUpperCase()}
                  </span>
                </span>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[e.status]}`}>{statusLabel[e.status]}</span>
              </summary>

              <div className="mt-5 grid gap-6 border-t border-slate-200 pt-5 dark:border-white/10 lg:grid-cols-3">
                <dl className="space-y-2 text-sm">
                  <div><dt className="text-slate-500">Email</dt><dd><a href={`mailto:${e.email}`} className="text-safety-600 hover:underline dark:text-safety-400">{e.email}</a></dd></div>
                  {e.phone && <div><dt className="text-slate-500">Phone</dt><dd>{e.phone}</dd></div>}
                  <div><dt className="text-slate-500">Signed-in account</dt><dd>{e.userEmail ?? "Not signed in"}</dd></div>
                  <div><dt className="text-slate-500">Reference</dt><dd className="font-mono text-xs">{e.id}</dd></div>
                </dl>
                <div className="lg:col-span-2">
                  <p className="text-sm text-slate-500">Message</p>
                  <p className="mt-1 whitespace-pre-wrap" dir="auto">{e.message}</p>
                  <form action={updateEnquiryStatus} className="mt-5 flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={e.id} />
                    <label htmlFor={`status-${e.id}`} className="text-sm text-slate-500">Status</label>
                    <select id={`status-${e.id}`} name="status" defaultValue={e.status} className="field !w-auto !py-2">
                      {enquiryStatuses.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
                    </select>
                    <button type="submit" className="btn-primary !py-2">Update</button>
                  </form>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
