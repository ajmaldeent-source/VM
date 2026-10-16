// Single source of truth for who can do what.
//
// Roles are derived from the signed-in Google email on EVERY request (never trusted from
// the session cookie), so changing an allowlist takes effect immediately.
//
//   admin      ADMIN_EMAILS      — business owners: content, users, settings
//   developer  DEVELOPER_EMAILS  — technical staff: diagnostics and configuration, no user management
//   consumer   anyone else       — website visitors with a customer account

export type Role = "admin" | "developer" | "consumer";
export type StaffRole = Exclude<Role, "consumer">;

export const permissions = {
  "dashboard:view": ["admin", "developer"],
  "content:view": ["admin", "developer"],
  "users:view": ["admin"],
  "devtools:view": ["admin", "developer"],
  // Enquiries hold customers' personal data, so only admins see or change them.
  "enquiries:view": ["admin"],
  "enquiries:manage": ["admin"],
  "account:view": ["admin", "developer", "consumer"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof permissions;

const list = (v?: string) =>
  (v ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const allowlists = {
  admin: list(process.env.ADMIN_EMAILS),
  developer: list(process.env.DEVELOPER_EMAILS),
};

/** Admin wins if an email appears on both lists. */
export function roleFor(email?: string | null): Role | null {
  if (!email) return null;
  const e = email.toLowerCase();
  if (allowlists.admin.includes(e)) return "admin";
  if (allowlists.developer.includes(e)) return "developer";
  return "consumer";
}

export const isStaff = (role: Role | null): role is StaffRole => role === "admin" || role === "developer";

export const can = (role: Role | null, permission: Permission) =>
  role !== null && (permissions[permission] as readonly Role[]).includes(role);
