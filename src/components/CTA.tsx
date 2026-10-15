import Link from "next/link";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="container-x py-24">
      <Reveal>
        <div className="noise relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-16 text-center text-white sm:px-16">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,106,0,0.35),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Have a requirement or tender?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Send us your specification and our team will respond with availability, lead time and a quotation.
            </p>
            <Link href="/contact" className="btn-primary mt-8">
              Start an enquiry <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
