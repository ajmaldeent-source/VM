import Link from "next/link";
import { headers } from "next/headers";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { themeScript } from "@/components/themeScript";
import { getDictionary } from "@/content";
import { defaultLocale, dirOf, href, isLocale } from "@/i18n/config";
import { fontVars } from "./fonts";
import "./globals.css";

// Handles every 404 (Next.js routes notFound() here because the real root layouts sit
// below app/). The middleware passes the visitor's language in the x-locale header.
export default async function NotFound() {
  const requested = (await headers()).get("x-locale") ?? "";
  const locale = isLocale(requested) ? requested : defaultLocale;
  const t = getDictionary(locale).ui.notFound;

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${fontVars} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        <Header locale={locale} />
        <main id="main" className="container-x grid min-h-[70vh] place-items-center pt-24 text-center">
          <div>
            <p className="eyebrow">404</p>
            <h1 className="mt-3 text-4xl font-bold">{t.title}</h1>
            <Link href={href(locale, "/")} className="btn-primary mt-8">{t.back}</Link>
          </div>
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
