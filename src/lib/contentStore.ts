import type { HeroSlideInput, HeroSlideRecord, ProductInput, ProductRecord, SiteSettings } from "@/content/model";
import { seedHeroSlides, seedProducts, seedSettings } from "@/content/seed";
import { isMissingDatabase, query } from "./db";

// Products, hero slides and settings. Public reads fall back to the seed content when the
// database isn't configured (local `next start`), so the site still renders. Writes never fall back.

type ProductRow = {
  id: string; slug: string; category: ProductInput["category"];
  name_en: string; name_ar: string; summary_en: string; summary_ar: string;
  description_en: string; description_ar: string;
  features_en: string[]; features_ar: string[];
  specs_en: ProductInput["specs"]["en"]; specs_ar: ProductInput["specs"]["ar"];
  image_url: string | null; published: boolean; sort_order: number; updated_at: Date | string;
};

const toProduct = (r: ProductRow): ProductRecord => ({
  id: r.id,
  slug: r.slug,
  category: r.category,
  name: { en: r.name_en, ar: r.name_ar },
  summary: { en: r.summary_en, ar: r.summary_ar },
  description: { en: r.description_en, ar: r.description_ar },
  features: { en: r.features_en ?? [], ar: r.features_ar ?? [] },
  specs: { en: r.specs_en ?? [], ar: r.specs_ar ?? [] },
  imageUrl: r.image_url,
  published: r.published,
  sortOrder: r.sort_order,
  updatedAt: new Date(r.updated_at),
});

const seedAsRecords = (): ProductRecord[] =>
  seedProducts.map((p) => ({ ...p, id: `seed-${p.slug}`, updatedAt: new Date(0) }));

async function withFallback<T>(read: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await read();
  } catch (err) {
    if (isMissingDatabase(err)) return fallback();
    throw err;
  }
}

const ORDER = "ORDER BY sort_order, created_at";

// ---------- products: public

export const listPublishedProducts = () =>
  withFallback(
    async () => (await query<ProductRow>(`SELECT * FROM products WHERE published ${ORDER}`)).map(toProduct),
    () => seedAsRecords().filter((p) => p.published),
  );

export const getPublishedProduct = (slug: string) =>
  withFallback(
    async () => {
      const [row] = await query<ProductRow>("SELECT * FROM products WHERE slug = $1 AND published", [slug]);
      return row ? toProduct(row) : null;
    },
    () => seedAsRecords().find((p) => p.slug === slug) ?? null,
  );

// ---------- products: admin

export async function listAllProducts(): Promise<ProductRecord[]> {
  return (await query<ProductRow>(`SELECT * FROM products ${ORDER}`)).map(toProduct);
}

export async function getProduct(id: string): Promise<ProductRecord | null> {
  const [row] = await query<ProductRow>("SELECT * FROM products WHERE id = $1", [id]);
  return row ? toProduct(row) : null;
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const [row] = await query<ProductRow>("SELECT * FROM products WHERE slug = $1", [slug]);
  return row ? toProduct(row) : null;
}

const productValues = (p: ProductInput) => [
  p.slug, p.category, p.name.en, p.name.ar, p.summary.en, p.summary.ar, p.description.en, p.description.ar,
  JSON.stringify(p.features.en), JSON.stringify(p.features.ar), JSON.stringify(p.specs.en), JSON.stringify(p.specs.ar),
  p.imageUrl, p.published, p.sortOrder,
];

export async function createProduct(p: ProductInput): Promise<string> {
  const [row] = await query<{ id: string }>(
    `INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar,
       features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,$13,$14,$15) RETURNING id`,
    productValues(p),
  );
  return row.id;
}

export async function updateProduct(id: string, p: ProductInput) {
  await query(
    `UPDATE products SET slug=$1, category=$2, name_en=$3, name_ar=$4, summary_en=$5, summary_ar=$6,
       description_en=$7, description_ar=$8, features_en=$9::jsonb, features_ar=$10::jsonb, specs_en=$11::jsonb,
       specs_ar=$12::jsonb, image_url=$13, published=$14, sort_order=$15, updated_at=NOW()
     WHERE id=$16`,
    [...productValues(p), id],
  );
}

