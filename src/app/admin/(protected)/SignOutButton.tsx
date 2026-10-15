"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })} className="btn-ghost !px-4 !py-2">
      Sign out
    </button>
  );
}
