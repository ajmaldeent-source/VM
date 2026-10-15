import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTA from "@/components/CTA";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { services } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return s ? { title: s.title, description: s.summary } : {};
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  const others = services.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHero eyebrow="Service" title={service.title} intro={service.description} />

      <section className="container-x grid gap-10 pb-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal>
            <h2 className="text-2xl font-bold">Capabilities</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {service.capabilities.map((c) => (
                <li key={c} className="glass flex items-start gap-3 p-5">
                  <span aria-hidden className="mt-1 h-2 w-2 shrink-0 rounded-full bg-safety-500" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-14 text-2xl font-bold">Technical specifications</h2>
            <div className="mt-6 space-y-3">
              {service.specs.map((sp) => (
                <details key={sp.label} className="glass group p-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    {sp.label}
                    <span aria-hidden className="text-safety-500 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-400">{sp.value}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>

        <aside className="space-y-5">
          <div className="glass p-6">
            <h2 className="text-lg font-semibold">Brochure</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              PDF brochure will be available once the client supplies approved content.
            </p>
            <button type="button" disabled className="btn-ghost mt-4 w-full cursor-not-allowed opacity-60">
              Download PDF (pending)
            </button>
          </div>
          <div className="glass p-6">
            <h2 className="text-lg font-semibold">Other services</h2>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/services/${o.slug}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/5">
                    <Icon name={o.icon} className="h-5 w-5 text-safety-500" />
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
      <CTA />
    </>
  );
}
