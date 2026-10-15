import Link from "next/link";
import CTA from "@/components/CTA";
import Hero from "@/components/Hero";
import InsightCard from "@/components/InsightCard";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import ServiceGrid from "@/components/ServiceGrid";
import Stats from "@/components/Stats";
import { insights } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="container-x -mt-12 relative z-10">
        <Stats />
      </section>

      <section className="container-x py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Scope of supply</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Capabilities built for critical operations</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            From individual components to complete project packages, supported locally in Kuwait.
          </p>
        </Reveal>
        <div className="mt-12">
          <ServiceGrid />
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-center">Trusted by</p>
            <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">Working with leading operators</h2>
          </Reveal>
        </div>
        <div className="mt-10">
          <Marquee />
        </div>
      </section>

      <section className="container-x py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <p className="eyebrow">Insights</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">News, audits and projects</h2>
          </Reveal>
          <Link href="/insights" className="btn-ghost">
            All insights
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {insights.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <InsightCard post={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
