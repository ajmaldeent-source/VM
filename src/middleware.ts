import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

// Sends any public URL without a language prefix to /en/... or /ar/...,
// using the visitor's saved choice, then their browser language.
function preferredLocale(req: NextRequest): Locale {
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  if (saved && isLocale(saved)) return saved;
  const accept = req.headers.get("accept-language") ?? "";
  return /^\s*ar\b/i.test(accept) ? "ar" : defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];

  if (isLocale(first)) {
    // Tell server components (incl. the 404 page) which language is active,
    // and remember it for the next visit.
    const headers = new Headers(req.headers);
    headers.set("x-locale", first);
    const res = NextResponse.next({ request: { headers } });
    if (req.cookies.get("NEXT_LOCALE")?.value !== first) {
      res.cookies.set("NEXT_LOCALE", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip the API, admin area, Next.js internals and files with an extension.
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
