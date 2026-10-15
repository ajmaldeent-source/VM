import type { Metadata } from "next";
import { fontVars } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Saja Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontVars} dark`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
