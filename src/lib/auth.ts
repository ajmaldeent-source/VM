import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/** Missing settings, so the login pages can explain what to configure instead of erroring. */
export const missingAuthConfig = (["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "NEXTAUTH_SECRET"] as const).filter(
  (k) => !process.env[k],
);

// One identity provider (Google) for everyone. Signing in only proves WHO someone is;
// WHAT they may access is decided per request by src/lib/roles.ts and src/lib/guards.ts.
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  // Google errors (e.g. a cancelled sign-in) go to the customer page, since customers are
  // the larger group; the middleware adds the visitor's language. Staff use /admin/login.
  pages: { signIn: "/admin/login", error: "/account/login" },
  callbacks: {
    // Any verified Google account may sign in. Access is enforced by the area guards.
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      return (profile as { email_verified?: boolean } | undefined)?.email_verified === true && Boolean(profile?.email);
    },
  },
};
