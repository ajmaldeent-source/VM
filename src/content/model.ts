import type { Locale } from "@/i18n/config";
import type { Product, ProductCategory } from "./types";

// Bilingual content as stored in the database and edited in the admin area.

export const productCategories: ProductCategory[] = ["valves", "instruments", "fittings", "spares"];

type Bi<T> = { en: T; ar: T };
export type Spec = { label: string; value: string };

export type ProductInput = {
  slug: string;
  category: ProductCategory;
  name: Bi<string>;
  summary: Bi<string>;
  description: Bi<string>;
  features: Bi<string[]>;
  specs: Bi<Spec[]>;
  imageUrl: string | null;
  published: boolean;
  sortOrder: number;
};

export type ProductRecord = ProductInput & { id: string; updatedAt: Date };

export type HeroSlideInput = {
  kind: "image" | "video";
  mediaUrl: string;
  posterUrl: string | null;
  alt: Bi<string>;
  active: boolean;
  sortOrder: number;
};

export type HeroSlideRecord = HeroSlideInput & { id: string };

export type SiteSettings = { heroIntervalMs: number; heroShowPlaceholderBadge: boolean };

/** The single-language view used by public pages. */
export function localizeProduct(p: ProductInput, locale: Locale): Product {
  return {
    slug: p.slug,
    category: p.category,
    name: p.name[locale] || p.name.en,
    summary: p.summary[locale] || p.summary.en,
    description: p.description[locale] || p.description.en,
    features: p.features[locale].length ? p.features[locale] : p.features.en,
    specs: p.specs[locale].length ? p.specs[locale] : p.specs.en,
    imageUrl: p.imageUrl ?? `/media/product-${p.category}.svg`,
  };
}

/** Slides with the alt text for one language, safe to pass to the client hero. */
export type PublicHeroSlide = { id: string; kind: "image" | "video"; mediaUrl: string; posterUrl: string | null; alt: string };

export const localizeSlide = (s: HeroSlideRecord | (HeroSlideInput & { id?: string }), locale: Locale, i = 0): PublicHeroSlide => ({
  id: s.id ?? String(i),
  kind: s.kind,
  mediaUrl: s.mediaUrl,
  posterUrl: s.posterUrl,
  alt: s.alt[locale] || s.alt.en,
});
