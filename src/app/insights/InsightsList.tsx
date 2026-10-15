"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import InsightCard from "@/components/InsightCard";
import { insights, type Insight } from "@/content/site";

const categories = ["All", ...Array.from(new Set(insights.map((p) => p.category)))] as const;

export default function InsightsList() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const shown = active === "All" ? insights : insights.filter((p: Insight) => p.category === active);

  return (
    <>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
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
            {c}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
              <InsightCard post={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
