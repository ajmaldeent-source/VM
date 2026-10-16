import type { Metadata } from "next";
import { requireStaff } from "@/lib/guards";
import { CSV_COLUMNS } from "@/lib/productInput";
import BulkImages from "./BulkImages";
import ImportForm from "./ImportForm";

export const metadata: Metadata = { title: "Bulk import / export" };

export default async function ImportPage() {
  await requireStaff("content:manage");
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Products</p>
        <h1 className="mt-2 text-3xl font-bold">Bulk import / export</h1>
      </div>

      <section className="glass space-y-4 p-6">
        <h2 className="text-lg font-semibold">1. Download</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/api/admin/products/export?template=1" className="btn-ghost">CSV template</a>
          <a href="/api/admin/products/export" className="btn-ghost">Export all products</a>
        </div>
        <details className="text-sm text-slate-600 dark:text-slate-400">
          <summary className="cursor-pointer font-medium">Column guide</summary>
          <ul className="mt-3 list-disc space-y-1 ps-5">
            <li><code>slug</code> — unique URL name; rows with an existing slug <strong>update</strong> that product, new slugs create one. Empty = made from <code>name_en</code>.</li>
            <li><code>category</code> — valves, instruments, fittings or spares. <code>name_en</code> is required.</li>
            <li><code>features_en/ar</code> — separate items with <code>;</code></li>
            <li><code>specs_en/ar</code> — <code>Label | Value</code> pairs separated by <code>;</code></li>
            <li><code>image_url</code> — optional; leave empty to keep the current picture (or use the picture upload below).</li>
            <li><code>published</code> — true/false (default true). <code>sort_order</code> — whole number.</li>
            <li>Save as <strong>CSV UTF-8</strong> in Excel so Arabic text is kept. Max 1,000 rows / 2 MB.</li>
          </ul>
          <p className="mt-2 font-mono text-xs">{CSV_COLUMNS.join(", ")}</p>
        </details>
      </section>

      <section className="glass space-y-4 p-6">
        <h2 className="text-lg font-semibold">2. Import products from CSV</h2>
        <ImportForm />
      </section>

      <section className="glass space-y-4 p-6">
        <h2 className="text-lg font-semibold">3. Upload product pictures in bulk</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Name each file after the product slug, e.g. <code>gate-valve.jpg</code>. Each picture replaces that product&apos;s
          current one. JPG, PNG, WebP or GIF, up to 5 MB each.
        </p>
        <BulkImages />
      </section>
    </div>
  );
}
