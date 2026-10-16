import type { Locale } from "@/i18n/config";
import ar from "./ar";
import en from "./en";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export const getDictionary = (locale: Locale) => dictionaries[locale];

export const founded = 1979;

// TODO(client): replace with authorized client logos. Names are shown as text
// until usage rights are confirmed. Not translated: these are brand names.
export const clients = ["KOC", "KNPC", "Client 03", "Client 04", "Client 05", "Client 06", "Client 07", "Client 08"];

export type { Dictionary, Insight, Product, ProductCategory, Service, ServiceIcon } from "./types";
