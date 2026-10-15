// Shared enquiry validation used by the contact form (client) and /api/enquiry (server).
// Errors are returned as codes so each language can show its own message.
import type { EnquiryErrorCode } from "@/content/types";

export const enquiryTypes = ["quote", "technical", "partnership", "careers", "other"] as const;

export type Enquiry = {
  type: string;
  service: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  locale: string;
};

export type EnquiryErrors = Partial<Record<keyof Enquiry, EnquiryErrorCode>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s()-]{6,19}$/;

const limits: Record<keyof Enquiry, number> = {
  type: 40, service: 60, name: 100, company: 120, email: 160, phone: 25, message: 3000, locale: 5,
};

/** Trims, strips control characters and enforces max lengths. */
export function sanitize(input: Record<string, unknown>): Enquiry {
  const clean = (k: keyof Enquiry) =>
    String(input[k] ?? "")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .trim()
      .slice(0, limits[k]);
  return {
    type: clean("type"), service: clean("service"), name: clean("name"), company: clean("company"),
    email: clean("email"), phone: clean("phone"), message: clean("message"), locale: clean("locale"),
  };
}

export function validate(e: Enquiry, fields: (keyof Enquiry)[] = Object.keys(limits) as (keyof Enquiry)[]): EnquiryErrors {
  const errors: EnquiryErrors = {};
  for (const f of fields) {
    switch (f) {
      case "type":
        if (!enquiryTypes.includes(e.type as (typeof enquiryTypes)[number])) errors.type = "type_required";
        break;
      case "name":
        if (e.name.length < 2) errors.name = "name_required";
        break;
      case "email":
        if (!EMAIL.test(e.email)) errors.email = "email_invalid";
        break;
      case "phone":
        if (e.phone && !PHONE.test(e.phone)) errors.phone = "phone_invalid";
        break;
      case "message":
        if (e.message.length < 10) errors.message = "message_short";
        break;
    }
  }
  return errors;
}
