import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { themeScript } from "@/components/themeScript";
import { getDictionary } from "@/content";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { fontVars } from "../fonts";
import "../globals.css";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: { default: `${t.company.shortName} — ${t.company.tagline}`, template: `%s | ${t.company.shortName}` },
    description: t.company.intro,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}


export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${fontVars} dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 btn-primary">
          {t.ui.skipToContent}
        </a>
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
