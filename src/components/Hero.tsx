"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDictionary } from "@/content";
import type { PublicHeroSlide } from "@/content/model";
import { href, type Locale } from "@/i18n/config";

type Props = { locale: Locale; slides: PublicHeroSlide[]; intervalMs: number; showPlaceholderBadge: boolean };

// Full-bleed hero banner that rotates through pictures and videos managed in /admin/hero.
// Auto-advance can be paused (WCAG 2.2.2) and is off for visitors who prefer reduced motion.
export default function Hero({ locale, slides: heroSlides, intervalMs, showPlaceholderBadge }: Props) {
  const t = getDictionary(locale);
  const h = t.ui.hero;
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const count = heroSlides.length;
  const autoplay = playing && !reduce && count > 1;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setTimeout(() => go(index + 1), intervalMs);
    return () => clearTimeout(id);
  }, [autoplay, index, go, intervalMs]);

  // Only the visible video plays; the rest stay paused on their poster frame.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index && playing && !reduce) v.play().catch(() => {});
      else v.pause();
    });
  }, [index, playing, reduce]);

  const rtl = locale === "ar";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.company.tagline}
      className="relative isolate flex min-h-[88vh] items-end overflow-hidden bg-ink-950 pb-28 pt-32 text-white sm:items-center sm:pb-24"
    >
      {/* Media layers, stacked; the active one fades in. */}
      <div className="absolute inset-0 -z-20">
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={h.slide(i + 1, count)}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            {s.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.mediaUrl}
                alt={s.alt}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            ) : (
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className="h-full w-full object-cover"
                poster={s.posterUrl ?? undefined}
                muted
                loop
                playsInline
                preload={i === 0 ? "auto" : "metadata"}
                aria-label={s.alt}
                src={s.mediaUrl}
              />
            )}
          </div>
        ))}
      </div>

      {/* Contrast overlay so text stays readable on any picture. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30 sm:bg-gradient-to-r sm:from-ink-950/95 sm:via-ink-950/70 sm:to-ink-950/10 rtl:sm:bg-gradient-to-l"
      />

      {showPlaceholderBadge && (
        <span className="absolute end-4 top-24 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-white/70 backdrop-blur sm:end-8">
          {h.placeholderBadge}
        </span>
      )}

      <div className="container-x">
        <div className="max-w-2xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-200 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-safety-500" />
            {h.location} · {t.sectors.join(" · ")}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl rtl:leading-[1.3]"
          >
            {h.titleA}
            <br />
            <span className="bg-gradient-to-r from-safety-400 via-safety-500 to-volt-400 bg-clip-text pb-2 text-transparent">
              {h.titleHighlight}
            </span>{" "}
            {h.titleB}
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 max-w-xl text-lg text-slate-200"
          >
            {t.company.intro}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link href={href(locale, "/contact")} className="btn-primary">
              {t.ui.requestQuote}
              <span aria-hidden className="rtl:rotate-180">→</span>
            </Link>
            <Link href={href(locale, "/products")} className="btn border border-white/25 text-white backdrop-blur hover:border-white/60">
              {t.nav.products}
            </Link>
          </motion.div>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-10">
          <div className="container-x flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? h.pause : h.play}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur hover:border-white/60"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={h.prev}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur hover:border-white/60"
            >
              <span aria-hidden className={rtl ? "rotate-180" : ""}>‹</span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={h.next}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur hover:border-white/60"
            >
              <span aria-hidden className={rtl ? "rotate-180" : ""}>›</span>
            </button>
            <div className="ms-2 flex items-center gap-2">
              {heroSlides.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={h.slide(i + 1, count)}
                  aria-current={i === index ? "true" : undefined}
                  className="group relative grid h-6 place-items-center"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all ${
                      i === index ? "w-8 bg-safety-500" : "w-3 bg-white/40 group-hover:bg-white/70"
                    }`}
                  />
                  {s.kind === "video" && <span className="sr-only">(video)</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
