"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import InsightCard from "@/components/InsightCard";
import { getDictionary } from "@/content";
import type { InsightCategory } from "@/content/types";
import type { Locale } from "@/i18n/config";

export default function InsightsList({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const categories: (InsightCategory | "all")[] = ["all", ...Array.from(new Set(t.insights.map((p) => p.category)))];
  const [active, setActive] = useState<InsightCategory | "all">("all");
  const shown = active === "all" ? t.insights : t.insights.filter((p) => p.category === active);

  return (
    <>
      <div role="group" aria-label={t.ui.insightsPage.filterLabel} className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active === c
                ? "bg-safety-500 text-white"
                : "border border-slate-300 text-slate-700 hover:border-slate-500 dark:border-white/15 dark:text-slate-300"
            }`}
          >
            {t.insightCategories[c]}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
              <InsightCard post={p} locale={locale} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
