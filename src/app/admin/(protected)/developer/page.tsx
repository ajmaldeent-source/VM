import type { Metadata } from "next";
import { requireStaff } from "@/lib/guards";

export const metadata: Metadata = { title: "Developer tools" };
export const dynamic = "force-dynamic";

// Names only — values are never rendered.
const envVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "ADMIN_EMAILS",
  "DEVELOPER_EMAILS",
  "ENQUIRY_WEBHOOK_URL",
];

const endpoints = [
  { method: "POST", path: "/api/enquiry", note: "Contact form; validated, rate-limited, honeypot" },
  { method: "GET", path: "/api/auth/providers", note: "Configured sign-in providers" },
  { method: "GET", path: "/api/auth/session", note: "Current session (for debugging)" },
];

// Developers and admins: technical status without business data or user management.
export default async function DeveloperPage() {
  const user = await requireStaff("devtools:view");

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Developer</p>
        <h1 className="mt-2 text-3xl font-bold">Developer tools</h1>
        <p className="mt-1 text-sm text-slate-500">Signed in as {user.role}. Secret values are never shown here.</p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass p-6">
          <h2 className="text-lg font-semibold">Environment</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {envVars.map((k) => {
              const set = Boolean(process.env[k]);
              return (
                <li key={k} className="flex items-center justify-between gap-4">
                  <code>{k}</code>
                  <span className={set ? "text-emerald-500" : "text-amber-500"}>{set ? "set" : "missing"}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="glass p-6">
          <h2 className="text-lg font-semibold">Runtime</h2>
          <dl className="mt-4 space-y-2 text-sm">
            {[
              ["Node.js", process.version],
              ["Environment", process.env.CONTEXT ?? process.env.NODE_ENV ?? "unknown"],
              ["Commit", (process.env.COMMIT_REF ?? "local").slice(0, 7)],
              ["Deploy URL", process.env.DEPLOY_PRIME_URL ?? process.env.NEXTAUTH_URL ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-slate-500">{k}</dt>
                <dd className="truncate font-mono">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="glass p-6">
        <h2 className="text-lg font-semibold">API endpoints</h2>
        <ul className="mt-4 divide-y divide-slate-200 text-sm dark:divide-white/10">
          {endpoints.map((e) => (
            <li key={e.path} className="grid gap-1 py-3 sm:grid-cols-[4rem_14rem_1fr] sm:gap-4">
              <span className="font-mono text-safety-600 dark:text-safety-400">{e.method}</span>
              <code>{e.path}</code>
              <span className="text-slate-500">{e.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
