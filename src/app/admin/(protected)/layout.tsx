import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdmin, missingAuthConfig } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

// Every page in this group requires an allowlisted Google session.
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (missingAuthConfig.length > 0) redirect("/admin/login");
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) redirect("/admin/login");
  const user = session!.user!;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/80">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-safety-500 font-display font-bold text-white">S</span>
            <span className="font-display font-semibold text-slate-900 dark:text-white">Saja Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-end sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            {user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" width={32} height={32} referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" />
            )}
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="container-x py-10">{children}</main>
    </div>
  );
}
