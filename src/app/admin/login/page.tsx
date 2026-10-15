import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdmin, missingAuthConfig } from "@/lib/auth";
import GoogleButton from "./GoogleButton";

export const metadata: Metadata = { title: "Sign in" };

const errorText: Record<string, string> = {
  AccessDenied: "This Google account is not authorised for the admin area. Ask an administrator to add it.",
  OAuthCallback: "Google sign-in was cancelled or failed. Please try again.",
  Default: "Sign-in failed. Please try again.",
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const configured = missingAuthConfig.length === 0;

  if (configured) {
    const session = await getServerSession(authOptions);
    if (isAdmin(session?.user?.email)) redirect("/admin");
  }

  return (
    <main className="noise relative grid min-h-screen place-items-center bg-ink-950 px-4 text-white">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,106,0,0.18),transparent_60%)]" />
      <div className="glass relative w-full max-w-sm p-8 text-center">
        <span aria-hidden className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-safety-500 font-display text-xl font-bold">
          S
        </span>
        <h1 className="mt-5 text-2xl font-bold">Saja Admin</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in with your authorised Google account.</p>

        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-start text-sm text-red-300">
            {errorText[error] ?? errorText.Default}
          </p>
        )}

        {configured ? (
          <GoogleButton />
        ) : (
          <div className="mt-6 rounded-xl bg-amber-500/10 px-4 py-3 text-start text-sm text-amber-200">
            <p className="font-semibold">Google sign-in is not configured yet.</p>
            <p className="mt-1">Set these environment variables on the host:</p>
            <ul className="mt-2 list-disc ps-5 font-mono text-xs">
              {missingAuthConfig.map((k) => <li key={k}>{k}</li>)}
            </ul>
          </div>
        )}

        <a href="/" className="mt-6 inline-block text-sm text-slate-400 hover:text-white">← Back to website</a>
      </div>
    </main>
  );
}
