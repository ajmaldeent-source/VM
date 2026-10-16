import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getDictionary } from "@/content";
import { productImage } from "@/content/media";
import { href, isLocale, locales } from "@/i18n/config";
import { pageLocale } from "@/i18n/server";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => getDictionary(locale).products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = getDictionary(locale).products.find((x) => x.slug === slug);
  return p ? { title: p.name, description: p.summary } : {};
}

export default async function ProductPage({ params }: Props) {
  const locale = await pageLocale(params);
  const { slug } = await params;
  const t = getDictionary(locale);
  const pp = t.ui.productPage;
  const product = t.products.find((p) => p.slug === slug);
  if (!product) notFound();
  const related = t.products.filter((p) => p.category === product.category && p.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="container-x pb-16 pt-28 sm:pt-36">
        <Link href={href(locale, "/products")} className="text-sm text-slate-500 hover:text-safety-600 dark:hover:text-safety-400">
          <span aria-hidden className="inline-block rtl:rotate-180">←</span> {pp.back}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <figure className="glass overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={productImage(product.category)} alt={product.name} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="px-5 py-3 text-xs text-slate-500">{pp.placeholderNote}</figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow">{t.productCategories[product.category]}</p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl rtl:leading-tight">{product.name}</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{product.summary}</p>
            <p className="mt-3 text-sm text-slate-500">{product.description}</p>

            <h2 className="mt-8 text-lg font-semibold">{pp.features}</h2>
            <ul className="mt-3 space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-safety-500" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="glass mt-8 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400">{pp.quoteNote}</p>
              <Link href={`${href(locale, "/contact")}?product=${product.slug}`} className="btn-primary mt-4">
                {pp.requestQuote} <span aria-hidden className="rtl:rotate-180">→</span>
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <h2 className="mt-16 text-2xl font-bold">{pp.specs}</h2>
          <div className="glass mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {product.specs.map((s) => (
                  <tr key={s.label}>
                    <th scope="row" className="w-1/3 px-5 py-4 text-start font-medium text-slate-500">{s.label}</th>
                    <td className="px-5 py-4" dir="auto">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {related.length > 0 && (
          <>
            <h2 className="mt-16 text-2xl font-bold">{pp.related}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} locale={locale} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
