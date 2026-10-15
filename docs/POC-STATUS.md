# POC Status — Traceability to the Scope Proposal (15 Oct 2026)

Status key: ✅ done in prototype · 🟡 partly done / placeholder · ⏳ waiting on client or staging · ⛔ out of scope unless approved

## §3 Proposed POC scope

| Area | Status | Notes |
| --- | --- | --- |
| Visual design | 🟡 | Header, footer, type scale, colors, spacing and responsive layouts built. The design is an original direction, not a visual copy of the current site. "Compare against agreed reference screenshots" waits on the owner agreeing which screenshots. |
| Pages and navigation | 🟡 | Home, About, Services (+4 detail pages), Insights, Contact, 404. All menu items route correctly (checked: 200s, unknown service → 404). The final page list must be confirmed in discovery. |
| Content and media | ⏳ | All copy, figures, contact details and client names are placeholders in `src/content/site.ts`. No images or logos used. Owner must supply approved assets. |
| Forms | ✅ | 3-step enquiry form; client + server validation from one shared module; success/error states; honeypot + per-IP rate limit (5 per 10 min). |
| Business functions | ⏳ | Only the enquiry workflow is built. No other functions confirmed. |
| Administration | ⛔ | No CMS/admin. Content is a typed local file, ready to map to a CMS if required. |
| Deployment | ⏳ | Production build passes; deployment steps in README. No staging URL yet. |

## §6 Security, accessibility and quality

| Item | Status | Notes |
| --- | --- | --- |
| HTTPS in staging/production | ⏳ | Depends on host. HSTS header already set in `next.config.mjs`. |
| Validate and sanitize form data | ✅ | `src/lib/enquiry.ts`: trims, strips control chars, length limits, field rules. Re-validated on the server. |
| Secrets outside source code | ✅ | Only `ENQUIRY_WEBHOOK_URL`, read from env; `.env*` git-ignored; `.env.example` documents it. |
| Least-privilege admin access | ⛔ | No admin functions in the POC. |
| Optimize images / avoid large assets | ✅ | No raster images; inline SVG only. First-load JS ≈ 145–153 kB per page. |
| Keyboard, labels, contrast, responsive | 🟡 | Skip link, focus rings, labelled fields with linked errors, `aria-current`, reduced-motion support. A manual contrast and device check is still needed. |
| Major desktop/mobile browsers | ⏳ | Not yet tested in real browsers; scheduled for Phase 4. |
| Analytics, SEO, cookies, privacy | 🟡 | Basic page titles/descriptions only. No analytics or cookies set, so no consent banner is needed yet. |

## §8 Acceptance criteria

| Criterion | Status |
| --- | --- |
| Agreed POC pages available on staging URL | ⏳ Needs hosting decision |
| Layouts work at desktop, tablet, mobile widths | 🟡 Built responsive; needs device sign-off |
| Navigation and agreed journeys work as documented | ✅ for current pages and enquiry journey |
| Forms and dynamic features pass agreed test cases | ✅ see test cases below |
| No critical/high defects open | ✅ none known |
| Owner approves prototype and next-phase scope | ⏳ |
| Source code and deployment instructions handed over | 🟡 Repo + README ready; handover at Phase 5 |

### Enquiry test cases (run against `next start`)

| # | Case | Expected | Result |
| --- | --- | --- | --- |
| 1 | Valid enquiry | 200 `{ok:true}` | ✅ |
| 2 | Invalid type/name/email/short message | 422 with per-field errors | ✅ |
| 3 | Malformed JSON body | 400 | ✅ |
| 4 | More than 5 requests in 10 min from one IP | 429 | ✅ |
| 5 | Honeypot field filled | 200, silently dropped | ✅ (by design) |
| 6 | Webhook configured but failing | 502 with retry message | Not yet run; needs a test endpoint |

## §11 Decisions required before build — open questions for the owner

- [ ] Exact pages and features to keep from the current site
- [ ] Site type: informational (assumed in the prototype), catalogue, or transactional
- [ ] Languages: is Arabic required? Right-to-left layout? (not built yet)
- [ ] Workflows: enquiry only (built), or also accounts / payments / booking (excluded)
- [ ] CMS needed? Who edits content and who approves publishing?
- [ ] Hosting preference, staging environment, domain ownership/DNS access
- [ ] Where enquiries should go: email, CRM, or webhook
- [ ] Approved logos, fonts, images, page text, brand guidelines
- [ ] Confirmation and logo rights for any client names shown (currently KOC, KNPC as text)
- [ ] Official address, phone, email and opening hours
