import type { Metadata } from "next";
import CTA from "@/components/CTA";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import { founded, getDictionary } from "@/content";
import { isLocale } from "@/i18n/config";
import { pageLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.about } : {};
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const t = getDictionary(locale);
  const a = t.ui.about;

  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title(new Date().getFullYear() - founded)} intro={a.intro} />
      <section className="container-x">
        <Stats stats={t.stats} />
      </section>
      <section className="container-x grid gap-5 py-24 md:grid-cols-3">
        {a.values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.08}>
            <div className="glass h-full p-8">
              <h2 className="text-xl font-semibold">{v.title}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{v.body}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="container-x pb-8">
        <Reveal>
          <p className="eyebrow">{a.journeyEyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold">{a.journeyTitle}</h2>
        </Reveal>
        <ol className="mt-10 border-s border-slate-300 dark:border-white/15">
          {a.timeline.map((item, i) => (
            <li key={i} className="relative pb-10 ps-8">
              <span aria-hidden className="absolute -start-[7px] top-1.5 h-3 w-3 rounded-full bg-safety-500" />
              <p className="font-display text-lg font-semibold text-safety-600 dark:text-safety-400">{item.year}</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <CTA locale={locale} />
    </>
  );
}
