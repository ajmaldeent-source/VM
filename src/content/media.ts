import type { Locale } from "@/i18n/config";
import type { ProductCategory } from "./types";

// Hero banner slides: mix pictures and videos in any order. Replace the placeholder
// files in /public/media with approved photos/footage (keep videos short, muted, < 5 MB).
export type HeroSlide =
  | { kind: "image"; src: string; alt: Record<Locale, string> }
  | { kind: "video"; sources: { src: string; type: string }[]; poster: string; alt: Record<Locale, string> };

export const heroSlides: HeroSlide[] = [
  {
    kind: "video",
    sources: [
      { src: "/media/hero-placeholder.webm", type: "video/webm" },
      { src: "/media/hero-placeholder.mp4", type: "video/mp4" },
    ],
    poster: "/media/hero-placeholder-poster.jpg",
    alt: { en: "Placeholder video of fluid flowing through a pipeline", ar: "فيديو مؤقت لتدفق داخل خط أنابيب" },
  },
  {
    kind: "image",
    src: "/media/hero-piping.svg",
    alt: { en: "Placeholder illustration of a pipe rack with a valve", ar: "رسم مؤقت لحامل أنابيب مع صمام" },
  },
  {
    kind: "image",
    src: "/media/hero-instrumentation.svg",
    alt: { en: "Placeholder illustration of pressure gauges", ar: "رسم مؤقت لمقاييس الضغط" },
  },
  {
    kind: "image",
    src: "/media/hero-workshop.svg",
    alt: { en: "Placeholder illustration of an industrial plant at dusk", ar: "رسم مؤقت لمنشأة صناعية عند الغروب" },
  },
];

/** Set to false once real, approved media replaces the placeholders. */
export const heroMediaIsPlaceholder = true;

export const heroSlideIntervalMs = 7000;

export const productImage = (category: ProductCategory) => `/media/product-${category}.svg`;
