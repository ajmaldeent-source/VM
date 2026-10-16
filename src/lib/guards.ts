import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { authOptions, missingAuthConfig } from "./auth";
import { can, isStaff, roleFor, type Permission, type Role, type StaffRole } from "./roles";

export type CurrentUser = { name: string; email: string; image?: string | null; role: Role };

/** The signed-in user with a freshly computed role, or null. */
export async function currentUser(): Promise<CurrentUser | null> {
  if (missingAuthConfig.length > 0) return null;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const role = roleFor(email);
  if (!email || !role) return null;
  return { name: session.user?.name ?? email, email, image: session.user?.image, role };
}

/**
 * Staff area guard (/admin). Signed-out visitors go to the staff login; signed-in
 * consumers are refused; staff without the permission are sent back to the dashboard.
 */
export async function requireStaff(permission: Permission = "dashboard:view") {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  if (!isStaff(user.role)) redirect("/admin/login?error=NotStaff");
  if (!can(user.role, permission)) redirect("/admin?denied=1");
  return user as CurrentUser & { role: StaffRole };
}

/** Consumer area guard (/{locale}/account). Any signed-in user may open their own account. */
export async function requireAccount(locale: Locale) {
  const user = await currentUser();
  if (!user) redirect(`/${locale}/account/login`);
  return user;
}
