"use client";

import { useEffect, useState } from "react";

/** Two-step submit button for destructive actions (no browser confirm dialogs). */
export default function ConfirmButton({ label, confirmLabel }: { label: string; confirmLabel: string }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      type={armed ? "submit" : "button"}
      onClick={() => !armed && setArmed(true)}
      className={`btn !px-4 !py-2 ${armed ? "bg-red-600 text-white hover:bg-red-700" : "border border-red-500/50 text-red-600 hover:bg-red-500/10 dark:text-red-400"}`}
    >
      {armed ? confirmLabel : label}
    </button>
  );
}
