import type { Metadata } from "next";
import CTA from "@/components/CTA";
import PageHero from "@/components/PageHero";
import ServiceGrid from "@/components/ServiceGrid";
import { getDictionary } from "@/content";
import { isLocale } from "@/i18n/config";
import { pageLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.services } : {};
}

export default async function ServicesPage({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const s = getDictionary(locale).ui.servicesPage;
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} intro={s.intro} />
      <section className="container-x pb-8">
        <ServiceGrid locale={locale} />
      </section>
      <CTA locale={locale} />
    </>
  );
}
