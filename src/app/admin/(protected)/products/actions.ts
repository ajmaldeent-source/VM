"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductBySlug,
  updateProduct,
  upsertProductBySlug,
} from "@/lib/contentStore";
import { csvToObjects } from "@/lib/csv";
import { requireStaff } from "@/lib/guards";
import { deleteUpload, saveUpload, UploadError } from "@/lib/media";
import { CSV_COLUMNS, isUniqueViolation, toProductInput, type FieldErrors, type RawProduct } from "@/lib/productInput";

// Every action re-checks the permission: server actions are reachable without the page.

export type ProductFormState = { errors: FieldErrors; message?: string };

const UUID = /^[0-9a-f-]{36}$/i;

function refreshPublic(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/[locale]", "layout");
  if (slug) revalidatePath(`/[locale]/products/${slug}`, "page");
}

export async function saveProduct(_prev: ProductFormState, form: FormData): Promise<ProductFormState> {
  await requireStaff("content:manage");
  const id = String(form.get("id") ?? "");
  const existing = id ? await getProduct(id) : null;
  if (id && !existing) return { errors: {}, message: "This product no longer exists." };

  const raw = Object.fromEntries(CSV_COLUMNS.map((k) => [k, String(form.get(k) ?? "")])) as RawProduct;
  raw.published = form.get("published") ? "true" : "false";
  raw.image_url = existing?.imageUrl ?? "";
  const { input, errors } = toProductInput(raw);
  if (!input) return { errors, message: "Please fix the highlighted fields." };

  // Image: new upload replaces the old one; "remove" falls back to the category placeholder.
  const file = form.get("image");
  let uploadedUrl: string | null = null;
  if (file instanceof File && file.size > 0) {
    try {
      uploadedUrl = (await saveUpload(file, ["image"])).url;
      input.imageUrl = uploadedUrl;
    } catch (err) {
      if (err instanceof UploadError) return { errors: { image: err.message }, message: "Please fix the highlighted fields." };
      console.error("[admin] image upload failed", err);
      return { errors: { image: "Upload failed. Please try again." } };
    }
  } else if (form.get("removeImage")) {
    input.imageUrl = null;
  }

  try {
    if (existing) await updateProduct(existing.id, input);
    else await createProduct(input);
  } catch (err) {
    if (uploadedUrl) await deleteUpload(uploadedUrl);
    if (isUniqueViolation(err)) return { errors: { slug: "Another product already uses this slug." } };
    console.error("[admin] save product failed", err);
    return { errors: {}, message: "Could not save the product. Please try again." };
  }

  if (existing && existing.imageUrl !== input.imageUrl) await deleteUpload(existing.imageUrl);
  refreshPublic(input.slug);
  redirect(`/admin/products?saved=${encodeURIComponent(input.slug)}`);
}

export async function deleteProductAction(form: FormData) {
  await requireStaff("content:manage");
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) return;
  const product = await getProduct(id);
  if (!product) return;
  await deleteProduct(id);
  await deleteUpload(product.imageUrl);
  refreshPublic(product.slug);
  redirect(`/admin/products?deleted=${encodeURIComponent(product.slug)}`);
}

export async function togglePublishedAction(form: FormData) {
  await requireStaff("content:manage");
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) return;
  const product = await getProduct(id);
  if (!product) return;
  await updateProduct(id, { ...product, published: !product.published });
  refreshPublic(product.slug);
}

// ---------- CSV import

export type ImportRow = { line: number; slug: string; status: "created" | "updated" | "valid" | "error"; detail?: string };
export type ImportState = { rows: ImportRow[]; summary?: string; error?: string; validateOnly?: boolean };

const MAX_CSV_BYTES = 2 * 1024 * 1024;
const MAX_ROWS = 1000;

export async function importProducts(_prev: ImportState, form: FormData): Promise<ImportState> {
  await requireStaff("content:manage");
  const file = form.get("csv");
  const validateOnly = form.get("mode") === "validate";
  if (!(file instanceof File) || file.size === 0) return { rows: [], error: "Choose a CSV file." };
  if (file.size > MAX_CSV_BYTES) return { rows: [], error: "The CSV file is larger than 2 MB." };

  const records = csvToObjects(await file.text());
  if (records.length === 0) return { rows: [], error: "The file has no data rows." };
  if (records.length > MAX_ROWS) return { rows: [], error: `Import at most ${MAX_ROWS} rows at a time.` };
  if (!("name_en" in records[0]) || !("category" in records[0])) {
    return { rows: [], error: "Missing required columns. Start from the template (needs at least name_en and category)." };
  }

  const seen = new Set<string>();
  const rows: ImportRow[] = [];
  let created = 0, updated = 0, failed = 0;

  for (const [i, rec] of records.entries()) {
    const line = i + 2; // header is line 1
    const { input, errors } = toProductInput(rec as RawProduct);
    if (!input) {
      failed++;
      rows.push({ line, slug: rec.slug || "—", status: "error", detail: Object.values(errors).join(" ") });
      continue;
    }
    if (seen.has(input.slug)) {
      failed++;
      rows.push({ line, slug: input.slug, status: "error", detail: "Duplicate slug in this file." });
      continue;
    }
    seen.add(input.slug);

    if (validateOnly) {
      const exists = await getProductBySlug(input.slug);
      rows.push({ line, slug: input.slug, status: "valid", detail: exists ? "Will update existing product" : "Will create new product" });
      continue;
    }
    try {
      const result = await upsertProductBySlug(input);
      result === "created" ? created++ : updated++;
      rows.push({ line, slug: input.slug, status: result });
    } catch (err) {
      failed++;
      console.error("[admin] import row failed", line, err);
      rows.push({ line, slug: input.slug, status: "error", detail: "Database error." });
    }
  }

  if (!validateOnly) refreshPublic();
  const ok = rows.filter((r) => r.status !== "error").length;
  return {
    rows,
    validateOnly,
    summary: validateOnly
      ? `${ok} row(s) valid, ${failed} with errors. Nothing has been saved yet.`
      : `${created} created, ${updated} updated, ${failed} skipped with errors.`,
  };
}
