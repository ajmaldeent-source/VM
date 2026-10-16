import type { Metadata } from "next";
import Link from "next/link";
import { listAllProducts } from "@/lib/contentStore";
import { requireStaff } from "@/lib/guards";
import { togglePublishedAction } from "./actions";
import type { ProductRecord } from "@/content/model";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string; saved?: string; deleted?: string }> };

export default async function AdminProductsPage({ searchParams }: Props) {
  await requireStaff("content:manage");
  const { q = "", saved, deleted } = await searchParams;

  let products: ProductRecord[] = [];
  let dbError = false;
  try {
    products = await listAllProducts();
  } catch (err) {
    console.error("[admin] products unavailable", err);
    dbError = true;
  }
  const needle = q.trim().toLowerCase();
  const shown = needle
    ? products.filter((p) => [p.slug, p.name.en, p.name.ar, p.category].some((v) => v.toLowerCase().includes(needle)))
    : products;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="mt-2 text-3xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-slate-500">{products.length} total · {products.filter((p) => p.published).length} published</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/import" className="btn-ghost">Bulk import / export</Link>
          <Link href="/admin/products/new" className="btn-primary">+ New product</Link>
        </div>
      </div>

      {saved && <p role="status" className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">Saved “{saved}”.</p>}
      {deleted && <p role="status" className="rounded-xl bg-slate-500/10 px-4 py-3 text-sm">Deleted “{deleted}”.</p>}
      {dbError && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">The database is not reachable.</p>}

      <form className="flex gap-2" role="search">
        <label htmlFor="q" className="sr-only">Search products</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search by name, slug or category" className="field max-w-md" />
        <button className="btn-ghost">Search</button>
      </form>

      <div className="glass overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-start font-medium">Image</th>
              <th className="px-4 py-3 text-start font-medium">Name (EN / AR)</th>
              <th className="px-4 py-3 text-start font-medium">Category</th>
              <th className="px-4 py-3 text-start font-medium">Order</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {shown.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl ?? `/media/product-${p.category}.svg`} alt="" className="h-12 w-16 rounded-md object-cover" />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.name.en}</p>
                  <p dir="rtl" lang="ar" className="text-slate-500">{p.name.ar || <span className="text-amber-500">Arabic missing</span>}</p>
                  <p className="font-mono text-xs text-slate-400">{p.slug}</p>
                </td>
                <td className="px-4 py-3 capitalize">{p.category}</td>
                <td className="px-4 py-3">{p.sortOrder}</td>
                <td className="px-4 py-3">
                  <form action={togglePublishedAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${p.published ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-slate-500/15 text-slate-500"}`}
                      title="Click to toggle"
                    >
                      {p.published ? "Published" : "Hidden"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/products/${p.id}`} className="text-safety-600 hover:underline dark:text-safety-400">Edit</Link>
                  {p.published && (
                    <a href={`/en/products/${p.slug}`} target="_blank" rel="noopener" className="ms-3 text-slate-500 hover:underline">View</a>
                  )}
                </td>
              </tr>
            ))}
            {!dbError && shown.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
