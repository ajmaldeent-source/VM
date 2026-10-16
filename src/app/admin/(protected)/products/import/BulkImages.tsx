"use client";

import { useState } from "react";

type Item = { name: string; slug: string; status: "waiting" | "uploading" | "done" | "error"; message?: string };

const slugFromFile = (name: string) => name.replace(/\.[^.]+$/, "").trim().toLowerCase().replace(/[\s_]+/g, "-");

export default function BulkImages() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const update = (i: number, patch: Partial<Item>) => setItems((list) => list.map((it, k) => (k === i ? { ...it, ...patch } : it)));

  async function start() {
    setBusy(true);
    // One request per file keeps each upload under the hosting size limit.
    for (const [i, file] of files.entries()) {
      update(i, { status: "uploading" });
      const body = new FormData();
      body.append("file", file);
      body.append("slug", slugFromFile(file.name));
      try {
        const res = await fetch("/api/admin/products/image", { method: "POST", body });
        const json = await res.json().catch(() => ({}));
        update(i, res.ok && json.ok ? { status: "done" } : { status: "error", message: json.error ?? `HTTP ${res.status}` });
      } catch {
        update(i, { status: "error", message: "Network error" });
      }
    }
    setBusy(false);
  }

  const done = items.filter((i) => i.status === "done").length;
  const failed = items.filter((i) => i.status === "error").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="bulk-images" className="sr-only">Pictures</label>
        <input
          id="bulk-images"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={busy}
          onChange={(e) => {
            const list = Array.from(e.target.files ?? []);
            setFiles(list);
            setItems(list.map((f) => ({ name: f.name, slug: slugFromFile(f.name), status: "waiting" })));
          }}
          className="block text-sm file:me-3 file:rounded-full file:border-0 file:bg-slate-200 file:px-4 file:py-2 dark:file:bg-white/10 dark:file:text-white"
        />
        <button type="button" onClick={start} disabled={busy || files.length === 0} className="btn-primary disabled:opacity-60">
          {busy ? "Uploading…" : `Upload ${files.length || ""} picture(s)`}
        </button>
      </div>

      {items.length > 0 && (
        <>
          <p role="status" className="text-sm text-slate-500">{done} uploaded · {failed} failed · {items.length} total</p>
          <ul className="max-h-80 divide-y divide-slate-200 overflow-auto rounded-xl border border-slate-200 text-sm dark:divide-white/10 dark:border-white/10">
            {items.map((it, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <span><span className="font-mono">{it.name}</span> <span className="text-slate-500">→ {it.slug}</span></span>
                <span
                  className={
                    it.status === "done" ? "text-emerald-600 dark:text-emerald-400" : it.status === "error" ? "text-red-600 dark:text-red-400" : "text-slate-500"
                  }
                >
                  {it.status === "error" ? it.message : it.status}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
