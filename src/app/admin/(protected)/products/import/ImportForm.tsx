"use client";

import { useActionState } from "react";
import { importProducts, type ImportState } from "../actions";

const initial: ImportState = { rows: [] };
const badge: Record<string, string> = {
  created: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  updated: "bg-volt-500/15 text-volt-500",
  valid: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  error: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export default function ImportForm() {
  const [state, action, pending] = useActionState(importProducts, initial);

  return (
    <div className="space-y-4">
      <form action={action} className="flex flex-wrap items-center gap-3">
        <label htmlFor="csv" className="sr-only">CSV file</label>
        <input
          id="csv"
          name="csv"
          type="file"
          accept=".csv,text/csv"
          required
          className="block text-sm file:me-3 file:rounded-full file:border-0 file:bg-slate-200 file:px-4 file:py-2 dark:file:bg-white/10 dark:file:text-white"
        />
        <button name="mode" value="validate" disabled={pending} className="btn-ghost disabled:opacity-60">
          {pending ? "Working…" : "Check file (no changes)"}
        </button>
        <button name="mode" value="import" disabled={pending} className="btn-primary disabled:opacity-60">
          Import
        </button>
      </form>

      {state.error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{state.error}</p>}
      {state.summary && (
        <p role="status" className={`rounded-xl px-4 py-3 text-sm ${state.validateOnly ? "bg-volt-500/10" : "bg-emerald-500/10"}`}>
          {state.summary}
        </p>
      )}

      {state.rows.length > 0 && (
        <div className="max-h-96 overflow-auto rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-500 dark:bg-ink-800">
              <tr>
                <th className="px-3 py-2 text-start font-medium">Line</th>
                <th className="px-3 py-2 text-start font-medium">Slug</th>
                <th className="px-3 py-2 text-start font-medium">Result</th>
                <th className="px-3 py-2 text-start font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {state.rows.map((r) => (
                <tr key={r.line}>
                  <td className="px-3 py-2">{r.line}</td>
                  <td className="px-3 py-2 font-mono">{r.slug}</td>
                  <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge[r.status]}`}>{r.status}</span></td>
                  <td className="px-3 py-2 text-slate-500">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
