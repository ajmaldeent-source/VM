import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/** Comma-separated allowlist of Google accounts that may open the admin area. */
export const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/** Missing settings, so the login page can explain what to configure instead of erroring. */
export const missingAuthConfig = (
  ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "NEXTAUTH_SECRET", "ADMIN_EMAILS"] as const
).filter((k) => !process.env[k]);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    // Least privilege: only verified Google accounts on the allowlist get in.
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const email = profile?.email?.toLowerCase();
      const verified = (profile as { email_verified?: boolean } | undefined)?.email_verified === true;
      return Boolean(email && verified && adminEmails.includes(email));
    },
  },
};

/** Re-checks the allowlist on every request, so removing an email revokes access immediately. */
export const isAdmin = (email?: string | null) => Boolean(email && adminEmails.includes(email.toLowerCase()));
