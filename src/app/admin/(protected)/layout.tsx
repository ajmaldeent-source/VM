import Link from "next/link";
import { requireStaff } from "@/lib/guards";
import { can, type Permission } from "@/lib/roles";
import SignOutButton from "@/components/SignOutButton";

const sections: { href: string; label: string; permission: Permission }[] = [
  { href: "/admin", label: "Dashboard", permission: "dashboard:view" },
  { href: "/admin/users", label: "Users & roles", permission: "users:view" },
  { href: "/admin/developer", label: "Developer tools", permission: "devtools:view" },
];

// Every page in this group requires a staff role (admin or developer).
export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  const visible = sections.filter((s) => can(user.role, s.permission));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/80">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3">
              <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-safety-500 font-display font-bold text-white">S</span>
              <span className="font-display font-semibold text-slate-900 dark:text-white">Saja Staff</span>
            </Link>
            <nav aria-label="Staff" className="hidden gap-1 md:flex">
              {visible.map((s) => (
                <Link key={s.href} href={s.href} className="rounded-full px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10">
                  {s.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-end sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-500">
                {user.email} · <span className="font-semibold capitalize text-safety-600 dark:text-safety-400">{user.role}</span>
              </p>
            </div>
            {user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" width={32} height={32} referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" />
            )}
            <SignOutButton />
          </div>
        </div>
        <nav aria-label="Staff mobile" className="container-x flex gap-1 overflow-x-auto pb-2 md:hidden">
          {visible.map((s) => (
            <Link key={s.href} href={s.href} className="shrink-0 rounded-full px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300">
              {s.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="container-x py-10">{children}</main>
    </div>
  );
}
