import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import LocationMap from "./LocationMap";
import PageHero from "@/components/PageHero";
import { company } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your project" intro="Tell us what you need and the right team will get back to you." />
      <section className="container-x grid gap-8 pb-24 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <div className="space-y-5 lg:col-span-2">
          <LocationMap />
          <div className="glass p-6">
            <h2 className="text-lg font-semibold">Head office & workshop</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Address", company.contact.address],
                ["Phone", company.contact.phone],
                ["Email", company.contact.email],
                ["Hours", company.contact.hours],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <dt className="w-20 shrink-0 text-slate-500">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