/** Insert or update by slug (bulk import). Returns whether the row was created. */
export async function upsertProductBySlug(p: ProductInput): Promise<"created" | "updated"> {
  const [row] = await query<{ created: boolean }>(
    `INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar,
       features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,$13,$14,$15)
     ON CONFLICT (slug) DO UPDATE SET category=EXCLUDED.category, name_en=EXCLUDED.name_en, name_ar=EXCLUDED.name_ar,
       summary_en=EXCLUDED.summary_en, summary_ar=EXCLUDED.summary_ar, description_en=EXCLUDED.description_en,
       description_ar=EXCLUDED.description_ar, features_en=EXCLUDED.features_en, features_ar=EXCLUDED.features_ar,
       specs_en=EXCLUDED.specs_en, specs_ar=EXCLUDED.specs_ar,
       image_url=COALESCE(EXCLUDED.image_url, products.image_url),
       published=EXCLUDED.published, sort_order=EXCLUDED.sort_order, updated_at=NOW()
     RETURNING (xmax = 0) AS created`,
    productValues(p),
  );
  return row.created ? "created" : "updated";
}

export async function setProductImage(id: string, imageUrl: string | null) {
  await query("UPDATE products SET image_url=$1, updated_at=NOW() WHERE id=$2", [imageUrl, id]);
}

export async function deleteProduct(id: string) {
  await query("DELETE FROM products WHERE id=$1", [id]);
}

export async function countProducts(): Promise<{ total: number; published: number }> {
  const [row] = await query<{ total: string; published: string }>(
    "SELECT COUNT(*)::text AS total, COUNT(*) FILTER (WHERE published)::text AS published FROM products",
  );
  return { total: Number(row.total), published: Number(row.published) };
}

// ---------- hero slides

type SlideRow = {
  id: string; kind: "image" | "video"; media_url: string; poster_url: string | null;
  alt_en: string; alt_ar: string; active: boolean; sort_order: number;
};

const toSlide = (r: SlideRow): HeroSlideRecord => ({
  id: r.id, kind: r.kind, mediaUrl: r.media_url, posterUrl: r.poster_url,
  alt: { en: r.alt_en, ar: r.alt_ar }, active: r.active, sortOrder: r.sort_order,
});

export const listActiveSlides = () =>
  withFallback(
    async () => (await query<SlideRow>(`SELECT * FROM hero_slides WHERE active ${ORDER}`)).map(toSlide),
    () => seedHeroSlides.map((s, i) => ({ ...s, id: `seed-${i}` })),
  );

export async function listAllSlides(): Promise<HeroSlideRecord[]> {
  return (await query<SlideRow>(`SELECT * FROM hero_slides ${ORDER}`)).map(toSlide);
}

export async function createSlide(s: HeroSlideInput) {
  await query(
    `INSERT INTO hero_slides (kind, media_url, poster_url, alt_en, alt_ar, active, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [s.kind, s.mediaUrl, s.posterUrl, s.alt.en, s.alt.ar, s.active, s.sortOrder],
  );
}

export async function updateSlide(id: string, s: Pick<HeroSlideInput, "alt" | "active" | "sortOrder">) {
  await query("UPDATE hero_slides SET alt_en=$1, alt_ar=$2, active=$3, sort_order=$4 WHERE id=$5", [
    s.alt.en, s.alt.ar, s.active, s.sortOrder, id,
  ]);
}

export async function getSlide(id: string): Promise<HeroSlideRecord | null> {
  const [row] = await query<SlideRow>("SELECT * FROM hero_slides WHERE id=$1", [id]);
  return row ? toSlide(row) : null;
}

export async function deleteSlide(id: string) {
  await query("DELETE FROM hero_slides WHERE id=$1", [id]);
}

/** Swaps a slide with its neighbour in the given direction. */
export async function moveSlide(id: string, direction: "up" | "down") {
  const slides = await listAllSlides();
  const i = slides.findIndex((s) => s.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= slides.length) return;
  // Re-number everything so equal sort orders can't get stuck.
  const ordered = [...slides];
  [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
  for (const [k, s] of ordered.entries()) {
    await query("UPDATE hero_slides SET sort_order=$1 WHERE id=$2", [(k + 1) * 10, s.id]);
  }
}

// ---------- settings

export const getSettings = () =>
  withFallback(async (): Promise<SiteSettings> => {
    const rows = await query<{ key: string; value: unknown }>("SELECT key, value FROM site_settings");
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      heroIntervalMs: Number(map.hero_interval_ms ?? seedSettings.heroIntervalMs),
      heroShowPlaceholderBadge: map.hero_show_placeholder_badge !== false,
    };
  }, () => seedSettings);

export async function saveSettings(s: SiteSettings) {
  for (const [key, value] of [
    ["hero_interval_ms", s.heroIntervalMs],
    ["hero_show_placeholder_badge", s.heroShowPlaceholderBadge],
  ] as const) {
    await query(
      `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [key, JSON.stringify(value)],
    );
  }
}
