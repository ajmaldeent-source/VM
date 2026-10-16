"use client";

import { useActionState, useState } from "react";
import type { ProductRecord } from "@/content/model";
import { productCategories } from "@/content/model";
import { featuresToText, specsToText } from "@/lib/productInput";
import { saveProduct, type ProductFormState } from "./actions";

const initial: ProductFormState = { errors: {} };

function Field({ label, name, error, children, hint }: { label: string; name: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p id={`${name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export default function ProductForm({ product }: { product?: ProductRecord }) {
  const [state, action, pending] = useActionState(saveProduct, initial);
  const [preview, setPreview] = useState<string | null>(null);
  const e = state.errors;
  const current = product?.imageUrl ?? (product ? `/media/product-${product.category}.svg` : null);

  const bi = (key: "name" | "summary" | "description", label: string, rows?: number) => (
    <div className="grid gap-4 md:grid-cols-2">
      {(["en", "ar"] as const).map((l) => {
        const name = `${key}_${l}`;
        const props = {
          id: name,
          name,
          defaultValue: product?.[key][l] ?? "",
          dir: l === "ar" ? "rtl" : "ltr",
          lang: l,
          className: "field",
          "aria-invalid": Boolean(e[name]) || undefined,
        } as const;
        return (
          <Field key={l} label={`${label} (${l === "en" ? "English" : "Arabic"})${key === "name" && l === "en" ? " *" : ""}`} name={name} error={e[name]}>
            {rows ? <textarea rows={rows} {...props} /> : <input {...props} />}
          </Field>
        );
      })}
    </div>
  );

  const list = (key: "features" | "specs", label: string, hint: string) => (
    <div className="grid gap-4 md:grid-cols-2">
      {(["en", "ar"] as const).map((l) => {
        const name = `${key}_${l}`;
        const value = product ? (key === "features" ? featuresToText(product.features[l]) : specsToText(product.specs[l])) : "";
        return (
          <Field key={l} label={`${label} (${l === "en" ? "English" : "Arabic"})`} name={name} error={e[name]} hint={hint}>
            <textarea id={name} name={name} rows={5} defaultValue={value} dir={l === "ar" ? "rtl" : "ltr"} lang={l} className="field font-mono text-sm" />
          </Field>
        );
      })}
    </div>
  );

  return (
    <form action={action} className="space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      {state.message && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{state.message}</p>
      )}

      <section className="glass grid gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Category *" name="category" error={e.category}>
              <select id="category" name="category" defaultValue={product?.category ?? "valves"} className="field">
                {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Slug (URL)" name="slug" error={e.slug} hint="Leave empty to create from the English name.">
              <input id="slug" name="slug" defaultValue={product?.slug ?? ""} className="field font-mono" placeholder="gate-valve" />
            </Field>
            <Field label="Sort order" name="sort_order" error={e.sort_order} hint="Lower numbers show first.">
              <input id="sort_order" name="sort_order" type="number" defaultValue={product?.sortOrder ?? 0} className="field" />
            </Field>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="published" defaultChecked={product?.published ?? true} className="h-4 w-4 accent-safety-500" />
            Published (visible on the website)
          </label>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Picture</h2>
          {(preview || current) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview ?? current!} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
          )}
          <Field label="Upload new picture" name="image" error={e.image} hint="JPG, PNG, WebP or GIF, up to 5 MB.">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-safety-500 file:px-4 file:py-2 file:text-white"
              onChange={(ev) => {
                const f = ev.target.files?.[0];
                setPreview(f ? URL.createObjectURL(f) : null);
              }}
            />
          </Field>
          {product?.imageUrl && (
            <label className="flex items-center gap-2 text-sm text-slate-500">
              <input type="checkbox" name="removeImage" className="accent-safety-500" /> Remove picture (use category placeholder)
            </label>
          )}
        </div>
      </section>

      <section className="glass space-y-5 p-6">
        <h2 className="text-lg font-semibold">Text (English and Arabic)</h2>
        {bi("name", "Name")}
        {bi("summary", "Short summary", 2)}
        {bi("description", "Description", 4)}
      </section>

      <section className="glass space-y-5 p-6">
        <h2 className="text-lg font-semibold">Features and specifications</h2>
        {list("features", "Features", "One feature per line.")}
        {list("specs", "Specifications", "One per line: Label | Value")}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
        <a href="/admin/products" className="btn-ghost">Cancel</a>
      </div>
    </form>
  );
}
