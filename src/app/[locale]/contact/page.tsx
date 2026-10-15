import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getDictionary } from "@/content";
import { isLocale } from "@/i18n/config";
import { pageLocale, type LocaleParams } from "@/i18n/server";
import ContactForm from "./ContactForm";
import LocationMap from "./LocationMap";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.contact } : {};
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const t = getDictionary(locale);
  const c = t.ui.contactPage;
  const rows: [string, string, boolean][] = [
    [c.labels.address, t.company.contact.address, false],
    [c.labels.phone, t.company.contact.phone, true],
    [c.labels.email, t.company.contact.email, true],
    [c.labels.hours, t.company.contact.hours, false],
  ];

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
      <section className="container-x grid gap-8 pb-24 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm locale={locale} />
        </div>
        <div className="space-y-5 lg:col-span-2">
          <LocationMap label={c.mapLabel} caption={c.mapCaption} />
          <div className="glass p-6">
            <h2 className="text-lg font-semibold">{c.officeTitle}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {rows.map(([k, v, ltr]) => (
                <div key={k} className="flex gap-4">
                  <dt className="w-24 shrink-0 text-slate-500">{k}</dt>
                  <dd dir={ltr ? "ltr" : undefined}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
