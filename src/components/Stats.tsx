"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function Stats({ stats }: { stats: Dictionary["stats"] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="glass p-6">
          <dt className="text-sm text-slate-500 dark:text-slate-400">{s.label}</dt>
          <dd className="mt-2 font-display text-4xl font-bold text-slate-900 dark:text-white">
            <Counter to={s.value} suffix={s.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
