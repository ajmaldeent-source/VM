import { NextResponse } from "next/server";
import { sanitize, validate } from "@/lib/enquiry";

// POC rate limit: in-memory, per instance. Replace with a shared store (e.g. Redis) in production.
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Pretend success for bots.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const enquiry = sanitize(body);
  const errors = validate(enquiry);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...enquiry, receivedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("Enquiry forwarding failed", err);
      return NextResponse.json({ ok: false, error: "forward_failed" }, { status: 502 });
    }
  } else {
    console.info("[enquiry] received (no ENQUIRY_WEBHOOK_URL set):", enquiry.type, enquiry.email);
  }

  return NextResponse.json({ ok: true });
}
