import type { Metadata } from "next";
import CTA from "@/components/CTA";
import PageHero from "@/components/PageHero";
import { getDictionary } from "@/content";
import { isLocale } from "@/i18n/config";
import { pageLocale, type LocaleParams } from "@/i18n/server";
import ProductList from "./ProductList";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.products } : {};
}

export default async function ProductsPage({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const p = getDictionary(locale).ui.productsPage;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <section className="container-x pb-8">
        <ProductList locale={locale} />
      </section>
      <CTA locale={locale} />
    </>
  );
}
