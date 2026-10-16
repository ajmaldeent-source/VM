import type { EnquiryStatus } from "@/lib/enquiryStore";

export const statusLabel: Record<EnquiryStatus, string> = { new: "New", in_progress: "In progress", closed: "Closed" };

export const statusStyle: Record<EnquiryStatus, string> = {
  new: "bg-safety-500/15 text-safety-600 dark:text-safety-400",
  in_progress: "bg-volt-500/15 text-volt-500",
  closed: "bg-slate-500/15 text-slate-500",
};
