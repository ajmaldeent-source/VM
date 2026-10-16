import type { Metadata } from "next";
import { requireStaff } from "@/lib/guards";
import { allowlists, permissions, type Role } from "@/lib/roles";

export const metadata: Metadata = { title: "Users & roles" };
export const dynamic = "force-dynamic";

const roles: Role[] = ["admin", "developer", "consumer"];

// Admin only: who has which role, and what each role can open.
export default async function UsersPage() {
  await requireStaff("users:view");

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Admin only</p>
        <h1 className="mt-2 text-3xl font-bold">Users & roles</h1>
        <p className="mt-1 text-sm text-slate-500">
          Staff roles come from the <code>ADMIN_EMAILS</code> and <code>DEVELOPER_EMAILS</code> settings on the host.
          Every other Google account that signs in is a consumer.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        {(["admin", "developer"] as const).map((r) => (
          <div key={r} className="glass p-6">
            <h2 className="text-lg font-semibold capitalize">{r}s</h2>
            {allowlists[r].length ? (
              <ul className="mt-3 space-y-1 text-sm">
                {allowlists[r].map((e) => <li key={e} className="font-mono">{e}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">None — set <code>{r === "admin" ? "ADMIN_EMAILS" : "DEVELOPER_EMAILS"}</code>.</p>
            )}
          </div>
        ))}
      </section>

      <section className="glass p-6">
        <h2 className="text-lg font-semibold">Permission matrix</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2 text-start font-medium">Permission</th>
                {roles.map((r) => <th key={r} className="py-2 text-center font-medium capitalize">{r}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {Object.entries(permissions).map(([perm, allowed]) => (
                <tr key={perm}>
                  <td className="py-3 font-mono">{perm}</td>
                  {roles.map((r) => (
                    <td key={r} className="py-3 text-center">
                      {(allowed as readonly Role[]).includes(r) ? <span className="text-emerald-500">✓</span> : <span className="text-slate-400">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-500">Defined in <code>src/lib/roles.ts</code>.</p>
      </section>
    </div>
  );
}
