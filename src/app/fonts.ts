import { IBM_Plex_Sans_Arabic, Inter, Space_Grotesk } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
// Latin fonts have no Arabic glyphs, so the browser falls through to this face for Arabic text.
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const fontVars = `${display.variable} ${body.variable} ${arabic.variable}`;
