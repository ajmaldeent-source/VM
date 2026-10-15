import type { Metadata } from "next";
import CTA from "@/components/CTA";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import { company, sectors } from "@/content/site";

export const metadata: Metadata = { title: "About" };

const values = [
  { title: "Reliability", body: "Placeholder: consistent delivery against specification and schedule." },
  { title: "Compliance", body: "Placeholder: documentation, audits and quality systems clients can verify." },
  { title: "Local support", body: "Placeholder: a Kuwait-based team and workshop close to client sites." },
];

const timeline = [
  { year: String(company.founded), text: "Company established in Kuwait." },
  { year: "—", text: "Placeholder milestone: confirm with client." },
  { year: "—", text: "Placeholder milestone: workshop facility opened." },
  { year: "2026", text: "New digital platform launched." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`${new Date().getFullYear() - company.founded}+ years supporting Kuwait's industry`}
        intro={`${company.name} serves the ${sectors.join(", ")} sectors. Full company profile to be supplied by the client.`}
      />
      <section className="container-x">
        <Stats />
      </section>
      <section className="container-x grid gap-5 py-24 md:grid-cols-3">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.08}>
            <div className="glass h-full p-8">
              <h2 className="text-xl font-semibold">{v.title}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{v.body}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="container-x pb-8">
        <Reveal>
          <p className="eyebrow">Our journey</p>
          <h2 className="mt-3 text-3xl font-bold">Milestones</h2>
        </Reveal>
        <ol className="mt-10 border-l border-slate-300 dark:border-white/15">
          {timeline.map((t, i) => (
            <li key={i} className="relative pb-10 pl-8">
              <span aria-hidden className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-safety-500" />
              <p className="font-display text-lg font-semibold text-safety-600 dark:text-safety-400">{t.year}</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <CTA />
    </>
  );
}
