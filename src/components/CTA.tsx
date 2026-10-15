import Link from "next/link";
import { getDictionary } from "@/content";
import { href, type Locale } from "@/i18n/config";
import Reveal from "./Reveal";

export default function CTA({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).ui.cta;
  return (
    <section className="container-x py-24">
      <Reveal>
        <div className="noise relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-16 text-center text-white sm:px-16">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,106,0,0.35),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">{t.body}</p>
            <Link href={href(locale, "/contact")} className="btn-primary mt-8">
              {t.button} <span aria-hidden className="rtl:rotate-180">→</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
