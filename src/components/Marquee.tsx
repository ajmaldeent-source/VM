import { clients } from "@/content";

// Infinite logo marquee. Text placeholders until authorized client logos are supplied.
export default function Marquee() {
  const row = [...clients, ...clients];
  return (
    <div dir="ltr" className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <ul className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]" aria-label="Clients">
        {row.map((c, i) => (
          <li
            key={i}
            aria-hidden={i >= clients.length}
            className="glass grid h-20 w-48 shrink-0 place-items-center font-display text-lg font-semibold text-slate-500 transition hover:text-safety-500 dark:text-slate-400"
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
