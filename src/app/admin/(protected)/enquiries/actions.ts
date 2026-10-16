"use server";

import { revalidatePath } from "next/cache";
import { enquiryStatuses, setEnquiryStatus, type EnquiryStatus } from "@/lib/enquiryStore";
import { requireStaff } from "@/lib/guards";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Server actions are public endpoints, so the permission is checked here too, not just on the page.
export async function updateEnquiryStatus(formData: FormData) {
  await requireStaff("enquiries:manage");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as EnquiryStatus;
  if (!UUID.test(id) || !enquiryStatuses.includes(status)) return;
  await setEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
