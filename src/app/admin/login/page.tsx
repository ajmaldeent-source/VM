import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/guards";
import { missingAuthConfig } from "@/lib/auth";
import { isStaff } from "@/lib/roles";
import GoogleButton from "@/components/GoogleButton";
import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = { title: "Staff sign-in" };

const errorText: Record<string, string> = {
  NotStaff: "This Google account is a customer account, not a staff account. Sign out and use your staff Google account.",
  AccessDenied: "Google sign-in was refused. Use a verified Google account.",
  OAuthCallback: "Google sign-in was cancelled or failed. Please try again.",
  Default: "Sign-in failed. Please try again.",
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function StaffLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const configured = missingAuthConfig.length === 0;
  const user = await currentUser();
  if (user && isStaff(user.role)) redirect("/admin");

  return (
    <main className="noise relative grid min-h-screen place-items-center bg-ink-950 px-4 text-white">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,106,0,0.18),transparent_60%)]" />
      <div className="glass relative w-full max-w-sm p-8 text-center">
        <span aria-hidden className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-safety-500 font-display text-xl font-bold">S</span>
        <h1 className="mt-5 text-2xl font-bold">Staff sign-in</h1>
        <p className="mt-2 text-sm text-slate-400">For Saja administrators and developers only.</p>

        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-start text-sm text-red-300">
            {errorText[error] ?? errorText.Default}
          </p>
        )}

        {!configured ? (
          <div className="mt-6 rounded-xl bg-amber-500/10 px-4 py-3 text-start text-sm text-amber-200">
            <p className="font-semibold">Google sign-in is not configured yet.</p>
            <p className="mt-1">Set these environment variables on the host:</p>
            <ul className="mt-2 list-disc ps-5 font-mono text-xs">
              {missingAuthConfig.map((k) => <li key={k}>{k}</li>)}
            </ul>
          </div>
        ) : user ? (
          // Signed in, but as a customer: offer to switch accounts.
          <div className="mt-6 space-y-3 text-sm">
            <p className="text-slate-300">Signed in as <strong>{user.email}</strong> (customer).</p>
            <SignOutButton callbackUrl="/admin/login" />
          </div>
        ) : (
          <GoogleButton callbackUrl="/admin" label="Continue with Google" />
        )}

        <a href="/" className="mt-6 inline-block text-sm text-slate-400 hover:text-white">← Back to website</a>
      </div>
    </main>
  );
}
