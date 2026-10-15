import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Resolves the [locale] route param, 404ing on anything that isn't a supported language. */
export async function pageLocale(params: LocaleParams["params"]): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
