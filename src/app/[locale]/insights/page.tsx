import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getDictionary } from "@/content";
import { isLocale } from "@/i18n/config";
import { pageLocale, type LocaleParams } from "@/i18n/server";
import InsightsList from "./InsightsList";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.insights } : {};
}

export default async function InsightsPage({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const p = getDictionary(locale).ui.insightsPage;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <section className="container-x pb-24">
        <InsightsList locale={locale} />
      </section>
    </>
  );
}
