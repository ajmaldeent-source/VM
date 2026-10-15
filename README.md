# Saja — Website POC

A working prototype of the redesigned website for Saja General Trading & Contracting Est.
It covers the dynamic home page, services, insights, and the multi-step contact form described in the POC document.

> All copy, figures, contact details and client names are **placeholders** pending client approval.
> No text or assets were copied from the existing sajakw.com site.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3 (class-based dark/light mode)
- Framer Motion (scroll reveals, counters, form transitions, pointer-tilt hero)
- Local structured content in `src/content/site.ts` (stand-in for the headless CMS)

## Getting started

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

Copy `.env.example` to `.env.local` to set optional variables.

## Pages

| Route | Contents |
| --- | --- |
| `/` | Hero, stats counters, scope-of-supply grid, client marquee, latest insights, CTA |
| `/about` | Company intro, values, milestones timeline |
| `/services` | Service grid |
| `/services/[slug]` | Capabilities, expandable specs, brochure slot, related services |
| `/insights` | Articles with animated category filter |
| `/contact` | 3-step enquiry form, map placeholder, contact details |
| `POST /api/enquiry` | Validates and sanitizes enquiries; honeypot + per-IP rate limit; forwards to `ENQUIRY_WEBHOOK_URL` if set |

## Deliberate POC simplifications

| POC item | Prototype status | Production follow-up |
| --- | --- | --- |
| WebGL/3D hero | Animated SVG valve schematic with pointer tilt | React Three Fiber scene once 3D assets are approved |
| Mapbox dark map | Styled SVG placeholder | Mapbox GL with access token and confirmed coordinates |
| Headless CMS | Typed local content file | Sanity/Strapi schema mirroring `src/content/site.ts` |
| CRM routing | Generic webhook via env var | HubSpot/Salesforce integration |
| Arabic / RTL | Not implemented | i18n routing + `dir="rtl"` layouts |
| PDF brochures | Disabled "pending" button | CMS-managed file assets |
| Client logos | Text names in marquee | Authorized logo files |
| Analytics (GA4/Hotjar) | Not included | Add after cookie/consent policy is agreed |

## Deployment

Staging and production need Node.js 20+ and a host that terminates HTTPS.

**Vercel (simplest):** import the Git repo, keep the default Next.js settings, and set `ENQUIRY_WEBHOOK_URL` under
Environment Variables. Preview deployments can serve as the staging environment.

**Any Node host / VM:**

```bash
npm ci
npm run build
PORT=3000 npm start          # run behind a reverse proxy (nginx/Caddy) that handles HTTPS
```

Security headers (HSTS, nosniff, frame denial, referrer and permissions policies) are set in `next.config.mjs`.
The enquiry rate limit is held in memory per instance; use a shared store if running several instances.

Progress against the POC scope, the test cases, and open owner decisions are tracked in
[docs/POC-STATUS.md](docs/POC-STATUS.md).

## Accessibility notes

Skip link, visible focus rings, `aria-current` navigation, labelled form fields with linked error messages,
focus moves to the first invalid field, and `prefers-reduced-motion` disables motion.
