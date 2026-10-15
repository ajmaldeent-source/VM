import Link from "next/link";
import { services } from "@/content/site";
import Icon from "./Icon";
import Reveal from "./Reveal";

export default function ServiceGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {services.map((s, i) => (
        <Reveal key={s.slug} delay={i * 0.08}>
          <Link
            href={`/services/${s.slug}`}
            className="glass group relative flex h-full flex-col overflow-hidden p-8 transition hover:-translate-y-1 hover:border-safety-500/50"
          >
            <div aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-safety-500/0 blur-3xl transition group-hover:bg-safety-500/20" />
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-safety-500/10 text-safety-600 dark:text-safety-400">
              <Icon name={s.icon} />
            </span>
            <h3 className="mt-6 text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 flex-1 text-slate-600 dark:text-slate-400">{s.summary}</p>
            <span className="mt-6 text-sm font-semibold text-safety-600 dark:text-safety-400">
              View capabilities <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
