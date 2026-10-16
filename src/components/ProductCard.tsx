import Link from "next/link";
import { getDictionary, type Product } from "@/content";
import { href, type Locale } from "@/i18n/config";

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Link
      href={href(locale, `/products/${product.slug}`)}
      className="glass group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-safety-500/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute start-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {t.productCategories[product.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{product.summary}</p>
        <span className="mt-4 text-sm font-semibold text-safety-600 dark:text-safety-400">
          {t.ui.productsPage.viewProduct}{" "}
          <span aria-hidden className="inline-block transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
