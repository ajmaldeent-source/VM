// The real root layouts live in [locale]/ and admin/ (each sets its own <html lang/dir>).
// This pass-through lets Next.js render not-found pages inside them.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
