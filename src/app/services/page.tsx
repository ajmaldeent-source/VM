import type { Metadata } from "next";
import CTA from "@/components/CTA";
import PageHero from "@/components/PageHero";
import ServiceGrid from "@/components/ServiceGrid";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Scope of supply"
        intro="Mechanical, instrumentation and engineering services backed by a local workshop."
      />
      <section className="container-x pb-8">
        <ServiceGrid />
      </section>
      <CTA />
    </>
  );
}
