"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { services } from "@/content/site";
import { enquiryTypes, validate, type Enquiry, type EnquiryErrors } from "@/lib/enquiry";

const steps: { title: string; fields: (keyof Enquiry)[] }[] = [
  { title: "Enquiry", fields: ["type", "service"] },
  { title: "Your details", fields: ["name", "company", "email", "phone"] },
  { title: "Message", fields: ["message"] },
];

const empty: Enquiry = { type: "", service: "", name: "", company: "", email: "", phone: "", message: "" };

export default function ContactForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Enquiry>(empty);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof Enquiry) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setData((d) => ({ ...d, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const focusFirstError = (errs: EnquiryErrors) => {
    const first = Object.keys(errs)[0];
    if (first) requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
  };

  const next = () => {
    const errs = validate(data, steps[step].fields);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    setStep((s) => s + 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) return next();

    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const firstStep = steps.findIndex((s) => s.fields.some((f) => errs[f]));
      setStep(firstStep);
      return focusFirstError(errs);
    }

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: honeypot.current?.value ?? "" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error || "Please check the highlighted fields.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="glass p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-2xl text-emerald-500">✓</div>
        <h2 className="mt-6 text-2xl font-bold">Thank you, {data.name.split(" ")[0]}</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Your enquiry has been received. Our team will be in touch shortly.</p>
        <button type="button" className="btn-ghost mt-8" onClick={() => { setData(empty); setStep(0); setStatus("idle"); }}>
          Send another enquiry
        </button>
      </div>
    );
  }

  const fieldError = (k: keyof Enquiry) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors[k]}</p>
    ) : null;
  const aria = (k: keyof Enquiry) => ({
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="glass p-6 sm:p-10">
      <ol className="flex gap-2" aria-label="Form progress">
        {steps.map((s, i) => (
          <li key={s.title} className="flex-1" aria-current={i === step ? "step" : undefined}>
            <div className={`h-1 rounded-full transition ${i <= step ? "bg-safety-500" : "bg-slate-200 dark:bg-white/10"}`} />
            <p className={`mt-2 text-xs font-medium ${i === step ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
              {i + 1}. {s.title}
            </p>
          </li>
        ))}
      </ol>

      {/* Honeypot field, hidden from users and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>Website <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <AnimatePresence mode="wait">
        <motion.fieldset
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="mt-8 space-y-5"
        >
          <legend className="sr-only">{steps[step].title}</legend>

          {step === 0 && (
            <>
              <div>
                <span id="type-label" className="mb-2 block text-sm font-medium">What can we help with? *</span>
                <div role="radiogroup" aria-labelledby="type-label" className="grid gap-2 sm:grid-cols-2">
                  {enquiryTypes.map((t) => (
                    <label
                      key={t}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                        data.type === t ? "border-safety-500 bg-safety-500/10" : "border-slate-300 dark:border-white/15"
                      }`}
                    >
                      <input type="radio" name="type" value={t} checked={data.type === t} onChange={set("type")} className="accent-safety-500" {...aria("type")} />
                      {t}
                    </label>
                  ))}
                </div>
                {fieldError("type")}
              </div>
              <div>
                <label htmlFor="service" className="mb-2 block text-sm font-medium">Related service</label>
                <select id="service" name="service" value={data.service} onChange={set("service")} className="field">
                  <option value="">Not sure / general</option>
                  {services.map((s) => <option key={s.slug}>{s.title}</option>)}
                </select>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              {([
                ["name", "Full name *", "text", "name"],
                ["company", "Company", "text", "organization"],
                ["email", "Work email *", "email", "email"],
                ["phone", "Phone", "tel", "tel"],
              ] as const).map(([k, label, type, ac]) => (
                <div key={k}>
                  <label htmlFor={k} className="mb-2 block text-sm font-medium">{label}</label>
                  <input id={k} name={k} type={type} autoComplete={ac} value={data[k]} onChange={set(k)} className="field" {...aria(k)} />
                  {fieldError(k)}
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium">Requirement details *</label>
              <textarea
                id="message" name="message" rows={6} value={data.message} onChange={set("message")}
                placeholder="Specification, quantities, delivery location, timeline…"
                className="field" {...aria("message")}
              />
              {fieldError("message")}
            </div>
          )}
        </motion.fieldset>
      </AnimatePresence>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{serverError}</p>
      )}

      <div className="mt-8 flex justify-between gap-3">
        <button type="button" onClick={() => setStep((s) => s - 1)} className={`btn-ghost ${step === 0 ? "invisible" : ""}`}>
          Back
        </button>
        <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
          {step < steps.length - 1 ? "Continue" : status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
