import type { Metadata } from "next";
import InsightsList from "./InsightsList";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Insights" };

export default function InsightsPage() {
  return (
    <>
      <PageHero eyebrow="Insights" title="News, audits and case studies" intro="Placeholder articles — to be managed in the CMS." />
      <section className="container-x pb-24">
        <InsightsList />
      </section>
    </>
  );
}
