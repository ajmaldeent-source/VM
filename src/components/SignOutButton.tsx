"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton({ callbackUrl = "/admin/login", label = "Sign out" }: { callbackUrl?: string; label?: string }) {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl })} className="btn-ghost !px-4 !py-2">
      {label}
    </button>
  );
}
