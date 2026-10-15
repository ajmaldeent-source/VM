import Reveal from "./Reveal";

export default function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,106,0,0.12),transparent_60%)]" />
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold sm:text-5xl lg:text-6xl">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">{intro}</p>}
        </Reveal>
      </div>
    </section>
  );
}
