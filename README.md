# Saja — Website POC

A working prototype of the redesigned website for Saja General Trading & Contracting Est.
It covers the dynamic home page, services, insights, and the multi-step contact form described in the POC document.

> All copy, figures, contact details and client names are **placeholders** pending client approval.
> No text or assets were copied from the existing sajakw.com site.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3 (class-based dark/light mode)
- Framer Motion (scroll reveals, counters, form transitions, pointer-tilt hero)
- English + Arabic (RTL) dictionaries in `src/content/en.ts` / `ar.ts` (stand-in for the headless CMS)
- NextAuth v4 with Google sign-in for the admin area

## Getting started

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

Copy `.env.example` to `.env.local` to set optional variables.

## Pages

Public pages exist in both languages: `/en/...` (left-to-right) and `/ar/...` (right-to-left, IBM Plex Sans Arabic).
`/` and any URL without a language are redirected by `src/middleware.ts` (saved choice → browser language → English).
The language switch in the menu bar keeps the visitor on the same page.

| Route | Contents |
| --- | --- |
| `/{en,ar}` | Hero, stats counters, scope-of-supply grid, client marquee, latest insights, CTA |
| `/{en,ar}/about` | Company intro, values, milestones timeline |
| `/{en,ar}/services` | Service grid |
| `/{en,ar}/services/[slug]` | Capabilities, expandable specs, brochure slot, related services |
| `/{en,ar}/insights` | Articles with animated category filter |
| `/{en,ar}/contact` | 3-step enquiry form, map placeholder, contact details |
| `/admin` | Admin dashboard (Google sign-in, allowlisted accounts only) |
| `/admin/login` | Google sign-in page; explains which settings are missing if not configured |
| `POST /api/enquiry` | Validates and sanitizes enquiries; honeypot + per-IP rate limit; forwards to `ENQUIRY_WEBHOOK_URL` if set |

Translation text lives in `src/content/`. Both files share the `Dictionary` type, so a key missing in one language
fails the build. The Arabic copy is a draft and must be reviewed by a native speaker before launch.

## Admin sign-in setup (Google)

1. In [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials), create an
   **OAuth client ID** of type *Web application* (configure the OAuth consent screen first if asked).
2. Add the authorized redirect URI: `https://<your-site>/api/auth/callback/google`
   (and `http://localhost:3000/api/auth/callback/google` for local development).
3. Set these environment variables on the host (Netlify: *Site configuration → Environment variables*), then redeploy:

   | Variable | Value |
   | --- | --- |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | From step 1 |
   | `NEXTAUTH_SECRET` | Random string: `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | The site URL, e.g. `https://papaya-vacherin-eb848c.netlify.app` |
   | `ADMIN_EMAILS` | Comma-separated Google accounts allowed in, e.g. `owner@company.com,it@company.com` |

Only verified Google accounts on `ADMIN_EMAILS` can sign in, and the list is re-checked on every admin request,
so removing an address revokes access at once. Sessions last 8 hours.

## Deliberate POC simplifications

| POC item | Prototype status | Production follow-up |
| --- | --- | --- |
| WebGL/3D hero | Animated SVG valve schematic with pointer tilt | React Three Fiber scene once 3D assets are approved |
| Mapbox dark map | Styled SVG placeholder | Mapbox GL with access token and confirmed coordinates |
| Headless CMS | Typed local EN/AR content files; admin dashboard is read-only | Sanity/Strapi (or database) so the admin can edit content |
| CRM routing | Generic webhook via env var | HubSpot/Salesforce integration |
| PDF brochures | Disabled "pending" button | CMS-managed file assets |
| Client logos | Text names in marquee | Authorized logo files |
| 404 page | Localized, but rendered in the browser (Next.js limitation with per-language root layouts) | Revisit on Next.js upgrade |
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
