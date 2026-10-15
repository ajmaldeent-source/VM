export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");
export const dateLocale = (l: Locale) => (l === "ar" ? "ar-KW-u-nu-latn" : "en-GB");

/** Prefix an internal path with the locale: href("ar", "/services") -> "/ar/services". */
export const href = (l: Locale, path: string) => `/${l}${path === "/" ? "" : path}`;
