import Link from "next/link";
import CTA from "@/components/CTA";
import Hero from "@/components/Hero";
import InsightCard from "@/components/InsightCard";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import ServiceGrid from "@/components/ServiceGrid";
import Stats from "@/components/Stats";
import { getDictionary } from "@/content";
import { href } from "@/i18n/config";
import { pageLocale, type LocaleParams } from "@/i18n/server";

export default async function Home({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const t = getDictionary(locale);
  const h = t.ui.home_;

  return (
    <>
      <Hero locale={locale} />

      <section className="container-x relative z-10 -mt-12">
        <Stats stats={t.stats} />
      </section>

      <section className="container-x py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{h.scopeEyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{h.scopeTitle}</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">{h.scopeIntro}</p>
        </Reveal>
        <div className="mt-12">
          <ServiceGrid locale={locale} />
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-center">{h.clientsEyebrow}</p>
            <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">{h.clientsTitle}</h2>
          </Reveal>
        </div>
        <div className="mt-10">
          <Marquee />
        </div>
      </section>

      <section className="container-x py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <p className="eyebrow">{h.insightsEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{h.insightsTitle}</h2>
          </Reveal>
          <Link href={href(locale, "/insights")} className="btn-ghost">
            {h.allInsights}
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {t.insights.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <InsightCard post={p} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>

      <CTA locale={locale} />
    </>
  );
}
