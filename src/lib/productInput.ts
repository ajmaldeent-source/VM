import { productCategories, type ProductInput, type Spec } from "@/content/model";
import type { ProductCategory } from "@/content/types";

// One set of rules for products coming from the admin form or a CSV import.

export const CSV_COLUMNS = [
  "slug", "category", "name_en", "name_ar", "summary_en", "summary_ar", "description_en", "description_ar",
  "features_en", "features_ar", "specs_en", "specs_ar", "image_url", "published", "sort_order",
] as const;

export type RawProduct = Partial<Record<(typeof CSV_COLUMNS)[number], string>>;
export type FieldErrors = Partial<Record<string, string>>;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const limit = (s: string, n: number) => s.trim().slice(0, n);

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);

/** Features: one per line (form) or separated by ";" (CSV). */
export const parseFeatures = (s = "") =>
  s.split(/\r?\n|;/).map((x) => limit(x, 200)).filter(Boolean).slice(0, 20);

/** Specs: "Label | Value", one per line (form) or separated by ";" (CSV). */
export function parseSpecs(s = ""): { specs: Spec[]; bad: string[] } {
  const specs: Spec[] = [];
  const bad: string[] = [];
  for (const line of s.split(/\r?\n|;/).map((x) => x.trim()).filter(Boolean)) {
    const [label, ...rest] = line.split("|");
    const value = rest.join("|").trim();
    if (!label.trim() || !value) bad.push(line);
    else specs.push({ label: limit(label, 80), value: limit(value, 200) });
  }
  return { specs: specs.slice(0, 30), bad };
}

export const featuresToText = (f: string[], sep = "\n") => f.join(sep);
export const specsToText = (s: Spec[], sep = "\n") => s.map((x) => `${x.label} | ${x.value}`).join(sep);

const truthy = (v = "") => ["1", "true", "yes", "y", "on", "published"].includes(v.trim().toLowerCase());

export function toProductInput(raw: RawProduct, defaults: { published?: boolean } = {}): { input?: ProductInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const nameEn = limit(raw.name_en ?? "", 120);
  const slug = (raw.slug ?? "").trim().toLowerCase() || slugify(nameEn);
  const category = (raw.category ?? "").trim().toLowerCase() as ProductCategory;
  const sort = (raw.sort_order ?? "").trim();
  const image = (raw.image_url ?? "").trim();

  if (!nameEn) errors.name_en = "English name is required.";
  if (!SLUG.test(slug)) errors.slug = "Use lowercase letters, numbers and hyphens (e.g. gate-valve).";
  if (!productCategories.includes(category)) errors.category = `Category must be one of: ${productCategories.join(", ")}.`;
  if (sort && !/^-?\d{1,6}$/.test(sort)) errors.sort_order = "Sort order must be a whole number.";
  if (image && !/^(\/media\/[\w.-]+|\/api\/media\/[\w.-]+|https:\/\/[^\s"'<>]+)$/.test(image)) {
    errors.image_url = "Image URL must be an uploaded image, a /media/ file or an https:// link.";
  }
  const specsEn = parseSpecs(raw.specs_en);
  const specsAr = parseSpecs(raw.specs_ar);
  if (specsEn.bad.length) errors.specs_en = `Use "Label | Value" — check: ${specsEn.bad[0]}`;
  if (specsAr.bad.length) errors.specs_ar = `Use "Label | Value" — check: ${specsAr.bad[0]}`;

  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    input: {
      slug,
      category,
      name: { en: nameEn, ar: limit(raw.name_ar ?? "", 120) },
      summary: { en: limit(raw.summary_en ?? "", 300), ar: limit(raw.summary_ar ?? "", 300) },
      description: { en: limit(raw.description_en ?? "", 4000), ar: limit(raw.description_ar ?? "", 4000) },
      features: { en: parseFeatures(raw.features_en), ar: parseFeatures(raw.features_ar) },
      specs: { en: specsEn.specs, ar: specsAr.specs },
      imageUrl: image || null,
      published: raw.published === undefined || raw.published === "" ? defaults.published ?? true : truthy(raw.published),
      sortOrder: sort ? Number(sort) : 0,
    },
  };
}

export const isUniqueViolation = (err: unknown) => (err as { code?: string })?.code === "23505";
